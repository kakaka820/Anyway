// src/store/initialState.ts
import type { GameState } from '../types/gameState';
import { INITIAL_AREAS } from '../types/area';

export const initialState: GameState = {
  // ── 時間 ──────────────────────────────
  day: 1,
  dayOfWeek: 6,    // 0=月曜日からスタート チュートリアルは日曜なので6
  week: 1,
  month: 1,
  isWorkDay: false,

  // ── プレイヤーパラメータ ───────────────
  money: 70000,        // 初期所持金（円）
  actionPoints: 30,    // チュートリアルの行動力＝片付けさせて、風呂に入らせたら寝かせる
  vitality: 30,        // 初期元気度

  // ── 月間元気度（給料計算用）─────────────
  vitalityMonthlyTotal: 0,
  vitalityDaysElapsed: 0,

  // ── 部屋・エリア ──────────────────────
  areas: INITIAL_AREAS,
  areaStates: INITIAL_AREAS.map((area) => ({
    areaId: area.id,
    currentMessiness: area.initialMessiness,
  })),

  // ── アイテム ──────────────────────────
  items: [],          // 最初は何も持っていない
  pendingFleas: [],
  pendingDeliveries: [],
  morningEvents: [],
  todayEvents: [],
  lateForWorkCount: 0,
  monthlyRent: 70000,
};