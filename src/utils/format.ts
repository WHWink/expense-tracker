import type { TransactionType } from '../types/transaction'

const numberFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** 金额保留两位小数，避免浮点累加出现 0.30000000000000004 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100
}

/** 千分位金额，不带符号：1234.5 -> 1,234.50 */
export function formatAmount(value: number): string {
  return numberFormatter.format(Math.abs(value))
}

/** 列表里的金额：收入 +¥1,234.50，支出 -¥50.00 */
export function formatSignedAmount(value: number, type: TransactionType): string {
  return `${type === 'income' ? '+' : '-'}¥${formatAmount(value)}`
}

/** 结余金额：正数 ¥xx，负数 -¥xx */
export function formatBalance(value: number): string {
  return `${value < 0 ? '-' : ''}¥${formatAmount(value)}`
}
