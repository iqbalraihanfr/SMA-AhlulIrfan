import Link from 'next/link'

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

export function KartuBerita({
  berita,
  unggulan = false,
}: {
  berita: any
  unggulan?: boolean
}) {
  return (
    <article
      className={`surface-card group overflow-hidden ${
        unggulan ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''
      }`}
    >
      {berita.image_url ? (
        <Link href={`/berita/${berita.slug}`} className="media-frame block h-full">
          <img
            src={berita.image_url}
            alt={berita.judul}
            width={800}
            height={500}
            loading="lazy"
            className="aspect-[8/5] h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : (
        <Link href={`/berita/${berita.slug}`} className="media-frame block h-full">
          <div className="grid aspect-[8/5] h-full w-full place-items-center bg-paper-sunken text-sm text-ink-muted">
            Belum ada foto
          </div>
        </Link>
      )}
      <div className="flex flex-col p-5 sm:p-6">
        {berita.diterbitkan_pada && (
          <time
            dateTime={berita.diterbitkan_pada}
            className="text-xs font-bold uppercase tracking-widest text-highlight"
          >
            {formatTanggal(berita.diterbitkan_pada)}
          </time>
        )}
        <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-ink-deep">
          <Link
            href={`/berita/${berita.slug}`}
            className="underline-offset-4 decoration-highlight/60 group-hover:underline"
          >
            {berita.judul}
          </Link>
        </h3>
        {berita.ringkasan && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
            {berita.ringkasan}
          </p>
        )}
        <Link
          href={`/berita/${berita.slug}`}
          className="mt-auto pt-5 text-sm font-bold text-brand hover:underline"
        >
          Baca berita <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  )
}
