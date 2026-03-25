// src/logic/monthEnd.ts
import { getState, setState } from '../store/gameStore';

// ── 定数（調整しやすいよう分離）────────────────────
const SALARY_PER_VITALITY = 5000;       // 元気度1あたりの給料
const LATE_PENALTY_PER_COUNT = 2000;    // 遅刻1回あたりの減額

// ── 月末処理の結果（シーンで表示用）────────────────
export interface MonthEndResult {
  avgVitality: number;   // 元気度の月平均
  grossSalary: number;   // 遅刻控除前の給料
  latePenalty: number;   // 遅刻による減額合計
  netSalary: number;     // 実際に振り込まれる給料
  rent: number;          // 引き落とされた家賃
  newMoney: number;      // 処理後の所持金
  isGameOver: boolean;   // 家賃払えず → ゲームオーバー
}

export function processMonthEnd(): MonthEndResult {
  const state = getState();

  // ── 元気度の月平均 ────────────────────────────────
  const avgVitality = state.vitalityDaysElapsed > 0
    ? state.vitalityMonthlyTotal / state.vitalityDaysElapsed
    : 0;

  // ── 給料計算 ──────────────────────────────────────
  const grossSalary = Math.round(avgVitality * SALARY_PER_VITALITY);
  const latePenalty = state.lateForWorkCount * LATE_PENALTY_PER_COUNT;
  const netSalary = Math.max(0, grossSalary - latePenalty);

  // ── 家賃引き落とし ────────────────────────────────
  const rent = state.monthlyRent;
  const newMoney = state.money + netSalary - rent;

  // ── ゲームオーバー判定（所持金が正の数でない）────────
  const isGameOver = newMoney <= 0;

  // ── 月次リセット ──────────────────────────────────
  setState({
    money: newMoney,
    vitalityMonthlyTotal: 0,
    vitalityDaysElapsed: 0,
    lateForWorkCount: 0,
  });

  return { avgVitality, grossSalary, latePenalty, netSalary, rent, newMoney, isGameOver };
}