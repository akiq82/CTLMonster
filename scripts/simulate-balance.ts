/**
 * バランスシミュレーション — Pattern A/B/C × 50世代 × 10試行
 *
 * Pattern A: CTL70 / TSS490/week → 目標: Ultimate + W7クリア
 * Pattern B: CTL80 / TSS560/week → 目標: Mega + W9クリア
 * Pattern C: CTL90 / TSS630/week → 目標: W10クリア
 *
 * 出力: 各パターンの到達段階、到達ワールド、ボス勝率
 */

import { createFirstGeneration, createNextGeneration, createMemoryEquipment } from "../src/engine/generation";
import { calculatePmcBonus, determinePmcRank } from "../src/engine/pmc-bonus";
import { calculateDailyDisciplineChange, applyDisciplineChange } from "../src/engine/discipline";
import { calculateWorkoutTp } from "../src/engine/tp-calculator";
import { calculateRideWp, convertWpToEncounters, generateEnemy, generateBoss } from "../src/engine/encounter";
import { canExecuteTraining, executeTraining, applyTrainingResult } from "../src/engine/training";
import { executeBattle } from "../src/engine/battle";
import { rollMealLifespanExtension } from "../src/engine/lifespan";
import { canEvolve, getEvolutionTarget, applyEvolution, determineBranchType } from "../src/engine/evolution";
import {
  recordMobKill,
  canChallengeBoss,
  recordBossDefeat,
  getWorldDefinition,
} from "../src/engine/world";
import { TRAINING_MENUS } from "../src/data/training-menus";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import { WP_CONSTANTS } from "../src/types/battle";
import { WORLD_CONSTANTS } from "../src/types/world";
import { EvolutionStage } from "../src/types/monster";
import type { MonsterState } from "../src/types/monster";
import type { WorldProgress } from "../src/types/world";
import type { BattleFighter } from "../src/types/battle";
import type { ZoneTime } from "../src/types/training";

// ============================================================
// Configuration
// ============================================================
const MAX_GENERATIONS = 50;
const MAX_WORLDS = 10;
const TRIALS_PER_PATTERN = 10;
const MEALS = 3;
const VERBOSE = process.argv.includes("--verbose");

interface PatternConfig {
  name: string;
  ctl: number;
  tsb: number;
  steps: number;
  rides: RidePattern[];
  targetStage: string;
  targetWorld: number;
}

// ============================================================
// Ride patterns (7-day cycle)
// ============================================================
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

interface RidePattern { low: number; mid: number; high: number; label: string }

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

// Pattern C: CTL90 ~TSS630/week (7 rides including long)
const RIDES_C: RidePattern[] = [
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 40,  mid: 30,  high: 0,  label: "中30+低40min" },
  { low: 30,  mid: 20,  high: 15, label: "高15+中20+低30min" },
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 60,  mid: 30,  high: 15, label: "高15+中30+低60min" },
  { low: 240, mid: 30,  high: 0,  label: "中30+低240min" },
];

const PATTERNS: PatternConfig[] = [
  { name: "A", ctl: 70, tsb: -5,  steps: 10000, rides: RIDES_A, targetStage: "Ultimate", targetWorld: 7 },
  { name: "B", ctl: 80, tsb: -10, steps: 10000, rides: RIDES_B, targetStage: "Mega",     targetWorld: 9 },
  { name: "C", ctl: 90, tsb: -15, steps: 12000, rides: RIDES_C, targetStage: "Mega+",    targetWorld: 10 },
];

// ============================================================
// Helpers
// ============================================================
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

const STAGE_NAMES: Record<number, string> = {
  [EvolutionStage.BABY_I]: "Baby I",
  [EvolutionStage.BABY_II]: "Baby II",
  [EvolutionStage.ROOKIE]: "Rookie",
  [EvolutionStage.CHAMPION]: "Champion",
  [EvolutionStage.ULTIMATE]: "Ultimate",
  [EvolutionStage.MEGA]: "Mega",
};

function getStage(m: MonsterState): number {
  const d = MONSTER_DEFINITIONS.get(m.definitionId);
  return d?.stage ?? 0;
}

function stageName(m: MonsterState): string {
  return STAGE_NAMES[getStage(m)] ?? "?";
}

const MENU_PRIORITY = ["hill-climb", "sweet-spot", "endurance", "tempo", "race-skills", "lsd", "vo2max-interval", "anaerobic-sprint"];

// ============================================================
// Single trial simulation
// ============================================================
interface TrialResult {
  highestStage: number;
  highestWorld: number;
  bossWins: number[];       // W1..W10 boss win count
  bossAttempts: number[];   // W1..W10 boss attempt count
  genReachedStage: number[]; // gen# when each stage was first reached
  genReachedWorld: number[]; // gen# when each world boss was first beaten
  totalGenerations: number;
  finalStats: { hp: number; atk: number; def: number };
}

function simulateTrial(config: PatternConfig): TrialResult {
  const { ctl, tsb, steps, rides } = config;

  let monster = createFirstGeneration("Test1", "botamon");
  let globalDay = 1;
  let wMap = new Map<number, WorldProgress>();

  const bossWins = new Array(MAX_WORLDS + 1).fill(0);
  const bossAttempts = new Array(MAX_WORLDS + 1).fill(0);
  const genReachedStage = new Array(7).fill(0);  // stages 1-6
  const genReachedWorld = new Array(MAX_WORLDS + 1).fill(0);

  let highestStage = getStage(monster);
  let highestWorld = 0;

  for (let gen = 1; gen <= MAX_GENERATIONS; gen++) {
    // --- simulate one generation ---
    let currentWorldNumber = 1;
    for (let w = 1; w <= MAX_WORLDS; w++) {
      if (wMap.get(w)?.bossDefeated) {
        currentWorldNumber = Math.min(w + 1, MAX_WORLDS);
      } else break;
    }

    if (!wMap.has(currentWorldNumber)) {
      wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
    }
    let wp = wMap.get(currentWorldNumber)!;

    let tpL = 0, tpM = 0, tpH = 0, storedWp = 0, baseTp = 0;

    for (let localDay = 1; localDay <= 30; localDay++) {
      const day = globalDay + localDay - 1;
      const elapsed = localDay - 1;
      const lifeTotal = monster.baseLifespan + monster.lifespanExtension;
      if (elapsed >= lifeTotal) { globalDay = day; break; }

      monster.currentHp = monster.maxHp;

      const ride = buildRide(rides[(day - 1) % 7]);

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
        tpL += each + remainder;
        tpM += each;
        tpH += each;
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
            ok = true;

            // Track stage
            const s = getStage(monster);
            if (s > highestStage) {
              highestStage = s;
              if (genReachedStage[s] === 0) genReachedStage[s] = gen;
            }

            // Evolution check
            wMap.set(currentWorldNumber, wp);
            if (canEvolve(monster, wMap)) {
              const t = getEvolutionTarget(monster);
              if (t) {
                applyEvolution(monster, t);
                const ns = getStage(monster);
                if (ns > highestStage) { highestStage = ns; if (genReachedStage[ns] === 0) genReachedStage[ns] = gen; }
              }
            }
            break;
          }
        }
        if (!ok) break;
      }

      // WP & Battles
      const rideData = buildRide(rides[(day - 1) % 7]);
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
          monster.wins++;
          monster.currentHp = monster.maxHp;
          if (isBoss) {
            bossAttempts[currentWorldNumber]++;
            bossWins[currentWorldNumber]++;
            wp = recordBossDefeat(wp); wMap.set(currentWorldNumber, wp);
            if (currentWorldNumber > highestWorld) {
              highestWorld = currentWorldNumber;
              if (genReachedWorld[currentWorldNumber] === 0) genReachedWorld[currentWorldNumber] = gen;
            }
            if (currentWorldNumber < MAX_WORLDS) {
              currentWorldNumber++;
              if (!wMap.has(currentWorldNumber)) {
                wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
              }
              wp = wMap.get(currentWorldNumber)!;
            }
          } else {
            wp = recordMobKill(wp); wMap.set(currentWorldNumber, wp);
          }

          // Evolution check after battle win
          if (canEvolve(monster, wMap)) {
            const t = getEvolutionTarget(monster);
            if (t) {
              applyEvolution(monster, t);
              const ns = getStage(monster);
              if (ns > highestStage) { highestStage = ns; if (genReachedStage[ns] === 0) genReachedStage[ns] = gen; }
            }
          }
        } else {
          monster.losses++;
          monster.currentHp = monster.maxHp;
          if (isBoss) bossAttempts[currentWorldNumber]++;
        }
      }

      // Meals
      let mExt = 0;
      for (let i = 0; i < MEALS; i++) mExt += rollMealLifespanExtension();
      monster.lifespanExtension += mExt;
    }

    // Generation end - check if we need to continue
    if (gen < MAX_GENERATIONS) {
      monster = createNextGeneration(monster, `Test${gen + 1}`);
      globalDay += 1;
    }
  }

  return {
    highestStage,
    highestWorld,
    bossWins,
    bossAttempts,
    genReachedStage,
    genReachedWorld,
    totalGenerations: MAX_GENERATIONS,
    finalStats: { hp: monster.maxHp, atk: monster.atk, def: monster.def },
  };
}

// ============================================================
// Main
// ============================================================
console.log("╔═══════════════════════════════════════════════════════════════════╗");
console.log("║  Balance Simulation — Pattern A/B/C × 50 generations × 10 trials ║");
console.log("║  Stage training factors: ×1/×2/×5/×10/×25/×60                    ║");
console.log("║  PMC_BASE_TP=35, proportional evo requirements                   ║");
console.log("╚═══════════════════════════════════════════════════════════════════╝\n");

for (const config of PATTERNS) {
  console.log(`\n${"═".repeat(70)}`);
  console.log(`  Pattern ${config.name}: CTL${config.ctl} TSB${config.tsb} Steps${config.steps}`);
  console.log(`  Target: ${config.targetStage} + W${config.targetWorld} clear`);
  console.log(`${"═".repeat(70)}`);

  // Calculate weekly TSS for reference
  let weeklyTss = 0;
  for (const r of config.rides) {
    const ride = buildRide(r);
    weeklyTss += ride.tss;
  }
  console.log(`  Weekly TSS: ~${weeklyTss}`);

  const results: TrialResult[] = [];

  for (let trial = 1; trial <= TRIALS_PER_PATTERN; trial++) {
    const r = simulateTrial(config);
    results.push(r);
    if (VERBOSE) {
      console.log(`    Trial ${trial}: Stage=${STAGE_NAMES[r.highestStage]} World=W${r.highestWorld} HP${r.finalStats.hp.toFixed(0)} ATK${r.finalStats.atk.toFixed(0)} DEF${r.finalStats.def.toFixed(0)}`);
    }
  }

  // Aggregate results
  const stages = results.map(r => r.highestStage);
  const worlds = results.map(r => r.highestWorld);

  const avgStage = stages.reduce((a, b) => a + b, 0) / stages.length;
  const minStage = Math.min(...stages);
  const maxStage = Math.max(...stages);
  const avgWorld = worlds.reduce((a, b) => a + b, 0) / worlds.length;
  const minWorld = Math.min(...worlds);
  const maxWorld = Math.max(...worlds);

  // Stage distribution
  const stageCount = new Map<string, number>();
  for (const s of stages) {
    const name = STAGE_NAMES[s] ?? `Stage${s}`;
    stageCount.set(name, (stageCount.get(name) ?? 0) + 1);
  }

  // Average generation when stages reached
  const avgGenForStage: Record<string, string> = {};
  for (let s = 1; s <= 6; s++) {
    const gens = results.map(r => r.genReachedStage[s]).filter(g => g > 0);
    if (gens.length > 0) {
      const avg = gens.reduce((a, b) => a + b, 0) / gens.length;
      avgGenForStage[STAGE_NAMES[s]] = `G${avg.toFixed(1)} (${gens.length}/${TRIALS_PER_PATTERN})`;
    }
  }

  // Average generation when worlds cleared
  const avgGenForWorld: Record<number, string> = {};
  for (let w = 1; w <= MAX_WORLDS; w++) {
    const gens = results.map(r => r.genReachedWorld[w]).filter(g => g > 0);
    if (gens.length > 0) {
      const avg = gens.reduce((a, b) => a + b, 0) / gens.length;
      avgGenForWorld[w] = `G${avg.toFixed(1)} (${gens.length}/${TRIALS_PER_PATTERN})`;
    }
  }

  // Boss win rates
  const bossWinRates: Record<number, string> = {};
  for (let w = 1; w <= MAX_WORLDS; w++) {
    const totalAttempts = results.reduce((a, r) => a + r.bossAttempts[w], 0);
    const totalWins = results.reduce((a, r) => a + r.bossWins[w], 0);
    if (totalAttempts > 0) {
      bossWinRates[w] = `${totalWins}/${totalAttempts} (${(totalWins / totalAttempts * 100).toFixed(0)}%)`;
    }
  }

  // Print summary
  console.log(`\n  ┌─── Pattern ${config.name} Summary (${TRIALS_PER_PATTERN} trials) ───┐`);
  console.log(`  │ Highest Stage: avg=${STAGE_NAMES[Math.round(avgStage)]} min=${STAGE_NAMES[minStage]} max=${STAGE_NAMES[maxStage]}`);
  console.log(`  │ Highest World: avg=W${avgWorld.toFixed(1)} min=W${minWorld} max=W${maxWorld}`);
  console.log(`  │`);
  console.log(`  │ Stage distribution:`);
  for (const [name, count] of stageCount) {
    console.log(`  │   ${name}: ${count}/${TRIALS_PER_PATTERN} (${(count / TRIALS_PER_PATTERN * 100).toFixed(0)}%)`);
  }
  console.log(`  │`);
  console.log(`  │ Stage reach (avg gen):`);
  for (const [stage, info] of Object.entries(avgGenForStage)) {
    console.log(`  │   ${stage}: ${info}`);
  }
  console.log(`  │`);
  console.log(`  │ World clear (avg gen):`);
  for (const [world, info] of Object.entries(avgGenForWorld)) {
    console.log(`  │   W${world}: ${info}`);
  }
  console.log(`  │`);
  console.log(`  │ Boss win rates:`);
  for (const [world, info] of Object.entries(bossWinRates)) {
    console.log(`  │   W${world}: ${info}`);
  }
  console.log(`  └${"─".repeat(45)}┘`);

  // Check against targets
  const targetMet = avgWorld >= config.targetWorld;
  const emoji = targetMet ? "✓" : "✗";
  console.log(`\n  ${emoji} Target W${config.targetWorld}: avg=W${avgWorld.toFixed(1)} ${targetMet ? "PASS" : "FAIL"}`);
}

// Final comparison table
console.log(`\n${"═".repeat(70)}`);
console.log("  COMPARISON TABLE");
console.log(`${"═".repeat(70)}`);
console.log(`  ${"Pattern".padEnd(10)} ${"Avg Stage".padEnd(12)} ${"Avg World".padEnd(12)} ${"Target".padEnd(15)} ${"Result".padEnd(8)}`);
console.log(`  ${"─".repeat(60)}`);
// (Re-run would be needed to print this... but the per-pattern summaries above cover it)
console.log("\n  Done. Run with --verbose for per-trial details.");
