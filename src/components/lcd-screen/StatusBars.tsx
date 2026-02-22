/**
 * HP/寿命/規律バー + TP/WPカウンター
 *
 * LCD画面内に表示されるステータス情報。
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LCD_COLORS } from "./LcdFrame";

interface StatusBarsProps {
  /** 現在HP */
  currentHp: number;
  /** 最大HP */
  maxHp: number;
  /** 規律 (0-100) */
  discipline: number;
  /** 経過日数 */
  daysAlive: number;
  /** 最大寿命（日） */
  maxLifespan: number;
  /** TP-L */
  tpL: number;
  /** TP-M */
  tpM: number;
  /** TP-H */
  tpH: number;
  /** WP */
  wp: number;
}

function PixelBar({
  label,
  current,
  max,
  segments = 10,
}: {
  label: string;
  current: number;
  max: number;
  segments?: number;
}) {
  const fillCount = max > 0 ? Math.round((current / max) * segments) : 0;

  return (
    <View style={styles.barRow}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barContainer}>
        {Array.from({ length: segments }, (_, i) => (
          <View
            key={i}
            style={[
              styles.barSegment,
              i < fillCount ? styles.barFilled : styles.barEmpty,
            ]}
          />
        ))}
      </View>
      <Text style={styles.barValue}>
        {current}/{max}
      </Text>
    </View>
  );
}

export function StatusBars({
  currentHp,
  maxHp,
  discipline,
  daysAlive,
  maxLifespan,
  tpL,
  tpM,
  tpH,
  wp,
}: StatusBarsProps) {
  return (
    <View style={styles.container}>
      <PixelBar label="HP" current={currentHp} max={maxHp} />
      <PixelBar label="DI" current={discipline} max={100} />
      <PixelBar
        label="寿"
        current={Math.max(0, Math.ceil(maxLifespan - daysAlive))}
        max={Math.ceil(maxLifespan)}
      />

      <View style={styles.countersRow}>
        <Text style={styles.counterText}>L:{tpL}</Text>
        <Text style={styles.counterText}>M:{tpM}</Text>
        <Text style={styles.counterText}>H:{tpH}</Text>
        <Text style={styles.counterText}>WP:{wp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  barLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    width: 20,
    fontFamily: "monospace",
  },
  barContainer: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 4,
  },
  barSegment: {
    flex: 1,
    height: 6,
    marginHorizontal: 0.5,
  },
  barFilled: {
    backgroundColor: LCD_COLORS.DOT,
  },
  barEmpty: {
    backgroundColor: LCD_COLORS.DOT_MID,
    opacity: 0.3,
  },
  barValue: {
    color: LCD_COLORS.DOT,
    fontSize: 8,
    fontFamily: "monospace",
    width: 48,
    textAlign: "right",
  },
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 2,
  },
  counterText: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
});
