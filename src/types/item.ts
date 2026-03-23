//src/types/item.ts

import type { AreaId } from './area';

// ────────────────────────────────
// カテゴリ（大分類）
// 例: 靴下、Tシャツ、ぬいぐるみ
// ────────────────────────────────
export interface ItemCategory {
  id: string;    // 例: "socks"
  name: string;  // 例: "靴下"
}

// ────────────────────────────────
// スタイル（デザイン・種類）
// 例: 靴下-花柄、靴下-シンプル
// ────────────────────────────────
export interface ItemStyle {
  id: string;              // 例: "socks-flower"
  categoryId: string;      // ItemCategory の id
  name: string;            // 例: "花柄"
  messinessValue: number;  // 散らかり度への影響値（0-100）
  buyPrice: number;        // 基本の購入価格（円）
  sellPrice: number;       // 基本のフリマ売値（円）
}

// ────────────────────────────────
// バリアント（色違いなど）
// 例: 靴下-花柄-白、靴下-花柄-黒
// ────────────────────────────────
export interface ItemVariant {
  id: string;                   // 例: "socks-flower-white"
  styleId: string;              // ItemStyle の id
  color: string;                // 例: "白"
  buyPriceOverride?: number;    // 省略時は Style の buyPrice を使う
  sellPriceOverride?: number;   // 省略時は Style の sellPrice を使う
}

// ────────────────────────────────
// インスタンス（プレイヤーが実際に持っている1個）
// ────────────────────────────────
export interface ItemInstance {
  instanceId: string;   // このインスタンス固有のID
  variantId: string;    // ItemVariant の id
  areaId: AreaId;       // 今どのエリアにあるか
  isListed: boolean;    // フリマに出品中かどうか
}