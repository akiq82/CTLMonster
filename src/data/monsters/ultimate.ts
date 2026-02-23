/**
 * 完全体 (Ultimate) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP1700~1900/ATK741~921/DEF562~681, 上限 HP5400~6000/ATK2304~2617/DEF1888~2074
 * ステージ基準上限: HP6000/ATK2500/DEF2000
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
  baseStats: { hp: 1900, atk: 781, def: 629 },
  statCaps: { hp: 6000, atk: 2343, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 281, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1750, atk: 819, def: 666 },
  statCaps: { hp: 5500, atk: 2421, def: 2074 },
  evolutionRequirement: { hp: 550, atk: 290, def: 248, bossWorld: 3 },
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
  baseStats: { hp: 1800, atk: 898, def: 577 },
  statCaps: { hp: 5750, atk: 2578, def: 1925 },
  evolutionRequirement: { hp: 575, atk: 309, def: 231, bossWorld: 3 },
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
  baseStats: { hp: 1700, atk: 843, def: 606 },
  statCaps: { hp: 5400, atk: 2421, def: 1962 },
  evolutionRequirement: { hp: 540, atk: 290, def: 235, bossWorld: 3 },
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
  baseStats: { hp: 1775, atk: 859, def: 592 },
  statCaps: { hp: 5600, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 560, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1825, atk: 765, def: 651 },
  statCaps: { hp: 5900, atk: 2382, def: 2037 },
  evolutionRequirement: { hp: 590, atk: 285, def: 244, bossWorld: 3 },
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
  baseStats: { hp: 1725, atk: 874, def: 577 },
  statCaps: { hp: 5400, atk: 2617, def: 1888 },
  evolutionRequirement: { hp: 540, atk: 314, def: 226, bossWorld: 3 },
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
  baseStats: { hp: 1850, atk: 750, def: 681 },
  statCaps: { hp: 6000, atk: 2328, def: 2074 },
  evolutionRequirement: { hp: 600, atk: 279, def: 248, bossWorld: 3 },
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
  baseStats: { hp: 1790, atk: 843, def: 606 },
  statCaps: { hp: 5700, atk: 2539, def: 1962 },
  evolutionRequirement: { hp: 570, atk: 304, def: 235, bossWorld: 3 },
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
  baseStats: { hp: 1740, atk: 796, def: 629 },
  statCaps: { hp: 5500, atk: 2437, def: 1985 },
  evolutionRequirement: { hp: 550, atk: 292, def: 238, bossWorld: 3 },
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
  baseStats: { hp: 1875, atk: 859, def: 562 },
  statCaps: { hp: 5800, atk: 2578, def: 1911 },
  evolutionRequirement: { hp: 580, atk: 309, def: 229, bossWorld: 3 },
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
  baseStats: { hp: 1810, atk: 741, def: 666 },
  statCaps: { hp: 5950, atk: 2304, def: 2059 },
  evolutionRequirement: { hp: 595, atk: 276, def: 247, bossWorld: 3 },
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
  baseStats: { hp: 1775, atk: 921, def: 577 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1875, atk: 859, def: 622 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1800, atk: 898, def: 607 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1850, atk: 875, def: 629 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1900, atk: 820, def: 651 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1700, atk: 843, def: 681 },
  statCaps: { hp: 6000, atk: 2500, def: 2000 },
  evolutionRequirement: { hp: 600, atk: 300, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1875, atk: 741, def: 681 },
  statCaps: { hp: 6000, atk: 2304, def: 2074 },
  evolutionRequirement: { hp: 600, atk: 276, def: 248, bossWorld: 3 },
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
  baseStats: { hp: 1825, atk: 796, def: 636 },
  statCaps: { hp: 5900, atk: 2421, def: 2014 },
  evolutionRequirement: { hp: 590, atk: 290, def: 241, bossWorld: 3 },
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
  baseStats: { hp: 1750, atk: 921, def: 562 },
  statCaps: { hp: 5500, atk: 2617, def: 1888 },
  evolutionRequirement: { hp: 550, atk: 314, def: 226, bossWorld: 3 },
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
  baseStats: { hp: 1800, atk: 820, def: 637 },
  statCaps: { hp: 5800, atk: 2460, def: 2000 },
  evolutionRequirement: { hp: 580, atk: 295, def: 240, bossWorld: 3 },
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
  baseStats: { hp: 1850, atk: 843, def: 621 },
  statCaps: { hp: 5700, atk: 2515, def: 1962 },
  evolutionRequirement: { hp: 570, atk: 301, def: 235, bossWorld: 3 },
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
  baseStats: { hp: 1790, atk: 874, def: 592 },
  statCaps: { hp: 5600, atk: 2562, def: 1925 },
  evolutionRequirement: { hp: 560, atk: 307, def: 231, bossWorld: 3 },
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
  baseStats: { hp: 1725, atk: 890, def: 577 },
  statCaps: { hp: 5400, atk: 2593, def: 1888 },
  evolutionRequirement: { hp: 540, atk: 311, def: 226, bossWorld: 3 },
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
  baseStats: { hp: 1760, atk: 859, def: 607 },
  statCaps: { hp: 5550, atk: 2539, def: 1940 },
  evolutionRequirement: { hp: 555, atk: 304, def: 232, bossWorld: 3 },
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
