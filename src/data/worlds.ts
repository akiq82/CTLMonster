/**
 * ワールド定義（全8ワールド）
 *
 * GDD.md セクション7.3 敵ステータス目安テーブルに完全準拠。
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
 *
 * 全ワールド共通:
 *   - ボス到達に必要な撃破数: 15体
 *   - エンカウント1回のWP消費: 3,000 WP
 *   - ボス戦のWP消費: 5,000 WP
 *   - エンカウント失敗率: 20%
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
      {
        monsterId: "goblimon",
        hp: { min: 15, max: 25 },
        atk: { min: 5, max: 8 },
        def: { min: 3, max: 5 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "gazimon",
        hp: { min: 20, max: 30 },
        atk: { min: 7, max: 10 },
        def: { min: 4, max: 6 },
        discipline: ENEMY_BASE_DISCIPLINE,
      },
      {
        monsterId: "goblimon",
        hp: { min: 25, max: 35 },
        atk: { min: 9, max: 12 },
        def: { min: 5, max: 8 },
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
      {
        monsterId: "darktyranomon",
        hp: { min: 40, max: 60 },
        atk: { min: 15, max: 22 },
        def: { min: 10, max: 15 },
        discipline: ENEMY_BASE_DISCIPLINE + 2,
      },
      {
        monsterId: "cyclonemon",
        hp: { min: 55, max: 75 },
        atk: { min: 20, max: 26 },
        def: { min: 13, max: 18 },
        discipline: ENEMY_BASE_DISCIPLINE + 3,
      },
      {
        monsterId: "darktyranomon",
        hp: { min: 70, max: 90 },
        atk: { min: 24, max: 30 },
        def: { min: 17, max: 22 },
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
      {
        monsterId: "minotauromon",
        hp: { min: 80, max: 120 },
        atk: { min: 28, max: 40 },
        def: { min: 20, max: 28 },
        discipline: ENEMY_BASE_DISCIPLINE + 5,
      },
      {
        monsterId: "snimon",
        hp: { min: 110, max: 150 },
        atk: { min: 38, max: 48 },
        def: { min: 26, max: 34 },
        discipline: ENEMY_BASE_DISCIPLINE + 6,
      },
      {
        monsterId: "drimogemon",
        hp: { min: 140, max: 180 },
        atk: { min: 45, max: 55 },
        def: { min: 32, max: 40 },
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
      {
        monsterId: "nanimon",
        hp: { min: 160, max: 230 },
        atk: { min: 50, max: 70 },
        def: { min: 40, max: 55 },
        discipline: ENEMY_BASE_DISCIPLINE + 8,
      },
      {
        monsterId: "fugamon",
        hp: { min: 220, max: 290 },
        atk: { min: 68, max: 85 },
        def: { min: 52, max: 65 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "monochromon",
        hp: { min: 280, max: 350 },
        atk: { min: 82, max: 100 },
        def: { min: 62, max: 75 },
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
      {
        monsterId: "mammothmon",
        hp: { min: 300, max: 420 },
        atk: { min: 90, max: 125 },
        def: { min: 70, max: 95 },
        discipline: ENEMY_BASE_DISCIPLINE + 10,
      },
      {
        monsterId: "megadramon",
        hp: { min: 400, max: 510 },
        atk: { min: 120, max: 148 },
        def: { min: 92, max: 115 },
        discipline: ENEMY_BASE_DISCIPLINE + 12,
      },
      {
        monsterId: "skullgreymon",
        hp: { min: 490, max: 600 },
        atk: { min: 145, max: 170 },
        def: { min: 110, max: 130 },
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
      {
        monsterId: "datamon",
        hp: { min: 500, max: 700 },
        atk: { min: 150, max: 210 },
        def: { min: 120, max: 165 },
        discipline: ENEMY_BASE_DISCIPLINE + 13,
      },
      {
        monsterId: "waruseadramon",
        hp: { min: 680, max: 860 },
        atk: { min: 200, max: 248 },
        def: { min: 158, max: 195 },
        discipline: ENEMY_BASE_DISCIPLINE + 15,
      },
      {
        monsterId: "blossomon",
        hp: { min: 840, max: 1000 },
        atk: { min: 240, max: 280 },
        def: { min: 190, max: 220 },
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
      {
        monsterId: "piedmon",
        hp: { min: 900, max: 1250 },
        atk: { min: 260, max: 360 },
        def: { min: 210, max: 290 },
        discipline: ENEMY_BASE_DISCIPLINE + 16,
      },
      {
        monsterId: "puppetmon",
        hp: { min: 1200, max: 1520 },
        atk: { min: 350, max: 425 },
        def: { min: 280, max: 340 },
        discipline: ENEMY_BASE_DISCIPLINE + 18,
      },
      {
        monsterId: "blackwargreymon",
        hp: { min: 1500, max: 1800 },
        atk: { min: 415, max: 480 },
        def: { min: 330, max: 380 },
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
      {
        monsterId: "diaboromon",
        hp: { min: 1600, max: 2150 },
        atk: { min: 450, max: 600 },
        def: { min: 360, max: 475 },
        discipline: ENEMY_BASE_DISCIPLINE + 20,
      },
      {
        monsterId: "venommyotismon",
        hp: { min: 2100, max: 2600 },
        atk: { min: 580, max: 710 },
        def: { min: 460, max: 555 },
        discipline: ENEMY_BASE_DISCIPLINE + 22,
      },
      {
        monsterId: "grandkuwagamon",
        hp: { min: 2550, max: 3000 },
        atk: { min: 690, max: 800 },
        def: { min: 545, max: 620 },
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
];

/** ワールド番号からの検索マップ */
export const WORLD_MAP: ReadonlyMap<number, WorldDefinition> = new Map(
  WORLD_DEFINITIONS.map((w) => [w.worldNumber, w])
);
