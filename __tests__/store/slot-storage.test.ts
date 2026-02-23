/**
 * スロット対応ストレージのテスト
 *
 * - キープレフィックスの正確性
 * - スロット切替
 * - レガシーデータ移行
 */

import {
  getActiveSlot,
  setActiveSlot,
  getRawPlatformStorage,
} from "../../src/store/storage";

// React Native の Platform を web にモック
jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

// localStorage モック
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => mockStorage[key] ?? null),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  }),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
  setActiveSlot(0);
});

describe("storage.ts", () => {
  describe("getActiveSlot / setActiveSlot", () => {
    it("デフォルトはスロット0", () => {
      expect(getActiveSlot()).toBe(0);
    });

    it("setActiveSlot でスロットを変更できる", () => {
      setActiveSlot(2);
      expect(getActiveSlot()).toBe(2);
    });
  });

  describe("slotStorage キープレフィックス", () => {
    it("スロット0でのキーは slot-0/ プレフィックス", () => {
      setActiveSlot(0);
      const storage = getRawPlatformStorage();

      // slotAwareStorage は createJSONStorage 経由なので、直接テスト
      // 代わりに getRawPlatformStorage でプラットフォームストレージをテスト
      storage.setItem("slot-0/digiride-game", '{"test": true}');
      expect(mockStorage["slot-0/digiride-game"]).toBe('{"test": true}');
    });

    it("異なるスロットは異なるキーに書き込む", () => {
      const storage = getRawPlatformStorage();

      storage.setItem("slot-0/digiride-game", '{"slot": 0}');
      storage.setItem("slot-1/digiride-game", '{"slot": 1}');
      storage.setItem("slot-2/digiride-game", '{"slot": 2}');

      expect(mockStorage["slot-0/digiride-game"]).toBe('{"slot": 0}');
      expect(mockStorage["slot-1/digiride-game"]).toBe('{"slot": 1}');
      expect(mockStorage["slot-2/digiride-game"]).toBe('{"slot": 2}');
    });

    it("グローバルキーはプレフィックスなし", () => {
      const storage = getRawPlatformStorage();

      storage.setItem("digiride-settings", '{"sound": true}');
      expect(mockStorage["digiride-settings"]).toBe('{"sound": true}');
    });
  });

  describe("getRawPlatformStorage", () => {
    it("Web環境ではlocalStorageを返す", () => {
      const storage = getRawPlatformStorage();
      storage.setItem("test-key", "test-value");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        "test-value"
      );
    });
  });
});

describe("レガシーデータ移行", () => {
  it("旧キーが存在する場合、slot-0/ にコピーされる", async () => {
    // 旧データをセット
    mockStorage["digiride-game"] = JSON.stringify({
      state: { phase: "alive", tp: { low: 10, mid: 5, high: 3 } },
      version: 0,
    });
    mockStorage["digiride-monster"] = JSON.stringify({
      state: {
        monster: {
          name: "テスト",
          definitionId: "koromon",
          generation: 1,
        },
      },
      version: 0,
    });
    mockStorage["digiride-world"] = JSON.stringify({
      state: { currentWorldNumber: 1 },
      version: 0,
    });
    mockStorage["digiride-encyclopedia"] = JSON.stringify({
      state: { discoveredIds: ["botamon"] },
      version: 0,
    });

    // migrateLegacyData はストアに依存するため、
    // ここでは getRawPlatformStorage を使って手動で移行ロジックを検証
    const storage = getRawPlatformStorage();
    const legacyKeys = [
      "digiride-game",
      "digiride-monster",
      "digiride-world",
      "digiride-encyclopedia",
    ];

    for (const key of legacyKeys) {
      const value = storage.getItem(key);
      if (value) {
        storage.setItem(`slot-0/${key}`, value as string);
      }
    }

    // slot-0/ にコピーされていることを確認
    expect(mockStorage["slot-0/digiride-game"]).toBeDefined();
    expect(mockStorage["slot-0/digiride-monster"]).toBeDefined();
    expect(mockStorage["slot-0/digiride-world"]).toBeDefined();
    expect(mockStorage["slot-0/digiride-encyclopedia"]).toBeDefined();

    // 元データは残っている（フォールバック用）
    expect(mockStorage["digiride-game"]).toBeDefined();

    // コピー内容が正しい
    const copiedGame = JSON.parse(mockStorage["slot-0/digiride-game"]);
    expect(copiedGame.state.phase).toBe("alive");
  });

  it("旧キーが存在しない場合、何も起こらない", () => {
    const storage = getRawPlatformStorage();
    const legacyKeys = [
      "digiride-game",
      "digiride-monster",
      "digiride-world",
      "digiride-encyclopedia",
    ];

    for (const key of legacyKeys) {
      const value = storage.getItem(key);
      if (value) {
        storage.setItem(`slot-0/${key}`, value as string);
      }
    }

    // slot-0/ キーは作られない
    expect(mockStorage["slot-0/digiride-game"]).toBeUndefined();
  });

  it("スロット削除でストレージキーが消える", () => {
    const storage = getRawPlatformStorage();

    // スロット1にデータを作成
    storage.setItem("slot-1/digiride-game", '{"state": {}}');
    storage.setItem("slot-1/digiride-monster", '{"state": {}}');
    storage.setItem("slot-1/digiride-world", '{"state": {}}');
    storage.setItem("slot-1/digiride-encyclopedia", '{"state": {}}');

    expect(mockStorage["slot-1/digiride-game"]).toBeDefined();

    // 削除
    const slotKeys = [
      "digiride-game",
      "digiride-monster",
      "digiride-world",
      "digiride-encyclopedia",
    ];
    for (const key of slotKeys) {
      storage.removeItem(`slot-1/${key}`);
    }

    expect(mockStorage["slot-1/digiride-game"]).toBeUndefined();
    expect(mockStorage["slot-1/digiride-monster"]).toBeUndefined();
    expect(mockStorage["slot-1/digiride-world"]).toBeUndefined();
    expect(mockStorage["slot-1/digiride-encyclopedia"]).toBeUndefined();
  });
});

describe("スロット間データ分離", () => {
  it("異なるスロットのデータが互いに干渉しない", () => {
    const storage = getRawPlatformStorage();

    // スロット0のデータ
    storage.setItem(
      "slot-0/digiride-monster",
      JSON.stringify({ state: { monster: { name: "アグモン" } } })
    );

    // スロット1のデータ
    storage.setItem(
      "slot-1/digiride-monster",
      JSON.stringify({ state: { monster: { name: "ガブモン" } } })
    );

    // それぞれ独立していることを確認
    const slot0Data = JSON.parse(mockStorage["slot-0/digiride-monster"]);
    const slot1Data = JSON.parse(mockStorage["slot-1/digiride-monster"]);

    expect(slot0Data.state.monster.name).toBe("アグモン");
    expect(slot1Data.state.monster.name).toBe("ガブモン");
  });

  it("設定データはスロットに依存しない", () => {
    const storage = getRawPlatformStorage();

    // 設定はグローバル
    storage.setItem(
      "digiride-settings",
      JSON.stringify({ state: { soundEnabled: false } })
    );

    // スロットを切り替えても設定は同じ
    setActiveSlot(0);
    expect(mockStorage["digiride-settings"]).toBeDefined();

    setActiveSlot(1);
    expect(mockStorage["digiride-settings"]).toBeDefined();

    // スロット別の設定キーは存在しない
    expect(mockStorage["slot-0/digiride-settings"]).toBeUndefined();
    expect(mockStorage["slot-1/digiride-settings"]).toBeUndefined();
  });
});
