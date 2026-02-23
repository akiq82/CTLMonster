/**
 * 敵専用モンスター定義
 *
 * プレイヤーが育成することはできない。ワールドの雑魚敵・ボスとして登場する。
 */

import {
  MonsterDefinition,
  EvolutionStage,
} from "../../types/monster";

// ========== W1-W2 level (Baby II / Rookie) ==========

const gazimon: MonsterDefinition = {
  id: "gazimon",
  name: "ガジモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 22, atk: 9, def: 4 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "いたずら好きの獣型モンスター。素早い攻撃が得意。",
  isEnemyOnly: true,
};

const mushroomon: MonsterDefinition = {
  id: "mushroomon",
  name: "マッシュモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 22, atk: 7, def: 6 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "キノコ型モンスター。毒の胞子を撒き散らす。W1の雑魚敵。",
  isEnemyOnly: true,
};

const cyclonemon: MonsterDefinition = {
  id: "cyclonemon",
  name: "サイクロモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 75, atk: 26, def: 16 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "一つ目の竜型モンスター。炎の腕で攻撃する。",
  isEnemyOnly: true,
};

const goburimon: MonsterDefinition = {
  id: "goburimon",
  name: "ゴブリモン亜種",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 65, atk: 22, def: 14 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ゴブリモンの上位種。火炎のこん棒を振るう。W2の雑魚敵。",
  isEnemyOnly: true,
};

const shamanmon: MonsterDefinition = {
  id: "shamanmon",
  name: "シャーマモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 60, atk: 24, def: 16 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "呪術を操る小鬼型モンスター。不気味な踊りで力を高める。",
  isEnemyOnly: true,
};

const gizamon: MonsterDefinition = {
  id: "gizamon",
  name: "ギザモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 68, atk: 20, def: 15 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "背中にギザギザのヒレを持つ水棲型。水辺に潜む。",
  isEnemyOnly: true,
};

// ========== W3-W4 level (Champion) ==========

const tuskmon: MonsterDefinition = {
  id: "tuskmon",
  name: "タスクモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 180, atk: 45, def: 35 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な牙を持つ恐竜型モンスター。W2のボスとして立ちはだかる。",
  isEnemyOnly: true,
};

const minotauromon: MonsterDefinition = {
  id: "minotauromon",
  name: "ミノタルモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 165, atk: 50, def: 36 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な斧を振るう獣人型。迷宮の番人。W3の雑魚敵。",
  isEnemyOnly: true,
};

const snimon: MonsterDefinition = {
  id: "snimon",
  name: "スナイモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 155, atk: 52, def: 32 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大なカマキリ型モンスター。鋭い鎌で敵を両断する。",
  isEnemyOnly: true,
};

const drimogemon: MonsterDefinition = {
  id: "drimogemon",
  name: "ドリモゲモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 170, atk: 46, def: 38 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ドリルの鼻を持つモグラ型モンスター。地中から奇襲する。",
  isEnemyOnly: true,
};

const nanimon: MonsterDefinition = {
  id: "nanimon",
  name: "ナニモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 158, atk: 44, def: 34 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "謎のサングラスモンスター。見た目に反して実力は本物。",
  isEnemyOnly: true,
};

const fugamon: MonsterDefinition = {
  id: "fugamon",
  name: "フーガモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 162, atk: 48, def: 33 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な骨のこん棒を持つ鬼型。オーガモンの亜種。",
  isEnemyOnly: true,
};

const deltamon: MonsterDefinition = {
  id: "deltamon",
  name: "デルタモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 175, atk: 53, def: 35 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "三つの頭を持つ恐竜型モンスター。凶暴で手が付けられない。",
  isEnemyOnly: true,
};

const raremon: MonsterDefinition = {
  id: "raremon",
  name: "レアモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 180, atk: 40, def: 40 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "腐敗したスライム型モンスター。悪臭で敵を弱体化させる。",
  isEnemyOnly: true,
};

const monochromon: MonsterDefinition = {
  id: "monochromon",
  name: "モノクロモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 172, atk: 45, def: 42 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "一本角の恐竜型モンスター。突進力が凄まじい。W4のボス前衛。",
  isEnemyOnly: true,
};

// ========== 追加 Rookie ==========

const demidevimon: MonsterDefinition = {
  id: "demidevimon",
  name: "ピコデビモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 62, atk: 23, def: 14 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "小さな悪魔型モンスター。ずる賢く敵を欺く。",
  isEnemyOnly: true,
};

const betamon: MonsterDefinition = {
  id: "betamon",
  name: "ベタモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 60, atk: 20, def: 16 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "両生類型モンスター。電撃を放つ水辺の住人。",
  isEnemyOnly: true,
};

// ========== 追加 Champion ==========

const numemon: MonsterDefinition = {
  id: "numemon",
  name: "ヌメモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 160, atk: 42, def: 34 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "軟体型モンスター。汚物を投げつける不潔な戦法。",
  isEnemyOnly: true,
};

const devidramon: MonsterDefinition = {
  id: "devidramon",
  name: "デビドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 155, atk: 50, def: 32 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "邪竜型モンスター。暗闇で赤い目を光らせて獲物を狙う。",
  isEnemyOnly: true,
};

const flymon: MonsterDefinition = {
  id: "flymon",
  name: "フライモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 150, atk: 48, def: 33 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大なハチ型モンスター。毒針で敵を刺す。",
  isEnemyOnly: true,
};

const bakemon: MonsterDefinition = {
  id: "bakemon",
  name: "バケモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 148, atk: 44, def: 36 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "幽霊型モンスター。布に包まれた不気味な存在。",
  isEnemyOnly: true,
};

// ========== W5-W6 level (Ultimate) ==========

const waruseadramon: MonsterDefinition = {
  id: "waruseadramon",
  name: "ワルシードラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 368, atk: 106, def: 86 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "邪悪な海竜型モンスター。深海から全てを引きずり込む。",
  isEnemyOnly: true,
};

const blossomon: MonsterDefinition = {
  id: "blossomon",
  name: "ブロッサモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 365, atk: 100, def: 90 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な花型モンスター。蔓で獲物を絡め取り養分を吸い取る。",
  isEnemyOnly: true,
};

// ========== 追加 Ultimate ==========

const etemon: MonsterDefinition = {
  id: "etemon",
  name: "エテモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 370, atk: 105, def: 82 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "猿型の完全体。自称キングオブデジモン。暗黒ネットワークを操る。",
  isEnemyOnly: true,
};

const archnemon: MonsterDefinition = {
  id: "archnemon",
  name: "アルケニモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 360, atk: 108, def: 84 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "蜘蛛女型の完全体。ダークタワーからデジモンを生み出す。",
  isEnemyOnly: true,
};

const mummymon: MonsterDefinition = {
  id: "mummymon",
  name: "マミーモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 375, atk: 102, def: 88 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ミイラ型の完全体。アルケニモンの相棒。銃撃戦が得意。",
  isEnemyOnly: true,
};

// ========== W9-W10 level (Mega) ==========

const apocalymon: MonsterDefinition = {
  id: "apocalymon",
  name: "アポカリモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 900, atk: 270, def: 210 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "全デジモンの怨念が集合した究極の存在。W10最終ボス。",
  isEnemyOnly: true,
};

/** 敵専用モンスター一覧 */
export const ENEMY_ONLY_MONSTERS: readonly MonsterDefinition[] = [
  // W1-W2 level
  gazimon,
  mushroomon,
  cyclonemon,
  goburimon,
  shamanmon,
  gizamon,
  demidevimon,
  betamon,
  // W3-W4 level
  tuskmon,
  minotauromon,
  snimon,
  drimogemon,
  nanimon,
  fugamon,
  deltamon,
  raremon,
  monochromon,
  numemon,
  devidramon,
  flymon,
  bakemon,
  // W5-W6 level
  waruseadramon,
  blossomon,
  etemon,
  archnemon,
  mummymon,
  // W9-W10 level
  apocalymon,
] as const;
