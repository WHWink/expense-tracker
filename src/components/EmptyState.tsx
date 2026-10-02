interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-xl bg-white py-16 text-center shadow-sm">
      <p className="text-4xl">🧾</p>
      <p className="mt-3 text-sm text-slate-400">{message}</p>
    </div>
  )
}
