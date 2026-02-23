/**
 * モンスター関連の型定義
 * GDD.md セクション4, 6 に基づく
 */

/** 進化段階 */
export enum EvolutionStage {
  /** 幼年期I (Baby) */
  BABY_I = 1,
  /** 幼年期II (In-Training) */
  BABY_II = 2,
  /** 成長期 (Rookie) */
  ROOKIE = 3,
  /** 成熟期 (Champion) */
  CHAMPION = 4,
  /** 完全体 (Ultimate) */
  ULTIMATE = 5,
  /** 究極体 (Mega) */
  MEGA = 6,
}

/** TP比率による進化分岐タイプ */
export enum BranchType {
  /** HP特化型（TP-L最多） */
  HP = "HP",
  /** DEF特化型（TP-M最多） */
  DEF = "DEF",
  /** ATK特化型（TP-H最多） */
  ATK = "ATK",
  /** バランス型（各30%以上） */
  BALANCED = "BALANCED",
}

/** モンスターの基礎ステータス */
export interface BaseStats {
  readonly hp: number;
  readonly atk: number;
  readonly def: number;
}

/** モンスターのステータス上限 */
export interface StatCaps {
  readonly hp: number;
  readonly atk: number;
  readonly def: number;
}

/** 進化条件 */
export interface EvolutionRequirement {
  /** HP閾値 */
  readonly hp: number;
  /** ATK閾値 */
  readonly atk: number;
  /** DEF閾値 */
  readonly def: number;
  /** 必要なボス撃破ワールド番号 (nullなら不要) */
  readonly bossWorld: number | null;
}

/** 進化先の定義 */
export interface EvolutionPath {
  /** 進化先モンスターID */
  readonly targetId: string;
  /** 必要な分岐タイプ */
  readonly branchType: BranchType;
}

/** モンスター定義（静的データ） */
export interface MonsterDefinition {
  /** 一意ID */
  readonly id: string;
  /** 表示名 */
  readonly name: string;
  /** 進化段階 */
  readonly stage: EvolutionStage;
  /** 基礎ステータス（進化直後の初期値） */
  readonly baseStats: BaseStats;
  /** ステータス上限 */
  readonly statCaps: StatCaps;
  /** 進化条件 (幼年期Iは前段階がないのでnull可) */
  readonly evolutionRequirement: EvolutionRequirement | null;
  /** 進化先リスト (究極体は空配列) */
  readonly evolutionPaths: readonly EvolutionPath[];
  /** 図鑑用説明文 */
  readonly description: string;
  /** 敵専用モンスターか */
  readonly isEnemyOnly: boolean;
}

/** 現在のモンスター状態（ゲーム中） */
export interface MonsterState {
  /** 個体名（プレイヤー命名） */
  name: string;
  /** モンスター定義ID */
  definitionId: string;
  /** 現在HP */
  currentHp: number;
  /** 最大HP（トレーニングで上昇した値） */
  maxHp: number;
  /** 攻撃力 */
  atk: number;
  /** 防御力 */
  def: number;
  /** 規律 (0-100) */
  discipline: number;
  /** 累計消費TP-L */
  totalTpL: number;
  /** 累計消費TP-M */
  totalTpM: number;
  /** 累計消費TP-H */
  totalTpH: number;
  /** 誕生日時 (ISO string) */
  bornAt: string;
  /** 基礎寿命（日） */
  baseLifespan: number;
  /** 食事による延長日数 */
  lifespanExtension: number;
  /** 世代番号 */
  generation: number;
  /** 進化履歴（モンスター定義IDの配列） */
  evolutionHistory: string[];
  /** 装備中の「記憶」装備 */
  memoryEquipment: MemoryEquipment | null;
  /** 当日の食事回数 */
  mealsToday: number;
  /** 前日の食事回数 */
  mealsYesterday: number;
  /** 残り食事ボーナス回数（トレーニング実行で1消費） */
  mealBonusRemaining: number;
  /** 最終ログイン日時 (ISO string) */
  lastLoginAt: string;
  /** 戦闘勝利数 */
  wins: number;
  /** 戦闘敗北数 */
  losses: number;
}

/** 「○○の記憶」装備品 */
export interface MemoryEquipment {
  /** 装備名 */
  readonly name: string;
  /** HP補正値 */
  readonly hp: number;
  /** ATK補正値 */
  readonly atk: number;
  /** DEF補正値 */
  readonly def: number;
}
