// src/types/randomEvent.ts

// いつ表示するか（発火タイミング）
export type EventTrigger =
  | 'at_work'          // 仕事中
  | 'after_work'       // 帰宅後
  | 'online_shopping'  // ネットショッピング・ネットサーフィン時

// ランダム発生か期間固定か
export type EventKind = 'random' | 'scheduled'

export type RandomEventDef =
  | {
      id: string;
      kind: 'random';
      trigger: EventTrigger;
      probability: number; // 0〜1
    }
  | {
      id: string;
      kind: 'scheduled';
      trigger: EventTrigger;
      startDay: number; // 月内の日番号（1〜28）
      endDay: number;
    };

// 当日有効なイベント（朝に決定・ステートに保持）；activeScheduledEventsって別のリストで保存する形も考えたけど面倒なのでやめた　また時が来たら考える 
export interface ActiveEvent {
  eventId: string;
  trigger: EventTrigger;
  displayed: boolean; // 表示済みかどうか
}