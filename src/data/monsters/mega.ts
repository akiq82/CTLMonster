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
  baseStats: { hp: 4250, atk: 1437, def: 1230 },
  statCaps: { hp: 15000, atk: 4875, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 487, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "最高位の天使型究極体。聖なる力でワールドを守護する。HP特化型。",
  isEnemyOnly: false,
};

const metalgarurumon: MonsterDefinition = {
  id: "metalgarurumon",
  name: "メタルガルルモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4000, atk: 1500, def: 1292 },
  statCaps: { hp: 14000, atk: 4937, def: 4061 },
  evolutionRequirement: { hp: 1120, atk: 493, def: 406, bossWorld: 8 },
  evolutionPaths: [],
  description: "全身を金属装甲で覆った獣型究極体。鉄壁の防御力。DEF特化型。",
  isEnemyOnly: false,
};

const dukemon: MonsterDefinition = {
  id: "dukemon",
  name: "デュークモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4050, atk: 1562, def: 1168 },
  statCaps: { hp: 13500, atk: 5125, def: 3876 },
  evolutionRequirement: { hp: 1080, atk: 512, def: 387, bossWorld: 8 },
  evolutionPaths: [],
  description: "聖騎士型究極体。聖槍と聖盾を携え、すべての敵を打ち砕く。ATK特化型。",
  isEnemyOnly: false,
};

const omegamon: MonsterDefinition = {
  id: "omegamon",
  name: "オメガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4150, atk: 1531, def: 1230 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description:
    "全系統が均衡した者だけが到達する隠し究極体。最強のバランス型。",
  isEnemyOnly: false,
};

const rosemon: MonsterDefinition = {
  id: "rosemon",
  name: "ロゼモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4200, atk: 1468, def: 1199 },
  statCaps: { hp: 15000, atk: 4906, def: 3987 },
  evolutionRequirement: { hp: 1200, atk: 490, def: 398, bossWorld: 8 },
  evolutionPaths: [],
  description: "薔薇の女王型究極体。美しさと強さを兼ね備える。HP/バランス型。",
  isEnemyOnly: false,
};

const miragegaogamon: MonsterDefinition = {
  id: "miragegaogamon",
  name: "ミラージュガオガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 3950, atk: 1574, def: 1156 },
  statCaps: { hp: 13750, atk: 5062, def: 3907 },
  evolutionRequirement: { hp: 1100, atk: 506, def: 390, bossWorld: 8 },
  evolutionPaths: [],
  description: "蜃気楼を纏う獣騎士型究極体。超高速で敵を翻弄する。ATK特化型。",
  isEnemyOnly: false,
};

const sakuyamon: MonsterDefinition = {
  id: "sakuyamon",
  name: "サクヤモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4100, atk: 1424, def: 1279 },
  statCaps: { hp: 14500, atk: 4812, def: 4092 },
  evolutionRequirement: { hp: 1160, atk: 481, def: 409, bossWorld: 8 },
  evolutionPaths: [],
  description: "巫女型究極体。神聖な結界で味方を守り敵を封じる。DEF特化型。",
  isEnemyOnly: false,
};

const imperialdramon: MonsterDefinition = {
  id: "imperialdramon",
  name: "インペリアルドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4300, atk: 1550, def: 1181 },
  statCaps: { hp: 15000, atk: 5000, def: 3969 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 396, bossWorld: 8 },
  evolutionPaths: [],
  description: "古代竜型究極体。圧倒的な力で全てを薙ぎ払う。ATK/HP型。",
  isEnemyOnly: false,
};

// ========== 敵専用から昇格した究極体 ==========

const piedmon: MonsterDefinition = {
  id: "piedmon",
  name: "ピエモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4250, atk: 1550, def: 1218 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "闇の四天王の一体。道化師の姿で四本の剣を操る。ATK偏重型。",
  isEnemyOnly: false,
};

const machinedramon: MonsterDefinition = {
  id: "machinedramon",
  name: "ムゲンドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4400, atk: 1593, def: 1261 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "闇の四天王の一体。全身が機械の巨大竜型。無限の砲門を持つ。HP/ATK型。",
  isEnemyOnly: false,
};

const metalseadramon: MonsterDefinition = {
  id: "metalseadramon",
  name: "メタルシードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4175, atk: 1512, def: 1230 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "闇の四天王の一体。金属の鎧を纏った海竜型。深海の支配者。DEF偏重型。",
  isEnemyOnly: false,
};

const puppetmon: MonsterDefinition = {
  id: "puppetmon",
  name: "ピノッチモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4050, atk: 1500, def: 1200 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "闇の四天王の一体。木偶人形の姿だが恐るべき力を秘める。バランス型。",
  isEnemyOnly: false,
};

const blackwargreymon: MonsterDefinition = {
  id: "blackwargreymon",
  name: "ブラックウォーグレイモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4350, atk: 1625, def: 1230 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "暗黒の竜戦士型究極体。存在意義を求めて彷徨う孤高の戦士。ATK特化型。",
  isEnemyOnly: false,
};

const diaboromon: MonsterDefinition = {
  id: "diaboromon",
  name: "ディアボロモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4225, atk: 1562, def: 1200 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "ネットワーク上に出現した究極体。無限に自己増殖する恐怖の存在。ATK偏重型。",
  isEnemyOnly: false,
};

const venommyotismon: MonsterDefinition = {
  id: "venommyotismon",
  name: "ヴェノムヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4450, atk: 1531, def: 1243 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "吸血鬼型究極体が暴走した異形。圧倒的な体力で敵を圧殺する。HP特化型。",
  isEnemyOnly: false,
};

const grandkuwagamon: MonsterDefinition = {
  id: "grandkuwagamon",
  name: "グランクワガーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4275, atk: 1575, def: 1206 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "巨大なクワガタ型究極体。大顎で全てを断ち切る。ATK偏重型。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const magnamon: MonsterDefinition = {
  id: "magnamon",
  name: "マグナモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4200, atk: 1530, def: 1242 },
  statCaps: { hp: 15000, atk: 4968, def: 4030 },
  evolutionRequirement: { hp: 1200, atk: 496, def: 403, bossWorld: 8 },
  evolutionPaths: [],
  description: "ブイモンのアーマー究極体(奇跡)。黄金の聖騎士。バランス型。",
  isEnemyOnly: false,
};

const vikemon: MonsterDefinition = {
  id: "vikemon",
  name: "ヴァイクモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4400, atk: 1468, def: 1292 },
  statCaps: { hp: 15000, atk: 4875, def: 4092 },
  evolutionRequirement: { hp: 1200, atk: 487, def: 409, bossWorld: 8 },
  evolutionPaths: [],
  description: "アルマジモンライン究極体。バイキング型の氷の巨人。HP/DEF型。",
  isEnemyOnly: false,
};

const valkyrimon: MonsterDefinition = {
  id: "valkyrimon",
  name: "ヴァルキリモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4125, atk: 1549, def: 1199 },
  statCaps: { hp: 14500, atk: 5031, def: 3969 },
  evolutionRequirement: { hp: 1160, atk: 503, def: 396, bossWorld: 8 },
  evolutionPaths: [],
  description: "ホークモンライン究極体。戦乙女型の高速戦士。ATK偏重。",
  isEnemyOnly: false,
};

const holydramon: MonsterDefinition = {
  id: "holydramon",
  name: "ホーリードラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4300, atk: 1487, def: 1218 },
  statCaps: { hp: 15000, atk: 4937, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 493, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "テイルモンライン究極体。聖なる神竜型。HP偏重。",
  isEnemyOnly: false,
};

const daemon: MonsterDefinition = {
  id: "daemon",
  name: "デーモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4350, atk: 1612, def: 1199 },
  statCaps: { hp: 15000, atk: 5062, def: 3969 },
  evolutionRequirement: { hp: 1200, atk: 506, def: 396, bossWorld: 8 },
  evolutionPaths: [],
  description: "02ヴィランボス。七大魔王の一体。圧倒的な闇の力。ATK特化。",
  isEnemyOnly: false,
};

const belialvamdemon: MonsterDefinition = {
  id: "belialvamdemon",
  name: "ベリアルヴァンデモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4475, atk: 1575, def: 1218 },
  statCaps: { hp: 15000, atk: 5000, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 500, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "02最終ボス。ヴァンデモンの最終形態。HP/ATK型。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const chaosdramon: MonsterDefinition = {
  id: "chaosdramon",
  name: "カオスドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4425, atk: 1624, def: 1261 },
  statCaps: { hp: 15000, atk: 5062, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 506, def: 400, bossWorld: 8 },
  evolutionPaths: [],
  description: "ムゲンドラモンの上位種。赤い装甲の暴走兵器。ATK特化。",
  isEnemyOnly: false,
};

const millenniummon: MonsterDefinition = {
  id: "millenniummon",
  name: "ミレニアモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 4500, atk: 1656, def: 1230 },
  statCaps: { hp: 15000, atk: 5125, def: 4000 },
  evolutionRequirement: { hp: 1200, atk: 512, def: 400, bossWorld: 8 },
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
