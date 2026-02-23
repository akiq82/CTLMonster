/**
 * ワールド進行状態ストア
 *
 * 各ワールドの進行状態（撃破数、ボス撃破済みフラグ）を管理する。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { slotStorage } from "./storage";
import type { WorldProgress } from "../types/world";
import {
  createInitialWorldProgress,
  recordMobKill,
  recordBossDefeat,
  canChallengeBoss,
  getAvailableWorlds,
  getWorldProgressRate,
} from "../engine/world";

interface WorldState {
  /** 全ワールドの進行状態 (worldNumber -> WorldProgress) */
  worldProgressMap: Record<number, WorldProgress>;
  /** 現在選択中のワールド番号 */
  currentWorldNumber: number;
}

interface WorldActions {
  /** 現在のワールド進行状態を取得する */
  getCurrentProgress: () => WorldProgress;
  /** ワールドを選択する */
  selectWorld: (worldNumber: number) => void;
  /** モブ撃破を記録する */
  addMobKill: () => void;
  /** ボス撃破を記録する */
  addBossDefeat: () => void;
  /** ボス挑戦可能か */
  canFightBoss: () => boolean;
  /** 選択可能なワールド番号を取得する */
  getAvailable: () => number[];
  /** 進行率を取得する */
  getProgressRate: () => number;
  /** 全ワールド進行をReadonlyMapで取得する (engine関数との互換用) */
  getWorldProgressAsMap: () => ReadonlyMap<number, WorldProgress>;
  /** リセット */
  resetWorlds: () => void;
}

const initialWorldState: WorldState = {
  worldProgressMap: { 1: createInitialWorldProgress() },
  currentWorldNumber: 1,
};

export const useWorldStore = create<WorldState & WorldActions>()(
  persist(
    (set, get) => ({
      ...initialWorldState,

      getCurrentProgress: () => {
        const { worldProgressMap, currentWorldNumber } = get();
        return (
          worldProgressMap[currentWorldNumber] ??
          createInitialWorldProgress()
        );
      },

      selectWorld: (worldNumber) => {
        set((state) => {
          const map = { ...state.worldProgressMap };
          if (!map[worldNumber]) {
            map[worldNumber] = {
              worldNumber,
              killCount: 0,
              bossDefeated: false,
            };
          }
          return { currentWorldNumber: worldNumber, worldProgressMap: map };
        });
      },

      addMobKill: () => {
        set((state) => {
          const wn = state.currentWorldNumber;
          const current = state.worldProgressMap[wn] ?? createInitialWorldProgress();
          return {
            worldProgressMap: {
              ...state.worldProgressMap,
              [wn]: recordMobKill(current),
            },
          };
        });
      },

      addBossDefeat: () => {
        set((state) => {
          const wn = state.currentWorldNumber;
          const current = state.worldProgressMap[wn] ?? createInitialWorldProgress();
          return {
            worldProgressMap: {
              ...state.worldProgressMap,
              [wn]: recordBossDefeat(current),
            },
          };
        });
      },

      canFightBoss: () => {
        const progress = get().getCurrentProgress();
        return canChallengeBoss(progress);
      },

      getAvailable: () => {
        const map = get().getWorldProgressAsMap();
        return getAvailableWorlds(map);
      },

      getProgressRate: () => {
        const progress = get().getCurrentProgress();
        return getWorldProgressRate(progress);
      },

      getWorldProgressAsMap: () => {
        const { worldProgressMap } = get();
        return new Map(
          Object.entries(worldProgressMap).map(([k, v]) => [Number(k), v])
        );
      },

      resetWorlds: () => set(initialWorldState),
    }),
    {
      name: "digiride-world",
      storage: slotStorage,
    }
  )
);
