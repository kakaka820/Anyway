// src/logic/actions.ts
import { getState, setState } from '../store/gameStore';
import type { AreaId } from '../types/area';

// ════════════════════════════════════════════════
// コスト計算（純粋関数・副作用なし）
// ════════════════════════════════════════════════

// お風呂：ユニットバスの汚さで分岐
export function getBathCost(): number {
  const bathroomState = getState().areaStates.find(a => a.areaId === 'bathroom');
  return (bathroomState?.currentMessiness ?? 0) >= 80 ? 20 : 10;
}

// 片付け：ユニットバスだけ高コスト
export function getTidyCost(areaId: AreaId): number {
  return areaId === 'bathroom' ? 30 : 20;
}

// スマホのサブアクションコスト
export const PHONE_SUB_COSTS = {
  fleaMarket:     5,
  onlineShopping: 5,
  surfing:        10,
} as const;

// 行動力チェック
export function canAfford(cost: number): boolean {
  return getState().actionPoints >= cost;
}

// ════════════════════════════════════════════════
// アクション実行（副作用あり・失敗時はfalseを返す）
// ════════════════════════════════════════════════

// お風呂（元気度 +10、コストはバスルームの汚さで変動）
export function doBath(): boolean {
  const cost = getBathCost();
  const state = getState();
  if (!canAfford(cost)) return false;
  setState({
    actionPoints: state.actionPoints - cost,
  });
  return true;
}

// 片付け（対象エリアの散らかり度 -15、コストはエリアで変動）
export function doTidy(areaId: AreaId): boolean {
  const cost = getTidyCost(areaId);
  const state = getState();
  if (!canAfford(cost)) return false;
  setState({
    actionPoints: state.actionPoints - cost,
  });
  return true;
}

// スマホ：フリマ（5AP）
// 詳細ロジックは fleaMarket.ts と連携予定
export function doPhoneFleaMarket(): boolean {
  const state = getState();
  if (!canAfford(PHONE_SUB_COSTS.fleaMarket)) return false;
  setState({ actionPoints: state.actionPoints - PHONE_SUB_COSTS.fleaMarket });
  // TODO: フリマUIを開く
  return true;
}

// スマホ：ネットショッピング（5AP）
export function doPhoneOnlineShopping(): boolean {
  const state = getState();
  if (!canAfford(PHONE_SUB_COSTS.onlineShopping)) return false;
  setState({ actionPoints: state.actionPoints - PHONE_SUB_COSTS.onlineShopping });
  // TODO: ネットショッピングUIを開く
  return true;
}

// スマホ：ネットサーフィン（10AP）
export function doPhoneSurfing(): boolean {
  const state = getState();
  if (!canAfford(PHONE_SUB_COSTS.surfing)) return false;
  setState({ actionPoints: state.actionPoints - PHONE_SUB_COSTS.surfing });
  // TODO: ランダムイベント発火など
  return true;
}