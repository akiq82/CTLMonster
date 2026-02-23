/**
 * プラットフォーム対応ストレージユーティリティ
 *
 * Web環境ではlocalStorage、Native環境ではAsyncStorageを使用する。
 * Zustand persist の createJSONStorage に渡すための共通ストレージを提供する。
 *
 * スロット対応:
 * - globalStorage: 全スロット共有（設定、スロットマネージャ）
 * - slotStorage: アクティブスロット番号でキーをプレフィックス
 */

import { createJSONStorage, type StateStorage } from "zustand/middleware";
import { Platform } from "react-native";

/** 現在アクティブなスロットインデックス (0 | 1 | 2) */
let activeSlotIndex = 0;

/** 現在のアクティブスロットを取得する */
export function getActiveSlot(): number {
  return activeSlotIndex;
}

/** アクティブスロットを変更する（各ストアの rehydrate 前に呼ぶ） */
export function setActiveSlot(slot: number): void {
  activeSlotIndex = slot;
}

/**
 * Web用のlocalStorageラッパー (StateStorage互換)
 */
const webStorage: StateStorage = {
  getItem: (name: string) => {
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

/**
 * プラットフォームに応じたストレージを返す
 */
function getPlatformStorage(): StateStorage {
  if (Platform.OS === "web") {
    return webStorage;
  }
  // Native: AsyncStorage を動的に require
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  return AsyncStorage;
}

/**
 * スロット番号でキーをプレフィックスするストレージラッパー
 *
 * getItem/setItem/removeItem 呼び出し時に `slot-{N}/` を付与する。
 * activeSlotIndex の変更は setActiveSlot() で行い、各ストアの
 * persist.rehydrate() で再読込する。
 */
const slotAwareStorage: StateStorage = {
  getItem: (name: string) => {
    const platform = getPlatformStorage();
    return platform.getItem(`slot-${activeSlotIndex}/${name}`);
  },
  setItem: (name: string, value: string) => {
    const platform = getPlatformStorage();
    platform.setItem(`slot-${activeSlotIndex}/${name}`, value);
  },
  removeItem: (name: string) => {
    const platform = getPlatformStorage();
    platform.removeItem(`slot-${activeSlotIndex}/${name}`);
  },
};

/**
 * Zustand persist 用の共通JSONストレージ（後方互換）
 * @deprecated slotStorage または globalStorage を使用すること
 */
export const zustandStorage = createJSONStorage(getPlatformStorage);

/**
 * グローバルストレージ（スロットに依存しないデータ用）
 * 設定、スロットマネージャで使用。
 */
export const globalStorage = createJSONStorage(getPlatformStorage);

/**
 * スロット対応ストレージ（スロット別データ用）
 * ゲーム状態、モンスター、ワールド、図鑑で使用。
 */
export const slotStorage = createJSONStorage(() => slotAwareStorage);

/**
 * プラットフォームストレージへの直接アクセス（移行用）
 */
export function getRawPlatformStorage(): StateStorage {
  return getPlatformStorage();
}
