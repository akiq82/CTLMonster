/**
 * バランスシミュレーションテスト
 *
 * バランス目標: CTL60 / 週5ライド(TSS70) / 10k歩 → W1ボス勝率 ~35-50%
 *
 * テスト対象:
 *   1. TP供給量 (PMCボーナス→baseTp + ワークアウトTP)
 *   2. WP供給量 (歩数ベース) → エンカウント到達
 *   3. トレーニング (×0.80小数ゲイン) → ステータス上昇 → 進化条件達成
 *   4. ボスバトル勝率 (~35-50%)
 */

import { calculatePmcBonus } from "../../src/engine/pmc-bonus";
import { calculateWorkoutTp } from "../../src/engine/tp-calculator";
import { executeTraining, applyTrainingResult, canExecuteTraining } from "../../src/engine/training";
import { executeBattle } from "../../src/engine/battle";
import { TRAINING_MENU_MAP } from "../../src/data/training-menus";
import { MONSTER_DEFINITIONS, EVOLUTION_REQUIREMENTS } from "../../src/data/monsters";
import { EvolutionStage } from "../../src/types/monster";
import { WP_CONSTANTS } from "../../src/types/battle";
import type { MonsterState } from "../../src/types/monster";
import type { TrainingPoints } from "../../src/types/training";
import type { BattleFighter } from "../../src/types/battle";
import type { ZoneTime } from "../../src/types/training";

function fixedRng(value: number): () => number {
  return () => value;
}

function createBabyI(): MonsterState {
  return {
    name: "テスト",
    definitionId: "botamon",
    currentHp: 10,
    maxHp: 10,
    atk: 3,
    def: 2,
    discipline: 50,
    totalTpL: 0,
    totalTpM: 0,
    totalTpH: 0,
    bornAt: new Date().toISOString(),
    baseLifespan: 7,
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
  };
}

/** CTL60ライダーの典型的なゾーンタイム (1時間ライド) */
const TYPICAL_ZONE_TIME: ZoneTime = {
  z1: 1200,
  z2: 2400,
  z3: 1200,
  z4: 600,
  z5: 300,
  z6: 60,
  z7: 0,
};

describe("Balance Simulation (CTL60 / TSS350 / 10k steps) — baseTp + 0.80x gains", () => {
  describe("TP supply per week (CTL60 / 10k steps / 5 rides TSS70)", () => {
    it("should calculate weekly PMC bonus TP → baseTp pool", () => {
      const bonus = calculatePmcBonus(60, 0, 10000);
      const weeklyTotal = bonus.totalTp * 7;

      // PMC base=28, CTL60/TSB0 → factor≈0.74, steps 10k → factor=1.0
      // daily TP = floor(28 × 0.74 × 1.0) = 20
      expect(bonus.totalTp).toBe(20);
      expect(weeklyTotal).toBe(140);
    });

    it("should calculate workout TP for 5 rides at TSS70", () => {
      const tpPerRide = calculateWorkoutTp(TYPICAL_ZONE_TIME, 70);
      const totalPerRide = tpPerRide.low + tpPerRide.mid + tpPerRide.high;
      const totalRideTp = totalPerRide * 5;

      // TSS70 per ride → ~69 TP per ride → ~345 TP for 5 rides
      expect(totalPerRide).toBeGreaterThan(60);
      expect(totalPerRide).toBeLessThan(80);
      expect(totalRideTp).toBeGreaterThan(300);
      expect(totalRideTp).toBeLessThan(400);
    });

    it("total weekly TP (baseTp + ride) should be 500-600 range with battle XP", () => {
      const bonus = calculatePmcBonus(60, 0, 10000);
      const tpPerRide = calculateWorkoutTp(TYPICAL_ZONE_TIME, 70);

      // baseTp: PMC 140 + battle XP ~68 (assuming ~68 battles/week) = ~208
      const baseTpWeekly = bonus.totalTp * 7 + 68;

      // ride TP (goes directly to L/M/H)
      const rideTpWeekly = (tpPerRide.low + tpPerRide.mid + tpPerRide.high) * 5;

      const total = baseTpWeekly + rideTpWeekly;

      // ~208 (baseTp) + ~345 (rides) = ~553 TP
      expect(total).toBeGreaterThanOrEqual(500);
      expect(total).toBeLessThanOrEqual(600);
    });
  });

  describe("WP budget (10k steps/day × 7 days)", () => {
    const weeklyWp = 10000 * 7; // 70,000

    it("should have enough WP for 10 mob encounters + boss", () => {
      // No whiff: 10 encounters confirmed + 1 boss
      const wpForMobs = 10 * WP_CONSTANTS.ENCOUNTER_WP_COST; // 10 × 2000 = 20,000
      const wpForBoss = WP_CONSTANTS.BOSS_WP_COST; // 3,000
      const totalWpNeeded = wpForMobs + wpForBoss; // 23,000

      expect(weeklyWp).toBeGreaterThan(totalWpNeeded);
    });

    it("3k steps should be insufficient for steps-only WP", () => {
      const weeklyWp3k = 3000 * 7; // 21,000
      const wpForMobs = 10 * WP_CONSTANTS.ENCOUNTER_WP_COST; // 20,000
      const wpForBoss = WP_CONSTANTS.BOSS_WP_COST; // 3,000
      const totalWpNeeded = wpForMobs + wpForBoss; // 23,000

      expect(weeklyWp3k).toBeLessThan(totalWpNeeded);
    });
  });

  describe("Training → Stats with 0.80x decimal gains (rng=0.5)", () => {
    it("~11 trainings with 0.80x gains should reach evolution threshold", () => {
      const rng = fixedRng(0.5);
      const monster = createBabyI();

      // Calculate weekly TP: baseTp (PMC + battle XP) + ride TP
      const bonus = calculatePmcBonus(60, 0, 10000);
      const tpPerRide = calculateWorkoutTp(TYPICAL_ZONE_TIME, 70);

      // baseTp distributed equally to L/M/H
      const baseTpWeekly = bonus.totalTp * 7 + 68; // PMC + estimated battle XP
      const basePerChannel = Math.floor(baseTpWeekly / 3);

      const tp: TrainingPoints = {
        low: basePerChannel + (baseTpWeekly - basePerChannel * 3) + tpPerRide.low * 5,
        mid: basePerChannel + tpPerRide.mid * 5,
        high: basePerChannel + tpPerRide.high * 5,
      };

      // Phase 1: Baby I training (3 trainings to evolve to Baby II)
      const babyIMenus = ["lsd", "hill-climb", "endurance"];
      let trainCount = 0;
      for (const menuId of babyIMenus) {
        const menu = TRAINING_MENU_MAP.get(menuId)!;
        if (!canExecuteTraining(menu, tp)) break;
        const result = executeTraining(menu, false, rng);
        applyTrainingResult(monster, result, menu);
        tp.low -= menu.costTpL;
        tp.mid -= menu.costTpM;
        tp.high -= menu.costTpH;
        trainCount++;
      }

      // Baby I → Baby II evolution check
      expect(trainCount).toBe(3);
      expect(monster.maxHp).toBeGreaterThanOrEqual(16); // Lower threshold with 0.80x gains

      // Simulate evolution to koromon (Baby II)
      monster.definitionId = "koromon";
      monster.evolutionHistory.push("botamon");
      const babyIIDef = MONSTER_DEFINITIONS.get("koromon")!;
      monster.maxHp = Math.max(monster.maxHp, babyIIDef.baseStats.hp);
      monster.atk = Math.max(monster.atk, babyIIDef.baseStats.atk);
      monster.def = Math.max(monster.def, babyIIDef.baseStats.def);
      monster.currentHp = monster.maxHp;

      // Phase 2: Baby II training (more trainings available with baseTp)
      // Menu order optimized for evolution threshold (HP≥40, ATK≥16, DEF≥12)
      const babyIIMenus = [
        "lsd",             // HP-focused
        "lsd",             // HP-focused
        "lsd",             // HP supplement (ensure HP≥40)
        "vo2max-interval", // ATK-focused
        "race-skills",     // ATK-focused
        "tempo",           // DEF-focused
        "tempo",           // DEF supplement
        "endurance",       // HP supplement
        "sweet-spot",      // backup
        "hill-climb",      // backup
      ];

      let babyIITrainCount = 0;
      for (const menuId of babyIIMenus) {
        const menu = TRAINING_MENU_MAP.get(menuId)!;
        if (!canExecuteTraining(menu, tp)) continue;
        const result = executeTraining(menu, false, rng);
        applyTrainingResult(monster, result, menu);
        tp.low -= menu.costTpL;
        tp.mid -= menu.costTpM;
        tp.high -= menu.costTpH;
        babyIITrainCount++;
      }

      // With baseTp + ride TP, should get 5-9 Baby II trainings
      // (exact count depends on menu order + TP channel distribution)
      expect(babyIITrainCount).toBeGreaterThanOrEqual(5);
      expect(babyIITrainCount).toBeLessThanOrEqual(10);

      // Baby II → Rookie evolution threshold: HP≥40, ATK≥16, DEF≥12
      const evoReq = EVOLUTION_REQUIREMENTS[EvolutionStage.BABY_II];
      expect(monster.maxHp).toBeGreaterThanOrEqual(evoReq.hp);
      expect(monster.atk).toBeGreaterThanOrEqual(evoReq.atk);
      expect(monster.def).toBeGreaterThanOrEqual(evoReq.def);

      // Total trainings: ~8-12 with baseTp + ride TP
      const totalTrains = trainCount + babyIITrainCount;
      expect(totalTrains).toBeGreaterThanOrEqual(8);
      expect(totalTrains).toBeLessThanOrEqual(13);
    });
  });

  describe("W1 boss battle (trained Baby II with 0.80x stats)", () => {
    it("boss battle win rate should be 25-55% (0.80x gain balance)", () => {
      // Monte Carlo: run 500 battles with trained Baby II stats
      // With 0.80x gains and ~11 trainings, stats similar to old system
      let wins = 0;
      const trials = 500;
      let rngSeed = 0;

      for (let i = 0; i < trials; i++) {
        rngSeed = (rngSeed + 0.137) % 1;
        const rng = () => {
          rngSeed = (rngSeed * 9301 + 49297) % 233280;
          return rngSeed / 233280;
        };

        const player: BattleFighter = {
          name: "player",
          currentHp: 44,
          maxHp: 44,
          atk: 23,
          def: 20,
          discipline: 50,
        };

        const boss: BattleFighter = {
          name: "ogremon",
          currentHp: 70,
          maxHp: 70,
          atk: 20,
          def: 15,
          discipline: 50,
        };

        const result = executeBattle(player, boss, rng);
        if (result.playerWon) wins++;
      }

      const winRate = wins / trials;
      // With 0.80x gains compensated by more trainings → similar final stats
      expect(winRate).toBeGreaterThan(0.25);
      expect(winRate).toBeLessThanOrEqual(0.55);
    });
  });

  describe("CTL40 (undertrained) should NOT reach boss", () => {
    it("CTL40/TSS100 provides insufficient TP for meaningful training", () => {
      const bonus = calculatePmcBonus(40, 0, 6000);
      expect(bonus.totalTp).toBeLessThanOrEqual(10);

      // 1 ride/week at TSS30
      const tpPerRide = calculateWorkoutTp(TYPICAL_ZONE_TIME, 30);

      // baseTp: PMC + minimal battle XP
      const baseTpWeekly = bonus.totalTp * 7 + 5; // very few battles
      const basePerChannel = Math.floor(baseTpWeekly / 3);

      const tp: TrainingPoints = {
        low: basePerChannel + tpPerRide.low * 1,
        mid: basePerChannel + tpPerRide.mid * 1,
        high: basePerChannel + tpPerRide.high * 1,
      };

      const totalTp = tp.low + tp.mid + tp.high;
      // ~75 (baseTp) + ~30 (ride) = ~105 TP total
      expect(totalTp).toBeLessThan(140);

      // With 50TP/training, budget allows only ~2 trainings
      const maxTrainings = Math.floor(totalTp / 45);
      expect(maxTrainings).toBeLessThanOrEqual(3);
    });
  });
});
