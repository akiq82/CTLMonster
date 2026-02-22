/**
 * 規律パラメータ変動エンジン
 *
 * GDD.md セクション4.2, 8.3 に基づく。
 *
 * 日次変動テーブル (PMCランク × 前日食事回数):
 *   A(CTL≥80,TSB≤-15) + 3食: +5〜+8,  2食: +3〜+6,  1食: +1〜+3,  0食: -1〜+1
 *   B(CTL≥65,TSB≤0)   + 3食: +3〜+6,  2食: +2〜+4,  1食: 0〜+2,   0食: -2〜0
 *   C(CTL≥50,TSB≤+15) + 3食: +1〜+4,  2食: 0〜+2,   1食: -1〜+1,  0食: -3〜-1
 *   D(CTL<50,TSB>+15)  + 3食: 0〜+2,   2食: -1〜+1,  1食: -2〜0,   0食: -4〜-2
 *
 * 放置ペナルティ:
 *   8h+:  -5〜-10
 *   12h+: -10〜-15
 *   24h+: -20
 *   48h+: 死亡（別モジュールで処理）
 */

import { PmcRank } from "../types/ride-metrics";
import { clamp } from "../utils/clamp";
import { randomInt, type RngFn } from "../utils/random";

/** 規律の範囲 */
const DISCIPLINE_MIN = 0;
const DISCIPLINE_MAX = 100;

/**
 * 規律日次変動テーブル
 * [PMCランク][食事回数] = { min, max }
 */
const DISCIPLINE_CHANGE_TABLE: Record<
  PmcRank,
  Record<number, { min: number; max: number }>
> = {
  [PmcRank.A]: {
    3: { min: 5, max: 8 },
    2: { min: 3, max: 6 },
    1: { min: 1, max: 3 },
    0: { min: -1, max: 1 },
  },
  [PmcRank.B]: {
    3: { min: 3, max: 6 },
    2: { min: 2, max: 4 },
    1: { min: 0, max: 2 },
    0: { min: -2, max: 0 },
  },
  [PmcRank.C]: {
    3: { min: 1, max: 4 },
    2: { min: 0, max: 2 },
    1: { min: -1, max: 1 },
    0: { min: -3, max: -1 },
  },
  [PmcRank.D]: {
    3: { min: 0, max: 2 },
    2: { min: -1, max: 1 },
    1: { min: -2, max: 0 },
    0: { min: -4, max: -2 },
  },
};

/**
 * 日次の規律変動量を計算する
 *
 * @param pmcRank - PMCボーナスランク
 * @param yesterdayMeals - 前日の食事回数 (0-3)
 * @param rng - 乱数生成関数
 * @returns 規律変動量
 */
export function calculateDailyDisciplineChange(
  pmcRank: PmcRank,
  yesterdayMeals: number,
  rng: RngFn = Math.random
): number {
  const mealCount = clamp(yesterdayMeals, 0, 3);
  const range = DISCIPLINE_CHANGE_TABLE[pmcRank][mealCount];
  return randomInt(range.min, range.max, rng);
}

/**
 * 放置ペナルティによる規律変動量を計算する
 *
 * GDD 8.3:
 *   8h+: -5〜-10
 *   12h+: -10〜-15
 *   24h+: -20
 *   48h+ → 死亡（この関数では規律のみ。死亡はlifespan.tsで判定）
 *
 * @param hoursAbsent - 放置時間（時間）
 * @param rng - 乱数生成関数
 * @returns 規律変動量（0以下）
 */
export function calculateNeglectPenalty(
  hoursAbsent: number,
  rng: RngFn = Math.random
): number {
  if (hoursAbsent >= 24) return -20;
  if (hoursAbsent >= 12) return randomInt(-15, -10, rng);
  if (hoursAbsent >= 8) return randomInt(-10, -5, rng);
  return 0;
}

/**
 * 規律を更新し、0-100の範囲にクランプする
 *
 * @param currentDiscipline - 現在の規律
 * @param change - 変動量
 * @returns 更新後の規律
 */
export function applyDisciplineChange(
  currentDiscipline: number,
  change: number
): number {
  return clamp(currentDiscipline + change, DISCIPLINE_MIN, DISCIPLINE_MAX);
}
