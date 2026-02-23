/**
 * ゲームフェーズ・TP/WPプール・日次同期状態を管理するストア
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { slotStorage } from "./storage";
import type { TrainingPoints } from "../types/training";
import { convertWpToEncounters } from "../engine/encounter";

/**
 * 初期ボーナスWP — 新規ゲーム・転生時に付与する。
 * 序盤のエンカウント体験を確保するためのテンポラリ値。
 * TODO: バランス調整完了後に削除する
 */
export const INITIAL_BONUS_WP = 10_000;

/** ゲームフェーズ */
export type GamePhase =
  | "new_game"
  | "hatching"
  | "alive"
  | "dead"
  | "evolving";

interface GameState {
  /** 現在のゲームフェーズ */
  phase: GamePhase;
  /** プレイヤー名 */
  playerName: string;
  /** 所持TP (トレーニングポイント) */
  tp: TrainingPoints;
  /** 所持WP (ウォークポイント) — 3000未満の端数 */
  wp: number;
  /** エンカウント回数（WPから自動変換されたバトル確定分） */
  encounterCount: number;
  /** 本日のPMCボーナス付与済みか */
  dailyBonusApplied: boolean;
  /** 最終同期日 (YYYY-MM-DD) */
  lastSyncDate: string;
  /** 最終ログイン日時 (ISO string) */
  lastLoginAt: string;
  /** 処理済みワークアウトキー (TP付与済みの重複防止用) */
  processedWorkoutKeys: string[];
  /** 最終寿命死亡判定日 (YYYY-MM-DD, JST 4:00基準) */
  lastDeathCheckDate: string;
  /** 最終RideMetrics取得日時 (ISO string) */
  lastRideMetricsFetch: string;
  /** ベースTPプール (PMCボーナス + バトルXP) */
  baseTp: number;
}

interface GameActions {
  /** ゲームフェーズを変更する */
  setPhase: (phase: GamePhase) => void;
  /** プレイヤー名を設定する */
  setPlayerName: (name: string) => void;
  /** TPを加算する */
  addTp: (tp: Partial<TrainingPoints>) => void;
  /** TPを消費する */
  consumeTp: (tp: TrainingPoints) => void;
  /** WPを加算する */
  addWp: (amount: number) => void;
  /** WPを消費する */
  consumeWp: (amount: number) => void;
  /** エンカウント回数を1消費する */
  consumeEncounter: () => void;
  /** PMCボーナス付与済みフラグをセットする */
  markDailyBonusApplied: (date: string) => void;
  /** ログイン日時を更新する */
  updateLastLogin: () => void;
  /** ワークアウトを処理済みとしてマークする */
  markWorkoutProcessed: (key: string) => void;
  /** 寿命死亡判定日を更新する */
  markDeathChecked: (date: string) => void;
  /** RideMetrics取得日時を更新する */
  updateRideMetricsFetch: () => void;
  /** ベースTPを加算する */
  addBaseTp: (amount: number) => void;
  /** ベースTPをL/M/Hに配分する */
  allocateBaseTp: (toL: number, toM: number, toH: number) => void;
  /** 転生時にTP/WP/エンカウント等をリセットする（モンスター誕生日基準） */
  resetForRebirth: (bornDate: string) => void;
  /** ゲームをリセットする（新規開始用） */
  resetGame: () => void;
}

const initialState: GameState = {
  phase: "new_game",
  playerName: "",
  tp: { low: 0, mid: 0, high: 0 },
  wp: INITIAL_BONUS_WP,
  encounterCount: 0,
  dailyBonusApplied: false,
  lastSyncDate: "",
  lastLoginAt: new Date().toISOString(),
  processedWorkoutKeys: [],
  lastDeathCheckDate: "",
  lastRideMetricsFetch: "",
  baseTp: 0,
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      setPhase: (phase) => set({ phase }),

      setPlayerName: (name) => set({ playerName: name }),

      addTp: (tp) =>
        set((state) => ({
          tp: {
            low: state.tp.low + (tp.low ?? 0),
            mid: state.tp.mid + (tp.mid ?? 0),
            high: state.tp.high + (tp.high ?? 0),
          },
        })),

      consumeTp: (tp) =>
        set((state) => ({
          tp: {
            low: Math.max(0, state.tp.low - tp.low),
            mid: Math.max(0, state.tp.mid - tp.mid),
            high: Math.max(0, state.tp.high - tp.high),
          },
        })),

      addWp: (amount) =>
        set((state) => {
          const totalWp = state.wp + amount;
          const result = convertWpToEncounters(totalWp);
          return {
            wp: result.wpRemaining,
            encounterCount: state.encounterCount + result.encountersGained,
          };
        }),

      consumeWp: (amount) =>
        set((state) => ({ wp: Math.max(0, state.wp - amount) })),

      consumeEncounter: () =>
        set((state) => ({
          encounterCount: Math.max(0, state.encounterCount - 1),
        })),

      markDailyBonusApplied: (date) =>
        set({ dailyBonusApplied: true, lastSyncDate: date }),

      updateLastLogin: () =>
        set({ lastLoginAt: new Date().toISOString() }),

      markWorkoutProcessed: (key) =>
        set((state) => ({
          processedWorkoutKeys: [...state.processedWorkoutKeys, key],
        })),

      markDeathChecked: (date) => set({ lastDeathCheckDate: date }),

      updateRideMetricsFetch: () =>
        set({ lastRideMetricsFetch: new Date().toISOString() }),

      addBaseTp: (amount) =>
        set((state) => ({ baseTp: state.baseTp + amount })),

      allocateBaseTp: (toL, toM, toH) =>
        set((state) => {
          const total = toL + toM + toH;
          if (total > state.baseTp || total <= 0) return state;
          return {
            baseTp: state.baseTp - total,
            tp: {
              low: state.tp.low + toL,
              mid: state.tp.mid + toM,
              high: state.tp.high + toH,
            },
          };
        }),

      resetForRebirth: (bornDate) =>
        set({
          tp: { low: 0, mid: 0, high: 0 },
          wp: INITIAL_BONUS_WP,
          encounterCount: 0,
          processedWorkoutKeys: [],
          lastSyncDate: bornDate,
          dailyBonusApplied: false,
          lastDeathCheckDate: "",
          baseTp: 0,
        }),

      resetGame: () => set(initialState),
    }),
    {
      name: "digiride-game",
      storage: slotStorage,
    }
  )
);
