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
import { getYesterdaySteps, fetchHealthDataForDate } from "./health-connect";
import {
  scheduleMorningReminder,
  scheduleMealReminder,
  scheduleNeglectWarning,
} from "./notifications";
import { calculatePmcBonus, determinePmcRank } from "../engine/pmc-bonus";
import { calculateDailyDisciplineChange } from "../engine/discipline";
import { calculateWorkoutTp } from "../engine/tp-calculator";
import { calculateRideWp } from "../engine/encounter";
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
  /** ライドWP (新規ワークアウトの距離・獲得標高から変換) */
  rideWp: number;
  /** 規律変動値 */
  disciplineChange: number;
  /** 取得したフィットネスサマリー (null = 取得失敗) */
  summary: TrainingSummary | null;
  /** 前日歩数 */
  yesterdaySteps: number;
  /** 救済されたWP (アプリ未起動日の歩数・階段分) */
  rescuedWp: number;
  /** 救済対象日 (YYYY-MM-DD) */
  rescuedStepDates: string[];
}

/** ワークアウト手動同期の結果 */
export interface WorkoutSyncResult {
  /** ワークアウトTP合計 (新規のみ) */
  workoutTp: TrainingPoints;
  /** 新規処理ワークアウト数 */
  newWorkoutCount: number;
  /** 新規処理ワークアウトキー */
  newWorkoutKeys: string[];
  /** ライドWP (新規ワークアウトの距離・獲得標高から変換) */
  rideWp: number;
}

/** 歩数救済の最大日数 */
const MAX_RESCUE_DAYS = 3;

/** デフォルト値 (API取得失敗時のフォールバック) */
const DEFAULT_CTL = 50;
const DEFAULT_TSB = 0;
const DEFAULT_YESTERDAY_STEPS = 5000;

/**
 * YYYY-MM-DD 文字列を Date オブジェクトに変換する (ローカル 00:00)
 */
function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Date オブジェクトを YYYY-MM-DD 文字列に変換する
 */
function formatDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * 歩数救済の対象日を算出する (純粋関数)
 *
 * lastSyncDate と today の間（両端を含まない）の日付を返す。
 * - lastSyncDate の日はアプリが開かれていた → リアルタイム hook で取得済み
 * - today はリアルタイム hook が処理中
 * - 最大 MAX_RESCUE_DAYS (3日) まで
 *
 * @param lastSyncDate - 前回同期日 (YYYY-MM-DD) または空文字列
 * @param today - 今日の日付 (YYYY-MM-DD)
 * @returns 救済対象日の配列 (古い順)
 */
export function getStepRescueDates(
  lastSyncDate: string,
  today: string
): string[] {
  const todayDate = parseDateStr(today);

  // 救済範囲の下限: today - MAX_RESCUE_DAYS
  const earliest = new Date(todayDate);
  earliest.setDate(earliest.getDate() - MAX_RESCUE_DAYS);

  // 救済範囲の上限: lastSyncDate + 1日 (lastSyncDate の日はアプリが開いていた)
  let start: Date;
  if (lastSyncDate) {
    const lastSync = parseDateStr(lastSyncDate);
    const dayAfterSync = new Date(lastSync);
    dayAfterSync.setDate(dayAfterSync.getDate() + 1);
    // earliest と dayAfterSync の遅い方を採用
    start = dayAfterSync > earliest ? dayAfterSync : earliest;
  } else {
    start = earliest;
  }

  // today は含まない (リアルタイム hook が処理中)
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor < todayDate) {
    dates.push(formatDateStr(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

/**
 * 日次同期を実行する
 *
 * @param rideMetricsEnabled - RideMetrics連携が有効か
 * @param healthConnectEnabled - Health Connect連携が有効か
 * @param processedWorkoutKeys - 処理済みワークアウトキーの配列
 * @param mealsYesterday - 前日食事回数
 * @param lastSyncDate - 前回同期日 (YYYY-MM-DD)。歩数救済の基準日
 * @param monsterBornAt - モンスター誕生日時 (ISO string)。この日付以前のワークアウトを除外
 * @returns 同期結果
 */
export async function executeDailySync(
  rideMetricsEnabled: boolean,
  healthConnectEnabled: boolean,
  processedWorkoutKeys: string[],
  mealsYesterday: number,
  lastSyncDate: string = "",
  monsterBornAt: string = ""
): Promise<DailySyncResult> {
  // 今日の日付 (YYYY-MM-DD)
  const today = formatDateStr(new Date());

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

  // 3. 未処理ワークアウトのTP計算 + ライドWP変換 (bornAt以前を除外)
  const processedSet = new Set(processedWorkoutKeys);
  const bornDate = monsterBornAt ? monsterBornAt.split("T")[0] : "";
  const newWorkouts = workouts.filter(
    (w) => !processedSet.has(w.id) && (!bornDate || w.date >= bornDate)
  );

  const workoutTp: TrainingPoints = { low: 0, mid: 0, high: 0 };
  let rideWp = 0;
  for (const w of newWorkouts) {
    const tp = calculateWorkoutTp(w.zoneTime, w.tss);
    workoutTp.low += tp.low;
    workoutTp.mid += tp.mid;
    workoutTp.high += tp.high;
    rideWp += calculateRideWp(w.distance, w.elevationGain);
  }

  // 4. 規律変動
  const rank = determinePmcRank(ctl, tsb);
  const disciplineChange = calculateDailyDisciplineChange(
    rank,
    mealsYesterday
  );

  // 5. 歩数救済 (アプリ未起動日の歩数・階段 → WP)
  let rescuedWp = 0;
  const rescuedStepDates: string[] = [];
  if (healthConnectEnabled) {
    const datesToRescue = getStepRescueDates(lastSyncDate, today);
    const healthResults = await Promise.all(
      datesToRescue.map((d) => fetchHealthDataForDate(d).catch(() => ({ steps: 0, floors: 0, wp: 0 })))
    );
    for (let i = 0; i < datesToRescue.length; i++) {
      if (healthResults[i].wp > 0) {
        rescuedWp += healthResults[i].wp;
        rescuedStepDates.push(datesToRescue[i]);
      }
    }
  }

  // 6. 通知スケジュール (fire-and-forget)
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
    rideWp,
    disciplineChange,
    summary,
    yesterdaySteps,
    rescuedWp,
    rescuedStepDates,
  };
}

/**
 * 未処理ワークアウトの TP を手動同期する
 *
 * executeDailySync のワークアウト TP 部分のみを抽出した関数。
 * 設定画面の SYNC ボタンから任意タイミングで呼び出せる。
 * processedWorkoutKeys により同期済みワークアウトは自動スキップされる。
 *
 * @param processedWorkoutKeys - 処理済みワークアウトキーの配列
 * @param monsterBornAt - モンスター誕生日時 (ISO string)。この日付以前のワークアウトを除外
 * @returns 同期結果 (TP, 新規ワークアウト数, キー)
 */
export async function syncWorkouts(
  processedWorkoutKeys: string[],
  monsterBornAt: string = ""
): Promise<WorkoutSyncResult> {
  const workouts = await fetchRecentWorkouts(28).catch(
    () => [] as WorkoutZoneData[]
  );

  const processedSet = new Set(processedWorkoutKeys);
  const bornDate = monsterBornAt ? monsterBornAt.split("T")[0] : "";
  const newWorkouts = workouts.filter(
    (w) => !processedSet.has(w.id) && (!bornDate || w.date >= bornDate)
  );

  const workoutTp: TrainingPoints = { low: 0, mid: 0, high: 0 };
  let syncRideWp = 0;
  for (const w of newWorkouts) {
    const tp = calculateWorkoutTp(w.zoneTime, w.tss);
    workoutTp.low += tp.low;
    workoutTp.mid += tp.mid;
    workoutTp.high += tp.high;
    syncRideWp += calculateRideWp(w.distance, w.elevationGain);
  }

  return {
    workoutTp,
    newWorkoutCount: newWorkouts.length,
    newWorkoutKeys: newWorkouts.map((w) => w.id),
    rideWp: syncRideWp,
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
