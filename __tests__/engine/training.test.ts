import {
  canExecuteTraining,
  executeTraining,
  applyTrainingResult,
} from "../../src/engine/training";
import { TRAINING_MENU_MAP } from "../../src/data/training-menus";
import { MONSTER_DEFINITIONS } from "../../src/data/monsters";
import type { MonsterState } from "../../src/types/monster";

/** 固定RNGを返すヘルパー（0.0〜1.0の範囲で指定値を返す） */
function fixedRng(value: number): () => number {
  return () => value;
}

/** テスト用のモンスター状態を作る */
function createTestMonster(overrides?: Partial<MonsterState>): MonsterState {
  return {
    name: "テスト",
    definitionId: "agumon",
    currentHp: 65,
    maxHp: 65,
    atk: 20,
    def: 15,
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

describe("Training Engine", () => {
  describe("canExecuteTraining", () => {
    const lsd = TRAINING_MENU_MAP.get("lsd")!;

    it("should return true when enough TP available", () => {
      expect(canExecuteTraining(lsd, { low: 15, mid: 3, high: 0 })).toBe(true);
    });

    it("should return true with excess TP", () => {
      expect(canExecuteTraining(lsd, { low: 100, mid: 100, high: 100 })).toBe(true);
    });

    it("should return false when TP-L insufficient", () => {
      expect(canExecuteTraining(lsd, { low: 14, mid: 3, high: 0 })).toBe(false);
    });

    it("should return false when TP-M insufficient", () => {
      expect(canExecuteTraining(lsd, { low: 15, mid: 2, high: 0 })).toBe(false);
    });
  });

  describe("executeTraining", () => {
    const lsd = TRAINING_MENU_MAP.get("lsd")!;

    it("should return min gains with rng=0", () => {
      const result = executeTraining(lsd, false, fixedRng(0));
      expect(result.hpGain).toBe(8);
      expect(result.atkGain).toBe(0);
      expect(result.defGain).toBe(1);
      expect(result.mealBonusApplied).toBe(false);
    });

    it("should return max gains with rng=0.999", () => {
      const result = executeTraining(lsd, false, fixedRng(0.999));
      expect(result.hpGain).toBe(12);
      expect(result.atkGain).toBe(1);
      expect(result.defGain).toBe(3);
    });

    it("should apply meal bonus ×1.1 with ceil", () => {
      // With rng=0: HP=8, ATK=0, DEF=1
      // After ×1.1: HP=ceil(8.8)=9, ATK=ceil(0)=0, DEF=ceil(1.1)=2
      const result = executeTraining(lsd, true, fixedRng(0));
      expect(result.hpGain).toBe(9);
      expect(result.atkGain).toBe(0);
      expect(result.defGain).toBe(2);
      expect(result.mealBonusApplied).toBe(true);
    });

    it("VO2max should have high ATK gain", () => {
      const vo2 = TRAINING_MENU_MAP.get("vo2max-interval")!;
      const result = executeTraining(vo2, false, fixedRng(0.5));
      expect(result.atkGain).toBeGreaterThan(result.hpGain);
    });
  });

  describe("applyTrainingResult", () => {
    it("should increase stats and record TP consumption", () => {
      const monster = createTestMonster();
      const lsd = TRAINING_MENU_MAP.get("lsd")!;
      const result = executeTraining(lsd, false, fixedRng(0.5));

      applyTrainingResult(monster, result, lsd);

      expect(monster.maxHp).toBeGreaterThan(65);
      expect(monster.totalTpL).toBe(15);
      expect(monster.totalTpM).toBe(3);
      expect(monster.totalTpH).toBe(0);
    });

    it("should fully heal HP after training (GDD 7.2)", () => {
      const monster = createTestMonster({ currentHp: 10 });
      const lsd = TRAINING_MENU_MAP.get("lsd")!;
      const result = executeTraining(lsd, false, fixedRng(0));

      applyTrainingResult(monster, result, lsd);

      expect(monster.currentHp).toBe(monster.maxHp);
    });

    it("should clamp stats at definition caps", () => {
      const agumonDef = MONSTER_DEFINITIONS.get("agumon")!;
      const monster = createTestMonster({
        maxHp: agumonDef.statCaps.hp - 1,
        atk: agumonDef.statCaps.atk,
        def: agumonDef.statCaps.def,
      });

      const lsd = TRAINING_MENU_MAP.get("lsd")!;
      const result = {
        menuId: "lsd",
        hpGain: 100,
        atkGain: 100,
        defGain: 100,
        mealBonusApplied: false,
      };

      applyTrainingResult(monster, result, lsd);

      expect(monster.maxHp).toBe(agumonDef.statCaps.hp);
      expect(monster.atk).toBe(agumonDef.statCaps.atk);
      expect(monster.def).toBe(agumonDef.statCaps.def);
    });
  });
});
