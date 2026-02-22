/**
 * PMCボーナス計算エンジン
 *
 * GDD.md セクション5.2 に基づく。
 * 朝ログイン時に1日1回、CTL/TSBと前日歩数から基礎TPを算出。
 *
 * 計算式:
 *   CTLボーナス = (clamp(CTL, 50, 100) - 50) / 50       // 0.0〜1.0
 *   TSBボーナス = (15 - clamp(TSB, -30, 15)) / 45        // 0.0〜1.0
 *   PMC係数 = 0.5 + (CTLボーナス × 0.7) + (TSBボーナス × 0.3)  // 0.5〜1.5
 *   歩数係数 = min(前日歩数 / 10000, 1.5)                // 0〜1.5
 *   基礎TP = floor(8 × PMC係数 × 歩数係数)
 *
 * 配分: 基礎TPは均等に3系統へ分配（端数はTP-Lへ）
 *
 * PMCランク判定 (GDD 4.2 規律テーブル用):
 *   A: CTL≥80, TSB≤-15
 *   B: CTL≥65, TSB≤0
 *   C: CTL≥50, TSB≤+15
 *   D: CTL<50 or TSB>+15
 */

import { clamp } from "../utils/clamp";
import { PmcRank } from "../types/ride-metrics";
import type { PmcBonusResult } from "../types/ride-metrics";

/**
 * PMC係数を計算する
 *
 * @param ctl - Chronic Training Load
 * @param tsb - Training Stress Balance
 * @returns PMC係数 (0.5〜1.5)
 */
export function calculatePmcFactor(ctl: number, tsb: number): number {
  const ctlBonus = (clamp(ctl, 50, 100) - 50) / 50;
  const tsbBonus = (15 - clamp(tsb, -30, 15)) / 45;
  return 0.5 + ctlBonus * 0.7 + tsbBonus * 0.3;
}

/**
 * 歩数係数を計算する
 *
 * @param steps - 前日歩数
 * @returns 歩数係数 (0〜1.5)
 */
export function calculateStepsFactor(steps: number): number {
  return Math.min(steps / 10000, 1.5);
}

/**
 * PMCランクを判定する
 *
 * @param ctl - Chronic Training Load
 * @param tsb - Training Stress Balance
 * @returns PMCランク (A/B/C/D)
 */
export function determinePmcRank(ctl: number, tsb: number): PmcRank {
  if (ctl >= 80 && tsb <= -15) return PmcRank.A;
  if (ctl >= 65 && tsb <= 0) return PmcRank.B;
  if (ctl >= 50 && tsb <= 15) return PmcRank.C;
  return PmcRank.D;
}

/**
 * PMCボーナスを計算する（朝ログイン時に1日1回呼び出し）
 *
 * @param ctl - Chronic Training Load
 * @param tsb - Training Stress Balance
 * @param yesterdaySteps - 前日歩数
 * @returns PMCボーナス計算結果
 */
export function calculatePmcBonus(
  ctl: number,
  tsb: number,
  yesterdaySteps: number
): PmcBonusResult {
  const rank = determinePmcRank(ctl, tsb);
  const pmcFactor = calculatePmcFactor(ctl, tsb);
  const stepsFactor = calculateStepsFactor(yesterdaySteps);
  const totalTp = Math.floor(8 * pmcFactor * stepsFactor);

  // 均等に3系統へ分配（端数はTP-Lへ）
  const perSystem = Math.floor(totalTp / 3);
  const remainder = totalTp - perSystem * 3;

  return {
    rank,
    pmcFactor,
    stepsFactor,
    totalTp,
    tpL: perSystem + remainder,
    tpM: perSystem,
    tpH: perSystem,
  };
}
