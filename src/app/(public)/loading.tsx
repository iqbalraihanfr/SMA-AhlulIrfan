export default function PublicLoading() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman..."
      className="animate-pulse"
    >
      <span className="sr-only">Memuat halaman...</span>

      {/* Hero Skeleton */}
      <div className="bg-paper-sunken border-b border-line py-12 sm:py-16">
        <div className="section-shell">
          <div className="h-8 w-48 rounded bg-line sm:h-10 sm:w-72" />
          <div className="mt-3 h-4 w-72 rounded bg-line/70 sm:w-96" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="section-shell py-14 sm:py-20 space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-line/80" />
          <div className="h-6 w-60 rounded bg-line" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-lg border border-line bg-paper-raised" />
          <div className="h-48 rounded-lg border border-line bg-paper-raised" />
          <div className="h-48 rounded-lg border border-line bg-paper-raised" />
        </div>
      </div>
    </div>
  )
}
