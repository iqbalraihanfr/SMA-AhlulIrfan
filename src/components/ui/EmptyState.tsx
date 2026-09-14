import type { ReactNode } from 'react'

export function EmptyState({
  judul = 'Belum ada isi',
  pesan,
  className = '',
  children,
}: {
  judul?: string
  pesan?: string | null
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`empty-state ${className}`}>
      <p className="empty-state__title">{judul}</p>
      {pesan && <p className="empty-state__copy">{pesan}</p>}
      {children}
    </div>
  )
}
