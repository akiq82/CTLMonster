import {
  calculateZonePseudoTss,
  calculatePseudoTssByIntensity,
  calculateWorkoutTp,
} from "../../src/engine/tp-calculator";
import { ZONE_IF_COEFFICIENTS } from "../../src/types/training";
import type { ZoneTime } from "../../src/types/training";

describe("TP Calculator", () => {
  describe("calculateZonePseudoTss", () => {
    it("should return 0 for 0 seconds", () => {
      expect(calculateZonePseudoTss(0, 1.0)).toBe(0);
    });

    it("should calculate correctly for 1 hour at IF=1.0 (Z4)", () => {
      // (3600 / 3600) × 1.0² × 100 = 100
      expect(calculateZonePseudoTss(3600, 1.0)).toBeCloseTo(100, 5);
    });

    it("should calculate correctly for 30 min at IF=0.55 (Z1)", () => {
      // (1800 / 3600) × 0.55² × 100 = 0.5 × 0.3025 × 100 = 15.125
      expect(calculateZonePseudoTss(1800, 0.55)).toBeCloseTo(15.125, 3);
    });
  });

  describe("calculatePseudoTssByIntensity", () => {
    it("should group zones correctly: Z1-Z2=low, Z3-Z4=mid, Z5-Z7=high", () => {
      const zoneTime: ZoneTime = {
        z1: 3600,
        z2: 0,
        z3: 0,
        z4: 0,
        z5: 0,
        z6: 0,
        z7: 0,
      };
      const result = calculatePseudoTssByIntensity(zoneTime);
      expect(result.low).toBeGreaterThan(0);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(0);
    });

    it("should calculate mid from Z3+Z4 only", () => {
      const zoneTime: ZoneTime = {
        z1: 0,
        z2: 0,
        z3: 3600,
        z4: 3600,
        z5: 0,
        z6: 0,
        z7: 0,
      };
      const result = calculatePseudoTssByIntensity(zoneTime);
      expect(result.low).toBe(0);
      expect(result.mid).toBeGreaterThan(0);
      expect(result.high).toBe(0);
    });

    it("should calculate high from Z5+Z6+Z7", () => {
      const zoneTime: ZoneTime = {
        z1: 0,
        z2: 0,
        z3: 0,
        z4: 0,
        z5: 3600,
        z6: 3600,
        z7: 3600,
      };
      const result = calculatePseudoTssByIntensity(zoneTime);
      expect(result.low).toBe(0);
      expect(result.mid).toBe(0);
      expect(result.high).toBeGreaterThan(0);
    });
  });

  describe("calculateWorkoutTp - TSS=TP with zone ratio distribution", () => {
    /**
     * 2/14 インターバルセッション (TSS=230)
     *
     * 擬似TSS: L≈84.2, M≈80.7, H≈57.9 → 合計≈222.8
     * 比率:    L=37.8%, M=36.2%, H=26.0%
     * TP:      L=floor(230×0.378)=86, M=floor(230×0.362)=83, H=floor(230×0.260)=59
     */
    it("2/14 interval (TSS=230): zone ratio distribution", () => {
      const zoneTime: ZoneTime = {
        z1: 3616,
        z2: 3443,
        z3: 1548,
        z4: 1653,
        z5: 705,
        z6: 777,
        z7: 66,
      };

      const result = calculateWorkoutTp(zoneTime, 230);

      expect(result.low).toBe(86);
      expect(result.mid).toBe(83);
      expect(result.high).toBe(59);
      // 合計はTSSに近い (floorの切り捨てで若干少なくなる)
      expect(result.low + result.mid + result.high).toBeLessThanOrEqual(230);
      expect(result.low + result.mid + result.high).toBeGreaterThanOrEqual(225);
    });

    /**
     * 2/17 VO2 30-30セッション (TSS=43)
     *
     * 擬似TSS: L≈25.2, M≈0.8, H≈45.5 → 合計≈71.5
     * 比率:    L=35.2%, M=1.1%, H=63.6%
     * TP:      L=floor(43×0.352)=15, M=floor(43×0.011)=0, H=floor(43×0.636)=27
     */
    it("2/17 VO2 30-30 (TSS=43): high-intensity dominant", () => {
      const zoneTime: ZoneTime = {
        z1: 2380,
        z2: 333,
        z3: 36,
        z4: 0,
        z5: 893,
        z6: 250,
        z7: 117,
      };

      const pseudoTss = calculatePseudoTssByIntensity(zoneTime);
      expect(pseudoTss.low).toBeCloseTo(25.2, 0);
      expect(pseudoTss.mid).toBeCloseTo(0.8, 0);
      expect(pseudoTss.high).toBeCloseTo(45.5, 0);

      const result = calculateWorkoutTp(zoneTime, 43);
      expect(result.low).toBe(15);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(27);
      expect(result.low + result.mid + result.high).toBeLessThanOrEqual(43);
    });

    /**
     * 2/21 60kmエンデュランス (TSS=97)
     *
     * 擬似TSS: L≈90.5, M≈21.7, H≈1.8 → 合計≈114.0
     * 比率:    L=79.4%, M=19.0%, H=1.6%
     * TP:      L=floor(97×0.794)=76, M=floor(97×0.190)=18, H=floor(97×0.016)=1
     */
    it("2/21 60km endurance (TSS=97): low-intensity dominant", () => {
      const zoneTime: ZoneTime = {
        z1: 6545,
        z2: 2272,
        z3: 800,
        z4: 133,
        z5: 54,
        z6: 0,
        z7: 0,
      };

      const pseudoTss = calculatePseudoTssByIntensity(zoneTime);
      expect(pseudoTss.low).toBeCloseTo(90.5, 0);
      expect(pseudoTss.mid).toBeCloseTo(21.7, 0);
      expect(pseudoTss.high).toBeCloseTo(1.8, 0);

      const result = calculateWorkoutTp(zoneTime, 97);
      expect(result.low).toBe(76);
      expect(result.mid).toBe(18);
      expect(result.high).toBe(1);
      expect(result.low + result.mid + result.high).toBeLessThanOrEqual(97);
    });

    it("TSS=TP: total TP should approximate actual TSS", () => {
      // エンデュランス: TSS=97 → TP合計 95 (≈97)
      const endurance: ZoneTime = {
        z1: 6545, z2: 2272, z3: 800, z4: 133, z5: 54, z6: 0, z7: 0,
      };
      const endResult = calculateWorkoutTp(endurance, 97);
      const endTotal = endResult.low + endResult.mid + endResult.high;
      expect(endTotal).toBeGreaterThanOrEqual(93);
      expect(endTotal).toBeLessThanOrEqual(97);

      // インターバル: TSS=230 → TP合計 228 (≈230)
      const interval: ZoneTime = {
        z1: 3616, z2: 3443, z3: 1548, z4: 1653, z5: 705, z6: 777, z7: 66,
      };
      const intResult = calculateWorkoutTp(interval, 230);
      const intTotal = intResult.low + intResult.mid + intResult.high;
      expect(intTotal).toBeGreaterThanOrEqual(225);
      expect(intTotal).toBeLessThanOrEqual(230);
    });
  });

  describe("edge cases", () => {
    it("all zeros should return zero TP", () => {
      const zoneTime: ZoneTime = {
        z1: 0, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime, 100);
      expect(result.low).toBe(0);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(0);
    });

    it("TSS=0 should return zero TP", () => {
      const zoneTime: ZoneTime = {
        z1: 3600, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime, 0);
      expect(result.low).toBe(0);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(0);
    });

    it("should always return non-negative integers", () => {
      const zoneTime: ZoneTime = {
        z1: 100, z2: 200, z3: 50, z4: 30, z5: 10, z6: 5, z7: 1,
      };
      const result = calculateWorkoutTp(zoneTime, 50);
      expect(result.low).toBeGreaterThanOrEqual(0);
      expect(result.mid).toBeGreaterThanOrEqual(0);
      expect(result.high).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(result.low)).toBe(true);
      expect(Number.isInteger(result.mid)).toBe(true);
      expect(Number.isInteger(result.high)).toBe(true);
    });

    it("should use floor rounding (not round or ceil)", () => {
      // Z1 only: pseudo-TSS = 30.25, ratio = 100% low
      // TSS=30 → L = floor(30 × 1.0) = 30
      const zoneTime: ZoneTime = {
        z1: 3600, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime, 30);
      expect(result.low).toBe(30);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(0);
    });

    it("single zone with TSS should get all TP in that category", () => {
      // Z4 only → all mid
      const zoneTime: ZoneTime = {
        z1: 0, z2: 0, z3: 0, z4: 3600, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime, 100);
      expect(result.low).toBe(0);
      expect(result.mid).toBe(100);
      expect(result.high).toBe(0);
    });
  });
});
