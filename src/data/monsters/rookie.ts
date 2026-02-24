/**
 * 成長期 (Rookie) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP195/ATK83/DEF60, 上限 HP600/ATK250/DEF200
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const agumon: MonsterDefinition = {
  id: "agumon",
  name: "アグモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 90, atk: 40, def: 32 },
  statCaps: { hp: 250, atk: 110, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "greymon", branchType: BranchType.HP },
    { targetId: "greymon", branchType: BranchType.BALANCED },
    { targetId: "devimon", branchType: BranchType.ATK },
    { targetId: "devimon", branchType: BranchType.DEF },
  ],
  description:
    "小型恐竜型モンスター。口から火の玉を吐く。バランスの良い成長が期待できる。",
  isEnemyOnly: false,
};

const gabumon: MonsterDefinition = {
  id: "gabumon",
  name: "ガブモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 83, atk: 36, def: 38 },
  statCaps: { hp: 250, atk: 101, def: 99 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "garurumon", branchType: BranchType.DEF },
    { targetId: "garurumon", branchType: BranchType.BALANCED },
    { targetId: "icedevimon", branchType: BranchType.HP },
    { targetId: "icedevimon", branchType: BranchType.ATK },
  ],
  description: "毛皮を被った爬虫類型モンスター。防御に優れる。",
  isEnemyOnly: false,
};

const guilmon: MonsterDefinition = {
  id: "guilmon",
  name: "ギルモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 76, atk: 48, def: 28 },
  statCaps: { hp: 225, atk: 119, def: 81 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "growlmon", branchType: BranchType.ATK },
    { targetId: "growlmon", branchType: BranchType.BALANCED },
    { targetId: "megidramon", branchType: BranchType.HP },
    { targetId: "megidramon", branchType: BranchType.DEF },
  ],
  description: "赤い体に危険マークの模様を持つ竜型。攻撃力が非常に高い。",
  isEnemyOnly: false,
};

const patamon: MonsterDefinition = {
  id: "patamon",
  name: "パタモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 97, atk: 32, def: 34 },
  statCaps: { hp: 275, atk: 92, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "angemon", branchType: BranchType.HP },
    { targetId: "angemon", branchType: BranchType.BALANCED },
    { targetId: "devimon", branchType: BranchType.ATK },
    { targetId: "devimon", branchType: BranchType.DEF },
  ],
  description: "翼のような大きな耳で空を飛ぶ哺乳類型。HP成長に優れる。",
  isEnemyOnly: false,
};

const tentomon: MonsterDefinition = {
  id: "tentomon",
  name: "テントモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 80, atk: 44, def: 34 },
  statCaps: { hp: 238, atk: 106, def: 86 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "growlmon", branchType: BranchType.ATK },
    { targetId: "angemon", branchType: BranchType.HP },
    { targetId: "kuwagamon", branchType: BranchType.DEF },
    { targetId: "greymon", branchType: BranchType.BALANCED },
  ],
  description: "昆虫型モンスター。電気技で敵を痺れさせる。",
  isEnemyOnly: false,
};

const elecmon: MonsterDefinition = {
  id: "elecmon",
  name: "エレキモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 86, atk: 44, def: 30 },
  statCaps: { hp: 244, atk: 114, def: 86 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "leomon", branchType: BranchType.ATK },
    { targetId: "birdramon", branchType: BranchType.HP },
    { targetId: "seasarmon", branchType: BranchType.DEF },
    { targetId: "wizardmon", branchType: BranchType.BALANCED },
  ],
  description: "電気を操る哺乳類型モンスター。短気だが仲間思い。",
  isEnemyOnly: false,
};

const gomamon: MonsterDefinition = {
  id: "gomamon",
  name: "ゴマモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 94, atk: 34, def: 36 },
  statCaps: { hp: 263, atk: 95, def: 94 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "togemon", branchType: BranchType.HP },
    { targetId: "leomon", branchType: BranchType.ATK },
    { targetId: "seadramon", branchType: BranchType.DEF },
    { targetId: "birdramon", branchType: BranchType.BALANCED },
  ],
  description: "海獣型モンスター。陽気な性格で泳ぎが得意。HPが高い。",
  isEnemyOnly: false,
};

const palmon: MonsterDefinition = {
  id: "palmon",
  name: "パルモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 91, atk: 38, def: 36 },
  statCaps: { hp: 256, atk: 101, def: 94 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "togemon", branchType: BranchType.HP },
    { targetId: "wizardmon", branchType: BranchType.ATK },
    { targetId: "kyubimon", branchType: BranchType.DEF },
    { targetId: "togemon", branchType: BranchType.BALANCED },
  ],
  description: "植物型モンスター。頭の花から毒の花粉を撒く。HP成長が良い。",
  isEnemyOnly: false,
};

const gaomon: MonsterDefinition = {
  id: "gaomon",
  name: "ガオモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 80, atk: 46, def: 34 },
  statCaps: { hp: 235, atk: 114, def: 86 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "gaogamon", branchType: BranchType.ATK },
    { targetId: "airdramon", branchType: BranchType.HP },
    { targetId: "gaogamon", branchType: BranchType.DEF },
    { targetId: "leomon", branchType: BranchType.BALANCED },
  ],
  description: "ボクシンググローブを付けた獣型。素早い連打が武器。",
  isEnemyOnly: false,
};

const lopmon: MonsterDefinition = {
  id: "lopmon",
  name: "ロップモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 89, atk: 36, def: 38 },
  statCaps: { hp: 250, atk: 99, def: 97 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "wendimon", branchType: BranchType.ATK },
    { targetId: "seasarmon", branchType: BranchType.HP },
    { targetId: "kyubimon", branchType: BranchType.DEF },
    { targetId: "wizardmon", branchType: BranchType.BALANCED },
  ],
  description: "三本角の獣型モンスター。穏やかだが秘めた力は大きい。",
  isEnemyOnly: false,
};

const renamon: MonsterDefinition = {
  id: "renamon",
  name: "レナモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 78, atk: 50, def: 30 },
  statCaps: { hp: 225, atk: 121, def: 83 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "kyubimon", branchType: BranchType.ATK },
    { targetId: "wizardmon", branchType: BranchType.HP },
    { targetId: "kyubimon", branchType: BranchType.DEF },
    { targetId: "sangloupmon", branchType: BranchType.BALANCED },
  ],
  description: "狐型モンスター。クールで知性的。攻撃力が非常に高い。",
  isEnemyOnly: false,
};

const veemon: MonsterDefinition = {
  id: "veemon",
  name: "ブイモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 87, atk: 44, def: 32 },
  statCaps: { hp: 248, atk: 110, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "flamedramon", branchType: BranchType.ATK },
    { targetId: "xveemon", branchType: BranchType.HP },
    { targetId: "raidramon", branchType: BranchType.DEF },
    { targetId: "xveemon", branchType: BranchType.BALANCED },
  ],
  description: "青い小竜型モンスター。元気で前向き。バランスの良い成長。",
  isEnemyOnly: false,
};

const wormmon: MonsterDefinition = {
  id: "wormmon",
  name: "ワームモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 83, atk: 32, def: 41 },
  statCaps: { hp: 244, atk: 92, def: 99 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "stingmon", branchType: BranchType.ATK },
    { targetId: "aquilamon", branchType: BranchType.HP },
    { targetId: "stingmon", branchType: BranchType.DEF },
    { targetId: "dorugamon", branchType: BranchType.BALANCED },
  ],
  description: "おとなしい虫型モンスター。心優しく防御力に優れる。",
  isEnemyOnly: false,
};

const hawkmon: MonsterDefinition = {
  id: "hawkmon",
  name: "ホークモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 84, atk: 42, def: 34 },
  statCaps: { hp: 245, atk: 106, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "halsemon", branchType: BranchType.ATK },
    { targetId: "aquilamon", branchType: BranchType.HP },
    { targetId: "shurimon", branchType: BranchType.DEF },
    { targetId: "aquilamon", branchType: BranchType.BALANCED },
  ],
  description: "鷹型モンスター。礼儀正しく勇敢。バランスの良い能力。",
  isEnemyOnly: false,
};

// ========== 敵専用から昇格 ==========

const ogremon: MonsterDefinition = {
  id: "ogremon",
  name: "オーガモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 97, atk: 50, def: 32 },
  statCaps: { hp: 250, atk: 110, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "leomon", branchType: BranchType.ATK },
    { targetId: "wendimon", branchType: BranchType.HP },
    { targetId: "devimon", branchType: BranchType.DEF },
    { targetId: "growlmon", branchType: BranchType.BALANCED },
  ],
  description: "巨大な骨のこん棒を振るう鬼型モンスター。パワー型の成長期。",
  isEnemyOnly: false,
};

const darktyranomon: MonsterDefinition = {
  id: "darktyranomon",
  name: "ダークティラノモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 111, atk: 56, def: 38 },
  statCaps: { hp: 250, atk: 110, def: 90 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "tyrannomon", branchType: BranchType.HP },
    { targetId: "megidramon", branchType: BranchType.ATK },
    { targetId: "garurumon", branchType: BranchType.DEF },
    { targetId: "growlmon", branchType: BranchType.BALANCED },
  ],
  description: "ウイルスに侵された恐竜型モンスター。ウイルス恐竜系統。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const armadimon: MonsterDefinition = {
  id: "armadimon",
  name: "アルマジモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 94, atk: 34, def: 41 },
  statCaps: { hp: 263, atk: 95, def: 99 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "ankylomon", branchType: BranchType.HP },
    { targetId: "submarimon", branchType: BranchType.DEF },
    { targetId: "digmon", branchType: BranchType.ATK },
    { targetId: "ankylomon", branchType: BranchType.BALANCED },
  ],
  description: "アルマジロ型モンスター。防御力に優れ穴掘りが得意。02パートナー(伊織)。",
  isEnemyOnly: false,
};

const plotmon: MonsterDefinition = {
  id: "plotmon",
  name: "プロットモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 86, atk: 38, def: 36 },
  statCaps: { hp: 250, atk: 103, def: 94 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "tailmon", branchType: BranchType.HP },
    { targetId: "tailmon", branchType: BranchType.BALANCED },
    { targetId: "seasarmon", branchType: BranchType.DEF },
    { targetId: "leomon", branchType: BranchType.ATK },
  ],
  description: "子犬型の聖獣モンスター。テイルモンの前段階。02パートナー(ヒカリ)。",
  isEnemyOnly: false,
};

// ========== 冒険世代/系統補完 ==========

const hagurumon: MonsterDefinition = {
  id: "hagurumon",
  name: "ハグルモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 80, atk: 40, def: 38 },
  statCaps: { hp: 244, atk: 101, def: 94 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "gaogamon", branchType: BranchType.ATK },
    { targetId: "dorugamon", branchType: BranchType.HP },
    { targetId: "stingmon", branchType: BranchType.DEF },
    { targetId: "xveemon", branchType: BranchType.BALANCED },
  ],
  description: "歯車型の機械モンスター。マシン系統の根。ムゲンドラモンへの道を拓く。",
  isEnemyOnly: false,
};

const kotemon: MonsterDefinition = {
  id: "kotemon",
  name: "コテモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 83, atk: 46, def: 32 },
  statCaps: { hp: 238, atk: 110, def: 86 },
  evolutionRequirement: { hp: 35, atk: 20, def: 17, bossWorld: null },
  evolutionPaths: [
    { targetId: "leomon", branchType: BranchType.ATK },
    { targetId: "angemon", branchType: BranchType.HP },
    { targetId: "wizardmon", branchType: BranchType.DEF },
    { targetId: "greymon", branchType: BranchType.BALANCED },
  ],
  description: "剣道の防具を纏った剣士型モンスター。剣士系統。",
  isEnemyOnly: false,
};

/** 成長期 モンスター一覧 */
export const ROOKIE_MONSTERS: readonly MonsterDefinition[] = [
  agumon,
  gabumon,
  guilmon,
  patamon,
  tentomon,
  elecmon,
  gomamon,
  palmon,
  gaomon,
  lopmon,
  renamon,
  veemon,
  wormmon,
  hawkmon,
  ogremon,
  darktyranomon,
  armadimon,
  plotmon,
  hagurumon,
  kotemon,
] as const;
