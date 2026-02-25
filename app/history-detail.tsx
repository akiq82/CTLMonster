/**
 * 世代履歴詳細画面
 *
 * 特定世代の日次ログをスクロール表示する。
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { useEncyclopediaStore } from "../src/store/encyclopedia-store";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { index } = useLocalSearchParams<{ index: string }>();
  const generationHistory = useEncyclopediaStore((s) => s.generationHistory);

  const genIndex = Number(index ?? 0);
  const record = generationHistory[genIndex];

  const [logIndex, setLogIndex] = useState(0);

  const handleUp = useCallback(() => {
    setLogIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleDown = useCallback(() => {
    if (!record) return;
    setLogIndex((i) => Math.min(record.dailyLogs.length - 1, i + 1));
  }, [record]);

  if (!record) {
    return (
      <View style={styles.container}>
        <LcdFrame
          onPressA={() => router.back()}
          onPressB={() => router.back()}
          onPressC={() => router.back()}
          buttonLabels={{ a: "BACK", b: "B", c: "BACK" }}
        >
          <View style={styles.centerContent}>
            <Text style={styles.title}>Record not found</Text>
          </View>
        </LcdFrame>
      </View>
    );
  }

  const monsterDef = MONSTER_DEFINITIONS.get(record.finalFormId);
  const logs = record.dailyLogs;
  const currentLog = logs[logIndex];

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={handleUp}
        onPressB={() => router.back()}
        onPressC={handleDown}
        buttonLabels={{ a: "A UP", b: "B BACK", c: "C DOWN" }}
      >
        <View style={styles.content}>
          {/* Header: Generation summary */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>
              G{record.generation} {record.name}
            </Text>
            <Text style={styles.subTitle}>
              {monsterDef?.name ?? record.finalFormId} | {record.daysLived}d | W{record.highestWorld}
            </Text>
            <Text style={styles.statsLine}>
              HP:{record.finalHp} ATK:{record.finalAtk} DEF:{record.finalDef} | {record.wins}W/{record.losses}L
            </Text>
          </View>

          {/* Daily log display */}
          {logs.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyText}>No daily logs</Text>
            </View>
          ) : currentLog ? (
            <View style={styles.logBlock}>
              <View style={styles.logHeader}>
                <Text style={styles.logDate}>{currentLog.date}</Text>
                <Text style={styles.logCounter}>
                  {logIndex + 1}/{logs.length}
                </Text>
              </View>

              <View style={styles.logRow}>
                <Text style={styles.logLabel}>WP:</Text>
                <Text style={styles.logValue}>{currentLog.wpGained}</Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>TP:</Text>
                <Text style={styles.logValue}>
                  L:{currentLog.tpGained.low} M:{currentLog.tpGained.mid} H:{currentLog.tpGained.high}
                </Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>Base TP:</Text>
                <Text style={styles.logValue}>{currentLog.baseTpGained}</Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>Battle:</Text>
                <Text style={styles.logValue}>
                  {currentLog.battlesWon}W/{currentLog.battlesLost}L
                </Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>Train:</Text>
                <Text style={styles.logValue}>{currentLog.trainingSessions}x</Text>
              </View>
              {currentLog.bossDefeated && (
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Boss:</Text>
                  <Text style={styles.logValueHighlight}>
                    W{currentLog.bossWorldNumber} CLEAR!
                  </Text>
                </View>
              )}
              <View style={styles.logRow}>
                <Text style={styles.logLabel}>World:</Text>
                <Text style={styles.logValue}>W{currentLog.worldNumber}</Text>
              </View>
            </View>
          ) : null}
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
    padding: 6,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBlock: {
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: LCD_COLORS.DOT_MID,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  subTitle: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  statsLine: {
    color: LCD_COLORS.DOT,
    fontSize: 8,
    fontFamily: "monospace",
    marginTop: 2,
  },
  emptyText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontFamily: "monospace",
  },
  logBlock: {
    flex: 1,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  logDate: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  logCounter: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  logLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    width: 60,
  },
  logValue: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  logValueHighlight: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
});
