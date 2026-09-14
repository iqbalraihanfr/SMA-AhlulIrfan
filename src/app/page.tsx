import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    title: 'SMA Ahlul Irfan Bangsalsari',
    description: 'Situs resmi SMA Ahlul Irfan Bangsalsari',
    url: '/',
    locale: 'id_ID',
    type: 'website',
  },
}

function EmptyState({
  judul = 'Belum ada isi',
  pesan,
  className = 'mt-10',
}: {
  judul?: string
  pesan?: string
  className?: string
}) {
  return (
    <div className={`empty-state ${className}`}>
      <p className="empty-state__title">{judul}</p>
      {pesan && <p className="empty-state__copy">{pesan}</p>}
    </div>
  )
}

function SectionHeading({
  kicker,
  judul,
  keterangan,
  tengah = false,
}: {
  kicker?: string
  judul: string
  keterangan?: string
  tengah?: boolean
}) {
  return (
    <div className={`section-heading ${tengah ? 'mx-auto text-center' : ''}`}>
      {kicker && <p className="section-heading__kicker">{kicker}</p>}
      <h2 className="section-heading__title">{judul}</h2>
      {keterangan && <p className={`section-heading__copy ${tengah ? 'mx-auto' : ''}`}>{keterangan}</p>}
    </div>
  )
}

function stripHtmlAndTruncate(html?: string, limit: number = 420): string {
  if (!html) return ''
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > limit ? text.substring(0, limit) + '…' : text
}

function parseRingkasanSambutan(html?: string, batas = 360) {
  if (!html) return null
  const regex = /<p\b([^>]*)>([\s\S]*?)<\/p>/gi
  const matches = [...html.matchAll(regex)]
  if (matches.length === 0) {
    const text = stripHtmlAndTruncate(html, batas)
    return { arab: null, salam: null, isi: text }
  }
  let arab: string | null = null
  let salam: string | null = null
  const isiParts: string[] = []

  const cleanText = (h: string) => {
    return h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  for (const match of matches) {
    const attr = match[1] || ''
    const text = cleanText(match[2] || '')
    if (!text) continue
    if (!arab && attr.toLowerCase().includes('arab')) {
      arab = text
      continue
    }
    const textNormal = text.toLowerCase().replace(/[’‘]/g, "'")
    if (!salam && (textNormal.startsWith("assalamu'alaikum") || textNormal.startsWith('assalamualaikum'))) {
      salam = text
      continue
    }
    isiParts.push(text)
  }

  const combined = isiParts.join(' ')
  const truncated = combined.length > batas ? combined.substring(0, batas) + '…' : combined
  return { arab, salam, isi: truncated }
}

function inisial(nama?: string): string {
  if (!nama) return 'KS'
  return nama
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
}

function peran(guru: any): string {
  return [guru.jabatan, guru.mata_pelajaran ? 'Guru ' + guru.mata_pelajaran : null]
    .filter(Boolean)
    .join(' · ')
}

function formatTanggal(isoDate?: string): string {
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

export default async function Beranda() {
  const supabase = await createClient()

  const [
    { data: situs },
    { data: sambutanRes },
    { data: kurikulumRes },
    { data: ekstrakurikuler },
    { data: pendidik },
    { data: beritaTerbaru },
    { data: galeriTerbaru },
    { data: kepalaSekolahRes },
  ] = await Promise.all([
    supabase.from('pengaturan_situs').select('*').limit(1).single(),
    supabase.from('konten_halaman').select('*').eq('kunci', 'sambutan_kepsek').single(),
    supabase.from('konten_halaman').select('*').eq('kunci', 'kurikulum').single(),
    supabase.from('ekstrakurikuler').select('*').order('urutan', { ascending: true }).limit(7),
    supabase.from('guru').select('*').eq('aktif', true).eq('kategori', 'pendidik').order('urutan', { ascending: true }),
    supabase.from('berita').select('*').eq('status', 'terbit').order('diterbitkan_pada', { ascending: false }).limit(3),
    supabase.from('album').select('*').order('urutan', { ascending: true }).limit(4),
    supabase.from('guru').select('*').eq('jabatan', 'Kepala Sekolah').limit(1).single(),
  ])

  const hero = situs?.logo_url || '/branding/og-default.png'
  const sambutan = sambutanRes
  const kurikulum = kurikulumRes
  const kepalaSekolah = kepalaSekolahRes || (pendidik || []).find((g: any) => g.jabatan === 'Kepala Sekolah')
  const fotoKepalaSekolah = kepalaSekolah?.image_url

  const sambutanRingkas = sambutan ? parseRingkasanSambutan(sambutan.isi) : null

  // Foto resmi diprioritaskan supaya beranda tidak seluruhnya berisi inisial
  const listPendidik = (pendidik || [])
    .slice()
    .sort((a: any, b: any) => (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0))
    .slice(0, 4)

  let tautanWa: string | null = null
  if (situs?.whatsapp) {
    const rawWa = situs.whatsapp.replace(/\D/g, '')
    const waNormalized = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa
    const pesan = encodeURIComponent(
      `Assalamu'alaikum, saya ingin bertanya tentang ${situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'}`
    )
    tautanWa = `https://wa.me/${waNormalized}?text=${pesan}`
  }

  return (
    <>
      <section className="site-hero" style={{ '--hero-image': `url('${hero}')` } as React.CSSProperties}>
        <div className="section-shell site-hero__inner">
          <div>
            <p className="site-hero__eyebrow">{situs?.nama_yayasan || 'Situs resmi sekolah'}</p>
            <h1 className="site-hero__title">{situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'}</h1>
            {situs?.semboyan && <p className="site-hero__copy">{situs.semboyan}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/profil" className="button-primary">
                Kenali sekolah kami <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link href="/kontak" className="button-secondary">
                Hubungi sekolah
              </Link>
            </div>
          </div>
        </div>
      </section>

      {sambutan && (
        <section className="section sambutan-section">
          <div className="section-shell sambutan-feature">
            <div className="sambutan-feature__intro">
              <SectionHeading
                kicker="Dari sekolah"
                judul={sambutan.judul}
                keterangan="Membangun ruang belajar yang berilmu, berkarakter, dan berakar pada nilai keislaman."
              />
            </div>

            <figure className="sambutan-portrait">
              {fotoKepalaSekolah ? (
                <img
                  src={fotoKepalaSekolah}
                  alt={kepalaSekolah ? `Foto ${kepalaSekolah.nama}` : 'Foto Kepala Sekolah'}
                  width="1200"
                  height="1800"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="sambutan-portrait__placeholder" aria-hidden="true">
                  {inisial(kepalaSekolah?.nama) || 'KS'}
                </div>
              )}

              <figcaption className="sambutan-portrait__caption">
                <span>{kepalaSekolah?.nama || 'Kepala Sekolah'}</span>
                <small>{kepalaSekolah?.jabatan || 'Kepala Sekolah'}</small>
              </figcaption>
            </figure>

            <div className="sambutan-feature__message">
              {(sambutanRingkas?.arab || sambutanRingkas?.salam) && (
                <div className="sambutan-opening">
                  {sambutanRingkas.arab && (
                    <p className="sambutan-opening__arab" lang="ar" dir="rtl">
                      {sambutanRingkas.arab}
                    </p>
                  )}
                  {sambutanRingkas.salam && (
                    <p className="sambutan-opening__salam">{sambutanRingkas.salam}</p>
                  )}
                </div>
              )}

              <p className="sambutan-feature__excerpt">{sambutanRingkas?.isi}</p>

              <Link href="/profil#sambutan" className="mt-7 inline-flex text-sm font-bold text-brand hover:underline">
                Baca sambutan lengkap <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {kurikulum && (
        <section className="section section--muted">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <SectionHeading
              kicker="Akademik"
              judul="Kurikulum"
              keterangan="Pembelajaran yang aktif, kreatif, dan terhubung dengan penguatan karakter Islami."
            />
            <div>
              <p className="max-w-2xl text-base leading-8 text-ink-muted">
                {stripHtmlAndTruncate(kurikulum.isi, 420)}
              </p>
              <Link href="/kurikulum" className="mt-6 inline-flex text-sm font-bold text-brand hover:underline">
                Lihat kurikulum lengkap <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-shell">
          <SectionHeading
            kicker="Kesiswaan"
            judul="Ruang untuk bertumbuh"
            keterangan="Kegiatan ekstrakurikuler menjadi ruang bagi peserta didik untuk mengembangkan minat, bakat, dan kepemimpinan."
          />
          {!ekstrakurikuler || ekstrakurikuler.length === 0 ? (
            <EmptyState
              className="mt-10"
              judul="Ekstrakurikuler segera hadir"
              pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan."
            />
          ) : (
            <>
              <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {ekstrakurikuler.map((ekskul: any) => (
                  <li key={ekskul.id} className="surface-card group p-5">
                    <span className="font-heading text-lg font-semibold text-ink-deep transition-colors group-hover:text-brand">
                      {ekskul.nama}
                    </span>
                    <span className="mt-3 block text-xs font-bold uppercase tracking-widest text-ink-muted">
                      Kegiatan siswa
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/ekstrakurikuler" className="mt-7 inline-flex text-sm font-bold text-brand hover:underline">
                Jelajahi semua kegiatan <span aria-hidden="true">&rarr;</span>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="section section--muted">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading kicker="Pendidik" judul="Orang-orang di balik pembelajaran" />
            <Link href="/guru" className="text-sm font-bold text-brand hover:underline">
              Lihat seluruh guru <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {listPendidik.length === 0 ? (
            <EmptyState className="mt-10" judul="Data guru sedang disiapkan" />
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {listPendidik.map((guru: any) => {
                const peranGuru = peran(guru)
                return (
                  <article key={guru.id} className="surface-card overflow-hidden p-4 text-center">
                    {guru.image_url ? (
                      <img
                        src={guru.image_url}
                        alt={`Foto ${guru.nama}`}
                        width={128}
                        height={128}
                        loading="lazy"
                        className="mx-auto h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand-soft font-heading text-3xl font-semibold text-brand sm:h-32 sm:w-32"
                      >
                        {inisial(guru.nama)}
                      </span>
                    )}
                    <h3 className="mt-4 font-heading text-base font-semibold leading-snug text-ink-deep">
                      {guru.nama}
                    </h3>
                    {peranGuru && (
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">{peranGuru}</p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading kicker="Kabar sekolah" judul="Berita terbaru" />
            <Link href="/berita" className="text-sm font-bold text-brand hover:underline">
              Semua berita <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {!beritaTerbaru || beritaTerbaru.length === 0 ? (
            <EmptyState
              className="mt-10"
              judul="Belum ada berita"
              pesan="Kegiatan dan pengumuman sekolah akan tampil di sini."
            />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beritaTerbaru.map((berita: any) => (
                <article key={berita.id} className="surface-card group overflow-hidden">
                  {berita.image_url && (
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
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--muted">
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              kicker="Dokumentasi"
              judul="Momen di sekolah"
              keterangan={`Lihat kembali kegiatan dan suasana belajar di ${situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'}.`}
            />
            <Link href="/galeri" className="text-sm font-bold text-brand hover:underline">
              Buka galeri <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          {!galeriTerbaru || galeriTerbaru.length === 0 ? (
            <EmptyState
              className="mt-10"
              judul="Galeri sedang disiapkan"
              pesan="Foto kegiatan sekolah akan segera kami unggah."
            />
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galeriTerbaru.map((album: any) => (
                <Link key={album.id} href={`/galeri/${album.slug}`} className="surface-card group overflow-hidden">
                  {album.image_url ? (
                    <div className="media-frame">
                      <img
                        src={album.image_url}
                        alt={album.judul}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center bg-paper-sunken text-sm text-ink-muted">
                      Belum ada foto
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-ink-deep group-hover:text-brand">
                      {album.judul}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">Lihat album</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-brand">
        <div className="section-shell py-16 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight-soft">Langkah berikutnya</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-heading text-3xl font-semibold leading-tight text-on-brand sm:text-4xl">
            Mari mengenal {situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'} lebih dekat.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-on-brand/85">
            Hubungi sekolah untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/kontak" className="button-secondary">
              Lihat informasi kontak
            </Link>
            {tautanWa && (
              <a href={tautanWa} target="_blank" rel="noopener" className="button-highlight">
                Chat WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
