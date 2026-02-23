/**
 * ワールド定義（全10ワールド）
 *
 * GDD.md セクション7.3 敵ステータス目安テーブルに完全準拠。
 * 各ワールド12体のモブ敵 (3フェーズ×4体) + ボス1体。
 *
 * | W  | モブHP      | モブATK     | モブDEF     | ボスHP | ボスATK | ボスDEF | 想定形態     |
 * |----|------------|------------|------------|--------|---------|---------|-------------|
 * | W1 | 15〜35     | 5〜12      | 3〜8       | 70     | 20      | 15      | 幼年期II     |
 * | W2 | 40〜90     | 15〜30     | 10〜22     | 180    | 45      | 35      | 成長期序盤   |
 * | W3 | 80〜180    | 28〜55     | 20〜40     | 350    | 85      | 65      | 成長期終盤   |
 * | W4 | 160〜350   | 50〜100    | 40〜75     | 650    | 145     | 115     | 成熟期       |
 * | W5 | 300〜600   | 90〜170    | 70〜130    | 1000   | 250     | 200     | 成熟期終盤   |
 * | W6 | 500〜1000  | 150〜280   | 120〜220   | 1800   | 400     | 330     | 完全体       |
 * | W7 | 900〜1800  | 260〜480   | 210〜380   | 3200   | 700     | 560     | 完全体終盤   |
 * | W8 | 1600〜3000 | 450〜800   | 360〜620   | 5500   | 1100    | 900     | 究極体       |
 * | W9 | 2800〜5000 | 780〜1400  | 620〜1100  | 9000   | 1800    | 1500    | 究極体強     |
 * | W10| 4500〜8000 | 1250〜2200 | 1000〜1760 | 15000  | 2800    | 2300    | 究極体最強   |
 *
 * 全ワールド共通:
 *   - ボス到達に必要な撃破数: 10体
 *   - エンカウント1回のWP消費: 2,000 WP
 *   - ボス戦のWP消費: 3,000 WP
 */

import { WorldDefinition } from "../types/world";
import { WORLD_CONSTANTS } from "../types/world";

/** 敵の既定規律値（ワールド番号に応じて上昇） */
const ENEMY_BASE_DISCIPLINE = 40;
const BOSS_BASE_DISCIPLINE = 50;

export const WORLD_DEFINITIONS: readonly WorldDefinition[] = [
  // ========== W1: はじまりの草原 ==========
  {
    worldNumber: 1,
    name: "はじまりの草原",
    description: "穏やかな風が吹く草原。初めての冒険の舞台。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0 (killCount 0-3)
      {
        monsterId: "goblimon",
        hp: { min: 15, max: 20 },
        atk: { min: 5, max: 7 },
        def: { min: 3, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "gazimon",
        hp: { min: 15, max: 22 },
        atk: { min: 5, max: 8 },
        def: { min: 3, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "mushroomon",
        hp: { min: 16, max: 23 },
        atk: { min: 6, max: 8 },
        def: { min: 3, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "koromon",
        hp: { min: 17, max: 24 },
        atk: { min: 6, max: 8 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE + 1,
      },
      // Phase 1 (killCount 4-6)
      {
        monsterId: "kunemon",
        hp: { min: 20, max: 27 },
        atk: { min: 7, max: 9 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "gazimon",
        hp: { min: 20, max: 28 },
        atk: { min: 7, max: 10 },
        def: { min: 4, max: 7 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "tanemon",
        hp: { min: 21, max: 28 },
        atk: { min: 7, max: 9 },
        def: { min: 4, max: 7 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "tokomon",
        hp: { min: 22, max: 29 },
        atk: { min: 8, max: 10 },
        def: { min: 5, max: 7 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      // Phase 2 (killCount 7+)
      {
        monsterId: "goblimon",
        hp: { min: 25, max: 32 },
        atk: { min: 9, max: 11 },
        def: { min: 5, max: 7 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "mushroomon",
        hp: { min: 26, max: 33 },
        atk: { min: 9, max: 11 },
        def: { min: 6, max: 8 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "nyaromon",
        hp: { min: 27, max: 34 },
        atk: { min: 10, max: 12 },
        def: { min: 6, max: 8 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "bukamon",
        hp: { min: 28, max: 35 },
        atk: { min: 10, max: 12 },
        def: { min: 6, max: 8 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
    ],
    boss: {
      monsterId: "ogremon",
      hp: 70,
      atk: 20,
      def: 15,
      discipline: BOSS_BASE_DISCIPLINE,
    },
  },

  // ========== W2: 暗黒の森 ==========
  {
    worldNumber: 2,
    name: "暗黒の森",
    description: "鬱蒼とした森。ウイルス種のモンスターが潜む。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "darktyranomon",
        hp: { min: 40, max: 55 },
        atk: { min: 15, max: 20 },
        def: { min: 10, max: 14 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "goburimon",
        hp: { min: 42, max: 58 },
        atk: { min: 15, max: 21 },
        def: { min: 10, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "shamanmon",
        hp: { min: 44, max: 58 },
        atk: { min: 16, max: 22 },
        def: { min: 11, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "betamon",
        hp: { min: 45, max: 60 },
        atk: { min: 16, max: 22 },
        def: { min: 11, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      // Phase 1
      {
        monsterId: "cyclonemon",
        hp: { min: 55, max: 72 },
        atk: { min: 20, max: 26 },
        def: { min: 13, max: 17 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "gizamon",
        hp: { min: 55, max: 72 },
        atk: { min: 19, max: 25 },
        def: { min: 13, max: 17 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "demidevimon",
        hp: { min: 58, max: 74 },
        atk: { min: 20, max: 26 },
        def: { min: 14, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "darktyranomon",
        hp: { min: 58, max: 75 },
        atk: { min: 21, max: 26 },
        def: { min: 14, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      // Phase 2
      {
        monsterId: "cyclonemon",
        hp: { min: 70, max: 85 },
        atk: { min: 24, max: 29 },
        def: { min: 17, max: 21 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "goburimon",
        hp: { min: 72, max: 88 },
        atk: { min: 24, max: 29 },
        def: { min: 17, max: 21 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "shamanmon",
        hp: { min: 74, max: 88 },
        atk: { min: 25, max: 30 },
        def: { min: 18, max: 22 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "gizamon",
        hp: { min: 75, max: 90 },
        atk: { min: 25, max: 30 },
        def: { min: 18, max: 22 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
    ],
    boss: {
      monsterId: "tuskmon",
      hp: 180,
      atk: 45,
      def: 35,
      discipline: BOSS_BASE_DISCIPLINE + 2,
    },
  },

  // ========== W3: 灼熱の火山 ==========
  {
    worldNumber: 3,
    name: "灼熱の火山",
    description: "溶岩が流れる危険な火山地帯。強力なモンスターの巣窟。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "minotauromon",
        hp: { min: 80, max: 110 },
        atk: { min: 28, max: 38 },
        def: { min: 20, max: 27 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "numemon",
        hp: { min: 82, max: 112 },
        atk: { min: 28, max: 38 },
        def: { min: 20, max: 27 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "bakemon",
        hp: { min: 85, max: 115 },
        atk: { min: 29, max: 39 },
        def: { min: 21, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "flymon",
        hp: { min: 88, max: 118 },
        atk: { min: 30, max: 40 },
        def: { min: 22, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      // Phase 1
      {
        monsterId: "snimon",
        hp: { min: 110, max: 148 },
        atk: { min: 38, max: 48 },
        def: { min: 26, max: 33 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      {
        monsterId: "devidramon",
        hp: { min: 112, max: 148 },
        atk: { min: 38, max: 47 },
        def: { min: 26, max: 33 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      {
        monsterId: "tyrannomon",
        hp: { min: 115, max: 150 },
        atk: { min: 39, max: 48 },
        def: { min: 27, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "seadramon",
        hp: { min: 115, max: 150 },
        atk: { min: 40, max: 48 },
        def: { min: 27, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      // Phase 2
      {
        monsterId: "drimogemon",
        hp: { min: 140, max: 175 },
        atk: { min: 45, max: 54 },
        def: { min: 32, max: 39 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "airdramon",
        hp: { min: 142, max: 175 },
        atk: { min: 45, max: 54 },
        def: { min: 32, max: 39 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "kuwagamon",
        hp: { min: 145, max: 178 },
        atk: { min: 46, max: 55 },
        def: { min: 33, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "monochromon",
        hp: { min: 148, max: 180 },
        atk: { min: 47, max: 55 },
        def: { min: 34, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
    ],
    boss: {
      monsterId: "devimon",
      hp: 350,
      atk: 85,
      def: 65,
      discipline: BOSS_BASE_DISCIPLINE + 5,
    },
  },

  // ========== W4: 氷結の峡谷 ==========
  {
    worldNumber: 4,
    name: "氷結の峡谷",
    description: "万年氷に閉ざされた峡谷。成熟期クラスの敵が出現。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "nanimon",
        hp: { min: 160, max: 225 },
        atk: { min: 50, max: 68 },
        def: { min: 40, max: 54 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "bakemon",
        hp: { min: 162, max: 225 },
        atk: { min: 50, max: 68 },
        def: { min: 40, max: 54 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "devidramon",
        hp: { min: 165, max: 228 },
        atk: { min: 52, max: 70 },
        def: { min: 41, max: 55 },
        discipline: ENEMY_BASE_DISCIPLINE + 9,
      },
      {
        monsterId: "numemon",
        hp: { min: 168, max: 230 },
        atk: { min: 52, max: 70 },
        def: { min: 42, max: 55 },
        discipline: ENEMY_BASE_DISCIPLINE + 9,
      },
      // Phase 1
      {
        monsterId: "fugamon",
        hp: { min: 220, max: 288 },
        atk: { min: 68, max: 85 },
        def: { min: 52, max: 64 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "flymon",
        hp: { min: 222, max: 285 },
        atk: { min: 68, max: 84 },
        def: { min: 53, max: 64 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "drimogemon",
        hp: { min: 225, max: 288 },
        atk: { min: 69, max: 85 },
        def: { min: 54, max: 65 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "snimon",
        hp: { min: 228, max: 290 },
        atk: { min: 70, max: 85 },
        def: { min: 55, max: 65 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      // Phase 2
      {
        monsterId: "monochromon",
        hp: { min: 280, max: 340 },
        atk: { min: 82, max: 98 },
        def: { min: 62, max: 74 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "deltamon",
        hp: { min: 285, max: 345 },
        atk: { min: 83, max: 98 },
        def: { min: 63, max: 74 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "raremon",
        hp: { min: 288, max: 348 },
        atk: { min: 84, max: 100 },
        def: { min: 64, max: 75 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "minotauromon",
        hp: { min: 290, max: 350 },
        atk: { min: 85, max: 100 },
        def: { min: 65, max: 75 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
    ],
    boss: {
      monsterId: "deltamon",
      hp: 650,
      atk: 145,
      def: 115,
      discipline: BOSS_BASE_DISCIPLINE + 8,
    },
  },

  // ========== W5: 嵐の海域 ==========
  {
    worldNumber: 5,
    name: "嵐の海域",
    description: "荒れ狂う大海。成熟期終盤レベルのモンスターが跋扈する。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "mammothmon",
        hp: { min: 300, max: 410 },
        atk: { min: 90, max: 122 },
        def: { min: 70, max: 93 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "etemon",
        hp: { min: 305, max: 415 },
        atk: { min: 90, max: 122 },
        def: { min: 70, max: 93 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "archnemon",
        hp: { min: 310, max: 415 },
        atk: { min: 92, max: 124 },
        def: { min: 72, max: 95 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "mummymon",
        hp: { min: 315, max: 420 },
        atk: { min: 93, max: 125 },
        def: { min: 73, max: 95 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      // Phase 1
      {
        monsterId: "megadramon",
        hp: { min: 400, max: 508 },
        atk: { min: 120, max: 146 },
        def: { min: 92, max: 114 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "blossomon",
        hp: { min: 405, max: 508 },
        atk: { min: 120, max: 146 },
        def: { min: 93, max: 114 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "waruseadramon",
        hp: { min: 408, max: 510 },
        atk: { min: 122, max: 148 },
        def: { min: 94, max: 115 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "skullgreymon",
        hp: { min: 410, max: 510 },
        atk: { min: 124, max: 148 },
        def: { min: 95, max: 115 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      // Phase 2
      {
        monsterId: "skullgreymon",
        hp: { min: 490, max: 580 },
        atk: { min: 145, max: 168 },
        def: { min: 110, max: 128 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "datamon",
        hp: { min: 492, max: 585 },
        atk: { min: 145, max: 168 },
        def: { min: 110, max: 128 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "megaseadramon",
        hp: { min: 495, max: 595 },
        atk: { min: 146, max: 170 },
        def: { min: 112, max: 130 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      {
        monsterId: "metaltyranomon",
        hp: { min: 498, max: 600 },
        atk: { min: 148, max: 170 },
        def: { min: 113, max: 130 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
    ],
    boss: {
      monsterId: "metalgreymon_virus",
      hp: 1000,
      atk: 250,
      def: 200,
      discipline: BOSS_BASE_DISCIPLINE + 10,
    },
  },

  // ========== W6: 闇の城塞 ==========
  {
    worldNumber: 6,
    name: "闇の城塞",
    description: "闇に包まれた巨大城塞。完全体クラスの敵が守護する。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "datamon",
        hp: { min: 500, max: 680 },
        atk: { min: 150, max: 205 },
        def: { min: 120, max: 160 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "etemon",
        hp: { min: 510, max: 690 },
        atk: { min: 150, max: 208 },
        def: { min: 122, max: 163 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "archnemon",
        hp: { min: 520, max: 695 },
        atk: { min: 152, max: 210 },
        def: { min: 124, max: 165 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      {
        monsterId: "mummymon",
        hp: { min: 530, max: 700 },
        atk: { min: 155, max: 210 },
        def: { min: 125, max: 165 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      // Phase 1
      {
        monsterId: "waruseadramon",
        hp: { min: 680, max: 855 },
        atk: { min: 200, max: 246 },
        def: { min: 158, max: 193 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "blossomon",
        hp: { min: 685, max: 855 },
        atk: { min: 200, max: 246 },
        def: { min: 160, max: 193 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "megadramon",
        hp: { min: 690, max: 858 },
        atk: { min: 202, max: 248 },
        def: { min: 162, max: 195 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "megaseadramon",
        hp: { min: 695, max: 860 },
        atk: { min: 204, max: 248 },
        def: { min: 163, max: 195 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      // Phase 2
      {
        monsterId: "metaltyranomon",
        hp: { min: 840, max: 985 },
        atk: { min: 240, max: 276 },
        def: { min: 190, max: 217 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "mammothmon",
        hp: { min: 845, max: 990 },
        atk: { min: 240, max: 278 },
        def: { min: 190, max: 218 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "skullgreymon",
        hp: { min: 850, max: 995 },
        atk: { min: 242, max: 280 },
        def: { min: 192, max: 220 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      {
        monsterId: "blossomon",
        hp: { min: 855, max: 1000 },
        atk: { min: 245, max: 280 },
        def: { min: 195, max: 220 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
    ],
    boss: {
      monsterId: "gigadramon",
      hp: 1800,
      atk: 400,
      def: 330,
      discipline: BOSS_BASE_DISCIPLINE + 15,
    },
  },

  // ========== W7: 天空の塔 ==========
  {
    worldNumber: 7,
    name: "天空の塔",
    description: "雲を突き抜ける巨塔。完全体終盤の強敵が待ち受ける。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "piedmon",
        hp: { min: 900, max: 1200 },
        atk: { min: 260, max: 348 },
        def: { min: 210, max: 280 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 910, max: 1210 },
        atk: { min: 260, max: 350 },
        def: { min: 210, max: 282 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "diaboromon",
        hp: { min: 920, max: 1230 },
        atk: { min: 264, max: 355 },
        def: { min: 215, max: 286 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      {
        monsterId: "venommyotismon",
        hp: { min: 930, max: 1250 },
        atk: { min: 268, max: 360 },
        def: { min: 218, max: 290 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      // Phase 1
      {
        monsterId: "puppetmon",
        hp: { min: 1200, max: 1510 },
        atk: { min: 350, max: 422 },
        def: { min: 280, max: 338 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 1210, max: 1510 },
        atk: { min: 350, max: 422 },
        def: { min: 280, max: 338 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 1220, max: 1515 },
        atk: { min: 354, max: 425 },
        def: { min: 284, max: 340 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 1230, max: 1520 },
        atk: { min: 356, max: 425 },
        def: { min: 286, max: 340 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      // Phase 2
      {
        monsterId: "millenniummon",
        hp: { min: 1500, max: 1780 },
        atk: { min: 415, max: 476 },
        def: { min: 330, max: 376 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      {
        monsterId: "rosemon",
        hp: { min: 1510, max: 1790 },
        atk: { min: 418, max: 478 },
        def: { min: 332, max: 378 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      {
        monsterId: "imperialdramon",
        hp: { min: 1520, max: 1795 },
        atk: { min: 420, max: 480 },
        def: { min: 335, max: 380 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 1530, max: 1800 },
        atk: { min: 422, max: 480 },
        def: { min: 338, max: 380 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
    ],
    boss: {
      monsterId: "machinedramon",
      hp: 3200,
      atk: 700,
      def: 560,
      discipline: BOSS_BASE_DISCIPLINE + 18,
    },
  },

  // ========== W8: 終焉の地 ==========
  {
    worldNumber: 8,
    name: "終焉の地",
    description: "すべてが終わり、すべてが始まる最終ワールド。究極体が君臨する。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "diaboromon",
        hp: { min: 1600, max: 2100 },
        atk: { min: 450, max: 588 },
        def: { min: 360, max: 466 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 1620, max: 2120 },
        atk: { min: 452, max: 592 },
        def: { min: 362, max: 470 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 1640, max: 2130 },
        atk: { min: 458, max: 596 },
        def: { min: 368, max: 472 },
        discipline: ENEMY_BASE_DISCIPLINE + 21,
      },
      {
        monsterId: "piedmon",
        hp: { min: 1660, max: 2150 },
        atk: { min: 462, max: 600 },
        def: { min: 370, max: 475 },
        discipline: ENEMY_BASE_DISCIPLINE + 21,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 2100, max: 2580 },
        atk: { min: 580, max: 705 },
        def: { min: 460, max: 552 },
        discipline: ENEMY_BASE_DISCIPLINE + 22,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 2120, max: 2580 },
        atk: { min: 582, max: 705 },
        def: { min: 462, max: 552 },
        discipline: ENEMY_BASE_DISCIPLINE + 22,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 2140, max: 2590 },
        atk: { min: 588, max: 710 },
        def: { min: 468, max: 555 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 2160, max: 2600 },
        atk: { min: 592, max: 710 },
        def: { min: 472, max: 555 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      // Phase 2
      {
        monsterId: "puppetmon",
        hp: { min: 2550, max: 2920 },
        atk: { min: 690, max: 790 },
        def: { min: 545, max: 612 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 2560, max: 2950 },
        atk: { min: 692, max: 795 },
        def: { min: 548, max: 615 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "rosemon",
        hp: { min: 2580, max: 2980 },
        atk: { min: 698, max: 800 },
        def: { min: 552, max: 618 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 2600, max: 3000 },
        atk: { min: 700, max: 800 },
        def: { min: 555, max: 620 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
    ],
    boss: {
      monsterId: "omegamon",
      hp: 5500,
      atk: 1100,
      def: 900,
      discipline: BOSS_BASE_DISCIPLINE + 25,
    },
  },

  // ========== W9: 魔界の門 ==========
  {
    worldNumber: 9,
    name: "魔界の門",
    description: "異界へ通じる門。究極体の強者が群がる魔の領域。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "piedmon",
        hp: { min: 2800, max: 3350 },
        atk: { min: 780, max: 938 },
        def: { min: 620, max: 742 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 2820, max: 3360 },
        atk: { min: 785, max: 940 },
        def: { min: 625, max: 745 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "puppetmon",
        hp: { min: 2850, max: 3380 },
        atk: { min: 792, max: 945 },
        def: { min: 630, max: 748 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "diaboromon",
        hp: { min: 2880, max: 3400 },
        atk: { min: 800, max: 950 },
        def: { min: 635, max: 750 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 3400, max: 4050 },
        atk: { min: 950, max: 1135 },
        def: { min: 750, max: 895 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 3420, max: 4060 },
        atk: { min: 955, max: 1138 },
        def: { min: 755, max: 898 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 3450, max: 4080 },
        atk: { min: 960, max: 1142 },
        def: { min: 760, max: 900 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 3480, max: 4100 },
        atk: { min: 968, max: 1150 },
        def: { min: 768, max: 900 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      // Phase 2
      {
        monsterId: "millenniummon",
        hp: { min: 4100, max: 4750 },
        atk: { min: 1140, max: 1330 },
        def: { min: 900, max: 1050 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 4120, max: 4800 },
        atk: { min: 1148, max: 1345 },
        def: { min: 908, max: 1060 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "rosemon",
        hp: { min: 4150, max: 4850 },
        atk: { min: 1155, max: 1360 },
        def: { min: 915, max: 1075 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "daemon",
        hp: { min: 4200, max: 5000 },
        atk: { min: 1170, max: 1400 },
        def: { min: 925, max: 1100 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
    ],
    boss: {
      monsterId: "daemon",
      hp: 9000,
      atk: 1800,
      def: 1500,
      discipline: BOSS_BASE_DISCIPLINE + 28,
    },
  },

  // ========== W10: 虚無の彼方 ==========
  {
    worldNumber: 10,
    name: "虚無の彼方",
    description: "すべてが消え去る虚無の世界。最強のモンスターが待ち受ける最終試練。",
    requiredKills: WORLD_CONSTANTS.REQUIRED_KILLS,
    enemies: [
      // Phase 0
      {
        monsterId: "diaboromon",
        hp: { min: 4500, max: 5400 },
        atk: { min: 1250, max: 1505 },
        def: { min: 1000, max: 1200 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 4520, max: 5420 },
        atk: { min: 1255, max: 1510 },
        def: { min: 1005, max: 1205 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 4550, max: 5450 },
        atk: { min: 1262, max: 1518 },
        def: { min: 1012, max: 1212 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 4580, max: 5500 },
        atk: { min: 1270, max: 1530 },
        def: { min: 1018, max: 1220 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 5500, max: 6500 },
        atk: { min: 1530, max: 1810 },
        def: { min: 1220, max: 1445 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 5520, max: 6520 },
        atk: { min: 1535, max: 1815 },
        def: { min: 1225, max: 1450 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 5550, max: 6550 },
        atk: { min: 1545, max: 1825 },
        def: { min: 1232, max: 1458 },
        discipline: ENEMY_BASE_DISCIPLINE + 29,
      },
      {
        monsterId: "piedmon",
        hp: { min: 5580, max: 6600 },
        atk: { min: 1555, max: 1838 },
        def: { min: 1240, max: 1465 },
        discipline: ENEMY_BASE_DISCIPLINE + 29,
      },
      // Phase 2
      {
        monsterId: "daemon",
        hp: { min: 6600, max: 7700 },
        atk: { min: 1838, max: 2145 },
        def: { min: 1465, max: 1710 },
        discipline: ENEMY_BASE_DISCIPLINE + 30,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 6650, max: 7750 },
        atk: { min: 1852, max: 2160 },
        def: { min: 1478, max: 1722 },
        discipline: ENEMY_BASE_DISCIPLINE + 30,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 6700, max: 7850 },
        atk: { min: 1865, max: 2185 },
        def: { min: 1490, max: 1745 },
        discipline: ENEMY_BASE_DISCIPLINE + 31,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 6800, max: 8000 },
        atk: { min: 1893, max: 2200 },
        def: { min: 1510, max: 1760 },
        discipline: ENEMY_BASE_DISCIPLINE + 32,
      },
    ],
    boss: {
      monsterId: "apocalymon",
      hp: 15000,
      atk: 2800,
      def: 2300,
      discipline: BOSS_BASE_DISCIPLINE + 32,
    },
  },
];

/** ワールド番号からの検索マップ */
export const WORLD_MAP: ReadonlyMap<number, WorldDefinition> = new Map(
  WORLD_DEFINITIONS.map((w) => [w.worldNumber, w])
);
