/**
 * 食事質問モーダル
 *
 * 朝昼晩の食事を自己申告で記録する。
 */

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface MealPromptProps {
  /** 現在の食事回数 */
  mealsToday: number;
  /** 食事記録コールバック */
  onEat: () => void;
  /** スキップ */
  onSkip: () => void;
}

const MEAL_LABELS = ["朝食", "昼食", "夕食"] as const;

export function MealPrompt({
  mealsToday,
  onEat,
  onSkip,
}: MealPromptProps) {
  const mealName = MEAL_LABELS[mealsToday] ?? "食事";
  const canEat = mealsToday < 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MEAL TIME</Text>
      <Text style={styles.question}>
        {canEat
          ? `${mealName}を食べましたか？`
          : "本日の食事は完了です"}
      </Text>
      <Text style={styles.count}>
        今日: {mealsToday}/3
      </Text>

      {canEat && (
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={onEat}>
            <Text style={styles.buttonText}>はい</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onSkip}>
            <Text style={styles.buttonText}>いいえ</Text>
          </Pressable>
        </View>
      )}

      {!canEat && (
        <Pressable style={styles.button} onPress={onSkip}>
          <Text style={styles.buttonText}>OK</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  question: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontFamily: "monospace",
    textAlign: "center",
  },
  count: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 12,
    fontFamily: "monospace",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  button: {
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 2,
  },
  buttonText: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
