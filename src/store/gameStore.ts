// src/store/gameStore.ts
//ゲームの状態を入れておく箱。どのシーンからでも同じ状態を参照・更新するために必要

import type { GameState } from '../types/gameState';
import { initialState } from './initialState';
import { loadGame } from './saveLoad';

// ゲーム全体で共有するグローバル状態
let state: GameState = loadGame() ?? { ...initialState };

// 今の状態を取得する
export function getState(): GameState {
  return state;
}

// 状態を更新する（部分的に上書きする）；お風呂入ったから行動力を減らす、など
export function setState(partial: Partial<GameState>): void {
  state = { ...state, ...partial };
}

// 状態を完全にリセットする（初期状態に戻す）
export function resetState(): void {
  state = { ...initialState };
}