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

  describe("calculatePmcBonus - GDD concrete examples (Akihiro data)", () => {
    it("CTL 52.8, TSB 6.3, 10000 steps → total 4, L:2 M:1 H:1", () => {
      const result = calculatePmcBonus(52.8, 6.3, 10000);
      // PMC係数 = 0.5 + 0.04 + 0.06 = 0.60
      expect(result.pmcFactor).toBeCloseTo(0.6, 1);
      expect(result.stepsFactor).toBe(1.0);
      // floor(8 × 0.60 × 1.0) = floor(4.8) = 4
      expect(result.totalTp).toBe(4);
      // 4/3 = 1余1 → L:2, M:1, H:1
      expect(result.tpL).toBe(2);
      expect(result.tpM).toBe(1);
      expect(result.tpH).toBe(1);
    });

    it("CTL 52.8, TSB -22.0, 10000 steps → total 6, L:2 M:2 H:2", () => {
      const result = calculatePmcBonus(52.8, -22.0, 10000);
      expect(result.totalTp).toBe(6);
      expect(result.tpL).toBe(2);
      expect(result.tpM).toBe(2);
      expect(result.tpH).toBe(2);
    });

    it("CTL 60.0, TSB -5.0, 12000 steps → total 7, L:3 M:2 H:2", () => {
      const result = calculatePmcBonus(60.0, -5.0, 12000);
      expect(result.stepsFactor).toBeCloseTo(1.2, 5);
      expect(result.totalTp).toBe(7);
      expect(result.tpL).toBe(3);
      expect(result.tpM).toBe(2);
      expect(result.tpH).toBe(2);
    });

    it("CTL 80.0, TSB -20.0, 10000 steps → total 9, L:3 M:3 H:3", () => {
      const result = calculatePmcBonus(80.0, -20.0, 10000);
      expect(result.totalTp).toBe(9);
      expect(result.tpL).toBe(3);
      expect(result.tpM).toBe(3);
      expect(result.tpH).toBe(3);
    });

    it("CTL 90.0, TSB -30.0, 15000 steps → total 16, L:6 M:5 H:5", () => {
      const result = calculatePmcBonus(90.0, -30.0, 15000);
      expect(result.pmcFactor).toBeCloseTo(1.36, 1);
      expect(result.stepsFactor).toBe(1.5);
      expect(result.totalTp).toBe(16);
      expect(result.tpL).toBe(6);
      expect(result.tpM).toBe(5);
      expect(result.tpH).toBe(5);
    });
  });

  describe("TP distribution", () => {
    it("should always have tpL + tpM + tpH = totalTp", () => {
      for (let total = 0; total <= 20; total++) {
        // Construct a case that produces this total
        const result = calculatePmcBonus(100, -30, total * 10000 / 12);
        expect(result.tpL + result.tpM + result.tpH).toBe(result.totalTp);
      }
    });

    it("remainder should go to TP-L", () => {
      // Total 7: 7/3 = 2余1 → L:3, M:2, H:2
      const result = calculatePmcBonus(60.0, -5.0, 12000);
      expect(result.tpL).toBeGreaterThanOrEqual(result.tpM);
      expect(result.tpL).toBeGreaterThanOrEqual(result.tpH);
    });
  });
});
