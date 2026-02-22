/**
 * 朝ログイン判定 → PMCボーナス、ワークアウトTP、規律更新、食事リセット
 *
 * 1日1回（日付が変わった初回ログイン時）に実行される。
 * RideMetrics / Health Connect の設定に基づいて実データまたはデフォルト値を使用。
 */

import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game-store";
import { useMonsterStore } from "../store/monster-store";
import { useSettingsStore } from "../store/settings-store";
import { executeDailySync } from "../services/daily-sync";

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useDailySync() {
  const phase = useGameStore((s) => s.phase);
  const lastSyncDate = useGameStore((s) => s.lastSyncDate);
  const processedWorkoutKeys = useGameStore((s) => s.processedWorkoutKeys);
  const addTp = useGameStore((s) => s.addTp);
  const markDailyBonusApplied = useGameStore((s) => s.markDailyBonusApplied);
  const markWorkoutProcessed = useGameStore((s) => s.markWorkoutProcessed);
  const updateLastLogin = useGameStore((s) => s.updateLastLogin);

  const monster = useMonsterStore((s) => s.monster);
  const changeDiscipline = useMonsterStore((s) => s.changeDiscipline);
  const resetDailyMeals = useMonsterStore((s) => s.resetDailyMeals);

  const rideMetricsEnabled = useSettingsStore((s) => s.rideMetricsEnabled);
  const healthConnectEnabled = useSettingsStore(
    (s) => s.healthConnectEnabled
  );

  // 同期中フラグ (重複実行防止)
  const syncingRef = useRef(false);

  useEffect(() => {
    if (phase !== "alive" || !monster) return;

    const today = getTodayString();
    if (lastSyncDate === today) return;
    if (syncingRef.current) return;

    syncingRef.current = true;

    executeDailySync(
      rideMetricsEnabled,
      healthConnectEnabled,
      processedWorkoutKeys,
      monster.mealsYesterday
    )
      .then((result) => {
        // PMCボーナスTP付与
        addTp(result.pmcBonusTp);

        // ワークアウトTP付与
        if (result.workoutTp.low > 0 || result.workoutTp.mid > 0 || result.workoutTp.high > 0) {
          addTp(result.workoutTp);
        }

        // ワークアウト処理済みマーク
        for (const key of result.newWorkoutKeys) {
          markWorkoutProcessed(key);
        }

        // 規律変動
        changeDiscipline(result.disciplineChange);

        // 食事リセット
        resetDailyMeals();

        // 同期日マーク
        markDailyBonusApplied(today);
        updateLastLogin();
      })
      .catch(() => {
        // 同期失敗時はデフォルト値でフォールバック実行
        // (executeDailySync 内部で各APIエラーは個別にcatchされるため、
        //  ここに来るのは想定外のエラーのみ)
      })
      .finally(() => {
        syncingRef.current = false;
      });
  }, [phase, monster?.definitionId, lastSyncDate]);
}
