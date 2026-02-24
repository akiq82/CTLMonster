/**
 * World stat transformation v3 — further reduce W5-W10
 *
 * After v2 transform, simulation shows W7+ bosses are still unbeatable.
 * Actual player stats from diagnostic (with 20% evo boost):
 *
 *   Pattern A (CTL70) Ultimate steady: Total HP227/ATK120/DEF93
 *   Pattern B (CTL80) Mega gen16+:    Total ~HP430/ATK215/DEF175
 *   Pattern C (CTL90) Mega gen3:      Total HP494/ATK254/DEF206
 *
 * Boss design target: ~40% win rate at target player level.
 * Key issue: Boss DEF too high → creates hard damage floor.
 *
 * W1-W4: Keep current (working correctly).
 * W5-W10: Apply additional scaling down, especially DEF.
 */

const fs = require('fs');
const path = require('path');

// Only scale W5-W10. W1-W4 are fine.
// [hpScale, atkScale, defScale] applied to current post-v2 values
const WORLD_SCALE = {
  5:  [0.68, 0.76, 0.73],   // Ultimate gen1: HP250, ATK50, DEF40
  6:  [0.87, 0.89, 0.86],   // Ultimate gen2-3: HP400, ATK75, DEF60
  7:  [0.66, 0.62, 0.43],   // Ultimate steady (gen5+): HP500, ATK90, DEF55
  8:  [0.77, 0.67, 0.52],   // Mega gen1-2: HP700, ATK120, DEF75
  9:  [0.91, 0.81, 0.58],   // Mega gen5+: HP850, ATK150, DEF90
  10: [0.87, 0.91, 0.65],   // Mega gen10+: HP1000, ATK175, DEF110
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

console.log('World stats transformed (v3 — W5-W10 further reduced)!');
console.log('\nTarget boss stats:');
const targets = {
  5:  'HP~250, ATK~50, DEF~40  (target: Champion gen3-5 / Ultimate gen1)',
  6:  'HP~400, ATK~75, DEF~60  (target: Ultimate gen2-3)',
  7:  'HP~500, ATK~90, DEF~55  (target: Ultimate gen5+, Pattern A)',
  8:  'HP~700, ATK~120, DEF~75 (target: Mega gen1-2)',
  9:  'HP~850, ATK~150, DEF~90 (target: Mega gen5+, Pattern B)',
  10: 'HP~1000, ATK~175, DEF~110 (target: Mega gen10+, Pattern C)',
};
for (const [w, desc] of Object.entries(targets)) {
  console.log(`  W${w}: ${desc}`);
}
