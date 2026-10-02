import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { TransactionType } from '../../types/transaction'
import { BottomSheet } from '../../components/BottomSheet'
import { Button } from '../../components/Button'

interface CategoryManagerProps {
  categories: Category[]
  onAdd: (name: string, type: TransactionType, emoji: string) => void
  onRemove: (id: string) => void
}

/** 分类管理页：查看、新增、删除分类 */
export function CategoryManager({ categories, onAdd, onRemove }: CategoryManagerProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [emoji, setEmoji] = useState('')
  const [error, setError] = useState('')

  const expense = categories.filter((c) => c.type === 'expense')
  const income = categories.filter((c) => c.type === 'income')

  function openAdd() {
    setName('')
    setType('expense')
    setEmoji('')
    setError('')
    setAddOpen(true)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('请输入分类名称')
      return
    }
    if (categories.some((c) => c.type === type && c.name === trimmed)) {
      setError('该类型下已有同名分类')
      return
    }
    onAdd(trimmed, type, emoji.trim())
    setAddOpen(false)
  }

  function handleRemove(c: Category) {
    if (window.confirm(`删除分类「${c.name}」吗？已经记的账不受影响。`)) {
      onRemove(c.id)
    }
  }

  return (
    <main className="px-4 pb-40">
      <p className="mb-3 text-xs text-slate-400">删除分类不会影响已经记的账；删掉的预设分类可以再手动加回来。</p>
      <CategorySection title="支出分类" items={expense} onRemove={handleRemove} />
      <CategorySection title="收入分类" items={income} onRemove={handleRemove} className="mt-4" />
      <button
        type="button"
        onClick={openAdd}
        className="mt-4 w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition-colors active:bg-slate-200"
      >
        + 添加分类
      </button>

      <BottomSheet open={addOpen} title="添加分类" onClose={() => setAddOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="分类名称"
            maxLength={10}
            autoFocus
            className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none placeholder:text-slate-400"
          />
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            {([['expense', '支出'], ['income', '收入']] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setType(value)
                  setError('')
                }}
                className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                  type === value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="图标（可选，如 🍜）"
            maxLength={4}
            className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none placeholder:text-slate-400"
          />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button type="submit" className="w-full">
            保存
          </Button>
        </form>
      </BottomSheet>
    </main>
  )
}

function CategorySection({
  title,
  items,
  onRemove,
  className = '',
}: {
  title: string
  items: Category[]
  onRemove: (c: Category) => void
  className?: string
}) {
  return (
    <section className={className}>
      <h2 className="mb-2 text-xs text-slate-400">
        {title} · {items.length}
      </h2>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-sm">
        {items.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base">
              {c.emoji}
            </span>
            <p className="flex-1 text-[15px] text-slate-800">{c.name}</p>
            <button
              type="button"
              aria-label={`删除${c.name}`}
              onClick={() => onRemove(c)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-slate-300 active:bg-slate-100 active:text-rose-500"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
