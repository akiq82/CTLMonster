/**
 * 幼年期I (Baby I) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP10/ATK3/DEF2, 上限 HP30/ATK10/DEF8
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
  baseStats: { hp: 10, atk: 3, def: 2 },
  statCaps: { hp: 30, atk: 10, def: 8 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "koromon", branchType: BranchType.HP },
    { targetId: "koromon", branchType: BranchType.DEF },
    { targetId: "koromon", branchType: BranchType.BALANCED },
    { targetId: "tsunomon", branchType: BranchType.ATK },
  ],
  description: "生まれたばかりの小さなスライム型モンスター。好奇心旺盛。",
  isEnemyOnly: false,
};

const punimon: MonsterDefinition = {
  id: "punimon",
  name: "プニモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 12, atk: 2, def: 3 },
  statCaps: { hp: 30, atk: 10, def: 8 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "tsunomon", branchType: BranchType.DEF },
    { targetId: "tsunomon", branchType: BranchType.ATK },
    { targetId: "tsunomon", branchType: BranchType.BALANCED },
    { targetId: "gigimon", branchType: BranchType.HP },
  ],
  description: "ぷにぷにした体を持つゼリー型モンスター。防御本能が強い。",
  isEnemyOnly: false,
};

const yuramon: MonsterDefinition = {
  id: "yuramon",
  name: "ユラモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 11, atk: 2, def: 3 },
  statCaps: { hp: 30, atk: 10, def: 8 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "koromon", branchType: BranchType.HP },
    { targetId: "gigimon", branchType: BranchType.ATK },
    { targetId: "tsunomon", branchType: BranchType.DEF },
    { targetId: "tsunomon", branchType: BranchType.BALANCED },
  ],
  description: "種子のような姿をした植物型モンスター。静かに漂い成長の機会を待つ。",
  isEnemyOnly: false,
};

const zurumon: MonsterDefinition = {
  id: "zurumon",
  name: "ズルモン",
  stage: EvolutionStage.BABY_I,
  baseStats: { hp: 10, atk: 4, def: 2 },
  statCaps: { hp: 30, atk: 10, def: 8 },
  evolutionRequirement: null,
  evolutionPaths: [
    { targetId: "gigimon", branchType: BranchType.ATK },
    { targetId: "koromon", branchType: BranchType.HP },
    { targetId: "tsunomon", branchType: BranchType.DEF },
    { targetId: "gigimon", branchType: BranchType.BALANCED },
  ],
  description: "黒い粘液状のモンスター。攻撃的な本能が芽生えている。",
  isEnemyOnly: false,
};

/** 幼年期I モンスター一覧 */
export const BABY_I_MONSTERS: readonly MonsterDefinition[] = [
  botamon,
  punimon,
  yuramon,
  zurumon,
] as const;
