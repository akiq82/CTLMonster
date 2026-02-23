/**
 * 寿命管理エンジン
 *
 * GDD.md セクション8.2, 8.3 に基づく。
 *
 * - 基礎寿命: 7〜9日（孵化時ランダム）
 * - 食事1回につき20%の確率で+0.5日延長
 * - 48時間以上放置で強制死亡
 * - HP回復: 1時間ごとに最大HPの10%自然回復
 */

import { randomFromBuckets, type WeightedBucket, type RngFn } from "../utils/random";

/** 基礎寿命の重み付きバケット分布 (精度: 0.1日)
 *
 * 5〜9日の正規分布的6段階:
 *   5.0-5.9: 5%, 6.0-6.4: 15%, 6.5-6.9: 30%,
 *   7.0-7.4: 30%, 7.5-7.9: 15%, 8.0-9.0: 5%
 *
 * 期待値: 約7.0日
 */
export const BASE_LIFESPAN_BUCKETS: readonly WeightedBucket[] = [
  { min: 5.0, max: 5.9, weight: 0.05 },
  { min: 6.0, max: 6.4, weight: 0.15 },
  { min: 6.5, max: 6.9, weight: 0.30 },
  { min: 7.0, max: 7.4, weight: 0.30 },
  { min: 7.5, max: 7.9, weight: 0.15 },
  { min: 8.0, max: 9.0, weight: 0.05 },
];

/** 食事延長の重み付きバケット分布 (精度: 0.01日)
 *
 * 毎食確定で延長。延長量が正規分布的に変動:
 *   0.03-0.05: 5%, 0.05-0.08: 15%, 0.08-0.11: 30%,
 *   0.11-0.14: 30%, 0.14-0.17: 15%, 0.17-0.25: 5%
 *
 * 期待値: 約0.112日/食 → 毎日3食で期待延長 約3.5日
 */
export const MEAL_EXTENSION_BUCKETS: readonly WeightedBucket[] = [
  { min: 0.03, max: 0.05, weight: 0.05 },
  { min: 0.05, max: 0.08, weight: 0.15 },
  { min: 0.08, max: 0.11, weight: 0.30 },
  { min: 0.11, max: 0.14, weight: 0.30 },
  { min: 0.14, max: 0.17, weight: 0.15 },
  { min: 0.17, max: 0.25, weight: 0.05 },
];

/** 寿命関連定数 */
export const LIFESPAN_CONSTANTS = {
  /** 基礎寿命の最小値（日） */
  BASE_MIN: 5,
  /** 基礎寿命の最大値（日） */
  BASE_MAX: 9,
  /** 強制死亡までの放置時間（時間） */
  FORCE_DEATH_HOURS: 48,
  /** HP自然回復率（1時間あたり、最大HPに対する割合） */
  HP_REGEN_RATE: 0.1,
  /** 放置12h以上のHPペナルティ率 */
  NEGLECT_12H_HP_PENALTY: 0.2,
  /** 放置24h以上のHPペナルティ率 */
  NEGLECT_24H_HP_PENALTY: 0.5,
  /** 寿命死亡判定の実行時刻 (JST時) */
  DEATH_CHECK_HOUR_JST: 4,
  /** JST = UTC+9 のオフセット（時間） */
  JST_OFFSET_HOURS: 9,
} as const;

/**
 * 基礎寿命をランダムに決定する（孵化時に1回呼び出し）
 *
 * 正規分布的な6段階バケットから選択。精度は0.1日。
 *   5.0-5.9: 5%, 6.0-6.4: 15%, 6.5-6.9: 30%,
 *   7.0-7.4: 30%, 7.5-7.9: 15%, 8.0-9.0: 5%
 *
 * @param rng - 乱数生成関数
 * @returns 基礎寿命（5.0〜9.0日, 0.1日刻み）
 */
export function rollBaseLifespan(rng: RngFn = Math.random): number {
  return randomFromBuckets(BASE_LIFESPAN_BUCKETS, 0.1, rng);
}

/**
 * 食事による寿命延長量を決定する
 *
 * 毎食確定で延長。延長量は正規分布的な6段階バケットから選択。
 *   0.03-0.05: 5%, 0.05-0.08: 15%, 0.08-0.11: 30%,
 *   0.11-0.14: 30%, 0.14-0.17: 15%, 0.17-0.25: 5%
 *
 * 期待値: 約0.112日/食 (≈2.7時間)
 *
 * @param rng - 乱数生成関数
 * @returns 延長日数（0.03〜0.25日, 0.01日刻み）
 */
export function rollMealLifespanExtension(rng: RngFn = Math.random): number {
  return randomFromBuckets(MEAL_EXTENSION_BUCKETS, 0.01, rng);
}

/**
 * 寿命到達かどうかを判定する
 *
 * @param bornAt - 誕生日時 (ISO string)
 * @param baseLifespan - 基礎寿命（日）
 * @param lifespanExtension - 食事による延長（日）
 * @param now - 現在日時
 * @returns 寿命到達ならtrue
 */
export function isLifespanReached(
  bornAt: string,
  baseLifespan: number,
  lifespanExtension: number,
  now: Date = new Date()
): boolean {
  const bornDate = new Date(bornAt);
  const totalLifespanMs = (baseLifespan + lifespanExtension) * 24 * 60 * 60 * 1000;
  return now.getTime() - bornDate.getTime() >= totalLifespanMs;
}

/**
 * 放置による強制死亡かどうかを判定する
 *
 * GDD 8.3: 48時間以上ログインなし → 死亡
 *
 * @param lastLoginAt - 最終ログイン日時 (ISO string)
 * @param now - 現在日時
 * @returns 強制死亡ならtrue
 */
export function isNeglectDeath(
  lastLoginAt: string,
  now: Date = new Date()
): boolean {
  const lastLogin = new Date(lastLoginAt);
  const hoursAbsent =
    (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
  return hoursAbsent >= LIFESPAN_CONSTANTS.FORCE_DEATH_HOURS;
}

/**
 * 放置時間を時間単位で取得する
 */
export function getHoursAbsent(
  lastLoginAt: string,
  now: Date = new Date()
): number {
  const lastLogin = new Date(lastLoginAt);
  return (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
}

/**
 * HP自然回復量を計算する
 *
 * GDD 7.2: 1時間ごとに最大HPの10%自然回復
 *
 * @param maxHp - 最大HP
 * @param hours - 経過時間（時間）
 * @returns 回復量
 */
export function calculateHpRegen(maxHp: number, hours: number): number {
  return Math.floor(maxHp * LIFESPAN_CONSTANTS.HP_REGEN_RATE * hours);
}

/**
 * 放置によるHPペナルティ量を計算する
 *
 * GDD 8.3:
 *   12h+: HP -20%
 *   24h+: HP -50%
 *
 * @param maxHp - 最大HP
 * @param hoursAbsent - 放置時間
 * @returns HPペナルティ量（正の値）
 */
export function calculateNeglectHpPenalty(
  maxHp: number,
  hoursAbsent: number
): number {
  if (hoursAbsent >= 24) {
    return Math.floor(maxHp * LIFESPAN_CONSTANTS.NEGLECT_24H_HP_PENALTY);
  }
  if (hoursAbsent >= 12) {
    return Math.floor(maxHp * LIFESPAN_CONSTANTS.NEGLECT_12H_HP_PENALTY);
  }
  return 0;
}

/**
 * 現在の「死亡判定日」を YYYY-MM-DD 形式で返す
 *
 * 死亡判定は JST 4:00 に1日1回実行する。
 * JST 0:00〜3:59 の間は前日の判定日として扱う。
 *
 * 例:
 *   JST 2026-02-23 03:59 → "2026-02-22" (前日分の判定日)
 *   JST 2026-02-23 04:00 → "2026-02-23" (当日分の判定日)
 *
 * @param now - 現在日時 (UTC)
 * @returns 死亡判定日 (YYYY-MM-DD)
 */
export function getDeathCheckDay(now: Date = new Date()): string {
  // UTC → JST (UTC+9)
  const jstMs = now.getTime() + LIFESPAN_CONSTANTS.JST_OFFSET_HOURS * 60 * 60 * 1000;
  const jst = new Date(jstMs);

  // JST 0:00〜3:59 は前日扱い
  if (jst.getUTCHours() < LIFESPAN_CONSTANTS.DEATH_CHECK_HOUR_JST) {
    jst.setUTCDate(jst.getUTCDate() - 1);
  }

  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 寿命死亡判定を今実行すべきかどうか判定する
 *
 * JST 4:00 以降で、かつ今日の判定がまだ実行されていない場合にtrueを返す。
 *
 * @param lastDeathCheckDate - 最後に死亡判定を実行した日 (YYYY-MM-DD)
 * @param now - 現在日時
 * @returns 判定実行すべきならtrue
 */
export function shouldRunDeathCheck(
  lastDeathCheckDate: string,
  now: Date = new Date()
): boolean {
  const today = getDeathCheckDay(now);
  return today !== lastDeathCheckDate;
}
