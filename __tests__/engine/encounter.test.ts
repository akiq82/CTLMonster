import {
  canEncounter,
  getEncounterCost,
  rollEncounter,
  generateEnemy,
  generateBoss,
  canChallengeBoss,
} from "../../src/engine/encounter";
import { WP_CONSTANTS } from "../../src/types/battle";
import { WORLD_MAP } from "../../src/data/worlds";

function fixedRng(value: number): () => number {
  return () => value;
}

describe("Encounter Engine", () => {
  describe("canEncounter", () => {
    it("should require 3000 WP for normal encounter", () => {
      expect(canEncounter(3000, false)).toBe(true);
      expect(canEncounter(2999, false)).toBe(false);
    });

    it("should require 5000 WP for boss encounter", () => {
      expect(canEncounter(5000, true)).toBe(true);
      expect(canEncounter(4999, true)).toBe(false);
    });
  });

  describe("getEncounterCost", () => {
    it("normal = 3000, boss = 5000", () => {
      expect(getEncounterCost(false)).toBe(WP_CONSTANTS.ENCOUNTER_WP_COST);
      expect(getEncounterCost(true)).toBe(WP_CONSTANTS.BOSS_WP_COST);
    });
  });

  describe("rollEncounter", () => {
    it("80% success rate for normal encounters", () => {
      expect(rollEncounter(false, fixedRng(0.79))).toBe(true);
      expect(rollEncounter(false, fixedRng(0.81))).toBe(false);
    });

    it("boss encounters always succeed", () => {
      expect(rollEncounter(true, fixedRng(0.99))).toBe(true);
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
    it("should require 15 kills", () => {
      expect(canChallengeBoss(14, 15)).toBe(false);
      expect(canChallengeBoss(15, 15)).toBe(true);
      expect(canChallengeBoss(20, 15)).toBe(true);
    });
  });
});
