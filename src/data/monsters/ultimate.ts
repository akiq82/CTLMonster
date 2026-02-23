/**
 * 完全体 (Ultimate) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP350/ATK100/DEF80, 上限 HP1200/ATK320/DEF270
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const holyangemon: MonsterDefinition = {
  id: "holyangemon",
  name: "ホーリーエンジェモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 380, atk: 100, def: 85 },
  statCaps: { hp: 1200, atk: 300, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "seraphimon", branchType: BranchType.HP },
    { targetId: "holydramon", branchType: BranchType.BALANCED },
    { targetId: "piedmon", branchType: BranchType.ATK },
    { targetId: "magnamon", branchType: BranchType.DEF },
  ],
  description: "大天使型モンスター。聖なる剣と盾を持つ。HP型の完全体。",
  isEnemyOnly: false,
};

const weregarurumon: MonsterDefinition = {
  id: "weregarurumon",
  name: "ワーガルルモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 350, atk: 105, def: 90 },
  statCaps: { hp: 1100, atk: 310, def: 280 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
    { targetId: "vikemon", branchType: BranchType.BALANCED },
    { targetId: "blackwargreymon", branchType: BranchType.ATK },
    { targetId: "omegamon", branchType: BranchType.HP },
  ],
  description: "獣人型モンスター。格闘技で戦う。DEF型の完全体。",
  isEnemyOnly: false,
};

const megalogreymon: MonsterDefinition = {
  id: "megalogreymon",
  name: "メガログラウモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 360, atk: 115, def: 78 },
  statCaps: { hp: 1150, atk: 330, def: 260 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "dukemon", branchType: BranchType.ATK },
    { targetId: "dukemon", branchType: BranchType.BALANCED },
    { targetId: "machinedramon", branchType: BranchType.HP },
    { targetId: "venommyotismon", branchType: BranchType.DEF },
  ],
  description: "半機械化した巨大竜型。攻撃力が圧倒的。ATK型の完全体。",
  isEnemyOnly: false,
};

const phantomon: MonsterDefinition = {
  id: "phantomon",
  name: "ファントモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 340, atk: 108, def: 82 },
  statCaps: { hp: 1080, atk: 310, def: 265 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "piedmon", branchType: BranchType.ATK },
    { targetId: "venommyotismon", branchType: BranchType.HP },
    { targetId: "puppetmon", branchType: BranchType.DEF },
    { targetId: "diaboromon", branchType: BranchType.BALANCED },
  ],
  description: "幽霊型モンスター。鎌で敵の魂を刈り取る。闇の完全体。",
  isEnemyOnly: false,
};

const cyberdramon: MonsterDefinition = {
  id: "cyberdramon",
  name: "サイバードラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 355, atk: 110, def: 80 },
  statCaps: { hp: 1120, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "blackwargreymon", branchType: BranchType.ATK },
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
    { targetId: "machinedramon", branchType: BranchType.HP },
    { targetId: "diaboromon", branchType: BranchType.BALANCED },
  ],
  description: "サイボーグ竜型モンスター。高い機動力で敵を翻弄する。",
  isEnemyOnly: false,
};

const lilamon: MonsterDefinition = {
  id: "lilamon",
  name: "ライラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 365, atk: 98, def: 88 },
  statCaps: { hp: 1180, atk: 305, def: 275 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "rosemon", branchType: BranchType.HP },
    { targetId: "rosemon", branchType: BranchType.BALANCED },
    { targetId: "metalseadramon", branchType: BranchType.DEF },
    { targetId: "grandkuwagamon", branchType: BranchType.ATK },
  ],
  description: "花の妖精型モンスター。美しい花弁から強力なエネルギーを放つ。HP/バランス型。",
  isEnemyOnly: false,
};

const machgaogamon: MonsterDefinition = {
  id: "machgaogamon",
  name: "マッハガオガモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 345, atk: 112, def: 78 },
  statCaps: { hp: 1080, atk: 335, def: 255 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "miragegaogamon", branchType: BranchType.ATK },
    { targetId: "machinedramon", branchType: BranchType.BALANCED },
    { targetId: "blackwargreymon", branchType: BranchType.HP },
    { targetId: "metalseadramon", branchType: BranchType.DEF },
  ],
  description: "音速を超える獣型モンスター。高速の拳で敵を粉砕する。ATK特化型。",
  isEnemyOnly: false,
};

const taomon: MonsterDefinition = {
  id: "taomon",
  name: "タオモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 370, atk: 96, def: 92 },
  statCaps: { hp: 1200, atk: 298, def: 280 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "sakuyamon", branchType: BranchType.DEF },
    { targetId: "sakuyamon", branchType: BranchType.BALANCED },
    { targetId: "puppetmon", branchType: BranchType.HP },
    { targetId: "piedmon", branchType: BranchType.ATK },
  ],
  description: "陰陽師型モンスター。筆から強力な呪術を繰り出す。DEF偏重型。",
  isEnemyOnly: false,
};

const paildramon: MonsterDefinition = {
  id: "paildramon",
  name: "パイルドラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 358, atk: 108, def: 82 },
  statCaps: { hp: 1140, atk: 325, def: 265 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "imperialdramon", branchType: BranchType.ATK },
    { targetId: "imperialdramon", branchType: BranchType.BALANCED },
    { targetId: "venommyotismon", branchType: BranchType.HP },
    { targetId: "grandkuwagamon", branchType: BranchType.DEF },
  ],
  description: "竜人型モンスター。二丁の大砲で圧倒的な火力を誇る。ATK偏重型。",
  isEnemyOnly: false,
};

const silphymon: MonsterDefinition = {
  id: "silphymon",
  name: "シルフィーモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 348, atk: 102, def: 85 },
  statCaps: { hp: 1100, atk: 312, def: 268 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "rosemon", branchType: BranchType.HP },
    { targetId: "valkyrimon", branchType: BranchType.ATK },
    { targetId: "valkyrimon", branchType: BranchType.DEF },
    { targetId: "imperialdramon", branchType: BranchType.BALANCED },
  ],
  description: "鳥人型モンスター。風を操り空中戦を得意とする。バランス型。",
  isEnemyOnly: false,
};

const rizegreymon: MonsterDefinition = {
  id: "rizegreymon",
  name: "ライズグレイモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 375, atk: 110, def: 76 },
  statCaps: { hp: 1160, atk: 330, def: 258 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "blackwargreymon", branchType: BranchType.ATK },
    { targetId: "machinedramon", branchType: BranchType.HP },
    { targetId: "miragegaogamon", branchType: BranchType.DEF },
    { targetId: "dukemon", branchType: BranchType.BALANCED },
  ],
  description: "半機械化した巨大竜型。リボルバー砲で敵を撃ち抜く。ATK型。",
  isEnemyOnly: false,
};

const chirinmon: MonsterDefinition = {
  id: "chirinmon",
  name: "チリンモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 362, atk: 95, def: 90 },
  statCaps: { hp: 1190, atk: 295, def: 278 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "puppetmon", branchType: BranchType.DEF },
    { targetId: "venommyotismon", branchType: BranchType.HP },
    { targetId: "grandkuwagamon", branchType: BranchType.ATK },
    { targetId: "sakuyamon", branchType: BranchType.BALANCED },
  ],
  description: "聖獣型モンスター。空を駆け風を操る一角獣。DEF偏重型。",
  isEnemyOnly: false,
};

// ========== 敵専用から昇格 ==========

const skullgreymon: MonsterDefinition = {
  id: "skullgreymon",
  name: "スカルグレイモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 355, atk: 118, def: 78 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "blackwargreymon", branchType: BranchType.ATK },
    { targetId: "machinedramon", branchType: BranchType.HP },
    { targetId: "venommyotismon", branchType: BranchType.DEF },
    { targetId: "diaboromon", branchType: BranchType.BALANCED },
  ],
  description: "暴走進化した骸骨竜型。理性を失い破壊衝動のみで動く。ATK特化型。",
  isEnemyOnly: false,
};

const metalgreymon_virus: MonsterDefinition = {
  id: "metalgreymon_virus",
  name: "メタルグレイモン(ウイルス)",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 375, atk: 110, def: 84 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "machinedramon", branchType: BranchType.ATK },
    { targetId: "blackwargreymon", branchType: BranchType.HP },
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
    { targetId: "venommyotismon", branchType: BranchType.BALANCED },
  ],
  description: "ウイルスに侵されたメタルグレイモン。暴走する兵器。",
  isEnemyOnly: false,
};

const megadramon: MonsterDefinition = {
  id: "megadramon",
  name: "メガドラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 360, atk: 115, def: 82 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "machinedramon", branchType: BranchType.ATK },
    { targetId: "diaboromon", branchType: BranchType.HP },
    { targetId: "metalseadramon", branchType: BranchType.DEF },
    { targetId: "blackwargreymon", branchType: BranchType.BALANCED },
  ],
  description: "機械化された暗黒竜型。腕のミサイルで攻撃する。ATK偏重型。",
  isEnemyOnly: false,
};

const gigadramon: MonsterDefinition = {
  id: "gigadramon",
  name: "ギガドラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 370, atk: 112, def: 85 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "machinedramon", branchType: BranchType.ATK },
    { targetId: "grandkuwagamon", branchType: BranchType.HP },
    { targetId: "piedmon", branchType: BranchType.DEF },
    { targetId: "diaboromon", branchType: BranchType.BALANCED },
  ],
  description: "メガドラモンの上位種。より大型の兵器を搭載した暗黒竜。",
  isEnemyOnly: false,
};

const mammothmon: MonsterDefinition = {
  id: "mammothmon",
  name: "マンモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 380, atk: 105, def: 88 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "venommyotismon", branchType: BranchType.HP },
    { targetId: "puppetmon", branchType: BranchType.ATK },
    { targetId: "metalseadramon", branchType: BranchType.DEF },
    { targetId: "grandkuwagamon", branchType: BranchType.BALANCED },
  ],
  description: "古代のマンモス型モンスター。氷のブレスで全てを凍てつかせる。HP偏重型。",
  isEnemyOnly: false,
};

const datamon: MonsterDefinition = {
  id: "datamon",
  name: "ナノモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 340, atk: 108, def: 92 },
  statCaps: { hp: 1200, atk: 320, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "machinedramon", branchType: BranchType.ATK },
    { targetId: "piedmon", branchType: BranchType.HP },
    { targetId: "puppetmon", branchType: BranchType.DEF },
    { targetId: "diaboromon", branchType: BranchType.BALANCED },
  ],
  description: "超小型マシン型モンスター。電子攻撃でシステムを破壊する。マシン系統。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const shakkoumon: MonsterDefinition = {
  id: "shakkoumon",
  name: "シャッコウモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 375, atk: 95, def: 92 },
  statCaps: { hp: 1200, atk: 295, def: 280 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "vikemon", branchType: BranchType.DEF },
    { targetId: "vikemon", branchType: BranchType.HP },
    { targetId: "magnamon", branchType: BranchType.ATK },
    { targetId: "sakuyamon", branchType: BranchType.BALANCED },
  ],
  description: "アンキロモンのジョグレス完全体。土偶型の聖なる守護者。DEF偏重。",
  isEnemyOnly: false,
};

const angewomon: MonsterDefinition = {
  id: "angewomon",
  name: "エンジェウーモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 365, atk: 102, def: 86 },
  statCaps: { hp: 1180, atk: 310, def: 272 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "holydramon", branchType: BranchType.HP },
    { targetId: "holydramon", branchType: BranchType.BALANCED },
    { targetId: "magnamon", branchType: BranchType.ATK },
    { targetId: "rosemon", branchType: BranchType.DEF },
  ],
  description: "テイルモンの完全体。大天使型の美しき戦士。HP偏重型。",
  isEnemyOnly: false,
};

const kimeramon: MonsterDefinition = {
  id: "kimeramon",
  name: "キメラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 350, atk: 118, def: 76 },
  statCaps: { hp: 1100, atk: 335, def: 255 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "daemon", branchType: BranchType.ATK },
    { targetId: "belialvamdemon", branchType: BranchType.HP },
    { targetId: "millenniummon", branchType: BranchType.DEF },
    { targetId: "chaosdramon", branchType: BranchType.BALANCED },
  ],
  description: "02ヴィラン。複数のモンスターを合成した合成獣型。ATK特化。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const megaseadramon: MonsterDefinition = {
  id: "megaseadramon",
  name: "メガシードラモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 360, atk: 105, def: 86 },
  statCaps: { hp: 1160, atk: 315, def: 270 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "metalseadramon", branchType: BranchType.DEF },
    { targetId: "metalseadramon", branchType: BranchType.HP },
    { targetId: "grandkuwagamon", branchType: BranchType.ATK },
    { targetId: "venommyotismon", branchType: BranchType.BALANCED },
  ],
  description: "メタルシードラモン前段階。雷撃で海を支配する巨大海竜型。",
  isEnemyOnly: false,
};

const metaltyranomon: MonsterDefinition = {
  id: "metaltyranomon",
  name: "メタルティラノモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 370, atk: 108, def: 84 },
  statCaps: { hp: 1140, atk: 322, def: 265 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "chaosdramon", branchType: BranchType.ATK },
    { targetId: "blackwargreymon", branchType: BranchType.HP },
    { targetId: "vikemon", branchType: BranchType.DEF },
    { targetId: "machinedramon", branchType: BranchType.BALANCED },
  ],
  description: "ダークティラノモンの進化先。機械化された恐竜型。",
  isEnemyOnly: false,
};

const myotismon: MonsterDefinition = {
  id: "myotismon",
  name: "ヴァンデモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 358, atk: 112, def: 80 },
  statCaps: { hp: 1120, atk: 328, def: 260 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "belialvamdemon", branchType: BranchType.ATK },
    { targetId: "venommyotismon", branchType: BranchType.HP },
    { targetId: "daemon", branchType: BranchType.DEF },
    { targetId: "belialvamdemon", branchType: BranchType.BALANCED },
  ],
  description: "アイコニックヴィラン。吸血鬼型の完全体。ATK偏重。",
  isEnemyOnly: false,
};

const ladydevimon: MonsterDefinition = {
  id: "ladydevimon",
  name: "レディーデビモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 345, atk: 114, def: 78 },
  statCaps: { hp: 1080, atk: 332, def: 255 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "daemon", branchType: BranchType.ATK },
    { targetId: "belialvamdemon", branchType: BranchType.HP },
    { targetId: "millenniummon", branchType: BranchType.DEF },
    { targetId: "piedmon", branchType: BranchType.BALANCED },
  ],
  description: "闇の女戦士。堕天使型の妖艶な完全体。ATK特化。",
  isEnemyOnly: false,
};

const infermon: MonsterDefinition = {
  id: "infermon",
  name: "インフェルモン",
  stage: EvolutionStage.ULTIMATE,
  baseStats: { hp: 352, atk: 110, def: 82 },
  statCaps: { hp: 1110, atk: 325, def: 262 },
  evolutionRequirement: { hp: 350, atk: 95, def: 75, bossWorld: 4 },
  evolutionPaths: [
    { targetId: "diaboromon", branchType: BranchType.ATK },
    { targetId: "chaosdramon", branchType: BranchType.BALANCED },
    { targetId: "millenniummon", branchType: BranchType.HP },
    { targetId: "metalseadramon", branchType: BranchType.DEF },
  ],
  description: "ディアボロモン前段階。ネット上を暴走する蜘蛛型。ATK偏重。",
  isEnemyOnly: false,
};

/** 完全体 モンスター一覧 */
export const ULTIMATE_MONSTERS: readonly MonsterDefinition[] = [
  holyangemon,
  weregarurumon,
  megalogreymon,
  phantomon,
  cyberdramon,
  lilamon,
  machgaogamon,
  taomon,
  paildramon,
  silphymon,
  rizegreymon,
  chirinmon,
  skullgreymon,
  metalgreymon_virus,
  megadramon,
  gigadramon,
  mammothmon,
  datamon,
  shakkoumon,
  angewomon,
  kimeramon,
  megaseadramon,
  metaltyranomon,
  myotismon,
  ladydevimon,
  infermon,
] as const;
