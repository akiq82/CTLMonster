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
  baseStats: { hp: 14, atk: 6, def: 3 },
  statCaps: { hp: 40, atk: 14, def: 11 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "いたずら好きの獣型モンスター。素早い攻撃が得意。",
  isEnemyOnly: true,
};

const mushroomon: MonsterDefinition = {
  id: "mushroomon",
  name: "マッシュモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 14, atk: 5, def: 4 },
  statCaps: { hp: 40, atk: 14, def: 11 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "キノコ型モンスター。毒の胞子を撒き散らす。W1の雑魚敵。",
  isEnemyOnly: true,
};

const cyclonemon: MonsterDefinition = {
  id: "cyclonemon",
  name: "サイクロモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 35, atk: 13, def: 9 },
  statCaps: { hp: 83, atk: 26, def: 23 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "一つ目の竜型モンスター。炎の腕で攻撃する。",
  isEnemyOnly: true,
};

const goburimon: MonsterDefinition = {
  id: "goburimon",
  name: "ゴブリモン亜種",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 30, atk: 11, def: 7 },
  statCaps: { hp: 83, atk: 26, def: 23 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ゴブリモンの上位種。火炎のこん棒を振るう。W2の雑魚敵。",
  isEnemyOnly: true,
};

const shamanmon: MonsterDefinition = {
  id: "shamanmon",
  name: "シャーマモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 28, atk: 12, def: 9 },
  statCaps: { hp: 83, atk: 26, def: 23 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "呪術を操る小鬼型モンスター。不気味な踊りで力を高める。",
  isEnemyOnly: true,
};

const gizamon: MonsterDefinition = {
  id: "gizamon",
  name: "ギザモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 31, atk: 10, def: 8 },
  statCaps: { hp: 83, atk: 26, def: 23 },
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
  baseStats: { hp: 45, atk: 15, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な牙を持つ恐竜型モンスター。W2のボスとして立ちはだかる。",
  isEnemyOnly: true,
};

const minotauromon: MonsterDefinition = {
  id: "minotauromon",
  name: "ミノタルモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 41, atk: 17, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な斧を振るう獣人型。迷宮の番人。W3の雑魚敵。",
  isEnemyOnly: true,
};

const snimon: MonsterDefinition = {
  id: "snimon",
  name: "スナイモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 39, atk: 18, def: 12 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大なカマキリ型モンスター。鋭い鎌で敵を両断する。",
  isEnemyOnly: true,
};

const drimogemon: MonsterDefinition = {
  id: "drimogemon",
  name: "ドリモゲモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 43, atk: 16, def: 14 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ドリルの鼻を持つモグラ型モンスター。地中から奇襲する。",
  isEnemyOnly: true,
};

const nanimon: MonsterDefinition = {
  id: "nanimon",
  name: "ナニモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 40, atk: 15, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "謎のサングラスモンスター。見た目に反して実力は本物。",
  isEnemyOnly: true,
};

const fugamon: MonsterDefinition = {
  id: "fugamon",
  name: "フーガモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 41, atk: 16, def: 12 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な骨のこん棒を持つ鬼型。オーガモンの亜種。",
  isEnemyOnly: true,
};

const deltamon: MonsterDefinition = {
  id: "deltamon",
  name: "デルタモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 44, atk: 18, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "三つの頭を持つ恐竜型モンスター。凶暴で手が付けられない。",
  isEnemyOnly: true,
};

const raremon: MonsterDefinition = {
  id: "raremon",
  name: "レアモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 45, atk: 14, def: 15 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "腐敗したスライム型モンスター。悪臭で敵を弱体化させる。",
  isEnemyOnly: true,
};

const monochromon: MonsterDefinition = {
  id: "monochromon",
  name: "モノクロモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 43, atk: 15, def: 16 },
  statCaps: { hp: 120, atk: 46, def: 39 },
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
  baseStats: { hp: 29, atk: 11, def: 7 },
  statCaps: { hp: 83, atk: 26, def: 23 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "小さな悪魔型モンスター。ずる賢く敵を欺く。",
  isEnemyOnly: true,
};

const betamon: MonsterDefinition = {
  id: "betamon",
  name: "ベタモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 28, atk: 10, def: 9 },
  statCaps: { hp: 83, atk: 26, def: 23 },
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
  baseStats: { hp: 40, atk: 14, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "軟体型モンスター。汚物を投げつける不潔な戦法。",
  isEnemyOnly: true,
};

const devidramon: MonsterDefinition = {
  id: "devidramon",
  name: "デビドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 39, atk: 17, def: 12 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "邪竜型モンスター。暗闇で赤い目を光らせて獲物を狙う。",
  isEnemyOnly: true,
};

const flymon: MonsterDefinition = {
  id: "flymon",
  name: "フライモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 38, atk: 16, def: 12 },
  statCaps: { hp: 120, atk: 46, def: 39 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大なハチ型モンスター。毒針で敵を刺す。",
  isEnemyOnly: true,
};

const bakemon: MonsterDefinition = {
  id: "bakemon",
  name: "バケモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 37, atk: 15, def: 13 },
  statCaps: { hp: 120, atk: 46, def: 39 },
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
  baseStats: { hp: 87, atk: 27, def: 22 },
  statCaps: { hp: 300, atk: 83, def: 72 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "邪悪な海竜型モンスター。深海から全てを引きずり込む。",
  isEnemyOnly: true,
};

const blossomon: MonsterDefinition = {
  id: "blossomon",
  name: "ブロッサモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 86, atk: 26, def: 23 },
  statCaps: { hp: 300, atk: 83, def: 72 },
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
  baseStats: { hp: 88, atk: 27, def: 21 },
  statCaps: { hp: 300, atk: 83, def: 72 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "猿型の完全体。自称キングオブデジモン。暗黒ネットワークを操る。",
  isEnemyOnly: true,
};

const archnemon: MonsterDefinition = {
  id: "archnemon",
  name: "アルケニモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 85, atk: 28, def: 21 },
  statCaps: { hp: 300, atk: 83, def: 72 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "蜘蛛女型の完全体。ダークタワーからデジモンを生み出す。",
  isEnemyOnly: true,
};

const mummymon: MonsterDefinition = {
  id: "mummymon",
  name: "マミーモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 89, atk: 26, def: 22 },
  statCaps: { hp: 300, atk: 83, def: 72 },
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
  baseStats: { hp: 212, atk: 83, def: 63 },
  statCaps: { hp: 700, atk: 240, def: 195 },
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
