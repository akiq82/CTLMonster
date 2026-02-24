import {
  determineBranchType,
  meetsStatRequirements,
  meetsBossRequirement,
  canEvolve,
  getEvolutionTarget,
  applyEvolution,
} from "../../src/engine/evolution";
import { BranchType } from "../../src/types/monster";
import type { MonsterState } from "../../src/types/monster";
import type { WorldProgress } from "../../src/types/world";
import { MONSTER_DEFINITIONS } from "../../src/data/monsters";

function createTestMonster(overrides?: Partial<MonsterState>): MonsterState {
  return {
    name: "テスト",
    definitionId: "koromon",
    currentHp: 25,
    maxHp: 25,
    atk: 8,
    def: 6,
    discipline: 50,
    totalTpL: 0,
    totalTpM: 0,
    totalTpH: 0,
    bornAt: new Date().toISOString(),
    baseLifespan: 8,
    lifespanExtension: 0,
    generation: 1,
    evolutionHistory: [],
    memoryEquipment: null,
    mealsToday: 0,
    mealsYesterday: 0,
    mealBonusRemaining: 0,
    lastLoginAt: new Date().toISOString(),
    wins: 0,
    losses: 0,
    ...overrides,
  };
}

describe("Evolution Engine", () => {
  describe("determineBranchType", () => {
    it("TP-L dominant → HP type", () => {
      expect(determineBranchType(100, 30, 20)).toBe(BranchType.HP);
    });

    it("TP-M dominant → DEF type", () => {
      expect(determineBranchType(20, 100, 30)).toBe(BranchType.DEF);
    });

    it("TP-H dominant → ATK type", () => {
      expect(determineBranchType(20, 30, 100)).toBe(BranchType.ATK);
    });

    it("all equal (each ≥30%) → BALANCED type", () => {
      expect(determineBranchType(34, 33, 33)).toBe(BranchType.BALANCED);
    });

    it("each exactly 33.3% → BALANCED type", () => {
      expect(determineBranchType(100, 100, 100)).toBe(BranchType.BALANCED);
    });

    it("zero TP → defaults to HP", () => {
      expect(determineBranchType(0, 0, 0)).toBe(BranchType.HP);
    });

    it("two equal, one lower → picks first of the equal", () => {
      // L=50, M=50, H=10 → L >= M → HP
      expect(determineBranchType(50, 50, 10)).toBe(BranchType.HP);
    });
  });

  describe("meetsStatRequirements", () => {
    it("agumon→greymon condition (greymon's evolutionReq)", () => {
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      const req = targetDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: req.hp,
        atk: req.atk,
        def: req.def,
      });
      expect(meetsStatRequirements(monster, targetDef)).toBe(true);
    });

    it("should fail when HP is too low for evolution target", () => {
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      const req = targetDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: req.hp - 1,
        atk: req.atk,
        def: req.def,
      });
      expect(meetsStatRequirements(monster, targetDef)).toBe(false);
    });

    it("memory equipment stats should NOT count toward requirements (pure training only)", () => {
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      const req = targetDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: req.hp - 5,
        atk: req.atk - 2,
        def: req.def - 2,
        memoryEquipment: { name: "テストの記憶", hp: 5, atk: 2, def: 2 },
      });
      // Equipment is excluded from evolution checks
      expect(meetsStatRequirements(monster, targetDef)).toBe(false);
    });

    it("koromon→agumon condition (agumon's evolutionReq)", () => {
      const targetDef = MONSTER_DEFINITIONS.get("agumon")!;
      const req = targetDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: req.hp,
        atk: req.atk,
        def: req.def,
      });
      expect(meetsStatRequirements(monster, targetDef)).toBe(true);
    });
  });

  describe("meetsBossRequirement", () => {
    it("Baby I has no boss requirement → always true", () => {
      const def = MONSTER_DEFINITIONS.get("botamon")!;
      expect(meetsBossRequirement(def, new Map())).toBe(true);
    });

    it("agumon (target, no boss req) → always true", () => {
      const targetDef = MONSTER_DEFINITIONS.get("agumon")!;
      expect(meetsBossRequirement(targetDef, new Map())).toBe(true);
    });

    it("greymon (target, no boss req) → always true", () => {
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      // All evolution boss requirements removed in balance rewrite
      expect(meetsBossRequirement(targetDef, new Map())).toBe(true);
    });

    it("koromon (target, no boss req) → always true", () => {
      const targetDef = MONSTER_DEFINITIONS.get("koromon")!;
      expect(meetsBossRequirement(targetDef, new Map())).toBe(true);
    });
  });

  describe("canEvolve", () => {
    it("should return true when all conditions met (agumon → champion)", () => {
      const greymonDef = MONSTER_DEFINITIONS.get("greymon")!;
      const req = greymonDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: req.hp,
        atk: req.atk,
        def: req.def,
      });
      // No boss requirements in current balance
      expect(canEvolve(monster, new Map())).toBe(true);
    });

    it("should return true for koromon when stats met (agumon has no boss req)", () => {
      const agumonDef = MONSTER_DEFINITIONS.get("agumon")!;
      const req = agumonDef.evolutionRequirement!;
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: req.hp,
        atk: req.atk,
        def: req.def,
      });
      expect(canEvolve(monster, new Map())).toBe(true);
    });

    it("should return false for koromon when stats insufficient", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 30,
        atk: 10,
        def: 8,
      });
      expect(canEvolve(monster, new Map())).toBe(false);
    });

    it("should return false for mega stage (no evolution paths)", () => {
      const monster = createTestMonster({
        definitionId: "omegamon",
        maxHp: 15000,
        atk: 5000,
        def: 4000,
      });
      expect(canEvolve(monster, new Map())).toBe(false);
    });
  });

  describe("getEvolutionTarget", () => {
    it("HP-dominant TP → HP-type evolution", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        totalTpL: 100,
        totalTpM: 20,
        totalTpH: 10,
      });
      const target = getEvolutionTarget(monster);
      expect(target).not.toBeNull();
      expect(target!.branchType).toBe(BranchType.HP);
    });

    it("balanced TP → BALANCED-type evolution", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        totalTpL: 100,
        totalTpM: 100,
        totalTpH: 100,
      });
      const target = getEvolutionTarget(monster);
      expect(target).not.toBeNull();
      expect(target!.branchType).toBe(BranchType.BALANCED);
    });
  });

  describe("applyEvolution", () => {
    it("should update definitionId and record history", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 42,
        atk: 21,
        def: 20,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };

      applyEvolution(monster, target);

      expect(monster.definitionId).toBe("agumon");
      expect(monster.evolutionHistory).toContain("koromon");
    });

    it("should apply 20% boost of gap toward evolved form base stats", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 30,
        atk: 10,
        def: 8,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };
      const agumonDef = MONSTER_DEFINITIONS.get("agumon")!;

      const prevHp = monster.maxHp;
      const prevAtk = monster.atk;
      const prevDef = monster.def;

      applyEvolution(monster, target);

      // 20% of gap between current stats and target base
      const expectedHpBoost = Math.floor(Math.max(0, agumonDef.baseStats.hp - prevHp) * 0.2);
      const expectedAtkBoost = Math.floor(Math.max(0, agumonDef.baseStats.atk - prevAtk) * 0.2);
      const expectedDefBoost = Math.floor(Math.max(0, agumonDef.baseStats.def - prevDef) * 0.2);

      expect(monster.maxHp).toBe(prevHp + expectedHpBoost);
      expect(monster.atk).toBe(prevAtk + expectedAtkBoost);
      expect(monster.def).toBe(prevDef + expectedDefBoost);
    });

    it("should keep higher stats if already above base", () => {
      const agumonDef = MONSTER_DEFINITIONS.get("agumon")!;
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: agumonDef.baseStats.hp + 50,
        atk: agumonDef.baseStats.atk + 20,
        def: agumonDef.baseStats.def + 15,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };
      const expectedHp = monster.maxHp;
      const expectedAtk = monster.atk;
      const expectedDef = monster.def;

      applyEvolution(monster, target);

      expect(monster.maxHp).toBe(expectedHp);
      expect(monster.atk).toBe(expectedAtk);
      expect(monster.def).toBe(expectedDef);
    });

    it("should fully heal HP on evolution", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        currentHp: 1,
        maxHp: 50,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };

      applyEvolution(monster, target);

      expect(monster.currentHp).toBe(monster.maxHp);
    });
  });
});
