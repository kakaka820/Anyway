// src/logic/itemHelpers.ts
// アイテムの解決・操作ロジック

import { getState, setState } from '../store/gameStore';
import { ITEM_STYLES, ITEM_VARIANTS } from '../data/itemMasterData';
import type { AreaId } from '../types/area';

// ── variantId から style・variant を解決 ───────────────
export function resolveItem(variantId: string) {
  const variant = ITEM_VARIANTS.find(v => v.id === variantId);
  const style   = variant ? ITEM_STYLES.find(s => s.id === variant.styleId) : undefined;
  return { variant, style };
}

// ── 表示名を取得（例: "Tシャツ（白）"）──────────────────
export function getItemDisplayName(variantId: string): string {
  const { variant, style } = resolveItem(variantId);
  if (!style || !variant) return variantId;
  if (variant.color === 'default') return style.name;
  return `${style.name}（${variant.color}）`;
}

// ── カテゴリ別の表示色（Phaserの数値カラー）────────────
const CATEGORY_COLORS: Record<string, number> = {
  tops:    0x5588cc,  // 青系
  bottoms: 0x886633,  // 茶系
  socks:   0xddcc44,  // 黄系
  shoes:   0x664422,  // 濃茶
  stuffed: 0xdd88aa,  // ピンク系
  snack:   0xdd8833,  // オレンジ
  book:    0x8855aa,  // 紫系
};

export function getItemColor(variantId: string): number {
  const { style } = resolveItem(variantId);
  if (!style) return 0x888888;
  return CATEGORY_COLORS[style.categoryId] ?? 0x888888;
}

// ── 片づける（クローゼットに移動・散らかり度を減らす）──
export function tidyItem(instanceId: string): boolean {
  const state = getState();
  const item = state.items.find(i => i.instanceId === instanceId);
  if (!item) return false;

  const { style } = resolveItem(item.variantId);
  const messinessReduction = style?.messinessValue ?? 0;

  const newItems = state.items.map(i =>
    i.instanceId === instanceId ? { ...i, areaId: 'closet' as AreaId } : i
  );
  const newAreaStates = state.areaStates.map(a =>
    a.areaId === item.areaId
      ? { ...a, currentMessiness: Math.max(0, a.currentMessiness - messinessReduction) }
      : a
  );

  setState({ items: newItems, areaStates: newAreaStates });
  return true;
}

// ── フリマに出す ──────────────────────────────────────
// isListed = true にするだけ。出品キューへの追加は後続フェーズで実装
export function listItemForFlea(instanceId: string): boolean {
  const state = getState();
  const newItems = state.items.map(i =>
    i.instanceId === instanceId ? { ...i, isListed: true } : i
  );
  setState({ items: newItems });
  return true;
}