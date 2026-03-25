// src/logic/onlineShopping.ts
import { getState, setState } from '../store/gameStore';

// ── 配達待ちの型 ──────────────────────────────────
export interface PendingDelivery {
  variantId: string;
  paidPrice: number;    // 記録用
  resolveOnDay: number; // このday数の朝に届く
}

// ── 購入する（価格と在庫チェックは呼び出し側の責任）──
// 戻り値: true=購入成功, false=お金が足りない
export function buyItem(variantId: string, price: number): boolean {
  const state = getState();

  if (state.money < price) return false;

  setState({
    money: state.money - price,
    pendingDeliveries: [
      ...state.pendingDeliveries,
      {
        variantId,
        paidPrice: price,
        resolveOnDay: state.day + 1, // 翌朝届く
      },
    ],
  });

  return true;
}

// ── 朝の処理：今日届くものをinventoryに追加 ──────────
export function processDeliveries(): PendingDelivery[] {
  const state = getState();
  const toDeliver = state.pendingDeliveries.filter(
    d => d.resolveOnDay === state.day
  );
  if (toDeliver.length === 0) return [];

  const newItems = toDeliver.map(d => ({
    instanceId: crypto.randomUUID(),
    variantId: d.variantId,
    areaId: 'entrance', // 玄関に届く
    isListed: false,
  }));

  setState({
    items: [...state.items, ...newItems],
    pendingDeliveries: state.pendingDeliveries.filter(
      d => d.resolveOnDay !== state.day
    ),
  });

  return toDeliver; // 呼び出し元で朝の通知に使う
}