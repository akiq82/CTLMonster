/**
 * バトル関連の型定義
 * GDD.md セクション7 に基づく
 */

/** バトル参加者のステータス */
export interface BattleFighter {
  /** 名前 */
  name: string;
  /** 現在HP */
  currentHp: number;
  /** 最大HP */
  maxHp: number;
  /** 攻撃力 */
  atk: number;
  /** 防御力 */
  def: number;
  /** 規律 (0-100) */
  discipline: number;
}

/** 1ターンのアクション結果 */
export interface TurnAction {
  /** 攻撃者名 */
  attackerName: string;
  /** 防御者名 */
  defenderName: string;
  /** 命中したか */
  hit: boolean;
  /** 回避されたか */
  evaded: boolean;
  /** クリティカルか */
  critical: boolean;
  /** 実ダメージ */
  damage: number;
  /** 防御者の残りHP */
  defenderRemainingHp: number;
}

/** バトルログの1ターン */
export interface BattleTurn {
  /** ターン番号 (1始まり) */
  turnNumber: number;
  /** このターンのアクション（先攻→後攻の順） */
  actions: TurnAction[];
}

/** バトル結果 */
export interface BattleResult {
  /** 勝利したか (プレイヤー視点) */
  playerWon: boolean;
  /** バトルログ */
  turns: BattleTurn[];
  /** プレイヤーの残りHP */
  playerRemainingHp: number;
  /** 敵の残りHP */
  enemyRemainingHp: number;
  /** 総ターン数 */
  totalTurns: number;
}

/** エンカウント結果 */
export interface EncounterResult {
  /** エンカウント成功したか (常にtrue: 空振り廃止済み) */
  encountered: boolean;
  /** WP消費量 */
  wpConsumed: number;
  /** バトル結果 */
  battleResult: BattleResult | null;
}

/** バトル定数 */
export const BATTLE_CONSTANTS = {
  /** 基礎命中率 */
  BASE_HIT_RATE: 0.90,
  /** 規律による命中率補正 (1ポイントあたり) */
  DISCIPLINE_HIT_MODIFIER: 0.002,
  /** 基礎回避率 */
  BASE_EVASION_RATE: 0.05,
  /** 規律による回避率補正 (1ポイントあたり) */
  DISCIPLINE_EVASION_MODIFIER: 0.001,
  /** クリティカル率 */
  CRITICAL_RATE: 0.05,
  /** クリティカル倍率 */
  CRITICAL_MULTIPLIER: 1.5,
  /** ダメージのランダム範囲（最小） */
  DAMAGE_RANDOM_MIN: 0.85,
  /** ダメージのランダム範囲（最大） */
  DAMAGE_RANDOM_MAX: 1.15,
  /** DEFのダメージ軽減係数 */
  DEF_REDUCTION_FACTOR: 0.4,
  /** 最小ダメージ */
  MIN_DAMAGE: 1,
  /** 敗北時の残りHP */
  LOSS_REMAINING_HP: 1,
} as const;

/** WP関連定数 */
export const WP_CONSTANTS = {
  /** 1歩あたりのWP */
  WP_PER_STEP: 1,
  /** 1階あたりのWP */
  WP_PER_FLOOR: 100,
  /** 1kmあたりのWP (40km ≒ 10k歩相当) */
  WP_PER_RIDE_KM: 250,
  /** 獲得標高1mあたりのWP (1,000m ≒ 10k歩相当) */
  WP_PER_RIDE_ELEVATION_M: 10,
  /** エンカウント1回のWP消費 */
  ENCOUNTER_WP_COST: 2000,
  /** ボス戦のWP消費 */
  BOSS_WP_COST: 3000,
} as const;
