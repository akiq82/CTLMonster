/**
 * 全モンスター定義
 *
 * 段階別トレーニング倍率: ×1.0/×1.2/×1.4/×1.6/×1.8/×2.0 (緩やか)
 * パターン間の差別化はTP供給量（ライド頻度・強度）で実現。
 *
 * 進化段階別ステータス基準:
 *   I  幼年期I:   上限 HP50/ATK30/DEF25       (×1.0)
 *   II 幼年期II:  上限 HP100/ATK45/DEF36       (×1.2)
 *   III 成長期:   上限 HP250/ATK110/DEF90      (×1.4)
 *   IV 成熟期:    上限 HP600/ATK260/DEF210     (×1.6)
 *   V  完全体:    上限 HP1500/ATK650/DEF530    (×1.8)
 *   VI 究極体:    上限 HP3500/ATK1500/DEF1200  (×2.0)
 *
 * 進化条件（装備品は寄与しない、純粋なトレーニング成果のみ）:
 *   I→II:   HP22/ATK14/DEF11, ボスなし
 *   II→III: HP35/ATK20/DEF17, ボスなし
 *   III→IV: HP50/ATK32/DEF27, ボスなし
 *   IV→V:   HP90/ATK50/DEF43, ボスなし (CTL60ギリギリ不可、CTL70到達)
 *   V→VI:   HP180/ATK100/DEF85, ボスなし (CTL80到達、CTL90確実)
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
    baseHp: 40,
    baseAtk: 18,
    baseDef: 14,
    capHp: 100,
    capAtk: 45,
    capDef: 36,
  },
  [EvolutionStage.ROOKIE]: {
    baseHp: 90,
    baseAtk: 40,
    baseDef: 32,
    capHp: 250,
    capAtk: 110,
    capDef: 90,
  },
  [EvolutionStage.CHAMPION]: {
    baseHp: 200,
    baseAtk: 88,
    baseDef: 70,
    capHp: 600,
    capAtk: 260,
    capDef: 210,
  },
  [EvolutionStage.ULTIMATE]: {
    baseHp: 450,
    baseAtk: 200,
    baseDef: 160,
    capHp: 1500,
    capAtk: 650,
    capDef: 530,
  },
  [EvolutionStage.MEGA]: {
    baseHp: 1000,
    baseAtk: 440,
    baseDef: 350,
    capHp: 3500,
    capAtk: 1500,
    capDef: 1200,
  },
} as const;

/**
 * 進化条件テーブル（GDD 6.2）
 * キー: 進化元の段階 → 進化先の段階
 */
export const EVOLUTION_REQUIREMENTS = {
  [EvolutionStage.BABY_I]: { hp: 22, atk: 14, def: 11, bossWorld: null },
  [EvolutionStage.BABY_II]: { hp: 35, atk: 20, def: 17, bossWorld: null as number | null },
  [EvolutionStage.ROOKIE]: { hp: 50, atk: 32, def: 27, bossWorld: null as number | null },
  [EvolutionStage.CHAMPION]: { hp: 90, atk: 50, def: 43, bossWorld: null as number | null },
  [EvolutionStage.ULTIMATE]: { hp: 180, atk: 100, def: 85, bossWorld: null as number | null },
} as const;
