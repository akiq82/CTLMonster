/**
 * 全モンスター定義
 *
 * GDD.md セクション6 に基づく。
 *
 * 進化段階別ステータス基準 (GDD 6.1):
 *   I  幼年期I:   基礎 HP10/ATK3/DEF2,    上限 HP30/ATK10/DEF8
 *   II 幼年期II:  基礎 HP25/ATK8/DEF6,    上限 HP80/ATK25/DEF20
 *   III 成長期:   基礎 HP60/ATK20/DEF15,  上限 HP200/ATK60/DEF50
 *   IV 成熟期:    基礎 HP150/ATK45/DEF35, 上限 HP500/ATK140/DEF120
 *   V  完全体:    基礎 HP350/ATK100/DEF80,上限 HP1200/ATK320/DEF270
 *   VI 究極体:    基礎 HP800/ATK230/DEF190,上限 HP3000/ATK800/DEF650
 *
 * 進化条件 (GDD 6.2):
 *   I→II:   HP≥20, ATK≥6, DEF≥5,  ボスなし
 *   II→III: HP≥50, ATK≥18, DEF≥14, W1ボス
 *   III→IV: HP≥130, ATK≥40, DEF≥30, W2ボス
 *   IV→V:   HP≥350, ATK≥95, DEF≥75, W4ボス
 *   V→VI:   HP≥800, ATK≥220, DEF≥180, W6ボス
 *
 * 進化分岐 (GDD 6.3):
 *   TP-L最多 → HP型, TP-M最多 → DEF型, TP-H最多 → ATK型, 均衡 → バランス型
 */

import {
  MonsterDefinition,
  EvolutionStage,
} from "../../types/monster";

import { BABY_I_MONSTERS } from "./baby-i";
import { BABY_II_MONSTERS } from "./baby-ii";
import { ROOKIE_MONSTERS } from "./rookie";
import { CHAMPION_MONSTERS } from "./champion";
import { ULTIMATE_MONSTERS } from "./ultimate";
import { MEGA_MONSTERS } from "./mega";
import { ENEMY_ONLY_MONSTERS } from "./enemy-only";

// Re-export individual stage arrays
export { BABY_I_MONSTERS } from "./baby-i";
export { BABY_II_MONSTERS } from "./baby-ii";
export { ROOKIE_MONSTERS } from "./rookie";
export { CHAMPION_MONSTERS } from "./champion";
export { ULTIMATE_MONSTERS } from "./ultimate";
export { MEGA_MONSTERS } from "./mega";
export { ENEMY_ONLY_MONSTERS } from "./enemy-only";

// ============================================================
// 全モンスター定義マップ
// ============================================================

/** 全モンスター定義マップ */
export const MONSTER_DEFINITIONS: ReadonlyMap<string, MonsterDefinition> =
  new Map(
    [
      ...BABY_I_MONSTERS,
      ...BABY_II_MONSTERS,
      ...ROOKIE_MONSTERS,
      ...CHAMPION_MONSTERS,
      ...ULTIMATE_MONSTERS,
      ...MEGA_MONSTERS,
      ...ENEMY_ONLY_MONSTERS,
    ].map((m) => [m.id, m] as const),
  );

/** 初期モンスター（卵から孵化する幼年期I）のIDリスト */
export const STARTER_MONSTER_IDS = ["botamon", "punimon"] as const;

/**
 * 段階別ステータス基準テーブル（GDD 6.1）
 * 進化直後のデフォルト値とステータス上限の参照用
 */
export const STAGE_STAT_TABLE = {
  [EvolutionStage.BABY_I]: {
    baseHp: 10,
    baseAtk: 3,
    baseDef: 2,
    capHp: 30,
    capAtk: 10,
    capDef: 8,
  },
  [EvolutionStage.BABY_II]: {
    baseHp: 25,
    baseAtk: 8,
    baseDef: 6,
    capHp: 80,
    capAtk: 25,
    capDef: 20,
  },
  [EvolutionStage.ROOKIE]: {
    baseHp: 60,
    baseAtk: 20,
    baseDef: 15,
    capHp: 200,
    capAtk: 60,
    capDef: 50,
  },
  [EvolutionStage.CHAMPION]: {
    baseHp: 150,
    baseAtk: 45,
    baseDef: 35,
    capHp: 500,
    capAtk: 140,
    capDef: 120,
  },
  [EvolutionStage.ULTIMATE]: {
    baseHp: 350,
    baseAtk: 100,
    baseDef: 80,
    capHp: 1200,
    capAtk: 320,
    capDef: 270,
  },
  [EvolutionStage.MEGA]: {
    baseHp: 800,
    baseAtk: 230,
    baseDef: 190,
    capHp: 3000,
    capAtk: 800,
    capDef: 650,
  },
} as const;

/**
 * 進化条件テーブル（GDD 6.2）
 * キー: 進化元の段階 → 進化先の段階
 */
export const EVOLUTION_REQUIREMENTS = {
  [EvolutionStage.BABY_I]: { hp: 20, atk: 6, def: 5, bossWorld: null },
  [EvolutionStage.BABY_II]: { hp: 40, atk: 16, def: 12, bossWorld: 1 },
  [EvolutionStage.ROOKIE]: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  [EvolutionStage.CHAMPION]: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  [EvolutionStage.ULTIMATE]: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
} as const;
