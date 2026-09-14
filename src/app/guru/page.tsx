import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

function SectionHeading({ kicker, judul, keterangan }: { kicker: string, judul: string, keterangan: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-brand">{kicker}</p>
      <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-ink-deep sm:text-3xl">{judul}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{keterangan}</p>
    </div>
  )
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

function EmptyState({ judul }: { judul: string }) {
  return (
    <div className="mt-8 rounded-xl border border-line border-dashed p-10 text-center">
      <h3 className="font-heading text-lg font-semibold text-ink-deep">{judul}</h3>
    </div>
  )
}

function KartuGuru({ guru }: { guru: any }) {
  return (
    <div className="surface-card p-4">
      <div className="aspect-[3/4] w-full overflow-hidden rounded bg-paper-sunken">
        {guru.foto_url ? (
          <img src={guru.foto_url} alt={guru.nama} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">FOTO</div>
        )}
      </div>
      <h3 className="mt-3 font-heading font-semibold text-ink-deep">{guru.nama}</h3>
      <p className="text-sm text-ink-muted">{guru.jabatan}</p>
    </div>
  )
}

export default async function Guru() {
  const supabase = await createClient()
  
  const [
    { data: situs },
    { data: pendidik },
    { data: tendik }
  ] = await Promise.all([
    supabase.from('pengaturan_situs').select('nama_sekolah').limit(1).single(),
    supabase.from('guru').select('*').eq('aktif', true).eq('kategori', 'pendidik'),
    supabase.from('guru').select('*').eq('aktif', true).eq('kategori', 'tenaga_kependidikan')
  ])

  return (
    <>
      <PageHero judul="Guru & Tenaga Kependidikan" keterangan="Tenaga pendidik dan kependidikan yang mendampingi peserta didik setiap hari." />

      <div className="section-shell space-y-20 py-14 sm:py-20">
        <section>
          <SectionHeading kicker="Pembelajaran" judul="Pendidik" keterangan="Guru yang mendampingi peserta didik dalam proses belajar dan bertumbuh." />

          {!pendidik || pendidik.length === 0 ? (
            <EmptyState judul="Data pendidik sedang disiapkan" />
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pendidik.map((orang: any) => (
                <KartuGuru key={orang.id} guru={orang} />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading kicker="Layanan sekolah" judul="Tenaga Kependidikan" keterangan="Tim yang memastikan layanan sekolah berjalan setiap hari." />

          {!tendik || tendik.length === 0 ? (
            <EmptyState judul="Data tenaga kependidikan sedang disiapkan" />
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tendik.map((orang: any) => (
                <KartuGuru key={orang.id} guru={orang} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
