/**
 * WPエンカウント判定エンジン
 *
 * GDD.md セクション3.2, 7.1 に基づく。
 *
 * - エンカウント1回 = 3,000 WP消費
 * - ボス戦 = 5,000 WP消費
 * - エンカウント成功率 = 80%（20%で空振り: WPは消費するがバトルなし）
 * - ボス到達条件: 15体のモブ撃破
 */

import { WP_CONSTANTS } from "../types/battle";
import type { WorldDefinition, EnemyDefinition } from "../types/world";
import type { BattleFighter } from "../types/battle";
import { chance, randomPick, randomInt, type RngFn } from "../utils/random";

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
 * エンカウント成功判定（80%成功 / 20%空振り）
 * ボス戦は常に成功。
 *
 * @param isBoss - ボス戦かどうか
 * @param rng - 乱数生成関数
 * @returns エンカウント成功ならtrue
 */
export function rollEncounter(
  isBoss: boolean,
  rng: RngFn = Math.random
): boolean {
  if (isBoss) return true;
  return chance(WP_CONSTANTS.ENCOUNTER_SUCCESS_RATE, rng);
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
