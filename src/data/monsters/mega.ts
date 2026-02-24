/**
 * 究極体 (Mega) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP4000~4500/ATK1400~1660/DEF1150~1300, 上限 HP13500~15000/ATK4812~5125/DEF3876~4092
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
  baseStats: { hp: 1000, atk: 440, def: 368 },
  statCaps: { hp: 3500, atk: 1463, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "最高位の天使型究極体。聖なる力でワールドを守護する。HP特化型。",
  isEnemyOnly: false,
};

const metalgarurumon: MonsterDefinition = {
  id: "metalgarurumon",
  name: "メタルガルルモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 941, atk: 459, def: 387 },
  statCaps: { hp: 3267, atk: 1481, def: 1218 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "全身を金属装甲で覆った獣型究極体。鉄壁の防御力。DEF特化型。",
  isEnemyOnly: false,
};

const dukemon: MonsterDefinition = {
  id: "dukemon",
  name: "デュークモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 953, atk: 478, def: 350 },
  statCaps: { hp: 3150, atk: 1537, def: 1163 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "聖騎士型究極体。聖槍と聖盾を携え、すべての敵を打ち砕く。ATK特化型。",
  isEnemyOnly: false,
};

const omegamon: MonsterDefinition = {
  id: "omegamon",
  name: "オメガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 976, atk: 469, def: 368 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description:
    "全系統が均衡した者だけが到達する隠し究極体。最強のバランス型。",
  isEnemyOnly: false,
};

const rosemon: MonsterDefinition = {
  id: "rosemon",
  name: "ロゼモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 988, atk: 449, def: 359 },
  statCaps: { hp: 3500, atk: 1472, def: 1196 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "薔薇の女王型究極体。美しさと強さを兼ね備える。HP/バランス型。",
  isEnemyOnly: false,
};

const miragegaogamon: MonsterDefinition = {
  id: "miragegaogamon",
  name: "ミラージュガオガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 929, atk: 482, def: 346 },
  statCaps: { hp: 3208, atk: 1519, def: 1172 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "蜃気楼を纏う獣騎士型究極体。超高速で敵を翻弄する。ATK特化型。",
  isEnemyOnly: false,
};

const sakuyamon: MonsterDefinition = {
  id: "sakuyamon",
  name: "サクヤモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 965, atk: 436, def: 383 },
  statCaps: { hp: 3383, atk: 1444, def: 1228 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "巫女型究極体。神聖な結界で味方を守り敵を封じる。DEF特化型。",
  isEnemyOnly: false,
};

const imperialdramon: MonsterDefinition = {
  id: "imperialdramon",
  name: "インペリアルドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1012, atk: 475, def: 354 },
  statCaps: { hp: 3500, atk: 1500, def: 1191 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "古代竜型究極体。圧倒的な力で全てを薙ぎ払う。ATK/HP型。",
  isEnemyOnly: false,
};

// ========== 敵専用から昇格した究極体 ==========

const piedmon: MonsterDefinition = {
  id: "piedmon",
  name: "ピエモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1000, atk: 475, def: 365 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "闇の四天王の一体。道化師の姿で四本の剣を操る。ATK偏重型。",
  isEnemyOnly: false,
};

const machinedramon: MonsterDefinition = {
  id: "machinedramon",
  name: "ムゲンドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1035, atk: 488, def: 378 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "闇の四天王の一体。全身が機械の巨大竜型。無限の砲門を持つ。HP/ATK型。",
  isEnemyOnly: false,
};

const metalseadramon: MonsterDefinition = {
  id: "metalseadramon",
  name: "メタルシードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 982, atk: 463, def: 368 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "闇の四天王の一体。金属の鎧を纏った海竜型。深海の支配者。DEF偏重型。",
  isEnemyOnly: false,
};

const puppetmon: MonsterDefinition = {
  id: "puppetmon",
  name: "ピノッチモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 953, atk: 459, def: 359 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "闇の四天王の一体。木偶人形の姿だが恐るべき力を秘める。バランス型。",
  isEnemyOnly: false,
};

const blackwargreymon: MonsterDefinition = {
  id: "blackwargreymon",
  name: "ブラックウォーグレイモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1024, atk: 498, def: 368 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "暗黒の竜戦士型究極体。存在意義を求めて彷徨う孤高の戦士。ATK特化型。",
  isEnemyOnly: false,
};

const diaboromon: MonsterDefinition = {
  id: "diaboromon",
  name: "ディアボロモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 994, atk: 478, def: 359 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "ネットワーク上に出現した究極体。無限に自己増殖する恐怖の存在。ATK偏重型。",
  isEnemyOnly: false,
};

const venommyotismon: MonsterDefinition = {
  id: "venommyotismon",
  name: "ヴェノムヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1047, atk: 469, def: 372 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "吸血鬼型究極体が暴走した異形。圧倒的な体力で敵を圧殺する。HP特化型。",
  isEnemyOnly: false,
};

const grandkuwagamon: MonsterDefinition = {
  id: "grandkuwagamon",
  name: "グランクワガーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1006, atk: 482, def: 361 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "巨大なクワガタ型究極体。大顎で全てを断ち切る。ATK偏重型。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const magnamon: MonsterDefinition = {
  id: "magnamon",
  name: "マグナモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 988, atk: 468, def: 372 },
  statCaps: { hp: 3500, atk: 1490, def: 1209 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "ブイモンのアーマー究極体(奇跡)。黄金の聖騎士。バランス型。",
  isEnemyOnly: false,
};

const vikemon: MonsterDefinition = {
  id: "vikemon",
  name: "ヴァイクモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1035, atk: 449, def: 387 },
  statCaps: { hp: 3500, atk: 1463, def: 1228 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "アルマジモンライン究極体。バイキング型の氷の巨人。HP/DEF型。",
  isEnemyOnly: false,
};

const valkyrimon: MonsterDefinition = {
  id: "valkyrimon",
  name: "ヴァルキリモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 971, atk: 474, def: 359 },
  statCaps: { hp: 3383, atk: 1509, def: 1191 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "ホークモンライン究極体。戦乙女型の高速戦士。ATK偏重。",
  isEnemyOnly: false,
};

const holydramon: MonsterDefinition = {
  id: "holydramon",
  name: "ホーリードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1012, atk: 455, def: 365 },
  statCaps: { hp: 3500, atk: 1481, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "テイルモンライン究極体。聖なる神竜型。HP偏重。",
  isEnemyOnly: false,
};

const daemon: MonsterDefinition = {
  id: "daemon",
  name: "デーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1024, atk: 494, def: 359 },
  statCaps: { hp: 3500, atk: 1519, def: 1191 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "02ヴィランボス。七大魔王の一体。圧倒的な闇の力。ATK特化。",
  isEnemyOnly: false,
};

const belialvamdemon: MonsterDefinition = {
  id: "belialvamdemon",
  name: "ベリアルヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1053, atk: 482, def: 365 },
  statCaps: { hp: 3500, atk: 1500, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "02最終ボス。ヴァンデモンの最終形態。HP/ATK型。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const chaosdramon: MonsterDefinition = {
  id: "chaosdramon",
  name: "カオスドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1041, atk: 497, def: 378 },
  statCaps: { hp: 3500, atk: 1519, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
  evolutionPaths: [],
  description: "ムゲンドラモンの上位種。赤い装甲の暴走兵器。ATK特化。",
  isEnemyOnly: false,
};

const millenniummon: MonsterDefinition = {
  id: "millenniummon",
  name: "ミレニアモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 1059, atk: 507, def: 368 },
  statCaps: { hp: 3500, atk: 1537, def: 1200 },
  evolutionRequirement: { hp: 180, atk: 100, def: 85, bossWorld: null },
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
