import type { Transaction } from '../../types/transaction'
import { TransactionItem } from './TransactionItem'

interface TransactionListProps {
  /** 已按时间倒序排好的记录 */
  transactions: Transaction[]
  /** 分类名 -> 图标（分类可能被删，由外部给兜底） */
  emojiOf: (categoryName: string) => string
  onEdit: (t: Transaction) => void
  onDelete: (t: Transaction) => void
}

/** 记录列表（时间倒序由 useTransactions 排好再传进来） */
export function TransactionList({ transactions, emojiOf, onEdit, onDelete }: TransactionListProps) {
  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white shadow-sm">
      {transactions.map((t) => (
        <TransactionItem
          key={t.id}
          transaction={t}
          emoji={emojiOf(t.category)}
          onEdit={() => onEdit(t)}
          onDelete={() => onDelete(t)}
        />
      ))}
    </ul>
  )
}
