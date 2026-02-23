/**
 * 一週間ループシミュレーション — モンスター死亡まで自動実行
 *
 * 固定パラメータ: CTL=60, TSB=0, 歩数=8000, 階段=5, 食事=1回
 * ライドパターン: 7日周期でループ
 */

import { createFirstGeneration, createMemoryEquipment } from "../src/engine/generation";
import { calculatePmcBonus, determinePmcRank } from "../src/engine/pmc-bonus";
import { calculateDailyDisciplineChange, applyDisciplineChange } from "../src/engine/discipline";
import { calculateWorkoutTp } from "../src/engine/tp-calculator";
import { calculateRideWp, convertWpToEncounters, generateEnemy, generateBoss } from "../src/engine/encounter";
import { canExecuteTraining, executeTraining, applyTrainingResult } from "../src/engine/training";
import { executeBattle } from "../src/engine/battle";
import { rollMealLifespanExtension } from "../src/engine/lifespan";
import { canEvolve, getEvolutionTarget, applyEvolution, determineBranchType } from "../src/engine/evolution";
import {
  createInitialWorldProgress,
  recordMobKill,
  canChallengeBoss,
  recordBossDefeat,
  getWorldDefinition,
} from "../src/engine/world";
import { TRAINING_MENUS } from "../src/data/training-menus";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import { WP_CONSTANTS } from "../src/types/battle";
import type { MonsterState } from "../src/types/monster";
import type { WorldProgress } from "../src/types/world";
import type { BattleFighter } from "../src/types/battle";
import type { ZoneTime } from "../src/types/training";

// ============================================================
// 固定パラメータ
// ============================================================
const STEPS = 8_000;
const FLOORS = 5;
const MEALS = 1;
const CTL = 60;
const TSB = 0;

// ============================================================
// ライドパターン定義 (7日周期)
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

const RIDE_PATTERNS: RidePattern[] = [
  { low: 30,  mid: 0,   high: 0,  label: "低30min" },
  { low: 50,  mid: 0,   high: 10, label: "高10+低50min" },
  { low: 30,  mid: 30,  high: 0,  label: "中30+低30min" },
  { low: 50,  mid: 0,   high: 10, label: "高10+低50min" },
  { low: 30,  mid: 0,   high: 0,  label: "低30min" },
  { low: 50,  mid: 20,  high: 10, label: "高10+低50+中20min" },
  { low: 220, mid: 20,  high: 0,  label: "中20+低220min" },
];

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

// ============================================================
// ヘルパー
// ============================================================
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

const STAGE_NAMES: Record<number, string> = { 1: "Baby I", 2: "Baby II", 3: "Rookie", 4: "Champion", 5: "Ultimate", 6: "Mega" };
function label(m: MonsterState): string {
  const d = MONSTER_DEFINITIONS.get(m.definitionId);
  return d ? `${d.name}(${STAGE_NAMES[d.stage]})` : m.definitionId;
}

const MENU_PRIORITY = ["hill-climb", "sweet-spot", "endurance", "tempo", "race-skills", "lsd", "vo2max-interval", "anaerobic-sprint"];

// ============================================================
// メイン
// ============================================================
console.log("╔═════════════════════════════════════════════════════════════╗");
console.log("║  寿命シミュレーション | CTL60 TSB0 歩数8k 食事1回/日      ║");
console.log("╚═════════════════════════════════════════════════════════════╝\n");

const monster = createFirstGeneration("アキヒロ1号", "botamon");
console.log(`誕生: ${label(monster)} | 寿命${monster.baseLifespan.toFixed(1)}日 | HP${monster.maxHp} ATK${monster.atk} DEF${monster.def}\n`);

let wp: WorldProgress = createInitialWorldProgress();
const wMap = new Map<number, WorldProgress>(); wMap.set(1, wp);
let tpL = 0, tpM = 0, tpH = 0, storedWp = 0;
let totalW = 0, totalL = 0;

for (let day = 1; day <= 30; day++) {
  const elapsed = day - 1;
  const lifeTotal = monster.baseLifespan + monster.lifespanExtension;
  if (elapsed >= lifeTotal) {
    console.log(`\n══ Day ${day} 朝: 寿命到達 (${elapsed}日経過 / ${lifeTotal.toFixed(2)}日) ══`);
    break;
  }

  monster.currentHp = monster.maxHp; // 朝HP全回復

  const ride = buildRide(RIDE_PATTERNS[(day - 1) % 7]);

  // PMC
  const pmc = calculatePmcBonus(CTL, TSB, STEPS);
  tpL += pmc.tpL; tpM += pmc.tpM; tpH += pmc.tpH;

  // 規律
  const disc = calculateDailyDisciplineChange(determinePmcRank(CTL, TSB), MEALS);
  monster.discipline = applyDisciplineChange(monster.discipline, disc);

  // ライドTP
  const rTp = calculateWorkoutTp(ride.zoneTime, ride.tss);
  tpL += rTp.low; tpM += rTp.mid; tpH += rTp.high;

  // トレーニング
  const tLog: string[] = [];
  let tc = 0;
  while (true) {
    let ok = false;
    for (const mid of MENU_PRIORITY) {
      const menu = TRAINING_MENUS.find(m => m.id === mid)!;
      if (canExecuteTraining(menu, { low: tpL, mid: tpM, high: tpH })) {
        const r = executeTraining(menu, MEALS > 0);
        applyTrainingResult(monster, r, menu);
        tpL -= menu.costTpL; tpM -= menu.costTpM; tpH -= menu.costTpH;
        tc++;
        tLog.push(`${menu.nameEn}(+${r.hpGain}/+${r.atkGain}/+${r.defGain})`);
        ok = true;
        // 進化チェック
        wMap.set(1, wp);
        if (canEvolve(monster, wMap)) {
          const t = getEvolutionTarget(monster);
          if (t) { const old = label(monster); applyEvolution(monster, t); tLog.push(`★${old}→${label(monster)}`); }
        }
        break;
      }
    }
    if (!ok) break;
  }

  // WP & バトル
  storedWp += STEPS + FLOORS * WP_CONSTANTS.WP_PER_FLOOR + calculateRideWp(ride.distanceKm, ride.elevationM);
  const enc = convertWpToEncounters(storedWp);
  storedWp = enc.wpRemaining;

  const w1 = getWorldDefinition(1);
  let dW = 0, dL = 0;
  const bLog: string[] = [];
  const gap = enc.encountersGained > 1 ? 14 / enc.encountersGained : 2;

  for (let i = 0; i < enc.encountersGained; i++) {
    const boss = canChallengeBoss(wp) && !wp.bossDefeated;
    const enemy = boss ? generateBoss(w1) : generateEnemy(w1.enemies);
    const player = makePlayerFighter(monster);
    const br = executeBattle(player, enemy);

    if (br.playerWon) {
      dW++; monster.wins++;
      monster.currentHp = Math.min(br.playerRemainingHp, monster.maxHp);
      if (boss) { wp = recordBossDefeat(wp); wMap.set(1, wp); bLog.push(`[BOSS]${enemy.name}→★勝(${br.totalTurns}T,残HP${br.playerRemainingHp})`); }
      else { wp = recordMobKill(wp); wMap.set(1, wp); bLog.push(`${enemy.name}(${enemy.maxHp})→勝(${br.totalTurns}T)`); }
      // 進化チェック
      if (canEvolve(monster, wMap)) {
        const t = getEvolutionTarget(monster);
        if (t) { const old = label(monster); applyEvolution(monster, t); bLog.push(`★${old}→${label(monster)}`); }
      }
    } else {
      dL++; monster.losses++; monster.currentHp = 1;
      bLog.push(`${enemy.name}(${enemy.maxHp}/${enemy.atk}/${enemy.def})→敗(${br.totalTurns}T)`);
    }
    if (i < enc.encountersGained - 1) {
      monster.currentHp = Math.min(monster.currentHp + Math.floor(monster.maxHp * 0.1 * gap), monster.maxHp);
    }
  }
  totalW += dW; totalL += dL;

  // 食事
  let mExt = 0;
  for (let i = 0; i < MEALS; i++) mExt += rollMealLifespanExtension();
  monster.lifespanExtension += mExt;

  const lifeRemain = monster.baseLifespan + monster.lifespanExtension - day;

  // 出力
  console.log(`═══ Day ${day} ═══ ${RIDE_PATTERNS[(day - 1) % 7].label} (TSS${ride.tss})`);
  console.log(`  TP獲得: PMC=${pmc.totalTp} + ライドL${rTp.low}/M${rTp.mid}/H${rTp.high}`);
  if (tLog.length) console.log(`  訓練(${tc}回): ${tLog.join(" → ")}`);
  console.log(`  ステ: HP${monster.maxHp} ATK${monster.atk} DEF${monster.def} [${label(monster)}] 規律${monster.discipline}`);
  console.log(`  残TP: L${tpL}/M${tpM}/H${tpH} | 累計訓練: L${monster.totalTpL}/M${monster.totalTpM}/H${monster.totalTpH}`);
  console.log(`  バトル: ${dW}勝${dL}敗 (通算${totalW}勝${totalL}敗) | W1: ${wp.killCount}/10${wp.bossDefeated ? " ★BOSS撃破" : ""}`);
  if (bLog.length) console.log(`    ${bLog.join(" | ")}`);
  console.log(`  寿命残: ${lifeRemain.toFixed(1)}日\n`);
}

// 最終
console.log("╔═════════════════════════════════════════════════════════════╗");
console.log("║  最終サマリー                                             ║");
console.log("╚═════════════════════════════════════════════════════════════╝");
console.log(`  ${label(monster)} | HP${monster.maxHp} ATK${monster.atk} DEF${monster.def}`);
console.log(`  累計訓練TP: L${monster.totalTpL}/M${monster.totalTpM}/H${monster.totalTpH} → ${determineBranchType(monster.totalTpL, monster.totalTpM, monster.totalTpH)}型`);
console.log(`  通算: ${totalW}勝${totalL}敗 | W1: ${wp.killCount}体${wp.bossDefeated ? "+BOSS" : ""}`);
console.log(`  進化履歴: ${monster.evolutionHistory.join("→") || "なし"}`);
console.log(`  寿命: ${monster.baseLifespan.toFixed(1)} + ${monster.lifespanExtension.toFixed(2)} = ${(monster.baseLifespan + monster.lifespanExtension).toFixed(2)}日`);
const mem = createMemoryEquipment(monster);
console.log(`\n  【転生装備】"${mem.name}" HP+${mem.hp} ATK+${mem.atk} DEF+${mem.def}`);
