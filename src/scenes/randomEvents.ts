// src/logic/randomEvents.ts
import { EVENT_DEFS } from '../data/eventMasterData';
import type { ActiveEvent } from '../types/randomEvent';

// 月内の日番号（1〜28）を受け取って、今日の発火イベントを返す
export function determineTodayEvents(dayInMonth: number): ActiveEvent[] {
  const result: ActiveEvent[] = [];

  // ── 期間固定イベント（重複OK）──────────────────────
  for (const def of EVENT_DEFS) {
    if (def.kind === 'scheduled') {
      if (dayInMonth >= def.startDay && dayInMonth <= def.endDay) {
        result.push({ eventId: def.id, trigger: def.trigger, displayed: false });
      }
    }
  }

  // ── ランダムイベント（1日1つまで）──────────────────
  const randomDefs = EVENT_DEFS.filter(d => d.kind === 'random');
  for (const def of randomDefs) {
    if (def.kind === 'random' && Math.random() < def.probability) {
      result.push({ eventId: def.id, trigger: def.trigger, displayed: false });
      break; // 1つ当たったら終了
    }
  }

  return result;
}