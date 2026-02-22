/**
 * ワールド進行管理エンジン
 *
 * GDD.md セクション7.3 に基づく。
 *
 * - 各ワールド: 15体モブ撃破 → ボス戦
 * - 一度クリアしたワールドの次のワールドを選択可能
 * - 全8ワールド
 */

import type { WorldProgress, WorldDefinition } from "../types/world";
import { WORLD_CONSTANTS } from "../types/world";
import { WORLD_DEFINITIONS, WORLD_MAP } from "../data/worlds";

/**
 * 初期ワールド進行状態を作成する（W1から開始）
 *
 * @returns W1の初期進行状態
 */
export function createInitialWorldProgress(): WorldProgress {
  return {
    worldNumber: 1,
    killCount: 0,
    bossDefeated: false,
  };
}

/**
 * モブ撃破を記録する
 *
 * @param progress - 現在の進行状態
 * @returns 更新された進行状態
 */
export function recordMobKill(progress: WorldProgress): WorldProgress {
  return {
    ...progress,
    killCount: progress.killCount + 1,
  };
}

/**
 * ボス撃破を記録する
 *
 * @param progress - 現在の進行状態
 * @returns 更新された進行状態
 */
export function recordBossDefeat(progress: WorldProgress): WorldProgress {
  return {
    ...progress,
    bossDefeated: true,
  };
}

/**
 * ボスに挑戦可能か判定する
 *
 * @param progress - 現在の進行状態
 * @returns ボス挑戦可能ならtrue
 */
export function canChallengeBoss(progress: WorldProgress): boolean {
  return (
    progress.killCount >= WORLD_CONSTANTS.REQUIRED_KILLS &&
    !progress.bossDefeated
  );
}

/**
 * 選択可能なワールド番号リストを返す
 *
 * GDD: 一度クリアしたワールドの次のワールドを選択可能（新規個体でも）
 *
 * @param clearedWorlds - クリア済みワールド進行状態のマップ
 * @returns 選択可能なワールド番号の配列
 */
export function getAvailableWorlds(
  clearedWorlds: ReadonlyMap<number, WorldProgress>
): number[] {
  const available: number[] = [1]; // W1は常に選択可能

  for (let w = 1; w < WORLD_CONSTANTS.TOTAL_WORLDS; w++) {
    const progress = clearedWorlds.get(w);
    if (progress?.bossDefeated) {
      available.push(w + 1);
    }
  }

  return [...new Set(available)].sort((a, b) => a - b);
}

/**
 * 指定ワールドの定義を取得する
 *
 * @param worldNumber - ワールド番号 (1-8)
 * @returns ワールド定義
 * @throws ワールドが見つからない場合
 */
export function getWorldDefinition(worldNumber: number): WorldDefinition {
  const world = WORLD_MAP.get(worldNumber);
  if (!world) {
    throw new Error(`Invalid world number: ${worldNumber}`);
  }
  return world;
}

/**
 * ワールドの進行率を計算する（UI表示用）
 *
 * @param progress - 現在の進行状態
 * @returns 進行率 (0.0〜1.0)
 */
export function getWorldProgressRate(progress: WorldProgress): number {
  if (progress.bossDefeated) return 1.0;
  // 15体 + ボス = 16段階
  const total = WORLD_CONSTANTS.REQUIRED_KILLS + 1;
  return Math.min(progress.killCount / total, WORLD_CONSTANTS.REQUIRED_KILLS / total);
}
