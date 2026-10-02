export type PageKey = 'list' | 'categories'

interface BottomNavProps {
  page: PageKey
  onChange: (page: PageKey) => void
}

const tabs: { key: PageKey; label: string; icon: string }[] = [
  { key: 'list', label: '明细', icon: '📒' },
  { key: 'categories', label: '分类', icon: '🗂️' },
]

/** 底部导航（预留了 iPhone 底部安全区） */
export function BottomNav({ page, onChange }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-14 max-w-md">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors ${
              page === t.key ? 'font-medium text-indigo-600' : 'text-slate-400'
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
