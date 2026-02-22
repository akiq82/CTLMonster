import {
  createInitialWorldProgress,
  recordMobKill,
  recordBossDefeat,
  canChallengeBoss,
  getAvailableWorlds,
  getWorldDefinition,
  getWorldProgressRate,
} from "../../src/engine/world";
import type { WorldProgress } from "../../src/types/world";

describe("World Engine", () => {
  describe("createInitialWorldProgress", () => {
    it("should start at W1 with 0 kills", () => {
      const progress = createInitialWorldProgress();
      expect(progress.worldNumber).toBe(1);
      expect(progress.killCount).toBe(0);
      expect(progress.bossDefeated).toBe(false);
    });
  });

  describe("recordMobKill", () => {
    it("should increment kill count", () => {
      let progress = createInitialWorldProgress();
      progress = recordMobKill(progress);
      expect(progress.killCount).toBe(1);
      progress = recordMobKill(progress);
      expect(progress.killCount).toBe(2);
    });

    it("should not mutate original", () => {
      const original = createInitialWorldProgress();
      const updated = recordMobKill(original);
      expect(original.killCount).toBe(0);
      expect(updated.killCount).toBe(1);
    });
  });

  describe("recordBossDefeat", () => {
    it("should mark boss as defeated", () => {
      let progress = createInitialWorldProgress();
      progress = recordBossDefeat(progress);
      expect(progress.bossDefeated).toBe(true);
    });
  });

  describe("canChallengeBoss", () => {
    it("should require 15 kills and boss not yet defeated", () => {
      expect(canChallengeBoss({ worldNumber: 1, killCount: 14, bossDefeated: false })).toBe(false);
      expect(canChallengeBoss({ worldNumber: 1, killCount: 15, bossDefeated: false })).toBe(true);
    });

    it("should return false if boss already defeated", () => {
      expect(canChallengeBoss({ worldNumber: 1, killCount: 15, bossDefeated: true })).toBe(false);
    });
  });

  describe("getAvailableWorlds", () => {
    it("W1 always available even with empty progress", () => {
      expect(getAvailableWorlds(new Map())).toEqual([1]);
    });

    it("W2 available after W1 boss defeated", () => {
      const progress = new Map<number, WorldProgress>([
        [1, { worldNumber: 1, killCount: 15, bossDefeated: true }],
      ]);
      expect(getAvailableWorlds(progress)).toEqual([1, 2]);
    });

    it("W1-W4 available after W1-W3 cleared", () => {
      const progress = new Map<number, WorldProgress>([
        [1, { worldNumber: 1, killCount: 15, bossDefeated: true }],
        [2, { worldNumber: 2, killCount: 15, bossDefeated: true }],
        [3, { worldNumber: 3, killCount: 15, bossDefeated: true }],
      ]);
      expect(getAvailableWorlds(progress)).toEqual([1, 2, 3, 4]);
    });

    it("should not go beyond W8", () => {
      const progress = new Map<number, WorldProgress>();
      for (let i = 1; i <= 8; i++) {
        progress.set(i, { worldNumber: i, killCount: 15, bossDefeated: true });
      }
      const available = getAvailableWorlds(progress);
      expect(available[available.length - 1]).toBe(8);
    });
  });

  describe("getWorldDefinition", () => {
    it("should return valid world for 1-8", () => {
      for (let i = 1; i <= 8; i++) {
        const world = getWorldDefinition(i);
        expect(world.worldNumber).toBe(i);
      }
    });

    it("should throw for invalid world number", () => {
      expect(() => getWorldDefinition(0)).toThrow();
      expect(() => getWorldDefinition(9)).toThrow();
    });
  });

  describe("getWorldProgressRate", () => {
    it("0 kills → 0%", () => {
      expect(getWorldProgressRate({ worldNumber: 1, killCount: 0, bossDefeated: false })).toBe(0);
    });

    it("boss defeated → 100%", () => {
      expect(getWorldProgressRate({ worldNumber: 1, killCount: 15, bossDefeated: true })).toBe(1.0);
    });

    it("halfway through mobs → ~50%", () => {
      const rate = getWorldProgressRate({ worldNumber: 1, killCount: 8, bossDefeated: false });
      expect(rate).toBeCloseTo(0.5, 1);
    });
  });
});
