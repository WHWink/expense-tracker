import { useMemo, useState } from 'react'
import type { Transaction } from '../../types/transaction'
import type { TransactionFilter } from '../transactions/filter'
import { BottomSheet } from '../../components/BottomSheet'
import { formatMonthLabel } from '../../utils/date'
import { exportTransactions } from './exportService'
import type { ExportFormat } from './types'

type Scope = 'filtered' | 'all' | 'custom'

interface ExportSheetProps {
  open: boolean
  onClose: () => void
  /** 全部记录 */
  all: Transaction[]
  /** 当前筛选后的记录（与列表页联动） */
  filtered: Transaction[]
  filter: TransactionFilter
}

const formatOptions: { format: ExportFormat; label: string; desc: string }[] = [
  { format: 'csv', label: 'CSV', desc: '通用，Excel 能打开' },
  { format: 'xlsx', label: 'Excel', desc: '.xlsx 表格' },
  { format: 'pdf', label: 'PDF', desc: '表格 + 汇总' },
]

function describeFilter(filter: TransactionFilter): string {
  const parts = [filter.month === null ? '全部月份' : formatMonthLabel(filter.month)]
  if (filter.type !== 'all') parts.push(filter.type === 'income' ? '收入' : '支出')
  if (filter.category !== null) parts.push(filter.category)
  return parts.join(' · ')
}

/** 导出弹层：选范围 + 选格式。范围默认跟列表页当前筛选 */
export function ExportSheet({ open, onClose, all, filtered, filter }: ExportSheetProps) {
  const [scope, setScope] = useState<Scope>('filtered')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // YYYY-MM-DD 格式的字符串可以直接比较大小
  const customValid = start !== '' && end !== '' && start <= end
  const customList = useMemo(
    () => (customValid ? all.filter((t) => t.date >= start && t.date <= end) : []),
    [all, start, end, customValid],
  )

  const list = scope === 'all' ? all : scope === 'filtered' ? filtered : customList
  const rangeLabel =
    scope === 'all' ? '全部' : scope === 'filtered' ? describeFilter(filter) : `${start} ~ ${end}`
  const filenameBase =
    scope === 'all'
      ? '账单_全部'
      : scope === 'filtered'
        ? filter.month === null
          ? '账单_筛选结果'
          : `账单_${filter.month}`
        : `账单_${start}_${end}`

  function handleExport(format: ExportFormat) {
    exportTransactions(list, format, { filenameBase, rangeLabel }).catch(() => {
      window.alert('导出失败，请重试')
    })
  }

  return (
    <BottomSheet open={open} title="导出账单" onClose={onClose}>
      <p className="mb-2 text-xs text-slate-400">导出范围</p>
      <div className="space-y-2">
        <ScopeOption
          active={scope === 'filtered'}
          title="当前筛选结果"
          desc={describeFilter(filter)}
          count={filtered.length}
          onClick={() => setScope('filtered')}
        />
        <ScopeOption
          active={scope === 'all'}
          title="全部记录"
          desc="所有月份的账单"
          count={all.length}
          onClick={() => setScope('all')}
        />
        <ScopeOption
          active={scope === 'custom'}
          title="自定义时间范围"
          desc="选择开始和结束日期"
          count={scope === 'custom' ? (customValid ? customList.length : null) : undefined}
          onClick={() => setScope('custom')}
        />
      </div>

      {scope === 'custom' && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none"
            />
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-xl bg-slate-100 px-3 py-2.5 text-base outline-none"
            />
          </div>
          {start !== '' && end !== '' && !customValid && (
            <p className="mt-2 text-sm text-rose-500">开始日期不能晚于结束日期</p>
          )}
        </>
      )}

      <p className="mt-5 mb-2 text-xs text-slate-400">导出格式（金额：收入为正、支出为负）</p>
      <div className="grid grid-cols-3 gap-2 pb-2">
        {formatOptions.map((f) => (
          <button
            key={f.format}
            type="button"
            disabled={scope === 'custom' && !customValid}
            onClick={() => handleExport(f.format)}
            className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center transition-colors active:bg-indigo-50 disabled:opacity-50"
          >
            <span className="block text-sm font-medium text-slate-800">{f.label}</span>
            <span className="mt-0.5 block text-[11px] text-slate-400">{f.desc}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400">将导出 {list.length} 笔记录</p>
    </BottomSheet>
  )
}

interface ScopeOptionProps {
  active: boolean
  title: string
  desc: string
  count?: number | null
  onClick: () => void
}

function ScopeOption({ active, title, desc, count, onClick }: ScopeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white active:bg-slate-50'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          active ? 'border-indigo-600' : 'border-slate-300'
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] text-slate-800">{title}</span>
        <span className="block truncate text-xs text-slate-400">{desc}</span>
      </span>
      {typeof count === 'number' && <span className="shrink-0 text-xs text-slate-400">{count} 笔</span>}
    </button>
  )
}
