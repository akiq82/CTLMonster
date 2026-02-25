/**
 * Health Connect サービス (歩数・階段データ取得)
 *
 * Android: react-native-health-connect を使用して Health Connect API から取得
 * Web: 手動入力フォールバック（将来的に Web Pedometer API 対応可能）
 *
 * WP変換:
 *   1歩 = 1 WP
 *   1階 = 100 WP
 */

import { Platform } from "react-native";

/** WP変換定数 */
export const WP_PER_STEP = 1;
export const WP_PER_FLOOR = 100;

/** Health Connect から取得したデータ */
export interface HealthData {
  /** 歩数 */
  steps: number;
  /** 階段数 */
  floors: number;
  /** WP (steps * 1 + floors * 100) */
  wp: number;
}

/**
 * Health Connect SDK の初期化のみ (権限リクエストなし)
 *
 * 起動時に安全に呼べる。requestPermission() は Activity が完全に
 * 準備されていないと HealthConnectPermissionDelegate の lateinit が
 * 未初期化のままクラッシュするため、ここでは呼ばない。
 *
 * @returns SDK の初期化が成功したか
 */
export async function initializeHealthConnect(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    const { initialize } = await import("react-native-health-connect");
    return await initialize();
  } catch {
    return false;
  }
}

/**
 * Health Connect の権限をリクエストする
 *
 * Activity が完全に準備された後 (ユーザーが設定画面で明示的にONにした時) に
 * のみ呼ぶこと。起動直後に呼ぶとネイティブ側でクラッシュする。
 *
 * @returns 権限が付与されたか
 */
export async function requestHealthConnectPermissions(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    const { requestPermission } = await import("react-native-health-connect");

    const granted = await requestPermission([
      { accessType: "read", recordType: "Steps" },
      { accessType: "read", recordType: "FloorsClimbed" },
    ]);

    return granted.length > 0;
  } catch {
    return false;
  }
}

/**
 * Health Connect が利用可能かチェックする
 */
export function isHealthConnectAvailable(): boolean {
  return Platform.OS === "android";
}

/**
 * 今日の歩数を取得する
 *
 * @returns 歩数 (Health Connect 未対応の場合は 0)
 */
async function getTodaySteps(): Promise<number> {
  if (Platform.OS !== "android") return 0;

  try {
    const { readRecords } = await import("react-native-health-connect");

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const result = await readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });

    return result.records.reduce(
      (sum: number, r: { count: number }) => sum + r.count,
      0
    );
  } catch {
    return 0;
  }
}

/**
 * 今日の階段数を取得する
 *
 * @returns 階段数 (Health Connect 未対応の場合は 0)
 */
async function getTodayFloors(): Promise<number> {
  if (Platform.OS !== "android") return 0;

  try {
    const { readRecords } = await import("react-native-health-connect");

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const result = await readRecords("FloorsClimbed", {
      timeRangeFilter: {
        operator: "between",
        startTime: startOfDay.toISOString(),
        endTime: now.toISOString(),
      },
    });

    return result.records.reduce(
      (sum: number, r: { floors: number }) => sum + r.floors,
      0
    );
  } catch {
    return 0;
  }
}

/**
 * 前日の歩数を取得する（PMCボーナス計算用）
 *
 * @returns 前日の歩数
 */
export async function getYesterdaySteps(): Promise<number> {
  if (Platform.OS !== "android") return 0;

  try {
    const { readRecords } = await import("react-native-health-connect");

    const now = new Date();
    const startOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    const endOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const result = await readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: startOfYesterday.toISOString(),
        endTime: endOfYesterday.toISOString(),
      },
    });

    return result.records.reduce(
      (sum: number, r: { count: number }) => sum + r.count,
      0
    );
  } catch {
    return 0;
  }
}

/**
 * 今日の歩数・階段データをまとめて取得しWPを計算する
 *
 * @returns HealthData (steps, floors, wp)
 */
export async function fetchHealthData(): Promise<HealthData> {
  const [steps, floors] = await Promise.all([
    getTodaySteps(),
    getTodayFloors(),
  ]);

  return {
    steps,
    floors,
    wp: steps * WP_PER_STEP + floors * WP_PER_FLOOR,
  };
}

/**
 * 指定日 (YYYY-MM-DD) の歩数・階段データを取得しWPを計算する
 *
 * アプリを開かなかった日の歩数救済に使用する。
 * 指定日の 00:00〜翌日 00:00 の範囲でデータを取得する。
 *
 * @param dateStr - 取得対象日 (YYYY-MM-DD)
 * @returns HealthData (steps, floors, wp)
 */
export async function fetchHealthDataForDate(
  dateStr: string
): Promise<HealthData> {
  if (Platform.OS !== "android") {
    return { steps: 0, floors: 0, wp: 0 };
  }

  try {
    const { readRecords } = await import("react-native-health-connect");

    const [year, month, day] = dateStr.split("-").map(Number);
    const startOfDay = new Date(year, month - 1, day);
    const endOfDay = new Date(year, month - 1, day + 1);

    const [stepsResult, floorsResult] = await Promise.all([
      readRecords("Steps", {
        timeRangeFilter: {
          operator: "between",
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      }),
      readRecords("FloorsClimbed", {
        timeRangeFilter: {
          operator: "between",
          startTime: startOfDay.toISOString(),
          endTime: endOfDay.toISOString(),
        },
      }),
    ]);

    const steps = stepsResult.records.reduce(
      (sum: number, r: { count: number }) => sum + r.count,
      0
    );
    const floors = floorsResult.records.reduce(
      (sum: number, r: { floors: number }) => sum + r.floors,
      0
    );

    return {
      steps,
      floors,
      wp: steps * WP_PER_STEP + floors * WP_PER_FLOOR,
    };
  } catch {
    return { steps: 0, floors: 0, wp: 0 };
  }
}
