import { useEffect, useMemo, useState } from 'react'
import type { NewTransaction, Transaction } from '../types/transaction'
import { createTransaction, loadTransactions, saveTransactions } from '../store/transactions'
import { computeTotals } from '../utils/stats'

/** 记账业务逻辑：增删改、排序、汇总。UI 组件只负责展示，不写逻辑 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions())

  // 任何变化都立即落盘
  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  // 按日期倒序，同一天内按创建时间倒序（最新的在最上面）
  const sorted = useMemo(
    () =>
      [...transactions].sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
      ),
    [transactions],
  )

  const totals = useMemo(() => computeTotals(transactions), [transactions])

  function addTransaction(data: NewTransaction) {
    setTransactions((prev) => [createTransaction(data), ...prev])
  }

  function updateTransaction(id: string, data: NewTransaction) {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...createTransaction(data), id, createdAt: t.createdAt } : t,
      ),
    )
  }

  function removeTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { transactions: sorted, totals, addTransaction, updateTransaction, removeTransaction }
}
