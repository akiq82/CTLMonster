/**
 * daily-sync サービスのテスト
 *
 * executeDailySync のオーケストレーションロジックを検証する。
 * 外部サービス呼び出しはモックする。
 */

import { executeDailySync } from "../../src/services/daily-sync";

// モック: ride-metrics
jest.mock("../../src/services/ride-metrics", () => ({
  fetchTrainingSummary: jest.fn(),
  fetchRecentWorkouts: jest.fn(),
}));

// モック: health-connect
jest.mock("../../src/services/health-connect", () => ({
  getYesterdaySteps: jest.fn(),
}));

// モック: notifications (fire-and-forget なので空実装)
jest.mock("../../src/services/notifications", () => ({
  scheduleMorningReminder: jest.fn().mockResolvedValue(undefined),
  scheduleMealReminder: jest.fn().mockResolvedValue(undefined),
  scheduleNeglectWarning: jest.fn().mockResolvedValue(undefined),
}));

const { fetchTrainingSummary, fetchRecentWorkouts } =
  jest.requireMock("../../src/services/ride-metrics");
const { getYesterdaySteps } =
  jest.requireMock("../../src/services/health-connect");

describe("executeDailySync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate PMC bonus with real data when RideMetrics is enabled", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 52.8,
      atl: 46.5,
      tsb: 6.3,
      weeklyTss: 201,
      ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(8000);

    const result = await executeDailySync(
      true, // rideMetricsEnabled
      true, // healthConnectEnabled
      [], // processedWorkoutKeys
      2 // mealsYesterday
    );

    expect(result.summary).not.toBeNull();
    expect(result.summary!.ctl).toBe(52.8);
    expect(result.yesterdaySteps).toBe(8000);
    // PMC bonus should be > 0 with CTL=52.8, TSB=6.3, steps=8000
    expect(
      result.pmcBonusTp.low + result.pmcBonusTp.mid + result.pmcBonusTp.high
    ).toBeGreaterThan(0);
  });

  it("should use default values when RideMetrics is disabled", async () => {
    const result = await executeDailySync(
      false, // rideMetricsEnabled
      false, // healthConnectEnabled
      [], // processedWorkoutKeys
      3 // mealsYesterday
    );

    expect(fetchTrainingSummary).not.toHaveBeenCalled();
    expect(fetchRecentWorkouts).not.toHaveBeenCalled();
    expect(result.summary).toBeNull();
    // Default: CTL=50, TSB=0, steps=5000
    expect(result.yesterdaySteps).toBe(5000);
    // Should still produce a PMC bonus with defaults
    expect(
      result.pmcBonusTp.low + result.pmcBonusTp.mid + result.pmcBonusTp.high
    ).toBeGreaterThan(0);
  });

  it("should process new workouts and skip already-processed ones", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 60,
      atl: 55,
      tsb: 5,
      weeklyTss: 300,
      ftp: 250,
    });
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-21|Morning Ride|97",
        date: "2026-02-21",
        name: "Morning Ride",
        tss: 97,
        intensityFactor: 0.64,
        zoneTime: {
          z1: 1963,
          z2: 5627,
          z3: 903,
          z4: 113,
          z5: 56,
          z6: 16,
          z7: 3,
        },
      },
      {
        id: "2026-02-20|Recovery|20",
        date: "2026-02-20",
        name: "Recovery",
        tss: 20,
        intensityFactor: 0.69,
        zoneTime: {
          z1: 517,
          z2: 867,
          z3: 8,
          z4: 56,
          z5: 78,
          z6: 2,
          z7: 0,
        },
      },
    ]);
    getYesterdaySteps.mockResolvedValue(6000);

    // Already processed the first workout
    const result = await executeDailySync(
      true,
      true,
      ["2026-02-21|Morning Ride|97"],
      2
    );

    // Only the second workout should be new
    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-20|Recovery|20"]);
    // Workout TP should be > 0 (from the Recovery ride zones)
    expect(
      result.workoutTp.low + result.workoutTp.mid + result.workoutTp.high
    ).toBeGreaterThan(0);
  });

  it("should return zero workout TP when all workouts are already processed", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 55,
      atl: 50,
      tsb: 5,
      weeklyTss: 200,
      ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-21|Ride|97",
        date: "2026-02-21",
        name: "Ride",
        tss: 97,
        intensityFactor: 0.64,
        zoneTime: { z1: 2000, z2: 5000, z3: 900, z4: 100, z5: 50, z6: 10, z7: 0 },
      },
    ]);
    getYesterdaySteps.mockResolvedValue(7000);

    const result = await executeDailySync(
      true,
      true,
      ["2026-02-21|Ride|97"],
      2
    );

    expect(result.newWorkoutCount).toBe(0);
    expect(result.workoutTp).toEqual({ low: 0, mid: 0, high: 0 });
  });

  it("should gracefully handle API errors (fallback to defaults)", async () => {
    fetchTrainingSummary.mockRejectedValue(new Error("Network error"));
    fetchRecentWorkouts.mockRejectedValue(new Error("Network error"));
    getYesterdaySteps.mockRejectedValue(new Error("Health Connect error"));

    const result = await executeDailySync(true, true, [], 1);

    // Should not throw; uses defaults
    expect(result.summary).toBeNull();
    expect(result.yesterdaySteps).toBe(5000); // DEFAULT_YESTERDAY_STEPS
    expect(result.newWorkoutCount).toBe(0);
    // PMC bonus still calculated with defaults (CTL=50, TSB=0)
    expect(
      result.pmcBonusTp.low + result.pmcBonusTp.mid + result.pmcBonusTp.high
    ).toBeGreaterThan(0);
  });

  it("should calculate discipline change based on PMC rank and meals", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 80,
      atl: 95,
      tsb: -15,
      weeklyTss: 500,
      ftp: 260,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(10000);

    const result = await executeDailySync(true, true, [], 3);

    // Rank A (CTL>=80, TSB<=-15) with 3 meals → should be positive
    expect(result.disciplineChange).toBeGreaterThan(0);
  });

  it("should return negative discipline for low rank and few meals", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 30,
      atl: 10,
      tsb: 20,
      weeklyTss: 50,
      ftp: 200,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(2000);

    const result = await executeDailySync(true, true, [], 0);

    // Rank D (CTL<50) with 0 meals → should be negative
    expect(result.disciplineChange).toBeLessThan(0);
  });
});
