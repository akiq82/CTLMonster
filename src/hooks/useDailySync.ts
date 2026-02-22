/**
 * 朝ログイン判定 → PMCボーナス、規律更新、食事リセット
 *
 * 1日1回（日付が変わった初回ログイン時）に実行される。
 */

import { useEffect } from "react";
import { useGameStore } from "../store/game-store";
import { useMonsterStore } from "../store/monster-store";
import { calculatePmcBonus, determinePmcRank } from "../engine/pmc-bonus";
import { calculateDailyDisciplineChange } from "../engine/discipline";
import { PmcRank } from "../types/ride-metrics";

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface DailySyncOptions {
  /** CTL値 (RideMetricsから取得、スタブ時はデフォルト) */
  ctl?: number;
  /** TSB値 */
  tsb?: number;
  /** 前日歩数 */
  yesterdaySteps?: number;
}

export function useDailySync(options: DailySyncOptions = {}) {
  const { ctl = 50, tsb = 0, yesterdaySteps = 5000 } = options;

  const phase = useGameStore((s) => s.phase);
  const lastSyncDate = useGameStore((s) => s.lastSyncDate);
  const addTp = useGameStore((s) => s.addTp);
  const markDailyBonusApplied = useGameStore((s) => s.markDailyBonusApplied);
  const updateLastLogin = useGameStore((s) => s.updateLastLogin);
  const monster = useMonsterStore((s) => s.monster);
  const changeDiscipline = useMonsterStore((s) => s.changeDiscipline);
  const resetDailyMeals = useMonsterStore((s) => s.resetDailyMeals);

  useEffect(() => {
    if (phase !== "alive" || !monster) return;

    const today = getTodayString();
    if (lastSyncDate === today) return;

    // Apply PMC bonus
    const bonus = calculatePmcBonus(ctl, tsb, yesterdaySteps);
    addTp({ low: bonus.tpL, mid: bonus.tpM, high: bonus.tpH });

    // Apply discipline change
    const rank = determinePmcRank(ctl, tsb);
    const disciplineChange = calculateDailyDisciplineChange(
      rank,
      monster.mealsYesterday
    );
    changeDiscipline(disciplineChange);

    // Reset meals
    resetDailyMeals();

    // Mark sync
    markDailyBonusApplied(today);
    updateLastLogin();
  }, [phase, monster?.definitionId, lastSyncDate]);
}
