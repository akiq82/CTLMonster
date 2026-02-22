/**
 * トレーニングメニュー定義
 *
 * GDD.md セクション5.4 のテーブルに完全準拠。
 * 各メニューは自転車トレーニングをモデルに命名。
 *
 * | メニュー名                     | TP-L | TP-M | TP-H | HP上昇   | ATK上昇  | DEF上昇  |
 * |-------------------------------|------|------|------|---------|---------|---------|
 * | LSD（ロング・スロー・ディスタンス） | 15   | 3    | 0    | +8〜12  | +0〜1   | +1〜3   |
 * | エンデュランス                    | 10   | 5    | 0    | +5〜8   | +1〜2   | +2〜4   |
 * | テンポ走                        | 5    | 12   | 0    | +2〜4   | +1〜3   | +5〜8   |
 * | スイートスポット                  | 3    | 10   | 3    | +2〜3   | +2〜4   | +4〜7   |
 * | VO2maxインターバル               | 0    | 5    | 12   | +1〜2   | +6〜10  | +1〜3   |
 * | 無酸素スプリント                  | 0    | 2    | 15   | +0〜1   | +8〜12  | +0〜1   |
 * | ヒルクライム                     | 5    | 8    | 5    | +3〜5   | +3〜5   | +3〜5   |
 * | レーススキル                     | 3    | 5    | 8    | +1〜3   | +5〜8   | +2〜4   |
 */

import { TrainingMenuDefinition } from "../types/training";

const lsd: TrainingMenuDefinition = {
  id: "lsd",
  name: "LSD（ロング・スロー・ディスタンス）",
  nameEn: "Long Slow Distance",
  costTpL: 15,
  costTpM: 3,
  costTpH: 0,
  hpGain: { min: 8, max: 12 },
  atkGain: { min: 0, max: 1 },
  defGain: { min: 1, max: 3 },
  description: "長時間・低強度の有酸素運動。HP成長に特化したメニュー。",
};

const endurance: TrainingMenuDefinition = {
  id: "endurance",
  name: "エンデュランス",
  nameEn: "Endurance",
  costTpL: 10,
  costTpM: 5,
  costTpH: 0,
  hpGain: { min: 5, max: 8 },
  atkGain: { min: 1, max: 2 },
  defGain: { min: 2, max: 4 },
  description: "持久力を鍛える有酸素運動。HPとDEFをバランスよく上昇。",
};

const tempo: TrainingMenuDefinition = {
  id: "tempo",
  name: "テンポ走",
  nameEn: "Tempo",
  costTpL: 5,
  costTpM: 12,
  costTpH: 0,
  hpGain: { min: 2, max: 4 },
  atkGain: { min: 1, max: 3 },
  defGain: { min: 5, max: 8 },
  description: "閾値付近の中強度走。DEF成長に特化したメニュー。",
};

const sweetSpot: TrainingMenuDefinition = {
  id: "sweet-spot",
  name: "スイートスポット",
  nameEn: "Sweet Spot Training",
  costTpL: 3,
  costTpM: 10,
  costTpH: 3,
  hpGain: { min: 2, max: 3 },
  atkGain: { min: 2, max: 4 },
  defGain: { min: 4, max: 7 },
  description: "FTP直下の効率的なトレーニング。DEFとATKをバランスよく上昇。",
};

const vo2maxInterval: TrainingMenuDefinition = {
  id: "vo2max-interval",
  name: "VO2maxインターバル",
  nameEn: "VO2max Intervals",
  costTpL: 0,
  costTpM: 5,
  costTpH: 12,
  hpGain: { min: 1, max: 2 },
  atkGain: { min: 6, max: 10 },
  defGain: { min: 1, max: 3 },
  description: "最大酸素摂取量付近の高強度インターバル。ATK成長に特化。",
};

const anaerobicSprint: TrainingMenuDefinition = {
  id: "anaerobic-sprint",
  name: "無酸素スプリント",
  nameEn: "Anaerobic Sprint",
  costTpL: 0,
  costTpM: 2,
  costTpH: 15,
  hpGain: { min: 0, max: 1 },
  atkGain: { min: 8, max: 12 },
  defGain: { min: 0, max: 1 },
  description: "全力の無酸素スプリント。ATK極振りメニュー。",
};

const hillClimb: TrainingMenuDefinition = {
  id: "hill-climb",
  name: "ヒルクライム",
  nameEn: "Hill Climb",
  costTpL: 5,
  costTpM: 8,
  costTpH: 5,
  hpGain: { min: 3, max: 5 },
  atkGain: { min: 3, max: 5 },
  defGain: { min: 3, max: 5 },
  description: "坂道トレーニング。全ステータスを均等に上昇させる万能型。",
};

const raceSkills: TrainingMenuDefinition = {
  id: "race-skills",
  name: "レーススキル",
  nameEn: "Race Skills",
  costTpL: 3,
  costTpM: 5,
  costTpH: 8,
  hpGain: { min: 1, max: 3 },
  atkGain: { min: 5, max: 8 },
  defGain: { min: 2, max: 4 },
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
