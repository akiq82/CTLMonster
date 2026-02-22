/**
 * トレーニング選択UIコンポーネント
 *
 * 8メニューリスト表示。TP不足はグレーアウト。
 */

import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import type { TrainingMenuDefinition, TrainingPoints } from "../types/training";
import { canExecuteTraining } from "../engine/training";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface TrainingMenuProps {
  /** トレーニングメニューリスト */
  menus: readonly TrainingMenuDefinition[];
  /** 現在の所持TP */
  availableTp: TrainingPoints;
  /** メニュー選択時コールバック */
  onSelect: (menu: TrainingMenuDefinition) => void;
  /** 戻るボタン */
  onBack: () => void;
}

export function TrainingMenu({
  menus,
  availableTp,
  onSelect,
  onBack,
}: TrainingMenuProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRAINING</Text>
      <ScrollView style={styles.list}>
        {menus.map((menu) => {
          const canDo = canExecuteTraining(menu, availableTp);
          return (
            <Pressable
              key={menu.id}
              style={[styles.menuItem, !canDo && styles.disabled]}
              onPress={() => canDo && onSelect(menu)}
              disabled={!canDo}
            >
              <Text style={[styles.menuName, !canDo && styles.disabledText]}>
                {menu.name}
              </Text>
              <Text style={[styles.menuCost, !canDo && styles.disabledText]}>
                L:{menu.costTpL} M:{menu.costTpM} H:{menu.costTpH}
              </Text>
              <Text style={[styles.menuGain, !canDo && styles.disabledText]}>
                HP+{menu.hpGain.min}-{menu.hpGain.max}{" "}
                ATK+{menu.atkGain.min}-{menu.atkGain.max}{" "}
                DEF+{menu.defGain.min}-{menu.defGain.max}
              </Text>
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
  menuItem: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: LCD_COLORS.DOT_MID,
  },
  disabled: {
    opacity: 0.4,
  },
  menuName: {
    color: LCD_COLORS.DOT,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  menuCost: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  menuGain: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  disabledText: {
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
