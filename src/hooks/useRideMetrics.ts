/**
 * RideMetrics データ取得フック
 *
 * settings-store の rideMetricsEnabled フラグに基づいて
 * RideMetrics MCP Server からフィットネスサマリーを取得する。
 *
 * 取得頻度: マウント時 + 4時間ごと (stale check)
 */

import { useState, useEffect, useCallback } from "react";
import { useSettingsStore } from "../store/settings-store";
import { useGameStore } from "../store/game-store";
import { fetchTrainingSummary } from "../services/ride-metrics";
import type { TrainingSummary } from "../types/ride-metrics";

/** stale 判定の閾値 (4時間) */
const STALE_THRESHOLD_MS = 4 * 60 * 60 * 1000;

interface RideMetricsData {
  /** トレーニングサマリー */
  summary: TrainingSummary | null;
  /** データ取得中か */
  loading: boolean;
  /** エラー */
  error: string | null;
  /** 手動リフレッシュ */
  refresh: () => void;
}

/**
 * RideMetrics からのトレーニングデータを取得する
 */
export function useRideMetrics(): RideMetricsData {
  const rideMetricsEnabled = useSettingsStore((s) => s.rideMetricsEnabled);
  const lastFetch = useGameStore((s) => s.lastRideMetricsFetch);
  const updateFetch = useGameStore((s) => s.updateRideMetricsFetch);

  const [summary, setSummary] = useState<TrainingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = useCallback(async () => {
    if (!rideMetricsEnabled) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrainingSummary();
      setSummary(data);
      updateFetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [rideMetricsEnabled, updateFetch]);

  useEffect(() => {
    if (!rideMetricsEnabled) {
      setSummary(null);
      return;
    }

    // stale check: 前回取得から閾値以上経過していれば再取得
    const isStale =
      !lastFetch ||
      Date.now() - new Date(lastFetch).getTime() > STALE_THRESHOLD_MS;

    if (isStale) {
      doFetch();
    }
  }, [rideMetricsEnabled, lastFetch, doFetch]);

  return { summary, loading, error, refresh: doFetch };
}
