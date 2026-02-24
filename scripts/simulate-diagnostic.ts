/**
 * Diagnostic simulation — shows per-generation training count, stats, stage for each CTL pattern
 * Used to calibrate evolution requirements.
 *
 * Runs 3 generations for each pattern, printing detailed per-gen info.
 */

import { createFirstGeneration, createNextGeneration, createMemoryEquipment } from "../src/engine/generation";
import { calculatePmcBonus, determinePmcRank } from "../src/engine/pmc-bonus";
import { calculateDailyDisciplineChange, applyDisciplineChange } from "../src/engine/discipline";
import { calculateWorkoutTp } from "../src/engine/tp-calculator";
import { calculateRideWp, convertWpToEncounters, generateEnemy, generateBoss } from "../src/engine/encounter";
import { canExecuteTraining, executeTraining, applyTrainingResult } from "../src/engine/training";
import { executeBattle } from "../src/engine/battle";
import { rollMealLifespanExtension } from "../src/engine/lifespan";
import { canEvolve, getEvolutionTarget, applyEvolution } from "../src/engine/evolution";
import {
  recordMobKill,
  canChallengeBoss,
  recordBossDefeat,
  getWorldDefinition,
} from "../src/engine/world";
import { TRAINING_MENUS } from "../src/data/training-menus";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import { WP_CONSTANTS } from "../src/types/battle";
import { EvolutionStage } from "../src/types/monster";
import type { MonsterState } from "../src/types/monster";
import type { WorldProgress } from "../src/types/world";
import type { BattleFighter } from "../src/types/battle";
import type { ZoneTime } from "../src/types/training";

const MAX_WORLDS = 10;
const MEALS = 3;

interface PatternConfig {
  name: string;
  ctl: number;
  tsb: number;
  steps: number;
  rides: RidePattern[];
}

interface RidePattern { low: number; mid: number; high: number; label: string }

const ZONE_PER_MIN = {
  low:  { z1: 10, z2: 45, z3: 5,  z4: 0,  z5: 0,  z6: 0,  z7: 0  },
  mid:  { z1: 5,  z2: 10, z3: 30, z4: 15, z5: 0,  z6: 0,  z7: 0  },
  high: { z1: 5,  z2: 5,  z3: 5,  z4: 5,  z5: 15, z6: 15, z7: 10 },
};
const INTENSITY = {
  low:  { tssPerMin: 0.60, kmPerMin: 0.40, elevPerMin: 1.0 },
  mid:  { tssPerMin: 1.05, kmPerMin: 0.47, elevPerMin: 2.5 },
  high: { tssPerMin: 1.50, kmPerMin: 0.50, elevPerMin: 3.0 },
};

// Pattern D: CTL60 ~TSS420/week (4 rides)
const RIDES_D: RidePattern[] = [
  { low: 50,  mid: 0,   high: 0,  label: "低50min" },
  { low: 20,  mid: 15,  high: 10, label: "高10+中15+低20min" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
  { low: 30,  mid: 20,  high: 0,  label: "中20+低30min" },
  { low: 20,  mid: 15,  high: 10, label: "高10+中15+低20min" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
];

// Pattern A: CTL70 ~TSS490/week (5 rides)
const RIDES_A: RidePattern[] = [
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 40,  mid: 30,  high: 0,  label: "中30+低40min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
];

// Pattern B: CTL80 ~TSS560/week (6 rides)
const RIDES_B: RidePattern[] = [
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 40,  mid: 30,  high: 0,  label: "中30+低40min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 60,  mid: 30,  high: 15, label: "高15+中30+低60min" },
  { low: 0,   mid: 0,   high: 0,  label: "休息" },
];

// Pattern C: CTL90 ~TSS630/week (7 rides, balanced mid/high for TP)
const RIDES_C: RidePattern[] = [
  { low: 60,  mid: 0,   high: 0,  label: "リカバリー60min" },
  { low: 30,  mid: 20,  high: 20, label: "高20+中20+低30min" },
  { low: 40,  mid: 40,  high: 0,  label: "テンポ中40+低40min" },
  { low: 20,  mid: 20,  high: 20, label: "インターバル高20+中20+低20min" },
  { low: 60,  mid: 0,   high: 0,  label: "リカバリー60min" },
  { low: 60,  mid: 30,  high: 15, label: "高15+中30+低60min" },
  { low: 120, mid: 60,  high: 0,  label: "ロング中60+低120min" },
];

const PATTERNS: PatternConfig[] = [
  { name: "D (CTL60)", ctl: 60, tsb: 0,   steps: 10000, rides: RIDES_D },
  { name: "A (CTL70)", ctl: 70, tsb: -5,  steps: 10000, rides: RIDES_A },
  { name: "B (CTL80)", ctl: 80, tsb: -10, steps: 10000, rides: RIDES_B },
  { name: "C (CTL90)", ctl: 90, tsb: -15, steps: 12000, rides: RIDES_C },
];

const STAGE_NAMES: Record<number, string> = {
  [EvolutionStage.BABY_I]: "Baby I",
  [EvolutionStage.BABY_II]: "Baby II",
  [EvolutionStage.ROOKIE]: "Rookie",
  [EvolutionStage.CHAMPION]: "Champion",
  [EvolutionStage.ULTIMATE]: "Ultimate",
  [EvolutionStage.MEGA]: "Mega",
};

function buildRide(pattern: RidePattern) {
  const zoneTime: ZoneTime = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0 };
  let tss = 0, km = 0, elev = 0;
  for (const key of ["low", "mid", "high"] as const) {
    const mins = pattern[key];
    if (mins === 0) continue;
    const zpm = ZONE_PER_MIN[key];
    const int = INTENSITY[key];
    zoneTime.z1 += zpm.z1 * mins; zoneTime.z2 += zpm.z2 * mins;
    zoneTime.z3 += zpm.z3 * mins; zoneTime.z4 += zpm.z4 * mins;
    zoneTime.z5 += zpm.z5 * mins; zoneTime.z6 += zpm.z6 * mins;
    zoneTime.z7 += zpm.z7 * mins;
    tss += int.tssPerMin * mins; km += int.kmPerMin * mins; elev += int.elevPerMin * mins;
  }
  return { zoneTime, tss: Math.round(tss), distanceKm: Math.round(km * 10) / 10, elevationM: Math.round(elev) };
}

function getStage(m: MonsterState): number {
  const d = MONSTER_DEFINITIONS.get(m.definitionId);
  return d?.stage ?? 0;
}

function makePlayerFighter(m: MonsterState): BattleFighter {
  return {
    name: m.name,
    currentHp: m.currentHp + (m.memoryEquipment?.hp ?? 0),
    maxHp: m.maxHp + (m.memoryEquipment?.hp ?? 0),
    atk: m.atk + (m.memoryEquipment?.atk ?? 0),
    def: m.def + (m.memoryEquipment?.def ?? 0),
    discipline: m.discipline,
  };
}

const MENU_PRIORITY = ["hill-climb", "sweet-spot", "endurance", "tempo", "race-skills", "lsd", "vo2max-interval", "anaerobic-sprint"];

function simulateGeneration(config: PatternConfig, monster: MonsterState, wMap: Map<number, WorldProgress>, gen: number) {
  const { ctl, tsb, steps, rides } = config;

  let currentWorldNumber = 1;
  for (let w = 1; w <= MAX_WORLDS; w++) {
    if (wMap.get(w)?.bossDefeated) currentWorldNumber = Math.min(w + 1, MAX_WORLDS);
    else break;
  }
  if (!wMap.has(currentWorldNumber)) {
    wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
  }
  let wp = wMap.get(currentWorldNumber)!;

  let tpL = 0, tpM = 0, tpH = 0, storedWp = 0, baseTp = 0;
  let trainCount = 0;
  let dayCount = 0;
  let bossWins = 0, bossAttempts = 0;
  const evolutions: string[] = [];

  for (let localDay = 1; localDay <= 30; localDay++) {
    const elapsed = localDay - 1;
    const lifeTotal = monster.baseLifespan + monster.lifespanExtension;
    if (elapsed >= lifeTotal) break;
    dayCount = localDay;

    monster.currentHp = monster.maxHp;
    const ride = buildRide(rides[(localDay - 1) % 7]);

    // PMC bonus
    const pmc = calculatePmcBonus(ctl, tsb, steps);
    baseTp += pmc.totalTp;

    // Discipline
    const disc = calculateDailyDisciplineChange(determinePmcRank(ctl, tsb), MEALS);
    monster.discipline = applyDisciplineChange(monster.discipline, disc);

    // Ride TP
    const rTp = calculateWorkoutTp(ride.zoneTime, ride.tss);
    tpL += rTp.low; tpM += rTp.mid; tpH += rTp.high;

    // Distribute baseTp
    if (baseTp > 0) {
      const each = Math.floor(baseTp / 3);
      const remainder = baseTp - each * 3;
      tpL += each + remainder; tpM += each; tpH += each;
      baseTp = 0;
    }

    // Training
    while (true) {
      let ok = false;
      for (const mid of MENU_PRIORITY) {
        const menu = TRAINING_MENUS.find(m => m.id === mid)!;
        if (canExecuteTraining(menu, { low: tpL, mid: tpM, high: tpH })) {
          const r = executeTraining(menu, MEALS > 0);
          applyTrainingResult(monster, r, menu);
          tpL -= menu.costTpL; tpM -= menu.costTpM; tpH -= menu.costTpH;
          trainCount++;
          ok = true;

          // Evolution check
          wMap.set(currentWorldNumber, wp);
          if (canEvolve(monster, wMap)) {
            const t = getEvolutionTarget(monster);
            if (t) {
              const prevStage = STAGE_NAMES[getStage(monster)] ?? "?";
              applyEvolution(monster, t);
              const newStage = STAGE_NAMES[getStage(monster)] ?? "?";
              evolutions.push(`${prevStage}→${newStage} @train${trainCount}`);
            }
          }
          break;
        }
      }
      if (!ok) break;
    }

    // WP & Battles
    const rideData = buildRide(rides[(localDay - 1) % 7]);
    storedWp += steps + 5 * WP_CONSTANTS.WP_PER_FLOOR + calculateRideWp(rideData.distanceKm, rideData.elevationM);
    const enc = convertWpToEncounters(storedWp);
    storedWp = enc.wpRemaining;

    for (let i = 0; i < enc.encountersGained; i++) {
      const worldDef = getWorldDefinition(currentWorldNumber);
      const isBoss = canChallengeBoss(wp) && !wp.bossDefeated;
      const enemy = isBoss ? generateBoss(worldDef) : generateEnemy(worldDef.enemies, wp.killCount);
      const player = makePlayerFighter(monster);
      const br = executeBattle(player, enemy);
      baseTp += 1;

      if (br.playerWon) {
        monster.wins++; monster.currentHp = monster.maxHp;
        if (isBoss) {
          bossAttempts++; bossWins++;
          wp = recordBossDefeat(wp); wMap.set(currentWorldNumber, wp);
          if (currentWorldNumber < MAX_WORLDS) {
            currentWorldNumber++;
            if (!wMap.has(currentWorldNumber))
              wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
            wp = wMap.get(currentWorldNumber)!;
          }
          // Evolution check
          if (canEvolve(monster, wMap)) {
            const t = getEvolutionTarget(monster);
            if (t) {
              const prevStage = STAGE_NAMES[getStage(monster)] ?? "?";
              applyEvolution(monster, t);
              const newStage = STAGE_NAMES[getStage(monster)] ?? "?";
              evolutions.push(`${prevStage}→${newStage} @boss W${currentWorldNumber-1}`);
            }
          }
        } else {
          wp = recordMobKill(wp); wMap.set(currentWorldNumber, wp);
        }
      } else {
        monster.losses++;
        monster.currentHp = monster.maxHp;
        if (isBoss) bossAttempts++;
      }
    }

    // Meals
    let mExt = 0;
    for (let i = 0; i < MEALS; i++) mExt += rollMealLifespanExtension();
    monster.lifespanExtension += mExt;
  }

  const stage = STAGE_NAMES[getStage(monster)] ?? "?";
  const equipHp = monster.memoryEquipment?.hp ?? 0;
  const equipAtk = monster.memoryEquipment?.atk ?? 0;
  const equipDef = monster.memoryEquipment?.def ?? 0;

  return {
    dayCount,
    trainCount,
    stage,
    rawHp: monster.maxHp,
    rawAtk: monster.atk,
    rawDef: monster.def,
    equipHp, equipAtk, equipDef,
    totalHp: monster.maxHp + equipHp,
    totalAtk: monster.atk + equipAtk,
    totalDef: monster.def + equipDef,
    bossWins, bossAttempts,
    currentWorld: currentWorldNumber,
    evolutions,
    tpRemaining: { L: tpL, M: tpM, H: tpH },
    monster,
    wMap,
  };
}

// ============================================================
// Main
// ============================================================
console.log("╔═══════════════════════════════════════════════════════╗");
console.log("║  Diagnostic Simulation — Per-generation detail       ║");
console.log("║  20% evo boost, no equipment for evo checks          ║");
console.log("╚═══════════════════════════════════════════════════════╝\n");

// Print weekly TSS for each pattern
for (const config of PATTERNS) {
  let weeklyTss = 0;
  for (const r of config.rides) weeklyTss += buildRide(r).tss;

  // Calculate weekly TP
  let weekTpL = 0, weekTpM = 0, weekTpH = 0;
  for (const r of config.rides) {
    const ride = buildRide(r);
    const tp = calculateWorkoutTp(ride.zoneTime, ride.tss);
    weekTpL += tp.low; weekTpM += tp.mid; weekTpH += tp.high;
  }
  const pmcDaily = calculatePmcBonus(config.ctl, config.tsb, config.steps);
  const weekPmcTp = pmcDaily.totalTp * 7;

  console.log(`  Pattern ${config.name}: WeeklyTSS=${weeklyTss}, WeeklyRideTP=${weekTpL+weekTpM+weekTpH} (L${weekTpL}/M${weekTpM}/H${weekTpH}), WeeklyPmcTP=${weekPmcTp} (${pmcDaily.totalTp}/day), Total=${weekTpL+weekTpM+weekTpH+weekPmcTp}/week`);
}

console.log("");

const NUM_GENS = 5;
const TRIALS = 5;

for (const config of PATTERNS) {
  console.log(`\n${"═".repeat(80)}`);
  console.log(`  Pattern ${config.name}`);
  console.log(`${"═".repeat(80)}`);

  // Average over trials
  const trialResults: {gen: number; days: number; trains: number; stage: string; hp: number; atk: number; def: number; equipHp: number; equipAtk: number; equipDef: number; world: number}[][] = [];

  for (let trial = 0; trial < TRIALS; trial++) {
    let monster = createFirstGeneration("Test1", "botamon");
    let wMap = new Map<number, WorldProgress>();
    const genResults: typeof trialResults[0] = [];

    for (let gen = 1; gen <= NUM_GENS; gen++) {
      const r = simulateGeneration(config, monster, wMap, gen);

      genResults.push({
        gen,
        days: r.dayCount,
        trains: r.trainCount,
        stage: r.stage,
        hp: r.rawHp,
        atk: r.rawAtk,
        def: r.rawDef,
        equipHp: r.equipHp,
        equipAtk: r.equipAtk,
        equipDef: r.equipDef,
        world: r.currentWorld,
      });

      if (trial === 0) {
        console.log(`  Gen${gen}: ${r.dayCount}days, ${r.trainCount}trains, ${r.stage}, Raw HP${r.rawHp.toFixed(0)}/ATK${r.rawAtk.toFixed(0)}/DEF${r.rawDef.toFixed(0)}, Equip +${r.equipHp}/${r.equipAtk}/${r.equipDef}, W${r.currentWorld}, Evos: ${r.evolutions.join(", ") || "none"}, TPrem L${r.tpRemaining.L}/M${r.tpRemaining.M}/H${r.tpRemaining.H}`);
      }

      // Next gen
      if (gen < NUM_GENS) {
        monster = createNextGeneration(r.monster, `Test${gen + 1}`);
        // wMap carries over
      }
    }
    trialResults.push(genResults);
  }

  // Print averages for gen 1
  console.log(`\n  --- Gen 1 averages (${TRIALS} trials) ---`);
  for (let g = 0; g < NUM_GENS; g++) {
    const trials = trialResults.map(t => t[g]);
    const avgTrains = trials.reduce((a, t) => a + t.trains, 0) / TRIALS;
    const avgHp = trials.reduce((a, t) => a + t.hp, 0) / TRIALS;
    const avgAtk = trials.reduce((a, t) => a + t.atk, 0) / TRIALS;
    const avgDef = trials.reduce((a, t) => a + t.def, 0) / TRIALS;
    const avgDays = trials.reduce((a, t) => a + t.days, 0) / TRIALS;
    const avgEquipHp = trials.reduce((a, t) => a + t.equipHp, 0) / TRIALS;
    const avgEquipAtk = trials.reduce((a, t) => a + t.equipAtk, 0) / TRIALS;
    const avgEquipDef = trials.reduce((a, t) => a + t.equipDef, 0) / TRIALS;
    const stages = trials.map(t => t.stage);
    const stageDistrib: Record<string, number> = {};
    for (const s of stages) stageDistrib[s] = (stageDistrib[s] ?? 0) + 1;
    const stageStr = Object.entries(stageDistrib).map(([s, c]) => `${s}:${c}`).join(" ");

    console.log(`    Gen${g+1}: ${avgDays.toFixed(0)}days, ${avgTrains.toFixed(1)}trains, HP${avgHp.toFixed(0)}/ATK${avgAtk.toFixed(0)}/DEF${avgDef.toFixed(0)}, Equip+${avgEquipHp.toFixed(0)}/${avgEquipAtk.toFixed(0)}/${avgEquipDef.toFixed(0)}, Stages: ${stageStr}`);
  }
}

console.log("\n\nDone.");
