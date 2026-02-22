/**
 * LCD画面内メニュー選択UI
 *
 * A:左移動, B:決定, C:右移動でメニュー項目を選択する。
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LCD_COLORS } from "./LcdFrame";

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
}

interface MenuButtonsProps {
  /** メニュー項目リスト */
  items: MenuItem[];
  /** 現在選択中のインデックス */
  selectedIndex: number;
}

export function MenuButtons({ items, selectedIndex }: MenuButtonsProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View
          key={item.id}
          style={[styles.menuItem, i === selectedIndex && styles.selected]}
        >
          {i === selectedIndex && (
            <Text style={styles.cursor}>▶</Text>
          )}
          {item.icon && <Text style={styles.icon}>{item.icon}</Text>}
          <Text
            style={[
              styles.label,
              i === selectedIndex && styles.selectedLabel,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  selected: {
    backgroundColor: LCD_COLORS.DOT_MID,
    borderRadius: 2,
  },
  cursor: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    marginRight: 4,
    fontFamily: "monospace",
  },
  icon: {
    fontSize: 10,
    marginRight: 4,
  },
  label: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 11,
    fontFamily: "monospace",
  },
  selectedLabel: {
    color: LCD_COLORS.DOT,
    fontWeight: "bold",
  },
});
