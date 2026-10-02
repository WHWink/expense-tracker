/** 本地时区的今天，格式 YYYY-MM-DD */
export function todayStr(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

/** YYYY-MM -> 2026年10月 */
export function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-')
  return `${year}年${Number(m)}月`
}
