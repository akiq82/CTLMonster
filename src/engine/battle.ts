/**
 * 自動バトルエンジン
 *
 * GDD.md セクション7.1 に基づく完全自動バトル。
 *
 * ダメージ計算:
 *   基礎ダメージ = ATK × (0.85〜1.15 ランダム)
 *   実ダメージ = max(1, 基礎ダメージ - DEF × 0.4)
 *
 * 命中率 = 90% + (自分DISC - 50) × 0.2%
 * 回避率 = 5% + (自分DISC - 50) × 0.1%
 * クリティカル率 = 5%, クリティカル倍率 = 1.5×
 *
 * SPD = (ATK + DEF) / 4（先制判定用）
 */

import type {
  BattleFighter,
  BattleResult,
  BattleTurn,
  TurnAction,
} from "../types/battle";
import { BATTLE_CONSTANTS } from "../types/battle";
import { randomFloat, chance, type RngFn } from "../utils/random";

const BC = BATTLE_CONSTANTS;

/**
 * SPD（速度）を計算する
 * GDD: SPDは(ATK+DEF)/4で近似
 */
export function calculateSpeed(fighter: BattleFighter): number {
  return (fighter.atk + fighter.def) / 4;
}

/**
 * 命中率を計算する
 * GDD: 90% + (自分DISC - 50) × 0.2%
 */
export function calculateHitRate(discipline: number): number {
  return BC.BASE_HIT_RATE + (discipline - 50) * BC.DISCIPLINE_HIT_MODIFIER;
}

/**
 * 回避率を計算する
 * GDD: 5% + (自分DISC - 50) × 0.1%
 */
export function calculateEvasionRate(discipline: number): number {
  return BC.BASE_EVASION_RATE + (discipline - 50) * BC.DISCIPLINE_EVASION_MODIFIER;
}

/**
 * ダメージを計算する
 * GDD: 基礎ダメージ = ATK × (0.85〜1.15), 実ダメージ = max(1, 基礎ダメージ - DEF×0.4)
 */
export function calculateDamage(
  attackerAtk: number,
  defenderDef: number,
  isCritical: boolean,
  rng: RngFn = Math.random
): number {
  const randomMultiplier = randomFloat(BC.DAMAGE_RANDOM_MIN, BC.DAMAGE_RANDOM_MAX, rng);
  let baseDamage = attackerAtk * randomMultiplier;
  if (isCritical) {
    baseDamage *= BC.CRITICAL_MULTIPLIER;
  }
  return Math.max(BC.MIN_DAMAGE, Math.floor(baseDamage - defenderDef * BC.DEF_REDUCTION_FACTOR));
}

/**
 * 先制判定: SPD差に基づく先制確率
 * SPDが高い方が先攻になる確率が高い。
 *
 * @returns trueならplayerが先攻
 */
export function determineFirstStrike(
  playerSpeed: number,
  enemySpeed: number,
  rng: RngFn = Math.random
): boolean {
  const diff = playerSpeed - enemySpeed;
  // SPD差を確率に変換: 差0で50%, 差が大きいほど有利
  const playerFirstChance = 0.5 + diff / (Math.abs(diff) + 20) * 0.5;
  return chance(playerFirstChance, rng);
}

/**
 * 1回の攻撃アクションを解決する
 */
function resolveAttack(
  attacker: BattleFighter,
  defender: BattleFighter,
  rng: RngFn
): TurnAction {
  const hitRate = calculateHitRate(attacker.discipline);
  const evasionRate = calculateEvasionRate(defender.discipline);

  const hit = chance(hitRate, rng);
  const evaded = hit && chance(evasionRate, rng);
  const critical = hit && !evaded && chance(BC.CRITICAL_RATE, rng);

  let damage = 0;
  if (hit && !evaded) {
    damage = calculateDamage(attacker.atk, defender.def, critical, rng);
    defender.currentHp = Math.max(0, defender.currentHp - damage);
  }

  return {
    attackerName: attacker.name,
    defenderName: defender.name,
    hit,
    evaded,
    critical,
    damage,
    defenderRemainingHp: defender.currentHp,
  };
}

/** バトルのターン上限（無限ループ防止） */
const MAX_TURNS = 100;

/**
 * 自動バトルを実行する
 *
 * GDDバトルフロー:
 * 1. 先制判定
 * 2. ターン制自動戦闘（各ターンで命中→回避→ダメージ）
 * 3. HP先に0になった方が敗北
 * 4. 敗北時: プレイヤーのHPが1残る
 *
 * @param player - プレイヤーモンスターのバトルステータス
 * @param enemy - 敵モンスターのバトルステータス
 * @param rng - 乱数生成関数
 * @returns バトル結果
 */
export function executeBattle(
  player: BattleFighter,
  enemy: BattleFighter,
  rng: RngFn = Math.random
): BattleResult {
  const playerSpeed = calculateSpeed(player);
  const enemySpeed = calculateSpeed(enemy);
  const playerFirst = determineFirstStrike(playerSpeed, enemySpeed, rng);

  const [first, second] = playerFirst
    ? [player, enemy]
    : [enemy, player];

  const turns: BattleTurn[] = [];

  for (let turnNumber = 1; turnNumber <= MAX_TURNS; turnNumber++) {
    const actions: TurnAction[] = [];

    // 先攻の攻撃
    const firstAction = resolveAttack(first, second, rng);
    actions.push(firstAction);

    if (second.currentHp <= 0) {
      turns.push({ turnNumber, actions });
      break;
    }

    // 後攻の攻撃
    const secondAction = resolveAttack(second, first, rng);
    actions.push(secondAction);

    turns.push({ turnNumber, actions });

    if (first.currentHp <= 0) {
      break;
    }
  }

  const playerWon = player.currentHp > 0 && enemy.currentHp <= 0;

  // GDD: 敗北時HPが残り1になる
  if (!playerWon && player.currentHp <= 0) {
    player.currentHp = BC.LOSS_REMAINING_HP;
  }

  return {
    playerWon,
    turns,
    playerRemainingHp: player.currentHp,
    enemyRemainingHp: enemy.currentHp,
    totalTurns: turns.length,
  };
}
