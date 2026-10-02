import * as XLSX from 'xlsx'
import type { ExportMeta, ExportRecord, Exporter } from '../types'
import { downloadBlob } from '../../../utils/download'

const HEADERS = ['日期', '类型', '分类', '金额', '备注', '创建时间']

/** Excel 导出：SheetJS 生成 .xlsx。
 *  金额写成数字类型（收入正 / 支出负），拿到表格里可以直接求和 */
export const xlsxExporter: Exporter = {
  export(records: ExportRecord[], meta: ExportMeta) {
    const rows = [
      HEADERS,
      ...records.map((r) => [r.date, r.type, r.category, r.amount, r.note, r.createdAt]),
    ]
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [{ wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 20 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '账单')
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    downloadBlob(blob, `${meta.filenameBase}.xlsx`)
  },
}
