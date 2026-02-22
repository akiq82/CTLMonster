/**
 * バトル演出コンポーネント
 *
 * ターン制自動バトルをステップ表示する。
 */

import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BattleResult, BattleTurn } from "../types/battle";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

interface BattleAnimationProps {
  /** バトル結果 */
  result: BattleResult;
  /** プレイヤーモンスター名 */
  playerName: string;
  /** 敵モンスター名 */
  enemyName: string;
  /** バトル完了時コールバック */
  onComplete: () => void;
  /** 表示速度 (ms per turn) */
  turnSpeed?: number;
}

export function BattleAnimation({
  result,
  playerName,
  enemyName,
  onComplete,
  turnSpeed = 1200,
}: BattleAnimationProps) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(-1);
  const [phase, setPhase] = useState<"intro" | "battle" | "result">("intro");

  useEffect(() => {
    // Intro phase
    const introTimer = setTimeout(() => {
      setPhase("battle");
      setCurrentTurnIndex(0);
    }, 1000);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (phase !== "battle") return;
    if (currentTurnIndex >= result.turns.length) {
      setPhase("result");
      const resultTimer = setTimeout(onComplete, 2000);
      return () => clearTimeout(resultTimer);
    }
    const timer = setTimeout(() => {
      setCurrentTurnIndex((i) => i + 1);
    }, turnSpeed);
    return () => clearTimeout(timer);
  }, [phase, currentTurnIndex, result.turns.length, turnSpeed, onComplete]);

  const currentTurn: BattleTurn | undefined = result.turns[currentTurnIndex];

  return (
    <View style={styles.container}>
      {phase === "intro" && (
        <View style={styles.center}>
          <Text style={styles.title}>BATTLE!</Text>
          <Text style={styles.vs}>
            {playerName} VS {enemyName}
          </Text>
        </View>
      )}

      {phase === "battle" && currentTurn && (
        <View style={styles.battleView}>
          <Text style={styles.turnLabel}>
            Turn {currentTurn.turnNumber}
          </Text>
          {currentTurn.actions.map((action, i) => (
            <View key={i} style={styles.actionRow}>
              <Text style={styles.actionText}>
                {action.attackerName}
                {action.hit
                  ? action.critical
                    ? ` CRITICAL! ${action.damage}dmg`
                    : ` ${action.damage}dmg`
                  : action.evaded
                    ? " MISS (evaded)"
                    : " MISS"}
              </Text>
            </View>
          ))}
          <View style={styles.hpRow}>
            <Text style={styles.hpText}>
              {playerName}: {result.turns.slice(0, currentTurnIndex + 1).reduce(
                (hp, t) => {
                  for (const a of t.actions) {
                    if (a.defenderName === playerName) hp = a.defenderRemainingHp;
                  }
                  return hp;
                },
                0
              )}HP
            </Text>
            <Text style={styles.hpText}>
              {enemyName}: {result.turns.slice(0, currentTurnIndex + 1).reduce(
                (hp, t) => {
                  for (const a of t.actions) {
                    if (a.defenderName === enemyName) hp = a.defenderRemainingHp;
                  }
                  return hp;
                },
                0
              )}HP
            </Text>
          </View>
        </View>
      )}

      {phase === "result" && (
        <View style={styles.center}>
          <Text style={styles.resultText}>
            {result.playerWon ? "WIN!" : "LOSE..."}
          </Text>
          <Text style={styles.subText}>
            {result.totalTurns} turns
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  vs: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 11,
    fontFamily: "monospace",
    marginTop: 8,
  },
  battleView: {
    flex: 1,
    justifyContent: "center",
  },
  turnLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  actionRow: {
    marginVertical: 2,
  },
  actionText: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  hpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  hpText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  resultText: {
    color: LCD_COLORS.DOT,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  subText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 4,
  },
});
