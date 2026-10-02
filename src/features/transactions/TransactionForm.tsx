import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { NewTransaction, Transaction, TransactionType } from '../../types/transaction'
import { Button } from '../../components/Button'
import { todayStr } from '../../utils/date'
import { round2 } from '../../utils/format'

interface TransactionFormProps {
  categories: Category[]
  /** 正在编辑的记录；null 表示新记一笔 */
  editing: Transaction | null
  onSave: (data: NewTransaction) => void
  onDelete?: () => void
}

const typeTabs: { value: TransactionType; label: string; activeClass: string }[] = [
  { value: 'expense', label: '支出', activeClass: 'bg-rose-500 text-white' },
  { value: 'income', label: '收入', activeClass: 'bg-emerald-500 text-white' },
]

/** 记账表单：新记 / 编辑共用。字段顺序按操作频率排：金额 > 类型 > 分类 > 日期 > 备注 */
export function TransactionForm({ categories, editing, onSave, onDelete }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(todayStr())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  // 每次打开弹窗都重置：编辑模式回填原值，新记模式给默认值
  useEffect(() => {
    if (editing) {
      setType(editing.type)
      setAmount(String(editing.amount))
      setCategory(editing.category)
      setDate(editing.date)
      setNote(editing.note ?? '')
    } else {
      setType('expense')
      setAmount('')
      setCategory(categories.find((c) => c.type === 'expense')?.name ?? '')
      setDate(todayStr())
      setNote('')
    }
    setError('')
    // categories 只在初始化时需要，不参与重置
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const visibleCategories = categories.filter((c) => c.type === type)

  // 切换收支类型时，如果当前分类不属于新类型，自动选中新类型的第一个
  function switchType(next: TransactionType) {
    setType(next)
    const options = categories.filter((c) => c.type === next)
    if (!options.some((c) => c.name === category)) {
      setCategory(options[0]?.name ?? '')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number.parseFloat(amount)
    if (!Number.isFinite(value) || value <= 0) {
      setError('请输入大于 0 的金额')
      return
    }
    if (!category) {
      setError('请选择分类')
      return
    }
    onSave({
      type,
      amount: round2(value),
      category,
      date,
      note: note.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 金额：调起数字键盘 */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 focus-within:ring-2 focus-within:ring-indigo-300">
        <span className="text-2xl font-medium text-slate-400">¥</span>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError('')
          }}
          inputMode="decimal"
          type="text"
          placeholder="0.00"
          autoFocus
          className="w-full bg-transparent py-3 text-3xl font-semibold tabular-nums outline-none placeholder:text-slate-300"
        />
      </div>

      {/* 收入 / 支出切换 */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        {typeTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => switchType(tab.value)}
            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
              type === tab.value ? tab.activeClass : 'text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 分类 */}
      <div className="grid grid-cols-4 gap-2">
        {visibleCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCategory(c.name)
              setError('')
            }}
            className={`rounded-lg border py-2 text-center text-xs transition-colors ${
              category === c.name
                ? 'border-indigo-500 bg-indigo-50 font-medium text-indigo-600'
                : 'border-slate-200 text-slate-600 active:bg-slate-50'
            }`}
          >
            <span className="mr-0.5">{c.emoji}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* 日期 + 备注 */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none"
      />
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="备注（可选）"
        maxLength={50}
        className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none placeholder:text-slate-400"
      />

      {error && <p className="text-sm text-rose-500">{error}</p>}

      <div className="space-y-2 pb-2">
        {editing && onDelete && (
          <Button variant="danger" className="w-full" onClick={onDelete}>
            删除这条记录
          </Button>
        )}
        <Button type="submit" className="w-full">
          保存
        </Button>
      </div>
    </form>
  )
}
