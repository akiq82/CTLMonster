import {
  calculateDailyDisciplineChange,
  calculateNeglectPenalty,
  applyDisciplineChange,
} from "../../src/engine/discipline";
import { PmcRank } from "../../src/types/ride-metrics";

function fixedRng(value: number): () => number {
  return () => value;
}

describe("Discipline Engine", () => {
  describe("calculateDailyDisciplineChange - GDD 4.2 table", () => {
    it("Rank A, 3 meals → +5 to +8", () => {
      const min = calculateDailyDisciplineChange(PmcRank.A, 3, fixedRng(0));
      const max = calculateDailyDisciplineChange(PmcRank.A, 3, fixedRng(0.999));
      expect(min).toBe(5);
      expect(max).toBe(8);
    });

    it("Rank A, 0 meals → -1 to +1", () => {
      const min = calculateDailyDisciplineChange(PmcRank.A, 0, fixedRng(0));
      const max = calculateDailyDisciplineChange(PmcRank.A, 0, fixedRng(0.999));
      expect(min).toBe(-1);
      expect(max).toBe(1);
    });

    it("Rank D, 0 meals → -4 to -2", () => {
      const min = calculateDailyDisciplineChange(PmcRank.D, 0, fixedRng(0));
      const max = calculateDailyDisciplineChange(PmcRank.D, 0, fixedRng(0.999));
      expect(min).toBe(-4);
      expect(max).toBe(-2);
    });

    it("Rank C, 2 meals → 0 to +2", () => {
      const min = calculateDailyDisciplineChange(PmcRank.C, 2, fixedRng(0));
      const max = calculateDailyDisciplineChange(PmcRank.C, 2, fixedRng(0.999));
      expect(min).toBe(0);
      expect(max).toBe(2);
    });

    it("meal count should be clamped to 0-3", () => {
      // 5 meals → treated as 3
      const val = calculateDailyDisciplineChange(PmcRank.A, 5, fixedRng(0));
      const expected = calculateDailyDisciplineChange(PmcRank.A, 3, fixedRng(0));
      expect(val).toBe(expected);
    });
  });

  describe("calculateNeglectPenalty - GDD 8.3", () => {
    it("< 8 hours → no penalty", () => {
      expect(calculateNeglectPenalty(7)).toBe(0);
    });

    it("8+ hours → -5 to -10", () => {
      const min = calculateNeglectPenalty(8, fixedRng(0));
      const max = calculateNeglectPenalty(8, fixedRng(0.999));
      expect(min).toBe(-10);
      expect(max).toBe(-5);
    });

    it("12+ hours → -10 to -15", () => {
      const min = calculateNeglectPenalty(12, fixedRng(0));
      const max = calculateNeglectPenalty(12, fixedRng(0.999));
      expect(min).toBe(-15);
      expect(max).toBe(-10);
    });

    it("24+ hours → -20", () => {
      expect(calculateNeglectPenalty(24)).toBe(-20);
      expect(calculateNeglectPenalty(47)).toBe(-20);
    });
  });

  describe("applyDisciplineChange", () => {
    it("should apply positive change", () => {
      expect(applyDisciplineChange(50, 5)).toBe(55);
    });

    it("should apply negative change", () => {
      expect(applyDisciplineChange(50, -10)).toBe(40);
    });

    it("should clamp to 0 minimum", () => {
      expect(applyDisciplineChange(5, -20)).toBe(0);
    });

    it("should clamp to 100 maximum", () => {
      expect(applyDisciplineChange(95, 10)).toBe(100);
    });
  });
});
