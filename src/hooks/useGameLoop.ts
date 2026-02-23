/**
 * メインゲームループ
 *
 * 60秒ごとに実行:
 * - 放置死亡チェック（48h, 毎tick）
 * - 寿命死亡チェック（JST 4:00 に1日1回）
 * - HP自然回復
 * - 食事タイミングチェック
 */

import { useEffect, useRef } from "react";
import { useGameStore } from "../store/game-store";
import { useMonsterStore } from "../store/monster-store";
import {
  isLifespanReached,
  isNeglectDeath,
  getHoursAbsent,
  calculateHpRegen,
  calculateNeglectHpPenalty,
  shouldRunDeathCheck,
  getDeathCheckDay,
} from "../engine/lifespan";
import { calculateNeglectPenalty, applyDisciplineChange } from "../engine/discipline";

const LOOP_INTERVAL_MS = 60_000;

export function useGameLoop() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const lastDeathCheckDate = useGameStore((s) => s.lastDeathCheckDate);
  const markDeathChecked = useGameStore((s) => s.markDeathChecked);
  const monster = useMonsterStore((s) => s.monster);
  const healHp = useMonsterStore((s) => s.healHp);
  const damageHp = useMonsterStore((s) => s.damageHp);
  const changeDiscipline = useMonsterStore((s) => s.changeDiscipline);
  const updateLastLogin = useMonsterStore((s) => s.updateLastLogin);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "alive" || !monster) return;

    const tick = () => {
      const now = new Date();

      // Check neglect death (48h+) — 毎tick判定
      if (isNeglectDeath(monster.lastLoginAt, now)) {
        setPhase("dead");
        return;
      }

      // Check lifespan death — JST 4:00 に1日1回
      const currentDeathCheckDate = useGameStore.getState().lastDeathCheckDate;
      if (shouldRunDeathCheck(currentDeathCheckDate, now)) {
        if (
          isLifespanReached(
            monster.bornAt,
            monster.baseLifespan,
            monster.lifespanExtension,
            now
          )
        ) {
          setPhase("dead");
          markDeathChecked(getDeathCheckDay(now));
          return;
        }
        markDeathChecked(getDeathCheckDay(now));
      }

      // HP regen (based on hours since last login)
      const hoursAbsent = getHoursAbsent(monster.lastLoginAt, now);
      if (hoursAbsent > 0 && monster.currentHp < monster.maxHp) {
        const regen = calculateHpRegen(monster.maxHp, hoursAbsent);
        if (regen > 0) healHp(regen);
      }

      // Neglect HP penalty (12h+ absent)
      if (hoursAbsent >= 12) {
        const penalty = calculateNeglectHpPenalty(monster.maxHp, hoursAbsent);
        if (penalty > 0) damageHp(penalty);
      }

      // Neglect discipline penalty (8h+ absent)
      if (hoursAbsent >= 8) {
        const discPenalty = calculateNeglectPenalty(hoursAbsent);
        if (discPenalty < 0) changeDiscipline(discPenalty);
      }

      // Update last login
      updateLastLogin();
    };

    // Run once immediately
    tick();

    // Then every 60s
    intervalRef.current = setInterval(tick, LOOP_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [phase, monster?.definitionId]);
}
