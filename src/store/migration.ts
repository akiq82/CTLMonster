/**
 * レガシーデータ移行
 *
 * スロット機能導入前の旧キー（digiride-game 等）を
 * slot-0/ プレフィックス付きキーにコピーする。
 * 移行は1回のみ実行され、useSlotStore.legacyMigrated で管理される。
 */

import { getRawPlatformStorage } from "./storage";
import { useSlotStore, type SlotSummary } from "./slot-store";
import type { GamePhase } from "./game-store";

/** 移行対象のストレージキー */
const LEGACY_KEYS = [
  "digiride-game",
  "digiride-monster",
  "digiride-world",
  "digiride-encyclopedia",
] as const;

/**
 * レガシーデータをスロット0に移行する
 *
 * 旧キーが存在する場合、slot-0/ プレフィックス付きキーにコピーし、
 * スロット0のサマリーを更新する。旧キーは残す（フォールバック用）。
 */
export async function migrateLegacyData(): Promise<void> {
  const { legacyMigrated, markLegacyMigrated } = useSlotStore.getState();

  // 既に移行済み
  if (legacyMigrated) return;

  const storage = getRawPlatformStorage();
  let hasData = false;

  for (const key of LEGACY_KEYS) {
    const value = await storage.getItem(key);
    if (value) {
      hasData = true;
      await storage.setItem(`slot-0/${key}`, value);
    }
  }

  // 移行したデータからスロット0のサマリーを構築
  if (hasData) {
    const monsterRaw = await storage.getItem("slot-0/digiride-monster");
    const gameRaw = await storage.getItem("slot-0/digiride-game");

    let monsterName = "";
    let definitionId = "";
    let generation = 1;
    let phase: GamePhase = "new_game";

    if (monsterRaw) {
      try {
        const parsed = JSON.parse(monsterRaw);
        const monsterState = parsed.state?.monster;
        if (monsterState) {
          monsterName = monsterState.name ?? "";
          definitionId = monsterState.definitionId ?? "";
          generation = monsterState.generation ?? 1;
        }
      } catch {
        // パース失敗は無視
      }
    }

    if (gameRaw) {
      try {
        const parsed = JSON.parse(gameRaw);
        phase = parsed.state?.phase ?? "new_game";
      } catch {
        // パース失敗は無視
      }
    }

    const summaries = [
      ...useSlotStore.getState().summaries,
    ] as SlotSummary[] as [SlotSummary, SlotSummary, SlotSummary];
    summaries[0] = {
      occupied: monsterName !== "" || phase !== "new_game",
      monsterName,
      definitionId,
      generation,
      phase,
      lastPlayedAt: new Date().toISOString(),
    };
    useSlotStore.setState({ summaries, activeSlot: 0 });
  }

  markLegacyMigrated();
}
