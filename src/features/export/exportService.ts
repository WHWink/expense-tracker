import type { Transaction } from '../../types/transaction'
import { computeTotals } from '../../utils/stats'
import { formatDateTime } from '../../utils/date'
import type { ExportFormat, ExportMeta, ExportRecord, Exporter } from './types'

/** 导出器按需加载：xlsx / jspdf 体积大，只在真正导出时才下载对应分包 */
const exporters: Record<ExportFormat, () => Promise<Exporter>> = {
  csv: () => import('./exporters/csvExporter').then((m) => m.csvExporter),
  xlsx: () => import('./exporters/xlsxExporter').then((m) => m.xlsxExporter),
  pdf: () => import('./exporters/pdfExporter').then((m) => m.pdfExporter),
}

function toRecord(t: Transaction): ExportRecord {
  return {
    date: t.date,
    type: t.type === 'income' ? '收入' : '支出',
    category: t.category,
    // 收入为正、支出为负，方便在 Excel 里直接求和
    amount: t.type === 'income' ? t.amount : -t.amount,
    note: t.note ?? '',
    createdAt: formatDateTime(t.createdAt),
  }
}

/** 导出一组记录为指定格式并触发下载。以后加新格式：新增一个 Exporter 文件，注册进 exporters 即可 */
export async function exportTransactions(
  list: Transaction[],
  format: ExportFormat,
  options: { filenameBase: string; rangeLabel: string },
): Promise<void> {
  const records = list.map(toRecord)
  const totals = computeTotals(list)
  const meta: ExportMeta = {
    filenameBase: options.filenameBase,
    rangeLabel: options.rangeLabel,
    count: list.length,
    income: totals.income,
    expense: totals.expense,
    balance: totals.balance,
  }
  const exporter = await exporters[format]()
  exporter.export(records, meta)
}
