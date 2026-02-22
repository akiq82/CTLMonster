import { WORLD_DEFINITIONS, WORLD_MAP } from "../../src/data/worlds";
import { WORLD_CONSTANTS } from "../../src/types/world";
import { MONSTER_DEFINITIONS } from "../../src/data/monsters";

describe("World Definitions", () => {
  it("should have exactly 8 worlds", () => {
    expect(WORLD_DEFINITIONS).toHaveLength(8);
    expect(WORLD_MAP.size).toBe(8);
  });

  it("should have world numbers 1 through 8 in order", () => {
    for (let i = 0; i < WORLD_DEFINITIONS.length; i++) {
      expect(WORLD_DEFINITIONS[i].worldNumber).toBe(i + 1);
    }
  });

  it("every world should require 15 kills", () => {
    for (const world of WORLD_DEFINITIONS) {
      expect(world.requiredKills).toBe(WORLD_CONSTANTS.REQUIRED_KILLS);
    }
  });

  it("every world should have at least 2 enemy types", () => {
    for (const world of WORLD_DEFINITIONS) {
      expect(world.enemies.length).toBeGreaterThanOrEqual(2);
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

  describe("GDD 7.3 boss stat verification", () => {
    const bossExpected = [
      { world: 1, hp: 70, atk: 20, def: 15 },
      { world: 2, hp: 180, atk: 45, def: 35 },
      { world: 3, hp: 350, atk: 85, def: 65 },
      { world: 4, hp: 650, atk: 145, def: 115 },
      { world: 5, hp: 1000, atk: 250, def: 200 },
      { world: 6, hp: 1800, atk: 400, def: 330 },
      { world: 7, hp: 3200, atk: 700, def: 560 },
      { world: 8, hp: 5500, atk: 1100, def: 900 },
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

  describe("GDD 7.3 mob stat range verification", () => {
    const mobRanges = [
      { world: 1, hpMin: 15, hpMax: 35, atkMin: 5, atkMax: 12, defMin: 3, defMax: 8 },
      { world: 2, hpMin: 40, hpMax: 90, atkMin: 15, atkMax: 30, defMin: 10, defMax: 22 },
      { world: 3, hpMin: 80, hpMax: 180, atkMin: 28, atkMax: 55, defMin: 20, defMax: 40 },
      { world: 4, hpMin: 160, hpMax: 350, atkMin: 50, atkMax: 100, defMin: 40, defMax: 75 },
      { world: 5, hpMin: 300, hpMax: 600, atkMin: 90, atkMax: 170, defMin: 70, defMax: 130 },
      { world: 6, hpMin: 500, hpMax: 1000, atkMin: 150, atkMax: 280, defMin: 120, defMax: 220 },
      { world: 7, hpMin: 900, hpMax: 1800, atkMin: 260, atkMax: 480, defMin: 210, defMax: 380 },
      { world: 8, hpMin: 1600, hpMax: 3000, atkMin: 450, atkMax: 800, defMin: 360, defMax: 620 },
    ];

    for (const range of mobRanges) {
      it(`W${range.world} mob stats should fall within GDD ranges`, () => {
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
