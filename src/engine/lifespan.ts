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

import { randomInt, chance, type RngFn } from "../utils/random";

/** 寿命関連定数 */
export const LIFESPAN_CONSTANTS = {
  /** 基礎寿命の最小値（日） */
  BASE_MIN: 7,
  /** 基礎寿命の最大値（日） */
  BASE_MAX: 9,
  /** 食事による寿命延長確率 */
  MEAL_EXTENSION_CHANCE: 0.2,
  /** 食事1回あたりの延長日数 */
  MEAL_EXTENSION_DAYS: 0.5,
  /** 強制死亡までの放置時間（時間） */
  FORCE_DEATH_HOURS: 48,
  /** HP自然回復率（1時間あたり、最大HPに対する割合） */
  HP_REGEN_RATE: 0.1,
  /** 放置12h以上のHPペナルティ率 */
  NEGLECT_12H_HP_PENALTY: 0.2,
  /** 放置24h以上のHPペナルティ率 */
  NEGLECT_24H_HP_PENALTY: 0.5,
} as const;

/**
 * 基礎寿命をランダムに決定する（孵化時に1回呼び出し）
 *
 * @param rng - 乱数生成関数
 * @returns 基礎寿命（7〜9日）
 */
export function rollBaseLifespan(rng: RngFn = Math.random): number {
  return randomInt(LIFESPAN_CONSTANTS.BASE_MIN, LIFESPAN_CONSTANTS.BASE_MAX, rng);
}

/**
 * 食事による寿命延長を試みる
 *
 * GDD: 1回の食事につき20%の確率で寿命+0.5日
 *
 * @param rng - 乱数生成関数
 * @returns 延長日数（0 or 0.5）
 */
export function rollMealLifespanExtension(rng: RngFn = Math.random): number {
  if (chance(LIFESPAN_CONSTANTS.MEAL_EXTENSION_CHANCE, rng)) {
    return LIFESPAN_CONSTANTS.MEAL_EXTENSION_DAYS;
  }
  return 0;
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
