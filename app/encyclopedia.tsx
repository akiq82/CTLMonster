/**
 * 図鑑画面
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { EncyclopediaGrid } from "../src/components/EncyclopediaGrid";
import { MonsterSprite } from "../src/components/lcd-screen/MonsterSprite";
import { useEncyclopediaStore } from "../src/store/encyclopedia-store";
import type { MonsterDefinition } from "../src/types/monster";

export default function EncyclopediaScreen() {
  const router = useRouter();
  const discoveredIds = useEncyclopediaStore((s) => s.discoveredIds);
  const [selected, setSelected] = useState<MonsterDefinition | null>(null);

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => {
          if (selected) {
            setSelected(null);
          } else {
            router.back();
          }
        }}
        buttonLabels={{ a: "◀ BACK", b: "SELECT", c: "▶" }}
      >
        {selected ? (
          <ScrollView style={styles.detail} contentContainerStyle={styles.detailContent}>
            <MonsterSprite stage={selected.stage} animated />
            <Text style={styles.detailName}>{selected.name}</Text>
            <Text style={styles.detailId}>{selected.id}</Text>
            <Text style={styles.detailDesc}>{selected.description}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Base HP: {selected.baseStats.hp}</Text>
              <Text style={styles.statLabel}>ATK: {selected.baseStats.atk}</Text>
              <Text style={styles.statLabel}>DEF: {selected.baseStats.def}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cap HP: {selected.statCaps.hp}</Text>
              <Text style={styles.statLabel}>ATK: {selected.statCaps.atk}</Text>
              <Text style={styles.statLabel}>DEF: {selected.statCaps.def}</Text>
            </View>
            <Pressable style={styles.backBtn} onPress={() => setSelected(null)}>
              <Text style={styles.backBtnText}>◀ BACK</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <EncyclopediaGrid
            discoveredIds={discoveredIds}
            onSelect={setSelected}
            onBack={() => router.back()}
          />
        )}
      </LcdFrame>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    padding: 8,
  },
  detail: {
    flex: 1,
  },
  detailContent: {
    alignItems: "center",
    padding: 12,
  },
  detailName: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginTop: 8,
  },
  detailId: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  detailDesc: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 14,
  },
  statRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  statLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  backBtn: {
    marginTop: 12,
    padding: 8,
  },
  backBtnText: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
