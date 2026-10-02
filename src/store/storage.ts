/**
 * localStorage 统一封装：组件不直接碰 localStorage，
 * 所有读写都走 store 层，JSON 解析失败、存储空间不足等异常在这里兜底。
 */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 隐私模式等场景写入失败时静默处理，不打断记账操作
  }
}
