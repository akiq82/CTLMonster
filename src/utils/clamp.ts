/**
 * 数値を指定範囲内に収める
 *
 * @param value - 対象の数値
 * @param min - 最小値
 * @param max - 最大値
 * @returns min以上max以下にクランプされた値
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
