/**
 * 幼年期II (In-Training) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP25/ATK8/DEF6, 上限 HP80/ATK25/DEF20
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const koromon: MonsterDefinition = {
  id: "koromon",
  name: "コロモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 25, atk: 8, def: 6 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "agumon", branchType: BranchType.HP },
    { targetId: "patamon", branchType: BranchType.DEF },
    { targetId: "tentomon", branchType: BranchType.ATK },
    { targetId: "agumon", branchType: BranchType.BALANCED },
  ],
  description: "丸い体に大きな耳を持つ。活発で食欲旺盛。",
  isEnemyOnly: false,
};

const tsunomon: MonsterDefinition = {
  id: "tsunomon",
  name: "ツノモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 22, atk: 9, def: 7 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "gabumon", branchType: BranchType.DEF },
    { targetId: "agumon", branchType: BranchType.HP },
    { targetId: "guilmon", branchType: BranchType.ATK },
    { targetId: "gabumon", branchType: BranchType.BALANCED },
  ],
  description: "頭に小さなツノが生えた幼獣型。気が強い。",
  isEnemyOnly: false,
};

const gigimon: MonsterDefinition = {
  id: "gigimon",
  name: "ギギモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 23, atk: 10, def: 5 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "guilmon", branchType: BranchType.ATK },
    { targetId: "guilmon", branchType: BranchType.HP },
    { targetId: "tentomon", branchType: BranchType.DEF },
    { targetId: "guilmon", branchType: BranchType.BALANCED },
  ],
  description: "鋭い牙と爪を持つ小竜型。攻撃的な性格。",
  isEnemyOnly: false,
};

const tokomon: MonsterDefinition = {
  id: "tokomon",
  name: "トコモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 26, atk: 7, def: 7 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "patamon", branchType: BranchType.HP },
    { targetId: "elecmon", branchType: BranchType.ATK },
    { targetId: "lopmon", branchType: BranchType.DEF },
    { targetId: "hawkmon", branchType: BranchType.BALANCED },
  ],
  description: "小さな体に大きな口を持つ。普段は温厚だが怒ると噛みつく。",
  isEnemyOnly: false,
};

const bukamon: MonsterDefinition = {
  id: "bukamon",
  name: "ブカモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 24, atk: 10, def: 5 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "gomamon", branchType: BranchType.HP },
    { targetId: "renamon", branchType: BranchType.ATK },
    { targetId: "wormmon", branchType: BranchType.DEF },
    { targetId: "veemon", branchType: BranchType.BALANCED },
  ],
  description: "水辺に棲む小さな海獣型。好奇心が強く元気いっぱい。",
  isEnemyOnly: false,
};

const tanemon: MonsterDefinition = {
  id: "tanemon",
  name: "タネモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 28, atk: 6, def: 7 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "palmon", branchType: BranchType.HP },
    { targetId: "gaomon", branchType: BranchType.ATK },
    { targetId: "wormmon", branchType: BranchType.DEF },
    { targetId: "tentomon", branchType: BranchType.BALANCED },
  ],
  description: "植物の芽のような姿。太陽の光を浴びてすくすく育つ。",
  isEnemyOnly: false,
};

const nyaromon: MonsterDefinition = {
  id: "nyaromon",
  name: "ニャロモン",
  stage: EvolutionStage.BABY_II,
  baseStats: { hp: 23, atk: 9, def: 7 },
  statCaps: { hp: 80, atk: 25, def: 20 },
  evolutionRequirement: { hp: 20, atk: 6, def: 5, bossWorld: null },
  evolutionPaths: [
    { targetId: "renamon", branchType: BranchType.ATK },
    { targetId: "elecmon", branchType: BranchType.HP },
    { targetId: "gaomon", branchType: BranchType.DEF },
    { targetId: "lopmon", branchType: BranchType.BALANCED },
  ],
  description: "猫のような耳を持つ聖獣の幼体。俊敏で遊び好き。",
  isEnemyOnly: false,
};

/** 幼年期II モンスター一覧 */
export const BABY_II_MONSTERS: readonly MonsterDefinition[] = [
  koromon,
  tsunomon,
  gigimon,
  tokomon,
  bukamon,
  tanemon,
  nyaromon,
] as const;
