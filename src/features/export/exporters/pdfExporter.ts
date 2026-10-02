import { jsPDF } from 'jspdf'
import type { ExportMeta, ExportRecord, Exporter } from '../types'
import { formatDateTime } from '../../../utils/date'
import { formatAmount } from '../../../utils/format'

/**
 * PDF 导出：jsPDF 生成 A4 表格 + 汇总。
 * 中文用“系统字体画到 canvas、整页贴进 PDF”的方案：
 * jsPDF 内置字体不支持中文，而嵌入中文字体文件要 10MB 左右，
 * 图片式 PDF 牺牲文字可选中，换来零大依赖，符合“先简单做”的定位。
 */

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 40
const ROW_H = 22
const SCALE = 2
const CONTENT_W = PAGE_W - MARGIN * 2
/** 第一页标题 + 汇总区的高度 */
const HEADER_BLOCK_H = 88

const FONT = "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif"
const INK = '#1f2937'
const GREEN = '#059669'
const RED = '#e11d48'

interface Column {
  title: string
  width: number
  align: 'left' | 'right'
  value: (r: ExportRecord) => string
}

// 列宽合计 515 = PAGE_W - MARGIN * 2
const COLUMNS: Column[] = [
  { title: '日期', width: 70, align: 'left', value: (r) => r.date },
  { title: '类型', width: 44, align: 'left', value: (r) => r.type },
  { title: '分类', width: 80, align: 'left', value: (r) => r.category },
  {
    title: '金额',
    width: 90,
    align: 'right',
    value: (r) => `${r.amount >= 0 ? '+' : '-'}¥${formatAmount(r.amount)}`,
  },
  { title: '备注', width: 130, align: 'left', value: (r) => r.note },
  { title: '创建时间', width: 101, align: 'left', value: (r) => r.createdAt },
]

interface TextStyle {
  align?: 'left' | 'right' | 'center'
  color?: string
  bold?: boolean
  size?: number
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style: TextStyle = {},
) {
  const { align = 'left', color = INK, bold = false, size = 10 } = style
  ctx.font = `${bold ? '600' : '400'} ${size}px ${FONT}`
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.fillText(text, x, y)
}

/** 备注等长文本超出列宽时截断并加省略号 */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (text === '' || ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1)
  }
  return `${t}…`
}

function splitPages(records: ExportRecord[]): ExportRecord[][] {
  const first = Math.floor((PAGE_H - MARGIN * 2 - HEADER_BLOCK_H - ROW_H) / ROW_H)
  const rest = Math.floor((PAGE_H - MARGIN * 2 - ROW_H) / ROW_H)
  const pages: ExportRecord[][] = []
  let i = 0
  do {
    const size = pages.length === 0 ? first : rest
    pages.push(records.slice(i, i + size))
    i += size
  } while (i < records.length)
  return pages
}

function drawTableHeader(ctx: CanvasRenderingContext2D, top: number) {
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(MARGIN, top, CONTENT_W, ROW_H)
  let x = MARGIN
  for (const col of COLUMNS) {
    const tx = col.align === 'right' ? x + col.width - 8 : x + 8
    drawText(ctx, col.title, tx, top + ROW_H / 2, {
      align: col.align,
      bold: true,
      size: 10,
      color: '#374151',
    })
    x += col.width
  }
}

function drawRow(ctx: CanvasRenderingContext2D, r: ExportRecord, top: number, zebra: boolean) {
  if (zebra) {
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(MARGIN, top, CONTENT_W, ROW_H)
  }
  let x = MARGIN
  for (const col of COLUMNS) {
    const maxWidth = col.width - 16
    const text = fitText(ctx, col.value(r), maxWidth)
    const tx = col.align === 'right' ? x + col.width - 8 : x + 8
    drawText(ctx, text, tx, top + ROW_H / 2, {
      align: col.align,
      color: col.title === '金额' ? (r.amount >= 0 ? GREEN : RED) : INK,
    })
    x += col.width
  }
}

function drawPage(
  rows: ExportRecord[],
  meta: ExportMeta,
  pageIndex: number,
  pageCount: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(PAGE_W * SCALE)
  canvas.height = Math.ceil(PAGE_H * SCALE)
  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, PAGE_W, PAGE_H)
  ctx.textBaseline = 'middle'

  let y = MARGIN
  if (pageIndex === 0) {
    drawText(ctx, `账单 · ${meta.rangeLabel}`, MARGIN, y + 12, { size: 18, bold: true })
    drawText(
      ctx,
      `共 ${meta.count} 笔 · 导出时间 ${formatDateTime(new Date().toISOString())}`,
      MARGIN,
      y + 40,
      { size: 10, color: '#6b7280' },
    )
    const summaryY = y + 66
    drawText(ctx, `总收入 +¥${formatAmount(meta.income)}`, MARGIN, summaryY, {
      size: 11,
      bold: true,
      color: GREEN,
    })
    drawText(ctx, `总支出 -¥${formatAmount(meta.expense)}`, MARGIN + 170, summaryY, {
      size: 11,
      bold: true,
      color: RED,
    })
    drawText(
      ctx,
      `结余 ${meta.balance < 0 ? '-' : ''}¥${formatAmount(meta.balance)}`,
      MARGIN + 340,
      summaryY,
      { size: 11, bold: true, color: meta.balance >= 0 ? GREEN : RED },
    )
    y += HEADER_BLOCK_H
  }

  drawTableHeader(ctx, y)
  y += ROW_H
  rows.forEach((r, i) => {
    drawRow(ctx, r, y + i * ROW_H, i % 2 === 1)
  })

  drawText(ctx, `第 ${pageIndex + 1} / ${pageCount} 页`, PAGE_W / 2, PAGE_H - 24, {
    align: 'center',
    size: 9,
    color: '#9ca3af',
  })
  return canvas
}

export const pdfExporter: Exporter = {
  export(records: ExportRecord[], meta: ExportMeta) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true })
    const pages = splitPages(records)
    pages.forEach((rows, index) => {
      if (index > 0) doc.addPage()
      doc.addImage(drawPage(rows, meta, index, pages.length), 'PNG', 0, 0, PAGE_W, PAGE_H)
    })
    doc.save(`${meta.filenameBase}.pdf`)
  },
}
