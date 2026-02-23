/**
 * 究極体 (Mega) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP800/ATK230/DEF190, 上限 HP3000/ATK800/DEF650
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const seraphimon: MonsterDefinition = {
  id: "seraphimon",
  name: "セラフィモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 850, atk: 230, def: 200 },
  statCaps: { hp: 3000, atk: 780, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "最高位の天使型究極体。聖なる力でワールドを守護する。HP特化型。",
  isEnemyOnly: false,
};

const metalgarurumon: MonsterDefinition = {
  id: "metalgarurumon",
  name: "メタルガルルモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 800, atk: 240, def: 210 },
  statCaps: { hp: 2800, atk: 790, def: 660 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "全身を金属装甲で覆った獣型究極体。鉄壁の防御力。DEF特化型。",
  isEnemyOnly: false,
};

const dukemon: MonsterDefinition = {
  id: "dukemon",
  name: "デュークモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 810, atk: 250, def: 190 },
  statCaps: { hp: 2700, atk: 820, def: 630 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "聖騎士型究極体。聖槍と聖盾を携え、すべての敵を打ち砕く。ATK特化型。",
  isEnemyOnly: false,
};

const omegamon: MonsterDefinition = {
  id: "omegamon",
  name: "オメガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 830, atk: 245, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description:
    "全系統が均衡した者だけが到達する隠し究極体。最強のバランス型。",
  isEnemyOnly: false,
};

const rosemon: MonsterDefinition = {
  id: "rosemon",
  name: "ロゼモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 840, atk: 235, def: 195 },
  statCaps: { hp: 3000, atk: 785, def: 648 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "薔薇の女王型究極体。美しさと強さを兼ね備える。HP/バランス型。",
  isEnemyOnly: false,
};

const miragegaogamon: MonsterDefinition = {
  id: "miragegaogamon",
  name: "ミラージュガオガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 790, atk: 252, def: 188 },
  statCaps: { hp: 2750, atk: 810, def: 635 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "蜃気楼を纏う獣騎士型究極体。超高速で敵を翻弄する。ATK特化型。",
  isEnemyOnly: false,
};

const sakuyamon: MonsterDefinition = {
  id: "sakuyamon",
  name: "サクヤモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 820, atk: 228, def: 208 },
  statCaps: { hp: 2900, atk: 770, def: 665 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "巫女型究極体。神聖な結界で味方を守り敵を封じる。DEF特化型。",
  isEnemyOnly: false,
};

const imperialdramon: MonsterDefinition = {
  id: "imperialdramon",
  name: "インペリアルドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 860, atk: 248, def: 192 },
  statCaps: { hp: 3000, atk: 800, def: 645 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "古代竜型究極体。圧倒的な力で全てを薙ぎ払う。ATK/HP型。",
  isEnemyOnly: false,
};

// ========== 敵専用から昇格した究極体 ==========

const piedmon: MonsterDefinition = {
  id: "piedmon",
  name: "ピエモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 850, atk: 248, def: 198 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "闇の四天王の一体。道化師の姿で四本の剣を操る。ATK偏重型。",
  isEnemyOnly: false,
};

const machinedramon: MonsterDefinition = {
  id: "machinedramon",
  name: "ムゲンドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 880, atk: 255, def: 205 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "闇の四天王の一体。全身が機械の巨大竜型。無限の砲門を持つ。HP/ATK型。",
  isEnemyOnly: false,
};

const metalseadramon: MonsterDefinition = {
  id: "metalseadramon",
  name: "メタルシードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 835, atk: 242, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "闇の四天王の一体。金属の鎧を纏った海竜型。深海の支配者。DEF偏重型。",
  isEnemyOnly: false,
};

const puppetmon: MonsterDefinition = {
  id: "puppetmon",
  name: "ピノッチモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 810, atk: 240, def: 195 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "闇の四天王の一体。木偶人形の姿だが恐るべき力を秘める。バランス型。",
  isEnemyOnly: false,
};

const blackwargreymon: MonsterDefinition = {
  id: "blackwargreymon",
  name: "ブラックウォーグレイモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 870, atk: 260, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "暗黒の竜戦士型究極体。存在意義を求めて彷徨う孤高の戦士。ATK特化型。",
  isEnemyOnly: false,
};

const diaboromon: MonsterDefinition = {
  id: "diaboromon",
  name: "ディアボロモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 845, atk: 250, def: 195 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "ネットワーク上に出現した究極体。無限に自己増殖する恐怖の存在。ATK偏重型。",
  isEnemyOnly: false,
};

const venommyotismon: MonsterDefinition = {
  id: "venommyotismon",
  name: "ヴェノムヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 890, atk: 245, def: 202 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "吸血鬼型究極体が暴走した異形。圧倒的な体力で敵を圧殺する。HP特化型。",
  isEnemyOnly: false,
};

const grandkuwagamon: MonsterDefinition = {
  id: "grandkuwagamon",
  name: "グランクワガーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 855, atk: 252, def: 196 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "巨大なクワガタ型究極体。大顎で全てを断ち切る。ATK偏重型。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const magnamon: MonsterDefinition = {
  id: "magnamon",
  name: "マグナモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 840, atk: 245, def: 202 },
  statCaps: { hp: 3000, atk: 795, def: 655 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "ブイモンのアーマー究極体(奇跡)。黄金の聖騎士。バランス型。",
  isEnemyOnly: false,
};

const vikemon: MonsterDefinition = {
  id: "vikemon",
  name: "ヴァイクモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 880, atk: 235, def: 210 },
  statCaps: { hp: 3000, atk: 780, def: 665 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "アルマジモンライン究極体。バイキング型の氷の巨人。HP/DEF型。",
  isEnemyOnly: false,
};

const valkyrimon: MonsterDefinition = {
  id: "valkyrimon",
  name: "ヴァルキリモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 825, atk: 248, def: 195 },
  statCaps: { hp: 2900, atk: 805, def: 645 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "ホークモンライン究極体。戦乙女型の高速戦士。ATK偏重。",
  isEnemyOnly: false,
};

const holydramon: MonsterDefinition = {
  id: "holydramon",
  name: "ホーリードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 860, atk: 238, def: 198 },
  statCaps: { hp: 3000, atk: 790, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "テイルモンライン究極体。聖なる神竜型。HP偏重。",
  isEnemyOnly: false,
};

const daemon: MonsterDefinition = {
  id: "daemon",
  name: "デーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 870, atk: 258, def: 195 },
  statCaps: { hp: 3000, atk: 810, def: 645 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "02ヴィランボス。七大魔王の一体。圧倒的な闇の力。ATK特化。",
  isEnemyOnly: false,
};

const belialvamdemon: MonsterDefinition = {
  id: "belialvamdemon",
  name: "ベリアルヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 895, atk: 252, def: 198 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "02最終ボス。ヴァンデモンの最終形態。HP/ATK型。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const chaosdramon: MonsterDefinition = {
  id: "chaosdramon",
  name: "カオスドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 885, atk: 260, def: 205 },
  statCaps: { hp: 3000, atk: 810, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "ムゲンドラモンの上位種。赤い装甲の暴走兵器。ATK特化。",
  isEnemyOnly: false,
};

const millenniummon: MonsterDefinition = {
  id: "millenniummon",
  name: "ミレニアモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 900, atk: 265, def: 200 },
  statCaps: { hp: 3000, atk: 820, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "伝説のヴィラン。時空を操る最強の究極体。ATK/HP型。",
  isEnemyOnly: false,
};

/** 究極体 モンスター一覧 */
export const MEGA_MONSTERS: readonly MonsterDefinition[] = [
  seraphimon,
  metalgarurumon,
  dukemon,
  omegamon,
  rosemon,
  miragegaogamon,
  sakuyamon,
  imperialdramon,
  piedmon,
  machinedramon,
  metalseadramon,
  puppetmon,
  blackwargreymon,
  diaboromon,
  venommyotismon,
  grandkuwagamon,
  magnamon,
  vikemon,
  valkyrimon,
  holydramon,
  daemon,
  belialvamdemon,
  chaosdramon,
  millenniummon,
] as const;
