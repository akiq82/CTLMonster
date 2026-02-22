/**
 * 究極体 (Mega) モンスター定義
 *
 * GDD.md セクション6 に基づく。
 * 基礎 HP800/ATK230/DEF190, 上限 HP3000/ATK800/DEF650
 */

import {
  MonsterDefinition,
  EvolutionStage,
  BranchType,
} from "../../types/monster";

const seraphimon: MonsterDefinition = {
  id: "seraphimon",
  name: "セラフィモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 850, atk: 230, def: 200 },
  statCaps: { hp: 3000, atk: 780, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "最高位の天使型究極体。聖なる力でワールドを守護する。HP特化型。",
  isEnemyOnly: false,
};

const metalgarurumon: MonsterDefinition = {
  id: "metalgarurumon",
  name: "メタルガルルモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 800, atk: 240, def: 210 },
  statCaps: { hp: 2800, atk: 790, def: 660 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "全身を金属装甲で覆った獣型究極体。鉄壁の防御力。DEF特化型。",
  isEnemyOnly: false,
};

const dukemon: MonsterDefinition = {
  id: "dukemon",
  name: "デュークモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 810, atk: 250, def: 190 },
  statCaps: { hp: 2700, atk: 820, def: 630 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "聖騎士型究極体。聖槍と聖盾を携え、すべての敵を打ち砕く。ATK特化型。",
  isEnemyOnly: false,
};

const omegamon: MonsterDefinition = {
  id: "omegamon",
  name: "オメガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 830, atk: 245, def: 200 },
  statCaps: { hp: 3000, atk: 800, def: 650 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description:
    "全系統が均衡した者だけが到達する隠し究極体。最強のバランス型。",
  isEnemyOnly: false,
};

const rosemon: MonsterDefinition = {
  id: "rosemon",
  name: "ロゼモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 840, atk: 235, def: 195 },
  statCaps: { hp: 3000, atk: 785, def: 648 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "薔薇の女王型究極体。美しさと強さを兼ね備える。HP/バランス型。",
  isEnemyOnly: false,
};

const miragegaogamon: MonsterDefinition = {
  id: "miragegaogamon",
  name: "ミラージュガオガモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 790, atk: 252, def: 188 },
  statCaps: { hp: 2750, atk: 810, def: 635 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "蜃気楼を纏う獣騎士型究極体。超高速で敵を翻弄する。ATK特化型。",
  isEnemyOnly: false,
};

const sakuyamon: MonsterDefinition = {
  id: "sakuyamon",
  name: "サクヤモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 820, atk: 228, def: 208 },
  statCaps: { hp: 2900, atk: 770, def: 665 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "巫女型究極体。神聖な結界で味方を守り敵を封じる。DEF特化型。",
  isEnemyOnly: false,
};

const imperialdramon: MonsterDefinition = {
  id: "imperialdramon",
  name: "インペリアルドラモン",
  stage: EvolutionStage.MEGA,
  baseStats: { hp: 860, atk: 248, def: 192 },
  statCaps: { hp: 3000, atk: 800, def: 645 },
  evolutionRequirement: { hp: 800, atk: 220, def: 180, bossWorld: 6 },
  evolutionPaths: [],
  description: "古代竜型究極体。圧倒的な力で全てを薙ぎ払う。ATK/HP型。",
  isEnemyOnly: false,
};

/** 究極体 モンスター一覧 */
export const MEGA_MONSTERS: readonly MonsterDefinition[] = [
  seraphimon,
  metalgarurumon,
  dukemon,
  omegamon,
  rosemon,
  miragegaogamon,
  sakuyamon,
  imperialdramon,
] as const;
