import type { Totals } from '../../utils/stats'
import { formatAmount, formatBalance } from '../../utils/format'

interface StatsCardsProps {
  totals: Totals
}

/** 顶部统计卡片：当前结余 + 总收入 + 总支出（正数绿、负数红）；
 *  第二阶段起数字跟随列表页的筛选条件。 */
export function StatsCards({ totals }: StatsCardsProps) {
  const { income, expense, balance } = totals
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-400">当前结余</p>
      <p
        className={`mt-1 text-3xl font-semibold tabular-nums ${
          balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {formatBalance(balance)}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 px-3 py-2">
          <p className="text-xs text-slate-400">总收入</p>
          <p className="mt-0.5 font-medium tabular-nums text-emerald-600">+¥{formatAmount(income)}</p>
        </div>
        <div className="rounded-xl bg-rose-50 px-3 py-2">
          <p className="text-xs text-slate-400">总支出</p>
          <p className="mt-0.5 font-medium tabular-nums text-rose-600">-¥{formatAmount(expense)}</p>
        </div>
      </div>
    </section>
  )
}
