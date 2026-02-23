/**
 * 全モンスター定義
 *
 * GDD.md セクション6 に基づく。
 *
 * 進化段階別ステータス基準:
 *   I  幼年期I:   上限 HP50/ATK30/DEF25       (×1倍率)
 *   II 幼年期II:  上限 HP200/ATK80/DEF65       (×2倍率)
 *   III 成長期:   上限 HP600/ATK250/DEF200     (×5倍率)
 *   IV 成熟期:    上限 HP2500/ATK800/DEF650    (×10倍率)
 *   V  完全体:    上限 HP6000/ATK2500/DEF2000  (×25倍率)
 *   VI 究極体:    上限 HP15000/ATK5000/DEF4000 (×60倍率)
 *
 * 進化条件 (比例方式: statCap × ratio):
 *   I→II:   HP×0.25, ATK×0.25, DEF×0.25, ボスなし
 *   II→III: HP×0.20, ATK×0.22, DEF×0.22, ボスなし
 *   III→IV: HP×0.15, ATK×0.18, DEF×0.18, W1ボス
 *   IV→V:   HP×0.10, ATK×0.12, DEF×0.12, W3ボス
 *   V→VI:   HP×0.08, ATK×0.10, DEF×0.10, W8ボス
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
export const STARTER_MONSTER_IDS = ["botamon", "punimon", "chibomon"] as const;

/**
 * 段階別ステータス基準テーブル（GDD 6.1）
 * 進化直後のデフォルト値とステータス上限の参照用
 */
export const STAGE_STAT_TABLE = {
  [EvolutionStage.BABY_I]: {
    baseHp: 17,
    baseAtk: 9,
    baseDef: 6,
    capHp: 50,
    capAtk: 30,
    capDef: 25,
  },
  [EvolutionStage.BABY_II]: {
    baseHp: 63,
    baseAtk: 26,
    baseDef: 20,
    capHp: 200,
    capAtk: 80,
    capDef: 65,
  },
  [EvolutionStage.ROOKIE]: {
    baseHp: 195,
    baseAtk: 83,
    baseDef: 60,
    capHp: 600,
    capAtk: 250,
    capDef: 200,
  },
  [EvolutionStage.CHAMPION]: {
    baseHp: 800,
    baseAtk: 257,
    baseDef: 189,
    capHp: 2500,
    capAtk: 800,
    capDef: 650,
  },
  [EvolutionStage.ULTIMATE]: {
    baseHp: 1900,
    baseAtk: 781,
    baseDef: 629,
    capHp: 6000,
    capAtk: 2500,
    capDef: 2000,
  },
  [EvolutionStage.MEGA]: {
    baseHp: 4250,
    baseAtk: 1437,
    baseDef: 1169,
    capHp: 15000,
    capAtk: 5000,
    capDef: 4000,
  },
} as const;

/**
 * 進化条件テーブル（GDD 6.2）
 * キー: 進化元の段階 → 進化先の段階
 */
export const EVOLUTION_REQUIREMENTS = {
  [EvolutionStage.BABY_I]: { hp: 50, atk: 20, def: 16, bossWorld: null },
  [EvolutionStage.BABY_II]: { hp: 120, atk: 55, def: 44, bossWorld: null as number | null },
  [EvolutionStage.ROOKIE]: { hp: 375, atk: 144, def: 117, bossWorld: 1 as number | null },
  [EvolutionStage.CHAMPION]: { hp: 600, atk: 300, def: 240, bossWorld: 3 as number | null },
  [EvolutionStage.ULTIMATE]: { hp: 1200, atk: 500, def: 400, bossWorld: 8 as number | null },
} as const;
