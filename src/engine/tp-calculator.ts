/**
 * ワークアウトTP変換エンジン
 *
 * TSS 1 = TP 1 の原則で、実TSSをゾーン別擬似TSS比率でL/M/Hに分配する。
 *
 * 計算式:
 *   1. ゾーン別擬似TSS = (ゾーン滞在秒数 / 3600) × IF係数² × 100
 *   2. 低/中/高強度の擬似TSS比率を計算
 *   3. 実TSS × 各比率 → TP-L/M/H (floor)
 *
 * IF係数:
 *   Z1: 0.55, Z2: 0.75, Z3: 0.90, Z4: 1.00, Z5: 1.10, Z6: 1.20, Z7: 1.30
 */

import {
  ZoneTime,
  TrainingPoints,
  ZONE_IF_COEFFICIENTS,
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
 * ワークアウトの実TSSをゾーン別擬似TSS比率でTP-L/M/Hに分配する
 *
 * TSS 1 = TP 1 の原則:
 *   1. ゾーン別擬似TSSで低/中/高の比率を計算
 *   2. 実TSS × 各比率 → floor → TP
 *
 * 例: TSS=97, 擬似TSS比率 L:80%/M:19%/H:1% → L:77, M:18, H:0 (合計95)
 *
 * @param zoneTime - ゾーン別滞在時間（秒）
 * @param tss - ワークアウトの実TSS
 * @returns 3系統のTP
 */
export function calculateWorkoutTp(zoneTime: ZoneTime, tss: number): TrainingPoints {
  const pseudoTss = calculatePseudoTssByIntensity(zoneTime);
  const totalPseudoTss = pseudoTss.low + pseudoTss.mid + pseudoTss.high;

  if (totalPseudoTss === 0 || tss <= 0) {
    return { low: 0, mid: 0, high: 0 };
  }

  return {
    low: Math.floor(tss * (pseudoTss.low / totalPseudoTss)),
    mid: Math.floor(tss * (pseudoTss.mid / totalPseudoTss)),
    high: Math.floor(tss * (pseudoTss.high / totalPseudoTss)),
  };
}
