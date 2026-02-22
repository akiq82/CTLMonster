/**
 * ワールド関連の型定義
 * GDD.md セクション7.3, 7.4 に基づく
 */

/** ステータス範囲 */
export interface StatRange {
  readonly min: number;
  readonly max: number;
}

/** 敵モンスター定義 */
export interface EnemyDefinition {
  /** モンスター定義ID */
  readonly monsterId: string;
  /** HP範囲 */
  readonly hp: StatRange;
  /** ATK範囲 */
  readonly atk: StatRange;
  /** DEF範囲 */
  readonly def: StatRange;
  /** 規律値 (敵は固定値) */
  readonly discipline: number;
}

/** ボス定義 */
export interface BossDefinition {
  /** モンスター定義ID */
  readonly monsterId: string;
  /** HP (固定値) */
  readonly hp: number;
  /** ATK (固定値) */
  readonly atk: number;
  /** DEF (固定値) */
  readonly def: number;
  /** 規律値 */
  readonly discipline: number;
}

/** ワールド定義 */
export interface WorldDefinition {
  /** ワールド番号 (1-8) */
  readonly worldNumber: number;
  /** ワールド名 */
  readonly name: string;
  /** ワールド説明 */
  readonly description: string;
  /** モブ敵テーブル */
  readonly enemies: readonly EnemyDefinition[];
  /** ボス定義 */
  readonly boss: BossDefinition;
  /** ボス到達に必要な撃破数 */
  readonly requiredKills: number;
}

/** ワールド進行状態 */
export interface WorldProgress {
  /** ワールド番号 */
  worldNumber: number;
  /** 現在の撃破数 */
  killCount: number;
  /** ボス撃破済みか */
  bossDefeated: boolean;
}

/** ワールド共通定数 */
export const WORLD_CONSTANTS = {
  /** ボス到達に必要な撃破数 */
  REQUIRED_KILLS: 15,
  /** 全ワールド数 */
  TOTAL_WORLDS: 8,
} as const;
