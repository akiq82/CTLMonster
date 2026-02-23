/**
 * game-store のテスト
 *
 * resetForRebirth, baseTp, addBaseTp, allocateBaseTp の動作を検証する。
 */

import { useGameStore, INITIAL_BONUS_WP } from "../../src/store/game-store";

// slotStorage のモック (AsyncStorage を回避)
jest.mock("../../src/store/storage", () => ({
  slotStorage: {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe("game-store resetForRebirth", () => {
  beforeEach(() => {
    // ストアをデフォルト状態にリセット
    useGameStore.getState().resetGame();
  });

  it("should reset TP, WP, encounters, workoutKeys to zero", () => {
    const store = useGameStore.getState();
    // 事前にデータを積む
    store.addTp({ low: 100, mid: 50, high: 30 });
    store.addWp(5000);
    store.markWorkoutProcessed("workout-1");
    store.markWorkoutProcessed("workout-2");

    // resetForRebirth 実行
    useGameStore.getState().resetForRebirth("2026-02-23");

    const after = useGameStore.getState();
    expect(after.tp).toEqual({ low: 0, mid: 0, high: 0 });
    expect(after.wp).toBe(INITIAL_BONUS_WP);
    expect(after.encounterCount).toBe(0);
    expect(after.processedWorkoutKeys).toEqual([]);
  });

  it("should set lastSyncDate to bornDate", () => {
    useGameStore.getState().resetForRebirth("2026-02-23");

    expect(useGameStore.getState().lastSyncDate).toBe("2026-02-23");
  });

  it("should reset dailyBonusApplied and lastDeathCheckDate", () => {
    const store = useGameStore.getState();
    store.markDailyBonusApplied("2026-02-22");
    store.markDeathChecked("2026-02-22");

    useGameStore.getState().resetForRebirth("2026-02-23");

    const after = useGameStore.getState();
    expect(after.dailyBonusApplied).toBe(false);
    expect(after.lastDeathCheckDate).toBe("");
  });

  it("should NOT reset playerName or phase", () => {
    const store = useGameStore.getState();
    store.setPlayerName("Akihiro");
    store.setPhase("dead");

    useGameStore.getState().resetForRebirth("2026-02-23");

    const after = useGameStore.getState();
    expect(after.playerName).toBe("Akihiro");
    expect(after.phase).toBe("dead");
  });

  it("should NOT reset lastRideMetricsFetch", () => {
    useGameStore.getState().updateRideMetricsFetch();
    const fetchTime = useGameStore.getState().lastRideMetricsFetch;

    useGameStore.getState().resetForRebirth("2026-02-23");

    expect(useGameStore.getState().lastRideMetricsFetch).toBe(fetchTime);
  });

  it("should reset baseTp to 0", () => {
    useGameStore.getState().addBaseTp(50);
    expect(useGameStore.getState().baseTp).toBe(50);

    useGameStore.getState().resetForRebirth("2026-02-23");

    expect(useGameStore.getState().baseTp).toBe(0);
  });
});

describe("game-store baseTp", () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it("should start at 0", () => {
    expect(useGameStore.getState().baseTp).toBe(0);
  });

  it("addBaseTp should accumulate", () => {
    useGameStore.getState().addBaseTp(10);
    useGameStore.getState().addBaseTp(5);
    expect(useGameStore.getState().baseTp).toBe(15);
  });

  it("allocateBaseTp should transfer to L/M/H and reduce baseTp", () => {
    useGameStore.getState().addBaseTp(30);
    useGameStore.getState().allocateBaseTp(10, 10, 10);

    const state = useGameStore.getState();
    expect(state.baseTp).toBe(0);
    expect(state.tp.low).toBe(10);
    expect(state.tp.mid).toBe(10);
    expect(state.tp.high).toBe(10);
  });

  it("allocateBaseTp should reject if total exceeds baseTp", () => {
    useGameStore.getState().addBaseTp(10);
    useGameStore.getState().allocateBaseTp(5, 5, 5);

    // Should not change since 15 > 10
    const state = useGameStore.getState();
    expect(state.baseTp).toBe(10);
    expect(state.tp.low).toBe(0);
  });

  it("allocateBaseTp should allow partial allocation", () => {
    useGameStore.getState().addBaseTp(30);
    useGameStore.getState().allocateBaseTp(10, 5, 0);

    const state = useGameStore.getState();
    expect(state.baseTp).toBe(15);
    expect(state.tp.low).toBe(10);
    expect(state.tp.mid).toBe(5);
    expect(state.tp.high).toBe(0);
  });

  it("allocateBaseTp should reject zero total allocation", () => {
    useGameStore.getState().addBaseTp(10);
    useGameStore.getState().allocateBaseTp(0, 0, 0);

    expect(useGameStore.getState().baseTp).toBe(10);
  });
});
