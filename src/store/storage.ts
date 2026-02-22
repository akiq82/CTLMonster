/**
 * プラットフォーム対応ストレージユーティリティ
 *
 * Web環境ではlocalStorage、Native環境ではAsyncStorageを使用する。
 * Zustand persist の createJSONStorage に渡すための共通ストレージを提供する。
 */

import { createJSONStorage, type StateStorage } from "zustand/middleware";
import { Platform } from "react-native";

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
 * Zustand persist 用の共通JSONストレージ
 *
 * 各ストアで `storage: zustandStorage` として使用する。
 */
export const zustandStorage = createJSONStorage(getPlatformStorage);
