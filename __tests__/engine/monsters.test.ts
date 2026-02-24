import {
  MONSTER_DEFINITIONS,
  STARTER_MONSTER_IDS,
  STAGE_STAT_TABLE,
  EVOLUTION_REQUIREMENTS,
} from "../../src/data/monsters";
import { EvolutionStage, BranchType } from "../../src/types/monster";

describe("Monster Definitions", () => {
  it("should have at least 10 playable monsters", () => {
    const playable = Array.from(MONSTER_DEFINITIONS.values()).filter(
      (m) => !m.isEnemyOnly
    );
    expect(playable.length).toBeGreaterThanOrEqual(10);
  });

  it("should have all starter monster IDs defined", () => {
    for (const id of STARTER_MONSTER_IDS) {
      expect(MONSTER_DEFINITIONS.has(id)).toBe(true);
      const def = MONSTER_DEFINITIONS.get(id)!;
      expect(def.stage).toBe(EvolutionStage.BABY_I);
    }
  });

  it("should have at least 2 monsters per required stage (Baby I, Baby II, Rookie, Champion)", () => {
    const countByStage = new Map<EvolutionStage, number>();
    for (const def of MONSTER_DEFINITIONS.values()) {
      if (def.isEnemyOnly) continue;
      countByStage.set(def.stage, (countByStage.get(def.stage) ?? 0) + 1);
    }
    expect(countByStage.get(EvolutionStage.BABY_I)!).toBeGreaterThanOrEqual(2);
    expect(countByStage.get(EvolutionStage.BABY_II)!).toBeGreaterThanOrEqual(2);
    expect(countByStage.get(EvolutionStage.ROOKIE)!).toBeGreaterThanOrEqual(3);
    expect(
      countByStage.get(EvolutionStage.CHAMPION)!
    ).toBeGreaterThanOrEqual(3);
  });

  it("Baby I should have no evolution requirement", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      if (def.stage === EvolutionStage.BABY_I && !def.isEnemyOnly) {
        expect(def.evolutionRequirement).toBeNull();
      }
    }
  });

  it("each monster's base stats should not exceed stat caps", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      expect(def.baseStats.hp).toBeLessThanOrEqual(def.statCaps.hp);
      expect(def.baseStats.atk).toBeLessThanOrEqual(def.statCaps.atk);
      expect(def.baseStats.def).toBeLessThanOrEqual(def.statCaps.def);
    }
  });

  it("all evolution targets should reference valid monster IDs", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      for (const path of def.evolutionPaths) {
        expect(MONSTER_DEFINITIONS.has(path.targetId)).toBe(true);
      }
    }
  });

  it("evolution paths should target a higher stage", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      for (const path of def.evolutionPaths) {
        const target = MONSTER_DEFINITIONS.get(path.targetId)!;
        expect(target.stage).toBeGreaterThan(def.stage);
      }
    }
  });

  it("Mega (究極体) monsters should have empty evolution paths", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      if (def.stage === EvolutionStage.MEGA) {
        expect(def.evolutionPaths).toHaveLength(0);
      }
    }
  });

  it("evolution paths should cover all 4 branch types per playable non-Mega monster", () => {
    for (const def of MONSTER_DEFINITIONS.values()) {
      if (def.isEnemyOnly || def.stage === EvolutionStage.MEGA) continue;
      const branches = new Set(def.evolutionPaths.map((p) => p.branchType));
      expect(branches.has(BranchType.HP)).toBe(true);
      expect(branches.has(BranchType.DEF)).toBe(true);
      expect(branches.has(BranchType.ATK)).toBe(true);
      expect(branches.has(BranchType.BALANCED)).toBe(true);
    }
  });

  describe("Stage stat table (GDD 6.1)", () => {
    it("should match GDD values for Baby I", () => {
      const s = STAGE_STAT_TABLE[EvolutionStage.BABY_I];
      expect(s.baseHp).toBe(17);
      expect(s.baseAtk).toBe(9);
      expect(s.baseDef).toBe(6);
      expect(s.capHp).toBe(50);
      expect(s.capAtk).toBe(30);
      expect(s.capDef).toBe(25);
    });

    it("should match GDD values for Mega", () => {
      const s = STAGE_STAT_TABLE[EvolutionStage.MEGA];
      expect(s.baseHp).toBe(1000);
      expect(s.baseAtk).toBe(440);
      expect(s.baseDef).toBe(350);
      expect(s.capHp).toBe(3500);
      expect(s.capAtk).toBe(1500);
      expect(s.capDef).toBe(1200);
    });
  });

  describe("Evolution requirements (GDD 6.2)", () => {
    it("Baby I → Baby II: HP≥22, ATK≥14, DEF≥11, no boss", () => {
      const req = EVOLUTION_REQUIREMENTS[EvolutionStage.BABY_I];
      expect(req.hp).toBe(22);
      expect(req.atk).toBe(14);
      expect(req.def).toBe(11);
      expect(req.bossWorld).toBeNull();
    });

    it("Baby II → Rookie: HP≥35, ATK≥20, DEF≥17, no boss", () => {
      const req = EVOLUTION_REQUIREMENTS[EvolutionStage.BABY_II];
      expect(req.hp).toBe(35);
      expect(req.atk).toBe(20);
      expect(req.def).toBe(17);
      expect(req.bossWorld).toBeNull();
    });

    it("Ultimate → Mega: HP≥180, ATK≥100, DEF≥85, no boss", () => {
      const req = EVOLUTION_REQUIREMENTS[EvolutionStage.ULTIMATE];
      expect(req.hp).toBe(180);
      expect(req.atk).toBe(100);
      expect(req.def).toBe(85);
      expect(req.bossWorld).toBeNull();
    });
  });

  it("every playable non-Baby-I monster is reachable from at least one Baby I", () => {
    const allPlayable = Array.from(MONSTER_DEFINITIONS.values()).filter(
      (m) => !m.isEnemyOnly
    );
    const babyIStarters = allPlayable.filter(
      (m) => m.stage === EvolutionStage.BABY_I
    );

    // BFS from all Baby I starters
    const reachable = new Set<string>();
    const queue: string[] = babyIStarters.map((m) => m.id);
    for (const id of queue) {
      reachable.add(id);
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const def = MONSTER_DEFINITIONS.get(currentId)!;
      for (const path of def.evolutionPaths) {
        if (!reachable.has(path.targetId)) {
          reachable.add(path.targetId);
          queue.push(path.targetId);
        }
      }
    }

    // Check every playable non-Baby-I monster is reachable
    const unreachable: string[] = [];
    for (const m of allPlayable) {
      if (m.stage === EvolutionStage.BABY_I) continue;
      if (!reachable.has(m.id)) {
        unreachable.push(`${m.id} (${m.name}, stage ${m.stage})`);
      }
    }

    expect(unreachable).toEqual([]);
  });

  it("should have 123 playable monsters and 27 enemy-only (150 total)", () => {
    const playable = Array.from(MONSTER_DEFINITIONS.values()).filter(
      (m) => !m.isEnemyOnly
    );
    const enemyOnly = Array.from(MONSTER_DEFINITIONS.values()).filter(
      (m) => m.isEnemyOnly
    );
    expect(playable.length).toBe(123);
    expect(enemyOnly.length).toBe(27);
    expect(MONSTER_DEFINITIONS.size).toBe(150);
  });

  describe("Enemy-only monsters", () => {
    it("should have enemy-only monsters for W1 and W2", () => {
      const enemies = Array.from(MONSTER_DEFINITIONS.values()).filter(
        (m) => m.isEnemyOnly
      );
      expect(enemies.length).toBeGreaterThanOrEqual(3);
    });

    it("enemy-only monsters should have no evolution paths", () => {
      for (const def of MONSTER_DEFINITIONS.values()) {
        if (def.isEnemyOnly) {
          expect(def.evolutionPaths).toHaveLength(0);
        }
      }
    });
  });
});
