import {
  rollBaseLifespan,
  rollMealLifespanExtension,
  isLifespanReached,
  isNeglectDeath,
  getHoursAbsent,
  calculateHpRegen,
  calculateNeglectHpPenalty,
  LIFESPAN_CONSTANTS,
} from "../../src/engine/lifespan";

function fixedRng(value: number): () => number {
  return () => value;
}

describe("Lifespan Engine", () => {
  describe("rollBaseLifespan", () => {
    it("should return 7 with rng=0", () => {
      expect(rollBaseLifespan(fixedRng(0))).toBe(7);
    });

    it("should return 9 with rng=0.999", () => {
      expect(rollBaseLifespan(fixedRng(0.999))).toBe(9);
    });
  });

  describe("rollMealLifespanExtension", () => {
    it("should extend +0.5 when rng < 0.2", () => {
      expect(rollMealLifespanExtension(fixedRng(0.19))).toBe(0.5);
    });

    it("should not extend when rng >= 0.2", () => {
      expect(rollMealLifespanExtension(fixedRng(0.21))).toBe(0);
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
});
