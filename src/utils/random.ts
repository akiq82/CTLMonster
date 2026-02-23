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

/**
 * 指定精度のランダム小数を返す (min〜max, precision刻み)
 *
 * @param min - 最小値（含む）
 * @param max - 最大値（含む）
 * @param precision - 刻み幅 (例: 0.1)
 * @param rng - 乱数生成関数
 */
export function randomDecimal(
  min: number,
  max: number,
  precision: number = 0.1,
  rng: RngFn = Math.random
): number {
  const steps = Math.round((max - min) / precision);
  const step = Math.floor(rng() * (steps + 1));
  return Math.round((min + step * precision) * 10) / 10;
}

/** 重み付きバケット定義 */
export interface WeightedBucket {
  /** バケット下限 (含む) */
  readonly min: number;
  /** バケット上限 (含まない。ただし最後のバケットは含む) */
  readonly max: number;
  /** 選択確率 (0.0〜1.0, 合計1.0) */
  readonly weight: number;
}

/**
 * 重み付きバケットからランダムに値を選ぶ
 *
 * 1. rng1 でバケットを確率に基づき選択
 * 2. rng2 でバケット内の値を均一ランダムに選択
 * 3. precision で小数点丸め (例: 0.1 → 小数第1位)
 *
 * @param buckets - 重み付きバケット配列 (weight合計 = 1.0)
 * @param precision - 値の精度 (例: 0.1, 0.01)
 * @param rng - 乱数生成関数 (バケット選択とバケット内選択の両方に使用)
 * @returns バケットから選ばれた値
 */
export function randomFromBuckets(
  buckets: readonly WeightedBucket[],
  precision: number,
  rng: RngFn = Math.random
): number {
  // バケット選択
  const r1 = rng();
  let cumulative = 0;
  let selected = buckets[buckets.length - 1];
  for (const bucket of buckets) {
    cumulative += bucket.weight;
    if (r1 < cumulative) {
      selected = bucket;
      break;
    }
  }

  // バケット内でランダム値を生成
  const raw = rng() * (selected.max - selected.min) + selected.min;

  // 精度に丸め (min以上max以下にクランプ)
  const rounded = Math.round(raw / precision) * precision;
  // 浮動小数点誤差対策
  const digits = Math.round(-Math.log10(precision));
  const result = parseFloat(rounded.toFixed(digits));

  return Math.max(selected.min, Math.min(selected.max, result));
}
