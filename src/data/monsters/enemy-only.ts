/**
 * 敵専用モンスター定義（W1-W2用）
 *
 * プレイヤーが育成することはできない。ワールドの雑魚敵・ボスとして登場する。
 */

import {
  MonsterDefinition,
  EvolutionStage,
} from "../../types/monster";

const goblimon: MonsterDefinition = {
  id: "goblimon",
  name: "ゴブリモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 20, atk: 8, def: 5 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "こん棒を振り回す小鬼型モンスター。W1の雑魚敵。",
  isEnemyOnly: true,
};

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

const ogremon: MonsterDefinition = {
  id: "ogremon",
  name: "オーガモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 70, atk: 25, def: 15 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大な骨のこん棒を振るう鬼型モンスター。W1のボスとして立ちはだかる。",
  isEnemyOnly: true,
};

const darktyranomon: MonsterDefinition = {
  id: "darktyranomon",
  name: "ダークティラノモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 80, atk: 28, def: 18 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ウイルスに侵された恐竜型モンスター。W2のモブ敵。",
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

// ========== W1-W2 level (Baby II / Rookie stage stats) ==========

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

const kunemon: MonsterDefinition = {
  id: "kunemon",
  name: "クネモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 18, atk: 9, def: 5 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "電気を帯びた芋虫型モンスター。痺れる糸を吐く。",
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

// ========== W3-W4 level (Rookie / Champion stage stats) ==========

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

// ========== W5-W6 level (Champion / Ultimate stage stats) ==========

const mammothmon: MonsterDefinition = {
  id: "mammothmon",
  name: "マンモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 380, atk: 105, def: 88 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "古代のマンモス型モンスター。氷のブレスで全てを凍てつかせる。",
  isEnemyOnly: true,
};

const megadramon: MonsterDefinition = {
  id: "megadramon",
  name: "メガドラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 360, atk: 115, def: 82 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "機械化された暗黒竜型。腕のミサイルで攻撃する。W5の雑魚敵。",
  isEnemyOnly: true,
};

const gigadramon: MonsterDefinition = {
  id: "gigadramon",
  name: "ギガドラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 370, atk: 112, def: 85 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "メガドラモンの上位種。より大型の兵器を搭載した暗黒竜。",
  isEnemyOnly: true,
};

const metalgreymon_virus: MonsterDefinition = {
  id: "metalgreymon_virus",
  name: "メタルグレイモン(ウイルス)",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 375, atk: 110, def: 84 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ウイルスに侵されたメタルグレイモン。暴走する兵器。",
  isEnemyOnly: true,
};

const skullgreymon: MonsterDefinition = {
  id: "skullgreymon",
  name: "スカルグレイモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 355, atk: 118, def: 78 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "暴走進化した骸骨竜型。理性を失い破壊衝動のみで動く。",
  isEnemyOnly: true,
};

const datamon: MonsterDefinition = {
  id: "datamon",
  name: "ナノモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 340, atk: 108, def: 92 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "超小型マシン型モンスター。電子攻撃でシステムを破壊する。",
  isEnemyOnly: true,
};

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

// ========== W7-W8 level (Ultimate / Mega stage stats) ==========

const piedmon: MonsterDefinition = {
  id: "piedmon",
  name: "ピエモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 850, atk: 248, def: 198 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "闇の四天王の一体。道化師の姿で四本の剣を操る。",
  isEnemyOnly: true,
};

const machinedramon: MonsterDefinition = {
  id: "machinedramon",
  name: "ムゲンドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 880, atk: 255, def: 205 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "闇の四天王の一体。全身が機械の巨大竜型。無限の砲門を持つ。",
  isEnemyOnly: true,
};

const metalseadramon: MonsterDefinition = {
  id: "metalseadramon",
  name: "メタルシードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 835, atk: 242, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "闇の四天王の一体。金属の鎧を纏った海竜型。深海の支配者。",
  isEnemyOnly: true,
};

const puppetmon: MonsterDefinition = {
  id: "puppetmon",
  name: "ピノッチモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 810, atk: 240, def: 195 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "闇の四天王の一体。木偶人形の姿だが恐るべき力を秘める。",
  isEnemyOnly: true,
};

const blackwargreymon: MonsterDefinition = {
  id: "blackwargreymon",
  name: "ブラックウォーグレイモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 870, atk: 260, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "暗黒の竜戦士型究極体。存在意義を求めて彷徨う孤高の戦士。",
  isEnemyOnly: true,
};

const diaboromon: MonsterDefinition = {
  id: "diaboromon",
  name: "ディアボロモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 845, atk: 250, def: 195 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "ネットワーク上に出現した究極体。無限に自己増殖する恐怖の存在。",
  isEnemyOnly: true,
};

const venommyotismon: MonsterDefinition = {
  id: "venommyotismon",
  name: "ヴェノムヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 890, atk: 245, def: 202 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "吸血鬼型究極体が暴走した異形。圧倒的な体力で敵を圧殺する。",
  isEnemyOnly: true,
};

const grandkuwagamon: MonsterDefinition = {
  id: "grandkuwagamon",
  name: "グランクワガーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 855, atk: 252, def: 196 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: null,
  evolutionPaths: [],
  description: "巨大なクワガタ型究極体。大顎で全てを断ち切る。",
  isEnemyOnly: true,
};

/** 敵専用モンスター一覧 */
export const ENEMY_ONLY_MONSTERS: readonly MonsterDefinition[] = [
  goblimon,
  gazimon,
  ogremon,
  darktyranomon,
  cyclonemon,
  tuskmon,
  // W1-W2 level
  mushroomon,
  kunemon,
  goburimon,
  shamanmon,
  gizamon,
  // W3-W4 level
  minotauromon,
  snimon,
  drimogemon,
  nanimon,
  fugamon,
  deltamon,
  raremon,
  monochromon,
  // W5-W6 level
  mammothmon,
  megadramon,
  gigadramon,
  metalgreymon_virus,
  skullgreymon,
  datamon,
  waruseadramon,
  blossomon,
  // W7-W8 level
  piedmon,
  machinedramon,
  metalseadramon,
  puppetmon,
  blackwargreymon,
  diaboromon,
  venommyotismon,
  grandkuwagamon,
] as const;
