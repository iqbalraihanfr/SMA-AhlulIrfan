import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Kabar, kegiatan, dan pengumuman SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/berita' },
  openGraph: {
    title: 'Berita SMA Ahlul Irfan Bangsalsari',
    description: 'Kabar, kegiatan, dan pengumuman SMA Ahlul Irfan Bangsalsari.',
    url: '/berita',
    locale: 'id_ID',
    type: 'website',
  },
}

function PageHero({ judul, keterangan }: { judul: string, keterangan: string }) {
  return (
    <div className="bg-brand py-12 text-on-brand sm:py-20">
      <div className="section-shell">
        <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{judul}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-brand/90">{keterangan}</p>
      </div>
    </div>
  )
}

function EmptyState({ judul, pesan }: { judul: string, pesan: string }) {
  return (
    <div className="mt-8 rounded-xl border border-line border-dashed p-10 text-center">
      <h3 className="font-heading text-lg font-semibold text-ink-deep">{judul}</h3>
      <p className="mt-2 text-sm text-ink-muted">{pesan}</p>
    </div>
  )
}

function KartuBerita({ berita }: { berita: any }) {
  return (
    <Link href={`/berita/${berita.slug}`} className="group block">
      <div className="aspect-video w-full overflow-hidden rounded bg-paper-sunken">
        {berita.sampul_url ? (
          <img src={berita.sampul_url} alt={berita.judul} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">Belum ada foto</div>
        )}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brand">
        {new Date(berita.dibuat_pada).toLocaleDateString('id-ID')}
      </p>
      <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-ink-deep group-hover:text-brand">
        {berita.judul}
      </h3>
    </Link>
  )
}

export default async function Berita() {
  const supabase = await createClient()
  
  const { data: daftar } = await supabase
    .from('berita')
    .select('*')
    .eq('status', 'terbit')
    .order('dibuat_pada', { ascending: false })

  return (
    <>
      <PageHero judul="Berita" keterangan="Kabar, kegiatan, dan pengumuman dari sekolah." />

      <div className="section-shell py-14 sm:py-20">
        {!daftar || daftar.length === 0 ? (
          <EmptyState judul="Belum ada berita" pesan="Kegiatan dan pengumuman sekolah akan tampil di halaman ini." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {daftar.map((berita: any) => (
              <KartuBerita key={berita.id} berita={berita} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
