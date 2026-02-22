/**
 * ゲームフェーズ・TP/WPプール・日次同期状態を管理するストア
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type { TrainingPoints } from "../types/training";

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
  /** 所持WP (ウォークポイント) */
  wp: number;
  /** 本日のPMCボーナス付与済みか */
  dailyBonusApplied: boolean;
  /** 最終同期日 (YYYY-MM-DD) */
  lastSyncDate: string;
  /** 最終ログイン日時 (ISO string) */
  lastLoginAt: string;
  /** 処理済みワークアウトキー (TP付与済みの重複防止用) */
  processedWorkoutKeys: string[];
  /** 最終RideMetrics取得日時 (ISO string) */
  lastRideMetricsFetch: string;
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
  /** PMCボーナス付与済みフラグをセットする */
  markDailyBonusApplied: (date: string) => void;
  /** ログイン日時を更新する */
  updateLastLogin: () => void;
  /** ワークアウトを処理済みとしてマークする */
  markWorkoutProcessed: (key: string) => void;
  /** RideMetrics取得日時を更新する */
  updateRideMetricsFetch: () => void;
  /** ゲームをリセットする（新規開始用） */
  resetGame: () => void;
}

const initialState: GameState = {
  phase: "new_game",
  playerName: "",
  tp: { low: 0, mid: 0, high: 0 },
  wp: 0,
  dailyBonusApplied: false,
  lastSyncDate: "",
  lastLoginAt: new Date().toISOString(),
  processedWorkoutKeys: [],
  lastRideMetricsFetch: "",
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
        set((state) => ({ wp: state.wp + amount })),

      consumeWp: (amount) =>
        set((state) => ({ wp: Math.max(0, state.wp - amount) })),

      markDailyBonusApplied: (date) =>
        set({ dailyBonusApplied: true, lastSyncDate: date }),

      updateLastLogin: () =>
        set({ lastLoginAt: new Date().toISOString() }),

      markWorkoutProcessed: (key) =>
        set((state) => ({
          processedWorkoutKeys: [...state.processedWorkoutKeys, key],
        })),

      updateRideMetricsFetch: () =>
        set({ lastRideMetricsFetch: new Date().toISOString() }),

      resetGame: () => set(initialState),
    }),
    {
      name: "digiride-game",
      storage: zustandStorage,
    }
  )
);
