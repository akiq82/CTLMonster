/**
 * トレーニングメニュー定義
 *
 * GDD.md セクション5.4 のテーブルをベースに調整:
 *   1. TPコストを全メニュー一律50に正規化 (L/M/H比率は元テーブルを維持)
 *   2. ステータス上昇量を ×0.80 小数化 (バトルXP導入に伴う難易度維持)
 *
 * 調整根拠:
 *   TP供給量: PMC 140TP + バトルXP ~68TP = 208 baseTp + ライド345TP = 553TP
 *   TPコスト一律50 → ~11回トレーニング × 0.80倍ゲイン ≈ 8.8回相当
 *   Baby II最終ステ: ほぼ同等 → W1ボス勝率 ~35-50% 維持
 *
 * | メニュー名                     | TP-L | TP-M | TP-H | 計 | HP上昇      | ATK上昇     | DEF上昇     |
 * |-------------------------------|------|------|------|----|------------|------------|------------|
 * | LSD（ロング・スロー・ディスタンス） | 42   | 8    | 0    | 50 | +4.0〜4.8  | +0〜0.8    | +0.8〜1.6  |
 * | エンデュランス                    | 33   | 17   | 0    | 50 | +2.4〜4.8  | +0.8〜0.8  | +0.8〜1.6  |
 * | テンポ走                        | 15   | 35   | 0    | 50 | +0.8〜1.6  | +0.8〜1.6  | +2.4〜4.0  |
 * | スイートスポット                  | 9    | 31   | 10   | 50 | +0.8〜1.6  | +0.8〜1.6  | +1.6〜3.2  |
 * | VO2maxインターバル               | 0    | 15   | 35   | 50 | +0.8〜0.8  | +3.2〜4.8  | +0.8〜1.6  |
 * | 無酸素スプリント                  | 0    | 6    | 44   | 50 | +0〜0.8    | +4.0〜5.6  | +0〜0.8    |
 * | ヒルクライム                     | 14   | 22   | 14   | 50 | +1.6〜2.4  | +1.6〜2.4  | +1.6〜2.4  |
 * | レーススキル                     | 9    | 16   | 25   | 50 | +0.8〜1.6  | +2.4〜4.0  | +0.8〜1.6  |
 */

import { TrainingMenuDefinition } from "../types/training";

const lsd: TrainingMenuDefinition = {
  id: "lsd",
  name: "LSD（ロング・スロー・ディスタンス）",
  nameEn: "Long Slow Distance",
  costTpL: 42,
  costTpM: 8,
  costTpH: 0,
  hpGain: { min: 4.0, max: 4.8 },
  atkGain: { min: 0, max: 0.8 },
  defGain: { min: 0.8, max: 1.6 },
  description: "長時間・低強度の有酸素運動。HP成長に特化したメニュー。",
};

const endurance: TrainingMenuDefinition = {
  id: "endurance",
  name: "エンデュランス",
  nameEn: "Endurance",
  costTpL: 33,
  costTpM: 17,
  costTpH: 0,
  hpGain: { min: 2.4, max: 4.8 },
  atkGain: { min: 0.8, max: 0.8 },
  defGain: { min: 0.8, max: 1.6 },
  description: "持久力を鍛える有酸素運動。HPとDEFをバランスよく上昇。",
};

const tempo: TrainingMenuDefinition = {
  id: "tempo",
  name: "テンポ走",
  nameEn: "Tempo",
  costTpL: 15,
  costTpM: 35,
  costTpH: 0,
  hpGain: { min: 0.8, max: 1.6 },
  atkGain: { min: 0.8, max: 1.6 },
  defGain: { min: 2.4, max: 4.0 },
  description: "閾値付近の中強度走。DEF成長に特化したメニュー。",
};

const sweetSpot: TrainingMenuDefinition = {
  id: "sweet-spot",
  name: "スイートスポット",
  nameEn: "Sweet Spot Training",
  costTpL: 9,
  costTpM: 31,
  costTpH: 10,
  hpGain: { min: 0.8, max: 1.6 },
  atkGain: { min: 0.8, max: 1.6 },
  defGain: { min: 1.6, max: 3.2 },
  description: "FTP直下の効率的なトレーニング。DEFとATKをバランスよく上昇。",
};

const vo2maxInterval: TrainingMenuDefinition = {
  id: "vo2max-interval",
  name: "VO2maxインターバル",
  nameEn: "VO2max Intervals",
  costTpL: 0,
  costTpM: 15,
  costTpH: 35,
  hpGain: { min: 0.8, max: 0.8 },
  atkGain: { min: 3.2, max: 4.8 },
  defGain: { min: 0.8, max: 1.6 },
  description: "最大酸素摂取量付近の高強度インターバル。ATK成長に特化。",
};

const anaerobicSprint: TrainingMenuDefinition = {
  id: "anaerobic-sprint",
  name: "無酸素スプリント",
  nameEn: "Anaerobic Sprint",
  costTpL: 0,
  costTpM: 6,
  costTpH: 44,
  hpGain: { min: 0, max: 0.8 },
  atkGain: { min: 4.0, max: 5.6 },
  defGain: { min: 0, max: 0.8 },
  description: "全力の無酸素スプリント。ATK極振りメニュー。",
};

const hillClimb: TrainingMenuDefinition = {
  id: "hill-climb",
  name: "ヒルクライム",
  nameEn: "Hill Climb",
  costTpL: 14,
  costTpM: 22,
  costTpH: 14,
  hpGain: { min: 1.6, max: 2.4 },
  atkGain: { min: 1.6, max: 2.4 },
  defGain: { min: 1.6, max: 2.4 },
  description: "坂道トレーニング。全ステータスを均等に上昇させる万能型。",
};

const raceSkills: TrainingMenuDefinition = {
  id: "race-skills",
  name: "レーススキル",
  nameEn: "Race Skills",
  costTpL: 9,
  costTpM: 16,
  costTpH: 25,
  hpGain: { min: 0.8, max: 1.6 },
  atkGain: { min: 2.4, max: 4.0 },
  defGain: { min: 0.8, max: 1.6 },
  description: "実戦形式のレース練習。ATK寄りの実践的メニュー。",
};

/** 全トレーニングメニュー定義リスト */
export const TRAINING_MENUS: readonly TrainingMenuDefinition[] = [
  lsd,
  endurance,
  tempo,
  sweetSpot,
  vo2maxInterval,
  anaerobicSprint,
  hillClimb,
  raceSkills,
];

/** トレーニングメニューIDからの検索マップ */
export const TRAINING_MENU_MAP: ReadonlyMap<string, TrainingMenuDefinition> =
  new Map(TRAINING_MENUS.map((menu) => [menu.id, menu]));
