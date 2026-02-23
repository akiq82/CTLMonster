/**
 * 図鑑ストア
 *
 * 発見済みモンスターと世代履歴を管理する。
 * Phase 4でSQLiteに移行予定。現時点ではAsyncStorageで永続化。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { slotStorage } from "./storage";

/** 日次ログの1レコード */
export interface DailyLog {
  /** 日付 (YYYY-MM-DD) */
  date: string;
  /** 獲得WP */
  wpGained: number;
  /** 獲得TP (L/M/H) */
  tpGained: { low: number; mid: number; high: number };
  /** 獲得ベースTP (PMC + バトルXP) */
  baseTpGained: number;
  /** バトル勝利数 */
  battlesWon: number;
  /** バトル敗北数 */
  battlesLost: number;
  /** ボス撃破したか */
  bossDefeated: boolean;
  /** 撃破したボスのワールド番号 */
  bossWorldNumber?: number;
  /** トレーニング回数 */
  trainingSessions: number;
  /** ワールド番号 */
  worldNumber: number;
}

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
  /** 日次ログ */
  dailyLogs: DailyLog[];
  /** 到達した最高ワールド */
  highestWorld: number;
  /** 撃破したボスのワールド番号一覧 */
  bossesDefeated: number[];
}

interface EncyclopediaState {
  /** 発見済みモンスターIDセット */
  discoveredIds: string[];
  /** 世代履歴 */
  generationHistory: GenerationRecord[];
  /** 生存中モンスターの日次ログバッファ */
  currentDailyLogs: DailyLog[];
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
  /** 日次ログを更新する（同日の呼び出しは累積加算） */
  updateDailyLog: (date: string, updates: Partial<Omit<DailyLog, "date">>) => void;
  /** 世代を確定する (currentDailyLogs を GenerationRecord に含めて履歴に追加し、バッファをクリア) */
  finalizeGeneration: (record: Omit<GenerationRecord, "dailyLogs">) => void;
  /** 日次ログバッファをクリアする */
  clearCurrentDailyLogs: () => void;
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
      currentDailyLogs: [],

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

      updateDailyLog: (date, updates) => {
        set((state) => {
          const logs = [...state.currentDailyLogs];
          const idx = logs.findIndex((l) => l.date === date);
          if (idx >= 0) {
            // 累積加算
            const existing = logs[idx];
            logs[idx] = {
              ...existing,
              wpGained: existing.wpGained + (updates.wpGained ?? 0),
              tpGained: {
                low: existing.tpGained.low + (updates.tpGained?.low ?? 0),
                mid: existing.tpGained.mid + (updates.tpGained?.mid ?? 0),
                high: existing.tpGained.high + (updates.tpGained?.high ?? 0),
              },
              baseTpGained: existing.baseTpGained + (updates.baseTpGained ?? 0),
              battlesWon: existing.battlesWon + (updates.battlesWon ?? 0),
              battlesLost: existing.battlesLost + (updates.battlesLost ?? 0),
              bossDefeated: existing.bossDefeated || (updates.bossDefeated ?? false),
              bossWorldNumber: updates.bossWorldNumber ?? existing.bossWorldNumber,
              trainingSessions: existing.trainingSessions + (updates.trainingSessions ?? 0),
              worldNumber: updates.worldNumber ?? existing.worldNumber,
            };
          } else {
            logs.push({
              date,
              wpGained: updates.wpGained ?? 0,
              tpGained: {
                low: updates.tpGained?.low ?? 0,
                mid: updates.tpGained?.mid ?? 0,
                high: updates.tpGained?.high ?? 0,
              },
              baseTpGained: updates.baseTpGained ?? 0,
              battlesWon: updates.battlesWon ?? 0,
              battlesLost: updates.battlesLost ?? 0,
              bossDefeated: updates.bossDefeated ?? false,
              bossWorldNumber: updates.bossWorldNumber,
              trainingSessions: updates.trainingSessions ?? 0,
              worldNumber: updates.worldNumber ?? 1,
            });
          }
          return { currentDailyLogs: logs };
        });
      },

      finalizeGeneration: (record) => {
        set((state) => ({
          generationHistory: [
            ...state.generationHistory,
            { ...record, dailyLogs: state.currentDailyLogs },
          ],
          currentDailyLogs: [],
        }));
      },

      clearCurrentDailyLogs: () => set({ currentDailyLogs: [] }),

      resetEncyclopedia: () =>
        set({ discoveredIds: [], generationHistory: [], currentDailyLogs: [] }),
    }),
    {
      name: "digiride-encyclopedia",
      storage: slotStorage,
    }
  )
);
