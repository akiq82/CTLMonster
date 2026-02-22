/**
 * トレーニング関連の型定義
 * GDD.md セクション5 に基づく
 */

/** トレーニングポイント（3系統） */
export interface TrainingPoints {
  /** 低強度TP (Z1-Z2, HP向き) */
  low: number;
  /** 中強度TP (Z3-Z4, DEF向き) */
  mid: number;
  /** 高強度TP (Z5-Z7, ATK向き) */
  high: number;
}

/** ステータス上昇の範囲 */
export interface StatGainRange {
  readonly min: number;
  readonly max: number;
}

/** トレーニングメニュー定義 */
export interface TrainingMenuDefinition {
  /** 一意ID */
  readonly id: string;
  /** 表示名 */
  readonly name: string;
  /** 英語名（内部用） */
  readonly nameEn: string;
  /** TP-L 消費量 */
  readonly costTpL: number;
  /** TP-M 消費量 */
  readonly costTpM: number;
  /** TP-H 消費量 */
  readonly costTpH: number;
  /** HP上昇範囲 */
  readonly hpGain: StatGainRange;
  /** ATK上昇範囲 */
  readonly atkGain: StatGainRange;
  /** DEF上昇範囲 */
  readonly defGain: StatGainRange;
  /** メニュー説明 */
  readonly description: string;
}

/** トレーニング実行結果 */
export interface TrainingResult {
  /** 実行したメニューID */
  menuId: string;
  /** HP上昇量 */
  hpGain: number;
  /** ATK上昇量 */
  atkGain: number;
  /** DEF上昇量 */
  defGain: number;
  /** 食事ボーナスが適用されたか */
  mealBonusApplied: boolean;
}

/** ゾーン別IF係数 */
export const ZONE_IF_COEFFICIENTS = {
  z1: 0.55,
  z2: 0.75,
  z3: 0.90,
  z4: 1.00,
  z5: 1.10,
  z6: 1.20,
  z7: 1.30,
} as const;

/** TP変換係数 */
export const TP_CONVERSION_RATES = {
  low: 0.6,
  mid: 0.8,
  high: 1.0,
} as const;

/** ゾーン別滞在時間（秒） */
export interface ZoneTime {
  z1: number;
  z2: number;
  z3: number;
  z4: number;
  z5: number;
  z6: number;
  z7: number;
}

/** 食事ボーナス倍率 */
export const MEAL_TRAINING_BONUS = 1.1;
