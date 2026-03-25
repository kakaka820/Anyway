// src/logic/advanceDay.ts
// dayOfWeekが28日目に達したら月が替わるようにする
// 給料計算と家賃処理は隔離（月末処理）


import { getState, setState } from '../store/gameStore';
import { processFleaMarketDay } from './fleaMarket';
import { processDeliveries } from './onlineShopping';
import type { MorningEvent } from '../types/gameState';

const DAYS_PER_MONTH = 28;
const FOOD_COST = 1000; //食費
const LATE_FOR_WORK_THRESHOLD = 90; //玄関の汚さ90以上で遅刻
const HUNGRY_VITALITY_PENALTY = 0.5; // 食費ないときの元気度減らし

export function advanceDay(): { isMonthEnd: boolean, morningEvents: MorningEvent[]; } {
  const state = getState();

  // ── 日付を進める ────────────────────────────────
  const newDay = state.day + 1;
  const newDayOfWeek = (state.dayOfWeek + 1) % 7;

  // 月内の日番号（1〜28）と週番号（1〜4）
  const dayInMonth = ((newDay - 1) % DAYS_PER_MONTH) + 1;
  const newWeek = Math.ceil(dayInMonth / 7);

  // 月末判定
  const isMonthEnd = dayInMonth === DAYS_PER_MONTH;
  const newMonth = isMonthEnd ? state.month + 1 : state.month;

  // ── 平日・休日判定（月〜金=0〜4 が平日）──────────
  const newIsWorkDay = newDayOfWeek <= 4;

  // ── 各エリアの汚さを自動増加（上限100）────────────
  const newAreaStates = state.areaStates.map((areaState) => {
    const areaDef = state.areas.find((a) => a.id === areaState.areaId);
    const increase = areaDef?.dailyMessinessIncrease ?? 0;
    return {
      ...areaState,
      currentMessiness: Math.min(100, areaState.currentMessiness + increase),
    };
  });

  // ── 食費を引く ──────────────────────────────────
  let newMoney: number;
let newVitality: number = state.vitality;
if (state.money >= FOOD_COST) {
  // 普通に食費を引く
  newMoney = state.money - FOOD_COST;
} else if (state.money > 0) {
  // 足りないが0で止める（マイナスにしない）
  newMoney = 0;
} else {
  // お金がすでに0 → 元気度を下げる
  newMoney = 0;
  newVitality = Math.max(0, state.vitality - HUNGRY_VITALITY_PENALTY);
}

  // ── 行動力リセット（平日20・休日60）────────────────
  const newActionPoints = newIsWorkDay ? 20 : 60;

  // ── 今日の元気度を月次累積に加算 ────────────────────
  const newVitalityMonthlyTotal = state.vitalityMonthlyTotal + state.vitality;
  const newVitalityDaysElapsed = state.vitalityDaysElapsed + 1;



  setState({
    day: newDay,
    dayOfWeek: newDayOfWeek,
    week: newWeek,
    month: newMonth,
    isWorkDay: newIsWorkDay,
    areaStates: newAreaStates,
    money: newMoney,
    vitality: newVitality,
    actionPoints: newActionPoints,
    vitalityMonthlyTotal: newVitalityMonthlyTotal,
    vitalityDaysElapsed: newVitalityDaysElapsed,
  });

  // 朝の処理
  const soldItems = processFleaMarketDay();
  const deliveredItems = processDeliveries();

  // ── morningEvents を組み立てる ─────────────────────
  const fleaEvents: MorningEvent[] = soldItems.map(p => ({
    type: p.outcome !== 'unsold' ? 'flea_sold' : 'flea_unsold',
    variantId: p.variantId,
    soldPrice: p.outcome !== 'unsold' ? p.soldPrice : undefined,
  }));
  const deliveryEvents: MorningEvent[] = deliveredItems.map(d => ({
    type: 'delivery',
    variantId: d.variantId,
  }));
  // ── 遅刻チェック（平日かつ玄関が散らかりすぎ）────────
  const entranceMessiness = getState().areaStates
    .find(a => a.areaId === 'entrance')?.currentMessiness ?? 0;
  const isLate = newIsWorkDay && entranceMessiness > LATE_FOR_WORK_THRESHOLD;
  const lateEvents: MorningEvent[] = isLate ? [{ type: 'late_for_work' }] : [];
  const morningEvents: MorningEvent[] = [
    ...fleaEvents,
    ...deliveryEvents,
    ...lateEvents,
  ];

  // ── GameStateに保存 ────────────────────────────────
  setState({
    morningEvents,
    lateForWorkCount: isLate
      ? getState().lateForWorkCount + 1
      : getState().lateForWorkCount,
  });

  return { isMonthEnd, morningEvents };

}