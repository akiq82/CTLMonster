/**
 * Health Connect データ取得フック (Phase 3 スタブ)
 *
 * Phase 3 で react-native-health-connect を統合する際に実装する。
 * 現在はスタブデータを返す。
 */

import { useState, useEffect } from "react";

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
 *
 * Phase 3 で実装予定。現在はスタブ。
 */
export function useHealthData(): HealthData {
  const [data, setData] = useState<HealthData>({
    steps: 0,
    floors: 0,
    wp: 0,
    loading: false,
    error: null,
  });

  // Phase 3: ここで Health Connect API を呼び出す
  // useEffect(() => {
  //   async function fetchHealthData() {
  //     setData(d => ({ ...d, loading: true }));
  //     try {
  //       const steps = await getSteps();
  //       const floors = await getFloors();
  //       const wp = steps * WP_PER_STEP + floors * WP_PER_FLOOR;
  //       setData({ steps, floors, wp, loading: false, error: null });
  //     } catch (e) {
  //       setData(d => ({ ...d, loading: false, error: String(e) }));
  //     }
  //   }
  //   fetchHealthData();
  // }, []);

  return data;
}
