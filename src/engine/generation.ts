/**
 * 世代引き継ぎエンジン
 *
 * GDD.md セクション9 に基づく。
 *
 * 死亡時に「○○の記憶」装備品を生成し、次世代に引き継ぐ。
 *
 * - HP補正 = floor(前世代の最終HP(装備込み) × 20%)
 * - ATK補正 = floor(前世代の最終ATK(装備込み) × 20%)
 * - DEF補正 = floor(前世代の最終DEF(装備込み) × 20%)
 * - 有効期間: 1世代のみ
 */

import type { MonsterState, MemoryEquipment } from "../types/monster";
import { MONSTER_DEFINITIONS, STARTER_MONSTER_IDS } from "../data/monsters";
import { rollBaseLifespan } from "./lifespan";
import { randomPick, type RngFn } from "../utils/random";

/** 「記憶」装備の継承率 */
const MEMORY_INHERITANCE_RATE = 0.2;

/**
 * 「○○の記憶」装備品を生成する
 *
 * GDD 9.1:
 *   HP補正 = 前世代の最終HP（装備込み）× 20%
 *   ATK補正 = 前世代の最終ATK（装備込み）× 20%
 *   DEF補正 = 前世代の最終DEF（装備込み）× 20%
 *
 * @param monster - 死亡したモンスターの最終状態
 * @returns 「記憶」装備品
 */
export function createMemoryEquipment(
  monster: MonsterState
): MemoryEquipment {
  const definition = MONSTER_DEFINITIONS.get(monster.definitionId);
  const monsterName = definition?.name ?? monster.name;

  // 装備込みのステータスを計算
  const equipHp = monster.memoryEquipment?.hp ?? 0;
  const equipAtk = monster.memoryEquipment?.atk ?? 0;
  const equipDef = monster.memoryEquipment?.def ?? 0;

  const finalHp = monster.maxHp + equipHp;
  const finalAtk = monster.atk + equipAtk;
  const finalDef = monster.def + equipDef;

  return {
    name: `${monsterName}の記憶`,
    hp: Math.floor(finalHp * MEMORY_INHERITANCE_RATE),
    atk: Math.floor(finalAtk * MEMORY_INHERITANCE_RATE),
    def: Math.floor(finalDef * MEMORY_INHERITANCE_RATE),
  };
}

/**
 * 次世代モンスターの初期状態を生成する
 *
 * @param previousMonster - 前世代の最終モンスター状態
 * @param newName - 新個体の名前
 * @param rng - 乱数生成関数
 * @returns 新しいモンスター状態
 */
export function createNextGeneration(
  previousMonster: MonsterState,
  newName: string,
  rng: RngFn = Math.random
): MonsterState {
  const memory = createMemoryEquipment(previousMonster);
  const starterId = randomPick(STARTER_MONSTER_IDS as unknown as string[], rng);
  const starterDef = MONSTER_DEFINITIONS.get(starterId);

  if (!starterDef) {
    throw new Error(`Unknown starter monster: ${starterId}`);
  }

  return {
    name: newName,
    definitionId: starterId,
    currentHp: starterDef.baseStats.hp,
    maxHp: starterDef.baseStats.hp,
    atk: starterDef.baseStats.atk,
    def: starterDef.baseStats.def,
    discipline: 50,
    totalTpL: 0,
    totalTpM: 0,
    totalTpH: 0,
    bornAt: new Date().toISOString(),
    baseLifespan: rollBaseLifespan(rng),
    lifespanExtension: 0,
    generation: previousMonster.generation + 1,
    evolutionHistory: [],
    memoryEquipment: memory,
    mealsToday: 0,
    mealsYesterday: 0,
    mealBonusRemaining: 0,
    lastLoginAt: new Date().toISOString(),
    wins: 0,
    losses: 0,
  };
}

/**
 * 第1世代（初回プレイ）のモンスターを生成する
 *
 * @param name - 個体名
 * @param starterId - 初期モンスターID
 * @param rng - 乱数生成関数
 * @returns 初期モンスター状態
 */
export function createFirstGeneration(
  name: string,
  starterId: string,
  rng: RngFn = Math.random
): MonsterState {
  const starterDef = MONSTER_DEFINITIONS.get(starterId);
  if (!starterDef) {
    throw new Error(`Unknown starter monster: ${starterId}`);
  }

  return {
    name,
    definitionId: starterId,
    currentHp: starterDef.baseStats.hp,
    maxHp: starterDef.baseStats.hp,
    atk: starterDef.baseStats.atk,
    def: starterDef.baseStats.def,
    discipline: 50,
    totalTpL: 0,
    totalTpM: 0,
    totalTpH: 0,
    bornAt: new Date().toISOString(),
    baseLifespan: rollBaseLifespan(rng),
    lifespanExtension: 0,
    generation: 1,
    evolutionHistory: [],
    memoryEquipment: null,
    mealsToday: 0,
    mealsYesterday: 0,
    mealBonusRemaining: 0,
    lastLoginAt: new Date().toISOString(),
    wins: 0,
    losses: 0,
  };
}
