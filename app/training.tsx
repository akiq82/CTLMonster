/**
 * トレーニング画面
 *
 * メニュー選択 → トレーニング実行 → 結果表示。
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { TrainingMenu } from "../src/components/TrainingMenu";
import { useGameStore } from "../src/store/game-store";
import { useMonsterStore } from "../src/store/monster-store";
import { useEncyclopediaStore } from "../src/store/encyclopedia-store";
import { TRAINING_MENUS } from "../src/data/training-menus";
import type { TrainingMenuDefinition, TrainingResult } from "../src/types/training";

export default function TrainingScreen() {
  const router = useRouter();
  const tp = useGameStore((s) => s.tp);
  const consumeTp = useGameStore((s) => s.consumeTp);
  const monster = useMonsterStore((s) => s.monster);
  const train = useMonsterStore((s) => s.train);
  const updateDailyLog = useEncyclopediaStore((s) => s.updateDailyLog);

  const [result, setResult] = useState<TrainingResult | null>(null);

  const handleSelect = useCallback(
    (menu: TrainingMenuDefinition) => {
      consumeTp({ low: menu.costTpL, mid: menu.costTpM, high: menu.costTpH });
      const r = train(menu);
      setResult(r);
      const today = new Date().toISOString().split("T")[0];
      updateDailyLog(today, { trainingSessions: 1 });
    },
    [consumeTp, train, updateDailyLog]
  );

  if (!monster) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => {
          if (result) {
            setResult(null);
          } else {
            router.back();
          }
        }}
        onPressB={() => {
          if (result) setResult(null);
        }}
        onPressC={() => {
          if (result) {
            setResult(null);
          } else {
            router.back();
          }
        }}
        buttonLabels={{
          a: "◀ BACK",
          b: result ? "OK" : "B ●",
          c: "▶",
        }}
      >
        {result ? (
          <View style={styles.resultView}>
            <Text style={styles.title}>TRAINING COMPLETE!</Text>
            <Text style={styles.resultLine}>HP +{result.hpGain}</Text>
            <Text style={styles.resultLine}>ATK +{result.atkGain}</Text>
            <Text style={styles.resultLine}>DEF +{result.defGain}</Text>
            {result.mealBonusApplied && (
              <Text style={styles.bonus}>食事ボーナス適用!</Text>
            )}
            <Text style={styles.hint}>Press any button to continue</Text>
          </View>
        ) : (
          <TrainingMenu
            menus={TRAINING_MENUS}
            availableTp={tp}
            onSelect={handleSelect}
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
  resultView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  resultLine: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginVertical: 2,
  },
  bonus: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 8,
  },
  hint: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
    marginTop: 16,
  },
});
