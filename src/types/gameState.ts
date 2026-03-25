// src/types/gameState.ts
//現在のGameStateを保持して、どこからでも読み書きできるようにする

import type { AreaId, AreaDefinition } from './area';
import type { ItemInstance } from './item';
import type { PendingFleaResult } from '../logic/fleaMarket';
import type { PendingDelivery } from '../logic/onlineShopping';
import type { ActiveEvent } from './randomEvent';

// ────────────────────────────────
// エリアごとの現在の状態
// ────────────────────────────────
export interface AreaState {
  areaId: AreaId;
  currentMessiness: number; // 現在の散らかり度（0-100）
}

//朝の処理
export type MorningEventType =
  | 'flea_sold'
  | 'flea_unsold'
  | 'delivery'
  | 'late_for_work';

  export interface MorningEvent {
  type: MorningEventType;
  variantId?: string;   // フリマ・配達のアイテム
  soldPrice?: number;   // フリマ売却額
}

// ────────────────────────────────
// ゲーム全体のグローバル状態
// ────────────────────────────────
export interface GameState {
  // ── 時間 ──────────────────────
  day: number;          // 通算の日数（1始まり）
  dayOfWeek: number;    // 曜日（0=月〜6=日）
  week: number;         // 何週目か
  month: number;        // 何ヶ月目か
  isWorkDay: boolean;   // 今日は仕事の日か

  // ── プレイヤーパラメータ ────────
  money: number;              // 所持金（円）
  actionPoints: number;       // 残り行動力
  vitality: number;           // 元気度（0-100、隠しパラメータ）

  // ── 月間元気度（給料計算用）──────
  vitalityMonthlyTotal: number;  // 今月の元気度の累積合計
  vitalityDaysElapsed: number;   // 今月の経過日数

  // ── 部屋・エリア ────────────────
  areas: AreaDefinition[];    // 現在の部屋のエリア定義
  areaStates: AreaState[];    // エリアごとの現在の散らかり度

  // ── アイテム ────────────────────
  items: ItemInstance[];           // プレイヤーが所持しているアイテム一覧

  // ── フリマの結果待ちキュー ────────────────────
  pendingFleas: PendingFleaResult[];

  // ── ネットショッピングの配達待ちキュー ────────────────────
  pendingDeliveries: PendingDelivery[]; 

  // ── 朝 ────────────────────
  morningEvents: MorningEvent[];   // 朝に表示するイベントキュー
  todayEvents: ActiveEvent[];      // 当日の発火イベント一覧（朝に確定）
  lateForWorkCount: number;        // 今月の遅刻回数（給料計算用）

 
  // ── 月末処理 ────────────────────
  monthlyRent: number;
}

