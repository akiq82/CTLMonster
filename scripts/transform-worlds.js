/**
 * World stat transformation script
 *
 * Scales world enemy stats to match the new player stat caps (×1.0-2.0 training factors).
 * Each world has its own HP/ATK/DEF scaling ratio based on target player power.
 */

const fs = require('fs');
const path = require('path');

// Per-world scaling ratios: [hpScale, atkScale, defScale]
// Derived from: new achievable player power / old world stat expectations
// W1 goes UP (Baby II cap increased relative to old balance)
// W2-W10 go DOWN (higher stages have dramatically reduced caps)
const WORLD_SCALE = {
  1:  [1.14, 1.10, 1.33],  // Baby II is relatively stronger now
  2:  [0.78, 0.93, 0.91],  // Rookie transition
  3:  [0.51, 0.61, 0.58],  // Rookie late
  4:  [0.46, 0.69, 0.63],  // Champion
  5:  [0.37, 0.46, 0.40],  // Champion late
  6:  [0.31, 0.41, 0.35],  // Ultimate
  7:  [0.25, 0.33, 0.34],  // Ultimate late
  8:  [0.18, 0.25, 0.24],  // Mega gate
  9:  [0.20, 0.28, 0.27],  // Mega strong
  10: [0.13, 0.19, 0.18],  // Mega strongest
};

const filePath = path.join(__dirname, '..', 'src', 'data', 'worlds.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Track current world number
let currentWorld = 0;

// Process line by line to maintain context
const lines = content.split('\n');
const output = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Detect world number from comment
  const worldMatch = line.match(/W(\d+)[:：]/);
  if (worldMatch) {
    currentWorld = parseInt(worldMatch[1]);
  }

  // Also detect from worldNumber property
  const worldNumMatch = line.match(/worldNumber:\s*(\d+)/);
  if (worldNumMatch) {
    currentWorld = parseInt(worldNumMatch[1]);
  }

  if (currentWorld > 0 && WORLD_SCALE[currentWorld]) {
    const [hpS, atkS, defS] = WORLD_SCALE[currentWorld];

    // Scale boss stats: hp: 70, atk: 20, def: 15
    line = line.replace(/hp:\s*(\d+),/g, (match, val) => {
      const newVal = Math.round(parseInt(val) * hpS);
      return `hp: ${newVal},`;
    });
    line = line.replace(/atk:\s*(\d+),/g, (match, val) => {
      const newVal = Math.round(parseInt(val) * atkS);
      return `atk: ${newVal},`;
    });
    line = line.replace(/def:\s*(\d+),/g, (match, val) => {
      const newVal = Math.round(parseInt(val) * defS);
      return `def: ${newVal},`;
    });

    // Scale mob stats with ranges: hp: { min: 15, max: 20 }
    line = line.replace(/hp:\s*\{\s*min:\s*(\d+),\s*max:\s*(\d+)\s*\}/g, (match, min, max) => {
      const newMin = Math.round(parseInt(min) * hpS);
      const newMax = Math.round(parseInt(max) * hpS);
      return `hp: { min: ${newMin}, max: ${newMax} }`;
    });
    line = line.replace(/atk:\s*\{\s*min:\s*(\d+),\s*max:\s*(\d+)\s*\}/g, (match, min, max) => {
      const newMin = Math.round(parseInt(min) * atkS);
      const newMax = Math.round(parseInt(max) * atkS);
      return `atk: { min: ${newMin}, max: ${newMax} }`;
    });
    line = line.replace(/def:\s*\{\s*min:\s*(\d+),\s*max:\s*(\d+)\s*\}/g, (match, min, max) => {
      const newMin = Math.round(parseInt(min) * defS);
      const newMax = Math.round(parseInt(max) * defS);
      return `def: { min: ${newMin}, max: ${newMax} }`;
    });
  }

  output.push(line);
}

// Update the comment table at the top
const newTable = `/**
 * ワールド定義（全10ワールド）
 *
 * 段階倍率×1.0-2.0に合わせてリバランス。
 * 各ワールド12体のモブ敵 (3フェーズ×4体) + ボス1体。
 *
 * | W  | モブHP      | モブATK     | モブDEF     | ボスHP | ボスATK | ボスDEF | 想定形態     |
 * |----|------------|------------|------------|--------|---------|---------|-------------|
 * | W1 | 17〜40     | 6〜13      | 4〜11      | 80     | 22      | 20      | 幼年期II     |
 * | W2 | 31〜70     | 14〜28     | 9〜20      | 140    | 42      | 32      | 成長期序盤   |
 * | W3 | 41〜92     | 17〜34     | 12〜23     | 179    | 52      | 38      | 成長期終盤   |
 * | W4 | 74〜161    | 35〜69     | 25〜47     | 299    | 100     | 72      | 成熟期       |
 * | W5 | 111〜222   | 41〜78     | 28〜52     | 370    | 115     | 80      | 成熟期終盤   |
 * | W6 | 155〜310   | 62〜115    | 42〜77     | 558    | 164     | 116     | 完全体       |
 * | W7 | 225〜450   | 86〜158    | 71〜129    | 800    | 231     | 190     | 完全体終盤   |
 * | W8 | 288〜540   | 113〜200   | 86〜149    | 990    | 275     | 216     | 究極体       |
 * | W9 | 560〜1000  | 218〜392   | 167〜297   | 1800   | 504     | 405     | 究極体強     |
 * | W10| 585〜1040  | 238〜418   | 180〜317   | 1950   | 532     | 414     | 究極体最強   |
 *
 * 全ワールド共通:
 *   - ボス到達に必要な撃破数: 10体
 *   - エンカウント1回のWP消費: 2,000 WP
 *   - ボス戦のWP消費: 3,000 WP
 */`;

const result = output.join('\n');
// Replace old comment block
const commentEnd = result.indexOf('import {');
const finalContent = newTable + '\n\n' + result.substring(commentEnd);

fs.writeFileSync(filePath, finalContent, 'utf-8');

console.log('World stats transformed successfully!');
console.log('\nNew boss stats:');
for (const [w, [hpS, atkS, defS]] of Object.entries(WORLD_SCALE)) {
  const bosses = {
    1: [70, 20, 15], 2: [180, 45, 35], 3: [350, 85, 65],
    4: [650, 145, 115], 5: [1000, 250, 200], 6: [1800, 400, 330],
    7: [3200, 700, 560], 8: [5500, 1100, 900], 9: [9000, 1800, 1500],
    10: [15000, 2800, 2300]
  };
  const [oh, oa, od] = bosses[w];
  console.log(`  W${w}: HP${Math.round(oh*hpS)} ATK${Math.round(oa*atkS)} DEF${Math.round(od*defS)}`);
}
