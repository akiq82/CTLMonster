/**
 * プログラマティック・ピクセルアート・モンスタースプライト
 *
 * PNGアセット不要。各モンスターは色インデックスの2D配列で定義。
 * BranchTypeで色テーマが変わる（HP=緑, DEF=青, ATK=赤, BALANCED=金）。
 * 2フレームアイドルアニメーション対応。
 */

import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { EvolutionStage, BranchType } from "../../types/monster";
import { LCD_COLORS } from "./LcdFrame";

/** ピクセルカラーパレット (0=透明, 1=メイン, 2=ハイライト, 3=シャドウ) */
const COLOR_THEMES: Record<string, { main: string; highlight: string; shadow: string }> = {
  [BranchType.HP]: {
    main: LCD_COLORS.DOT,
    highlight: LCD_COLORS.DOT_LIGHT,
    shadow: LCD_COLORS.DOT,
  },
  [BranchType.DEF]: {
    main: LCD_COLORS.DOT,
    highlight: LCD_COLORS.DOT_MID,
    shadow: LCD_COLORS.DOT,
  },
  [BranchType.ATK]: {
    main: LCD_COLORS.DOT,
    highlight: LCD_COLORS.DOT_LIGHT,
    shadow: LCD_COLORS.DOT,
  },
  [BranchType.BALANCED]: {
    main: LCD_COLORS.DOT,
    highlight: LCD_COLORS.DOT_MID,
    shadow: LCD_COLORS.DOT,
  },
  default: {
    main: LCD_COLORS.DOT,
    highlight: LCD_COLORS.DOT_LIGHT,
    shadow: LCD_COLORS.DOT,
  },
};

/** スプライトフレーム: 0=透明, 1=メイン, 2=ハイライト, 3=シャドウ */
type SpriteFrame = readonly (readonly number[])[];

/**
 * 汎用スプライト定義
 * 全モンスターはここで簡易的に8x8/16x16パターンとして定義。
 * 実際のゲームではモンスターIDごとにマッピングするが、
 * Phase 2ではステージ別のジェネリックスプライトを使用する。
 */
const GENERIC_SPRITES: Record<number, { frame1: SpriteFrame; frame2: SpriteFrame; size: number }> = {
  [EvolutionStage.BABY_I]: {
    size: 8,
    frame1: [
      [0,0,1,1,1,1,0,0],
      [0,1,2,2,2,2,1,0],
      [1,2,1,2,2,1,2,1],
      [1,2,2,2,2,2,2,1],
      [1,2,2,1,1,2,2,1],
      [0,1,2,2,2,2,1,0],
      [0,0,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    frame2: [
      [0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,0,0],
      [0,1,2,2,2,2,1,0],
      [1,2,1,2,2,1,2,1],
      [1,2,2,2,2,2,2,1],
      [1,2,2,1,1,2,2,1],
      [0,1,2,2,2,2,1,0],
      [0,0,1,1,1,1,0,0],
    ],
  },
  [EvolutionStage.BABY_II]: {
    size: 8,
    frame1: [
      [0,0,1,1,1,0,0,0],
      [0,1,2,2,2,1,0,0],
      [1,2,1,2,1,2,1,0],
      [1,2,2,2,2,2,1,0],
      [0,1,2,2,2,1,0,0],
      [0,1,3,3,3,1,0,0],
      [0,0,1,0,1,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    frame2: [
      [0,0,0,1,1,1,0,0],
      [0,0,1,2,2,2,1,0],
      [0,1,2,1,2,1,2,1],
      [0,1,2,2,2,2,2,1],
      [0,0,1,2,2,2,1,0],
      [0,0,1,3,3,3,1,0],
      [0,0,0,1,0,1,0,0],
      [0,0,0,0,0,0,0,0],
    ],
  },
  [EvolutionStage.ROOKIE]: {
    size: 16,
    frame1: [
      [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,1,2,2,2,1,2,2,1,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,2,1,1,1,2,2,2,1,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,0,0,1,3,3,1,1,3,3,1,0,0,0,0],
      [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    frame2: [
      [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,1,2,2,1,1,2,2,1,0,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,1,2,2,2,1,2,2,1,0,0,0],
      [0,0,0,1,2,2,2,2,2,2,2,2,1,0,0,0],
      [0,0,0,1,2,2,1,1,1,2,2,2,1,0,0,0],
      [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
      [0,0,0,0,0,1,3,3,3,3,1,0,0,0,0,0],
      [0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,0,0,1,3,3,1,1,3,3,1,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
  },
  [EvolutionStage.CHAMPION]: {
    size: 16,
    frame1: [
      [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0],
      [0,0,1,2,2,2,2,1,1,2,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,1,2,2,2,2,2,1,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,1,1,1,1,1,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,0,1,3,3,3,1,1,1,3,3,3,3,1,0,0],
      [0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0],
      [0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
    frame2: [
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,1,2,2,1,0,0,0,0,1,2,2,1,0,0],
      [0,0,1,2,2,2,1,1,1,1,2,2,2,1,0,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,1,2,2,1,2,2,2,2,2,1,2,2,2,1,0],
      [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
      [0,1,2,2,2,1,1,1,1,1,2,2,2,2,1,0],
      [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
      [0,0,0,1,3,3,3,3,3,3,3,3,1,0,0,0],
      [0,0,1,3,3,3,3,3,3,3,3,3,3,1,0,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
      [0,0,1,3,3,3,1,1,1,3,3,3,3,1,0,0],
      [0,0,0,1,1,1,0,0,0,1,1,1,1,0,0,0],
      [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ],
  },
};

// Ultimate and Mega use the same Champion sprite but larger pixel size
const SPRITE_FALLBACK = GENERIC_SPRITES[EvolutionStage.CHAMPION];

interface MonsterSpriteProps {
  /** 進化段階 */
  stage: EvolutionStage;
  /** 分岐タイプ (色テーマ決定用) */
  branchType?: BranchType;
  /** アニメーション有効 */
  animated?: boolean;
  /** ピクセルサイズ (デフォルト: auto) */
  pixelSize?: number;
}

export function MonsterSprite({
  stage,
  branchType,
  animated = true,
  pixelSize,
}: MonsterSpriteProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, 800);
    return () => clearInterval(interval);
  }, [animated]);

  const sprite = GENERIC_SPRITES[stage] ?? SPRITE_FALLBACK;
  const data = frame === 0 ? sprite.frame1 : sprite.frame2;
  const theme = COLOR_THEMES[branchType ?? "default"] ?? COLOR_THEMES.default;

  // Auto pixel size based on stage
  const autoPixelSize =
    stage <= EvolutionStage.BABY_II ? 10 : stage <= EvolutionStage.ROOKIE ? 6 : 5;
  const px = pixelSize ?? autoPixelSize;

  const getColor = (value: number): string | null => {
    switch (value) {
      case 1: return theme.main;
      case 2: return theme.highlight;
      case 3: return theme.shadow;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      {data.map((row, y) => (
        <View key={y} style={styles.row}>
          {row.map((cell, x) => {
            const color = getColor(cell);
            return (
              <View
                key={x}
                style={[
                  { width: px, height: px },
                  color ? { backgroundColor: color } : null,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
});
