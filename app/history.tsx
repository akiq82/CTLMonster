/**
 * 世代履歴一覧画面
 *
 * 過去の世代をリスト表示し、タップで日次ログ詳細に遷移する。
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { useEncyclopediaStore, type GenerationRecord } from "../src/store/encyclopedia-store";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";

export default function HistoryScreen() {
  const router = useRouter();
  const generationHistory = useEncyclopediaStore((s) => s.generationHistory);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Show newest first
  const sorted = [...generationHistory].reverse();

  const handleUp = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleDown = useCallback(() => {
    setSelectedIndex((i) => Math.min(sorted.length - 1, i + 1));
  }, [sorted.length]);

  const handleSelect = useCallback(() => {
    if (sorted.length === 0) {
      router.back();
      return;
    }
    const record = sorted[selectedIndex];
    if (record) {
      // Pass generation index (original order) via query param
      const originalIndex = generationHistory.length - 1 - selectedIndex;
      router.push(`/history-detail?index=${originalIndex}`);
    }
  }, [sorted, selectedIndex, generationHistory.length, router]);

  if (sorted.length === 0) {
    return (
      <View style={styles.container}>
        <LcdFrame
          onPressA={() => router.back()}
          onPressB={() => router.back()}
          onPressC={() => router.back()}
          buttonLabels={{ a: "BACK", b: "B", c: "BACK" }}
        >
          <View style={styles.emptyContent}>
            <Text style={styles.title}>HISTORY</Text>
            <Text style={styles.emptyText}>No generations yet.</Text>
            <Text style={styles.hint}>Raise and lose a monster to see its history here.</Text>
          </View>
        </LcdFrame>
      </View>
    );
  }

  // Visible window (show up to 4 items)
  const VISIBLE_COUNT = 4;
  const scrollStart = Math.max(0, Math.min(selectedIndex - 1, sorted.length - VISIBLE_COUNT));
  const visibleItems = sorted.slice(scrollStart, scrollStart + VISIBLE_COUNT);

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={handleUp}
        onPressB={handleSelect}
        onPressC={handleDown}
        buttonLabels={{ a: "A UP", b: "B SELECT", c: "C DOWN" }}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>HISTORY</Text>
            <Text style={styles.countLabel}>{generationHistory.length} gen</Text>
          </View>

          {visibleItems.map((record, i) => {
            const actualIndex = scrollStart + i;
            const monsterDef = MONSTER_DEFINITIONS.get(record.finalFormId);
            const isSelected = actualIndex === selectedIndex;

            return (
              <View
                key={`${record.generation}-${record.diedAt}`}
                style={[styles.listItem, isSelected && styles.listItemSelected]}
              >
                <View style={styles.itemRow}>
                  <Text style={styles.cursor}>{isSelected ? ">" : " "}</Text>
                  <Text style={styles.genNumber}>G{record.generation}</Text>
                  <Text style={styles.monsterName} numberOfLines={1}>
                    {record.name}
                  </Text>
                </View>
                <View style={styles.itemDetail}>
                  <Text style={styles.detailText}>
                    {monsterDef?.name ?? record.finalFormId} {record.daysLived}d W{record.highestWorld}
                  </Text>
                  <Text style={styles.detailText}>
                    {record.wins}W/{record.losses}L
                  </Text>
                </View>
              </View>
            );
          })}

          {sorted.length > VISIBLE_COUNT && (
            <Text style={styles.scrollHint}>
              {selectedIndex + 1}/{sorted.length}
            </Text>
          )}
        </View>
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
  content: {
    flex: 1,
    padding: 8,
  },
  emptyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  countLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  emptyText: {
    color: LCD_COLORS.DOT,
    fontSize: 11,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  hint: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
    textAlign: "center",
  },
  listItem: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  listItemSelected: {
    backgroundColor: LCD_COLORS.DOT_MID,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cursor: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
    width: 8,
  },
  genNumber: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
    width: 28,
  },
  monsterName: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
    flex: 1,
  },
  itemDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 40,
  },
  detailText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  scrollHint: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 4,
  },
});
