/**
 * 図鑑ストア
 *
 * 発見済みモンスターと世代履歴を管理する。
 * Phase 4でSQLiteに移行予定。現時点ではAsyncStorageで永続化。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { slotStorage } from "./storage";

/** 世代履歴の1レコード */
export interface GenerationRecord {
  /** 世代番号 */
  generation: number;
  /** モンスター名 */
  name: string;
  /** 最終形態のモンスター定義ID */
  finalFormId: string;
  /** 最終HP */
  finalHp: number;
  /** 最終ATK */
  finalAtk: number;
  /** 最終DEF */
  finalDef: number;
  /** 勝利数 */
  wins: number;
  /** 敗北数 */
  losses: number;
  /** 生存日数 */
  daysLived: number;
  /** 死亡日時 (ISO string) */
  diedAt: string;
}

interface EncyclopediaState {
  /** 発見済みモンスターIDセット */
  discoveredIds: string[];
  /** 世代履歴 */
  generationHistory: GenerationRecord[];
}

interface EncyclopediaActions {
  /** モンスターを発見済みに登録する */
  discover: (monsterId: string) => void;
  /** 複数モンスターを一括発見済みに登録する */
  discoverMultiple: (monsterIds: string[]) => void;
  /** 発見済みかどうか */
  isDiscovered: (monsterId: string) => boolean;
  /** 世代履歴を追加する */
  addGenerationRecord: (record: GenerationRecord) => void;
  /** 発見済みモンスター数 */
  discoveredCount: () => number;
  /** リセット */
  resetEncyclopedia: () => void;
}

export const useEncyclopediaStore = create<
  EncyclopediaState & EncyclopediaActions
>()(
  persist(
    (set, get) => ({
      discoveredIds: [],
      generationHistory: [],

      discover: (monsterId) => {
        set((state) => {
          if (state.discoveredIds.includes(monsterId)) return state;
          return {
            discoveredIds: [...state.discoveredIds, monsterId],
          };
        });
      },

      discoverMultiple: (monsterIds) => {
        set((state) => {
          const newIds = monsterIds.filter(
            (id) => !state.discoveredIds.includes(id)
          );
          if (newIds.length === 0) return state;
          return {
            discoveredIds: [...state.discoveredIds, ...newIds],
          };
        });
      },

      isDiscovered: (monsterId) => {
        return get().discoveredIds.includes(monsterId);
      },

      addGenerationRecord: (record) => {
        set((state) => ({
          generationHistory: [...state.generationHistory, record],
        }));
      },

      discoveredCount: () => {
        return get().discoveredIds.length;
      },

      resetEncyclopedia: () =>
        set({ discoveredIds: [], generationHistory: [] }),
    }),
    {
      name: "digiride-encyclopedia",
      storage: slotStorage,
    }
  )
);
