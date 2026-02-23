import {
  calculatePmcFactor,
  calculateStepsFactor,
  determinePmcRank,
  calculatePmcBonus,
} from "../../src/engine/pmc-bonus";
import { PmcRank } from "../../src/types/ride-metrics";

describe("PMC Bonus Calculator", () => {
  describe("calculatePmcFactor", () => {
    it("CTL 50, TSB +15 → minimum factor 0.5", () => {
      // CTLボーナス = (50-50)/50 = 0, TSBボーナス = (15-15)/45 = 0
      expect(calculatePmcFactor(50, 15)).toBeCloseTo(0.5, 5);
    });

    it("CTL 100, TSB -30 → maximum factor 1.5", () => {
      // CTLボーナス = (100-50)/50 = 1.0, TSBボーナス = (15-(-30))/45 = 1.0
      expect(calculatePmcFactor(100, -30)).toBeCloseTo(1.5, 5);
    });

    it("CTL below 50 is clamped to 50", () => {
      expect(calculatePmcFactor(30, 15)).toBeCloseTo(0.5, 5);
    });

    it("TSB above 15 is clamped to 15", () => {
      expect(calculatePmcFactor(50, 30)).toBeCloseTo(0.5, 5);
    });
  });

  describe("calculateStepsFactor", () => {
    it("0 steps → 0", () => {
      expect(calculateStepsFactor(0)).toBe(0);
    });

    it("10,000 steps → 1.0", () => {
      expect(calculateStepsFactor(10000)).toBe(1.0);
    });

    it("15,000 steps → 1.5 (max)", () => {
      expect(calculateStepsFactor(15000)).toBe(1.5);
    });

    it("20,000 steps → clamped to 1.5", () => {
      expect(calculateStepsFactor(20000)).toBe(1.5);
    });
  });

  describe("determinePmcRank", () => {
    it("CTL 80, TSB -15 → Rank A", () => {
      expect(determinePmcRank(80, -15)).toBe(PmcRank.A);
    });

    it("CTL 65, TSB 0 → Rank B", () => {
      expect(determinePmcRank(65, 0)).toBe(PmcRank.B);
    });

    it("CTL 50, TSB 15 → Rank C", () => {
      expect(determinePmcRank(50, 15)).toBe(PmcRank.C);
    });

    it("CTL 49, TSB 0 → Rank D (CTL too low)", () => {
      expect(determinePmcRank(49, 0)).toBe(PmcRank.D);
    });

    it("CTL 80, TSB 1 → Rank C (TSB > 0, not B)", () => {
      expect(determinePmcRank(80, 1)).toBe(PmcRank.C);
    });

    it("CTL 80, TSB 0 → Rank B", () => {
      expect(determinePmcRank(80, 0)).toBe(PmcRank.B);
    });

    it("CTL 50, TSB 16 → Rank D (TSB too high)", () => {
      expect(determinePmcRank(50, 16)).toBe(PmcRank.D);
    });
  });

  describe("calculatePmcBonus (BASE=35)", () => {
    it("CTL 52.8, TSB 6.3, 10000 steps → total 20", () => {
      const result = calculatePmcBonus(52.8, 6.3, 10000);
      // PMC係数 = 0.5 + 0.04 + 0.06 = 0.60
      expect(result.pmcFactor).toBeCloseTo(0.6, 1);
      expect(result.stepsFactor).toBe(1.0);
      // floor(35 × 0.5972 × 1.0) = floor(20.90) = 20
      expect(result.totalTp).toBe(20);
      // 20/3 = 6余2 → L:8, M:6, H:6
      expect(result.tpL).toBe(8);
      expect(result.tpM).toBe(6);
      expect(result.tpH).toBe(6);
    });

    it("CTL 52.8, TSB -22.0, 10000 steps → total 27", () => {
      const result = calculatePmcBonus(52.8, -22.0, 10000);
      // PMC係数 ≈ 0.786, floor(35 × 0.786) = floor(27.51) = 27
      expect(result.totalTp).toBe(27);
      // 27/3 = 9余0 → L:9, M:9, H:9
      expect(result.tpL).toBe(9);
      expect(result.tpM).toBe(9);
      expect(result.tpH).toBe(9);
    });

    it("CTL 60.0, TSB -5.0, 12000 steps → total 32", () => {
      const result = calculatePmcBonus(60.0, -5.0, 12000);
      expect(result.stepsFactor).toBeCloseTo(1.2, 5);
      // PMC係数 ≈ 0.773, floor(35 × 0.773 × 1.2) = floor(32.47) = 32
      expect(result.totalTp).toBe(32);
      // 32/3 = 10余2 → L:12, M:10, H:10
      expect(result.tpL).toBe(12);
      expect(result.tpM).toBe(10);
      expect(result.tpH).toBe(10);
    });

    it("CTL 60.0, TSB 0, 10000 steps → total 25 (target scenario)", () => {
      const result = calculatePmcBonus(60.0, 0, 10000);
      // PMC係数 = 0.5 + 0.14 + 0.1 = 0.74, floor(35 × 0.74) = 25
      expect(result.totalTp).toBe(25);
      // 25/3 = 8余1 → L:9, M:8, H:8
      expect(result.tpL).toBe(9);
      expect(result.tpM).toBe(8);
      expect(result.tpH).toBe(8);
    });

    it("CTL 80.0, TSB -20.0, 10000 steps → total 40", () => {
      const result = calculatePmcBonus(80.0, -20.0, 10000);
      // PMC係数 ≈ 1.153, floor(35 × 1.153) = floor(40.36) = 40
      expect(result.totalTp).toBe(40);
      // 40/3 = 13余1 → L:14, M:13, H:13
      expect(result.tpL).toBe(14);
      expect(result.tpM).toBe(13);
      expect(result.tpH).toBe(13);
    });

    it("CTL 90.0, TSB -30.0, 15000 steps → total 71", () => {
      const result = calculatePmcBonus(90.0, -30.0, 15000);
      expect(result.pmcFactor).toBeCloseTo(1.36, 1);
      expect(result.stepsFactor).toBe(1.5);
      // floor(35 × 1.36 × 1.5) = floor(71.4) = 71
      expect(result.totalTp).toBe(71);
      // 71/3 = 23余2 → L:25, M:23, H:23
      expect(result.tpL).toBe(25);
      expect(result.tpM).toBe(23);
      expect(result.tpH).toBe(23);
    });
  });

  describe("TP distribution", () => {
    it("should always have tpL + tpM + tpH = totalTp", () => {
      for (let steps = 0; steps <= 15000; steps += 1000) {
        const result = calculatePmcBonus(60, 0, steps);
        expect(result.tpL + result.tpM + result.tpH).toBe(result.totalTp);
      }
    });

    it("remainder should go to TP-L", () => {
      const result = calculatePmcBonus(60.0, 0, 10000);
      expect(result.tpL).toBeGreaterThanOrEqual(result.tpM);
      expect(result.tpL).toBeGreaterThanOrEqual(result.tpH);
    });
  });
});
