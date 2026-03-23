// src/types/gameState.ts
//現在のGameStateを保持して、どこからでも読み書きできるようにする

import type { AreaId, AreaDefinition } from './area';
import type { ItemInstance } from './item';

// ────────────────────────────────
// エリアごとの現在の状態
// ────────────────────────────────
export interface AreaState {
  areaId: AreaId;
  currentMessiness: number; // 現在の散らかり度（0-100）
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

}