/**
 * World stat transformation v2 — rebalance for 20% evo boost system
 *
 * With 20% evo boost, player stats at each stage are much lower:
 *   Ultimate: HP~190, ATK~100, DEF~80 (vs old HP~1200, ATK~500)
 *   Mega:     HP~400, ATK~200, DEF~170 (vs old HP~3000, ATK~1500)
 *
 * Boss design: ~40% win rate at target player level (4-5 rounds each)
 * Target player = pattern that "should" be at that world, with typical equipment.
 *
 * Scaling ratios from CURRENT boss stats to NEW target stats.
 */

const fs = require('fs');
const path = require('path');

// Per-world scaling: [hpScale, atkScale, defScale]
// Computed from: newBossStat / currentBossStat
const WORLD_SCALE = {
  1:  [0.75, 0.68, 0.50],   // Baby II, no equip
  2:  [0.77, 0.62, 0.63],   // Rookie, small equip
  3:  [0.84, 0.75, 0.79],   // Champion gen1
  4:  [0.77, 0.45, 0.53],   // Champion gen2-3 w/equip
  5:  [0.99, 0.57, 0.69],   // Ultimate gen1
  6:  [0.82, 0.51, 0.60],   // Ultimate gen2+
  7:  [0.95, 0.63, 0.68],   // Mega gen1
  8:  [0.92, 0.65, 0.67],   // Mega gen2+
  9:  [0.52, 0.37, 0.38],   // Mega gen5+
  10: [0.59, 0.36, 0.41],   // Mega gen10+
};

const filePath = path.join(__dirname, '..', 'src', 'data', 'worlds.ts');
let content = fs.readFileSync(filePath, 'utf-8');

let currentWorld = 0;

const lines = content.split('\n');
const output = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  const worldMatch = line.match(/W(\d+)[:：]/);
  if (worldMatch) {
    currentWorld = parseInt(worldMatch[1]);
  }

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

fs.writeFileSync(filePath, output.join('\n'), 'utf-8');

console.log('World stats transformed (v2 for 20% evo boost)!');
console.log('\nNew boss stats (approximate):');
const bossTargets = {
  1:  [80, 22, 20],   // current pre-transform
  2:  [140, 42, 32],
  3:  [179, 52, 38],
  4:  [299, 100, 72],
  5:  [370, 115, 80],
  6:  [558, 164, 116],
  7:  [800, 231, 190],
  8:  [990, 275, 216],
  9:  [1800, 504, 405],
  10: [1950, 532, 414],
};
for (const [w, [hpS, atkS, defS]] of Object.entries(WORLD_SCALE)) {
  const [oh, oa, od] = bossTargets[w];
  console.log(`  W${w}: HP${Math.round(oh*hpS)} ATK${Math.round(oa*atkS)} DEF${Math.round(od*defS)}`);
}
