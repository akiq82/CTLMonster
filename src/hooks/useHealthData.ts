/**
 * Health Connect データ取得フック
 *
 * settings-store の healthConnectEnabled フラグに基づいて
 * 歩数・階段データを取得しWPを計算する。
 *
 * Android: Health Connect API から5分ごとにポーリング
 * Web: 利用不可 (0を返す)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useSettingsStore } from "../store/settings-store";
import {
  fetchHealthData,
  isHealthConnectAvailable,
  initializeHealthConnect,
} from "../services/health-connect";

/** ポーリング間隔 (5分) */
const POLL_INTERVAL_MS = 5 * 60 * 1000;

interface HealthData {
  /** 今日の歩数 */
  steps: number;
  /** 今日の階段数 */
  floors: number;
  /** 計算されたWP */
  wp: number;
  /** データ取得中か */
  loading: boolean;
  /** エラー */
  error: string | null;
}

/**
 * Health Connect からの歩数・階段データを取得する
 */
export function useHealthData(): HealthData {
  const healthConnectEnabled = useSettingsStore(
    (s) => s.healthConnectEnabled
  );
  const [data, setData] = useState<HealthData>({
    steps: 0,
    floors: 0,
    wp: 0,
    loading: false,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  const doFetch = useCallback(async () => {
    setData((d) => ({ ...d, loading: true, error: null }));
    try {
      const result = await fetchHealthData();
      setData({
        steps: result.steps,
        floors: result.floors,
        wp: result.wp,
        loading: false,
        error: null,
      });
    } catch (e) {
      setData((d) => ({
        ...d,
        loading: false,
        error: e instanceof Error ? e.message : String(e),
      }));
    }
  }, []);

  useEffect(() => {
    if (!healthConnectEnabled || !isHealthConnectAvailable()) {
      setData({ steps: 0, floors: 0, wp: 0, loading: false, error: null });
      return;
    }

    // 初回: Health Connect SDK を初期化 (権限リクエストは行わない)
    // 権限は設定画面で toggleHealthConnect した時に別途リクエスト済み
    async function init() {
      if (!initializedRef.current) {
        initializedRef.current = true;
        const ok = await initializeHealthConnect();
        if (!ok) {
          setData((d) => ({
            ...d,
            error: "Health Connect の初期化に失敗しました",
          }));
          return;
        }
      }
      doFetch();
    }

    init();

    // 5分ごとにポーリング
    intervalRef.current = setInterval(doFetch, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [healthConnectEnabled, doFetch]);

  return data;
}
