// src/data/itemMasterData.ts
//カテゴリ-スタイル（中身）-カラバリ、の3段階に分けて管理
//またどんどん追加していく

import type { ItemCategory, ItemStyle, ItemVariant } from '../types/item';

// ────────────────────────────────
// カテゴリ
// ────────────────────────────────
export const ITEM_CATEGORIES: ItemCategory[] = [
  { id: 'tops',       name: 'トップス' },
  { id: 'bottoms',    name: 'ボトムス' },
  { id: 'socks',      name: '靴下' },
  { id: 'shoes',      name: '靴' },
  { id: 'stuffed',    name: 'ぬいぐるみ' },
  { id: 'snack',      name: 'お菓子' },
  { id: 'book',       name: '本' },
];

// ────────────────────────────────
// スタイル
// ────────────────────────────────
export const ITEM_STYLES: ItemStyle[] = [
  // トップス
  { id: 'tops-tshirt',  categoryId: 'tops',    name: 'Tシャツ',     messinessValue: 5,  buyPrice: 1500,  sellPrice: 300  },
  { id: 'tops-hoodie',  categoryId: 'tops',    name: 'パーカー',    messinessValue: 10, buyPrice: 4000,  sellPrice: 800  },

  // ボトムス
  { id: 'bottoms-jeans',  categoryId: 'bottoms', name: 'ジーンズ',  messinessValue: 8,  buyPrice: 5000,  sellPrice: 1000 },
  { id: 'bottoms-shorts', categoryId: 'bottoms', name: 'ショートパンツ', messinessValue: 5, buyPrice: 2500, sellPrice: 500 },

  // 靴下
  { id: 'socks-simple',  categoryId: 'socks',   name: 'シンプル',   messinessValue: 2,  buyPrice: 500,   sellPrice: 50   },
  { id: 'socks-flower',  categoryId: 'socks',   name: '花柄',       messinessValue: 2,  buyPrice: 800,   sellPrice: 100  },

  // ぬいぐるみ
  { id: 'stuffed-bear',  categoryId: 'stuffed', name: 'クマ',       messinessValue: 15, buyPrice: 2000,  sellPrice: 500  },
  { id: 'stuffed-cat',   categoryId: 'stuffed', name: 'ネコ',       messinessValue: 15, buyPrice: 2000,  sellPrice: 500  },

  // お菓子
  { id: 'snack-chips',   categoryId: 'snack',   name: 'ポテチ',     messinessValue: 3,  buyPrice: 200,   sellPrice: 0    },
  { id: 'snack-sweets',  categoryId: 'snack',   name: 'お菓子詰め合わせ', messinessValue: 5, buyPrice: 800, sellPrice: 0 },

  // 本
  { id: 'book-manga',    categoryId: 'book',    name: '漫画',       messinessValue: 3,  buyPrice: 500,   sellPrice: 100  },
  { id: 'book-novel',    categoryId: 'book',    name: '小説',       messinessValue: 3,  buyPrice: 1000,  sellPrice: 200  },
];

// ────────────────────────────────
// バリアント（色違いなど）
// ────────────────────────────────
export const ITEM_VARIANTS: ItemVariant[] = [
  // Tシャツ
  { id: 'tops-tshirt-white', styleId: 'tops-tshirt', color: '白' },
  { id: 'tops-tshirt-black', styleId: 'tops-tshirt', color: '黒' },
  { id: 'tops-tshirt-navy',  styleId: 'tops-tshirt', color: 'ネイビー' },

  // パーカー
  { id: 'tops-hoodie-gray',  styleId: 'tops-hoodie', color: 'グレー' },
  { id: 'tops-hoodie-black', styleId: 'tops-hoodie', color: '黒' },

  // ジーンズ
  { id: 'bottoms-jeans-blue',  styleId: 'bottoms-jeans', color: 'ブルー' },
  { id: 'bottoms-jeans-black', styleId: 'bottoms-jeans', color: '黒' },

  // ショートパンツ
  { id: 'bottoms-shorts-beige', styleId: 'bottoms-shorts', color: 'ベージュ' },
  { id: 'bottoms-shorts-black', styleId: 'bottoms-shorts', color: '黒' },

  // 靴下シンプル
  { id: 'socks-simple-white', styleId: 'socks-simple', color: '白' },
  { id: 'socks-simple-black', styleId: 'socks-simple', color: '黒' },

  // 靴下花柄
  { id: 'socks-flower-white', styleId: 'socks-flower', color: '白' },
  { id: 'socks-flower-black', styleId: 'socks-flower', color: '黒' },
  { id: 'socks-flower-pink',  styleId: 'socks-flower', color: 'ピンク', buyPriceOverride: 1200 },

  // ぬいぐるみ
  { id: 'stuffed-bear-brown', styleId: 'stuffed-bear', color: 'ブラウン' },
  { id: 'stuffed-bear-white', styleId: 'stuffed-bear', color: '白' },
  { id: 'stuffed-cat-gray',   styleId: 'stuffed-cat',  color: 'グレー' },

  // お菓子・本（色バリアントなし）
  { id: 'snack-chips-001',   styleId: 'snack-chips',   color: 'default' },
  { id: 'snack-sweets-001',  styleId: 'snack-sweets',  color: 'default' },
  { id: 'book-manga-001',    styleId: 'book-manga',    color: 'default' },
  { id: 'book-novel-001',    styleId: 'book-novel',    color: 'default' },
];