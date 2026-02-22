/**
 * RideMetrics データ取得フック (Phase 3 スタブ)
 *
 * Phase 3 で RideMetrics MCP Server API を統合する際に実装する。
 * 現在はスタブデータを返す。
 */

import { useState } from "react";
import type { TrainingSummary } from "../types/ride-metrics";

interface RideMetricsData {
  /** トレーニングサマリー */
  summary: TrainingSummary | null;
  /** データ取得中か */
  loading: boolean;
  /** エラー */
  error: string | null;
}

/**
 * RideMetrics からのトレーニングデータを取得する
 *
 * Phase 3 で実装予定。現在はスタブ。
 */
export function useRideMetrics(): RideMetricsData {
  const [data] = useState<RideMetricsData>({
    summary: null,
    loading: false,
    error: null,
  });

  // Phase 3: ここで RideMetrics API を呼び出す
  // useEffect(() => {
  //   async function fetchRideMetrics() {
  //     setData(d => ({ ...d, loading: true }));
  //     try {
  //       const summary = await fetch('/api/training-summary?sport=cycling');
  //       setData({ summary: await summary.json(), loading: false, error: null });
  //     } catch (e) {
  //       setData(d => ({ ...d, loading: false, error: String(e) }));
  //     }
  //   }
  //   fetchRideMetrics();
  // }, []);

  return data;
}
