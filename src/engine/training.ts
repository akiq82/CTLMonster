/**
 * トレーニング実行エンジン
 *
 * GDD.md セクション5.4 に基づく。
 * TPを消費してモンスターのステータスを上昇させる。
 *
 * - メニューごとにTP-L/M/Hのコストが定義されている
 * - ステータス上昇は定義された範囲内でランダム
 * - 食事ボーナス: 当日食事済みの場合 ×1.1（端数切り上げ）
 * - ステータスはモンスターの上限を超えない
 */

import type { TrainingMenuDefinition, TrainingResult } from "../types/training";
import type { MonsterState, MonsterDefinition } from "../types/monster";
import { EvolutionStage } from "../types/monster";
import { MEAL_TRAINING_BONUS } from "../types/training";
import { MONSTER_DEFINITIONS } from "../data/monsters";
import { randomDecimal, type RngFn } from "../utils/random";

/**
 * 段階別トレーニング倍率
 *
 * 高い進化段階ほどトレーニング効率が高い。
 * 例: ヒルクライム(食事込み)1セッションあたり HP/ATK/DEF 各+2.2 の場合、
 * Ultimate(×25)では 1セッション実効値 55.0、15セッション合計 825。
 */
export const STAGE_TRAINING_FACTOR: Record<EvolutionStage, number> = {
  [EvolutionStage.BABY_I]: 1,
  [EvolutionStage.BABY_II]: 2,
  [EvolutionStage.ROOKIE]: 5,
  [EvolutionStage.CHAMPION]: 10,
  [EvolutionStage.ULTIMATE]: 25,
  [EvolutionStage.MEGA]: 60,
};

/**
 * トレーニング実行可否を判定する
 *
 * @param monster - 現在のモンスター状態
 * @param menu - トレーニングメニュー
 * @param availableTp - 所持TP { low, mid, high }
 * @returns 実行可能ならtrue
 */
export function canExecuteTraining(
  menu: TrainingMenuDefinition,
  availableTp: { low: number; mid: number; high: number }
): boolean {
  return (
    availableTp.low >= menu.costTpL &&
    availableTp.mid >= menu.costTpM &&
    availableTp.high >= menu.costTpH
  );
}

/**
 * トレーニングを実行し、ステータス上昇量を計算する
 *
 * @param menu - トレーニングメニュー定義
 * @param hasMealBonus - 当日食事済みか
 * @param rng - 乱数生成関数（テスト用）
 * @returns トレーニング結果
 */
export function executeTraining(
  menu: TrainingMenuDefinition,
  hasMealBonus: boolean,
  rng: RngFn = Math.random
): TrainingResult {
  let hpGain = randomDecimal(menu.hpGain.min, menu.hpGain.max, 0.1, rng);
  let atkGain = randomDecimal(menu.atkGain.min, menu.atkGain.max, 0.1, rng);
  let defGain = randomDecimal(menu.defGain.min, menu.defGain.max, 0.1, rng);

  if (hasMealBonus) {
    hpGain = Math.round(hpGain * MEAL_TRAINING_BONUS * 10) / 10;
    atkGain = Math.round(atkGain * MEAL_TRAINING_BONUS * 10) / 10;
    defGain = Math.round(defGain * MEAL_TRAINING_BONUS * 10) / 10;
  }

  return {
    menuId: menu.id,
    hpGain,
    atkGain,
    defGain,
    mealBonusApplied: hasMealBonus,
  };
}

/**
 * トレーニング結果をモンスター状態に適用する
 * ステータスは定義上限でクランプされる。
 *
 * @param monster - 現在のモンスター状態（破壊的に変更される）
 * @param result - トレーニング結果
 * @param menu - 実行したメニュー定義
 * @returns 更新されたモンスター状態
 */
export function applyTrainingResult(
  monster: MonsterState,
  result: TrainingResult,
  menu: TrainingMenuDefinition
): MonsterState {
  const definition = MONSTER_DEFINITIONS.get(monster.definitionId);
  if (!definition) {
    throw new Error(`Unknown monster definition: ${monster.definitionId}`);
  }

  const factor = STAGE_TRAINING_FACTOR[definition.stage];
  monster.maxHp = Math.min(monster.maxHp + result.hpGain * factor, definition.statCaps.hp);
  monster.atk = Math.min(monster.atk + result.atkGain * factor, definition.statCaps.atk);
  monster.def = Math.min(monster.def + result.defGain * factor, definition.statCaps.def);

  // トレーニング実行時にHP全回復 (GDD 7.2)
  monster.currentHp = monster.maxHp;

  // 累計TP消費を記録
  monster.totalTpL += menu.costTpL;
  monster.totalTpM += menu.costTpM;
  monster.totalTpH += menu.costTpH;

  return monster;
}
