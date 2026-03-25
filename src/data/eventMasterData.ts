// src/data/eventMasterData.ts
import type { RandomEventDef } from '../types/randomEvent';

export const EVENT_DEFS: RandomEventDef[] = [
  // ── ランダムイベント ──────────────────────────────
  {
    id: 'overtime',
    kind: 'random',
    trigger: 'at_work',
    probability: 0.2,
  },
  {
    id: 'cockroach',
    kind: 'random',
    trigger: 'after_work',
    probability: 0.1,
  },

  // ── 期間固定イベント ──────────────────────────────
  {
    id: 'collab_sale',
    kind: 'scheduled',
    trigger: 'online_shopping',
    startDay: 5,  // 月内5日目〜8日目の間
    endDay: 8,
  },
];