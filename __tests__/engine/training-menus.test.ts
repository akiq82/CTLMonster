import {
  TRAINING_MENUS,
  TRAINING_MENU_MAP,
} from "../../src/data/training-menus";

describe("Training Menu Definitions", () => {
  it("should have exactly 8 training menus", () => {
    expect(TRAINING_MENUS).toHaveLength(8);
  });

  it("should have all menus in the map", () => {
    expect(TRAINING_MENU_MAP.size).toBe(8);
    for (const menu of TRAINING_MENUS) {
      expect(TRAINING_MENU_MAP.get(menu.id)).toBe(menu);
    }
  });

  it("each menu should have unique ID", () => {
    const ids = TRAINING_MENUS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each menu should have non-negative TP costs", () => {
    for (const menu of TRAINING_MENUS) {
      expect(menu.costTpL).toBeGreaterThanOrEqual(0);
      expect(menu.costTpM).toBeGreaterThanOrEqual(0);
      expect(menu.costTpH).toBeGreaterThanOrEqual(0);
    }
  });

  it("each menu should cost exactly 50 TP total", () => {
    for (const menu of TRAINING_MENUS) {
      const total = menu.costTpL + menu.costTpM + menu.costTpH;
      expect(total).toBe(50);
    }
  });

  it("stat gain min should be <= max", () => {
    for (const menu of TRAINING_MENUS) {
      expect(menu.hpGain.min).toBeLessThanOrEqual(menu.hpGain.max);
      expect(menu.atkGain.min).toBeLessThanOrEqual(menu.atkGain.max);
      expect(menu.defGain.min).toBeLessThanOrEqual(menu.defGain.max);
    }
  });

  describe("Stat gain values verification (×0.80 decimal gains)", () => {
    it("LSD: TP-L=42, TP-M=8, TP-H=0, HP+4.0~4.8, ATK+0~0.8, DEF+0.8~1.6", () => {
      const menu = TRAINING_MENU_MAP.get("lsd")!;
      expect(menu.costTpL).toBe(42);
      expect(menu.costTpM).toBe(8);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 4.0, max: 4.8 });
      expect(menu.atkGain).toEqual({ min: 0, max: 0.8 });
      expect(menu.defGain).toEqual({ min: 0.8, max: 1.6 });
    });

    it("Endurance: TP-L=33, TP-M=17, TP-H=0, HP+2.4~4.8, ATK+0.8~0.8, DEF+0.8~1.6", () => {
      const menu = TRAINING_MENU_MAP.get("endurance")!;
      expect(menu.costTpL).toBe(33);
      expect(menu.costTpM).toBe(17);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 2.4, max: 4.8 });
      expect(menu.atkGain).toEqual({ min: 0.8, max: 0.8 });
      expect(menu.defGain).toEqual({ min: 0.8, max: 1.6 });
    });

    it("Tempo: TP-L=15, TP-M=35, TP-H=0, HP+0.8~1.6, ATK+0.8~1.6, DEF+2.4~4.0", () => {
      const menu = TRAINING_MENU_MAP.get("tempo")!;
      expect(menu.costTpL).toBe(15);
      expect(menu.costTpM).toBe(35);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 0.8, max: 1.6 });
      expect(menu.atkGain).toEqual({ min: 0.8, max: 1.6 });
      expect(menu.defGain).toEqual({ min: 2.4, max: 4.0 });
    });

    it("Sweet Spot: TP-L=9, TP-M=31, TP-H=10, HP+0.8~1.6, ATK+0.8~1.6, DEF+1.6~3.2", () => {
      const menu = TRAINING_MENU_MAP.get("sweet-spot")!;
      expect(menu.costTpL).toBe(9);
      expect(menu.costTpM).toBe(31);
      expect(menu.costTpH).toBe(10);
      expect(menu.hpGain).toEqual({ min: 0.8, max: 1.6 });
      expect(menu.atkGain).toEqual({ min: 0.8, max: 1.6 });
      expect(menu.defGain).toEqual({ min: 1.6, max: 3.2 });
    });

    it("VO2max Intervals: TP-L=0, TP-M=15, TP-H=35, HP+0.8~0.8, ATK+3.2~4.8, DEF+0.8~1.6", () => {
      const menu = TRAINING_MENU_MAP.get("vo2max-interval")!;
      expect(menu.costTpL).toBe(0);
      expect(menu.costTpM).toBe(15);
      expect(menu.costTpH).toBe(35);
      expect(menu.hpGain).toEqual({ min: 0.8, max: 0.8 });
      expect(menu.atkGain).toEqual({ min: 3.2, max: 4.8 });
      expect(menu.defGain).toEqual({ min: 0.8, max: 1.6 });
    });

    it("Anaerobic Sprint: TP-L=0, TP-M=6, TP-H=44, HP+0~0.8, ATK+4.0~5.6, DEF+0~0.8", () => {
      const menu = TRAINING_MENU_MAP.get("anaerobic-sprint")!;
      expect(menu.costTpL).toBe(0);
      expect(menu.costTpM).toBe(6);
      expect(menu.costTpH).toBe(44);
      expect(menu.hpGain).toEqual({ min: 0, max: 0.8 });
      expect(menu.atkGain).toEqual({ min: 4.0, max: 5.6 });
      expect(menu.defGain).toEqual({ min: 0, max: 0.8 });
    });

    it("Hill Climb: TP-L=14, TP-M=22, TP-H=14, HP+1.6~2.4, ATK+1.6~2.4, DEF+1.6~2.4", () => {
      const menu = TRAINING_MENU_MAP.get("hill-climb")!;
      expect(menu.costTpL).toBe(14);
      expect(menu.costTpM).toBe(22);
      expect(menu.costTpH).toBe(14);
      expect(menu.hpGain).toEqual({ min: 1.6, max: 2.4 });
      expect(menu.atkGain).toEqual({ min: 1.6, max: 2.4 });
      expect(menu.defGain).toEqual({ min: 1.6, max: 2.4 });
    });

    it("Race Skills: TP-L=9, TP-M=16, TP-H=25, HP+0.8~1.6, ATK+2.4~4.0, DEF+0.8~1.6", () => {
      const menu = TRAINING_MENU_MAP.get("race-skills")!;
      expect(menu.costTpL).toBe(9);
      expect(menu.costTpM).toBe(16);
      expect(menu.costTpH).toBe(25);
      expect(menu.hpGain).toEqual({ min: 0.8, max: 1.6 });
      expect(menu.atkGain).toEqual({ min: 2.4, max: 4.0 });
      expect(menu.defGain).toEqual({ min: 0.8, max: 1.6 });
    });
  });

  describe("Menu characteristics", () => {
    it("LSD should be HP-focused (highest HP gain)", () => {
      const lsd = TRAINING_MENU_MAP.get("lsd")!;
      expect(lsd.hpGain.max).toBeGreaterThan(lsd.atkGain.max);
      expect(lsd.hpGain.max).toBeGreaterThan(lsd.defGain.max);
    });

    it("Tempo should be DEF-focused (highest DEF gain)", () => {
      const tempo = TRAINING_MENU_MAP.get("tempo")!;
      expect(tempo.defGain.max).toBeGreaterThan(tempo.hpGain.max);
      expect(tempo.defGain.max).toBeGreaterThan(tempo.atkGain.max);
    });

    it("Anaerobic Sprint should be ATK-extreme (highest ATK gain)", () => {
      const sprint = TRAINING_MENU_MAP.get("anaerobic-sprint")!;
      expect(sprint.atkGain.max).toBeGreaterThan(sprint.hpGain.max);
      expect(sprint.atkGain.max).toBeGreaterThan(sprint.defGain.max);
    });

    it("Hill Climb should be balanced (equal gain ranges)", () => {
      const hill = TRAINING_MENU_MAP.get("hill-climb")!;
      expect(hill.hpGain).toEqual(hill.atkGain);
      expect(hill.atkGain).toEqual(hill.defGain);
    });
  });
});
