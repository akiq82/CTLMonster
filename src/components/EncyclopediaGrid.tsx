/**
 * 図鑑グリッドコンポーネント
 *
 * 全モンスターをグリッド表示。未発見はシルエット。
 */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import type { MonsterDefinition } from "../types/monster";
import { EvolutionStage } from "../types/monster";
import { MONSTER_DEFINITIONS } from "../data/monsters";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface EncyclopediaGridProps {
  /** 発見済みモンスターIDリスト */
  discoveredIds: string[];
  /** モンスター選択時コールバック */
  onSelect: (monster: MonsterDefinition) => void;
  /** 戻るボタン */
  onBack: () => void;
}

const STAGE_LABELS: Record<number, string> = {
  [EvolutionStage.BABY_I]: "幼年期I",
  [EvolutionStage.BABY_II]: "幼年期II",
  [EvolutionStage.ROOKIE]: "成長期",
  [EvolutionStage.CHAMPION]: "成熟期",
  [EvolutionStage.ULTIMATE]: "完全体",
  [EvolutionStage.MEGA]: "究極体",
};

export function EncyclopediaGrid({
  discoveredIds,
  onSelect,
  onBack,
}: EncyclopediaGridProps) {
  const allMonsters = Array.from(MONSTER_DEFINITIONS.values()).filter(
    (m) => !m.isEnemyOnly
  );

  const byStage = new Map<number, MonsterDefinition[]>();
  for (const m of allMonsters) {
    const list = byStage.get(m.stage) ?? [];
    list.push(m);
    byStage.set(m.stage, list);
  }

  const discoveredSet = new Set(discoveredIds);
  const totalPlayable = allMonsters.length;
  const totalDiscovered = allMonsters.filter((m) =>
    discoveredSet.has(m.id)
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ENCYCLOPEDIA {totalDiscovered}/{totalPlayable}
      </Text>
      <ScrollView style={styles.scroll}>
        {[
          EvolutionStage.BABY_I,
          EvolutionStage.BABY_II,
          EvolutionStage.ROOKIE,
          EvolutionStage.CHAMPION,
          EvolutionStage.ULTIMATE,
          EvolutionStage.MEGA,
        ].map((stage) => {
          const monsters = byStage.get(stage) ?? [];
          if (monsters.length === 0) return null;
          return (
            <View key={stage}>
              <Text style={styles.stageLabel}>
                {STAGE_LABELS[stage]}
              </Text>
              <View style={styles.grid}>
                {monsters.map((m) => {
                  const discovered = discoveredSet.has(m.id);
                  return (
                    <Pressable
                      key={m.id}
                      style={[
                        styles.cell,
                        !discovered && styles.cellHidden,
                      ]}
                      onPress={() => discovered && onSelect(m)}
                      disabled={!discovered}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          !discovered && styles.cellTextHidden,
                        ]}
                      >
                        {discovered ? m.name.slice(0, 3) : "???"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
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
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  stageLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 4,
    marginBottom: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  cell: {
    width: 42,
    height: 28,
    backgroundColor: LCD_COLORS.DOT_MID,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cellHidden: {
    backgroundColor: LCD_COLORS.DOT,
    opacity: 0.2,
  },
  cellText: {
    color: LCD_COLORS.DOT,
    fontSize: 7,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  cellTextHidden: {
    color: LCD_COLORS.DOT_MID,
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
