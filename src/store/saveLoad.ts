// src/store/saveLoad.ts
//saveGame() とloadGame()の関数だけここにまとめる（後でサーバー対応する時に差し替える場所）

import type { GameState } from '../types/gameState';
import { getState } from './gameStore';

const SAVE_KEY = 'anyway_save';

// セーブする（localStorageに書き込む）
export function saveGame(): void {
  const data = JSON.stringify(getState());
  localStorage.setItem(SAVE_KEY, data);
}

// ロードする（localStorageから読み込む）
// セーブデータがなければ null を返す
export function loadGame(): GameState | null {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as GameState;
  } catch {
    console.warn('セーブデータの読み込みに失敗しました');
    return null;
  }
}

// セーブデータを削除する
export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}