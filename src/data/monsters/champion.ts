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
  baseStats: { hp: 800, atk: 257, def: 189 },
  statCaps: { hp: 2500, atk: 800, def: 650 },
  evolutionRequirement: { hp: 375, atk: 144, def: 117, bossWorld: 1 },
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
  baseStats: { hp: 750, atk: 239, def: 216 },
  statCaps: { hp: 2400, atk: 742, def: 704 },
  evolutionRequirement: { hp: 360, atk: 133, def: 126, bossWorld: 1 },
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
  baseStats: { hp: 725, atk: 285, def: 172 },
  statCaps: { hp: 2300, atk: 857, def: 595 },
  evolutionRequirement: { hp: 345, atk: 154, def: 107, bossWorld: 1 },
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
  baseStats: { hp: 825, atk: 245, def: 205 },
  statCaps: { hp: 2600, atk: 771, def: 677 },
  evolutionRequirement: { hp: 390, atk: 138, def: 121, bossWorld: 1 },
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
  baseStats: { hp: 700, atk: 274, def: 178 },
  statCaps: { hp: 2250, atk: 828, def: 622 },
  evolutionRequirement: { hp: 337, atk: 149, def: 111, bossWorld: 1 },
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
  baseStats: { hp: 740, atk: 251, def: 200 },
  statCaps: { hp: 2350, atk: 771, def: 677 },
  evolutionRequirement: { hp: 352, atk: 138, def: 121, bossWorld: 1 },
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
  baseStats: { hp: 690, atk: 296, def: 162 },
  statCaps: { hp: 2200, atk: 885, def: 568 },
  evolutionRequirement: { hp: 330, atk: 159, def: 102, bossWorld: 1 },
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
  baseStats: { hp: 790, atk: 274, def: 183 },
  statCaps: { hp: 2450, atk: 828, def: 622 },
  evolutionRequirement: { hp: 367, atk: 149, def: 111, bossWorld: 1 },
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
  baseStats: { hp: 710, atk: 262, def: 205 },
  statCaps: { hp: 2350, atk: 788, def: 660 },
  evolutionRequirement: { hp: 352, atk: 141, def: 118, bossWorld: 1 },
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
  baseStats: { hp: 775, atk: 251, def: 195 },
  statCaps: { hp: 2475, atk: 777, def: 639 },
  evolutionRequirement: { hp: 371, atk: 139, def: 115, bossWorld: 1 },
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
  baseStats: { hp: 810, atk: 239, def: 200 },
  statCaps: { hp: 2550, atk: 754, def: 650 },
  evolutionRequirement: { hp: 382, atk: 135, def: 117, bossWorld: 1 },
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
  baseStats: { hp: 740, atk: 268, def: 189 },
  statCaps: { hp: 2375, atk: 811, def: 628 },
  evolutionRequirement: { hp: 356, atk: 145, def: 113, bossWorld: 1 },
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
  baseStats: { hp: 765, atk: 285, def: 167 },
  statCaps: { hp: 2325, atk: 845, def: 585 },
  evolutionRequirement: { hp: 348, atk: 152, def: 105, bossWorld: 1 },
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
  baseStats: { hp: 720, atk: 257, def: 211 },
  statCaps: { hp: 2340, atk: 777, def: 682 },
  evolutionRequirement: { hp: 351, atk: 139, def: 122, bossWorld: 1 },
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
  baseStats: { hp: 780, atk: 262, def: 178 },
  statCaps: { hp: 2440, atk: 811, def: 617 },
  evolutionRequirement: { hp: 366, atk: 145, def: 111, bossWorld: 1 },
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
  baseStats: { hp: 730, atk: 251, def: 205 },
  statCaps: { hp: 2360, atk: 765, def: 671 },
  evolutionRequirement: { hp: 354, atk: 137, def: 120, bossWorld: 1 },
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
  baseStats: { hp: 750, atk: 245, def: 200 },
  statCaps: { hp: 2400, atk: 777, def: 650 },
  evolutionRequirement: { hp: 360, atk: 139, def: 117, bossWorld: 1 },
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
  baseStats: { hp: 800, atk: 228, def: 216 },
  statCaps: { hp: 2525, atk: 731, def: 693 },
  evolutionRequirement: { hp: 378, atk: 131, def: 124, bossWorld: 1 },
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
  baseStats: { hp: 690, atk: 291, def: 162 },
  statCaps: { hp: 2200, atk: 868, def: 568 },
  evolutionRequirement: { hp: 330, atk: 156, def: 102, bossWorld: 1 },
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
  baseStats: { hp: 760, atk: 268, def: 184 },
  statCaps: { hp: 2410, atk: 800, def: 639 },
  evolutionRequirement: { hp: 361, atk: 144, def: 115, bossWorld: 1 },
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
  baseStats: { hp: 825, atk: 228, def: 227 },
  statCaps: { hp: 2550, atk: 731, def: 704 },
  evolutionRequirement: { hp: 382, atk: 131, def: 126, bossWorld: 1 },
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
  baseStats: { hp: 740, atk: 262, def: 205 },
  statCaps: { hp: 2375, atk: 788, def: 671 },
  evolutionRequirement: { hp: 356, atk: 141, def: 120, bossWorld: 1 },
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
  baseStats: { hp: 750, atk: 285, def: 172 },
  statCaps: { hp: 2350, atk: 845, def: 595 },
  evolutionRequirement: { hp: 352, atk: 152, def: 107, bossWorld: 1 },
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
  baseStats: { hp: 760, atk: 251, def: 205 },
  statCaps: { hp: 2400, atk: 777, def: 660 },
  evolutionRequirement: { hp: 360, atk: 139, def: 118, bossWorld: 1 },
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
  baseStats: { hp: 790, atk: 245, def: 216 },
  statCaps: { hp: 2450, atk: 754, def: 693 },
  evolutionRequirement: { hp: 367, atk: 135, def: 124, bossWorld: 1 },
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
  baseStats: { hp: 750, atk: 251, def: 200 },
  statCaps: { hp: 2390, atk: 777, def: 650 },
  evolutionRequirement: { hp: 358, atk: 139, def: 117, bossWorld: 1 },
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
  baseStats: { hp: 710, atk: 274, def: 183 },
  statCaps: { hp: 2300, atk: 811, def: 606 },
  evolutionRequirement: { hp: 345, atk: 145, def: 109, bossWorld: 1 },
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
  baseStats: { hp: 800, atk: 228, def: 227 },
  statCaps: { hp: 2525, atk: 720, def: 704 },
  evolutionRequirement: { hp: 378, atk: 129, def: 126, bossWorld: 1 },
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
  baseStats: { hp: 800, atk: 262, def: 189 },
  statCaps: { hp: 2500, atk: 800, def: 639 },
  evolutionRequirement: { hp: 375, atk: 144, def: 115, bossWorld: 1 },
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
  baseStats: { hp: 775, atk: 245, def: 205 },
  statCaps: { hp: 2440, atk: 765, def: 671 },
  evolutionRequirement: { hp: 366, atk: 137, def: 120, bossWorld: 1 },
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
  baseStats: { hp: 740, atk: 268, def: 184 },
  statCaps: { hp: 2360, atk: 800, def: 628 },
  evolutionRequirement: { hp: 354, atk: 144, def: 113, bossWorld: 1 },
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
  baseStats: { hp: 730, atk: 279, def: 178 },
  statCaps: { hp: 2325, atk: 828, def: 606 },
  evolutionRequirement: { hp: 348, atk: 149, def: 109, bossWorld: 1 },
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
