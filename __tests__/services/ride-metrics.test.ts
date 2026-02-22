/**
 * RideMetrics サービスのテスト
 *
 * MCP JSON-RPC クライアントのレスポンスマッピングを検証する。
 */

import { generateWorkoutKey } from "../../src/services/ride-metrics";

describe("ride-metrics service", () => {
  describe("generateWorkoutKey", () => {
    it("should generate a unique key from date, title, and tss", () => {
      const key = generateWorkoutKey("2026-02-21", "Morning Ride", 97);
      expect(key).toBe("2026-02-21|Morning Ride|97");
    });

    it("should generate different keys for different workouts on same day", () => {
      const key1 = generateWorkoutKey("2026-02-21", "Morning Ride", 97);
      const key2 = generateWorkoutKey("2026-02-21", "Evening Ride", 45);
      expect(key1).not.toBe(key2);
    });

    it("should handle empty title", () => {
      const key = generateWorkoutKey("2026-02-16", "", 18);
      expect(key).toBe("2026-02-16||18");
    });

    it("should handle zero TSS", () => {
      const key = generateWorkoutKey("2026-02-20", "Recovery", 0);
      expect(key).toBe("2026-02-20|Recovery|0");
    });
  });
});
