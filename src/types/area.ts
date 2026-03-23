//src/types/area.ts

// エリアのID（文字列リテラル型にしておくと将来の部屋追加も対応しやすい）
export type AreaId = string;

// 最初の部屋（1Kアパート）のエリアID一覧
export const INITIAL_AREA_IDS = [
  'entrance',   // 玄関
  'bathroom',   // ユニットバス
  'floor',      // 床と服掛け
  'bed',        // ベッド
  'desk',       // 机
  'closet',     // クローゼット
] as const;

// エリアのマスターデータ
export interface AreaDefinition {
  id: AreaId;              // エリアID
  name: string;            // 表示名
  initialMessiness: number; // 初期散らかり度（0-100）
  dailyMessinessIncrease: number; //毎日自動増加する値
}

// 最初の部屋のエリア定義
// 初期散らかり度＝すべてのものをなくしてもそれ以上減らせない値（背景として映ってるもののでかさ？）
export const INITIAL_AREAS: AreaDefinition[] = [
  { id: 'entrance', name: '玄関',        initialMessiness: 20, dailyMessinessIncrease: 0 },
  { id: 'bathroom', name: 'ユニットバス', initialMessiness: 10, dailyMessinessIncrease: 1 },
  { id: 'floor',    name: '床と服掛け',   initialMessiness: 40, dailyMessinessIncrease: 0 },
  { id: 'bed',      name: 'ベッド',       initialMessiness: 30, dailyMessinessIncrease: 0 },
  { id: 'desk',     name: '机',           initialMessiness: 50, dailyMessinessIncrease: 0 },
  { id: 'closet',   name: 'クローゼット', initialMessiness: 20, dailyMessinessIncrease: 0 },
];