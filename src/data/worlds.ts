/**
 * ワールド定義（全10ワールド）
 *
 * 段階倍率×1.0-2.0に合わせてリバランス。
 * 各ワールド12体のモブ敵 (3フェーズ×4体) + ボス1体。
 *
 * | W  | ボスHP | ボスATK | ボスDEF | 想定パターン / 段階                |
 * |----|--------|---------|---------|-------------------------------------|
 * | W1 |    60  |    15   |    10   | Baby II gen1 (CTL60)                |
 * | W2 |   108  |    26   |    20   | Rookie gen1                         |
 * | W3 |   150  |    39   |    30   | Champion gen1                       |
 * | W4 |   230  |    45   |    38   | Champion gen2-3 + equip             |
 * | W5 |   249  |    50   |    40   | Ultimate gen1 / Champion gen3-5     |
 * | W6 |   398  |    75   |    59   | Ultimate gen2-3 + equip             |
 * | W7 |   502  |    91   |    55   | Ultimate gen5+ (Pattern A target)   |
 * | W8 |   701  |   120   |    75   | Mega gen1-2                         |
 * | W9 |   852  |   151   |    89   | Mega gen5+ (Pattern B target)       |
 * | W10|  1001  |   175   |   111   | Mega gen10+ (Pattern C target)      |
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
        hp: { min: 13, max: 17 },
        atk: { min: 4, max: 5 },
        def: { min: 2, max: 4 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "gazimon",
        hp: { min: 13, max: 19 },
        atk: { min: 4, max: 6 },
        def: { min: 2, max: 4 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "mushroomon",
        hp: { min: 14, max: 20 },
        atk: { min: 5, max: 6 },
        def: { min: 2, max: 4 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "koromon",
        hp: { min: 14, max: 20 },
        atk: { min: 5, max: 6 },
        def: { min: 3, max: 4 },
        discipline: ENEMY_BASE_DISCIPLINE + 1,
      },
      // Phase 1 (killCount 4-6)
      {
        monsterId: "kunemon",
        hp: { min: 17, max: 23 },
        atk: { min: 5, max: 7 },
        def: { min: 3, max: 4 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "gazimon",
        hp: { min: 17, max: 24 },
        atk: { min: 5, max: 7 },
        def: { min: 3, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "tanemon",
        hp: { min: 18, max: 24 },
        atk: { min: 5, max: 7 },
        def: { min: 3, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "tokomon",
        hp: { min: 19, max: 25 },
        atk: { min: 6, max: 7 },
        def: { min: 4, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      // Phase 2 (killCount 7+)
      {
        monsterId: "goblimon",
        hp: { min: 21, max: 27 },
        atk: { min: 7, max: 8 },
        def: { min: 4, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "mushroomon",
        hp: { min: 23, max: 29 },
        atk: { min: 7, max: 8 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "nyaromon",
        hp: { min: 23, max: 29 },
        atk: { min: 7, max: 9 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "bukamon",
        hp: { min: 24, max: 30 },
        atk: { min: 7, max: 9 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
    ],
    boss: {
      monsterId: "ogremon",
      hp: 60,
      atk: 15,
      def: 10,
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
        hp: { min: 24, max: 33 },
        atk: { min: 9, max: 12 },
        def: { min: 6, max: 8 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "goburimon",
        hp: { min: 25, max: 35 },
        atk: { min: 9, max: 12 },
        def: { min: 6, max: 9 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "shamanmon",
        hp: { min: 26, max: 35 },
        atk: { min: 9, max: 12 },
        def: { min: 6, max: 9 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "betamon",
        hp: { min: 27, max: 36 },
        atk: { min: 9, max: 12 },
        def: { min: 6, max: 9 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      // Phase 1
      {
        monsterId: "cyclonemon",
        hp: { min: 33, max: 43 },
        atk: { min: 12, max: 15 },
        def: { min: 8, max: 9 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "gizamon",
        hp: { min: 33, max: 43 },
        atk: { min: 11, max: 14 },
        def: { min: 8, max: 9 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "demidevimon",
        hp: { min: 35, max: 45 },
        atk: { min: 12, max: 15 },
        def: { min: 8, max: 10 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "darktyranomon",
        hp: { min: 35, max: 45 },
        atk: { min: 12, max: 15 },
        def: { min: 8, max: 10 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      // Phase 2
      {
        monsterId: "cyclonemon",
        hp: { min: 42, max: 51 },
        atk: { min: 14, max: 17 },
        def: { min: 9, max: 12 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "goburimon",
        hp: { min: 43, max: 53 },
        atk: { min: 14, max: 17 },
        def: { min: 9, max: 12 },
        discipline: ENEMY_BASE_DISCIPLINE + 4,
      },
      {
        monsterId: "shamanmon",
        hp: { min: 45, max: 53 },
        atk: { min: 14, max: 17 },
        def: { min: 10, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "gizamon",
        hp: { min: 45, max: 54 },
        atk: { min: 14, max: 17 },
        def: { min: 10, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
    ],
    boss: {
      monsterId: "tuskmon",
      hp: 108,
      atk: 26,
      def: 20,
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
        hp: { min: 34, max: 47 },
        atk: { min: 13, max: 17 },
        def: { min: 9, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "numemon",
        hp: { min: 35, max: 48 },
        atk: { min: 13, max: 17 },
        def: { min: 9, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "bakemon",
        hp: { min: 36, max: 50 },
        atk: { min: 14, max: 18 },
        def: { min: 9, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "flymon",
        hp: { min: 38, max: 50 },
        atk: { min: 14, max: 18 },
        def: { min: 10, max: 13 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      // Phase 1
      {
        monsterId: "snimon",
        hp: { min: 47, max: 63 },
        atk: { min: 17, max: 22 },
        def: { min: 12, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      {
        monsterId: "devidramon",
        hp: { min: 48, max: 63 },
        atk: { min: 17, max: 22 },
        def: { min: 12, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      {
        monsterId: "tyrannomon",
        hp: { min: 50, max: 65 },
        atk: { min: 18, max: 22 },
        def: { min: 13, max: 16 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "seadramon",
        hp: { min: 50, max: 65 },
        atk: { min: 18, max: 22 },
        def: { min: 13, max: 16 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      // Phase 2
      {
        monsterId: "drimogemon",
        hp: { min: 60, max: 75 },
        atk: { min: 20, max: 25 },
        def: { min: 15, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "airdramon",
        hp: { min: 60, max: 75 },
        atk: { min: 20, max: 25 },
        def: { min: 15, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 7,
      },
      {
        monsterId: "kuwagamon",
        hp: { min: 62, max: 76 },
        atk: { min: 21, max: 26 },
        def: { min: 15, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "monochromon",
        hp: { min: 63, max: 77 },
        atk: { min: 22, max: 26 },
        def: { min: 16, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
    ],
    boss: {
      monsterId: "devimon",
      hp: 150,
      atk: 39,
      def: 30,
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
        hp: { min: 57, max: 80 },
        atk: { min: 16, max: 21 },
        def: { min: 13, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "bakemon",
        hp: { min: 58, max: 80 },
        atk: { min: 16, max: 21 },
        def: { min: 13, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "devidramon",
        hp: { min: 59, max: 81 },
        atk: { min: 16, max: 22 },
        def: { min: 14, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 9,
      },
      {
        monsterId: "numemon",
        hp: { min: 59, max: 82 },
        atk: { min: 16, max: 22 },
        def: { min: 14, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 9,
      },
      // Phase 1
      {
        monsterId: "fugamon",
        hp: { min: 78, max: 102 },
        atk: { min: 21, max: 27 },
        def: { min: 17, max: 21 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "flymon",
        hp: { min: 79, max: 101 },
        atk: { min: 21, max: 26 },
        def: { min: 17, max: 21 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "drimogemon",
        hp: { min: 80, max: 102 },
        atk: { min: 22, max: 27 },
        def: { min: 18, max: 22 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "snimon",
        hp: { min: 81, max: 102 },
        atk: { min: 22, max: 27 },
        def: { min: 19, max: 22 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      // Phase 2
      {
        monsterId: "monochromon",
        hp: { min: 99, max: 120 },
        atk: { min: 26, max: 31 },
        def: { min: 21, max: 25 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "deltamon",
        hp: { min: 101, max: 122 },
        atk: { min: 26, max: 31 },
        def: { min: 21, max: 25 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "raremon",
        hp: { min: 102, max: 123 },
        atk: { min: 26, max: 31 },
        def: { min: 21, max: 25 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "minotauromon",
        hp: { min: 102, max: 124 },
        atk: { min: 27, max: 31 },
        def: { min: 22, max: 25 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
    ],
    boss: {
      monsterId: "deltamon",
      hp: 230,
      atk: 45,
      def: 38,
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
        hp: { min: 75, max: 102 },
        atk: { min: 17, max: 24 },
        def: { min: 14, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "etemon",
        hp: { min: 76, max: 103 },
        atk: { min: 17, max: 24 },
        def: { min: 14, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "archnemon",
        hp: { min: 78, max: 103 },
        atk: { min: 18, max: 24 },
        def: { min: 15, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      {
        monsterId: "mummymon",
        hp: { min: 79, max: 104 },
        atk: { min: 19, max: 25 },
        def: { min: 15, max: 19 },
        discipline: ENEMY_BASE_DISCIPLINE + 11,
      },
      // Phase 1
      {
        monsterId: "megadramon",
        hp: { min: 100, max: 126 },
        atk: { min: 24, max: 29 },
        def: { min: 19, max: 23 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "blossomon",
        hp: { min: 101, max: 126 },
        atk: { min: 24, max: 29 },
        def: { min: 19, max: 23 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "waruseadramon",
        hp: { min: 101, max: 127 },
        atk: { min: 24, max: 30 },
        def: { min: 19, max: 23 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "skullgreymon",
        hp: { min: 102, max: 127 },
        atk: { min: 24, max: 30 },
        def: { min: 19, max: 23 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      // Phase 2
      {
        monsterId: "skullgreymon",
        hp: { min: 122, max: 145 },
        atk: { min: 29, max: 33 },
        def: { min: 22, max: 26 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "datamon",
        hp: { min: 122, max: 146 },
        atk: { min: 29, max: 33 },
        def: { min: 22, max: 26 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "megaseadramon",
        hp: { min: 123, max: 148 },
        atk: { min: 29, max: 33 },
        def: { min: 23, max: 26 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      {
        monsterId: "metaltyranomon",
        hp: { min: 124, max: 150 },
        atk: { min: 30, max: 33 },
        def: { min: 23, max: 26 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
    ],
    boss: {
      monsterId: "metalgreymon_virus",
      hp: 249,
      atk: 50,
      def: 40,
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
        hp: { min: 110, max: 151 },
        atk: { min: 28, max: 38 },
        def: { min: 22, max: 29 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "etemon",
        hp: { min: 113, max: 152 },
        atk: { min: 28, max: 38 },
        def: { min: 22, max: 29 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "archnemon",
        hp: { min: 115, max: 153 },
        atk: { min: 28, max: 39 },
        def: { min: 22, max: 30 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      {
        monsterId: "mummymon",
        hp: { min: 117, max: 155 },
        atk: { min: 29, max: 39 },
        def: { min: 22, max: 30 },
        discipline: ENEMY_BASE_DISCIPLINE + 14,
      },
      // Phase 1
      {
        monsterId: "waruseadramon",
        hp: { min: 151, max: 189 },
        atk: { min: 37, max: 46 },
        def: { min: 28, max: 35 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "blossomon",
        hp: { min: 151, max: 189 },
        atk: { min: 37, max: 46 },
        def: { min: 29, max: 35 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "megadramon",
        hp: { min: 152, max: 190 },
        atk: { min: 37, max: 46 },
        def: { min: 29, max: 35 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "megaseadramon",
        hp: { min: 153, max: 191 },
        atk: { min: 38, max: 46 },
        def: { min: 29, max: 35 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      // Phase 2
      {
        monsterId: "metaltyranomon",
        hp: { min: 185, max: 218 },
        atk: { min: 45, max: 52 },
        def: { min: 34, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "mammothmon",
        hp: { min: 187, max: 219 },
        atk: { min: 45, max: 52 },
        def: { min: 34, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "skullgreymon",
        hp: { min: 188, max: 220 },
        atk: { min: 45, max: 53 },
        def: { min: 34, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      {
        monsterId: "blossomon",
        hp: { min: 189, max: 221 },
        atk: { min: 45, max: 53 },
        def: { min: 35, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
    ],
    boss: {
      monsterId: "gigadramon",
      hp: 398,
      atk: 75,
      def: 59,
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
        hp: { min: 141, max: 188 },
        atk: { min: 33, max: 45 },
        def: { min: 21, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 143, max: 190 },
        atk: { min: 33, max: 45 },
        def: { min: 21, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "diaboromon",
        hp: { min: 145, max: 193 },
        atk: { min: 34, max: 46 },
        def: { min: 22, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      {
        monsterId: "venommyotismon",
        hp: { min: 146, max: 196 },
        atk: { min: 34, max: 47 },
        def: { min: 22, max: 29 },
        discipline: ENEMY_BASE_DISCIPLINE + 17,
      },
      // Phase 1
      {
        monsterId: "puppetmon",
        hp: { min: 188, max: 237 },
        atk: { min: 45, max: 55 },
        def: { min: 28, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 190, max: 237 },
        atk: { min: 45, max: 55 },
        def: { min: 28, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 191, max: 238 },
        atk: { min: 46, max: 55 },
        def: { min: 28, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 193, max: 238 },
        atk: { min: 46, max: 55 },
        def: { min: 28, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      // Phase 2
      {
        monsterId: "millenniummon",
        hp: { min: 235, max: 279 },
        atk: { min: 53, max: 61 },
        def: { min: 33, max: 37 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      {
        monsterId: "rosemon",
        hp: { min: 237, max: 281 },
        atk: { min: 54, max: 62 },
        def: { min: 33, max: 38 },
        discipline: ENEMY_BASE_DISCIPLINE + 19,
      },
      {
        monsterId: "imperialdramon",
        hp: { min: 238, max: 282 },
        atk: { min: 55, max: 62 },
        def: { min: 34, max: 38 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 240, max: 282 },
        atk: { min: 55, max: 62 },
        def: { min: 34, max: 38 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
    ],
    boss: {
      monsterId: "machinedramon",
      hp: 502,
      atk: 91,
      def: 55,
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
        hp: { min: 204, max: 268 },
        atk: { min: 49, max: 64 },
        def: { min: 30, max: 39 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 207, max: 270 },
        atk: { min: 49, max: 64 },
        def: { min: 30, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 209, max: 271 },
        atk: { min: 50, max: 65 },
        def: { min: 31, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 21,
      },
      {
        monsterId: "piedmon",
        hp: { min: 212, max: 274 },
        atk: { min: 50, max: 66 },
        def: { min: 31, max: 40 },
        discipline: ENEMY_BASE_DISCIPLINE + 21,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 268, max: 329 },
        atk: { min: 63, max: 76 },
        def: { min: 38, max: 46 },
        discipline: ENEMY_BASE_DISCIPLINE + 22,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 270, max: 329 },
        atk: { min: 64, max: 76 },
        def: { min: 38, max: 46 },
        discipline: ENEMY_BASE_DISCIPLINE + 22,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 273, max: 330 },
        atk: { min: 64, max: 78 },
        def: { min: 39, max: 46 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 276, max: 332 },
        atk: { min: 64, max: 78 },
        def: { min: 40, max: 46 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      // Phase 2
      {
        monsterId: "puppetmon",
        hp: { min: 325, max: 373 },
        atk: { min: 75, max: 86 },
        def: { min: 46, max: 51 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 326, max: 377 },
        atk: { min: 75, max: 86 },
        def: { min: 46, max: 51 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "rosemon",
        hp: { min: 329, max: 380 },
        atk: { min: 76, max: 87 },
        def: { min: 46, max: 51 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 332, max: 383 },
        atk: { min: 76, max: 87 },
        def: { min: 46, max: 52 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
    ],
    boss: {
      monsterId: "omegamon",
      hp: 701,
      atk: 120,
      def: 75,
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
        hp: { min: 265, max: 317 },
        atk: { min: 66, max: 79 },
        def: { min: 37, max: 44 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "metalseadramon",
        hp: { min: 267, max: 318 },
        atk: { min: 66, max: 79 },
        def: { min: 37, max: 44 },
        discipline: ENEMY_BASE_DISCIPLINE + 23,
      },
      {
        monsterId: "puppetmon",
        hp: { min: 269, max: 320 },
        atk: { min: 66, max: 79 },
        def: { min: 38, max: 45 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      {
        monsterId: "diaboromon",
        hp: { min: 273, max: 322 },
        atk: { min: 67, max: 79 },
        def: { min: 38, max: 45 },
        discipline: ENEMY_BASE_DISCIPLINE + 24,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 322, max: 383 },
        atk: { min: 79, max: 96 },
        def: { min: 45, max: 53 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 324, max: 384 },
        atk: { min: 80, max: 96 },
        def: { min: 45, max: 53 },
        discipline: ENEMY_BASE_DISCIPLINE + 25,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 327, max: 386 },
        atk: { min: 81, max: 96 },
        def: { min: 45, max: 53 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 329, max: 388 },
        atk: { min: 81, max: 96 },
        def: { min: 46, max: 53 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      // Phase 2
      {
        monsterId: "millenniummon",
        hp: { min: 388, max: 450 },
        atk: { min: 96, max: 112 },
        def: { min: 53, max: 63 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 389, max: 454 },
        atk: { min: 96, max: 113 },
        def: { min: 54, max: 63 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "rosemon",
        hp: { min: 393, max: 459 },
        atk: { min: 97, max: 114 },
        def: { min: 55, max: 64 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "daemon",
        hp: { min: 398, max: 473 },
        atk: { min: 98, max: 117 },
        def: { min: 55, max: 66 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
    ],
    boss: {
      monsterId: "daemon",
      hp: 852,
      atk: 151,
      def: 89,
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
        hp: { min: 300, max: 360 },
        atk: { min: 78, max: 94 },
        def: { min: 48, max: 58 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 302, max: 362 },
        atk: { min: 78, max: 94 },
        def: { min: 48, max: 58 },
        discipline: ENEMY_BASE_DISCIPLINE + 26,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 304, max: 364 },
        atk: { min: 78, max: 95 },
        def: { min: 49, max: 58 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 305, max: 367 },
        atk: { min: 79, max: 96 },
        def: { min: 49, max: 59 },
        discipline: ENEMY_BASE_DISCIPLINE + 27,
      },
      // Phase 1
      {
        monsterId: "venommyotismon",
        hp: { min: 367, max: 434 },
        atk: { min: 96, max: 113 },
        def: { min: 59, max: 70 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 369, max: 435 },
        atk: { min: 96, max: 113 },
        def: { min: 59, max: 70 },
        discipline: ENEMY_BASE_DISCIPLINE + 28,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 371, max: 438 },
        atk: { min: 96, max: 114 },
        def: { min: 59, max: 70 },
        discipline: ENEMY_BASE_DISCIPLINE + 29,
      },
      {
        monsterId: "piedmon",
        hp: { min: 372, max: 440 },
        atk: { min: 96, max: 115 },
        def: { min: 59, max: 70 },
        discipline: ENEMY_BASE_DISCIPLINE + 29,
      },
      // Phase 2
      {
        monsterId: "daemon",
        hp: { min: 440, max: 514 },
        atk: { min: 115, max: 134 },
        def: { min: 70, max: 82 },
        discipline: ENEMY_BASE_DISCIPLINE + 30,
      },
      {
        monsterId: "chaosdramon",
        hp: { min: 444, max: 518 },
        atk: { min: 116, max: 135 },
        def: { min: 71, max: 83 },
        discipline: ENEMY_BASE_DISCIPLINE + 30,
      },
      {
        monsterId: "millenniummon",
        hp: { min: 447, max: 524 },
        atk: { min: 116, max: 136 },
        def: { min: 72, max: 84 },
        discipline: ENEMY_BASE_DISCIPLINE + 31,
      },
      {
        monsterId: "belialvamdemon",
        hp: { min: 454, max: 534 },
        atk: { min: 118, max: 137 },
        def: { min: 73, max: 85 },
        discipline: ENEMY_BASE_DISCIPLINE + 32,
      },
    ],
    boss: {
      monsterId: "apocalymon",
      hp: 1001,
      atk: 175,
      def: 111,
      discipline: BOSS_BASE_DISCIPLINE + 32,
    },
  },
];

/** ワールド番号からの検索マップ */
export const WORLD_MAP: ReadonlyMap<number, WorldDefinition> = new Map(
  WORLD_DEFINITIONS.map((w) => [w.worldNumber, w])
);
