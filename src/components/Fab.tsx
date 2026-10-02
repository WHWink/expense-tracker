interface FabProps {
  onClick: () => void
}

/** 右下角悬浮记账按钮（bottom 预留了底部导航 + iPhone 安全区） */
export function Fab({ onClick }: FabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="记一笔"
      className="fixed right-5 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-3xl font-light text-white shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
    >
      +
    </button>
  )
}
