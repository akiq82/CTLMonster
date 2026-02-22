/**
 * ワールド選択マップ
 *
 * W1-W8の縦リスト。ロック状態と進行率を表示。
 */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import type { WorldDefinition, WorldProgress } from "../types/world";
import { WORLD_DEFINITIONS } from "../data/worlds";
import { getWorldProgressRate } from "../engine/world";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface WorldMapProps {
  /** 選択可能なワールド番号 */
  availableWorlds: number[];
  /** 各ワールドの進行状態 */
  worldProgressMap: Record<number, WorldProgress>;
  /** 現在選択中のワールド番号 */
  currentWorldNumber: number;
  /** ワールド選択コールバック */
  onSelect: (worldNumber: number) => void;
  /** 戻るボタン */
  onBack: () => void;
}

export function WorldMap({
  availableWorlds,
  worldProgressMap,
  currentWorldNumber,
  onSelect,
  onBack,
}: WorldMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WORLD MAP</Text>
      <ScrollView style={styles.list}>
        {WORLD_DEFINITIONS.map((world) => {
          const available = availableWorlds.includes(world.worldNumber);
          const progress = worldProgressMap[world.worldNumber];
          const rate = progress ? getWorldProgressRate(progress) : 0;
          const isCurrent = world.worldNumber === currentWorldNumber;
          const cleared = progress?.bossDefeated ?? false;

          return (
            <Pressable
              key={world.worldNumber}
              style={[
                styles.worldItem,
                !available && styles.locked,
                isCurrent && styles.current,
              ]}
              onPress={() => available && onSelect(world.worldNumber)}
              disabled={!available}
            >
              <View style={styles.worldHeader}>
                <Text
                  style={[
                    styles.worldNumber,
                    !available && styles.lockedText,
                  ]}
                >
                  W{world.worldNumber}
                </Text>
                <Text
                  style={[
                    styles.worldName,
                    !available && styles.lockedText,
                  ]}
                >
                  {available ? world.name : "???"}
                </Text>
                {cleared && <Text style={styles.clearedBadge}>★</Text>}
              </View>
              {available && (
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${rate * 100}%` }]}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>◀ BACK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 4,
  },
  list: {
    flex: 1,
  },
  worldItem: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: LCD_COLORS.DOT_MID,
  },
  locked: {
    opacity: 0.3,
  },
  current: {
    backgroundColor: LCD_COLORS.DOT_MID,
    borderRadius: 2,
  },
  worldHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  worldNumber: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
    width: 28,
  },
  worldName: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
    flex: 1,
  },
  lockedText: {
    color: LCD_COLORS.DOT_MID,
  },
  clearedBadge: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
  },
  progressBar: {
    height: 3,
    backgroundColor: LCD_COLORS.DOT_MID,
    borderRadius: 1,
    marginTop: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: LCD_COLORS.DOT,
  },
  backButton: {
    paddingVertical: 6,
    alignItems: "center",
  },
  backText: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
