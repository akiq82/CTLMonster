/**
 * 乱数ヘルパー
 *
 * テスト可能性のためにRNG関数を外部注入できる設計。
 * デフォルトはMath.random()を使用。
 */

/** 乱数生成関数の型（0以上1未満を返す） */
export type RngFn = () => number;

/**
 * min以上max以下のランダム整数を返す
 *
 * @param min - 最小値（含む）
 * @param max - 最大値（含む）
 * @param rng - 乱数生成関数（テスト用に差し替え可能）
 */
export function randomInt(
  min: number,
  max: number,
  rng: RngFn = Math.random
): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * min以上max以下のランダム浮動小数点数を返す
 *
 * @param min - 最小値（含む）
 * @param max - 最大値（含む）
 * @param rng - 乱数生成関数
 */
export function randomFloat(
  min: number,
  max: number,
  rng: RngFn = Math.random
): number {
  return rng() * (max - min) + min;
}

/**
 * 指定確率でtrueを返す
 *
 * @param probability - 確率（0.0〜1.0）
 * @param rng - 乱数生成関数
 */
export function chance(
  probability: number,
  rng: RngFn = Math.random
): boolean {
  return rng() < probability;
}

/**
 * 配列からランダムに1要素を選ぶ
 *
 * @param array - 対象配列（空でないこと）
 * @param rng - 乱数生成関数
 */
export function randomPick<T>(array: readonly T[], rng: RngFn = Math.random): T {
  return array[Math.floor(rng() * array.length)];
}
