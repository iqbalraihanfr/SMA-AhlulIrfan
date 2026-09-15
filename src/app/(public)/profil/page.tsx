import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EmptyState } from '@/components/ui/EmptyState'
import { Prosa } from '@/components/ui/Prosa'

export const metadata: Metadata = {
  title: 'Profil Sekolah',
  description: 'Sejarah, visi dan misi, serta sambutan Kepala SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/profil' },
  openGraph: {
    title: 'Profil Sekolah | SMA Ahlul Irfan Bangsalsari',
    description: 'Sejarah, visi dan misi, serta sambutan Kepala SMA Ahlul Irfan Bangsalsari.',
    url: '/profil',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function ProfilPage() {
  const supabase = await createClient()

  const [
    { data: sejarah },
    { data: visiMisi },
    { data: sambutan },
  ] = await Promise.all([
    supabase.from('konten_halaman').select('*').eq('kunci', 'sejarah').eq('terbit', true).maybeSingle(),
    supabase.from('konten_halaman').select('*').eq('kunci', 'visi_misi').eq('terbit', true).maybeSingle(),
    supabase.from('konten_halaman').select('*').eq('kunci', 'sambutan_kepsek').eq('terbit', true).maybeSingle(),
  ])

  const noData = !sejarah && !visiMisi && !sambutan

  return (
    <>
      <PageHero
        judul="Profil Sekolah"
        keterangan="Sejarah, visi dan misi, serta sambutan Kepala Sekolah."
      />

      <div className="section-shell space-y-20 py-14 sm:py-20">
        {sejarah && (
          <section id="sejarah">
            <SectionHeading kicker="Perjalanan sekolah" judul={sejarah.judul} />
            <div className="mt-8">
              <Prosa html={sejarah.isi} />
            </div>
          </section>
        )}

        {visiMisi && (
          <section id="visi-misi">
            <SectionHeading kicker="Arah pendidikan" judul={visiMisi.judul} />
            <div className="mt-8">
              <Prosa html={visiMisi.isi} />
            </div>
          </section>
        )}

        {sambutan && (
          <section id="sambutan">
            <SectionHeading kicker="Kepala sekolah" judul={sambutan.judul} />
            <div className="mt-8">
              <Prosa html={sambutan.isi} />
            </div>
          </section>
        )}

        {noData && (
          <EmptyState
            judul="Profil sedang disiapkan"
            pesan="Naskah profil sekolah belum tersedia. Silakan kembali lagi nanti."
          />
        )}

        <p className="border-t border-line pt-8">
          <Link
            href="/profil/struktur-organisasi"
            className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            Lihat struktur organisasi sekolah &rarr;
          </Link>
        </p>
      </div>
    </>
  )
}
