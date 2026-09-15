import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'

export const metadata: Metadata = {
  title: 'Guru dan Tenaga Kependidikan',
  description: 'Kenali pendidik dan tenaga kependidikan SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/guru' },
  openGraph: {
    title: 'Guru dan Tenaga Kependidikan | SMA Ahlul Irfan Bangsalsari',
    description: 'Kenali pendidik dan tenaga kependidikan SMA Ahlul Irfan Bangsalsari.',
    url: '/guru',
    locale: 'id_ID',
    type: 'website',
  },
}

function KartuGuru({ guru }: { guru: any }) {
  return (
    <div className="surface-card p-4">
      <div className="aspect-[3/4] w-full overflow-hidden rounded bg-paper-sunken">
        {guru.image_url ? (
          <img
            src={guru.image_url}
            alt={guru.nama}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink-muted">FOTO</div>
        )}
      </div>
      <h3 className="mt-3 font-heading font-semibold text-ink-deep">{guru.nama}</h3>
      <p className="text-sm text-ink-muted">{guru.jabatan}</p>
    </div>
  )
}

export default async function GuruPage() {
  const supabase = await createClient()

  const [
    { data: pendidik },
    { data: tendik },
  ] = await Promise.all([
    supabase
      .from('guru')
      .select('*')
      .eq('aktif', true)
      .eq('kategori', 'pendidik')
      .order('urutan', { ascending: true }),
    supabase
      .from('guru')
      .select('*')
      .eq('aktif', true)
      .eq('kategori', 'tenaga_kependidikan')
      .order('urutan', { ascending: true }),
  ])

  return (
    <>
      <PageHero
        judul="Guru & Tenaga Kependidikan"
        keterangan="Tenaga pendidik dan kependidikan yang mendampingi peserta didik setiap hari."
      />

      <div className="section-shell space-y-20 py-14 sm:py-20">
        <section>
          <SectionHeading
            kicker="Pembelajaran"
            judul="Pendidik"
            keterangan="Guru yang mendampingi peserta didik dalam proses belajar dan bertumbuh."
          />

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
          <SectionHeading
            kicker="Layanan sekolah"
            judul="Tenaga Kependidikan"
            keterangan="Tim yang memastikan layanan sekolah berjalan setiap hari."
          />

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
