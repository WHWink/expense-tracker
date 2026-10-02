import { useMemo, useState } from 'react'
import type { Transaction, TransactionType } from '../types/transaction'
import type { Category } from '../types/category'
import { filterTransactions, type TransactionFilter } from '../features/transactions/filter'
import { todayStr } from '../utils/date'

/** 列表筛选逻辑：筛选状态 + 过滤结果 + 可选月份。
 *  默认展示当前月份（记账最常用的视角），可随时切回全部。 */
export function useTransactionFilter(transactions: Transaction[], categories: Category[]) {
  const [filter, setFilter] = useState<TransactionFilter>(() => ({
    month: todayStr().slice(0, 7),
    type: 'all',
    category: null,
  }))

  function setMonth(month: string | null) {
    setFilter((f) => ({ ...f, month }))
  }

  function setCategory(category: string | null) {
    setFilter((f) => ({ ...f, category }))
  }

  function setType(next: TransactionType | 'all') {
    setFilter((f) => {
      if (f.type === next) return f
      // 换了收支方向后，原分类如果不属于新方向就清空，避免永远筛出空列表
      const keep =
        f.category !== null &&
        (next === 'all' || categories.some((c) => c.name === f.category && c.type === next))
      return { ...f, type: next, category: keep ? f.category : null }
    })
  }

  // 有账的月份列表，倒序；供月份筛选弹层用
  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 7)))
    return [...set].sort().reverse()
  }, [transactions])

  const filtered = useMemo(
    () => filterTransactions(transactions, filter),
    [transactions, filter],
  )

  return { filter, filtered, months, setMonth, setType, setCategory }
}
