/**
 * 死亡 → 新モンスター誕生 E2Eシナリオテスト
 *
 * 寿命到達 → 死亡検出 → 世代引き継ぎ → 新モンスター誕生の一連フローを検証する。
 */

import {
  isLifespanReached,
  isNeglectDeath,
  rollBaseLifespan,
} from "../../src/engine/lifespan";
import {
  createFirstGeneration,
  createNextGeneration,
  createMemoryEquipment,
} from "../../src/engine/generation";
import { MONSTER_DEFINITIONS, STARTER_MONSTER_IDS } from "../../src/data/monsters";
import type { MonsterState } from "../../src/types/monster";

function fixedRng(value: number): () => number {
  return () => value;
}

describe("Death → Rebirth E2E", () => {
  describe("Scenario: Lifespan death → Gen2 birth", () => {
    let gen1: MonsterState;

    beforeAll(() => {
      // Gen1: 基礎寿命8日 (rng=0.5)
      gen1 = createFirstGeneration("テスト1号", "botamon", fixedRng(0.5));
    });

    it("Gen1 should be alive before lifespan ends", () => {
      const daysSinceBirth = 7;
      const now = new Date(gen1.bornAt);
      now.setDate(now.getDate() + daysSinceBirth);
      expect(
        isLifespanReached(gen1.bornAt, gen1.baseLifespan, gen1.lifespanExtension, now)
      ).toBe(false);
    });

    it("Gen1 should die when lifespan is reached", () => {
      const now = new Date(gen1.bornAt);
      now.setDate(now.getDate() + gen1.baseLifespan + 1);
      expect(
        isLifespanReached(gen1.bornAt, gen1.baseLifespan, gen1.lifespanExtension, now)
      ).toBe(true);
    });

    it("should create memory equipment from Gen1 final stats", () => {
      // シミュレーション: トレーニングでステータスアップした状態
      const trainedGen1: MonsterState = {
        ...gen1,
        maxHp: 170,
        atk: 56,
        def: 40,
        wins: 10,
        losses: 3,
      };
      const memory = createMemoryEquipment(trainedGen1);

      expect(memory.name).toContain("の記憶");
      expect(memory.hp).toBe(Math.floor(170 * 0.2)); // 34
      expect(memory.atk).toBe(Math.floor(56 * 0.2)); // 11
      expect(memory.def).toBe(Math.floor(40 * 0.2)); // 8
    });

    it("Gen2 should inherit memory equipment and reset stats", () => {
      const trainedGen1: MonsterState = {
        ...gen1,
        maxHp: 170,
        atk: 56,
        def: 40,
        totalTpL: 200,
        totalTpM: 80,
        totalTpH: 50,
        wins: 10,
        losses: 3,
      };
      const gen2 = createNextGeneration(trainedGen1, "テスト2号", fixedRng(0));

      // 世代番号
      expect(gen2.generation).toBe(2);

      // 記憶装備が存在する
      expect(gen2.memoryEquipment).not.toBeNull();
      expect(gen2.memoryEquipment!.hp).toBe(34);
      expect(gen2.memoryEquipment!.atk).toBe(11);
      expect(gen2.memoryEquipment!.def).toBe(8);

      // ステータスは初期値にリセット
      const starterDef = MONSTER_DEFINITIONS.get(gen2.definitionId)!;
      expect(gen2.maxHp).toBe(starterDef.baseStats.hp);
      expect(gen2.atk).toBe(starterDef.baseStats.atk);
      expect(gen2.def).toBe(starterDef.baseStats.def);
      expect(gen2.currentHp).toBe(starterDef.baseStats.hp);

      // TP, 戦績リセット
      expect(gen2.totalTpL).toBe(0);
      expect(gen2.totalTpM).toBe(0);
      expect(gen2.totalTpH).toBe(0);
      expect(gen2.wins).toBe(0);
      expect(gen2.losses).toBe(0);

      // 規律は50で開始
      expect(gen2.discipline).toBe(50);

      // 進化履歴リセット
      expect(gen2.evolutionHistory).toEqual([]);

      // 寿命延長リセット
      expect(gen2.lifespanExtension).toBe(0);
    });
  });

  describe("Scenario: Neglect death (48h)", () => {
    it("should detect neglect death after 48 hours", () => {
      const gen1 = createFirstGeneration("放置テスト", "botamon", fixedRng(0.5));
      const now = new Date(gen1.lastLoginAt);
      now.setHours(now.getHours() + 49);

      expect(isNeglectDeath(gen1.lastLoginAt, now)).toBe(true);
    });

    it("should still allow rebirth after neglect death", () => {
      const gen1 = createFirstGeneration("放置テスト", "botamon", fixedRng(0.5));
      const gen2 = createNextGeneration(gen1, "復活", fixedRng(0));

      expect(gen2.generation).toBe(2);
      expect(gen2.memoryEquipment).not.toBeNull();
    });
  });

  describe("Scenario: Gen1 → Gen2 → Gen3 (multi-generation)", () => {
    it("should chain memory equipment across generations", () => {
      // Gen1: 基礎ステ
      const gen1 = createFirstGeneration("初代", "botamon", fixedRng(0.5));
      const trainedGen1: MonsterState = {
        ...gen1,
        maxHp: 170,
        atk: 56,
        def: 40,
      };

      // Gen2: Gen1の記憶(HP:34, ATK:11, DEF:8)を装備
      const gen2 = createNextGeneration(trainedGen1, "二代目", fixedRng(0.5));
      expect(gen2.generation).toBe(2);
      expect(gen2.memoryEquipment!.hp).toBe(34);

      // Gen2のトレーニング後ステータス (装備込み計算)
      const trainedGen2: MonsterState = {
        ...gen2,
        maxHp: 400,
        atk: 110,
        def: 85,
      };

      // Gen3: Gen2の装備込み最終ステで記憶生成
      const gen3 = createNextGeneration(trainedGen2, "三代目", fixedRng(0.5));
      expect(gen3.generation).toBe(3);
      // (400+34)*0.2=86.8→86, (110+11)*0.2=24.2→24, (85+8)*0.2=18.6→18
      expect(gen3.memoryEquipment!.hp).toBe(86);
      expect(gen3.memoryEquipment!.atk).toBe(24);
      expect(gen3.memoryEquipment!.def).toBe(18);

      // Gen3の記憶はGen2の名前ではなくモンスター名を含む
      expect(gen3.memoryEquipment!.name).toContain("の記憶");
    });
  });

  describe("Lifespan extension from meals", () => {
    it("should extend lifespan with meals, delaying death", () => {
      const gen1 = createFirstGeneration("食事テスト", "botamon", fixedRng(0.5));
      // 基礎寿命8日 + 食事延長2日 = 10日
      const extended: MonsterState = { ...gen1, lifespanExtension: 2.0 };

      // 9日目: まだ生きている
      const day9 = new Date(extended.bornAt);
      day9.setDate(day9.getDate() + 9);
      expect(
        isLifespanReached(extended.bornAt, extended.baseLifespan, extended.lifespanExtension, day9)
      ).toBe(false);

      // 11日目: 死亡
      const day11 = new Date(extended.bornAt);
      day11.setDate(day11.getDate() + 11);
      expect(
        isLifespanReached(extended.bornAt, extended.baseLifespan, extended.lifespanExtension, day11)
      ).toBe(true);
    });
  });
});
