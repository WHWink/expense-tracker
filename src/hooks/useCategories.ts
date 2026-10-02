import { useState } from 'react'
import type { Category } from '../types/category'
import { defaultCategories } from '../features/categories/presets'
import { createCategory, loadCategories, saveCategories } from '../store/categories'

/** 分类数据逻辑：读取本地分类（没有则用预设），提供增删。
 *  本阶段表单只读；管理界面第二阶段直接接这里的 addCategory / removeCategory。 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    () => loadCategories() ?? defaultCategories,
  )

  function addCategory(name: string, type: Category['type'], emoji = '') {
    const trimmed = name.trim()
    if (!trimmed) return
    const next = [...categories, createCategory(trimmed, type, emoji)]
    setCategories(next)
    saveCategories(next)
  }

  function removeCategory(id: string) {
    const next = categories.filter((c) => c.id !== id)
    setCategories(next)
    saveCategories(next)
  }

  return { categories, addCategory, removeCategory }
}
