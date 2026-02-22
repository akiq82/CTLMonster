/**
 * ワールド選択画面
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame } from "../src/components/lcd-screen/LcdFrame";
import { WorldMap } from "../src/components/WorldMap";
import { useWorldStore } from "../src/store/world-store";

export default function WorldSelectScreen() {
  const router = useRouter();
  const availableWorlds = useWorldStore((s) => s.getAvailable());
  const worldProgressMap = useWorldStore((s) => s.worldProgressMap);
  const currentWorldNumber = useWorldStore((s) => s.currentWorldNumber);
  const selectWorld = useWorldStore((s) => s.selectWorld);

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => router.back()}
        buttonLabels={{ a: "◀ BACK", b: "SELECT", c: "▶" }}
      >
        <WorldMap
          availableWorlds={availableWorlds}
          worldProgressMap={worldProgressMap}
          currentWorldNumber={currentWorldNumber}
          onSelect={(wn) => {
            selectWorld(wn);
            router.back();
          }}
          onBack={() => router.back()}
        />
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
});
