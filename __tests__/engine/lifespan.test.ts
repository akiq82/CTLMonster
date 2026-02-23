import {
  rollBaseLifespan,
  rollMealLifespanExtension,
  isLifespanReached,
  isNeglectDeath,
  getHoursAbsent,
  calculateHpRegen,
  calculateNeglectHpPenalty,
  getDeathCheckDay,
  shouldRunDeathCheck,
  LIFESPAN_CONSTANTS,
  BASE_LIFESPAN_BUCKETS,
  MEAL_EXTENSION_BUCKETS,
} from "../../src/engine/lifespan";

function fixedRng(value: number): () => number {
  return () => value;
}

/** 呼び出しごとに異なる値を返すRNG */
function sequenceRng(...values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("Lifespan Engine", () => {
  describe("rollBaseLifespan (weighted bucket distribution)", () => {
    it("should return value in first bucket (5.0-5.9) with rng≈0", () => {
      // rng=0.01 → 1st bucket (weight 0.05), rng=0.01 → near min of bucket
      const result = rollBaseLifespan(sequenceRng(0.01, 0.0));
      expect(result).toBeGreaterThanOrEqual(5.0);
      expect(result).toBeLessThanOrEqual(5.9);
    });

    it("should return value in middle buckets (6.5-7.4) with rng≈0.5", () => {
      // rng=0.5 → 4th bucket (cumulative 0.20+0.30=0.50→3rd, 0.80→4th)
      // weight 0.05+0.15+0.30 = 0.50, so 0.5 lands in 4th bucket (7.0-7.4)
      const result = rollBaseLifespan(sequenceRng(0.5, 0.5));
      expect(result).toBeGreaterThanOrEqual(6.5);
      expect(result).toBeLessThanOrEqual(7.4);
    });

    it("should return value in last bucket (8.0-9.0) with rng≈0.99", () => {
      const result = rollBaseLifespan(sequenceRng(0.99, 0.99));
      expect(result).toBeGreaterThanOrEqual(8.0);
      expect(result).toBeLessThanOrEqual(9.0);
    });

    it("should always return 0.1 precision", () => {
      for (let i = 0; i < 20; i++) {
        const result = rollBaseLifespan();
        const decimalPart = Math.round((result % 1) * 10) / 10;
        expect(decimalPart * 10 % 1).toBeCloseTo(0, 5);
      }
    });

    it("should always be within 5.0-9.0 range", () => {
      for (let i = 0; i < 50; i++) {
        const result = rollBaseLifespan();
        expect(result).toBeGreaterThanOrEqual(5.0);
        expect(result).toBeLessThanOrEqual(9.0);
      }
    });

    it("bucket weights should sum to 1.0", () => {
      const total = BASE_LIFESPAN_BUCKETS.reduce((s, b) => s + b.weight, 0);
      expect(total).toBeCloseTo(1.0, 10);
    });
  });

  describe("rollMealLifespanExtension (always extends, weighted distribution)", () => {
    it("should always return > 0 (every meal extends lifespan)", () => {
      for (let i = 0; i < 50; i++) {
        const result = rollMealLifespanExtension();
        expect(result).toBeGreaterThan(0);
      }
    });

    it("should return value in low range (0.03-0.05) with rng≈0", () => {
      const result = rollMealLifespanExtension(sequenceRng(0.01, 0.0));
      expect(result).toBeGreaterThanOrEqual(0.03);
      expect(result).toBeLessThanOrEqual(0.05);
    });

    it("should return value in high range (0.17-0.25) with rng≈0.99", () => {
      const result = rollMealLifespanExtension(sequenceRng(0.99, 0.99));
      expect(result).toBeGreaterThanOrEqual(0.17);
      expect(result).toBeLessThanOrEqual(0.25);
    });

    it("should always be within 0.03-0.25 range", () => {
      for (let i = 0; i < 50; i++) {
        const result = rollMealLifespanExtension();
        expect(result).toBeGreaterThanOrEqual(0.03);
        expect(result).toBeLessThanOrEqual(0.25);
      }
    });

    it("should return 0.01 precision", () => {
      for (let i = 0; i < 20; i++) {
        const result = rollMealLifespanExtension();
        const scaled = Math.round(result * 100);
        expect(scaled / 100).toBeCloseTo(result, 10);
      }
    });

    it("bucket weights should sum to 1.0", () => {
      const total = MEAL_EXTENSION_BUCKETS.reduce((s, b) => s + b.weight, 0);
      expect(total).toBeCloseTo(1.0, 10);
    });

    it("expected value should be approximately 0.11 days/meal (statistical)", () => {
      // Run many iterations and check average
      let sum = 0;
      const N = 10000;
      for (let i = 0; i < N; i++) {
        sum += rollMealLifespanExtension();
      }
      const avg = sum / N;
      // Expected ~0.112, allow ±0.02 for statistical variance
      expect(avg).toBeGreaterThan(0.09);
      expect(avg).toBeLessThan(0.14);
    });
  });

  describe("isLifespanReached", () => {
    it("should return false before lifespan ends", () => {
      const bornAt = new Date();
      bornAt.setDate(bornAt.getDate() - 6);
      expect(isLifespanReached(bornAt.toISOString(), 8, 0)).toBe(false);
    });

    it("should return true after lifespan ends", () => {
      const bornAt = new Date();
      bornAt.setDate(bornAt.getDate() - 9);
      expect(isLifespanReached(bornAt.toISOString(), 8, 0)).toBe(true);
    });

    it("should account for lifespan extension", () => {
      const bornAt = new Date();
      bornAt.setDate(bornAt.getDate() - 9);
      // 8 days base + 2 days extension = 10 days total
      expect(isLifespanReached(bornAt.toISOString(), 8, 2)).toBe(false);
    });

    it("should work with fractional lifespan values", () => {
      const bornAt = new Date();
      // 6.5 days ago
      const msAgo = 6.5 * 24 * 60 * 60 * 1000;
      const born = new Date(bornAt.getTime() - msAgo);
      // baseLifespan 6.0 + extension 0.8 = 6.8 total → still alive
      expect(isLifespanReached(born.toISOString(), 6.0, 0.8)).toBe(false);
      // baseLifespan 6.0 + extension 0.3 = 6.3 total → dead
      expect(isLifespanReached(born.toISOString(), 6.0, 0.3)).toBe(true);
    });
  });

  describe("isNeglectDeath", () => {
    it("should return false within 48 hours", () => {
      const lastLogin = new Date();
      lastLogin.setHours(lastLogin.getHours() - 47);
      expect(isNeglectDeath(lastLogin.toISOString())).toBe(false);
    });

    it("should return true after 48 hours", () => {
      const lastLogin = new Date();
      lastLogin.setHours(lastLogin.getHours() - 49);
      expect(isNeglectDeath(lastLogin.toISOString())).toBe(true);
    });
  });

  describe("getHoursAbsent", () => {
    it("should calculate correct hours", () => {
      const lastLogin = new Date();
      lastLogin.setHours(lastLogin.getHours() - 12);
      const hours = getHoursAbsent(lastLogin.toISOString());
      expect(hours).toBeCloseTo(12, 0);
    });
  });

  describe("calculateHpRegen", () => {
    it("should heal 10% per hour", () => {
      expect(calculateHpRegen(100, 1)).toBe(10);
      expect(calculateHpRegen(100, 3)).toBe(30);
    });

    it("should floor the result", () => {
      expect(calculateHpRegen(55, 1)).toBe(5);
    });
  });

  describe("calculateNeglectHpPenalty", () => {
    it("< 12 hours → no HP penalty", () => {
      expect(calculateNeglectHpPenalty(100, 11)).toBe(0);
    });

    it("12+ hours → 20% HP penalty", () => {
      expect(calculateNeglectHpPenalty(100, 12)).toBe(20);
    });

    it("24+ hours → 50% HP penalty", () => {
      expect(calculateNeglectHpPenalty(100, 24)).toBe(50);
    });
  });

  describe("getDeathCheckDay (JST 4:00 boundary)", () => {
    it("JST 3:59 → previous day", () => {
      // JST 2026-02-23 03:59 = UTC 2026-02-22 18:59
      const utc = new Date("2026-02-22T18:59:00Z");
      expect(getDeathCheckDay(utc)).toBe("2026-02-22");
    });

    it("JST 4:00 → current day", () => {
      // JST 2026-02-23 04:00 = UTC 2026-02-22 19:00
      const utc = new Date("2026-02-22T19:00:00Z");
      expect(getDeathCheckDay(utc)).toBe("2026-02-23");
    });

    it("JST 23:59 → current day", () => {
      // JST 2026-02-23 23:59 = UTC 2026-02-23 14:59
      const utc = new Date("2026-02-23T14:59:00Z");
      expect(getDeathCheckDay(utc)).toBe("2026-02-23");
    });

    it("JST 0:00 → previous day (before 4:00)", () => {
      // JST 2026-02-24 00:00 = UTC 2026-02-23 15:00
      const utc = new Date("2026-02-23T15:00:00Z");
      expect(getDeathCheckDay(utc)).toBe("2026-02-23");
    });
  });

  describe("shouldRunDeathCheck", () => {
    it("should return true when no previous check", () => {
      const utc = new Date("2026-02-22T19:00:00Z"); // JST 4:00
      expect(shouldRunDeathCheck("", utc)).toBe(true);
    });

    it("should return false when already checked today", () => {
      const utc = new Date("2026-02-22T20:00:00Z"); // JST 5:00 on 2/23
      expect(shouldRunDeathCheck("2026-02-23", utc)).toBe(false);
    });

    it("should return true when last check was yesterday", () => {
      const utc = new Date("2026-02-22T19:00:00Z"); // JST 4:00 on 2/23
      expect(shouldRunDeathCheck("2026-02-22", utc)).toBe(true);
    });

    it("should return true when crossing midnight into new death day", () => {
      // JST 2026-02-24 04:01 = UTC 2026-02-23 19:01
      const utc = new Date("2026-02-23T19:01:00Z");
      expect(shouldRunDeathCheck("2026-02-23", utc)).toBe(true);
    });
  });
});
