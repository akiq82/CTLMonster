/**
 * 進化判定・分岐エンジン
 *
 * GDD.md セクション6.2, 6.3 に基づく。
 *
 * 進化条件 = ステータス閾値達成 + 特定ワールドのボス撃破
 * 進化分岐 = 累計TP消費比率(L/M/H)でBranchType決定
 *
 * BranchType:
 *   TP-L最多 → HP型, TP-M最多 → DEF型, TP-H最多 → ATK型
 *   各30%以上 → バランス型
 */

import type {
  MonsterState,
  MonsterDefinition,
  EvolutionPath,
} from "../types/monster";
import { BranchType } from "../types/monster";
import type { WorldProgress } from "../types/world";
import { MONSTER_DEFINITIONS } from "../data/monsters";

/** バランス型判定の閾値（各系統が全体の30%以上） */
const BALANCED_THRESHOLD = 0.3;

/**
 * 累計TP消費比率からBranchTypeを判定する
 *
 * GDD 6.3:
 *   TP-L最多 → HP型, TP-M最多 → DEF型, TP-H最多 → ATK型
 *   3系統が均衡（各30%以上） → バランス型
 *
 * @param tpL - 累計消費TP-L
 * @param tpM - 累計消費TP-M
 * @param tpH - 累計消費TP-H
 * @returns 分岐タイプ
 */
export function determineBranchType(
  tpL: number,
  tpM: number,
  tpH: number
): BranchType {
  const total = tpL + tpM + tpH;

  // TP消費が全くない場合はHP型をデフォルトに
  if (total === 0) return BranchType.HP;

  const ratioL = tpL / total;
  const ratioM = tpM / total;
  const ratioH = tpH / total;

  // バランス型: 各30%以上
  if (
    ratioL >= BALANCED_THRESHOLD &&
    ratioM >= BALANCED_THRESHOLD &&
    ratioH >= BALANCED_THRESHOLD
  ) {
    return BranchType.BALANCED;
  }

  // 最多系統を判定
  if (tpL >= tpM && tpL >= tpH) return BranchType.HP;
  if (tpM >= tpL && tpM >= tpH) return BranchType.DEF;
  return BranchType.ATK;
}

/**
 * ステータス条件を満たしているか判定する
 *
 * 進化先のevolutionRequirementを参照してチェックする。
 * 引数のtargetDefinitionは進化先のモンスター定義。
 *
 * @param monster - 現在のモンスター状態
 * @param targetDefinition - 進化先のモンスター定義
 * @returns 条件を満たしていればtrue
 */
export function meetsStatRequirements(
  monster: MonsterState,
  targetDefinition: MonsterDefinition
): boolean {
  const req = targetDefinition.evolutionRequirement;
  if (!req) return false;

  const equipHp = monster.memoryEquipment?.hp ?? 0;
  const equipAtk = monster.memoryEquipment?.atk ?? 0;
  const equipDef = monster.memoryEquipment?.def ?? 0;

  return (
    monster.maxHp + equipHp >= req.hp &&
    monster.atk + equipAtk >= req.atk &&
    monster.def + equipDef >= req.def
  );
}

/**
 * ボス撃破条件を満たしているか判定する
 *
 * 進化先のevolutionRequirementを参照してチェックする。
 *
 * @param targetDefinition - 進化先のモンスター定義
 * @param worldProgress - ワールド進行状態のマップ
 * @returns 条件を満たしていればtrue（ボス条件なしの場合もtrue）
 */
export function meetsBossRequirement(
  targetDefinition: MonsterDefinition,
  worldProgress: ReadonlyMap<number, WorldProgress>
): boolean {
  const req = targetDefinition.evolutionRequirement;
  if (!req || req.bossWorld === null) return true;

  const progress = worldProgress.get(req.bossWorld);
  return progress?.bossDefeated === true;
}

/**
 * 進化可能かどうかを判定する
 *
 * @param monster - 現在のモンスター状態
 * @param worldProgress - ワールド進行状態
 * @returns 進化可能ならtrue
 */
export function canEvolve(
  monster: MonsterState,
  worldProgress: ReadonlyMap<number, WorldProgress>
): boolean {
  const definition = MONSTER_DEFINITIONS.get(monster.definitionId);
  if (!definition) return false;
  if (definition.evolutionPaths.length === 0) return false;

  // 進化先候補のいずれかの条件を満たせば進化可能
  // （全進化先は同段階なので条件は共通だが、念のため全候補をチェック）
  return definition.evolutionPaths.some((path) => {
    const targetDef = MONSTER_DEFINITIONS.get(path.targetId);
    if (!targetDef) return false;
    return (
      meetsStatRequirements(monster, targetDef) &&
      meetsBossRequirement(targetDef, worldProgress)
    );
  });
}

/**
 * 進化先を決定する
 *
 * BranchTypeに一致する進化先を返す。
 * 一致するものがない場合は最初の進化先をフォールバックとして返す。
 *
 * @param monster - 現在のモンスター状態
 * @returns 進化先のEvolutionPath、または進化不可ならnull
 */
export function getEvolutionTarget(
  monster: MonsterState
): EvolutionPath | null {
  const definition = MONSTER_DEFINITIONS.get(monster.definitionId);
  if (!definition || definition.evolutionPaths.length === 0) return null;

  const branchType = determineBranchType(
    monster.totalTpL,
    monster.totalTpM,
    monster.totalTpH
  );

  const match = definition.evolutionPaths.find(
    (p) => p.branchType === branchType
  );

  return match ?? definition.evolutionPaths[0];
}

/**
 * 進化を実行する（モンスター状態を更新）
 *
 * 進化先のbaseStatsを新しい最低値として適用し、
 * 現在のステータスが進化先のbaseStatsを下回っている場合は引き上げる。
 *
 * @param monster - 現在のモンスター状態（破壊的に変更）
 * @param targetPath - 進化先のパス
 * @returns 更新されたモンスター状態
 */
export function applyEvolution(
  monster: MonsterState,
  targetPath: EvolutionPath
): MonsterState {
  const targetDef = MONSTER_DEFINITIONS.get(targetPath.targetId);
  if (!targetDef) {
    throw new Error(`Unknown evolution target: ${targetPath.targetId}`);
  }

  monster.evolutionHistory.push(monster.definitionId);
  monster.definitionId = targetPath.targetId;

  // 進化先のbaseStatsが現在値より高ければ引き上げ
  monster.maxHp = Math.max(monster.maxHp, targetDef.baseStats.hp);
  monster.atk = Math.max(monster.atk, targetDef.baseStats.atk);
  monster.def = Math.max(monster.def, targetDef.baseStats.def);

  // 進化時にHP全回復
  monster.currentHp = monster.maxHp;

  return monster;
}
