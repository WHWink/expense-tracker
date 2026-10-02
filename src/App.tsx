import { useCallback, useMemo, useState } from 'react'
import { BottomNav, type PageKey } from './components/BottomNav'
import { BottomSheet } from './components/BottomSheet'
import { EmptyState } from './components/EmptyState'
import { Fab } from './components/Fab'
import { useCategories } from './hooks/useCategories'
import { useTransactionFilter } from './hooks/useTransactionFilter'
import { useTransactions } from './hooks/useTransactions'
import { CategoryManager } from './features/categories/CategoryManager'
import { findCategoryEmoji } from './features/categories/presets'
import { ExportSheet } from './features/export/ExportSheet'
import { FilterBar } from './features/filter/FilterBar'
import { StatsCards } from './features/stats/StatsCards'
import { TransactionForm } from './features/transactions/TransactionForm'
import { TransactionList } from './features/transactions/TransactionList'
import { formatMonthLabel } from './utils/date'
import { computeTotals } from './utils/stats'
import type { NewTransaction, Transaction } from './types/transaction'

export default function App() {
  const { transactions, addTransaction, updateTransaction, removeTransaction } = useTransactions()
  const { categories, addCategory, removeCategory } = useCategories()
  const { filter, filtered, months, setMonth, setType, setCategory } = useTransactionFilter(
    transactions,
    categories,
  )

  // 统计卡片跟随当前筛选条件（第二阶段起不再是全局数字）
  const filteredTotals = useMemo(() => computeTotals(filtered), [filtered])

  const [page, setPage] = useState<PageKey>('list')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
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

  const hasFilter = filter.month !== null || filter.type !== 'all' || filter.category !== null
  const scopeLabel = `${filter.month === null ? '全部' : formatMonthLabel(filter.month)} · ${filtered.length} 笔`

  return (
    <div className="mx-auto min-h-dvh max-w-md bg-slate-100">
      <header className="flex items-center justify-between px-4 pt-6 pb-1">
        <h1 className="text-xl font-bold text-slate-800">简易记账</h1>
        {page === 'list' && (
          <button
            type="button"
            onClick={() => setExportOpen(true)}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm active:bg-slate-50"
          >
            导出
          </button>
        )}
      </header>

      {page === 'list' ? (
        <main className="px-4 pb-40">
          <StatsCards totals={filteredTotals} />
          <FilterBar
            filter={filter}
            months={months}
            categories={categories}
            onMonth={setMonth}
            onType={setType}
            onCategory={setCategory}
          />
          <h2 className="mt-4 mb-2 text-xs text-slate-400">{scopeLabel}</h2>
          {filtered.length === 0 ? (
            <EmptyState
              message={hasFilter ? '当前筛选条件下没有记录' : '还没有记录，点右下角 + 记第一笔吧'}
            />
          ) : (
            <TransactionList
              transactions={filtered}
              emojiOf={(name) => findCategoryEmoji(categories, name)}
              onEdit={openEdit}
              onDelete={handleDeleteRow}
            />
          )}
        </main>
      ) : (
        <CategoryManager categories={categories} onAdd={addCategory} onRemove={removeCategory} />
      )}

      {page === 'list' && <Fab onClick={openAdd} />}

      <BottomNav page={page} onChange={setPage} />

      <BottomSheet open={sheetOpen} title={editing ? '编辑记录' : '记一笔'} onClose={closeSheet}>
        <TransactionForm
          categories={categories}
          editing={editing}
          defaultDate={filter.month === null ? undefined : `${filter.month}-01`}
          onSave={handleSave}
          onDelete={editing ? handleDelete : undefined}
        />
      </BottomSheet>

      <ExportSheet
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        all={transactions}
        filtered={filtered}
        filter={filter}
      />
    </div>
  )
}
