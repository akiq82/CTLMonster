/**
 * 成長期 (Rookie) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP60/ATK20/DEF15, 上限 HP200/ATK60/DEF50
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
  baseStats: { hp: 65, atk: 20, def: 15 },
  statCaps: { hp: 200, atk: 60, def: 50 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 60, atk: 18, def: 18 },
  statCaps: { hp: 200, atk: 55, def: 55 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 55, atk: 24, def: 13 },
  statCaps: { hp: 180, atk: 65, def: 45 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 70, atk: 16, def: 16 },
  statCaps: { hp: 220, atk: 50, def: 50 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 58, atk: 22, def: 16 },
  statCaps: { hp: 190, atk: 58, def: 48 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
  evolutionPaths: [
    { targetId: "growlmon", branchType: BranchType.ATK },
    { targetId: "angemon", branchType: BranchType.HP },
    { targetId: "garurumon", branchType: BranchType.DEF },
    { targetId: "greymon", branchType: BranchType.BALANCED },
  ],
  description: "昆虫型モンスター。電気技で敵を痺れさせる。",
  isEnemyOnly: false,
};

const elecmon: MonsterDefinition = {
  id: "elecmon",
  name: "エレキモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 62, atk: 22, def: 14 },
  statCaps: { hp: 195, atk: 62, def: 48 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 68, atk: 17, def: 17 },
  statCaps: { hp: 210, atk: 52, def: 52 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
  evolutionPaths: [
    { targetId: "togemon", branchType: BranchType.HP },
    { targetId: "leomon", branchType: BranchType.ATK },
    { targetId: "seasarmon", branchType: BranchType.DEF },
    { targetId: "birdramon", branchType: BranchType.BALANCED },
  ],
  description: "海獣型モンスター。陽気な性格で泳ぎが得意。HPが高い。",
  isEnemyOnly: false,
};

const palmon: MonsterDefinition = {
  id: "palmon",
  name: "パルモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 66, atk: 19, def: 17 },
  statCaps: { hp: 205, atk: 55, def: 52 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 58, atk: 23, def: 16 },
  statCaps: { hp: 188, atk: 62, def: 48 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
  evolutionPaths: [
    { targetId: "gaogamon", branchType: BranchType.ATK },
    { targetId: "birdramon", branchType: BranchType.HP },
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
  baseStats: { hp: 64, atk: 18, def: 18 },
  statCaps: { hp: 200, atk: 54, def: 54 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 56, atk: 25, def: 14 },
  statCaps: { hp: 180, atk: 66, def: 46 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 63, atk: 22, def: 15 },
  statCaps: { hp: 198, atk: 60, def: 50 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
  evolutionPaths: [
    { targetId: "xveemon", branchType: BranchType.ATK },
    { targetId: "greymon", branchType: BranchType.HP },
    { targetId: "dorugamon", branchType: BranchType.DEF },
    { targetId: "xveemon", branchType: BranchType.BALANCED },
  ],
  description: "青い小竜型モンスター。元気で前向き。バランスの良い成長。",
  isEnemyOnly: false,
};

const wormmon: MonsterDefinition = {
  id: "wormmon",
  name: "ワームモン",
  stage: EvolutionStage.ROOKIE,
  baseStats: { hp: 60, atk: 16, def: 19 },
  statCaps: { hp: 195, atk: 50, def: 55 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
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
  baseStats: { hp: 61, atk: 21, def: 16 },
  statCaps: { hp: 196, atk: 58, def: 50 },
  evolutionRequirement: { hp: 50, atk: 18, def: 14, bossWorld: 1 },
  evolutionPaths: [
    { targetId: "aquilamon", branchType: BranchType.ATK },
    { targetId: "birdramon", branchType: BranchType.HP },
    { targetId: "dorugamon", branchType: BranchType.DEF },
    { targetId: "aquilamon", branchType: BranchType.BALANCED },
  ],
  description: "鷹型モンスター。礼儀正しく勇敢。バランスの良い能力。",
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
] as const;
