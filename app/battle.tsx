/**
 * バトル画面
 *
 * エンカウント → 自動バトル演出。
 */

import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { BattleAnimation } from "../src/components/BattleAnimation";
import { useGameStore } from "../src/store/game-store";
import { useMonsterStore } from "../src/store/monster-store";
import { useWorldStore } from "../src/store/world-store";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import {
  canEncounter,
  getEncounterCost,
  rollEncounter,
  generateEnemy,
  generateBoss,
} from "../src/engine/encounter";
import { executeBattle } from "../src/engine/battle";
import { getWorldDefinition, canChallengeBoss } from "../src/engine/world";
import type { BattleFighter, BattleResult } from "../src/types/battle";

type BattlePhase = "select" | "battling" | "result";

export default function BattleScreen() {
  const router = useRouter();
  const wp = useGameStore((s) => s.wp);
  const consumeWp = useGameStore((s) => s.consumeWp);
  const monster = useMonsterStore((s) => s.monster);
  const applyBattleResult = useMonsterStore((s) => s.applyBattleResult);
  const currentWorldNumber = useWorldStore((s) => s.currentWorldNumber);
  const getCurrentProgress = useWorldStore((s) => s.getCurrentProgress);
  const addMobKill = useWorldStore((s) => s.addMobKill);
  const addBossDefeat = useWorldStore((s) => s.addBossDefeat);

  const [phase, setPhase] = useState<BattlePhase>("select");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [enemyName, setEnemyName] = useState("");
  const [message, setMessage] = useState("");

  const progress = getCurrentProgress();
  const world = useMemo(
    () => getWorldDefinition(currentWorldNumber),
    [currentWorldNumber]
  );
  const canBoss = canChallengeBoss(progress);
  const canMob = canEncounter(wp, false);
  const canBossWp = canEncounter(wp, true);

  const startBattle = useCallback(
    (isBoss: boolean) => {
      if (!monster) return;

      const cost = getEncounterCost(isBoss);
      consumeWp(cost);

      if (!isBoss) {
        const encountered = rollEncounter(false);
        if (!encountered) {
          setMessage("空振り！モンスターは現れなかった...");
          setPhase("result");
          return;
        }
      }

      const player: BattleFighter = {
        name: monster.name,
        currentHp: monster.currentHp,
        maxHp: monster.maxHp,
        atk: monster.atk + (monster.memoryEquipment?.atk ?? 0),
        def: monster.def + (monster.memoryEquipment?.def ?? 0),
        discipline: monster.discipline,
      };

      let enemy: BattleFighter;
      if (isBoss) {
        enemy = generateBoss(world);
      } else {
        enemy = generateEnemy(world.enemies);
      }

      const eDef = MONSTER_DEFINITIONS.get(
        isBoss ? world.boss.monsterId : "unknown"
      );
      setEnemyName(enemy.name);

      const result = executeBattle(player, enemy);
      setBattleResult(result);
      setPhase("battling");

      // Apply results after animation
      applyBattleResult(result);
      if (result.playerWon) {
        if (isBoss) {
          addBossDefeat();
        } else {
          addMobKill();
        }
      }
    },
    [monster, world, consumeWp, applyBattleResult, addMobKill, addBossDefeat]
  );

  const handleBattleComplete = useCallback(() => {
    setPhase("result");
  }, []);

  if (!monster) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => router.back()}
        onPressB={() => {
          if (phase === "result") {
            setBattleResult(null);
            setMessage("");
            setPhase("select");
          }
        }}
        onPressC={() => router.back()}
        buttonLabels={{
          a: "◀ BACK",
          b: phase === "result" ? "OK" : "B ●",
          c: "▶",
        }}
      >
        {phase === "select" && (
          <View style={styles.selectView}>
            <Text style={styles.title}>
              W{currentWorldNumber} {world.name}
            </Text>
            <Text style={styles.progress}>
              撃破: {progress.killCount}/15
              {progress.bossDefeated ? " ★CLEARED" : ""}
            </Text>
            <Text style={styles.wpText}>WP: {wp}</Text>

            <Pressable
              style={[styles.btn, !canMob && styles.btnDisabled]}
              onPress={() => startBattle(false)}
              disabled={!canMob}
            >
              <Text style={[styles.btnText, !canMob && styles.btnTextDisabled]}>
                MOB BATTLE (3000WP)
              </Text>
            </Pressable>

            {canBoss && !progress.bossDefeated && (
              <Pressable
                style={[styles.btn, styles.bossBtn, !canBossWp && styles.btnDisabled]}
                onPress={() => startBattle(true)}
                disabled={!canBossWp}
              >
                <Text style={[styles.btnText, !canBossWp && styles.btnTextDisabled]}>
                  BOSS BATTLE (5000WP)
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {phase === "battling" && battleResult && (
          <BattleAnimation
            result={battleResult}
            playerName={monster.name}
            enemyName={enemyName}
            onComplete={handleBattleComplete}
            turnSpeed={800}
          />
        )}

        {phase === "result" && (
          <View style={styles.resultView}>
            {message ? (
              <Text style={styles.resultMsg}>{message}</Text>
            ) : battleResult ? (
              <>
                <Text style={styles.resultText}>
                  {battleResult.playerWon ? "VICTORY!" : "DEFEAT..."}
                </Text>
                <Text style={styles.resultSub}>
                  {battleResult.totalTurns} turns
                </Text>
                <Text style={styles.resultSub}>
                  HP: {battleResult.playerRemainingHp}
                </Text>
              </>
            ) : null}
            <Text style={styles.hint}>Press B to continue</Text>
          </View>
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
    justifyContent: "center",
    padding: 16,
  },
  selectView: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  progress: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 4,
  },
  wpText: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 8,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 2,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  bossBtn: {
    backgroundColor: LCD_COLORS.DOT_LIGHT,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  btnTextDisabled: {
    color: LCD_COLORS.DOT_MID,
  },
  resultView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  resultText: {
    color: LCD_COLORS.DOT,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  resultMsg: {
    color: LCD_COLORS.DOT,
    fontSize: 11,
    fontFamily: "monospace",
    textAlign: "center",
  },
  resultSub: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 4,
  },
  hint: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 8,
    fontFamily: "monospace",
    marginTop: 16,
  },
});
