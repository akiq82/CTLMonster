/**
 * メイン育成画面
 *
 * LcdFrame内にモンスタースプライト、ステータスバー、メニューを表示。
 * ゲームの中心となる画面。
 * 起動時はセーブスロット選択画面を表示する。
 */

import React, { useState, useCallback, useEffect } from "react";
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
import { useSlotStore, SLOT_COUNT, type SlotSummary } from "../src/store/slot-store";
import { migrateLegacyData } from "../src/store/migration";
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
  { id: "tp-alloc", label: "TP配分" },
  { id: "meal", label: "MEAL" },
  { id: "book", label: "BOOK" },
  { id: "history", label: "HISTORY" },
  { id: "settings", label: "CONFIG" },
];

// ─── SaveSelect コンポーネント ──────────────────────────
interface SaveSelectProps {
  summaries: SlotSummary[];
  onSelect: (slot: number) => void;
  onDelete: (slot: number) => void;
}

function SaveSelect({ summaries, onSelect, onDelete }: SaveSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleUp = useCallback(() => {
    if (confirmDelete !== null) return;
    setSelectedIndex((i) => (i - 1 + SLOT_COUNT) % SLOT_COUNT);
  }, [confirmDelete]);

  const handleDown = useCallback(() => {
    if (confirmDelete !== null) return;
    setSelectedIndex((i) => (i + 1) % SLOT_COUNT);
  }, [confirmDelete]);

  const handleSelect = useCallback(() => {
    if (confirmDelete !== null) {
      // 削除確認中: 決定で削除実行
      onDelete(confirmDelete);
      setConfirmDelete(null);
      return;
    }
    onSelect(selectedIndex);
  }, [selectedIndex, confirmDelete, onSelect, onDelete]);

  const handleLongPress = useCallback(
    (slot: number) => {
      if (summaries[slot].occupied) {
        setConfirmDelete(slot);
      }
    },
    [summaries]
  );

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={handleUp}
        onPressB={handleSelect}
        onPressC={handleDown}
        buttonLabels={{ a: "A ▲", b: "B ●", c: "C ▼" }}
      >
        <View style={styles.saveSelectContent}>
          <Text style={styles.saveSelectTitle}>SAVE SELECT</Text>

          {confirmDelete !== null ? (
            <View style={styles.deleteConfirm}>
              <Text style={styles.deleteConfirmText}>
                SLOT {confirmDelete + 1} を削除？
              </Text>
              <Text style={styles.deleteConfirmSub}>
                B:DELETE / A:CANCEL
              </Text>
            </View>
          ) : (
            <View style={styles.slotList}>
              {summaries.map((summary, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.slotItem,
                    selectedIndex === index && styles.slotItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedIndex(index);
                    onSelect(index);
                  }}
                  onLongPress={() => handleLongPress(index)}
                >
                  <View style={styles.slotHeader}>
                    <Text style={styles.slotCursor}>
                      {selectedIndex === index ? "▶" : " "}
                    </Text>
                    <Text style={styles.slotLabel}>
                      SLOT {index + 1}
                    </Text>
                  </View>
                  {summary.occupied ? (
                    <View style={styles.slotInfo}>
                      <Text style={styles.slotMonsterName}>
                        {summary.monsterName || "---"} G{summary.generation}
                      </Text>
                      <Text style={styles.slotDetail}>
                        {MONSTER_DEFINITIONS.get(summary.definitionId)?.name ??
                          summary.definitionId}{" "}
                        ({summary.phase})
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.slotEmpty}>- EMPTY -</Text>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </LcdFrame>
    </View>
  );
}

// ─── HomeScreen ──────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const tp = useGameStore((s) => s.tp);
  const baseTp = useGameStore((s) => s.baseTp);
  const wp = useGameStore((s) => s.wp);
  const encounterCount = useGameStore((s) => s.encounterCount);
  const monster = useMonsterStore((s) => s.monster);
  const createMonster = useMonsterStore((s) => s.createMonster);
  const recordMeal = useMonsterStore((s) => s.recordMeal);
  const discover = useEncyclopediaStore((s) => s.discover);
  const resetForRebirth = useGameStore((s) => s.resetForRebirth);

  // Slot store
  const slotSelected = useSlotStore((s) => s.slotSelected);
  const summaries = useSlotStore((s) => s.summaries);
  const switchSlot = useSlotStore((s) => s.switchSlot);
  const deleteSlot = useSlotStore((s) => s.deleteSlot);
  const updateActiveSummary = useSlotStore((s) => s.updateActiveSummary);
  const [migrationDone, setMigrationDone] = useState(false);

  // レガシーデータ移行（初回起動時）
  useEffect(() => {
    migrateLegacyData().then(() => setMigrationDone(true));
  }, []);

  // Game loop & external data hooks (スロット選択後のみ有効)
  useGameLoop();
  useDailySync();
  const healthData = useHealthData();

  // Add WP from health data when it changes
  const addWp = useGameStore((s) => s.addWp);
  const updateDailyLog = useEncyclopediaStore((s) => s.updateDailyLog);
  const finalizeGeneration = useEncyclopediaStore((s) => s.finalizeGeneration);
  const lastWpRef = React.useRef(0);
  React.useEffect(() => {
    if (!slotSelected) return;
    if (healthData.wp > lastWpRef.current) {
      const delta = healthData.wp - lastWpRef.current;
      addWp(delta);
      const today = new Date().toISOString().split("T")[0];
      updateDailyLog(today, { wpGained: delta });
      lastWpRef.current = healthData.wp;
    }
  }, [healthData.wp, addWp, updateDailyLog, slotSelected]);

  // スロットサマリーの同期（モンスター・フェーズ変更時）
  useEffect(() => {
    if (!slotSelected) return;
    if (monster) {
      updateActiveSummary({
        monsterName: monster.name,
        definitionId: monster.definitionId,
        generation: monster.generation,
        phase,
      });
    } else {
      updateActiveSummary({ phase });
    }
  }, [monster?.name, monster?.definitionId, monster?.generation, phase, slotSelected, updateActiveSummary]);

  const createNextGen = useMonsterStore((s) => s.createNextGen);

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
      case "tp-alloc":
        router.push("/allocate-tp");
        break;
      case "meal":
        setShowMeal(true);
        break;
      case "book":
        router.push("/encyclopedia");
        break;
      case "history":
        router.push("/history");
        break;
      case "settings":
        router.push("/settings");
        break;
    }
  }, [menuIndex, showMeal, router]);

  // 移行完了待ち
  if (!migrationDone) {
    return (
      <View style={styles.container}>
        <LcdFrame>
          <View style={styles.newGame}>
            <Text style={styles.lcdTitle}>DigiRide</Text>
            <Text style={styles.lcdSub}>Loading...</Text>
          </View>
        </LcdFrame>
      </View>
    );
  }

  // セーブスロット選択画面
  if (!slotSelected) {
    return (
      <SaveSelect
        summaries={[...summaries]}
        onSelect={(slot) => switchSlot(slot)}
        onDelete={(slot) => deleteSlot(slot)}
      />
    );
  }

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

  // Dead screen
  if (phase === "dead" && monster) {
    const deadMonsterDef = MONSTER_DEFINITIONS.get(monster.definitionId);
    const daysLived = Math.floor(
      (Date.now() - new Date(monster.bornAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const memory = monster.memoryEquipment;

    return (
      <View style={styles.container}>
        <LcdFrame>
          <View style={styles.deadScreen}>
            <Text style={styles.deadTitle}>REST IN PEACE</Text>
            <Text style={styles.deadMonsterName}>
              {monster.name} (G{monster.generation})
            </Text>
            <Text style={styles.deadSub}>
              {deadMonsterDef?.name ?? monster.definitionId} - {daysLived}日間
            </Text>

            {/* Final stats */}
            <View style={styles.deadStatsBlock}>
              <Text style={styles.deadStatsLine}>
                HP:{monster.maxHp} ATK:{monster.atk} DEF:{monster.def}
              </Text>
              <Text style={styles.deadStatsLine}>
                W:{monster.wins} L:{monster.losses}
              </Text>
            </View>

            {/* Memory equipment preview */}
            <View style={styles.deadMemoryBlock}>
              <Text style={styles.deadMemoryTitle}>MEMORY EQUIPMENT</Text>
              <Text style={styles.deadMemoryLine}>
                HP+{Math.floor((monster.maxHp + (memory?.hp ?? 0)) * 0.2)}{" "}
                ATK+{Math.floor((monster.atk + (memory?.atk ?? 0)) * 0.2)}{" "}
                DEF+{Math.floor((monster.def + (memory?.def ?? 0)) * 0.2)}
              </Text>
            </View>

            {/* Rebirth */}
            <TextInput
              style={styles.nameInput}
              placeholder="新しい名前"
              placeholderTextColor={LCD_COLORS.DOT_LIGHT}
              value={nameInput}
              onChangeText={setNameInput}
              maxLength={8}
            />
            <Pressable
              style={styles.rebirthButton}
              onPress={() => {
                if (!nameInput.trim()) return;
                // Finalize the current generation's history
                const worldProgressMap = useWorldStore.getState().worldProgressMap;
                const bossesDefeated = Object.values(worldProgressMap)
                  .filter((p) => p.bossDefeated)
                  .map((p) => p.worldNumber)
                  .sort((a, b) => a - b);
                const highestWorld = bossesDefeated.length > 0
                  ? Math.max(...bossesDefeated) + 1
                  : 1;
                const daysLived = Math.floor(
                  (Date.now() - new Date(monster.bornAt).getTime()) / (1000 * 60 * 60 * 24)
                );
                finalizeGeneration({
                  generation: monster.generation,
                  name: monster.name,
                  finalFormId: monster.definitionId,
                  finalHp: monster.maxHp,
                  finalAtk: monster.atk,
                  finalDef: monster.def,
                  wins: monster.wins,
                  losses: monster.losses,
                  daysLived,
                  diedAt: new Date().toISOString(),
                  highestWorld,
                  bossesDefeated,
                });
                createNextGen(nameInput.trim());
                const newMonster = useMonsterStore.getState().monster;
                if (newMonster) {
                  discover(newMonster.definitionId);
                  resetForRebirth(newMonster.bornAt.split("T")[0]);
                }
                setNameInput("");
                setPhase("alive");
              }}
            >
              <Text style={styles.rebirthButtonText}>REBIRTH</Text>
            </Pressable>
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
              baseTp={baseTp}
              tpL={tp.low}
              tpM={tp.mid}
              tpH={tp.high}
              wp={wp}
              encounterCount={encounterCount}
              mealsToday={monster.mealsToday}
              mealBonusRemaining={monster.mealBonusRemaining}
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
  deadScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  deadTitle: {
    color: LCD_COLORS.DOT_MID,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  deadMonsterName: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  deadSub: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
    marginBottom: 6,
  },
  deadStatsBlock: {
    alignItems: "center",
    marginBottom: 6,
  },
  deadStatsLine: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  deadMemoryBlock: {
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: LCD_COLORS.DOT_MID,
  },
  deadMemoryTitle: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
    marginBottom: 2,
  },
  deadMemoryLine: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  rebirthButton: {
    backgroundColor: LCD_COLORS.DOT_MID,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  rebirthButtonText: {
    color: LCD_COLORS.BG,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  // SaveSelect styles
  saveSelectContent: {
    flex: 1,
    padding: 12,
  },
  saveSelectTitle: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 12,
  },
  slotList: {
    flex: 1,
    gap: 6,
  },
  slotItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  slotItemSelected: {
    backgroundColor: LCD_COLORS.DOT_MID,
  },
  slotHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slotCursor: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
    width: 12,
  },
  slotLabel: {
    color: LCD_COLORS.DOT,
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  slotInfo: {
    paddingLeft: 16,
  },
  slotMonsterName: {
    color: LCD_COLORS.DOT,
    fontSize: 10,
    fontFamily: "monospace",
  },
  slotDetail: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  slotEmpty: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontFamily: "monospace",
    paddingLeft: 16,
  },
  deleteConfirm: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteConfirmText: {
    color: LCD_COLORS.DOT,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  deleteConfirmSub: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
});
