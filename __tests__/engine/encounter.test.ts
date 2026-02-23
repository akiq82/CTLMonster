import {
  canEncounter,
  getEncounterCost,
  generateEnemy,
  generateBoss,
  canChallengeBoss,
  convertWpToEncounters,
  calculateRideWp,
} from "../../src/engine/encounter";
import { WP_CONSTANTS } from "../../src/types/battle";
import { WORLD_MAP } from "../../src/data/worlds";

function fixedRng(value: number): () => number {
  return () => value;
}

describe("Encounter Engine", () => {
  describe("canEncounter", () => {
    it("should require 2000 WP for normal encounter", () => {
      expect(canEncounter(2000, false)).toBe(true);
      expect(canEncounter(1999, false)).toBe(false);
    });

    it("should require 3000 WP for boss encounter", () => {
      expect(canEncounter(3000, true)).toBe(true);
      expect(canEncounter(2999, true)).toBe(false);
    });
  });

  describe("getEncounterCost", () => {
    it("normal = 2000, boss = 3000", () => {
      expect(getEncounterCost(false)).toBe(WP_CONSTANTS.ENCOUNTER_WP_COST);
      expect(getEncounterCost(true)).toBe(WP_CONSTANTS.BOSS_WP_COST);
      expect(getEncounterCost(false)).toBe(2000);
      expect(getEncounterCost(true)).toBe(3000);
    });
  });

  describe("generateEnemy", () => {
    it("should generate enemy within W1 stat ranges", () => {
      const world = WORLD_MAP.get(1)!;
      const enemy = generateEnemy(world.enemies, fixedRng(0));

      expect(enemy.currentHp).toBeGreaterThanOrEqual(15);
      expect(enemy.currentHp).toBeLessThanOrEqual(35);
      expect(enemy.atk).toBeGreaterThanOrEqual(5);
      expect(enemy.def).toBeGreaterThanOrEqual(3);
    });

    it("should set currentHp equal to maxHp", () => {
      const world = WORLD_MAP.get(1)!;
      const enemy = generateEnemy(world.enemies, fixedRng(0.5));
      expect(enemy.currentHp).toBe(enemy.maxHp);
    });
  });

  describe("generateBoss", () => {
    it("W1 boss should match GDD values", () => {
      const world = WORLD_MAP.get(1)!;
      const boss = generateBoss(world);

      expect(boss.currentHp).toBe(70);
      expect(boss.atk).toBe(20);
      expect(boss.def).toBe(15);
    });
  });

  describe("canChallengeBoss", () => {
    it("should require 10 kills", () => {
      expect(canChallengeBoss(9, 10)).toBe(false);
      expect(canChallengeBoss(10, 10)).toBe(true);
      expect(canChallengeBoss(15, 10)).toBe(true);
    });
  });

  describe("convertWpToEncounters", () => {
    it("should not convert when WP < 2000", () => {
      const result = convertWpToEncounters(1999);
      expect(result.encountersGained).toBe(0);
      expect(result.wpRemaining).toBe(1999);
    });

    it("should convert exactly once at WP = 2000", () => {
      const result = convertWpToEncounters(2000);
      expect(result.encountersGained).toBe(1);
      expect(result.wpRemaining).toBe(0);
    });

    it("should convert 3 times at WP = 6000", () => {
      const result = convertWpToEncounters(6000);
      expect(result.encountersGained).toBe(3);
      expect(result.wpRemaining).toBe(0);
    });

    it("should keep remainder WP after conversion", () => {
      const result = convertWpToEncounters(7500);
      expect(result.encountersGained).toBe(3);
      expect(result.wpRemaining).toBe(1500);
    });

    it("should return 0 encounters for WP = 0", () => {
      const result = convertWpToEncounters(0);
      expect(result.encountersGained).toBe(0);
      expect(result.wpRemaining).toBe(0);
    });

    it("no whiff: all encounters are confirmed battles", () => {
      // With 10000 WP, should get exactly 5 encounters (no misses)
      const result = convertWpToEncounters(10000);
      expect(result.encountersGained).toBe(5);
      expect(result.wpRemaining).toBe(0);
    });
  });

  describe("calculateRideWp", () => {
    it("should convert 40km ride to 10,000 WP", () => {
      expect(calculateRideWp(40, 0)).toBe(10000);
    });

    it("should convert 1,000m elevation to 10,000 WP", () => {
      expect(calculateRideWp(0, 1000)).toBe(10000);
    });

    it("should combine distance and elevation WP", () => {
      // 61km + 108m → 15,250 + 1,080 = 16,330 WP
      expect(calculateRideWp(61, 108)).toBe(15250 + 1080);
    });

    it("should handle zero values", () => {
      expect(calculateRideWp(0, 0)).toBe(0);
    });

    it("should floor fractional km", () => {
      // 10.5km → floor(10.5 × 250) = floor(2625) = 2625
      expect(calculateRideWp(10.5, 0)).toBe(2625);
    });

    it("should floor fractional elevation", () => {
      // 50.7m → floor(50.7 × 10) = floor(507) = 507
      expect(calculateRideWp(0, 50.7)).toBe(507);
    });
  });
});
