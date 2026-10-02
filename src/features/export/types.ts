/** 导出公共类型。新增导出格式 = 新增一个实现 Exporter 的文件并在 exportService 注册 */

export type ExportFormat = 'csv' | 'xlsx' | 'pdf'

/** 导出文件里的一行。金额约定：收入为正、支出为负，方便在 Excel 里直接求和 */
export interface ExportRecord {
  date: string
  type: string
  category: string
  amount: number
  note: string
  createdAt: string
}

export interface ExportMeta {
  /** 文件名主体，如 账单_2026-10 */
  filenameBase: string
  /** 范围描述，用于 PDF 标题 */
  rangeLabel: string
  count: number
  income: number
  expense: number
  balance: number
}

export interface Exporter {
  export: (records: ExportRecord[], meta: ExportMeta) => void
}
