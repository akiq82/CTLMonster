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
    { targetId: "seraphimon", branchType: BranchType.BALANCED },
    { targetId: "omegamon", branchType: BranchType.DEF },
    { targetId: "omegamon", branchType: BranchType.ATK },
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
    { targetId: "metalgarurumon", branchType: BranchType.BALANCED },
    { targetId: "omegamon", branchType: BranchType.HP },
    { targetId: "omegamon", branchType: BranchType.ATK },
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
    { targetId: "omegamon", branchType: BranchType.HP },
    { targetId: "omegamon", branchType: BranchType.DEF },
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
    { targetId: "dukemon", branchType: BranchType.ATK },
    { targetId: "seraphimon", branchType: BranchType.HP },
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
    { targetId: "omegamon", branchType: BranchType.BALANCED },
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
    { targetId: "dukemon", branchType: BranchType.ATK },
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
    { targetId: "seraphimon", branchType: BranchType.HP },
    { targetId: "omegamon", branchType: BranchType.BALANCED },
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
    { targetId: "sakuyamon", branchType: BranchType.DEF },
    { targetId: "imperialdramon", branchType: BranchType.ATK },
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
    { targetId: "miragegaogamon", branchType: BranchType.BALANCED },
    { targetId: "imperialdramon", branchType: BranchType.HP },
    { targetId: "sakuyamon", branchType: BranchType.DEF },
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
    { targetId: "rosemon", branchType: BranchType.HP },
    { targetId: "dukemon", branchType: BranchType.ATK },
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
    { targetId: "omegamon", branchType: BranchType.HP },
    { targetId: "metalgarurumon", branchType: BranchType.DEF },
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
    { targetId: "miragegaogamon", branchType: BranchType.ATK },
    { targetId: "sakuyamon", branchType: BranchType.DEF },
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
    { targetId: "imperialdramon", branchType: BranchType.ATK },
    { targetId: "seraphimon", branchType: BranchType.HP },
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
    { targetId: "sakuyamon", branchType: BranchType.DEF },
    { targetId: "rosemon", branchType: BranchType.HP },
    { targetId: "seraphimon", branchType: BranchType.ATK },
    { targetId: "sakuyamon", branchType: BranchType.BALANCED },
  ],
  description: "聖獣型モンスター。空を駆け風を操る一角獣。DEF偏重型。",
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
] as const;
