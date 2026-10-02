import { useState } from 'react'
import type { Category } from '../../types/category'
import type { TransactionType } from '../../types/transaction'
import type { TransactionFilter } from '../transactions/filter'
import { BottomSheet } from '../../components/BottomSheet'
import { formatMonthLabel } from '../../utils/date'
import { CategorySheet, MonthSheet } from './FilterSheets'

interface FilterBarProps {
  filter: TransactionFilter
  /** 有账的月份列表（来自全部记录，不受当前筛选影响） */
  months: string[]
  categories: Category[]
  onMonth: (month: string | null) => void
  onType: (type: TransactionType | 'all') => void
  onCategory: (category: string | null) => void
}

const typeOptions: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'expense', label: '支出' },
  { value: 'income', label: '收入' },
]

function chipClass(active: boolean): string {
  return `rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm ${
    active ? 'text-indigo-600' : 'text-slate-500'
  }`
}

/** 筛选栏：月份、收支类型、分类，三项联动 */
export function FilterBar({ filter, months, categories, onMonth, onType, onCategory }: FilterBarProps) {
  const [openSheet, setOpenSheet] = useState<'month' | 'category' | null>(null)
  const closeSheet = () => setOpenSheet(null)

  // 分类选择弹层只展示当前收支方向下的分类
  const sheetCategories =
    filter.type === 'all' ? categories : categories.filter((c) => c.type === filter.type)

  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setOpenSheet('month')} className={chipClass(filter.month !== null)}>
          {filter.month === null ? '全部月份' : formatMonthLabel(filter.month)} ▾
        </button>
        <div className="flex rounded-lg bg-white p-0.5 shadow-sm">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onType(opt.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter.type === opt.value ? 'bg-indigo-600 text-white' : 'text-slate-500 active:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setOpenSheet('category')} className={chipClass(filter.category !== null)}>
          {filter.category ?? '分类'} ▾
        </button>
      </div>

      <BottomSheet open={openSheet === 'month'} title="按月份筛选" onClose={closeSheet}>
        <MonthSheet
          current={filter.month}
          months={months}
          onPick={(m) => {
            onMonth(m)
            closeSheet()
          }}
        />
      </BottomSheet>

      <BottomSheet open={openSheet === 'category'} title="按分类筛选" onClose={closeSheet}>
        <CategorySheet
          current={filter.category}
          categories={sheetCategories}
          onPick={(c) => {
            onCategory(c)
            closeSheet()
          }}
        />
      </BottomSheet>
    </>
  )
}
