/**
 * 成熟期 (Champion) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP150/ATK45/DEF35, 上限 HP500/ATK140/DEF120
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const greymon: MonsterDefinition = {
  id: "greymon",
  name: "グレイモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 160, atk: 45, def: 35 },
  statCaps: { hp: 500, atk: 140, def: 120 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "holyangemon", branchType: BranchType.HP },
    { targetId: "weregarurumon", branchType: BranchType.DEF },
    { targetId: "megalogreymon", branchType: BranchType.ATK },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
  ],
  description:
    "巨大な恐竜型モンスター。頭部の角と炎のブレスが武器。HP型の上位進化。",
  isEnemyOnly: false,
};

const garurumon: MonsterDefinition = {
  id: "garurumon",
  name: "ガルルモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 150, atk: 42, def: 40 },
  statCaps: { hp: 480, atk: 130, def: 130 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "weregarurumon", branchType: BranchType.DEF },
    { targetId: "weregarurumon", branchType: BranchType.BALANCED },
    { targetId: "cyberdramon", branchType: BranchType.ATK },
    { targetId: "holyangemon", branchType: BranchType.HP },
  ],
  description: "巨大な狼型モンスター。冷気を操る。DEF型の上位進化。",
  isEnemyOnly: false,
};

const growlmon: MonsterDefinition = {
  id: "growlmon",
  name: "グラウモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 145, atk: 50, def: 32 },
  statCaps: { hp: 460, atk: 150, def: 110 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "megalogreymon", branchType: BranchType.ATK },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
    { targetId: "cyberdramon", branchType: BranchType.DEF },
    { targetId: "phantomon", branchType: BranchType.HP },
  ],
  description: "ギルモンの進化形。巨大化し攻撃力が飛躍的に向上。ATK型の上位進化。",
  isEnemyOnly: false,
};

const angemon: MonsterDefinition = {
  id: "angemon",
  name: "エンジェモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 165, atk: 43, def: 38 },
  statCaps: { hp: 520, atk: 135, def: 125 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "holyangemon", branchType: BranchType.HP },
    { targetId: "holyangemon", branchType: BranchType.BALANCED },
    { targetId: "phantomon", branchType: BranchType.ATK },
    { targetId: "weregarurumon", branchType: BranchType.DEF },
  ],
  description: "天使型モンスター。聖なる力で敵を浄化する。HP型の上位進化。",
  isEnemyOnly: false,
};

const devimon: MonsterDefinition = {
  id: "devimon",
  name: "デビモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 140, atk: 48, def: 33 },
  statCaps: { hp: 450, atk: 145, def: 115 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "phantomon", branchType: BranchType.ATK },
    { targetId: "phantomon", branchType: BranchType.HP },
    { targetId: "cyberdramon", branchType: BranchType.DEF },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
  ],
  description: "堕天使型モンスター。闇の力を操る。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const icedevimon: MonsterDefinition = {
  id: "icedevimon",
  name: "アイスデビモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 148, atk: 44, def: 37 },
  statCaps: { hp: 470, atk: 135, def: 125 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "cyberdramon", branchType: BranchType.DEF },
    { targetId: "cyberdramon", branchType: BranchType.ATK },
    { targetId: "phantomon", branchType: BranchType.HP },
    { targetId: "weregarurumon", branchType: BranchType.BALANCED },
  ],
  description: "氷の堕天使型モンスター。冷気と闇の力を操る。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const megidramon: MonsterDefinition = {
  id: "megidramon",
  name: "メギドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 138, atk: 52, def: 30 },
  statCaps: { hp: 440, atk: 155, def: 105 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "megalogreymon", branchType: BranchType.ATK },
    { targetId: "cyberdramon", branchType: BranchType.DEF },
    { targetId: "phantomon", branchType: BranchType.HP },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
  ],
  description: "暴走した邪竜型モンスター。破壊衝動に突き動かされる。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const leomon: MonsterDefinition = {
  id: "leomon",
  name: "レオモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 158, atk: 48, def: 34 },
  statCaps: { hp: 490, atk: 145, def: 115 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "rizegreymon", branchType: BranchType.ATK },
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "獣人型モンスター。正義感が強く「獣王拳」で戦う。ATK偏重。",
  isEnemyOnly: false,
};

const wizardmon: MonsterDefinition = {
  id: "wizardmon",
  name: "ウィザーモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 142, atk: 46, def: 38 },
  statCaps: { hp: 470, atk: 138, def: 122 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "taomon", branchType: BranchType.ATK },
    { targetId: "phantomon", branchType: BranchType.HP },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "silphymon", branchType: BranchType.BALANCED },
  ],
  description: "魔法使い型モンスター。多彩な魔法で敵を翻弄する。バランス型。",
  isEnemyOnly: false,
};

const birdramon: MonsterDefinition = {
  id: "birdramon",
  name: "バードラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 155, atk: 44, def: 36 },
  statCaps: { hp: 495, atk: 136, def: 118 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "silphymon", branchType: BranchType.ATK },
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "rizegreymon", branchType: BranchType.BALANCED },
  ],
  description: "巨大な火の鳥型モンスター。翼で炎を操り空を支配する。HP偏重。",
  isEnemyOnly: false,
};

const togemon: MonsterDefinition = {
  id: "togemon",
  name: "トゲモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 162, atk: 42, def: 37 },
  statCaps: { hp: 510, atk: 132, def: 120 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "rizegreymon", branchType: BranchType.ATK },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "lilamon", branchType: BranchType.BALANCED },
  ],
  description: "巨大なサボテン型モンスター。無数のトゲでパンチを繰り出す。HP偏重。",
  isEnemyOnly: false,
};

const gaogamon: MonsterDefinition = {
  id: "gaogamon",
  name: "ガオガモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 148, atk: 47, def: 35 },
  statCaps: { hp: 475, atk: 142, def: 116 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "machgaogamon", branchType: BranchType.ATK },
    { targetId: "machgaogamon", branchType: BranchType.HP },
    { targetId: "silphymon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "高速移動する獣型モンスター。鋭い爪で切り裂く。ATK偏重。",
  isEnemyOnly: false,
};

const wendimon: MonsterDefinition = {
  id: "wendimon",
  name: "ウェンディモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 153, atk: 50, def: 31 },
  statCaps: { hp: 465, atk: 148, def: 108 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "paildramon", branchType: BranchType.ATK },
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "machgaogamon", branchType: BranchType.BALANCED },
  ],
  description: "巨大な獣人型モンスター。長い腕で強烈な一撃を放つ。ATK特化。",
  isEnemyOnly: false,
};

const kyubimon: MonsterDefinition = {
  id: "kyubimon",
  name: "キュウビモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 144, atk: 45, def: 39 },
  statCaps: { hp: 468, atk: 136, def: 126 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "taomon", branchType: BranchType.ATK },
    { targetId: "silphymon", branchType: BranchType.HP },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "chirinmon", branchType: BranchType.BALANCED },
  ],
  description: "九本の尾を持つ妖狐型モンスター。鬼火で敵を焼く。DEF偏重。",
  isEnemyOnly: false,
};

const xveemon: MonsterDefinition = {
  id: "xveemon",
  name: "エクスブイモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 156, atk: 46, def: 33 },
  statCaps: { hp: 488, atk: 142, def: 114 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "paildramon", branchType: BranchType.ATK },
    { targetId: "rizegreymon", branchType: BranchType.HP },
    { targetId: "machgaogamon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "大型竜人型モンスター。胸のXマークからエネルギー弾を放つ。バランス型。",
  isEnemyOnly: false,
};

const stingmon: MonsterDefinition = {
  id: "stingmon",
  name: "スティングモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 146, atk: 44, def: 38 },
  statCaps: { hp: 472, atk: 134, def: 124 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "paildramon", branchType: BranchType.ATK },
    { targetId: "silphymon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "taomon", branchType: BranchType.BALANCED },
  ],
  description: "昆虫人型モンスター。腕のスパイクで敵を刺し貫く。DEF偏重。",
  isEnemyOnly: false,
};

const aquilamon: MonsterDefinition = {
  id: "aquilamon",
  name: "アクィラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 150, atk: 43, def: 37 },
  statCaps: { hp: 480, atk: 136, def: 120 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "silphymon", branchType: BranchType.ATK },
    { targetId: "rizegreymon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "silphymon", branchType: BranchType.BALANCED },
  ],
  description: "巨大な鷲型モンスター。角から衝撃波を放つ。バランス型。",
  isEnemyOnly: false,
};

const seasarmon: MonsterDefinition = {
  id: "seasarmon",
  name: "シーサモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 160, atk: 40, def: 40 },
  statCaps: { hp: 505, atk: 128, def: 128 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "machgaogamon", branchType: BranchType.ATK },
    { targetId: "taomon", branchType: BranchType.BALANCED },
  ],
  description: "聖獣型モンスター。守護の力で仲間を護る。HP/DEF偏重。",
  isEnemyOnly: false,
};

const sangloupmon: MonsterDefinition = {
  id: "sangloupmon",
  name: "サングルゥモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 138, atk: 51, def: 30 },
  statCaps: { hp: 440, atk: 152, def: 105 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "machgaogamon", branchType: BranchType.ATK },
    { targetId: "paildramon", branchType: BranchType.HP },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "rizegreymon", branchType: BranchType.BALANCED },
  ],
  description: "吸血鬼狼型モンスター。影に潜み獲物を襲う。ATK特化。",
  isEnemyOnly: false,
};

const dorugamon: MonsterDefinition = {
  id: "dorugamon",
  name: "ドルガモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 152, atk: 47, def: 34 },
  statCaps: { hp: 482, atk: 140, def: 118 },
  evolutionRequirement: { hp: 130, atk: 40, def: 30, bossWorld: 2 },
  evolutionPaths: [
    { targetId: "rizegreymon", branchType: BranchType.ATK },
    { targetId: "megalogreymon", branchType: BranchType.HP },
    { targetId: "silphymon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "古代竜型モンスター。口から鉄球を吐き出す。バランス型。",
  isEnemyOnly: false,
};

/** 成熟期 モンスター一覧 */
export const CHAMPION_MONSTERS: readonly MonsterDefinition[] = [
  greymon,
  garurumon,
  growlmon,
  angemon,
  devimon,
  icedevimon,
  megidramon,
  leomon,
  wizardmon,
  birdramon,
  togemon,
  gaogamon,
  wendimon,
  kyubimon,
  xveemon,
  stingmon,
  aquilamon,
  seasarmon,
  sangloupmon,
  dorugamon,
] as const;
