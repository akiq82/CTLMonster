/**
 * RideMetrics API レスポンス型
 * CLAUDE.md の MCP Server API セクションに基づく
 */

/** PMCボーナス計算に使用するフィットネスサマリー */
export interface TrainingSummary {
  /** Chronic Training Load */
  ctl: number;
  /** Acute Training Load */
  atl: number;
  /** Training Stress Balance (CTL - ATL) */
  tsb: number;
  /** 週間TSS */
  weeklyTss: number;
  /** FTP (Functional Threshold Power) */
  ftp: number;
}

/** ワークアウトのゾーン別データ */
export interface WorkoutZoneData {
  /** ワークアウトID */
  id: string;
  /** ワークアウト日時 (ISO string) */
  date: string;
  /** ワークアウト名 */
  name: string;
  /** TSS */
  tss: number;
  /** Intensity Factor */
  intensityFactor: number;
  /** ゾーン別滞在時間（秒） */
  zoneTime: {
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
    z6: number;
    z7: number;
  };
  /** 走行距離 (km) */
  distance: number;
  /** 獲得標高 (meters) */
  elevationGain: number;
}

/** PMCボーナスランク */
export enum PmcRank {
  /** CTL≥80, TSB≤-15 */
  A = "A",
  /** CTL≥65, TSB≤0 */
  B = "B",
  /** CTL≥50, TSB≤+15 */
  C = "C",
  /** CTL<50 or TSB>+15 */
  D = "D",
}

/** PMCボーナス計算結果 */
export interface PmcBonusResult {
  /** PMCランク */
  rank: PmcRank;
  /** PMC係数 (0.5〜1.5) */
  pmcFactor: number;
  /** 歩数係数 (0〜1.5) */
  stepsFactor: number;
  /** 基礎TP合計 */
  totalTp: number;
  /** TP-L付与量 */
  tpL: number;
  /** TP-M付与量 */
  tpM: number;
  /** TP-H付与量 */
  tpH: number;
}
