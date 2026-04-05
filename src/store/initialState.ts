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
  items: [
  // 床と服掛け（最も散らかってる）
  { instanceId: 'init-01', variantId: 'tops-tshirt-white',   areaId: 'floor', isListed: false },
  { instanceId: 'init-02', variantId: 'tops-tshirt-black',   areaId: 'floor', isListed: false },
  { instanceId: 'init-03', variantId: 'bottoms-jeans-blue',  areaId: 'floor', isListed: false },
  { instanceId: 'init-04', variantId: 'socks-simple-black',  areaId: 'floor', isListed: false },
  { instanceId: 'init-05', variantId: 'socks-flower-pink',   areaId: 'floor', isListed: false },
  // ベッド
  { instanceId: 'init-06', variantId: 'tops-hoodie-gray',    areaId: 'bed',   isListed: false },
  { instanceId: 'init-07', variantId: 'stuffed-bear-brown',  areaId: 'bed',   isListed: false },
  // 机
  { instanceId: 'init-08', variantId: 'book-manga-001',      areaId: 'desk',  isListed: false },
  { instanceId: 'init-09', variantId: 'book-novel-001',      areaId: 'desk',  isListed: false },
  { instanceId: 'init-10', variantId: 'snack-chips-001',     areaId: 'desk',  isListed: false },
  { instanceId: 'init-11', variantId: 'snack-sweets-001',    areaId: 'desk',  isListed: false },
  // クローゼット（初期から整理されてる場所）
  { instanceId: 'init-12', variantId: 'bottoms-shorts-beige',areaId: 'closet',isListed: false },
],          // 最初は何も持っていない
  pendingFleas: [],
  pendingDeliveries: [],
  morningEvents: [],
  todayEvents: [],
  lateForWorkCount: 0,
  monthlyRent: 70000,
};