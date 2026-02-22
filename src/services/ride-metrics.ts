/**
 * RideMetrics MCP Server クライアント
 *
 * MCP Streamable HTTP transport (JSON-RPC 2.0) を使用して
 * RideMetrics サーバーからフィットネスデータを取得する。
 *
 * エンドポイント: https://ride-metrics.vercel.app/api/mcp
 *
 * 使用ツール:
 *   - get_training_summary: CTL/ATL/TSB, 週間TSS, FTP
 *   - get_recent_workouts: ゾーン別滞在時間付きワークアウト一覧
 */

import type { TrainingSummary, WorkoutZoneData } from "../types/ride-metrics";

const MCP_ENDPOINT = "https://ride-metrics.vercel.app/api/mcp";

/** MCP セッション ID (初期化後に設定) */
let sessionId: string | null = null;

/** JSON-RPC リクエストID用カウンタ */
let requestId = 1;

/**
 * MCP セッションを初期化する
 *
 * Streamable HTTP transport: POST で initialize → initialized 通知を送信。
 * サーバーが返す Mcp-Session-Id ヘッダーを保持する。
 */
async function initSession(): Promise<void> {
  const res = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "digiride", version: "1.0.0" },
      },
      id: requestId++,
    }),
  });

  // Extract session ID from response header
  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;

  // Parse response (may be JSON or SSE)
  await parseJsonRpcResponse(res);

  // Send initialized notification (no id = notification)
  await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    }),
  });
}

/**
 * JSON-RPC レスポンスをパースする
 *
 * Content-Type が text/event-stream の場合は SSE から最初のデータを抽出。
 * application/json の場合はそのまま JSON.parse。
 */
async function parseJsonRpcResponse(
  res: Response
): Promise<{ result?: unknown; error?: { code: number; message: string } }> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("text/event-stream")) {
    // SSE: 各行を解析して最初の JSON-RPC result を返す
    const text = await res.text();
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data) {
          return JSON.parse(data);
        }
      }
    }
    throw new Error("No data in SSE response");
  }

  return res.json();
}

/**
 * MCP ツールを呼び出す汎用関数
 *
 * @param toolName - ツール名 (例: "get_training_summary")
 * @param args - ツール引数
 * @returns ツール実行結果 (JSON パース済み)
 */
async function callTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  if (!sessionId) {
    await initSession();
  }

  const res = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(sessionId ? { "Mcp-Session-Id": sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: toolName, arguments: args },
      id: requestId++,
    }),
  });

  const json = await parseJsonRpcResponse(res);

  if (json.error) {
    // セッション期限切れの場合はリトライ
    if (json.error.code === -32600 || json.error.code === -32001) {
      sessionId = null;
      return callTool(toolName, args);
    }
    throw new Error(`MCP error: ${json.error.message}`);
  }

  // MCP tool results: { content: [{ type: "text", text: "..." }] }
  const result = json.result as {
    content?: Array<{ type: string; text: string }>;
  };
  const textContent = result?.content?.find((c) => c.type === "text");
  if (!textContent?.text) {
    throw new Error("Empty tool response");
  }

  return JSON.parse(textContent.text);
}

// --- Raw API response types (MCP tool output shapes) ---

interface RawTrainingSummaryResponse {
  pmc: {
    current: { ctl: number; atl: number; tsb: number };
  };
  weeklyTSS: Array<{ weekStart: string; tss: number; workoutCount: number }>;
  ftpHistory: Array<{ date: string; ftp: number }>;
}

interface RawWorkout {
  date: string;
  title: string;
  sport: string;
  duration: number;
  tss: number;
  intensityFactor: number;
  zoneTime: {
    ss?: number;
    z1: number;
    z2: number;
    z3: number;
    z4: number;
    z5: number;
    z6: number;
    z7: number;
  };
}

interface RawRecentWorkoutsResponse {
  workouts: RawWorkout[];
}

// --- Public API ---

/**
 * トレーニングサマリーを取得する（PMCボーナス計算用）
 *
 * @returns CTL/ATL/TSB, 週間TSS, FTP
 */
export async function fetchTrainingSummary(): Promise<TrainingSummary> {
  const raw = (await callTool("get_training_summary", {
    sport: "cycling",
  })) as RawTrainingSummaryResponse;

  return {
    ctl: raw.pmc.current.ctl,
    atl: raw.pmc.current.atl,
    tsb: raw.pmc.current.tsb,
    weeklyTss: raw.weeklyTSS?.[0]?.tss ?? 0,
    ftp: raw.ftpHistory?.[0]?.ftp ?? 0,
  };
}

/**
 * 最近のワークアウト一覧を取得する（ゾーン別TP計算用）
 *
 * @param days - 何日前まで取得するか (デフォルト 28)
 * @returns ワークアウトデータ配列
 */
export async function fetchRecentWorkouts(
  days: number = 28
): Promise<WorkoutZoneData[]> {
  const raw = (await callTool("get_recent_workouts", {
    sport: "cycling",
    days,
  })) as RawRecentWorkoutsResponse;

  return raw.workouts.map((w) => ({
    id: generateWorkoutKey(w.date, w.title, w.tss),
    date: w.date,
    name: w.title || "Workout",
    tss: w.tss,
    intensityFactor: w.intensityFactor,
    zoneTime: {
      z1: w.zoneTime.z1,
      z2: w.zoneTime.z2,
      z3: w.zoneTime.z3,
      z4: w.zoneTime.z4,
      z5: w.zoneTime.z5,
      z6: w.zoneTime.z6,
      z7: w.zoneTime.z7,
    },
  }));
}

/**
 * ワークアウトの一意キーを生成する（重複処理防止用）
 *
 * @param date - ワークアウト日 (YYYY-MM-DD)
 * @param title - ワークアウト名
 * @param tss - TSS値
 * @returns 一意キー文字列
 */
export function generateWorkoutKey(
  date: string,
  title: string,
  tss: number
): string {
  return `${date}|${title}|${tss}`;
}

/**
 * MCP セッションをリセットする（エラーリカバリ用）
 */
export function resetSession(): void {
  sessionId = null;
}
