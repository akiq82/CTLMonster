# DigiRide — フィットネス連動型デジタルモンスター育成ゲーム

## プロジェクト概要

歩数・階段データとサイクリングトレーニングデータを連携させたデジモン風育成バトルゲーム。React Native (Expo) で Android / Web (PWA) 対応。

## 技術スタック

- **Runtime:** React Native + Expo (SDK 52+)
- **Language:** TypeScript
- **State Management:** Zustand
- **Local DB:** expo-sqlite (図鑑・世代データ永続化)
- **Health Data:** react-native-health-connect (Android Health Connect API)
- **Training Data:** RideMetrics MCP Server (REST API)
- **Notifications:** expo-notifications
- **Animation:** react-native-reanimated
- **Audio:** expo-av
- **Testing:** Jest + React Native Testing Library

## ディレクトリ構成

```
digiride/
├── CLAUDE.md                    # このファイル
├── GDD.md                       # ゲームデザインドキュメント（仕様の真実の源泉）
├── app.json
├── package.json
├── tsconfig.json
├── src/
│   ├── app/                     # Expo Router (画面遷移)
│   │   ├── _layout.tsx
│   │   ├── index.tsx            # メイン育成画面
│   │   ├── battle.tsx           # バトル画面
│   │   ├── training.tsx         # トレーニング画面
│   │   ├── world-select.tsx     # ワールド選択画面
│   │   ├── encyclopedia.tsx     # 図鑑画面
│   │   ├── status.tsx           # ステータス詳細画面
│   │   └── settings.tsx         # 設定画面
│   │
│   ├── engine/                  # ゲームロジック（純粋関数、UIに依存しない）
│   │   ├── battle.ts            # 自動バトルエンジン
│   │   ├── evolution.ts         # 進化判定・分岐ロジック
│   │   ├── training.ts          # トレーニングメニュー・ステータス上昇計算
│   │   ├── discipline.ts        # 規律パラメータの変動計算
│   │   ├── lifespan.ts          # 寿命管理・食事効果
│   │   ├── encounter.ts         # WPエンカウント判定
│   │   ├── pmc-bonus.ts         # PMCボーナス計算
│   │   ├── tp-calculator.ts     # ゾーン別擬似TSS→TP変換
│   │   ├── generation.ts        # 世代引き継ぎ（「記憶」装備生成）
│   │   └── world.ts             # ワールド定義・敵テーブル・ボス条件
│   │
│   ├── data/                    # 静的データ定義
│   │   ├── monsters.ts          # 全モンスター定義（ステータス上限、進化ツリー）
│   │   ├── worlds.ts            # ワールド別敵テーブル
│   │   ├── training-menus.ts    # トレーニングメニュー定義
│   │   ├── badges.ts            # 実績/バッジ定義
│   │   └── sprites/             # ピクセルアートアセット
│   │       ├── index.ts         # スプライトマッピング
│   │       └── *.png            # 16x16 or 32x32 ピクセルアート
│   │
│   ├── store/                   # Zustand ストア
│   │   ├── game-store.ts        # メインゲームステート
│   │   ├── monster-store.ts     # 現在のモンスター状態
│   │   ├── world-store.ts       # ワールド進行状態
│   │   ├── encyclopedia-store.ts # 図鑑データ
│   │   └── settings-store.ts    # ユーザー設定
│   │
│   ├── services/                # 外部データ連携
│   │   ├── health-connect.ts    # Health Connect API (歩数/階段)
│   │   ├── ride-metrics.ts      # RideMetrics MCP Server API
│   │   ├── notifications.ts     # 通知管理
│   │   └── daily-sync.ts        # 朝ログイン時の一括同期処理
│   │
│   ├── db/                      # SQLiteスキーマ・マイグレーション
│   │   ├── schema.ts            # テーブル定義
│   │   ├── migrations.ts        # マイグレーション
│   │   └── queries.ts           # CRUD操作
│   │
│   ├── components/              # UIコンポーネント
│   │   ├── lcd-screen/          # LCD液晶風メイン画面
│   │   │   ├── LcdFrame.tsx     # デバイス筐体フレーム
│   │   │   ├── MonsterSprite.tsx # ピクセルアートレンダリング
│   │   │   ├── StatusBars.tsx   # HP/規律/寿命バー
│   │   │   └── MenuButtons.tsx  # 操作ボタン
│   │   ├── BattleAnimation.tsx  # バトル演出
│   │   ├── EvolutionScene.tsx   # 進化演出
│   │   ├── TrainingMenu.tsx     # トレーニング選択UI
│   │   ├── MealPrompt.tsx       # 食事質問ダイアログ
│   │   ├── WorldMap.tsx         # ワールド選択マップ
│   │   └── EncyclopediaGrid.tsx # 図鑑グリッド
│   │
│   ├── hooks/                   # カスタムフック
│   │   ├── useGameLoop.ts       # メインゲームループ (空腹減少、HP自然回復等)
│   │   ├── useDailySync.ts      # 朝ログイン判定・PMCボーナス付与
│   │   ├── useHealthData.ts     # Health Connect データ取得
│   │   └── useRideMetrics.ts    # RideMetrics データ取得
│   │
│   ├── types/                   # TypeScript型定義
│   │   ├── monster.ts           # モンスター関連型
│   │   ├── battle.ts            # バトル関連型
│   │   ├── training.ts          # トレーニング関連型
│   │   ├── world.ts             # ワールド関連型
│   │   └── ride-metrics.ts      # RideMetrics API レスポンス型
│   │
│   └── utils/                   # ユーティリティ
│       ├── random.ts            # 乱数ヘルパー（範囲指定、確率判定）
│       ├── clamp.ts             # 数値クランプ
│       └── format.ts            # 表示フォーマット
│
└── __tests__/                   # テスト
    ├── engine/                  # エンジンユニットテスト（最優先）
    │   ├── battle.test.ts
    │   ├── evolution.test.ts
    │   ├── training.test.ts
    │   ├── tp-calculator.test.ts
    │   ├── pmc-bonus.test.ts
    │   └── encounter.test.ts
    └── services/
        └── ride-metrics.test.ts
```

## コーディング規約

### 全般
- TypeScript strict mode 必須
- 関数はできるだけ純粋関数にする（特に engine/ 配下）
- 副作用は services/ と hooks/ に集約
- マジックナンバー禁止。定数は data/ または engine/ 内の const で定義

### ゲームエンジン (src/engine/)
- **UIに一切依存しないこと**。React/React Native の import 禁止
- 入力→出力が明確な純粋関数で実装
- 全関数にJSDocコメント（パラメータ説明、計算式の根拠）
- GDD.md の数値テーブルをそのまま定数として定義

### 状態管理 (src/store/)
- Zustand の persist ミドルウェアで AsyncStorage に永続化
- 図鑑・世代データは SQLite に保存（大量データ対応）
- ゲーム中のリアルタイム状態は Zustand のみ

### テスト
- engine/ の全関数にユニットテスト必須
- GDD.md の具体例（Akihiroの実データ）をテストケースとして使用
- バランス検証テスト: 「CTL53/週3ライドで1世代W1ギリギリ」を自動検証

## 重要な設計判断

### 1. WP (歩数カウント) → エンカウント
- 1歩 = 1 WP, 1階 = 100 WP
- エンカウント1回 = 3,000 WP消費（20%で空振り）
- ボス戦 = 5,000 WP消費
- 全ワールド共通。難易度差は敵ステータスで表現

### 2. TP 3系統（低/中/高強度）
- RideMetrics のゾーン別滞在時間 × IF係数² で擬似TSS算出
- Z1-Z2 → TP-L (HP向き), Z3-Z4 → TP-M (DEF向き), Z5-Z7 → TP-H (ATK向き)
- PMCボーナスは朝1回、CTL/TSBから基礎TP付与

### 3. ゴールド/ガチャ経済は存在しない
- 通貨システムなし。TP とアイテム（世代引き継ぎ装備のみ）
- 食事は自己申告制（朝昼晩）

### 4. 進化条件 = ステータス閾値 + ボス撃破
- HP/ATK/DEF が閾値を超え、かつ特定ワールドのボスを撃破済みであること
- 進化分岐は累計TP消費比率（L/M/H）で決定

### 5. 世代引き継ぎ = 「○○の記憶」装備
- 前世代の最終ステ(装備込み) × 20% の装備品を1世代のみ引き継ぎ
- 無限増殖しない設計

### 6. 規律パラメータ
- PMCボーナスランク + 前日食事回数で日次変動
- 命中率 / 回避率に微小補正

### 7. 寿命
- 基礎 7〜9日。食事1回につき20%確率で+0.5日
- 48時間放置で強制死亡

## RideMetrics MCP Server API

RideMetrics は MCP Server として提供される。以下の3エンドポイントを使用:

```typescript
// 1. フィットネスサマリー（PMCボーナス計算用）
// CTL, ATL, TSB, 週間TSS, FTP履歴
GET /training-summary?sport=cycling

// 2. 最近のワークアウト（ゾーン別TP計算用）
// 各ワークアウトの zoneTime (z1-z7の秒数), TSS, IF
GET /recent-workouts?days=28&sport=cycling

// 3. パワーカーブ（実績判定用、オプション）
GET /power-curve?days=90&sport=cycling&weight=70.9
```

### MCP Server 接続設定

Claude Code で RideMetrics MCP Server を使用する場合:
```json
// .claude/settings.json
{
  "mcpServers": {
    "ride-metrics": {
      "url": "https://ride-metrics.vercel.app/api/mcp"
    }
  }
}
```

## 開発フェーズ

### Phase 1: コアエンジン（最優先）
engine/ のすべてのモジュールを実装し、テストを通す。UIなしで全ゲームロジックが動作すること。

**実装順序:**
1. `types/` — 全型定義
2. `data/monsters.ts` — モンスター定義（最低10体: 幼年期I×2, 幼年期II×2, 成長期×3, 成熟期×3）
3. `data/worlds.ts` — W1〜W2 の敵テーブル
4. `data/training-menus.ts` — 8種のトレーニングメニュー
5. `engine/tp-calculator.ts` — ゾーン別擬似TSS→TP変換
6. `engine/pmc-bonus.ts` — PMCボーナス計算
7. `engine/training.ts` — トレーニング実行→ステータス上昇
8. `engine/battle.ts` — 自動バトルエンジン
9. `engine/evolution.ts` — 進化判定・分岐
10. `engine/encounter.ts` — WPエンカウント
11. `engine/discipline.ts` — 規律変動
12. `engine/lifespan.ts` — 寿命管理
13. `engine/generation.ts` — 世代引き継ぎ
14. `engine/world.ts` — ワールド進行管理

### Phase 2: UI（LCD画面）
Expo Router + コンポーネント実装。LCD液晶風のレトロUIを構築。

### Phase 3: 外部連携
Health Connect, RideMetrics API, 通知を統合。

### Phase 4: データ永続化
SQLite で図鑑・世代履歴、AsyncStorage でリアルタイムゲーム状態。

## GDD参照

全ての数値設計・バランス調整は `GDD.md` を真実の源泉（Single Source of Truth）とする。
実装中に数値の矛盾や不明点があれば、GDD.md を参照し、それでも不明な場合は質問すること。
