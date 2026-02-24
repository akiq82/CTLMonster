import { WORLD_DEFINITIONS, WORLD_MAP } from "../../src/data/worlds";
import { WORLD_CONSTANTS } from "../../src/types/world";
import { MONSTER_DEFINITIONS } from "../../src/data/monsters";

describe("World Definitions", () => {
  it("should have exactly 10 worlds", () => {
    expect(WORLD_DEFINITIONS).toHaveLength(10);
    expect(WORLD_MAP.size).toBe(10);
  });

  it("should have world numbers 1 through 10 in order", () => {
    for (let i = 0; i < WORLD_DEFINITIONS.length; i++) {
      expect(WORLD_DEFINITIONS[i].worldNumber).toBe(i + 1);
    }
  });

  it("every world should require 10 kills", () => {
    for (const world of WORLD_DEFINITIONS) {
      expect(world.requiredKills).toBe(WORLD_CONSTANTS.REQUIRED_KILLS);
    }
  });

  it("every world should have at least 9 enemy types", () => {
    for (const world of WORLD_DEFINITIONS) {
      expect(world.enemies.length).toBeGreaterThanOrEqual(9);
    }
  });

  it("every world should have exactly 12 enemy entries", () => {
    for (const world of WORLD_DEFINITIONS) {
      expect(world.enemies.length).toBe(12);
    }
  });

  it("all enemy monsterIds should reference valid monster definitions", () => {
    for (const world of WORLD_DEFINITIONS) {
      for (const enemy of world.enemies) {
        expect(MONSTER_DEFINITIONS.has(enemy.monsterId)).toBe(true);
      }
      expect(MONSTER_DEFINITIONS.has(world.boss.monsterId)).toBe(true);
    }
  });

  it("enemy stat ranges should have min <= max", () => {
    for (const world of WORLD_DEFINITIONS) {
      for (const enemy of world.enemies) {
        expect(enemy.hp.min).toBeLessThanOrEqual(enemy.hp.max);
        expect(enemy.atk.min).toBeLessThanOrEqual(enemy.atk.max);
        expect(enemy.def.min).toBeLessThanOrEqual(enemy.def.max);
      }
    }
  });

  it("enemy difficulty should scale across worlds (mob HP min increases)", () => {
    for (let i = 1; i < WORLD_DEFINITIONS.length; i++) {
      const prevMinHp = Math.min(
        ...WORLD_DEFINITIONS[i - 1].enemies.map((e) => e.hp.min)
      );
      const currMinHp = Math.min(
        ...WORLD_DEFINITIONS[i].enemies.map((e) => e.hp.min)
      );
      expect(currMinHp).toBeGreaterThan(prevMinHp);
    }
  });

  it("boss HP should scale across worlds", () => {
    for (let i = 1; i < WORLD_DEFINITIONS.length; i++) {
      expect(WORLD_DEFINITIONS[i].boss.hp).toBeGreaterThan(
        WORLD_DEFINITIONS[i - 1].boss.hp
      );
    }
  });

  describe("Boss stat verification (20% evo boost rebalance)", () => {
    const bossExpected = [
      { world: 1, hp: 60, atk: 15, def: 10 },
      { world: 2, hp: 108, atk: 26, def: 20 },
      { world: 3, hp: 150, atk: 39, def: 30 },
      { world: 4, hp: 230, atk: 45, def: 38 },
      { world: 5, hp: 249, atk: 50, def: 40 },
      { world: 6, hp: 398, atk: 75, def: 59 },
      { world: 7, hp: 502, atk: 91, def: 55 },
      { world: 8, hp: 701, atk: 120, def: 75 },
      { world: 9, hp: 852, atk: 151, def: 89 },
      { world: 10, hp: 1001, atk: 175, def: 111 },
    ];

    for (const expected of bossExpected) {
      it(`W${expected.world} boss: HP=${expected.hp}, ATK=${expected.atk}, DEF=${expected.def}`, () => {
        const world = WORLD_MAP.get(expected.world)!;
        expect(world.boss.hp).toBe(expected.hp);
        expect(world.boss.atk).toBe(expected.atk);
        expect(world.boss.def).toBe(expected.def);
      });
    }
  });

  describe("Mob stat range verification (20% evo boost rebalance)", () => {
    const mobRanges = [
      { world: 1, hpMin: 13, hpMax: 30, atkMin: 4, atkMax: 9, defMin: 2, defMax: 6 },
      { world: 2, hpMin: 24, hpMax: 54, atkMin: 9, atkMax: 17, defMin: 6, defMax: 13 },
      { world: 3, hpMin: 34, hpMax: 77, atkMin: 13, atkMax: 26, defMin: 9, defMax: 18 },
      { world: 4, hpMin: 57, hpMax: 124, atkMin: 16, atkMax: 31, defMin: 13, defMax: 25 },
      { world: 5, hpMin: 75, hpMax: 150, atkMin: 17, atkMax: 33, defMin: 14, defMax: 26 },
      { world: 6, hpMin: 110, hpMax: 221, atkMin: 28, atkMax: 53, defMin: 22, defMax: 40 },
      { world: 7, hpMin: 141, hpMax: 282, atkMin: 33, atkMax: 62, defMin: 21, defMax: 38 },
      { world: 8, hpMin: 204, hpMax: 383, atkMin: 49, atkMax: 87, defMin: 30, defMax: 52 },
      { world: 9, hpMin: 265, hpMax: 473, atkMin: 66, atkMax: 117, defMin: 37, defMax: 66 },
      { world: 10, hpMin: 300, hpMax: 534, atkMin: 78, atkMax: 137, defMin: 48, defMax: 85 },
    ];

    for (const range of mobRanges) {
      it(`W${range.world} mob stats should fall within expected ranges`, () => {
        const world = WORLD_MAP.get(range.world)!;
        const allHpMin = Math.min(...world.enemies.map((e) => e.hp.min));
        const allHpMax = Math.max(...world.enemies.map((e) => e.hp.max));
        const allAtkMin = Math.min(...world.enemies.map((e) => e.atk.min));
        const allAtkMax = Math.max(...world.enemies.map((e) => e.atk.max));
        const allDefMin = Math.min(...world.enemies.map((e) => e.def.min));
        const allDefMax = Math.max(...world.enemies.map((e) => e.def.max));

        expect(allHpMin).toBe(range.hpMin);
        expect(allHpMax).toBe(range.hpMax);
        expect(allAtkMin).toBe(range.atkMin);
        expect(allAtkMax).toBe(range.atkMax);
        expect(allDefMin).toBe(range.defMin);
        expect(allDefMax).toBe(range.defMax);
      });
    }
  });
});
