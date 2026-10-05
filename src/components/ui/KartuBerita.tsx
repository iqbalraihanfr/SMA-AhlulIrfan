import Link from 'next/link'
import { ringkasanBerita } from '@/lib/konten'

export function formatTanggal(isoDate?: string | null): string {
  if (!isoDate) return ''
  try {
    return new Date(isoDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

export function KartuBerita({ berita }: { berita: {
  slug: string; judul: string; ringkasan?: string | null; isi?: string | null;
  image_url?: string | null; diterbitkan_pada?: string | null;
} }) {
  const judulId = `berita-${berita.slug}`
  const ringkasan = ringkasanBerita(berita.ringkasan, berita.isi)

  return (
    <article className="surface-card group overflow-hidden">
      <Link href={`/berita/${berita.slug}`} aria-labelledby={judulId}
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand">
        <div className="media-frame aspect-[8/5] shrink-0 overflow-hidden bg-paper-sunken">
          {berita.image_url ? (
            <img src={berita.image_url} alt="" width={800} height={500} loading="lazy"
              className="h-full w-full object-cover transition duration-300 motion-safe:group-hover:scale-[1.02]" />
          ) : (
            <div className="grid h-full place-items-center" aria-hidden="true">
              <img src="/logo-sma.webp" alt="" width={80} height={80} className="size-20 opacity-50" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {berita.diterbitkan_pada && (
            <time dateTime={berita.diterbitkan_pada} className="text-xs font-medium text-ink-muted">
              {formatTanggal(berita.diterbitkan_pada)}
            </time>
          )}
          <h3 id={judulId} className="mt-2 break-words font-heading text-xl font-semibold leading-snug text-ink-deep decoration-highlight/60 underline-offset-4 group-hover:underline">
            {berita.judul}
          </h3>
          {ringkasan && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{ringkasan}</p>}
          <span className="mt-auto pt-5 text-sm font-bold text-brand" aria-hidden="true">
            Baca selengkapnya <span>&rarr;</span>
          </span>
        </div>
      </Link>
    </article>
  )
}
