/**
 * モンスター状態管理ストア
 *
 * engine純粋関数のラッパーとして機能し、MonsterStateの更新を管理する。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type { MonsterState } from "../types/monster";
import type { TrainingMenuDefinition, TrainingResult } from "../types/training";
import type { BattleResult } from "../types/battle";
import { MONSTER_DEFINITIONS } from "../data/monsters";
import {
  executeTraining,
  applyTrainingResult,
} from "../engine/training";
import {
  canEvolve,
  getEvolutionTarget,
  applyEvolution,
} from "../engine/evolution";
import {
  createFirstGeneration,
  createNextGeneration,
} from "../engine/generation";
import {
  rollMealLifespanExtension,
} from "../engine/lifespan";
import {
  applyDisciplineChange,
} from "../engine/discipline";
import type { WorldProgress } from "../types/world";

interface MonsterStore {
  /** 現在のモンスター状態 (null = モンスターなし) */
  monster: MonsterState | null;

  /** 第1世代モンスターを作成する */
  createMonster: (name: string, starterId: string) => void;
  /** 次世代モンスターを作成する */
  createNextGen: (newName: string) => void;
  /** トレーニングを実行してステータスを更新する */
  train: (menu: TrainingMenuDefinition) => TrainingResult | null;
  /** バトル結果を反映する */
  applyBattleResult: (result: BattleResult) => void;
  /** 食事を記録する */
  recordMeal: () => void;
  /** 規律を変更する */
  changeDiscipline: (change: number) => void;
  /** HP回復を適用する */
  healHp: (amount: number) => void;
  /** HPダメージを適用する */
  damageHp: (amount: number) => void;
  /** 進化可能か判定して進化を適用する */
  tryEvolve: (worldProgress: ReadonlyMap<number, WorldProgress>) => boolean;
  /** ログイン日時を更新する */
  updateLastLogin: () => void;
  /** 日次食事カウンターをリセットする */
  resetDailyMeals: () => void;
  /** モンスターを直接セットする (復元用) */
  setMonster: (monster: MonsterState | null) => void;
}

export const useMonsterStore = create<MonsterStore>()(
  persist(
    (set, get) => ({
      monster: null,

      createMonster: (name, starterId) => {
        const monster = createFirstGeneration(name, starterId);
        set({ monster });
      },

      createNextGen: (newName) => {
        const current = get().monster;
        if (!current) return;
        const next = createNextGeneration(current, newName);
        set({ monster: next });
      },

      train: (menu) => {
        const monster = get().monster;
        if (!monster) return null;
        const hasMealBonus = monster.mealsToday > 0;
        const result = executeTraining(menu, hasMealBonus);
        const updated = applyTrainingResult(
          { ...monster },
          result,
          menu
        );
        set({ monster: updated });
        return result;
      },

      applyBattleResult: (result) => {
        set((state) => {
          if (!state.monster) return state;
          const m = { ...state.monster };
          m.currentHp = Math.max(1, result.playerRemainingHp);
          if (result.playerWon) {
            m.wins += 1;
          } else {
            m.losses += 1;
          }
          return { monster: m };
        });
      },

      recordMeal: () => {
        set((state) => {
          if (!state.monster) return state;
          const m = { ...state.monster };
          m.mealsToday += 1;
          const extension = rollMealLifespanExtension();
          m.lifespanExtension += extension;
          return { monster: m };
        });
      },

      changeDiscipline: (change) => {
        set((state) => {
          if (!state.monster) return state;
          const m = { ...state.monster };
          m.discipline = applyDisciplineChange(m.discipline, change);
          return { monster: m };
        });
      },

      healHp: (amount) => {
        set((state) => {
          if (!state.monster) return state;
          const m = { ...state.monster };
          m.currentHp = Math.min(m.maxHp, m.currentHp + amount);
          return { monster: m };
        });
      },

      damageHp: (amount) => {
        set((state) => {
          if (!state.monster) return state;
          const m = { ...state.monster };
          m.currentHp = Math.max(1, m.currentHp - amount);
          return { monster: m };
        });
      },

      tryEvolve: (worldProgress) => {
        const monster = get().monster;
        if (!monster) return false;

        const def = MONSTER_DEFINITIONS.get(monster.definitionId);
        if (!def) return false;

        if (!canEvolve(monster, worldProgress)) return false;

        const target = getEvolutionTarget(monster);
        if (!target) return false;

        const evolved = applyEvolution({ ...monster }, target);
        set({ monster: evolved });
        return true;
      },

      updateLastLogin: () => {
        set((state) => {
          if (!state.monster) return state;
          return {
            monster: {
              ...state.monster,
              lastLoginAt: new Date().toISOString(),
            },
          };
        });
      },

      resetDailyMeals: () => {
        set((state) => {
          if (!state.monster) return state;
          return {
            monster: {
              ...state.monster,
              mealsYesterday: state.monster.mealsToday,
              mealsToday: 0,
            },
          };
        });
      },

      setMonster: (monster) => set({ monster }),
    }),
    {
      name: "digiride-monster",
      storage: zustandStorage,
    }
  )
);
