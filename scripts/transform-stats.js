/**
 * Monster stat transformation script
 * Scales all monster baseStats, statCaps, and evolutionRequirements
 * to match new stage baselines (75% cap reduction for ×1.0-2.0 training factors)
 */
const fs = require('fs');
const path = require('path');

// Old stage baselines
const OLD = {
  1: { baseHp: 17, baseAtk: 9, baseDef: 6, capHp: 50, capAtk: 30, capDef: 25 },
  2: { baseHp: 63, baseAtk: 26, baseDef: 20, capHp: 200, capAtk: 80, capDef: 65 },
  3: { baseHp: 195, baseAtk: 83, baseDef: 60, capHp: 600, capAtk: 250, capDef: 200 },
  4: { baseHp: 800, baseAtk: 257, baseDef: 189, capHp: 2500, capAtk: 800, capDef: 650 },
  5: { baseHp: 1900, baseAtk: 781, baseDef: 629, capHp: 6000, capAtk: 2500, capDef: 2000 },
  6: { baseHp: 4250, baseAtk: 1437, baseDef: 1169, capHp: 15000, capAtk: 5000, capDef: 4000 },
};

// New stage baselines
const NEW = {
  1: { baseHp: 17, baseAtk: 9, baseDef: 6, capHp: 50, capAtk: 30, capDef: 25 },
  2: { baseHp: 40, baseAtk: 18, baseDef: 14, capHp: 100, capAtk: 45, capDef: 36 },
  3: { baseHp: 90, baseAtk: 40, baseDef: 32, capHp: 250, capAtk: 110, capDef: 90 },
  4: { baseHp: 200, baseAtk: 88, baseDef: 70, capHp: 600, capAtk: 260, capDef: 210 },
  5: { baseHp: 450, baseAtk: 200, baseDef: 160, capHp: 1500, capAtk: 650, capDef: 530 },
  6: { baseHp: 1000, baseAtk: 440, baseDef: 350, capHp: 3500, capAtk: 1500, capDef: 1200 },
};

// New evolution requirements (requirement to ENTER this stage)
const NEW_EVO_REQ = {
  2: { hp: 30, atk: 14, def: 10, bossWorld: null },     // Baby I → Baby II
  3: { hp: 75, atk: 34, def: 27, bossWorld: null },      // Baby II → Rookie
  4: { hp: 150, atk: 68, def: 54, bossWorld: 1 },        // Rookie → Champion
  5: { hp: 320, atk: 145, def: 115, bossWorld: 3 },      // Champion → Ultimate
  6: { hp: 750, atk: 340, def: 270, bossWorld: 8 },      // Ultimate → Mega
};

// Stage enum mapping
const STAGE_MAP = {
  'EvolutionStage.BABY_I': 1,
  'EvolutionStage.BABY_II': 2,
  'EvolutionStage.ROOKIE': 3,
  'EvolutionStage.CHAMPION': 4,
  'EvolutionStage.ULTIMATE': 5,
  'EvolutionStage.MEGA': 6,
};

function transformFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Detect which stage this file contains
  let currentStage = null;
  for (const [key, val] of Object.entries(STAGE_MAP)) {
    if (content.includes(`stage: ${key}`)) {
      currentStage = val;
      break;
    }
  }

  // For files with multiple stages (enemy-only), we process per-monster
  const hasMultipleStages = filePath.includes('enemy-only');

  if (hasMultipleStages) {
    content = transformEnemyOnly(content);
  } else if (currentStage && currentStage > 1) {
    content = transformStage(content, currentStage);
  }
  // Baby I (stage 1): no changes needed

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Updated: ${path.basename(filePath)}`);
}

function transformStage(content, stage) {
  const oldS = OLD[stage];
  const newS = NEW[stage];

  // Transform baseStats: { hp: X, atk: Y, def: Z }
  content = content.replace(/baseStats:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+)\s*\}/g,
    (match, hp, atk, def) => {
      const newHp = Math.round(newS.baseHp * (parseInt(hp) / oldS.baseHp));
      const newAtk = Math.round(newS.baseAtk * (parseInt(atk) / oldS.baseAtk));
      const newDef = Math.round(newS.baseDef * (parseInt(def) / oldS.baseDef));
      return `baseStats: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef} }`;
    }
  );

  // Transform statCaps: { hp: X, atk: Y, def: Z }
  content = content.replace(/statCaps:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+)\s*\}/g,
    (match, hp, atk, def) => {
      const newHp = Math.round(newS.capHp * (parseInt(hp) / oldS.capHp));
      const newAtk = Math.round(newS.capAtk * (parseInt(atk) / oldS.capAtk));
      const newDef = Math.round(newS.capDef * (parseInt(def) / oldS.capDef));
      return `statCaps: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef} }`;
    }
  );

  // Transform evolutionRequirement (uniform per stage)
  const evoReq = NEW_EVO_REQ[stage];
  if (evoReq) {
    // For monsters WITH individual evo reqs (proportional to their caps)
    content = content.replace(
      /evolutionRequirement:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+),\s*bossWorld:\s*(null|\d+)\s*\}/g,
      (match, hp, atk, def, boss) => {
        // Scale evo req proportionally to the monster's cap ratio vs stage cap
        // But simpler: just use stage-level evo req for consistency
        const bossStr = evoReq.bossWorld === null ? 'null' : String(evoReq.bossWorld);

        // Find the nearest statCaps to compute ratio
        // Actually, for individual variation, scale the evo req by the same ratio
        const oldEvo = getOldEvoReq(stage);
        const ratioHp = parseInt(hp) / oldEvo.hp;
        const ratioAtk = parseInt(atk) / oldEvo.atk;
        const ratioDef = parseInt(def) / oldEvo.def;

        const newHp = Math.round(evoReq.hp * ratioHp);
        const newAtk = Math.round(evoReq.atk * ratioAtk);
        const newDef = Math.round(evoReq.def * ratioDef);

        return `evolutionRequirement: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef}, bossWorld: ${bossStr} }`;
      }
    );
  }

  return content;
}

function getOldEvoReq(stage) {
  const oldReqs = {
    2: { hp: 50, atk: 20, def: 16 },
    3: { hp: 120, atk: 55, def: 44 },
    4: { hp: 375, atk: 144, def: 117 },
    5: { hp: 600, atk: 300, def: 240 },
    6: { hp: 1200, atk: 500, def: 400 },
  };
  return oldReqs[stage] || { hp: 1, atk: 1, def: 1 };
}

function transformEnemyOnly(content) {
  // Enemy-only file has monsters of various stages
  // Process each monster block individually
  const lines = content.split('\n');
  let result = [];
  let inMonster = false;
  let monsterStage = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Detect stage
    const stageMatch = line.match(/stage:\s*(EvolutionStage\.\w+)/);
    if (stageMatch) {
      monsterStage = STAGE_MAP[stageMatch[1]];
    }

    // Transform baseStats
    if (monsterStage && monsterStage > 1) {
      const baseMatch = line.match(/baseStats:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+)\s*\}/);
      if (baseMatch) {
        const oldS = OLD[monsterStage];
        const newS = NEW[monsterStage];
        const newHp = Math.round(newS.baseHp * (parseInt(baseMatch[1]) / oldS.baseHp));
        const newAtk = Math.round(newS.baseAtk * (parseInt(baseMatch[2]) / oldS.baseAtk));
        const newDef = Math.round(newS.baseDef * (parseInt(baseMatch[3]) / oldS.baseDef));
        line = line.replace(/baseStats:\s*\{[^}]+\}/, `baseStats: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef} }`);
      }

      const capMatch = line.match(/statCaps:\s*\{\s*hp:\s*(\d+),\s*atk:\s*(\d+),\s*def:\s*(\d+)\s*\}/);
      if (capMatch) {
        const oldS = OLD[monsterStage];
        const newS = NEW[monsterStage];
        const newHp = Math.round(newS.capHp * (parseInt(capMatch[1]) / oldS.capHp));
        const newAtk = Math.round(newS.capAtk * (parseInt(capMatch[2]) / oldS.capAtk));
        const newDef = Math.round(newS.capDef * (parseInt(capMatch[3]) / oldS.capDef));
        line = line.replace(/statCaps:\s*\{[^}]+\}/, `statCaps: { hp: ${newHp}, atk: ${newAtk}, def: ${newDef} }`);
      }
    }

    // Reset stage when we hit a new const declaration
    if (line.match(/^const\s+\w+:\s*MonsterDefinition/)) {
      monsterStage = null;
    }

    result.push(line);
  }

  return result.join('\n');
}

// Main
console.log('Transforming monster stats (75% cap reduction)...\n');

const monstersDir = path.join(__dirname, '..', 'src', 'data', 'monsters');
const files = [
  'baby-ii.ts',
  'rookie.ts',
  'champion.ts',
  'ultimate.ts',
  'mega.ts',
  'enemy-only.ts',
];

for (const f of files) {
  transformFile(path.join(monstersDir, f));
}

console.log('\nDone. Now update index.ts manually.');
