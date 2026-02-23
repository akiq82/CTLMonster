/**
 * WPエンカウント判定エンジン
 *
 * GDD.md セクション3.2, 7.1 に基づく。
 *
 * - エンカウント1回 = 2,000 WP消費（確定バトル、空振りなし）
 * - ボス戦 = 3,000 WP消費
 * - ボス到達条件: 10体のモブ撃破
 * - ライドWP: 1km = 250WP, 獲得標高1m = 10WP
 */

import { WP_CONSTANTS } from "../types/battle";
import type { WorldDefinition, EnemyDefinition } from "../types/world";
import type { BattleFighter } from "../types/battle";
import { randomPick, randomInt, type RngFn } from "../utils/random";

/**
 * エンカウント可能かどうか（WPが足りるか）
 *
 * @param currentWp - 現在のWP
 * @param isBoss - ボス戦かどうか
 * @returns エンカウント可能ならtrue
 */
export function canEncounter(currentWp: number, isBoss: boolean): boolean {
  const cost = isBoss ? WP_CONSTANTS.BOSS_WP_COST : WP_CONSTANTS.ENCOUNTER_WP_COST;
  return currentWp >= cost;
}

/**
 * エンカウントのWPコストを返す
 */
export function getEncounterCost(isBoss: boolean): number {
  return isBoss ? WP_CONSTANTS.BOSS_WP_COST : WP_CONSTANTS.ENCOUNTER_WP_COST;
}

/**
 * ワールドの敵テーブルからランダムに敵を生成する
 *
 * @param enemies - 敵定義リスト
 * @param rng - 乱数生成関数
 * @returns バトル用の敵ファイター
 */
export function generateEnemy(
  enemies: readonly EnemyDefinition[],
  rng: RngFn = Math.random
): BattleFighter {
  const enemy = randomPick(enemies, rng);
  const hp = randomInt(enemy.hp.min, enemy.hp.max, rng);
  const atk = randomInt(enemy.atk.min, enemy.atk.max, rng);
  const def = randomInt(enemy.def.min, enemy.def.max, rng);

  return {
    name: enemy.monsterId,
    currentHp: hp,
    maxHp: hp,
    atk,
    def,
    discipline: enemy.discipline,
  };
}

/**
 * ボスのバトルファイターを生成する
 *
 * @param world - ワールド定義
 * @returns バトル用のボスファイター
 */
export function generateBoss(world: WorldDefinition): BattleFighter {
  return {
    name: world.boss.monsterId,
    currentHp: world.boss.hp,
    maxHp: world.boss.hp,
    atk: world.boss.atk,
    def: world.boss.def,
    discipline: world.boss.discipline,
  };
}

/** WP→エンカウント変換の結果 */
export interface WpConversionResult {
  /** 獲得したエンカウント回数（確定バトル） */
  encountersGained: number;
  /** 変換後の残余WP（2000未満の端数） */
  wpRemaining: number;
}

/**
 * WPをエンカウント回数に変換する。
 *
 * 2000 WPごとに1回の確定バトル（空振りなし）。
 *
 * @param currentWp - 現在のWP
 * @returns 変換結果（エンカウント数、残余WP）
 */
export function convertWpToEncounters(
  currentWp: number
): WpConversionResult {
  const encountersGained = Math.floor(currentWp / WP_CONSTANTS.ENCOUNTER_WP_COST);
  const wpRemaining = currentWp % WP_CONSTANTS.ENCOUNTER_WP_COST;

  return { encountersGained, wpRemaining };
}

/**
 * ボス戦に挑戦可能か（必要撃破数を満たしているか）
 *
 * @param killCount - 現在の撃破数
 * @param requiredKills - 必要な撃破数
 * @returns ボス挑戦可能ならtrue
 */
export function canChallengeBoss(
  killCount: number,
  requiredKills: number
): boolean {
  return killCount >= requiredKills;
}

/**
 * ライドデータからWPを計算する
 *
 * @param distanceKm - 走行距離 (km)
 * @param elevationGainM - 獲得標高 (meters)
 * @returns 獲得WP
 */
export function calculateRideWp(
  distanceKm: number,
  elevationGainM: number
): number {
  const distanceWp = Math.floor(distanceKm * WP_CONSTANTS.WP_PER_RIDE_KM);
  const elevationWp = Math.floor(elevationGainM * WP_CONSTANTS.WP_PER_RIDE_ELEVATION_M);
  return distanceWp + elevationWp;
}
