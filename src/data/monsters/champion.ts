/**
 * 成熟期 (Champion) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP800/ATK257/DEF189, 上限 HP2500/ATK800/DEF650
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
  baseStats: { hp: 200, atk: 88, def: 70 },
  statCaps: { hp: 600, atk: 260, def: 210 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "metalgreymon_virus", branchType: BranchType.HP },
    { targetId: "skullgreymon", branchType: BranchType.ATK },
    { targetId: "megalogreymon", branchType: BranchType.DEF },
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
  baseStats: { hp: 188, atk: 82, def: 80 },
  statCaps: { hp: 576, atk: 241, def: 227 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 181, atk: 98, def: 64 },
  statCaps: { hp: 552, atk: 279, def: 192 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 206, atk: 84, def: 76 },
  statCaps: { hp: 624, atk: 251, def: 219 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "holyangemon", branchType: BranchType.HP },
    { targetId: "angewomon", branchType: BranchType.BALANCED },
    { targetId: "phantomon", branchType: BranchType.ATK },
    { targetId: "shakkoumon", branchType: BranchType.DEF },
  ],
  description: "天使型モンスター。聖なる力で敵を浄化する。HP型の上位進化。",
  isEnemyOnly: false,
};

const devimon: MonsterDefinition = {
  id: "devimon",
  name: "デビモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 175, atk: 94, def: 66 },
  statCaps: { hp: 540, atk: 269, def: 201 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "phantomon", branchType: BranchType.ATK },
    { targetId: "skullgreymon", branchType: BranchType.HP },
    { targetId: "mammothmon", branchType: BranchType.DEF },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
  ],
  description: "堕天使型モンスター。闇の力を操る。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const icedevimon: MonsterDefinition = {
  id: "icedevimon",
  name: "アイスデビモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 185, atk: 86, def: 74 },
  statCaps: { hp: 564, atk: 251, def: 219 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "mammothmon", branchType: BranchType.DEF },
    { targetId: "datamon", branchType: BranchType.ATK },
    { targetId: "metalgreymon_virus", branchType: BranchType.HP },
    { targetId: "weregarurumon", branchType: BranchType.BALANCED },
  ],
  description: "氷の堕天使型モンスター。冷気と闇の力を操る。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const megidramon: MonsterDefinition = {
  id: "megidramon",
  name: "メギドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 173, atk: 101, def: 60 },
  statCaps: { hp: 528, atk: 288, def: 184 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "megadramon", branchType: BranchType.ATK },
    { targetId: "gigadramon", branchType: BranchType.DEF },
    { targetId: "skullgreymon", branchType: BranchType.HP },
    { targetId: "megalogreymon", branchType: BranchType.BALANCED },
  ],
  description: "暴走した邪竜型モンスター。破壊衝動に突き動かされる。ステ不足時の妥協進化。",
  isEnemyOnly: false,
};

const leomon: MonsterDefinition = {
  id: "leomon",
  name: "レオモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 198, atk: 94, def: 68 },
  statCaps: { hp: 588, atk: 269, def: 201 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 178, atk: 90, def: 76 },
  statCaps: { hp: 564, atk: 256, def: 213 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 194, atk: 86, def: 72 },
  statCaps: { hp: 594, atk: 253, def: 206 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 203, atk: 82, def: 74 },
  statCaps: { hp: 612, atk: 245, def: 210 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 185, atk: 92, def: 70 },
  statCaps: { hp: 570, atk: 264, def: 203 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 191, atk: 98, def: 62 },
  statCaps: { hp: 558, atk: 275, def: 189 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 180, atk: 88, def: 78 },
  statCaps: { hp: 562, atk: 253, def: 220 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 195, atk: 90, def: 66 },
  statCaps: { hp: 586, atk: 264, def: 199 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "paildramon", branchType: BranchType.ATK },
    { targetId: "kimeramon", branchType: BranchType.HP },
    { targetId: "infermon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "大型竜人型モンスター。胸のXマークからエネルギー弾を放つ。バランス型。",
  isEnemyOnly: false,
};

const stingmon: MonsterDefinition = {
  id: "stingmon",
  name: "スティングモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 183, atk: 86, def: 76 },
  statCaps: { hp: 566, atk: 249, def: 217 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 188, atk: 84, def: 74 },
  statCaps: { hp: 576, atk: 253, def: 210 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 200, atk: 78, def: 80 },
  statCaps: { hp: 606, atk: 238, def: 224 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 173, atk: 100, def: 60 },
  statCaps: { hp: 528, atk: 282, def: 184 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
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
  baseStats: { hp: 190, atk: 92, def: 68 },
  statCaps: { hp: 578, atk: 260, def: 206 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "rizegreymon", branchType: BranchType.ATK },
    { targetId: "megalogreymon", branchType: BranchType.HP },
    { targetId: "silphymon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "古代竜型モンスター。口から鉄球を吐き出す。バランス型。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const ankylomon: MonsterDefinition = {
  id: "ankylomon",
  name: "アンキロモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 206, atk: 78, def: 84 },
  statCaps: { hp: 612, atk: 238, def: 227 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "mammothmon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.DEF },
    { targetId: "rizegreymon", branchType: BranchType.ATK },
    { targetId: "silphymon", branchType: BranchType.BALANCED },
  ],
  description: "アンキロサウルス型モンスター。鉄壁の甲羅と鉄球の尾を持つ。DEF偏重。",
  isEnemyOnly: false,
};

const tailmon: MonsterDefinition = {
  id: "tailmon",
  name: "テイルモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 185, atk: 90, def: 76 },
  statCaps: { hp: 570, atk: 256, def: 217 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "angewomon", branchType: BranchType.HP },
    { targetId: "angewomon", branchType: BranchType.BALANCED },
    { targetId: "myotismon", branchType: BranchType.ATK },
    { targetId: "ladydevimon", branchType: BranchType.DEF },
  ],
  description: "聖なる猫型モンスター。ヒカリのパートナー。敏捷で攻撃力も高い。",
  isEnemyOnly: false,
};

const flamedramon: MonsterDefinition = {
  id: "flamedramon",
  name: "フレイドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 188, atk: 98, def: 64 },
  statCaps: { hp: 564, atk: 275, def: 192 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "megalogreymon", branchType: BranchType.ATK },
    { targetId: "paildramon", branchType: BranchType.HP },
    { targetId: "cyberdramon", branchType: BranchType.DEF },
    { targetId: "rizegreymon", branchType: BranchType.BALANCED },
  ],
  description: "ブイモンのアーマー進化(勇気)。炎を纏った竜戦士。ATK特化。",
  isEnemyOnly: false,
};

const raidramon: MonsterDefinition = {
  id: "raidramon",
  name: "ライドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 190, atk: 86, def: 76 },
  statCaps: { hp: 576, atk: 253, def: 213 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "paildramon", branchType: BranchType.DEF },
    { targetId: "machgaogamon", branchType: BranchType.ATK },
    { targetId: "weregarurumon", branchType: BranchType.HP },
    { targetId: "cyberdramon", branchType: BranchType.BALANCED },
  ],
  description: "ブイモンのアーマー進化(友情)。電撃を纏った獣型。DEF偏重。",
  isEnemyOnly: false,
};

const digmon: MonsterDefinition = {
  id: "digmon",
  name: "ディグモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 198, atk: 84, def: 80 },
  statCaps: { hp: 588, atk: 245, def: 224 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "mammothmon", branchType: BranchType.DEF },
    { targetId: "datamon", branchType: BranchType.ATK },
    { targetId: "lilamon", branchType: BranchType.HP },
    { targetId: "chirinmon", branchType: BranchType.BALANCED },
  ],
  description: "アルマジモンのアーマー進化(知識)。ドリル腕で地中を掘り進む。DEF偏重。",
  isEnemyOnly: false,
};

const halsemon: MonsterDefinition = {
  id: "halsemon",
  name: "ホルスモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 188, atk: 86, def: 74 },
  statCaps: { hp: 574, atk: 253, def: 210 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "silphymon", branchType: BranchType.ATK },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "rizegreymon", branchType: BranchType.HP },
    { targetId: "silphymon", branchType: BranchType.BALANCED },
  ],
  description: "ホークモンのアーマー進化(愛情)。鷲獅子型の飛行モンスター。バランス型。",
  isEnemyOnly: false,
};

const shurimon: MonsterDefinition = {
  id: "shurimon",
  name: "シュリモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 178, atk: 94, def: 68 },
  statCaps: { hp: 552, atk: 264, def: 196 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "phantomon", branchType: BranchType.ATK },
    { targetId: "machgaogamon", branchType: BranchType.HP },
    { targetId: "taomon", branchType: BranchType.DEF },
    { targetId: "paildramon", branchType: BranchType.BALANCED },
  ],
  description: "ホークモンのアーマー進化(純真)。忍者型の素早いモンスター。ATK偏重。",
  isEnemyOnly: false,
};

const submarimon: MonsterDefinition = {
  id: "submarimon",
  name: "サブマリモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 200, atk: 78, def: 84 },
  statCaps: { hp: 606, atk: 234, def: 227 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "mammothmon", branchType: BranchType.HP },
    { targetId: "datamon", branchType: BranchType.DEF },
    { targetId: "megadramon", branchType: BranchType.ATK },
    { targetId: "chirinmon", branchType: BranchType.BALANCED },
  ],
  description: "アルマジモンのアーマー進化(誠実)。潜水艦型。HP/DEF偏重。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const tyrannomon: MonsterDefinition = {
  id: "tyrannomon",
  name: "ティラノモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 200, atk: 90, def: 70 },
  statCaps: { hp: 600, atk: 260, def: 206 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "metaltyranomon", branchType: BranchType.HP },
    { targetId: "skullgreymon", branchType: BranchType.ATK },
    { targetId: "mammothmon", branchType: BranchType.DEF },
    { targetId: "metaltyranomon", branchType: BranchType.BALANCED },
  ],
  description: "恐竜の原点。ダークティラノモンの正統進化元。バランスの良い恐竜型。",
  isEnemyOnly: false,
};

const seadramon: MonsterDefinition = {
  id: "seadramon",
  name: "シードラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 194, atk: 84, def: 76 },
  statCaps: { hp: 586, atk: 249, def: 217 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "megaseadramon", branchType: BranchType.ATK },
    { targetId: "megaseadramon", branchType: BranchType.HP },
    { targetId: "mammothmon", branchType: BranchType.DEF },
    { targetId: "cyberdramon", branchType: BranchType.BALANCED },
  ],
  description: "海竜型モンスター。メタルシードラモンへの道を拓く。水棲系統の中核。",
  isEnemyOnly: false,
};

const airdramon: MonsterDefinition = {
  id: "airdramon",
  name: "エアドラモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 185, atk: 92, def: 68 },
  statCaps: { hp: 566, atk: 260, def: 203 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "megadramon", branchType: BranchType.ATK },
    { targetId: "rizegreymon", branchType: BranchType.HP },
    { targetId: "gigadramon", branchType: BranchType.DEF },
    { targetId: "skullgreymon", branchType: BranchType.BALANCED },
  ],
  description: "翼竜型モンスター。飛竜系統の中核。空中戦が得意。",
  isEnemyOnly: false,
};

const kuwagamon: MonsterDefinition = {
  id: "kuwagamon",
  name: "クワガーモン",
  stage: EvolutionStage.CHAMPION,
  baseStats: { hp: 183, atk: 96, def: 66 },
  statCaps: { hp: 558, atk: 269, def: 196 },
  evolutionRequirement: { hp: 50, atk: 32, def: 27, bossWorld: null },
  evolutionPaths: [
    { targetId: "datamon", branchType: BranchType.ATK },
    { targetId: "skullgreymon", branchType: BranchType.HP },
    { targetId: "metalgreymon_virus", branchType: BranchType.DEF },
    { targetId: "gigadramon", branchType: BranchType.BALANCED },
  ],
  description: "巨大クワガタ型モンスター。グランクワガーモンへ繋がる昆虫系統。ATK偏重。",
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
  ankylomon,
  tailmon,
  flamedramon,
  raidramon,
  digmon,
  halsemon,
  shurimon,
  submarimon,
  tyrannomon,
  seadramon,
  airdramon,
  kuwagamon,
] as const;
