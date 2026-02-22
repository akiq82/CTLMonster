/**
 * ゾーン別擬似TSS → TP変換エンジン
 *
 * GDD.md セクション5.3 に基づく。
 *
 * 計算式:
 *   ゾーン別擬似TSS = (ゾーン滞在秒数 / 3600) × IF係数² × 100
 *
 *   低強度擬似TSS = Z1擬似TSS + Z2擬似TSS
 *   中強度擬似TSS = Z3擬似TSS + Z4擬似TSS
 *   高強度擬似TSS = Z5擬似TSS + Z6擬似TSS + Z7擬似TSS
 *
 *   TP-L = floor(低強度擬似TSS × 0.6)
 *   TP-M = floor(中強度擬似TSS × 0.8)
 *   TP-H = floor(高強度擬似TSS × 1.0)
 *
 * IF係数:
 *   Z1: 0.55, Z2: 0.75, Z3: 0.90, Z4: 1.00, Z5: 1.10, Z6: 1.20, Z7: 1.30
 */

import {
  ZoneTime,
  TrainingPoints,
  ZONE_IF_COEFFICIENTS,
  TP_CONVERSION_RATES,
} from "../types/training";

/**
 * 単一ゾーンの擬似TSSを計算する
 *
 * @param seconds - ゾーン滞在秒数
 * @param ifCoefficient - ゾーンのIF係数
 * @returns 擬似TSS値（小数）
 */
export function calculateZonePseudoTss(
  seconds: number,
  ifCoefficient: number
): number {
  return (seconds / 3600) * ifCoefficient * ifCoefficient * 100;
}

/**
 * 全ゾーンの擬似TSSを3系統（低/中/高強度）に分類して計算する
 *
 * @param zoneTime - ゾーン別滞在時間（秒）
 * @returns { low: 低強度擬似TSS, mid: 中強度擬似TSS, high: 高強度擬似TSS }
 */
export function calculatePseudoTssByIntensity(zoneTime: ZoneTime): {
  low: number;
  mid: number;
  high: number;
} {
  const z1Tss = calculateZonePseudoTss(zoneTime.z1, ZONE_IF_COEFFICIENTS.z1);
  const z2Tss = calculateZonePseudoTss(zoneTime.z2, ZONE_IF_COEFFICIENTS.z2);
  const z3Tss = calculateZonePseudoTss(zoneTime.z3, ZONE_IF_COEFFICIENTS.z3);
  const z4Tss = calculateZonePseudoTss(zoneTime.z4, ZONE_IF_COEFFICIENTS.z4);
  const z5Tss = calculateZonePseudoTss(zoneTime.z5, ZONE_IF_COEFFICIENTS.z5);
  const z6Tss = calculateZonePseudoTss(zoneTime.z6, ZONE_IF_COEFFICIENTS.z6);
  const z7Tss = calculateZonePseudoTss(zoneTime.z7, ZONE_IF_COEFFICIENTS.z7);

  return {
    low: z1Tss + z2Tss,
    mid: z3Tss + z4Tss,
    high: z5Tss + z6Tss + z7Tss,
  };
}

/**
 * ワークアウトのゾーン別滞在時間からTPを計算する
 *
 * GDD.md セクション5.3 の計算式に完全準拠:
 *   TP-L = floor(低強度擬似TSS × 0.6)
 *   TP-M = floor(中強度擬似TSS × 0.8)
 *   TP-H = floor(高強度擬似TSS × 1.0)
 *
 * @param zoneTime - ゾーン別滞在時間（秒）
 * @returns 3系統のTP
 */
export function calculateWorkoutTp(zoneTime: ZoneTime): TrainingPoints {
  const pseudoTss = calculatePseudoTssByIntensity(zoneTime);

  return {
    low: Math.floor(pseudoTss.low * TP_CONVERSION_RATES.low),
    mid: Math.floor(pseudoTss.mid * TP_CONVERSION_RATES.mid),
    high: Math.floor(pseudoTss.high * TP_CONVERSION_RATES.high),
  };
}
