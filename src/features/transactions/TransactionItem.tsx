import type { Transaction } from '../../types/transaction'
import { formatSignedAmount } from '../../utils/format'

interface TransactionItemProps {
  transaction: Transaction
  emoji: string
  onEdit: () => void
  onDelete: () => void
}

/** 单条记录：点行进编辑，点垃圾桶直接删除 */
export function TransactionItem({ transaction, emoji, onEdit, onDelete }: TransactionItemProps) {
  const { type, amount, category, date, note } = transaction
  return (
    <li
      className="flex cursor-pointer items-center gap-3 bg-white px-4 py-3 active:bg-slate-50"
      onClick={onEdit}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-slate-800">{category}</p>
        <p className="truncate text-xs text-slate-400">
          {date}
          {note ? ` · ${note}` : ''}
        </p>
      </div>
      <span
        className={`shrink-0 font-medium tabular-nums ${
          type === 'income' ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {formatSignedAmount(amount, type)}
      </span>
      <button
        type="button"
        aria-label="删除"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-slate-300 active:bg-slate-100 active:text-rose-500"
      >
        🗑
      </button>
    </li>
  )
}
