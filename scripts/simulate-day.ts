/**
 * 多世代シミュレーション — 全8ワールド攻略 or 世代上限まで自動実行
 *
 * 固定パラメータ: CTL=80, TSB=0, 歩数=10000, 階段=5, 食事=3回
 * ライドパターン: 7日周期でループ
 *
 * 変更点:
 *   - baseTp: PMCボーナス + バトルXP(毎バトル+1) をベースTPプールに統合
 *   - シミュレーション戦略: トレーニング前にbaseTpをL/M/H均等配分
 *   - モブ3段階化: generateEnemy に killCount を渡す
 *   - 小数ステータス: .toFixed(1) で表示
 *   - 転生: 寿命到達後に次世代を自動生成して継続
 *   - ワールド進行: ボス撃破後、次ワールドへ自動遷移 (W1→W2→...→W8)
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
  createInitialWorldProgress,
  recordMobKill,
  canChallengeBoss,
  recordBossDefeat,
  getWorldDefinition,
} from "../src/engine/world";
import { TRAINING_MENUS } from "../src/data/training-menus";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import { WP_CONSTANTS } from "../src/types/battle";
import { WORLD_CONSTANTS } from "../src/types/world";
import type { MonsterState } from "../src/types/monster";
import type { WorldProgress } from "../src/types/world";
import type { BattleFighter } from "../src/types/battle";
import type { ZoneTime } from "../src/types/training";

// ============================================================
// 固定パラメータ
// ============================================================
const STEPS = 10_000;
const FLOORS = 5;
const MEALS = 3;
const CTL = 80;
const TSB = 0;
const MAX_GENERATIONS = 50;
const STOP_ON_BOSS = false; // true: ボス撃破で停止, false: 世代上限まで継続

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
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 40,  mid: 20,  high: 15, label: "高15+中20+低40min" },
  { low: 30,  mid: 45,  high: 0,  label: "中45+低30min" },
  { low: 40,  mid: 20,  high: 15, label: "高15+中20+低40min" },
  { low: 60,  mid: 0,   high: 0,  label: "低60min" },
  { low: 60,  mid: 30,  high: 15, label: "高15+中30+低60min" },
  { low: 240, mid: 30,  high: 0,  label: "中30+低240min" },
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
// 1世代シミュレーション
// ============================================================
function simulateGeneration(
  monster: MonsterState,
  globalDay: number,
  inheritedWMap: Map<number, WorldProgress> | null = null,
): { monster: MonsterState; globalDay: number; wMap: Map<number, WorldProgress>; highestWorldCleared: number } {
  // Inherit world progress from previous generation (cleared worlds persist)
  const wMap = inheritedWMap ? new Map(inheritedWMap) : new Map<number, WorldProgress>();

  // Determine current world: highest cleared + 1, or restart current world's mob progress
  let currentWorldNumber = 1;
  for (let w = 1; w <= 8; w++) {
    const prog = wMap.get(w);
    if (prog?.bossDefeated) {
      currentWorldNumber = Math.min(w + 1, 8);
    } else {
      break;
    }
  }

  // Create fresh progress for the current world if not already tracked
  if (!wMap.has(currentWorldNumber)) {
    wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
  }
  let wp = wMap.get(currentWorldNumber)!;

  let tpL = 0, tpM = 0, tpH = 0, storedWp = 0;
  let baseTp = 0;
  let totalW = 0, totalL = 0;
  let highestWorldCleared = currentWorldNumber - 1;

  const memLabel = monster.memoryEquipment
    ? ` | 装備: HP+${monster.memoryEquipment.hp} ATK+${monster.memoryEquipment.atk} DEF+${monster.memoryEquipment.def}`
    : "";
  console.log(`\n${"━".repeat(65)}`);
  console.log(`  G${monster.generation} 誕生: ${label(monster)} | 寿命${monster.baseLifespan.toFixed(1)}日 | HP${monster.maxHp} ATK${monster.atk} DEF${monster.def}${memLabel}`);
  console.log(`${"━".repeat(65)}\n`);

  for (let localDay = 1; localDay <= 30; localDay++) {
    const day = globalDay + localDay - 1;
    const elapsed = localDay - 1;
    const lifeTotal = monster.baseLifespan + monster.lifespanExtension;
    if (elapsed >= lifeTotal) {
      console.log(`\n  ══ Day ${day} (G${monster.generation} ${localDay}日目): 寿命到達 (${elapsed}日経過 / ${lifeTotal.toFixed(2)}日) ══`);
      globalDay = day;
      break;
    }

    monster.currentHp = monster.maxHp; // 朝HP全回復

    const ride = buildRide(RIDE_PATTERNS[(day - 1) % 7]);

    // PMC → baseTp に加算
    const pmc = calculatePmcBonus(CTL, TSB, STEPS);
    baseTp += pmc.totalTp;

    // 規律
    const disc = calculateDailyDisciplineChange(determinePmcRank(CTL, TSB), MEALS);
    monster.discipline = applyDisciplineChange(monster.discipline, disc);

    // ライドTP (ゾーン別なので直接L/M/Hへ)
    const rTp = calculateWorkoutTp(ride.zoneTime, ride.tss);
    tpL += rTp.low; tpM += rTp.mid; tpH += rTp.high;

    // baseTp をL/M/H均等配分 (シミュレーション戦略)
    if (baseTp > 0) {
      const each = Math.floor(baseTp / 3);
      const remainder = baseTp - each * 3;
      tpL += each + remainder; // 端数はLに
      tpM += each;
      tpH += each;
      baseTp = 0;
    }

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
          tLog.push(`${menu.nameEn}(+${r.hpGain.toFixed(1)}/+${r.atkGain.toFixed(1)}/+${r.defGain.toFixed(1)})`);
          ok = true;
          // 進化チェック
          wMap.set(currentWorldNumber, wp);
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

    let dW = 0, dL = 0;
    const bLog: string[] = [];

    for (let i = 0; i < enc.encountersGained; i++) {
      const worldDef = getWorldDefinition(currentWorldNumber);
      const boss = canChallengeBoss(wp) && !wp.bossDefeated;
      const enemy = boss ? generateBoss(worldDef) : generateEnemy(worldDef.enemies, wp.killCount);
      const player = makePlayerFighter(monster);
      const br = executeBattle(player, enemy);

      // バトルXP: 毎バトル +1 baseTp
      baseTp += 1;

      if (br.playerWon) {
        dW++; monster.wins++;
        monster.currentHp = monster.maxHp;
        if (boss) {
          wp = recordBossDefeat(wp); wMap.set(currentWorldNumber, wp);
          bLog.push(`[W${currentWorldNumber}BOSS]${enemy.name}→★勝(${br.totalTurns}T,残HP${br.playerRemainingHp})`);
          highestWorldCleared = Math.max(highestWorldCleared, currentWorldNumber);

          // Advance to next world
          if (currentWorldNumber < 8) {
            currentWorldNumber++;
            if (!wMap.has(currentWorldNumber)) {
              wMap.set(currentWorldNumber, { worldNumber: currentWorldNumber, killCount: 0, bossDefeated: false });
            }
            wp = wMap.get(currentWorldNumber)!;
            bLog.push(`→W${currentWorldNumber}(${getWorldDefinition(currentWorldNumber).name})へ`);
          }
        } else {
          wp = recordMobKill(wp); wMap.set(currentWorldNumber, wp);
          bLog.push(`${enemy.name}(${enemy.maxHp})→勝(${br.totalTurns}T)`);
        }
        // 進化チェック
        if (canEvolve(monster, wMap)) {
          const t = getEvolutionTarget(monster);
          if (t) { const old = label(monster); applyEvolution(monster, t); bLog.push(`★${old}→${label(monster)}`); }
        }
      } else {
        dL++; monster.losses++; monster.currentHp = monster.maxHp;
        bLog.push(`${enemy.name}(${enemy.maxHp}/${enemy.atk}/${enemy.def})→敗(${br.totalTurns}T)`);
      }
    }
    totalW += dW; totalL += dL;

    // 食事
    let mExt = 0;
    for (let i = 0; i < MEALS; i++) mExt += rollMealLifespanExtension();
    monster.lifespanExtension += mExt;

    const lifeRemain = monster.baseLifespan + monster.lifespanExtension - localDay;

    // 出力
    console.log(`  ─── Day ${day} (G${monster.generation} ${localDay}日目) ─── ${RIDE_PATTERNS[(day - 1) % 7].label} (TSS${ride.tss})`);
    console.log(`    TP: PMC=${pmc.totalTp}→base + ライドL${rTp.low}/M${rTp.mid}/H${rTp.high}`);
    if (tLog.length) console.log(`    訓練(${tc}回): ${tLog.join(" → ")}`);
    console.log(`    ステ: HP${monster.maxHp.toFixed(1)} ATK${monster.atk.toFixed(1)} DEF${monster.def.toFixed(1)} [${label(monster)}] 規律${monster.discipline}`);
    console.log(`    残TP: L${tpL}/M${tpM}/H${tpH} base=${baseTp} | 累計: L${monster.totalTpL}/M${monster.totalTpM}/H${monster.totalTpH}`);
    // World progress summary
    const worldStatus = [];
    for (let w = 1; w <= currentWorldNumber; w++) {
      const prog = wMap.get(w);
      if (prog) {
        worldStatus.push(`W${w}:${prog.killCount}/${WORLD_CONSTANTS.REQUIRED_KILLS}${prog.bossDefeated ? "★" : ""}`);
      }
    }
    console.log(`    バトル: ${dW}勝${dL}敗 (通算${totalW}W${totalL}L) | ${worldStatus.join(" ")}`);
    if (bLog.length) console.log(`      ${bLog.join(" | ")}`);
    console.log(`    寿命残: ${lifeRemain.toFixed(1)}日`);
  }

  // 世代サマリー
  const worldSummaryParts: string[] = [];
  for (let w = 1; w <= 8; w++) {
    const prog = wMap.get(w);
    if (prog) {
      worldSummaryParts.push(`W${w}:${prog.killCount}体${prog.bossDefeated ? "+BOSS★" : ""}`);
    }
  }
  console.log(`\n  ┌─── G${monster.generation} サマリー ───┐`);
  console.log(`  │ ${label(monster)}`);
  console.log(`  │ HP${monster.maxHp.toFixed(1)} ATK${monster.atk.toFixed(1)} DEF${monster.def.toFixed(1)}`);
  console.log(`  │ 訓練TP: L${monster.totalTpL}/M${monster.totalTpM}/H${monster.totalTpH} → ${determineBranchType(monster.totalTpL, monster.totalTpM, monster.totalTpH)}型`);
  console.log(`  │ 通算: ${totalW}W${totalL}L | ${worldSummaryParts.join(" ")}`);
  console.log(`  │ 進化: ${monster.evolutionHistory.join("→") || "なし"}`);
  console.log(`  │ 寿命: ${monster.baseLifespan.toFixed(1)} + ${monster.lifespanExtension.toFixed(2)} = ${(monster.baseLifespan + monster.lifespanExtension).toFixed(2)}日`);
  const mem = createMemoryEquipment(monster);
  console.log(`  │ 転生装備: "${mem.name}" HP+${mem.hp} ATK+${mem.atk} DEF+${mem.def}`);
  console.log(`  └${"─".repeat(25)}┘`);

  return { monster, globalDay, wMap, highestWorldCleared, highestWorldReached: currentWorldNumber };
}

// ============================================================
// メイン — 多世代ループ
// ============================================================
console.log("╔═════════════════════════════════════════════════════════════╗");
console.log("║  多世代シミュレーション | CTL80 TSB0 歩数10k 食事3回/日   ║");
console.log("║  [baseTp統合 + バトルXP + モブ3段階 + 小数ステ]           ║");
console.log(`║  最大${MAX_GENERATIONS}世代 | ワールド自動進行 (W1→W8)                    ║`);
console.log("╚═════════════════════════════════════════════════════════════╝");

let monster = createFirstGeneration("アキヒロ1号", "botamon");
let globalDay = 1;
let currentWMap: Map<number, WorldProgress> | null = null;
let overallHighestCleared = 0;
let overallHighestReached = 1;

for (let gen = 1; gen <= MAX_GENERATIONS; gen++) {
  const result = simulateGeneration(monster, globalDay, currentWMap);
  monster = result.monster;
  globalDay = result.globalDay;
  currentWMap = result.wMap;
  overallHighestCleared = Math.max(overallHighestCleared, result.highestWorldCleared);
  overallHighestReached = Math.max(overallHighestReached, result.highestWorldReached);

  if (result.highestWorldCleared > 0) {
    const clearedNames = [];
    for (let w = 1; w <= result.highestWorldCleared; w++) {
      if (result.wMap.get(w)?.bossDefeated) {
        clearedNames.push(`W${w}`);
      }
    }
    if (clearedNames.length > 0) {
      console.log(`\n  クリア済: ${clearedNames.join(", ")}`);
    }
  }

  if (gen < MAX_GENERATIONS) {
    const nextName = `アキヒロ${gen + 1}号`;
    console.log(`\n  ▶ 転生: ${monster.name} → ${nextName}`);
    monster = createNextGeneration(monster, nextName);
    globalDay += 1; // 転生に1日消費
  }
}

// 最終サマリー
const clearedWorldsList: string[] = [];
if (currentWMap) {
  for (let w = 1; w <= 8; w++) {
    const prog = currentWMap.get(w);
    if (prog?.bossDefeated) clearedWorldsList.push(`W${w}(${getWorldDefinition(w).name})`);
  }
}
console.log(`\n${"═".repeat(65)}`);
console.log(`  最終結果: G${monster.generation} ${label(monster)}`);
console.log(`  総経過日数: ${globalDay}日`);
console.log(`  最高到達: W${overallHighestReached}(${getWorldDefinition(overallHighestReached).name})`);
console.log(`  クリア済ワールド: ${clearedWorldsList.length > 0 ? clearedWorldsList.join(", ") : "なし"}`);
if (currentWMap) {
  // Show current world in progress
  for (let w = 1; w <= 8; w++) {
    const prog = currentWMap.get(w);
    if (prog && !prog.bossDefeated) {
      console.log(`  進行中: W${w}(${getWorldDefinition(w).name}) ${prog.killCount}/${WORLD_CONSTANTS.REQUIRED_KILLS}体`);
      break;
    }
  }
}
console.log(`${"═".repeat(65)}`);
