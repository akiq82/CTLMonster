/**
 * HP/寿命/規律バー + TP/WPカウンター
 *
 * LCD画面内に表示されるステータス情報。
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LCD_COLORS } from "./LcdFrame";
import { WP_CONSTANTS } from "../../types/battle";

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
  /** ベースTP (未配分) */
  baseTp?: number;
  /** TP-L */
  tpL: number;
  /** TP-M */
  tpM: number;
  /** TP-H */
  tpH: number;
  /** WP */
  wp: number;
  /** エンカウント回数 */
  encounterCount: number;
  /** 本日の食事回数 */
  mealsToday: number;
  /** 残り食事ボーナス回数 */
  mealBonusRemaining: number;
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
  baseTp = 0,
  tpL,
  tpM,
  tpH,
  wp,
  encounterCount,
  mealsToday,
  mealBonusRemaining,
}: StatusBarsProps) {
  const remainingDays = Math.max(0, maxLifespan - daysAlive);
  const remainingHours = Math.floor((remainingDays % 1) * 24);
  const remainingWholeDays = Math.floor(remainingDays);

  return (
    <View style={styles.container}>
      <PixelBar label="HP" current={currentHp} max={maxHp} />
      <PixelBar label="DI" current={discipline} max={100} />
      <PixelBar
        label="寿"
        current={Math.max(0, Math.ceil(maxLifespan - daysAlive))}
        max={Math.ceil(maxLifespan)}
      />

      {/* Lifespan remaining detail + meal count */}
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>
          残:{remainingWholeDays}日{remainingHours}h
        </Text>
        <Text style={styles.infoText}>
          食:{mealsToday}/3{mealBonusRemaining > 0 ? ` x1.1(${mealBonusRemaining})` : ""}
        </Text>
      </View>

      <View style={styles.countersRow}>
        {baseTp > 0 && <Text style={styles.counterHighlight}>B:{baseTp}</Text>}
        <Text style={styles.counterText}>L:{tpL}</Text>
        <Text style={styles.counterText}>M:{tpM}</Text>
        <Text style={styles.counterText}>H:{tpH}</Text>
        <Text style={styles.counterText}>
          EN:{encounterCount} ▲{(WP_CONSTANTS.ENCOUNTER_WP_COST - wp).toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 1,
  },
  barLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 13,
    fontWeight: "bold",
    width: 26,
    fontFamily: "monospace",
  },
  barContainer: {
    flexDirection: "row",
    flex: 1,
    marginHorizontal: 4,
  },
  barSegment: {
    flex: 1,
    height: 8,
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
    fontSize: 11,
    fontFamily: "monospace",
    width: 60,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 2,
  },
  infoText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 11,
    fontFamily: "monospace",
  },
  countersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 2,
  },
  counterText: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  counterHighlight: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "bold",
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingHorizontal: 2,
  },
});
