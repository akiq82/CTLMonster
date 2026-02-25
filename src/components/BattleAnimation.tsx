/**
 * バトル演出コンポーネント
 *
 * アクション単位でステップ表示する。
 * 各アクションで攻撃者→命中/回避→ダメージ→HP更新を順番に表示。
 */

import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import type { BattleResult, BattleFighter } from "../types/battle";
import { LCD_COLORS } from "./lcd-screen/LcdFrame";

/** ターン内の表示ステップ: 0=ターンヘッダのみ, 1=先攻表示, 2=後攻表示 */
type ActionStep = 0 | 1 | 2;

/** 先攻表示までの遅延 (ms) */
const FIRST_ACTION_DELAY = 250;
/** 後攻表示までの遅延 (先攻表示から, ms) */
const SECOND_ACTION_DELAY = 1000;
/** 次ターンへの遷移遅延 (最後のアクション表示から, ms) */
const NEXT_TURN_DELAY = 1000;

interface BattleAnimationProps {
  /** バトル結果 */
  result: BattleResult;
  /** プレイヤーモンスター名 */
  playerName: string;
  /** 敵モンスター名 */
  enemyName: string;
  /** プレイヤーの初期ステータス */
  playerFighter: BattleFighter;
  /** 敵の初期ステータス */
  enemyFighter: BattleFighter;
  /** バトル完了時コールバック */
  onComplete: () => void;
}

export function BattleAnimation({
  result,
  playerName,
  enemyName,
  playerFighter,
  enemyFighter,
  onComplete,
}: BattleAnimationProps) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(-1);
  const [actionStep, setActionStep] = useState<ActionStep>(0);
  const [phase, setPhase] = useState<"intro" | "battle" | "result">("intro");

  // Intro → battle 遷移
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setPhase("battle");
      setCurrentTurnIndex(0);
      setActionStep(0);
    }, 2000);
    return () => clearTimeout(introTimer);
  }, []);

  // ターン内ステップ進行
  useEffect(() => {
    if (phase !== "battle") return;
    if (currentTurnIndex >= result.turns.length) {
      setPhase("result");
      const resultTimer = setTimeout(onComplete, 2000);
      return () => clearTimeout(resultTimer);
    }

    const turn = result.turns[currentTurnIndex];
    const actionCount = turn.actions.length;

    if (actionStep === 0) {
      // ターン開始 → 0.25秒後に先攻表示
      const timer = setTimeout(() => setActionStep(1), FIRST_ACTION_DELAY);
      return () => clearTimeout(timer);
    }
    if (actionStep === 1 && actionCount >= 2) {
      // 先攻表示 → 1秒後に後攻表示
      const timer = setTimeout(() => setActionStep(2), SECOND_ACTION_DELAY);
      return () => clearTimeout(timer);
    }
    // 最後のアクション表示済み → 1秒後に次ターンへ
    const timer = setTimeout(() => {
      setCurrentTurnIndex((i) => i + 1);
      setActionStep(0);
    }, NEXT_TURN_DELAY);
    return () => clearTimeout(timer);
  }, [phase, currentTurnIndex, actionStep, result.turns, onComplete]);

  const currentTurn = result.turns[currentTurnIndex] ?? null;

  /** 表示済みアクションまでのプレイヤーHP */
  const currentPlayerHp = useMemo(() => {
    if (currentTurnIndex < 0) return playerFighter.currentHp;
    let hp = playerFighter.currentHp;
    for (let t = 0; t <= currentTurnIndex && t < result.turns.length; t++) {
      const maxAction = t < currentTurnIndex
        ? result.turns[t].actions.length
        : actionStep;
      for (let a = 0; a < maxAction; a++) {
        const act = result.turns[t].actions[a];
        if (act.defenderName === playerName) hp = act.defenderRemainingHp;
      }
    }
    return hp;
  }, [currentTurnIndex, actionStep, result.turns, playerName, playerFighter.currentHp]);

  /** 表示済みアクションまでの敵HP */
  const currentEnemyHp = useMemo(() => {
    if (currentTurnIndex < 0) return enemyFighter.currentHp;
    let hp = enemyFighter.currentHp;
    for (let t = 0; t <= currentTurnIndex && t < result.turns.length; t++) {
      const maxAction = t < currentTurnIndex
        ? result.turns[t].actions.length
        : actionStep;
      for (let a = 0; a < maxAction; a++) {
        const act = result.turns[t].actions[a];
        if (act.defenderName === enemyName) hp = act.defenderRemainingHp;
      }
    }
    return hp;
  }, [currentTurnIndex, actionStep, result.turns, enemyName, enemyFighter.currentHp]);

  return (
    <View style={styles.container}>
      {phase === "intro" && (
        <View style={styles.introView}>
          <Text style={styles.title}>BATTLE!</Text>
          <View style={styles.fighterRow}>
            <View style={styles.fighterCard}>
              <Text style={styles.fighterName}>{playerName}</Text>
              <Text style={styles.fighterStat}>HP:{playerFighter.maxHp}</Text>
              <Text style={styles.fighterStat}>ATK:{playerFighter.atk}</Text>
              <Text style={styles.fighterStat}>DEF:{playerFighter.def}</Text>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.fighterCard}>
              <Text style={styles.fighterName}>{enemyName}</Text>
              <Text style={styles.fighterStat}>HP:{enemyFighter.maxHp}</Text>
              <Text style={styles.fighterStat}>ATK:{enemyFighter.atk}</Text>
              <Text style={styles.fighterStat}>DEF:{enemyFighter.def}</Text>
            </View>
          </View>
        </View>
      )}

      {phase === "battle" && currentTurn && (
        <View style={styles.battleView}>
          <Text style={styles.turnLabel}>
            Turn {currentTurn.turnNumber}
          </Text>

          {currentTurn.actions.slice(0, actionStep).map((action, i) => (
            <View key={i} style={styles.actionDetail}>
              <Text style={styles.attackerText}>
                {action.attackerName} →
              </Text>
              <Text style={styles.resultText}>
                {action.hit
                  ? action.evaded
                    ? "MISS (evaded!)"
                    : action.critical
                      ? `CRITICAL! ${action.damage}dmg`
                      : `HIT! ${action.damage}dmg`
                  : "MISS"}
              </Text>
            </View>
          ))}

          <View style={styles.hpRow}>
            <Text style={styles.hpText}>
              {playerName}: {currentPlayerHp}/{playerFighter.maxHp}
            </Text>
            <Text style={styles.hpText}>
              {enemyName}: {currentEnemyHp}/{enemyFighter.maxHp}
            </Text>
          </View>
        </View>
      )}

      {phase === "result" && (
        <View style={styles.center}>
          <Text style={styles.resultBig}>
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
  introView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  fighterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  fighterCard: {
    alignItems: "center",
    padding: 4,
  },
  fighterName: {
    color: LCD_COLORS.DOT,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  fighterStat: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 12,
    fontFamily: "monospace",
  },
  vsText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 14,
    fontFamily: "monospace",
    marginHorizontal: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  battleView: {
    flex: 1,
    justifyContent: "center",
  },
  turnLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  actionDetail: {
    marginBottom: 12,
  },
  attackerText: {
    color: LCD_COLORS.DOT,
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  resultText: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontFamily: "monospace",
  },
  hpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  hpText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 12,
    fontFamily: "monospace",
  },
  resultBig: {
    color: LCD_COLORS.DOT,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  subText: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 4,
  },
});
