/**
 * 設定画面
 */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { useSettingsStore } from "../src/store/settings-store";

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

          <Text style={styles.section}>Player</Text>
          <View style={styles.infoRow}>
            <Text style={styles.toggleLabel}>Weight</Text>
            <Text style={styles.toggleValue}>{weight}kg</Text>
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
  version: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 16,
  },
});
