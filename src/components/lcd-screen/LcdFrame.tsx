/**
 * LCD液晶風デバイス筐体フレーム
 *
 * たまごっち/デジモン準拠のレトロデバイス風外観。
 * - 外枠: ダークグレーの角丸矩形（デバイス本体）
 * - LCD領域: 薄緑(#9BBC0F)背景 + スキャンライン効果
 * - 3ボタン: [A:←] [B:決定] [C:→]
 */

import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

/** LCD画面の色定数 */
export const LCD_COLORS = {
  /** LCD背景色 (ゲームボーイ風薄緑) */
  BG: "#9BBC0F",
  /** LCDドット色 (暗い緑) */
  DOT: "#0F380F",
  /** LCDドット色 薄め */
  DOT_LIGHT: "#306230",
  /** LCDドット色 中間 */
  DOT_MID: "#8BAC0F",
  /** 筐体色 */
  BODY: "#2a2a3e",
  /** 筐体ハイライト */
  BODY_HIGHLIGHT: "#3a3a52",
  /** ボタン色 */
  BUTTON: "#4a4a6a",
  /** ボタン押下色 */
  BUTTON_PRESSED: "#3a3a52",
  /** ボタンテキスト */
  BUTTON_TEXT: "#c0c0d0",
} as const;

interface LcdFrameProps {
  /** LCD領域に表示するコンテンツ */
  children: React.ReactNode;
  /** Aボタン(左)が押された時 */
  onPressA?: () => void;
  /** Bボタン(決定)が押された時 */
  onPressB?: () => void;
  /** Cボタン(右)が押された時 */
  onPressC?: () => void;
  /** ボタンラベル (デフォルト: A←, B決定, C→) */
  buttonLabels?: { a?: string; b?: string; c?: string };
}

export function LcdFrame({
  children,
  onPressA,
  onPressB,
  onPressC,
  buttonLabels,
}: LcdFrameProps) {
  return (
    <View style={styles.body}>
      {/* デバイスタイトル */}
      <Text style={styles.title}>DigiRide</Text>

      {/* LCD画面 */}
      <View style={styles.screenBorder}>
        <View style={styles.screen}>
          {children}
          {/* スキャンライン効果 */}
          <View style={styles.scanlines} pointerEvents="none" />
        </View>
      </View>

      {/* 3ボタン */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPressA}
        >
          <Text style={styles.buttonText}>
            {buttonLabels?.a ?? "A ◀"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.buttonCenter,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPressB}
        >
          <Text style={styles.buttonText}>
            {buttonLabels?.b ?? "B ●"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPressC}
        >
          <Text style={styles.buttonText}>
            {buttonLabels?.c ?? "C ▶"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: LCD_COLORS.BODY,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 480,
    width: "100%",
  },
  title: {
    color: LCD_COLORS.BUTTON_TEXT,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  screenBorder: {
    backgroundColor: "#1a1a28",
    borderRadius: 8,
    padding: 6,
    width: "100%",
  },
  screen: {
    backgroundColor: LCD_COLORS.BG,
    borderRadius: 4,
    minHeight: 380,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  scanlines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    // Simulate scanlines with a repeating border pattern
    borderTopWidth: 1,
    borderColor: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: LCD_COLORS.BUTTON,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: 90,
    alignItems: "center",
  },
  buttonCenter: {
    minWidth: 100,
  },
  buttonPressed: {
    backgroundColor: LCD_COLORS.BUTTON_PRESSED,
  },
  buttonText: {
    color: LCD_COLORS.BUTTON_TEXT,
    fontSize: 16,
    fontWeight: "bold",
  },
});
