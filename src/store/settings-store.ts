/**
 * 設定ストア
 *
 * サウンド、通知、プレイヤー設定を管理する。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { globalStorage } from "./storage";

interface SettingsState {
  /** サウンド有効 */
  soundEnabled: boolean;
  /** 通知有効 */
  notificationsEnabled: boolean;
  /** 体重 (kg, RideMetrics W/kg計算用) */
  weight: number;
  /** Health Connect連携有効 */
  healthConnectEnabled: boolean;
  /** RideMetrics連携有効 */
  rideMetricsEnabled: boolean;
}

interface SettingsActions {
  /** サウンドの有効/無効を切り替える */
  toggleSound: () => void;
  /** 通知の有効/無効を切り替える */
  toggleNotifications: () => void;
  /** 体重を設定する */
  setWeight: (weight: number) => void;
  /** Health Connect連携を切り替える */
  toggleHealthConnect: () => void;
  /** RideMetrics連携を切り替える */
  toggleRideMetrics: () => void;
  /** 設定をリセットする */
  resetSettings: () => void;
}

const initialSettings: SettingsState = {
  soundEnabled: true,
  notificationsEnabled: true,
  weight: 70,
  healthConnectEnabled: false,
  rideMetricsEnabled: false,
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialSettings,

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),

      setWeight: (weight) => set({ weight }),

      toggleHealthConnect: () =>
        set((state) => ({
          healthConnectEnabled: !state.healthConnectEnabled,
        })),

      toggleRideMetrics: () =>
        set((state) => ({
          rideMetricsEnabled: !state.rideMetricsEnabled,
        })),

      resetSettings: () => set(initialSettings),
    }),
    {
      name: "digiride-settings",
      storage: globalStorage,
    }
  )
);
