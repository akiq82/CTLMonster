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
      // Only Z1 has time, so only low should have a value
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

  describe("calculateWorkoutTp - GDD concrete examples", () => {
    /**
     * GDD 2/14 インターバルセッション (TSS=230, IF=0.84)
     *
     * | Zone | Seconds | IF   | pseudo-TSS |
     * |------|---------|------|------------|
     * | Z1   | 3616    | 0.55 | 30.4       |
     * | Z2   | 3443    | 0.75 | 53.8       |
     * | Z3   | 1548    | 0.90 | 34.8       |
     * | Z4   | 1653    | 1.00 | 45.9       |
     * | Z5   | 705     | 1.10 | 23.7       |
     * | Z6   | 777     | 1.20 | 31.1       |
     * | Z7   | 66      | 1.30 | 3.1        |
     *
     * TP-L = floor(84.2 × 0.6) = 50
     * TP-M = floor(80.7 × 0.8) = 64
     * TP-H = floor(57.9 × 1.0) = 57
     * Total = 171
     */
    it("2/14 interval session: TP-L=50, TP-M=64, TP-H=57 (total 171)", () => {
      const zoneTime: ZoneTime = {
        z1: 3616,
        z2: 3443,
        z3: 1548,
        z4: 1653,
        z5: 705,
        z6: 777,
        z7: 66,
      };

      const result = calculateWorkoutTp(zoneTime);

      expect(result.low).toBe(50);
      expect(result.mid).toBe(64);
      expect(result.high).toBe(57);
      expect(result.low + result.mid + result.high).toBe(171);
    });

    /**
     * GDD 2/17 VO2 30-30セッション (TSS=43, IF=0.91)
     *
     * TP-L = floor(25.2 × 0.6) = 15
     * TP-M = floor(0.8 × 0.8) = 0
     * TP-H = floor(45.5 × 1.0) = 45
     * Total = 60
     */
    it("2/17 VO2 30-30 session: TP-L=15, TP-M=0, TP-H=45 (total 60)", () => {
      // We need to reverse-engineer zone times from pseudo-TSS values
      // TP-L: pseudo-TSS 25.2 → need Z1+Z2 seconds
      // TP-M: pseudo-TSS 0.8 → need Z3+Z4 seconds
      // TP-H: pseudo-TSS 45.5 → need Z5+Z6+Z7 seconds
      //
      // Use specific zone times that produce the GDD's pseudo-TSS values.
      // From the GDD context, this is a VO2 session so most time is in Z1 (warmup) + Z5-Z7.
      //
      // Z1: pseudo-TSS ≈ 20 → seconds = 20 / (0.55² × 100) × 3600 = 20/30.25 × 3600 ≈ 2380
      // Z2: pseudo-TSS ≈ 5.2 → seconds = 5.2 / (0.75² × 100) × 3600 = 5.2/56.25 × 3600 ≈ 333
      // Z3: pseudo-TSS ≈ 0.8 → seconds = 0.8 / (0.90² × 100) × 3600 = 0.8/81 × 3600 ≈ 36
      // Z4: pseudo-TSS ≈ 0 → 0 seconds
      // Z5: pseudo-TSS ≈ 30 → seconds = 30 / (1.10² × 100) × 3600 = 30/121 × 3600 ≈ 893
      // Z6: pseudo-TSS ≈ 10 → seconds = 10 / (1.20² × 100) × 3600 = 10/144 × 3600 ≈ 250
      // Z7: pseudo-TSS ≈ 5.5 → seconds = 5.5 / (1.30² × 100) × 3600 = 5.5/169 × 3600 ≈ 117

      // Verify by computing: we need exact values that produce floor results of 15, 0, 45
      // Let's pick values that give us the GDD's pseudo-TSS totals
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

      // Verify pseudo-TSS are in the right ballpark
      expect(pseudoTss.low).toBeCloseTo(25.2, 0);
      expect(pseudoTss.mid).toBeCloseTo(0.8, 0);
      expect(pseudoTss.high).toBeCloseTo(45.5, 0);

      const result = calculateWorkoutTp(zoneTime);
      expect(result.low).toBe(15);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(45);
      expect(result.low + result.mid + result.high).toBe(60);
    });

    /**
     * GDD 2/21 60kmエンデュランス (TSS=97, IF=0.64)
     *
     * TP-L = floor(90.5 × 0.6) = 54
     * TP-M = floor(21.7 × 0.8) = 17
     * TP-H = floor(1.8 × 1.0) = 1
     * Total = 72
     */
    it("2/21 60km endurance: TP-L=54, TP-M=17, TP-H=1 (total 72)", () => {
      // Endurance ride: mostly Z1-Z2 with some Z3
      // Z1: pseudo-TSS ≈ 55 → seconds = 55 / 30.25 × 3600 ≈ 6545
      // Z2: pseudo-TSS ≈ 35.5 → seconds = 35.5 / 56.25 × 3600 ≈ 2272
      // Z3: pseudo-TSS ≈ 18 → seconds = 18 / 81 × 3600 ≈ 800
      // Z4: pseudo-TSS ≈ 3.7 → seconds = 3.7 / 100 × 3600 = 133
      // Z5: pseudo-TSS ≈ 1.8 → seconds = 1.8 / 121 × 3600 ≈ 54
      // Z6: 0
      // Z7: 0
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

      const result = calculateWorkoutTp(zoneTime);
      expect(result.low).toBe(54);
      expect(result.mid).toBe(17);
      expect(result.high).toBe(1);
      expect(result.low + result.mid + result.high).toBe(72);
    });
  });

  describe("edge cases", () => {
    it("all zeros should return zero TP", () => {
      const zoneTime: ZoneTime = {
        z1: 0, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime);
      expect(result.low).toBe(0);
      expect(result.mid).toBe(0);
      expect(result.high).toBe(0);
    });

    it("should always return non-negative integers", () => {
      const zoneTime: ZoneTime = {
        z1: 100, z2: 200, z3: 50, z4: 30, z5: 10, z6: 5, z7: 1,
      };
      const result = calculateWorkoutTp(zoneTime);
      expect(result.low).toBeGreaterThanOrEqual(0);
      expect(result.mid).toBeGreaterThanOrEqual(0);
      expect(result.high).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(result.low)).toBe(true);
      expect(Number.isInteger(result.mid)).toBe(true);
      expect(Number.isInteger(result.high)).toBe(true);
    });

    it("should use floor rounding (not round or ceil)", () => {
      // 1 hour Z1: pseudo-TSS = 0.55² × 100 = 30.25
      // TP-L = floor(30.25 × 0.6) = floor(18.15) = 18
      const zoneTime: ZoneTime = {
        z1: 3600, z2: 0, z3: 0, z4: 0, z5: 0, z6: 0, z7: 0,
      };
      const result = calculateWorkoutTp(zoneTime);
      expect(result.low).toBe(18);
    });
  });
});
