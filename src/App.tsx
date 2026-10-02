import { useCallback, useState } from 'react'
import { BottomSheet } from './components/BottomSheet'
import { EmptyState } from './components/EmptyState'
import { Fab } from './components/Fab'
import { useCategories } from './hooks/useCategories'
import { useTransactions } from './hooks/useTransactions'
import { StatsCards } from './features/stats/StatsCards'
import { TransactionForm } from './features/transactions/TransactionForm'
import { TransactionList } from './features/transactions/TransactionList'
import { findCategoryEmoji } from './features/categories/presets'
import type { NewTransaction, Transaction } from './types/transaction'

export default function App() {
  const { transactions, totals, addTransaction, updateTransaction, removeTransaction } =
    useTransactions()
  const { categories } = useCategories()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const openAdd = useCallback(() => {
    setEditing(null)
    setSheetOpen(true)
  }, [])

  const openEdit = useCallback((t: Transaction) => {
    setEditing(t)
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  function handleSave(data: NewTransaction) {
    if (editing) updateTransaction(editing.id, data)
    else addTransaction(data)
    setSheetOpen(false)
  }

  function handleDelete() {
    if (!editing) return
    if (window.confirm('确定删除这条记录吗？')) {
      removeTransaction(editing.id)
      setSheetOpen(false)
    }
  }

  function handleDeleteRow(t: Transaction) {
    if (window.confirm('确定删除这条记录吗？')) removeTransaction(t.id)
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-slate-100">
      <header className="px-4 pt-6 pb-1">
        <h1 className="text-xl font-bold text-slate-800">简易记账</h1>
      </header>

      <main className="px-4 pb-32">
        <StatsCards totals={totals} />
        <h2 className="mt-5 mb-2 text-xs text-slate-400">
          全部记录 · {transactions.length} 笔
        </h2>
        {transactions.length === 0 ? (
          <EmptyState message="还没有记录，点右下角 + 记第一笔吧" />
        ) : (
          <TransactionList
            transactions={transactions}
            emojiOf={(name) => findCategoryEmoji(categories, name)}
            onEdit={openEdit}
            onDelete={handleDeleteRow}
          />
        )}
      </main>

      <Fab onClick={openAdd} />

      <BottomSheet open={sheetOpen} title={editing ? '编辑记录' : '记一笔'} onClose={closeSheet}>
        <TransactionForm
          categories={categories}
          editing={editing}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
        />
      </BottomSheet>
    </div>
  )
}
