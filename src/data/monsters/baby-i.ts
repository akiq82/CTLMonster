/**
 * 幼年期I (Baby I) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 段階基準上限: HP50/ATK30/DEF25 (旧: HP30/ATK10/DEF8)
 * 段階別トレーニング倍率: ×1
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const botamon: MonsterDefinition = {
  id: "botamon",
  name: "ボタモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 17, atk: 9, def: 6 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "koromon", branchType: BranchType.HP },
    { targetId: "tokomon", branchType: BranchType.DEF },
    { targetId: "tsunomon", branchType: BranchType.ATK },
    { targetId: "tanemon", branchType: BranchType.BALANCED },
  ],
  description: "生まれたばかりの小さなスライム型モンスター。好奇心旺盛。",
  isEnemyOnly: false,
};

const punimon: MonsterDefinition = {
  id: "punimon",
  name: "プニモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 20, atk: 6, def: 9 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "gigimon", branchType: BranchType.HP },
    { targetId: "nyaromon", branchType: BranchType.DEF },
    { targetId: "bukamon", branchType: BranchType.ATK },
    { targetId: "tsunomon", branchType: BranchType.BALANCED },
  ],
  description: "ぷにぷにした体を持つゼリー型モンスター。防御本能が強い。",
  isEnemyOnly: false,
};

const yuramon: MonsterDefinition = {
  id: "yuramon",
  name: "ユラモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 18, atk: 6, def: 9 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "tanemon", branchType: BranchType.HP },
    { targetId: "gigimon", branchType: BranchType.ATK },
    { targetId: "tokomon", branchType: BranchType.DEF },
    { targetId: "koromon", branchType: BranchType.BALANCED },
  ],
  description: "種子のような姿をした植物型モンスター。静かに漂い成長の機会を待つ。",
  isEnemyOnly: false,
};

const zurumon: MonsterDefinition = {
  id: "zurumon",
  name: "ズルモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 17, atk: 12, def: 6 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "goblimon", branchType: BranchType.HP },
    { targetId: "gigimon", branchType: BranchType.ATK },
    { targetId: "kunemon", branchType: BranchType.DEF },
    { targetId: "koromon", branchType: BranchType.BALANCED },
  ],
  description: "黒い粘液状のモンスター。攻撃的な本能が芽生えている。",
  isEnemyOnly: false,
};

// ========== 02世代 ==========

const chibomon: MonsterDefinition = {
  id: "chibomon",
  name: "チコモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 18, atk: 9, def: 6 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "demiveemon", branchType: BranchType.HP },
    { targetId: "demiveemon", branchType: BranchType.ATK },
    { targetId: "upamon", branchType: BranchType.DEF },
    { targetId: "poromon", branchType: BranchType.BALANCED },
  ],
  description: "02世代のスターター。元気な小竜型の幼年体。ブイモンの始祖。",
  isEnemyOnly: false,
};

const leafmon: MonsterDefinition = {
  id: "leafmon",
  name: "リーフモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 17, atk: 6, def: 9 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "minomon", branchType: BranchType.DEF },
    { targetId: "minomon", branchType: BranchType.HP },
    { targetId: "kunemon", branchType: BranchType.ATK },
    { targetId: "tanemon", branchType: BranchType.BALANCED },
  ],
  description: "葉のような姿の幼年体。ワームモンの始祖。優しい心を持つ。",
  isEnemyOnly: false,
};

const tsubumon: MonsterDefinition = {
  id: "tsubumon",
  name: "ツブモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 20, atk: 6, def: 9 },
  statCaps: { hp: 50, atk: 30, def: 25 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "upamon", branchType: BranchType.HP },
    { targetId: "poromon", branchType: BranchType.DEF },
    { targetId: "motimon", branchType: BranchType.ATK },
    { targetId: "upamon", branchType: BranchType.BALANCED },
  ],
  description: "丸い粒のような姿の幼年体。アルマジモンの始祖。",
  isEnemyOnly: false,
};

/** 幼年期I モンスター一覧 */
export const BABY_I_MONSTERS: readonly MonsterDefinition[] = [
  botamon,
  punimon,
  yuramon,
  zurumon,
  chibomon,
  leafmon,
  tsubumon,
] as const;
