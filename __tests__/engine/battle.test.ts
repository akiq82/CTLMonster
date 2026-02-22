import {
  calculateSpeed,
  calculateHitRate,
  calculateEvasionRate,
  calculateDamage,
  determineFirstStrike,
  executeBattle,
} from "../../src/engine/battle";
import type { BattleFighter } from "../../src/types/battle";
import { BATTLE_CONSTANTS } from "../../src/types/battle";

function fixedRng(value: number): () => number {
  return () => value;
}

function createFighter(overrides?: Partial<BattleFighter>): BattleFighter {
  return {
    name: "Fighter",
    currentHp: 100,
    maxHp: 100,
    atk: 30,
    def: 20,
    discipline: 50,
    ...overrides,
  };
}

describe("Battle Engine", () => {
  describe("calculateSpeed", () => {
    it("SPD = (ATK + DEF) / 4", () => {
      expect(calculateSpeed(createFighter({ atk: 40, def: 20 }))).toBe(15);
    });
  });

  describe("calculateHitRate", () => {
    it("DISC 50 → 90% (base)", () => {
      expect(calculateHitRate(50)).toBeCloseTo(0.9, 5);
    });

    it("DISC 0 → 80%", () => {
      expect(calculateHitRate(0)).toBeCloseTo(0.8, 5);
    });

    it("DISC 100 → 100%", () => {
      expect(calculateHitRate(100)).toBeCloseTo(1.0, 5);
    });
  });

  describe("calculateEvasionRate", () => {
    it("DISC 50 → 5% (base)", () => {
      expect(calculateEvasionRate(50)).toBeCloseTo(0.05, 5);
    });

    it("DISC 0 → 0%", () => {
      expect(calculateEvasionRate(0)).toBeCloseTo(0.0, 5);
    });

    it("DISC 100 → 10%", () => {
      expect(calculateEvasionRate(100)).toBeCloseTo(0.1, 5);
    });
  });

  describe("calculateDamage", () => {
    it("should calculate base damage with mid-range random", () => {
      // ATK 30, DEF 20, random=0.5 → multiplier = 0.85+0.5*0.3 = 1.0
      // baseDmg = 30 * 1.0 = 30, actual = max(1, 30 - 20*0.4) = max(1, 22) = 22
      const dmg = calculateDamage(30, 20, false, fixedRng(0.5));
      expect(dmg).toBe(22);
    });

    it("should have minimum damage of 1", () => {
      const dmg = calculateDamage(1, 100, false, fixedRng(0));
      expect(dmg).toBe(1);
    });

    it("should apply 1.5× critical multiplier", () => {
      // ATK 30, random=0.5 → multiplier=1.0, base=30, crit=45
      // actual = max(1, 45 - 20*0.4) = max(1, 37) = 37
      const dmg = calculateDamage(30, 20, true, fixedRng(0.5));
      expect(dmg).toBe(37);
    });
  });

  describe("determineFirstStrike", () => {
    it("equal speed → 50% chance", () => {
      // With rng=0.49, should be first (0.5 > 0.49)
      expect(determineFirstStrike(10, 10, fixedRng(0.49))).toBe(true);
      // With rng=0.51, should not be first
      expect(determineFirstStrike(10, 10, fixedRng(0.51))).toBe(false);
    });

    it("much faster player → high chance of going first", () => {
      expect(determineFirstStrike(100, 10, fixedRng(0.9))).toBe(true);
    });
  });

  describe("executeBattle", () => {
    it("stronger player should win", () => {
      const player = createFighter({ atk: 50, def: 30, currentHp: 200, maxHp: 200 });
      const enemy = createFighter({ atk: 10, def: 5, currentHp: 30, maxHp: 30 });

      const result = executeBattle(player, enemy, fixedRng(0.5));
      expect(result.playerWon).toBe(true);
      expect(result.enemyRemainingHp).toBe(0);
      expect(result.playerRemainingHp).toBeGreaterThan(0);
    });

    it("player should survive with 1 HP on loss (GDD 7.1)", () => {
      const player = createFighter({ atk: 5, def: 2, currentHp: 20, maxHp: 20 });
      const enemy = createFighter({ atk: 50, def: 30, currentHp: 500, maxHp: 500 });

      const result = executeBattle(player, enemy, fixedRng(0.5));
      expect(result.playerWon).toBe(false);
      expect(result.playerRemainingHp).toBe(BATTLE_CONSTANTS.LOSS_REMAINING_HP);
    });

    it("should produce battle turns", () => {
      const player = createFighter();
      const enemy = createFighter();

      const result = executeBattle(player, enemy, fixedRng(0.5));
      expect(result.turns.length).toBeGreaterThan(0);
      expect(result.totalTurns).toBe(result.turns.length);
    });

    it("each turn should have 1 or 2 actions", () => {
      const player = createFighter();
      const enemy = createFighter();

      const result = executeBattle(player, enemy, fixedRng(0.5));
      for (const turn of result.turns) {
        expect(turn.actions.length).toBeGreaterThanOrEqual(1);
        expect(turn.actions.length).toBeLessThanOrEqual(2);
      }
    });
  });
});
