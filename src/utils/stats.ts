import type { Transaction } from '../types/transaction'
import { round2 } from './format'

export interface Totals {
  income: number
  expense: number
  balance: number
}

/** 汇总一组记录：总收入、总支出、结余 */
export function computeTotals(transactions: Transaction[]): Totals {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  income = round2(income)
  expense = round2(expense)
  return { income, expense, balance: round2(income - expense) }
}
