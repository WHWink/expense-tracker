import type { NewTransaction, Transaction } from '../types/transaction'
import { todayStr } from '../utils/date'
import { generateId } from '../utils/id'
import { round2 } from '../utils/format'
import { loadJSON, saveJSON } from './storage'

const STORAGE_KEY = 'jizhang.transactions.v1'

/** 读取全部记录；旧数据、脏数据在这里补默认值（未来加字段也在这里兼容） */
export function loadTransactions(): Transaction[] {
  const raw = loadJSON<unknown>(STORAGE_KEY, [])
  if (!Array.isArray(raw)) return []
  const list: Transaction[] = []
  for (const item of raw) {
    const t = normalizeTransaction(item)
    if (t) list.push(t)
  }
  return list
}

export function saveTransactions(transactions: Transaction[]): void {
  saveJSON(STORAGE_KEY, transactions)
}

/** 由表单数据生成一条完整记录（id、createdAt 在这里生成） */
export function createTransaction(data: NewTransaction): Transaction {
  return {
    ...data,
    note: data.note?.trim() ? data.note.trim() : undefined,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
}

function normalizeTransaction(item: unknown): Transaction | null {
  if (typeof item !== 'object' || item === null) return null
  const raw = item as Record<string, unknown>
  const amount = Number(raw.amount)
  // 金额非法的脏数据直接丢弃，不让它进统计
  if (!Number.isFinite(amount) || amount <= 0) return null
  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : generateId(),
    type: raw.type === 'income' ? 'income' : 'expense',
    amount: round2(amount),
    category: typeof raw.category === 'string' && raw.category ? raw.category : '其他',
    date:
      typeof raw.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
        ? raw.date
        : todayStr(),
    note: typeof raw.note === 'string' && raw.note ? raw.note : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
  }
}
