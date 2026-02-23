/**
 * スロットマネージャストア
 *
 * 3つのセーブスロットを管理する。スロットサマリー（使用中か、モンスター名等）と
 * アクティブスロットの切替ロジックを提供する。
 * globalStorage で永続化（全スロット共有）。
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { globalStorage, setActiveSlot, getRawPlatformStorage } from "./storage";
import type { GamePhase } from "./game-store";
import { useGameStore } from "./game-store";
import { useMonsterStore } from "./monster-store";
import { useWorldStore } from "./world-store";
import { useEncyclopediaStore } from "./encyclopedia-store";

/** スロット数 */
export const SLOT_COUNT = 3;

/** スロットサマリー（セーブ選択画面の表示用） */
export interface SlotSummary {
  /** スロットにデータが存在するか */
  occupied: boolean;
  /** モンスター名 */
  monsterName: string;
  /** モンスター定義ID */
  definitionId: string;
  /** 世代番号 */
  generation: number;
  /** ゲームフェーズ */
  phase: GamePhase;
  /** 最終プレイ日時 (ISO string) */
  lastPlayedAt: string;
}

/** 空スロットのサマリー */
const EMPTY_SUMMARY: SlotSummary = {
  occupied: false,
  monsterName: "",
  definitionId: "",
  generation: 0,
  phase: "new_game",
  lastPlayedAt: "",
};

/** スロット別データのストレージキー */
const SLOT_STORE_KEYS = [
  "digiride-game",
  "digiride-monster",
  "digiride-world",
  "digiride-encyclopedia",
] as const;

interface SlotState {
  /** 現在アクティブなスロット (0 | 1 | 2) */
  activeSlot: number;
  /** アプリ起動後にスロットが選択されたか */
  slotSelected: boolean;
  /** 各スロットのサマリー */
  summaries: [SlotSummary, SlotSummary, SlotSummary];
  /** レガシーデータの移行が完了したか */
  legacyMigrated: boolean;
}

interface SlotActions {
  /** スロットを切り替える（各ストアを rehydrate） */
  switchSlot: (slot: number) => Promise<void>;
  /** 現在のスロットのサマリーを更新する */
  updateActiveSummary: (data: Partial<SlotSummary>) => void;
  /** スロットを削除する（ストレージキー削除 + サマリーリセット） */
  deleteSlot: (slot: number) => Promise<void>;
  /** レガシー移行完了をマークする */
  markLegacyMigrated: () => void;
  /** スロット選択状態をリセットする（アプリ再起動時） */
  resetSlotSelection: () => void;
}

const initialState: SlotState = {
  activeSlot: 0,
  slotSelected: false,
  summaries: [EMPTY_SUMMARY, EMPTY_SUMMARY, EMPTY_SUMMARY],
  legacyMigrated: false,
};

export const useSlotStore = create<SlotState & SlotActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      switchSlot: async (slot: number) => {
        // 1. モジュールレベルのアクティブスロットを更新
        setActiveSlot(slot);

        // 2. ストア状態を更新
        set({ activeSlot: slot, slotSelected: true });

        // 3. スロット対応ストアを rehydrate
        await useGameStore.persist.rehydrate();
        await useMonsterStore.persist.rehydrate();
        await useWorldStore.persist.rehydrate();
        await useEncyclopediaStore.persist.rehydrate();
      },

      updateActiveSummary: (data) => {
        set((state) => {
          const summaries = [...state.summaries] as [
            SlotSummary,
            SlotSummary,
            SlotSummary,
          ];
          summaries[state.activeSlot] = {
            ...summaries[state.activeSlot],
            ...data,
            occupied: true,
            lastPlayedAt: new Date().toISOString(),
          };
          return { summaries };
        });
      },

      deleteSlot: async (slot: number) => {
        const storage = getRawPlatformStorage();

        // スロットのストレージキーを削除
        for (const key of SLOT_STORE_KEYS) {
          storage.removeItem(`slot-${slot}/${key}`);
        }

        // サマリーをリセット
        set((state) => {
          const summaries = [...state.summaries] as [
            SlotSummary,
            SlotSummary,
            SlotSummary,
          ];
          summaries[slot] = { ...EMPTY_SUMMARY };
          return { summaries };
        });
      },

      markLegacyMigrated: () => set({ legacyMigrated: true }),

      resetSlotSelection: () => set({ slotSelected: false }),
    }),
    {
      name: "digiride-slots",
      storage: globalStorage,
      // 起動時は常にスロット未選択状態にする
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.slotSelected = false;
        }
      },
    }
  )
);
