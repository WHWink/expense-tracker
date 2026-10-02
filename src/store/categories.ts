import type { Category } from '../types/category'
import { generateId } from '../utils/id'
import { loadJSON, saveJSON } from './storage'

const STORAGE_KEY = 'jizhang.categories.v1'

/** 读取本地保存的分类；从未增删过时返回 null，由调用方回退到预设分类 */
export function loadCategories(): Category[] | null {
  const stored = loadJSON<Category[] | null>(STORAGE_KEY, null)
  if (!Array.isArray(stored)) return null
  const list = stored.filter(
    (c) =>
      typeof c === 'object' &&
      c !== null &&
      typeof c.name === 'string' &&
      (c.type === 'income' || c.type === 'expense'),
  )
  return list.length > 0 ? list : null
}

export function saveCategories(categories: Category[]): void {
  saveJSON(STORAGE_KEY, categories)
}

export function createCategory(name: string, type: Category['type'], emoji: string): Category {
  return { id: generateId(), name: name.trim(), type, emoji: emoji || '📌' }
}
