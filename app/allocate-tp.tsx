/**
 * ベースTP配分画面
 *
 * PMCボーナス + バトルXPで獲得したベースTPを
 * L/M/Hに手動配分する。LCD3ボタンで操作。
 *
 * A: カーソル移動 (L → M → H → CONFIRM → L)
 * B: +1 配分 (CONFIRM行なら確定)
 * C: +5 配分 (CONFIRM行ならキャンセルして戻る)
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { useGameStore } from "../src/store/game-store";

type Row = "L" | "M" | "H" | "CONFIRM";
const ROWS: Row[] = ["L", "M", "H", "CONFIRM"];

export default function AllocateTpScreen() {
  const router = useRouter();
  const baseTp = useGameStore((s) => s.baseTp);
  const allocateBaseTp = useGameStore((s) => s.allocateBaseTp);

  const [cursor, setCursor] = useState(0);
  const [alloc, setAlloc] = useState({ L: 0, M: 0, H: 0 });

  const allocated = alloc.L + alloc.M + alloc.H;
  const remaining = baseTp - allocated;

  const handleA = useCallback(() => {
    setCursor((i) => (i + 1) % ROWS.length);
  }, []);

  const addToRow = useCallback(
    (amount: number) => {
      const row = ROWS[cursor];
      if (row === "CONFIRM") return;
      const actual = Math.min(amount, remaining);
      if (actual <= 0) return;
      setAlloc((prev) => ({ ...prev, [row]: prev[row] + actual }));
      // Auto-move to CONFIRM when all allocated
      if (remaining - actual === 0 && allocated + actual > 0) {
        setCursor(ROWS.indexOf("CONFIRM"));
      }
    },
    [cursor, remaining, allocated]
  );

  const handleB = useCallback(() => {
    const row = ROWS[cursor];
    if (row === "CONFIRM") {
      if (allocated > 0) {
        allocateBaseTp(alloc.L, alloc.M, alloc.H);
      }
      router.back();
      return;
    }
    addToRow(1);
  }, [cursor, allocated, alloc, allocateBaseTp, addToRow, router]);

  const handleC = useCallback(() => {
    const row = ROWS[cursor];
    if (row === "CONFIRM") {
      // Cancel: go back without allocating
      router.back();
      return;
    }
    addToRow(5);
  }, [cursor, addToRow, router]);

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={handleA}
        onPressB={handleB}
        onPressC={handleC}
        buttonLabels={{ a: "A SEL", b: "B +1", c: "C +5" }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>BASE TP: {remaining}</Text>

          {(["L", "M", "H"] as const).map((key) => {
            const idx = ROWS.indexOf(key);
            const selected = cursor === idx;
            return (
              <View
                key={key}
                style={[styles.row, selected && styles.rowSelected]}
              >
                <Text style={styles.cursor}>{selected ? "\u25B6" : " "}</Text>
                <Text style={styles.label}>{key}:</Text>
                <Text style={styles.value}>{alloc[key]}</Text>
              </View>
            );
          })}

          <View style={styles.separator} />

          <View
            style={[
              styles.row,
              cursor === ROWS.indexOf("CONFIRM") && styles.rowSelected,
            ]}
          >
            <Text style={styles.cursor}>
              {cursor === ROWS.indexOf("CONFIRM") ? "\u25B6" : " "}
            </Text>
            <Text style={styles.confirmLabel}>
              {allocated > 0 ? "CONFIRM" : "BACK"}
            </Text>
          </View>

          <View style={styles.hintRow}>
            <Text style={styles.hint}>A:SEL B:+1/OK C:+5/CANCEL</Text>
          </View>
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
    padding: 12,
    justifyContent: "center",
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  rowSelected: {
    backgroundColor: LCD_COLORS.DOT_MID,
  },
  cursor: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
    width: 14,
  },
  label: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    width: 24,
  },
  value: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: LCD_COLORS.DOT_MID,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  confirmLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  hintRow: {
    marginTop: 12,
    alignItems: "center",
  },
  hint: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 7,
    fontFamily: "monospace",
  },
});
