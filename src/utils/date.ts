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

/** ISO 时间 -> YYYY-MM-DD HH:mm:ss（本地时区）；解析失败时原样返回 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes(),
  )}:${p(d.getSeconds())}`
}
