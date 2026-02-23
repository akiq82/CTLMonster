/**
 * 設定画面
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { useSettingsStore } from "../src/store/settings-store";
import { useGameStore } from "../src/store/game-store";
import { useMonsterStore } from "../src/store/monster-store";
import { useWorldStore } from "../src/store/world-store";
import { useEncyclopediaStore } from "../src/store/encyclopedia-store";
import { useSlotStore } from "../src/store/slot-store";
import { syncWorkouts } from "../src/services/daily-sync";

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.toggleRow} onPress={onToggle}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleValue}>{value ? "ON" : "OFF"}</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const healthConnectEnabled = useSettingsStore((s) => s.healthConnectEnabled);
  const rideMetricsEnabled = useSettingsStore((s) => s.rideMetricsEnabled);
  const weight = useSettingsStore((s) => s.weight);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications);
  const toggleHealthConnect = useSettingsStore((s) => s.toggleHealthConnect);
  const toggleRideMetrics = useSettingsStore((s) => s.toggleRideMetrics);

  const monster = useMonsterStore((s) => s.monster);
  const processedWorkoutKeys = useGameStore((s) => s.processedWorkoutKeys);
  const addTp = useGameStore((s) => s.addTp);
  const addWp = useGameStore((s) => s.addWp);
  const markWorkoutProcessed = useGameStore((s) => s.markWorkoutProcessed);
  const updateRideMetricsFetch = useGameStore((s) => s.updateRideMetricsFetch);

  const resetGame = useGameStore((s) => s.resetGame);
  const setMonster = useMonsterStore((s) => s.setMonster);
  const resetWorlds = useWorldStore((s) => s.resetWorlds);
  const resetEncyclopedia = useEncyclopediaStore((s) => s.resetEncyclopedia);
  const updateActiveSummary = useSlotStore((s) => s.updateActiveSummary);

  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">("idle");
  const [syncMessage, setSyncMessage] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleReset = useCallback(() => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    // Execute reset
    resetGame();
    setMonster(null);
    resetWorlds();
    resetEncyclopedia();
    updateActiveSummary({
      occupied: false,
      monsterName: "",
      definitionId: "",
      generation: 0,
      phase: "new_game",
    });
    setResetConfirm(false);
    router.back();
  }, [resetConfirm, resetGame, setMonster, resetWorlds, resetEncyclopedia, updateActiveSummary, router]);

  const handleSync = useCallback(async () => {
    setSyncStatus("syncing");
    setSyncMessage("");
    try {
      const result = await syncWorkouts(processedWorkoutKeys, monster?.bornAt ?? "");
      if (result.newWorkoutCount === 0) {
        setSyncMessage("No new workouts");
      } else {
        addTp(result.workoutTp);
        if (result.rideWp > 0) {
          addWp(result.rideWp);
        }
        for (const key of result.newWorkoutKeys) {
          markWorkoutProcessed(key);
        }
        updateRideMetricsFetch();
        const parts: string[] = [];
        if (result.workoutTp.low > 0) parts.push(`+${Math.round(result.workoutTp.low)}L`);
        if (result.workoutTp.mid > 0) parts.push(`+${Math.round(result.workoutTp.mid)}M`);
        if (result.workoutTp.high > 0) parts.push(`+${Math.round(result.workoutTp.high)}H`);
        if (result.rideWp > 0) parts.push(`+${result.rideWp}WP`);
        setSyncMessage(`${parts.join(" ")} (${result.newWorkoutCount} workout${result.newWorkoutCount > 1 ? "s" : ""})`);
      }
    } catch {
      setSyncMessage("Sync failed");
    }
    setSyncStatus("done");
  }, [processedWorkoutKeys, addTp, addWp, markWorkoutProcessed, updateRideMetricsFetch]);

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => router.back()}
        buttonLabels={{ a: "◀ BACK", b: "TOGGLE", c: "▶" }}
      >
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>SETTINGS</Text>

          <Text style={styles.section}>General</Text>
          <ToggleRow label="Sound" value={soundEnabled} onToggle={toggleSound} />
          <ToggleRow
            label="Notifications"
            value={notificationsEnabled}
            onToggle={toggleNotifications}
          />

          <Text style={styles.section}>Connections</Text>
          {Platform.OS === "android" ? (
            <ToggleRow
              label="Health Connect"
              value={healthConnectEnabled}
              onToggle={toggleHealthConnect}
            />
          ) : (
            <View style={styles.infoRow}>
              <Text style={styles.toggleLabel}>Health Connect</Text>
              <Text style={styles.toggleValue}>N/A</Text>
            </View>
          )}
          <ToggleRow
            label="RideMetrics"
            value={rideMetricsEnabled}
            onToggle={toggleRideMetrics}
          />
          {rideMetricsEnabled && (
            <View style={styles.syncRow}>
              <Pressable
                style={[styles.syncButton, syncStatus === "syncing" && styles.syncButtonDisabled]}
                onPress={handleSync}
                disabled={syncStatus === "syncing"}
              >
                <Text style={styles.syncButtonText}>
                  {syncStatus === "syncing" ? "SYNCING..." : "SYNC"}
                </Text>
              </Pressable>
              {syncMessage !== "" && (
                <Text style={styles.syncMessage}>{syncMessage}</Text>
              )}
            </View>
          )}

          <Text style={styles.section}>Player</Text>
          <View style={styles.infoRow}>
            <Text style={styles.toggleLabel}>Weight</Text>
            <Text style={styles.toggleValue}>{weight}kg</Text>
          </View>

          <Text style={styles.section}>Danger Zone</Text>
          <View style={styles.resetRow}>
            <Pressable
              style={[
                styles.resetButton,
                resetConfirm && styles.resetButtonConfirm,
              ]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>
                {resetConfirm ? "CONFIRM RESET" : "RESET SLOT"}
              </Text>
            </Pressable>
            {resetConfirm && (
              <View style={styles.resetWarningRow}>
                <Text style={styles.resetWarning}>
                  全データが消えます。もう一度押すと実行。
                </Text>
                <Pressable onPress={() => setResetConfirm(false)}>
                  <Text style={styles.resetCancel}>CANCEL</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Text style={styles.version}>CTLMonster v1.0.0</Text>
        </ScrollView>
      </LcdFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  scroll: {
    flex: 1,
    padding: 8,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginTop: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: LCD_COLORS.DOT_MID,
    paddingBottom: 2,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  toggleLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
  },
  toggleValue: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  syncRow: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  syncButton: {
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    color: LCD_COLORS.BG,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  syncMessage: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
    marginTop: 3,
  },
  resetRow: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  resetButton: {
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  resetButtonConfirm: {
    backgroundColor: LCD_COLORS.DOT,
  },
  resetButtonText: {
    color: LCD_COLORS.BG,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  resetWarningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  resetWarning: {
    color: LCD_COLORS.DOT,
    fontSize: 8,
    fontFamily: "monospace",
    flex: 1,
  },
  resetCancel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  version: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 16,
  },
});
