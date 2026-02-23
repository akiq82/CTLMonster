import {
  createMemoryEquipment,
  createNextGeneration,
  createFirstGeneration,
} from "../../src/engine/generation";
import type { MonsterState } from "../../src/types/monster";
import { MONSTER_DEFINITIONS, STARTER_MONSTER_IDS } from "../../src/data/monsters";

function fixedRng(value: number): () => number {
  return () => value;
}

function createTestMonster(overrides?: Partial<MonsterState>): MonsterState {
  return {
    name: "アグモン",
    definitionId: "agumon",
    currentHp: 170,
    maxHp: 170,
    atk: 56,
    def: 40,
    discipline: 55,
    totalTpL: 200,
    totalTpM: 80,
    totalTpH: 50,
    bornAt: new Date().toISOString(),
    baseLifespan: 8,
    lifespanExtension: 0,
    generation: 1,
    evolutionHistory: ["botamon", "koromon"],
    memoryEquipment: null,
    mealsToday: 0,
    mealsYesterday: 2,
    mealBonusRemaining: 0,
    lastLoginAt: new Date().toISOString(),
    wins: 10,
    losses: 3,
    ...overrides,
  };
}

describe("Generation Engine", () => {
  describe("createMemoryEquipment", () => {
    it("GDD 9.2 example: HP:170, ATK:56, DEF:40 → HP+34, ATK+11, DEF+8", () => {
      const monster = createTestMonster();
      const memory = createMemoryEquipment(monster);

      expect(memory.name).toBe("アグモンの記憶");
      expect(memory.hp).toBe(34); // floor(170 × 0.2)
      expect(memory.atk).toBe(11); // floor(56 × 0.2)
      expect(memory.def).toBe(8); // floor(40 × 0.2)
    });

    it("should include existing memory equipment in final stats", () => {
      const monster = createTestMonster({
        maxHp: 400,
        atk: 110,
        def: 85,
        memoryEquipment: { name: "前の記憶", hp: 34, atk: 11, def: 8 },
      });
      const memory = createMemoryEquipment(monster);

      // (400+34)×0.2 = 86.8 → 86
      expect(memory.hp).toBe(86);
      // (110+11)×0.2 = 24.2 → 24
      expect(memory.atk).toBe(24);
      // (85+8)×0.2 = 18.6 → 18
      expect(memory.def).toBe(18);
    });
  });

  describe("createNextGeneration", () => {
    it("should increment generation number", () => {
      const monster = createTestMonster({ generation: 3 });
      const next = createNextGeneration(monster, "次世代", fixedRng(0));
      expect(next.generation).toBe(4);
    });

    it("should equip memory from previous generation", () => {
      const monster = createTestMonster();
      const next = createNextGeneration(monster, "次世代", fixedRng(0));

      expect(next.memoryEquipment).not.toBeNull();
      expect(next.memoryEquipment!.hp).toBe(34);
      expect(next.memoryEquipment!.atk).toBe(11);
      expect(next.memoryEquipment!.def).toBe(8);
    });

    it("should start as a Baby I monster", () => {
      const monster = createTestMonster();
      const next = createNextGeneration(monster, "次世代", fixedRng(0));

      expect(STARTER_MONSTER_IDS).toContain(next.definitionId);
    });

    it("should reset all TP to 0", () => {
      const monster = createTestMonster();
      const next = createNextGeneration(monster, "次世代", fixedRng(0));

      expect(next.totalTpL).toBe(0);
      expect(next.totalTpM).toBe(0);
      expect(next.totalTpH).toBe(0);
    });

    it("should reset wins/losses", () => {
      const monster = createTestMonster();
      const next = createNextGeneration(monster, "次世代", fixedRng(0));

      expect(next.wins).toBe(0);
      expect(next.losses).toBe(0);
    });

    it("GDD 9.2: gen2 should have base+memory stats", () => {
      const monster = createTestMonster();
      const next = createNextGeneration(monster, "次世代", fixedRng(0));

      const starterDef = MONSTER_DEFINITIONS.get(next.definitionId)!;
      // Base stats + memory equipment gives effective stats
      const effectiveHp = next.maxHp + next.memoryEquipment!.hp;
      const effectiveAtk = next.atk + next.memoryEquipment!.atk;
      const effectiveDef = next.def + next.memoryEquipment!.def;

      expect(effectiveHp).toBe(starterDef.baseStats.hp + 34);
      expect(effectiveAtk).toBe(starterDef.baseStats.atk + 11);
      expect(effectiveDef).toBe(starterDef.baseStats.def + 8);
    });
  });

  describe("createFirstGeneration", () => {
    it("should create generation 1 with no memory", () => {
      const monster = createFirstGeneration("はじめてのモンスター", "botamon", fixedRng(0.5));

      expect(monster.generation).toBe(1);
      expect(monster.memoryEquipment).toBeNull();
      expect(monster.definitionId).toBe("botamon");
    });

    it("should have base stats from definition", () => {
      const monster = createFirstGeneration("テスト", "botamon", fixedRng(0.5));
      const def = MONSTER_DEFINITIONS.get("botamon")!;

      expect(monster.maxHp).toBe(def.baseStats.hp);
      expect(monster.atk).toBe(def.baseStats.atk);
      expect(monster.def).toBe(def.baseStats.def);
    });

    it("should throw for invalid starter ID", () => {
      expect(() => createFirstGeneration("テスト", "invalid", fixedRng(0))).toThrow();
    });
  });
});
