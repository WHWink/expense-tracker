import type { Category } from '../../types/category'
import { formatMonthLabel } from '../../utils/date'

interface MonthSheetProps {
  current: string | null
  months: string[]
  onPick: (month: string | null) => void
}

/** 月份选择列表：全部月份 + 所有有账的月份 */
export function MonthSheet({ current, months, onPick }: MonthSheetProps) {
  const values: (string | null)[] = [null, ...months]
  return (
    <div className="space-y-1 pb-2">
      {values.map((value) => (
        <button
          key={value ?? 'all'}
          type="button"
          onClick={() => onPick(value)}
          className={`w-full rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
            current === value
              ? 'bg-indigo-50 font-medium text-indigo-600'
              : 'text-slate-700 active:bg-slate-50'
          }`}
        >
          {value === null ? '全部月份' : formatMonthLabel(value)}
        </button>
      ))}
    </div>
  )
}

interface CategorySheetProps {
  current: string | null
  categories: Category[]
  onPick: (category: string | null) => void
}

/** 分类选择列表：全部分类 + 按收支分组的分类 */
export function CategorySheet({ current, categories, onPick }: CategorySheetProps) {
  const expense = categories.filter((c) => c.type === 'expense')
  const income = categories.filter((c) => c.type === 'income')
  const showGroups = expense.length > 0 && income.length > 0

  function optionButton(key: string, label: string, active: boolean, onClick: () => void) {
    return (
      <button
        key={key}
        type="button"
        onClick={onClick}
        className={`w-full rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors ${
          active ? 'bg-indigo-50 font-medium text-indigo-600' : 'text-slate-700 active:bg-slate-50'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="space-y-1 pb-2">
      {optionButton('all', '全部分类', current === null, () => onPick(null))}
      {showGroups && <p className="px-3 pt-2 text-xs text-slate-400">支出</p>}
      {expense.map((c) =>
        optionButton(c.id, `${c.emoji} ${c.name}`, current === c.name, () => onPick(c.name)),
      )}
      {showGroups && <p className="px-3 pt-2 text-xs text-slate-400">收入</p>}
      {income.map((c) =>
        optionButton(c.id, `${c.emoji} ${c.name}`, current === c.name, () => onPick(c.name)),
      )}
    </div>
  )
}
