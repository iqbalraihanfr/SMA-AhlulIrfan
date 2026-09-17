export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-label="Memuat data panel admin..."
      className="max-w-5xl space-y-6 animate-pulse"
    >
      <span className="sr-only">Memuat data panel admin...</span>

      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded bg-line" />
        <div className="h-4 w-72 rounded bg-line/70" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="h-24 rounded-lg border border-line bg-paper" />
        <div className="h-24 rounded-lg border border-line bg-paper" />
        <div className="h-24 rounded-lg border border-line bg-paper" />
        <div className="h-24 rounded-lg border border-line bg-paper" />
      </div>

      {/* Table/List Skeleton */}
      <div className="h-64 rounded-lg border border-line bg-paper" />
    </div>
  )
}
