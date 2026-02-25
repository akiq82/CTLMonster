/**
 * 進化演出コンポーネント
 *
 * フラッシュエフェクト → 新スプライト表示の演出。
 */

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { EvolutionStage, BranchType } from "../types/monster";
import { MonsterSprite } from "./lcd-screen/MonsterSprite";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface EvolutionSceneProps {
  /** 進化前の段階 */
  fromStage: EvolutionStage;
  /** 進化後の段階 */
  toStage: EvolutionStage;
  /** 進化後の分岐タイプ */
  toBranchType: BranchType;
  /** 進化後のモンスター名 */
  newName: string;
  /** 完了時コールバック */
  onComplete: () => void;
}

type Phase = "flash1" | "flash2" | "flash3" | "reveal" | "name" | "done";

export function EvolutionScene({
  fromStage,
  toStage,
  toBranchType,
  newName,
  onComplete,
}: EvolutionSceneProps) {
  const [phase, setPhase] = useState<Phase>("flash1");

  useEffect(() => {
    const timings: [Phase, number][] = [
      ["flash2", 500],
      ["flash3", 1000],
      ["reveal", 1500],
      ["name", 2500],
      ["done", 4000],
    ];

    const timers = timings.map(([p, delay]) =>
      setTimeout(() => {
        setPhase(p);
        if (p === "done") onComplete();
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const isFlashing = phase === "flash1" || phase === "flash2" || phase === "flash3";

  return (
    <View style={styles.container}>
      {isFlashing && (
        <View
          style={[
            styles.flash,
            phase === "flash1" && { opacity: 0.4 },
            phase === "flash2" && { opacity: 0.7 },
            phase === "flash3" && { opacity: 1.0 },
          ]}
        />
      )}

      {!isFlashing && (
        <View style={styles.center}>
          <Text style={styles.evolveText}>EVOLUTION!</Text>
          <View style={styles.spriteArea}>
            <MonsterSprite
              stage={toStage}
              branchType={toBranchType}
              animated={phase === "reveal" || phase === "name"}
            />
          </View>
          {(phase === "name" || phase === "done") && (
            <Text style={styles.nameText}>{newName}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LCD_COLORS.BG,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  evolveText: {
    color: LCD_COLORS.DOT,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 16,
  },
  spriteArea: {
    marginVertical: 12,
  },
  nameText: {
    color: LCD_COLORS.DOT,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginTop: 8,
  },
});
