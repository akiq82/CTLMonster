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
    it("agumon→greymon condition: HP≥130, ATK≥40, DEF≥30 (greymon's evolutionReq)", () => {
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: 130,
        atk: 40,
        def: 30,
      });
      // Check against the evolution TARGET's requirement
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      expect(meetsStatRequirements(monster, targetDef)).toBe(true);
    });

    it("should fail when HP is too low for evolution target", () => {
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: 129,
        atk: 40,
        def: 30,
      });
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      expect(meetsStatRequirements(monster, targetDef)).toBe(false);
    });

    it("memory equipment stats should count toward requirements", () => {
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: 125,
        atk: 38,
        def: 28,
        memoryEquipment: { name: "テストの記憶", hp: 5, atk: 2, def: 2 },
      });
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;
      expect(meetsStatRequirements(monster, targetDef)).toBe(true);
    });

    it("koromon→agumon condition: HP≥50, ATK≥18, DEF≥14", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 50,
        atk: 18,
        def: 14,
      });
      const targetDef = MONSTER_DEFINITIONS.get("agumon")!;
      expect(meetsStatRequirements(monster, targetDef)).toBe(true);
    });
  });

  describe("meetsBossRequirement", () => {
    it("Baby I has no boss requirement → always true", () => {
      const def = MONSTER_DEFINITIONS.get("botamon")!;
      expect(meetsBossRequirement(def, new Map())).toBe(true);
    });

    it("agumon (target) has W1 boss req → checks W1 progress", () => {
      const targetDef = MONSTER_DEFINITIONS.get("agumon")!;
      // agumon's evolutionRequirement = {hp:50, atk:18, def:14, bossWorld:1}

      // No progress → false
      expect(meetsBossRequirement(targetDef, new Map())).toBe(false);

      // W1 not defeated → false
      const notDefeated: WorldProgress = { worldNumber: 1, killCount: 15, bossDefeated: false };
      expect(meetsBossRequirement(targetDef, new Map([[1, notDefeated]]))).toBe(false);

      // W1 defeated → true
      const defeated: WorldProgress = { worldNumber: 1, killCount: 15, bossDefeated: true };
      expect(meetsBossRequirement(targetDef, new Map([[1, defeated]]))).toBe(true);
    });

    it("greymon (target) has W2 boss req", () => {
      const targetDef = MONSTER_DEFINITIONS.get("greymon")!;

      expect(meetsBossRequirement(targetDef, new Map())).toBe(false);

      const defeated: WorldProgress = { worldNumber: 2, killCount: 15, bossDefeated: true };
      expect(meetsBossRequirement(targetDef, new Map([[2, defeated]]))).toBe(true);
    });

    it("koromon (target, no boss req) → always true", () => {
      const targetDef = MONSTER_DEFINITIONS.get("koromon")!;
      expect(meetsBossRequirement(targetDef, new Map())).toBe(true);
    });
  });

  describe("canEvolve", () => {
    it("should return true when all conditions met (agumon → champion)", () => {
      const monster = createTestMonster({
        definitionId: "agumon",
        maxHp: 130,
        atk: 40,
        def: 30,
      });
      const worldProgress = new Map<number, WorldProgress>([
        [2, { worldNumber: 2, killCount: 15, bossDefeated: true }],
      ]);
      expect(canEvolve(monster, worldProgress)).toBe(true);
    });

    it("should return true for koromon when W1 boss defeated and stats met", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 50,
        atk: 18,
        def: 14,
      });
      // koromon→agumon requires W1 boss
      const worldProgress = new Map<number, WorldProgress>([
        [1, { worldNumber: 1, killCount: 15, bossDefeated: true }],
      ]);
      expect(canEvolve(monster, worldProgress)).toBe(true);
    });

    it("should return false for koromon without W1 boss", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 50,
        atk: 18,
        def: 14,
      });
      expect(canEvolve(monster, new Map())).toBe(false);
    });

    it("should return false for mega stage (no evolution paths)", () => {
      const monster = createTestMonster({
        definitionId: "omegamon",
        maxHp: 3000,
        atk: 800,
        def: 650,
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
        maxHp: 50,
        atk: 18,
        def: 14,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };

      applyEvolution(monster, target);

      expect(monster.definitionId).toBe("agumon");
      expect(monster.evolutionHistory).toContain("koromon");
    });

    it("should raise stats to at least evolved form base stats", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 30,
        atk: 10,
        def: 8,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };
      const agumonDef = MONSTER_DEFINITIONS.get("agumon")!;

      applyEvolution(monster, target);

      expect(monster.maxHp).toBeGreaterThanOrEqual(agumonDef.baseStats.hp);
      expect(monster.atk).toBeGreaterThanOrEqual(agumonDef.baseStats.atk);
      expect(monster.def).toBeGreaterThanOrEqual(agumonDef.baseStats.def);
    });

    it("should keep higher stats if already above base", () => {
      const monster = createTestMonster({
        definitionId: "koromon",
        maxHp: 200,
        atk: 50,
        def: 40,
      });
      const target = { targetId: "agumon", branchType: BranchType.HP };

      applyEvolution(monster, target);

      expect(monster.maxHp).toBe(200);
      expect(monster.atk).toBe(50);
      expect(monster.def).toBe(40);
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
