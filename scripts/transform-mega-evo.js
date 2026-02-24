/**
 * Scale Mega monster evolution requirements
 * Old: HP750/ATK340/DEF270 bossWorld:8
 * New: HP550/ATK250/DEF200 bossWorld:5
 * Ratio: HP 0.733, ATK 0.735, DEF 0.741
 */

const fs = require('fs');
const path = require('path');

const HP_RATIO = 550 / 750;
const ATK_RATIO = 250 / 340;
const DEF_RATIO = 200 / 270;

const filePath = path.join(__dirname, '..', 'src', 'data', 'monsters', 'mega.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Match evolutionRequirement: { hp: X, atk: Y, def: Z, bossWorld: 8 }
content = content.replace(
  /evolutionRequirement:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+),\s*bossWorld:\s*8\s*\}/g,
  (match, hp, atk, def) => {
    const newHp = Math.round(parseInt(hp) * HP_RATIO);
    const newAtk = Math.round(parseInt(atk) * ATK_RATIO);
    const newDef = Math.round(parseInt(def) * DEF_RATIO);
    return `evolutionRequirement: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef}, bossWorld: 5 }`;
  }
);

fs.writeFileSync(filePath, content, 'utf-8');

// Verify
const lines = content.split('\n');
let count = 0;
for (const line of lines) {
  if (line.includes('evolutionRequirement:') && line.includes('bossWorld:')) {
    count++;
    console.log(line.trim());
  }
}
console.log(`\nUpdated ${count} Mega evolution requirements.`);
