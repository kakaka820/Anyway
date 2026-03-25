// src/logic/fleaMarket.ts
import { getState, setState } from '../store/gameStore';
import { ITEM_STYLES, ITEM_VARIANTS } from '../data/itemMasterData';

// ── 確率設定（ここを変えるだけで調整できる）──────────
const INSTANT_SELL_CHANCE = 0.20;  // 即売れ: 20%
const DELAYED_SELL_CHANCE = 0.50;  // 3日後売れ: 50%
// 残り30%は売れない

const INSTANT_SELL_DAYS = 1;  // 即売れ → 翌朝（1度寝）
const DELAYED_SELL_DAYS = 3;  // 3日後売れ → 3度寝

// ── フリマ結果の型 ────────────────────────────────
export type FleaOutcome = 'sold_instant' | 'sold_delayed' | 'unsold';

export interface PendingFleaResult {
  instanceId: string;
  variantId: string;
  soldPrice: number;
  outcome: FleaOutcome;
  resolveOnDay: number;  // このday数の朝に通知する
}

// ── 出品する（出品時に結果を確定）────────────────────
export function listItem(instanceId: string): boolean {
  const state = getState();
  const item = state.items.find(i => i.instanceId === instanceId);
  if (!item || item.isListed) return false;

  const variant = ITEM_VARIANTS.find(v => v.id === item.variantId);
  const style = ITEM_STYLES.find(s => s.id === variant?.styleId);
  if (!style || style.sellPrice === 0) return false;

  const soldPrice = variant?.sellPriceOverride ?? style.sellPrice;

  // 出品時にランダム判定
  const roll = Math.random();
  let outcome: FleaOutcome;
  let resolveOnDay: number;

  if (roll < INSTANT_SELL_CHANCE) {
    outcome = 'sold_instant';
    resolveOnDay = state.day + INSTANT_SELL_DAYS;
  } else if (roll < INSTANT_SELL_CHANCE + DELAYED_SELL_CHANCE) {
    outcome = 'sold_delayed';
    resolveOnDay = state.day + DELAYED_SELL_DAYS;
  } else {
    outcome = 'unsold';
    resolveOnDay = state.day + DELAYED_SELL_DAYS;
  }

  setState({
    items: state.items.map(i =>
  i.instanceId === instanceId
    ? { ...i, isListed: true, areaId: 'entrance' }  // 玄関に移動
    : i
),
    pendingFleas: [...state.pendingFleas, {
      instanceId,
      variantId: item.variantId,
      soldPrice,
      outcome,
      resolveOnDay,
    }],
  });

  return true;
}

// ── 出品を取り消す ────────────────────────────────
//出品取り消しにしたときに当該アイテムは玄関におきっぱってことにするので、背景描く時注意（フリマ出す箱、出品キャンセル箱の二つは用意しよう）
export function unlistItem(instanceId: string): boolean {
  const state = getState();
  const item = state.items.find(i => i.instanceId === instanceId);
  if (!item || !item.isListed) return false;

  setState({
    items: state.items.map(i =>
      i.instanceId === instanceId ? { ...i, isListed: false } : i
    ),
    pendingFleas: state.pendingFleas.filter(p => p.instanceId !== instanceId),
  });
  return true;
}

// ── 朝の処理：今日resolveするものを処理する ──────────
export function processFleaMarketDay(): PendingFleaResult[] {
  const state = getState();
  const toResolve = state.pendingFleas.filter(p => p.resolveOnDay === state.day);
  if (toResolve.length === 0) return [];

  const soldResults = toResolve.filter(p => p.outcome !== 'unsold');
  const resolvedIds = new Set(toResolve.map(p => p.instanceId));
  const soldIds = new Set(soldResults.map(p => p.instanceId));
  const totalEarned = soldResults.reduce((sum, p) => sum + p.soldPrice, 0);

  // 売れたアイテムの合計messinessValueを計算
  const totalMessinessReduction = soldResults.reduce((sum, p) => {
  const variant = ITEM_VARIANTS.find(v => v.id === p.variantId);
  const style = ITEM_STYLES.find(s => s.id === variant?.styleId);
  return sum + (style?.messinessValue ?? 0);
}, 0);


// entranceの散らかり度を減らす（0未満にはならない）
const newAreaStates = state.areaStates.map(a =>
  a.areaId === 'entrance'
    ? { ...a, currentMessiness: Math.max(0, a.currentMessiness - totalMessinessReduction) }
    : a
);

  setState({
    // 売れた → inventory削除、売れなかった → isListedをfalseに戻す
    items: state.items
      .filter(i => !soldIds.has(i.instanceId))
      .map(i => resolvedIds.has(i.instanceId) ? { ...i, isListed: false } : i),
    money: state.money + totalEarned,
    pendingFleas: state.pendingFleas.filter(p => p.resolveOnDay !== state.day),
    areaStates: newAreaStates,
  });

  return toResolve;  // 呼び出し元で朝の通知に使う
}