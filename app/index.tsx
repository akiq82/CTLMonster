/**
 * メイン育成画面
 *
 * LcdFrame内にモンスタースプライト、ステータスバー、メニューを表示。
 * ゲームの中心となる画面。
 */

import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { MonsterSprite } from "../src/components/lcd-screen/MonsterSprite";
import { StatusBars } from "../src/components/lcd-screen/StatusBars";
import { MenuButtons, type MenuItem } from "../src/components/lcd-screen/MenuButtons";
import { MealPrompt } from "../src/components/MealPrompt";
import { useGameStore } from "../src/store/game-store";
import { useMonsterStore } from "../src/store/monster-store";
import { useWorldStore } from "../src/store/world-store";
import { useEncyclopediaStore } from "../src/store/encyclopedia-store";
import { MONSTER_DEFINITIONS, STARTER_MONSTER_IDS } from "../src/data/monsters";
import { EvolutionStage, type BranchType } from "../src/types/monster";
import { determineBranchType } from "../src/engine/evolution";
import { useDailySync } from "../src/hooks/useDailySync";
import { useHealthData } from "../src/hooks/useHealthData";
import { useGameLoop } from "../src/hooks/useGameLoop";

const MAIN_MENU: MenuItem[] = [
  { id: "status", label: "STATUS" },
  { id: "train", label: "TRAIN" },
  { id: "battle", label: "BATTLE" },
  { id: "world", label: "WORLD" },
  { id: "meal", label: "MEAL" },
  { id: "book", label: "BOOK" },
  { id: "settings", label: "CONFIG" },
];

export default function HomeScreen() {
  const router = useRouter();
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const tp = useGameStore((s) => s.tp);
  const wp = useGameStore((s) => s.wp);
  const monster = useMonsterStore((s) => s.monster);
  const createMonster = useMonsterStore((s) => s.createMonster);
  const recordMeal = useMonsterStore((s) => s.recordMeal);
  const discover = useEncyclopediaStore((s) => s.discover);

  // Game loop & external data hooks
  useGameLoop();
  useDailySync();
  const healthData = useHealthData();

  // Add WP from health data when it changes
  const addWp = useGameStore((s) => s.addWp);
  const lastWpRef = React.useRef(0);
  React.useEffect(() => {
    if (healthData.wp > lastWpRef.current) {
      const delta = healthData.wp - lastWpRef.current;
      addWp(delta);
      lastWpRef.current = healthData.wp;
    }
  }, [healthData.wp, addWp]);

  const [menuIndex, setMenuIndex] = useState(0);
  const [showMeal, setShowMeal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const handleLeft = useCallback(() => {
    setMenuIndex((i) => (i - 1 + MAIN_MENU.length) % MAIN_MENU.length);
  }, []);

  const handleRight = useCallback(() => {
    setMenuIndex((i) => (i + 1) % MAIN_MENU.length);
  }, []);

  const handleSelect = useCallback(() => {
    if (showMeal) return;
    const item = MAIN_MENU[menuIndex];
    switch (item.id) {
      case "status":
        router.push("/status");
        break;
      case "train":
        router.push("/training");
        break;
      case "battle":
        router.push("/battle");
        break;
      case "world":
        router.push("/world-select");
        break;
      case "meal":
        setShowMeal(true);
        break;
      case "book":
        router.push("/encyclopedia");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
  }, [menuIndex, showMeal, router]);

  // New game screen
  if (phase === "new_game" || !monster) {
    return (
      <View style={styles.container}>
        <LcdFrame>
          <View style={styles.newGame}>
            <Text style={styles.lcdTitle}>DigiRide</Text>
            <Text style={styles.lcdSub}>デジタルモンスター育成ゲーム</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="名前を入力"
              placeholderTextColor={LCD_COLORS.DOT_LIGHT}
              value={nameInput}
              onChangeText={setNameInput}
              maxLength={8}
            />
            <View style={styles.starterRow}>
              {STARTER_MONSTER_IDS.map((id) => {
                const def = MONSTER_DEFINITIONS.get(id);
                return (
                  <Pressable
                    key={id}
                    style={styles.starterButton}
                    onPress={() => {
                      if (!nameInput.trim()) return;
                      setPlayerName(nameInput.trim());
                      createMonster(nameInput.trim(), id);
                      discover(id);
                      setPhase("alive");
                    }}
                  >
                    <MonsterSprite
                      stage={EvolutionStage.BABY_I}
                      animated
                    />
                    <Text style={styles.starterName}>
                      {def?.name ?? id}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </LcdFrame>
      </View>
    );
  }

  // Main game screen
  const monsterDef = MONSTER_DEFINITIONS.get(monster.definitionId);
  const daysAlive =
    (Date.now() - new Date(monster.bornAt).getTime()) / (1000 * 60 * 60 * 24);

  let branchType: BranchType | undefined;
  if (monster.totalTpL + monster.totalTpM + monster.totalTpH > 0) {
    branchType = determineBranchType(
      monster.totalTpL,
      monster.totalTpM,
      monster.totalTpH
    );
  }

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={handleLeft}
        onPressB={handleSelect}
        onPressC={handleRight}
      >
        {showMeal ? (
          <MealPrompt
            mealsToday={monster.mealsToday}
            onEat={() => {
              recordMeal();
              setShowMeal(false);
            }}
            onSkip={() => setShowMeal(false)}
          />
        ) : (
          <View style={styles.lcdContent}>
            {/* Monster name and generation */}
            <View style={styles.headerRow}>
              <Text style={styles.monsterName}>
                {monster.name}
              </Text>
              <Text style={styles.genLabel}>
                G{monster.generation}
              </Text>
            </View>

            {/* Sprite */}
            <View style={styles.spriteArea}>
              <MonsterSprite
                stage={monsterDef?.stage ?? EvolutionStage.BABY_I}
                branchType={branchType}
                animated
              />
            </View>

            {/* Status bars */}
            <StatusBars
              currentHp={monster.currentHp}
              maxHp={monster.maxHp}
              discipline={monster.discipline}
              daysAlive={daysAlive}
              maxLifespan={monster.baseLifespan + monster.lifespanExtension}
              tpL={tp.low}
              tpM={tp.mid}
              tpH={tp.high}
              wp={wp}
            />

            {/* Menu */}
            <MenuButtons items={MAIN_MENU} selectedIndex={menuIndex} />
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
  lcdContent: {
    flex: 1,
    padding: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  monsterName: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  genLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  spriteArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  newGame: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  lcdTitle: {
    color: LCD_COLORS.DOT,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  lcdSub: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 4,
    marginBottom: 16,
  },
  nameInput: {
    color: LCD_COLORS.DOT,
    backgroundColor: LCD_COLORS.DOT_MID,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontFamily: "monospace",
    width: 160,
    textAlign: "center",
    marginBottom: 16,
  },
  starterRow: {
    flexDirection: "row",
    gap: 24,
  },
  starterButton: {
    alignItems: "center",
    padding: 8,
  },
  starterName: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 4,
  },
});
