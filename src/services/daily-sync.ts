/**
 * 日次同期オーケストレーションサービス
 *
 * 朝ログイン時（日付が変わった初回アクセス時）に1回実行。
 *
 * 処理フロー:
 *   1. RideMetrics からフィットネスサマリーを取得 → PMCボーナス計算・付与
 *   2. RideMetrics から未処理ワークアウトを取得 → ゾーン別TP計算・付与
 *   3. Health Connect から前日歩数を取得 → PMCボーナスの歩数係数に使用
 *   4. 規律パラメータの日次更新
 *   5. 食事カウンターリセット
 *   6. 通知のリスケジュール
 */

import {
  fetchTrainingSummary,
  fetchRecentWorkouts,
} from "./ride-metrics";
import { getYesterdaySteps } from "./health-connect";
import {
  scheduleMorningReminder,
  scheduleMealReminder,
  scheduleNeglectWarning,
} from "./notifications";
import { calculatePmcBonus, determinePmcRank } from "../engine/pmc-bonus";
import { calculateDailyDisciplineChange } from "../engine/discipline";
import { calculateWorkoutTp } from "../engine/tp-calculator";
import type { TrainingSummary, WorkoutZoneData } from "../types/ride-metrics";
import type { TrainingPoints } from "../types/training";

/** PMCボーナスの結果 + 追加情報 */
export interface DailySyncResult {
  /** PMCボーナスTP (low/mid/high) */
  pmcBonusTp: TrainingPoints;
  /** ワークアウトTP合計 (新規のみ) */
  workoutTp: TrainingPoints;
  /** 新規処理ワークアウト数 */
  newWorkoutCount: number;
  /** 新規処理ワークアウトキー */
  newWorkoutKeys: string[];
  /** 規律変動値 */
  disciplineChange: number;
  /** 取得したフィットネスサマリー (null = 取得失敗) */
  summary: TrainingSummary | null;
  /** 前日歩数 */
  yesterdaySteps: number;
}

/** デフォルト値 (API取得失敗時のフォールバック) */
const DEFAULT_CTL = 50;
const DEFAULT_TSB = 0;
const DEFAULT_YESTERDAY_STEPS = 5000;

/**
 * 日次同期を実行する
 *
 * @param rideMetricsEnabled - RideMetrics連携が有効か
 * @param healthConnectEnabled - Health Connect連携が有効か
 * @param processedWorkoutKeys - 処理済みワークアウトキーの配列
 * @param mealsYesterday - 前日食事回数
 * @returns 同期結果
 */
export async function executeDailySync(
  rideMetricsEnabled: boolean,
  healthConnectEnabled: boolean,
  processedWorkoutKeys: string[],
  mealsYesterday: number
): Promise<DailySyncResult> {
  // 1. データ取得 (並列実行)
  const [summary, workouts, yesterdaySteps] = await Promise.all([
    rideMetricsEnabled
      ? fetchTrainingSummary().catch(() => null)
      : Promise.resolve(null),
    rideMetricsEnabled
      ? fetchRecentWorkouts(28).catch(() => [] as WorkoutZoneData[])
      : Promise.resolve([] as WorkoutZoneData[]),
    healthConnectEnabled
      ? getYesterdaySteps().catch(() => DEFAULT_YESTERDAY_STEPS)
      : Promise.resolve(DEFAULT_YESTERDAY_STEPS),
  ]);

  // 2. PMCボーナス計算
  const ctl = summary?.ctl ?? DEFAULT_CTL;
  const tsb = summary?.tsb ?? DEFAULT_TSB;
  const bonus = calculatePmcBonus(ctl, tsb, yesterdaySteps);
  const pmcBonusTp: TrainingPoints = {
    low: bonus.tpL,
    mid: bonus.tpM,
    high: bonus.tpH,
  };

  // 3. 未処理ワークアウトのTP計算
  const processedSet = new Set(processedWorkoutKeys);
  const newWorkouts = workouts.filter((w) => !processedSet.has(w.id));

  const workoutTp: TrainingPoints = { low: 0, mid: 0, high: 0 };
  for (const w of newWorkouts) {
    const tp = calculateWorkoutTp(w.zoneTime);
    workoutTp.low += tp.low;
    workoutTp.mid += tp.mid;
    workoutTp.high += tp.high;
  }

  // 4. 規律変動
  const rank = determinePmcRank(ctl, tsb);
  const disciplineChange = calculateDailyDisciplineChange(
    rank,
    mealsYesterday
  );

  // 5. 通知スケジュール (fire-and-forget)
  Promise.all([
    scheduleMorningReminder(),
    scheduleMealReminder("lunch"),
    scheduleMealReminder("dinner"),
  ]).catch(() => {
    // 通知失敗はゲーム進行に影響しない
  });

  return {
    pmcBonusTp,
    workoutTp,
    newWorkoutCount: newWorkouts.length,
    newWorkoutKeys: newWorkouts.map((w) => w.id),
    disciplineChange,
    summary,
    yesterdaySteps,
  };
}

/**
 * 放置警告通知をスケジュールする（ゲームループから呼び出し）
 *
 * @param lastLoginAt - 最終ログイン日時 (ISO string)
 * @param notificationsEnabled - 通知が有効か
 */
export async function scheduleNeglectNotification(
  lastLoginAt: string,
  notificationsEnabled: boolean
): Promise<void> {
  if (!notificationsEnabled) return;
  await scheduleNeglectWarning(lastLoginAt).catch(() => {});
}
