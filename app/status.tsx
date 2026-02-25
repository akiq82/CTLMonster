/**
 * ステータス詳細画面
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LcdFrame, LCD_COLORS } from "../src/components/lcd-screen/LcdFrame";
import { MonsterSprite } from "../src/components/lcd-screen/MonsterSprite";
import { useMonsterStore } from "../src/store/monster-store";
import { useGameStore } from "../src/store/game-store";
import { useWorldStore } from "../src/store/world-store";
import { MONSTER_DEFINITIONS } from "../src/data/monsters";
import { EvolutionStage, BranchType } from "../src/types/monster";
import { determineBranchType } from "../src/engine/evolution";

function StatLine({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statLine}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const STAGE_NAMES: Record<number, string> = {
  [EvolutionStage.BABY_I]: "幼年期I",
  [EvolutionStage.BABY_II]: "幼年期II",
  [EvolutionStage.ROOKIE]: "成長期",
  [EvolutionStage.CHAMPION]: "成熟期",
  [EvolutionStage.ULTIMATE]: "完全体",
  [EvolutionStage.MEGA]: "究極体",
};

export default function StatusScreen() {
  const router = useRouter();
  const monster = useMonsterStore((s) => s.monster);
  const tp = useGameStore((s) => s.tp);
  const wp = useGameStore((s) => s.wp);
  const currentWorldNumber = useWorldStore((s) => s.currentWorldNumber);

  if (!monster) {
    router.back();
    return null;
  }

  const def = MONSTER_DEFINITIONS.get(monster.definitionId);
  const daysAlive =
    (Date.now() - new Date(monster.bornAt).getTime()) / (1000 * 60 * 60 * 24);
  const totalTp = monster.totalTpL + monster.totalTpM + monster.totalTpH;
  let branchLabel = "-";
  if (totalTp > 0) {
    const bt = determineBranchType(monster.totalTpL, monster.totalTpM, monster.totalTpH);
    branchLabel = bt;
  }

  const equipHp = monster.memoryEquipment?.hp ?? 0;
  const equipAtk = monster.memoryEquipment?.atk ?? 0;
  const equipDef = monster.memoryEquipment?.def ?? 0;

  return (
    <View style={styles.container}>
      <LcdFrame
        onPressA={() => router.back()}
        buttonLabels={{ a: "◀ BACK", b: "B ●", c: "▶" }}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <MonsterSprite
              stage={def?.stage ?? EvolutionStage.BABY_I}
              pixelSize={3}
              animated
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{monster.name}</Text>
              <Text style={styles.species}>{def?.name ?? "?"}</Text>
              <Text style={styles.stage}>
                {STAGE_NAMES[def?.stage ?? 1]} / G{monster.generation}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STATS</Text>
            <StatLine label="HP" value={`${monster.currentHp}/${monster.maxHp}${equipHp > 0 ? ` (+${equipHp})` : ""}`} />
            <StatLine label="ATK" value={`${monster.atk}${equipAtk > 0 ? ` (+${equipAtk})` : ""}`} />
            <StatLine label="DEF" value={`${monster.def}${equipDef > 0 ? ` (+${equipDef})` : ""}`} />
            <StatLine label="DISC" value={monster.discipline} />
            <StatLine label="Branch" value={branchLabel} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESOURCES</Text>
            <StatLine label="TP-L" value={tp.low} />
            <StatLine label="TP-M" value={tp.mid} />
            <StatLine label="TP-H" value={tp.high} />
            <StatLine label="WP" value={wp} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LIFE</Text>
            <StatLine label="Day" value={`${daysAlive.toFixed(1)}/${(monster.baseLifespan + monster.lifespanExtension).toFixed(1)}`} />
            <StatLine label="Meals" value={`${monster.mealsToday}/3`} />
            <StatLine label="Wins" value={monster.wins} />
            <StatLine label="Losses" value={monster.losses} />
            <StatLine label="World" value={`W${currentWorldNumber}`} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TP TOTALS</Text>
            <StatLine label="TP-L" value={monster.totalTpL} />
            <StatLine label="TP-M" value={monster.totalTpM} />
            <StatLine label="TP-H" value={monster.totalTpH} />
          </View>

          {monster.memoryEquipment && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EQUIPMENT</Text>
              <Text style={styles.equipName}>{monster.memoryEquipment.name}</Text>
              <StatLine label="HP" value={`+${monster.memoryEquipment.hp}`} />
              <StatLine label="ATK" value={`+${monster.memoryEquipment.atk}`} />
              <StatLine label="DEF" value={`+${monster.memoryEquipment.def}`} />
            </View>
          )}
        </ScrollView>
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerInfo: {
    marginLeft: 12,
  },
  name: {
    color: LCD_COLORS.DOT,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  species: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 10,
    fontFamily: "monospace",
  },
  stage: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 8,
    fontFamily: "monospace",
  },
  section: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: LCD_COLORS.DOT_MID,
    paddingTop: 4,
  },
  sectionTitle: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 2,
  },
  statLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 1,
  },
  statLabel: {
    color: LCD_COLORS.DOT_LIGHT,
    fontSize: 9,
    fontFamily: "monospace",
  },
  statValue: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  equipName: {
    color: LCD_COLORS.DOT,
    fontSize: 9,
    fontFamily: "monospace",
    fontStyle: "italic",
  },
});
