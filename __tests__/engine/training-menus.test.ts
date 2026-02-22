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

  it("each menu should have at least some TP cost", () => {
    for (const menu of TRAINING_MENUS) {
      const total = menu.costTpL + menu.costTpM + menu.costTpH;
      expect(total).toBeGreaterThan(0);
    }
  });

  it("stat gain min should be <= max", () => {
    for (const menu of TRAINING_MENUS) {
      expect(menu.hpGain.min).toBeLessThanOrEqual(menu.hpGain.max);
      expect(menu.atkGain.min).toBeLessThanOrEqual(menu.atkGain.max);
      expect(menu.defGain.min).toBeLessThanOrEqual(menu.defGain.max);
    }
  });

  describe("GDD 5.4 values verification", () => {
    it("LSD: TP-L=15, TP-M=3, TP-H=0, HP+8~12, ATK+0~1, DEF+1~3", () => {
      const menu = TRAINING_MENU_MAP.get("lsd")!;
      expect(menu.costTpL).toBe(15);
      expect(menu.costTpM).toBe(3);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 8, max: 12 });
      expect(menu.atkGain).toEqual({ min: 0, max: 1 });
      expect(menu.defGain).toEqual({ min: 1, max: 3 });
    });

    it("Endurance: TP-L=10, TP-M=5, TP-H=0, HP+5~8, ATK+1~2, DEF+2~4", () => {
      const menu = TRAINING_MENU_MAP.get("endurance")!;
      expect(menu.costTpL).toBe(10);
      expect(menu.costTpM).toBe(5);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 5, max: 8 });
      expect(menu.atkGain).toEqual({ min: 1, max: 2 });
      expect(menu.defGain).toEqual({ min: 2, max: 4 });
    });

    it("Tempo: TP-L=5, TP-M=12, TP-H=0, HP+2~4, ATK+1~3, DEF+5~8", () => {
      const menu = TRAINING_MENU_MAP.get("tempo")!;
      expect(menu.costTpL).toBe(5);
      expect(menu.costTpM).toBe(12);
      expect(menu.costTpH).toBe(0);
      expect(menu.hpGain).toEqual({ min: 2, max: 4 });
      expect(menu.atkGain).toEqual({ min: 1, max: 3 });
      expect(menu.defGain).toEqual({ min: 5, max: 8 });
    });

    it("Sweet Spot: TP-L=3, TP-M=10, TP-H=3, HP+2~3, ATK+2~4, DEF+4~7", () => {
      const menu = TRAINING_MENU_MAP.get("sweet-spot")!;
      expect(menu.costTpL).toBe(3);
      expect(menu.costTpM).toBe(10);
      expect(menu.costTpH).toBe(3);
      expect(menu.hpGain).toEqual({ min: 2, max: 3 });
      expect(menu.atkGain).toEqual({ min: 2, max: 4 });
      expect(menu.defGain).toEqual({ min: 4, max: 7 });
    });

    it("VO2max Intervals: TP-L=0, TP-M=5, TP-H=12, HP+1~2, ATK+6~10, DEF+1~3", () => {
      const menu = TRAINING_MENU_MAP.get("vo2max-interval")!;
      expect(menu.costTpL).toBe(0);
      expect(menu.costTpM).toBe(5);
      expect(menu.costTpH).toBe(12);
      expect(menu.hpGain).toEqual({ min: 1, max: 2 });
      expect(menu.atkGain).toEqual({ min: 6, max: 10 });
      expect(menu.defGain).toEqual({ min: 1, max: 3 });
    });

    it("Anaerobic Sprint: TP-L=0, TP-M=2, TP-H=15, HP+0~1, ATK+8~12, DEF+0~1", () => {
      const menu = TRAINING_MENU_MAP.get("anaerobic-sprint")!;
      expect(menu.costTpL).toBe(0);
      expect(menu.costTpM).toBe(2);
      expect(menu.costTpH).toBe(15);
      expect(menu.hpGain).toEqual({ min: 0, max: 1 });
      expect(menu.atkGain).toEqual({ min: 8, max: 12 });
      expect(menu.defGain).toEqual({ min: 0, max: 1 });
    });

    it("Hill Climb: TP-L=5, TP-M=8, TP-H=5, HP+3~5, ATK+3~5, DEF+3~5", () => {
      const menu = TRAINING_MENU_MAP.get("hill-climb")!;
      expect(menu.costTpL).toBe(5);
      expect(menu.costTpM).toBe(8);
      expect(menu.costTpH).toBe(5);
      expect(menu.hpGain).toEqual({ min: 3, max: 5 });
      expect(menu.atkGain).toEqual({ min: 3, max: 5 });
      expect(menu.defGain).toEqual({ min: 3, max: 5 });
    });

    it("Race Skills: TP-L=3, TP-M=5, TP-H=8, HP+1~3, ATK+5~8, DEF+2~4", () => {
      const menu = TRAINING_MENU_MAP.get("race-skills")!;
      expect(menu.costTpL).toBe(3);
      expect(menu.costTpM).toBe(5);
      expect(menu.costTpH).toBe(8);
      expect(menu.hpGain).toEqual({ min: 1, max: 3 });
      expect(menu.atkGain).toEqual({ min: 5, max: 8 });
      expect(menu.defGain).toEqual({ min: 2, max: 4 });
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
