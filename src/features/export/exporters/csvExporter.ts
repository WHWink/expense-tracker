import Papa from 'papaparse'
import type { ExportMeta, ExportRecord, Exporter } from '../types'
import { downloadBlob } from '../../../utils/download'

const HEADERS = ['日期', '类型', '分类', '金额', '备注', '创建时间']

/** CSV 导出：papaparse 负责字段转义（不手写字符串拼接），
 *  UTF-8 带 BOM，防止 Windows Excel 打开时中文乱码 */
export const csvExporter: Exporter = {
  export(records: ExportRecord[], meta: ExportMeta) {
    const csv = Papa.unparse({
      fields: HEADERS,
      data: records.map((r) => [
        r.date,
        r.type,
        r.category,
        r.amount.toFixed(2),
        r.note,
        r.createdAt,
      ]),
    })
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' })
    downloadBlob(blob, `${meta.filenameBase}.csv`)
  },
}
