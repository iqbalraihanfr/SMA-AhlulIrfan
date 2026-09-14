import Link from 'next/link'

export default function Footer({ situs }: { situs: any }) {
  const tahun = new Date().getFullYear()

  const sosial = [
    { nama: 'Instagram', url: situs?.instagram },
    { nama: 'Facebook', url: situs?.facebook },
    { nama: 'YouTube', url: situs?.youtube },
  ].filter((item) => Boolean(item.url))

  const cleanPhone = situs?.telepon ? situs.telepon.replace(/\D/g, '') : null

  let tautanWa: string | null = null
  if (situs?.whatsapp) {
    const rawWa = situs.whatsapp.replace(/\D/g, '')
    const waNormalized = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa
    tautanWa = `https://wa.me/${waNormalized}`
  }

  const namaSekolah = situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'

  return (
    <footer className="mt-0 border-t border-line bg-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-xl font-semibold text-ink-deep">{namaSekolah}</p>
          {situs?.nama_yayasan && (
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
              Di bawah naungan {situs.nama_yayasan}.
            </p>
          )}
          {situs?.semboyan && (
            <p className="mt-5 max-w-sm border-s-2 border-highlight ps-4 font-heading text-lg italic leading-snug text-ink">
              &ldquo;{situs.semboyan}&rdquo;
            </p>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight">Kontak</p>
          {situs?.alamat && <p className="leading-relaxed text-ink-muted">{situs.alamat}</p>}
          {situs?.telepon && (
            <a className="block text-ink-muted hover:text-brand hover:underline" href={`tel:${cleanPhone}`}>
              {situs.telepon}
            </a>
          )}
          {situs?.email && (
            <a className="block break-words text-ink-muted hover:text-brand hover:underline" href={`mailto:${situs.email}`}>
              {situs.email}
            </a>
          )}
          {tautanWa && (
            <a className="block text-ink-muted hover:text-brand hover:underline" href={tautanWa} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight">Jelajahi</p>
          <Link className="block text-ink-muted hover:text-brand hover:underline" href="/profil">
            Profil Sekolah
          </Link>
          <Link className="block text-ink-muted hover:text-brand hover:underline" href="/guru">
            Guru &amp; Tendik
          </Link>
          <Link className="block text-ink-muted hover:text-brand hover:underline" href="/galeri">
            Galeri Kegiatan
          </Link>
          <Link className="block text-ink-muted hover:text-brand hover:underline" href="/berita">
            Berita Sekolah
          </Link>
          {sosial.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
              {sosial.map((item) => (
                <a
                  key={item.nama}
                  className="text-ink-muted hover:text-brand hover:underline"
                  href={item.url!}
                  target="_blank"
                  rel="noopener"
                >
                  {item.nama}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-4 py-4 text-xs text-ink-muted sm:px-6">
          <span>&copy; {tahun} {namaSekolah}</span>
          <span>Situs resmi sekolah</span>
        </div>
      </div>
    </footer>
  )
}

