import type { CSSProperties } from 'react'

export function PageHero({
  judul,
  keterangan,
  gambar,
  kicker = 'Situs resmi sekolah',
}: {
  judul: string
  keterangan?: string | null
  gambar?: string | null
  kicker?: string
}) {
  return (
    <section
      className={`border-b border-line bg-paper-raised ${gambar ? 'site-hero' : ''}`}
      style={gambar ? ({ '--hero-image': `url('${gambar}')` } as CSSProperties) : undefined}
    >
      <div className="section-shell py-14 sm:py-20">
        <p className={`section-heading__kicker ${gambar ? 'text-highlight-soft' : ''}`}>
          {kicker}
        </p>
        <h1
          className={`mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight text-ink-deep sm:text-5xl ${
            gambar ? 'text-on-brand' : ''
          }`}
        >
          {judul}
        </h1>
        {keterangan && (
          <p
            className={`mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted ${
              gambar ? 'text-on-brand/85' : ''
            }`}
          >
            {keterangan}
          </p>
        )}
      </div>
    </section>
  )
}
