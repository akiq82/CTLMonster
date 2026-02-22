/**
 * 通知サービス
 *
 * Android: expo-notifications
 * Web: Web Notifications API
 *
 * 通知タイミング:
 *   - 朝ログインリマインダー (毎朝8:00)
 *   - 食事リマインダー (12:00, 19:00)
 *   - 放置警告 (12時間ログインなし)
 */

import { Platform } from "react-native";

/** 通知チャンネル ID (Android) */
const CHANNEL_ID = "digiride-game";

/** 通知の種類 */
export type NotificationType =
  | "morning_reminder"
  | "meal_reminder"
  | "neglect_warning";

/**
 * 通知の権限をリクエストする
 *
 * @returns 権限が付与されたか
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") {
    if (!("Notification" in globalThis)) return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  // Android: expo-notifications
  try {
    const Notifications = await import("expo-notifications");
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "DigiRide",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    return status === "granted";
  } catch {
    return false;
  }
}

/**
 * ローカル通知をスケジュールする
 *
 * @param type - 通知種類
 * @param title - タイトル
 * @param body - 本文
 * @param triggerDate - トリガー日時
 */
export async function scheduleNotification(
  type: NotificationType,
  title: string,
  body: string,
  triggerDate: Date
): Promise<void> {
  if (Platform.OS === "web") {
    // Web: setTimeout で簡易スケジュール (タブが開いている間のみ)
    const delay = triggerDate.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        if ("Notification" in globalThis && Notification.permission === "granted") {
          new Notification(title, { body, tag: type });
        }
      }, delay);
    }
    return;
  }

  // Android: expo-notifications
  try {
    const Notifications = await import("expo-notifications");
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  } catch {
    // 通知失敗は無視（ゲーム進行に影響しない）
  }
}

/**
 * 朝ログインリマインダーをスケジュールする
 * 翌朝8:00に「モンスターが待っています」通知
 */
export async function scheduleMorningReminder(): Promise<void> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  await scheduleNotification(
    "morning_reminder",
    "DigiRide",
    "モンスターが待っています！ログインしてPMCボーナスを受け取りましょう。",
    tomorrow
  );
}

/**
 * 食事リマインダーをスケジュールする
 *
 * @param mealTime - "lunch" (12:00) or "dinner" (19:00)
 */
export async function scheduleMealReminder(
  mealTime: "lunch" | "dinner"
): Promise<void> {
  const trigger = new Date();
  trigger.setHours(mealTime === "lunch" ? 12 : 19, 0, 0, 0);

  // 過ぎていたら翌日に
  if (trigger.getTime() <= Date.now()) {
    trigger.setDate(trigger.getDate() + 1);
  }

  await scheduleNotification(
    "meal_reminder",
    "DigiRide",
    mealTime === "lunch"
      ? "お昼ごはんの時間です！食事を記録しましょう。"
      : "夕食の時間です！食事を記録しましょう。",
    trigger
  );
}

/**
 * 放置警告をスケジュールする（最終ログインから12時間後）
 *
 * @param lastLoginAt - 最終ログイン日時 (ISO string)
 */
export async function scheduleNeglectWarning(
  lastLoginAt: string
): Promise<void> {
  const trigger = new Date(lastLoginAt);
  trigger.setHours(trigger.getHours() + 12);

  if (trigger.getTime() <= Date.now()) return;

  await scheduleNotification(
    "neglect_warning",
    "DigiRide",
    "モンスターが弱っています！早くログインしてください！",
    trigger
  );
}

/**
 * 全てのスケジュール済み通知をキャンセルする
 */
export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    const Notifications = await import("expo-notifications");
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
