/**
 * daily-sync サービスのテスト
 *
 * executeDailySync のオーケストレーションロジックを検証する。
 * 外部サービス呼び出しはモックする。
 */

import { executeDailySync, syncWorkouts, getStepRescueDates } from "../../src/services/daily-sync";

// モック: ride-metrics
jest.mock("../../src/services/ride-metrics", () => ({
  fetchTrainingSummary: jest.fn(),
  fetchRecentWorkouts: jest.fn(),
}));

// モック: health-connect
jest.mock("../../src/services/health-connect", () => ({
  getYesterdaySteps: jest.fn(),
  fetchHealthDataForDate: jest.fn(),
}));

// モック: notifications (fire-and-forget なので空実装)
jest.mock("../../src/services/notifications", () => ({
  scheduleMorningReminder: jest.fn().mockResolvedValue(undefined),
  scheduleMealReminder: jest.fn().mockResolvedValue(undefined),
  scheduleNeglectWarning: jest.fn().mockResolvedValue(undefined),
}));

const { fetchTrainingSummary, fetchRecentWorkouts } =
  jest.requireMock("../../src/services/ride-metrics");
const { getYesterdaySteps, fetchHealthDataForDate } =
  jest.requireMock("../../src/services/health-connect");

describe("executeDailySync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: fetchHealthDataForDate returns 0 (no rescue data)
    fetchHealthDataForDate.mockResolvedValue({ steps: 0, floors: 0, wp: 0 });
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
    // No workouts → rideWp = 0
    expect(result.rideWp).toBe(0);
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
    expect(result.rideWp).toBe(0);
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
        distance: 61,
        elevationGain: 108,
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
        distance: 15,
        elevationGain: 30,
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
    // RideWP from Recovery: 15km × 250 + 30m × 10 = 3750 + 300 = 4050
    expect(result.rideWp).toBe(4050);
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
        distance: 40,
        elevationGain: 200,
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
    expect(result.rideWp).toBe(0);
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
    expect(result.rideWp).toBe(0);
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

  it("should calculate rideWp from new workouts", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 60, atl: 55, tsb: 5, weeklyTss: 300, ftp: 250,
    });
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-23|Long Ride|120",
        date: "2026-02-23",
        name: "Long Ride",
        tss: 120,
        intensityFactor: 0.75,
        zoneTime: { z1: 2000, z2: 4000, z3: 1500, z4: 500, z5: 200, z6: 50, z7: 0 },
        distance: 80,
        elevationGain: 500,
      },
    ]);
    getYesterdaySteps.mockResolvedValue(5000);

    const result = await executeDailySync(true, true, [], 2);

    // 80km × 250 + 500m × 10 = 20000 + 5000 = 25000 WP
    expect(result.rideWp).toBe(25000);
  });
});

describe("executeDailySync bornAt filter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchHealthDataForDate.mockResolvedValue({ steps: 0, floors: 0, wp: 0 });
  });

  const makeWorkout = (id: string, date: string, tss: number) => ({
    id,
    date,
    name: "Ride",
    tss,
    intensityFactor: 0.7,
    zoneTime: { z1: 1000, z2: 2000, z3: 500, z4: 100, z5: 0, z6: 0, z7: 0 },
    distance: 20,
    elevationGain: 50,
  });

  it("should filter out workouts before monsterBornAt", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([
      makeWorkout("2026-02-20|Ride|50", "2026-02-20", 50), // before bornAt
      makeWorkout("2026-02-22|Ride|60", "2026-02-22", 60), // after bornAt
    ]);
    getYesterdaySteps.mockResolvedValue(5000);

    const result = await executeDailySync(
      true, true, [], 2, "",
      "2026-02-21T10:00:00.000Z" // bornAt = Feb 21
    );

    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-22|Ride|60"]);
  });

  it("should include workouts on bornAt date", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([
      makeWorkout("2026-02-21|Ride|50", "2026-02-21", 50), // same day as bornAt
    ]);
    getYesterdaySteps.mockResolvedValue(5000);

    const result = await executeDailySync(
      true, true, [], 2, "",
      "2026-02-21T10:00:00.000Z"
    );

    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-21|Ride|50"]);
  });

  it("should pass all workouts when monsterBornAt is empty (backward compat)", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([
      makeWorkout("2026-02-19|Ride|40", "2026-02-19", 40),
      makeWorkout("2026-02-20|Ride|50", "2026-02-20", 50),
    ]);
    getYesterdaySteps.mockResolvedValue(5000);

    const result = await executeDailySync(
      true, true, [], 2, "",
      "" // empty monsterBornAt
    );

    expect(result.newWorkoutCount).toBe(2);
  });
});

describe("syncWorkouts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return TP and rideWp for new workouts", async () => {
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-23|Tempo Ride|85",
        date: "2026-02-23",
        name: "Tempo Ride",
        tss: 85,
        intensityFactor: 0.88,
        zoneTime: { z1: 300, z2: 1200, z3: 2400, z4: 600, z5: 120, z6: 30, z7: 0 },
        distance: 35,
        elevationGain: 200,
      },
    ]);

    const result = await syncWorkouts([]);

    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-23|Tempo Ride|85"]);
    expect(
      result.workoutTp.low + result.workoutTp.mid + result.workoutTp.high
    ).toBeGreaterThan(0);
    // 35km × 250 + 200m × 10 = 8750 + 2000 = 10750
    expect(result.rideWp).toBe(10750);
  });

  it("should skip already-processed workouts", async () => {
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-23|Ride A|50",
        date: "2026-02-23",
        name: "Ride A",
        tss: 50,
        intensityFactor: 0.7,
        zoneTime: { z1: 1000, z2: 2000, z3: 500, z4: 100, z5: 0, z6: 0, z7: 0 },
        distance: 20,
        elevationGain: 50,
      },
      {
        id: "2026-02-22|Ride B|60",
        date: "2026-02-22",
        name: "Ride B",
        tss: 60,
        intensityFactor: 0.75,
        zoneTime: { z1: 800, z2: 1800, z3: 600, z4: 200, z5: 50, z6: 0, z7: 0 },
        distance: 25,
        elevationGain: 100,
      },
    ]);

    const result = await syncWorkouts(["2026-02-23|Ride A|50"]);

    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-22|Ride B|60"]);
    // 25km × 250 + 100m × 10 = 6250 + 1000 = 7250
    expect(result.rideWp).toBe(7250);
  });

  it("should return zero TP and rideWp when no new workouts", async () => {
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-23|Ride|40",
        date: "2026-02-23",
        name: "Ride",
        tss: 40,
        intensityFactor: 0.65,
        zoneTime: { z1: 1500, z2: 2500, z3: 300, z4: 0, z5: 0, z6: 0, z7: 0 },
        distance: 30,
        elevationGain: 80,
      },
    ]);

    const result = await syncWorkouts(["2026-02-23|Ride|40"]);

    expect(result.newWorkoutCount).toBe(0);
    expect(result.newWorkoutKeys).toEqual([]);
    expect(result.workoutTp).toEqual({ low: 0, mid: 0, high: 0 });
    expect(result.rideWp).toBe(0);
  });

  it("should handle API errors gracefully", async () => {
    fetchRecentWorkouts.mockRejectedValue(new Error("Network error"));

    const result = await syncWorkouts([]);

    expect(result.newWorkoutCount).toBe(0);
    expect(result.workoutTp).toEqual({ low: 0, mid: 0, high: 0 });
    expect(result.rideWp).toBe(0);
  });

  it("should filter out workouts before monsterBornAt", async () => {
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-19|Old Ride|50",
        date: "2026-02-19",
        name: "Old Ride",
        tss: 50,
        intensityFactor: 0.7,
        zoneTime: { z1: 1000, z2: 2000, z3: 500, z4: 100, z5: 0, z6: 0, z7: 0 },
        distance: 20,
        elevationGain: 50,
      },
      {
        id: "2026-02-21|New Ride|60",
        date: "2026-02-21",
        name: "New Ride",
        tss: 60,
        intensityFactor: 0.75,
        zoneTime: { z1: 800, z2: 1800, z3: 600, z4: 200, z5: 50, z6: 0, z7: 0 },
        distance: 25,
        elevationGain: 100,
      },
    ]);

    const result = await syncWorkouts([], "2026-02-20T08:00:00.000Z");

    expect(result.newWorkoutCount).toBe(1);
    expect(result.newWorkoutKeys).toEqual(["2026-02-21|New Ride|60"]);
  });

  it("should pass all workouts when monsterBornAt is empty", async () => {
    fetchRecentWorkouts.mockResolvedValue([
      {
        id: "2026-02-19|Ride|50",
        date: "2026-02-19",
        name: "Ride",
        tss: 50,
        intensityFactor: 0.7,
        zoneTime: { z1: 1000, z2: 2000, z3: 500, z4: 100, z5: 0, z6: 0, z7: 0 },
        distance: 20,
        elevationGain: 50,
      },
    ]);

    const result = await syncWorkouts([], "");

    expect(result.newWorkoutCount).toBe(1);
  });
});

describe("getStepRescueDates", () => {
  it("should return dates between lastSyncDate and today (exclusive both ends)", () => {
    const dates = getStepRescueDates("2026-02-20", "2026-02-23");
    expect(dates).toEqual(["2026-02-21", "2026-02-22"]);
  });

  it("should return empty array when lastSyncDate is yesterday", () => {
    const dates = getStepRescueDates("2026-02-22", "2026-02-23");
    expect(dates).toEqual([]);
  });

  it("should cap at 3 days when gap is larger", () => {
    const dates = getStepRescueDates("2026-02-15", "2026-02-23");
    expect(dates).toEqual(["2026-02-20", "2026-02-21", "2026-02-22"]);
  });

  it("should return up to 3 days when lastSyncDate is empty", () => {
    const dates = getStepRescueDates("", "2026-02-23");
    expect(dates).toEqual(["2026-02-20", "2026-02-21", "2026-02-22"]);
  });

  it("should return 1 day when there is a 2-day gap", () => {
    const dates = getStepRescueDates("2026-02-21", "2026-02-23");
    expect(dates).toEqual(["2026-02-22"]);
  });

  it("should return empty when lastSyncDate is today", () => {
    const dates = getStepRescueDates("2026-02-23", "2026-02-23");
    expect(dates).toEqual([]);
  });
});

describe("executeDailySync step rescue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Freeze "today" for rescue date calculation
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 1, 23)); // 2026-02-23
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should rescue WP for missed days when Health Connect is enabled", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(5000);
    // Feb 21: 8000 steps + 5 floors, Feb 22: 6000 steps + 3 floors
    fetchHealthDataForDate.mockImplementation((dateStr: string) => {
      if (dateStr === "2026-02-21") return Promise.resolve({ steps: 8000, floors: 5, wp: 8500 });
      if (dateStr === "2026-02-22") return Promise.resolve({ steps: 6000, floors: 3, wp: 6300 });
      return Promise.resolve({ steps: 0, floors: 0, wp: 0 });
    });

    const result = await executeDailySync(
      true, true, [], 2,
      "2026-02-20" // lastSyncDate: app was open on Feb 20
    );

    expect(result.rescuedWp).toBe(8500 + 6300);
    expect(result.rescuedStepDates).toEqual(["2026-02-21", "2026-02-22"]);
  });

  it("should not rescue when Health Connect is disabled", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([]);

    const result = await executeDailySync(
      true, false, [], 2,
      "2026-02-20"
    );

    expect(fetchHealthDataForDate).not.toHaveBeenCalled();
    expect(result.rescuedWp).toBe(0);
    expect(result.rescuedStepDates).toEqual([]);
  });

  it("should not rescue when lastSyncDate is yesterday (no gap)", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(5000);

    const result = await executeDailySync(
      true, true, [], 2,
      "2026-02-22" // yesterday — no gap
    );

    expect(fetchHealthDataForDate).not.toHaveBeenCalled();
    expect(result.rescuedWp).toBe(0);
  });

  it("should skip days with 0 WP in rescuedStepDates", async () => {
    fetchTrainingSummary.mockResolvedValue({
      ctl: 50, atl: 45, tsb: 5, weeklyTss: 200, ftp: 249,
    });
    fetchRecentWorkouts.mockResolvedValue([]);
    getYesterdaySteps.mockResolvedValue(5000);
    fetchHealthDataForDate.mockImplementation((dateStr: string) => {
      if (dateStr === "2026-02-21") return Promise.resolve({ steps: 7000, floors: 2, wp: 7200 });
      // Feb 22: no data (phone was off?)
      return Promise.resolve({ steps: 0, floors: 0, wp: 0 });
    });

    const result = await executeDailySync(
      true, true, [], 2,
      "2026-02-20"
    );

    expect(result.rescuedWp).toBe(7200);
    expect(result.rescuedStepDates).toEqual(["2026-02-21"]);
  });
});
