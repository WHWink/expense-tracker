import type { Transaction, TransactionType } from '../../types/transaction'

/** 列表筛选条件；null / 'all' 表示不限制 */
export interface TransactionFilter {
  /** 月份 YYYY-MM；null = 全部月份 */
  month: string | null
  type: TransactionType | 'all'
  /** 分类名称；null = 全部分类 */
  category: string | null
}

export function filterTransactions(
  list: Transaction[],
  f: TransactionFilter,
): Transaction[] {
  return list.filter(
    (t) =>
      (f.month === null || t.date.startsWith(f.month)) &&
      (f.type === 'all' || t.type === f.type) &&
      (f.category === null || t.category === f.category),
  )
}
