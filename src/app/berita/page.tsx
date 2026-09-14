import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'
import { KartuBerita } from '@/components/ui/KartuBerita'

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Kabar, kegiatan, dan pengumuman SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/berita' },
  openGraph: {
    title: 'Berita | SMA Ahlul Irfan Bangsalsari',
    description: 'Kabar, kegiatan, dan pengumuman SMA Ahlul Irfan Bangsalsari.',
    url: '/berita',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function BeritaPage() {
  const supabase = await createClient()

  const { data: daftar } = await supabase
    .from('berita')
    .select('*')
    .eq('status', 'terbit')
    .lte('diterbitkan_pada', new Date().toISOString())
    .order('diterbitkan_pada', { ascending: false })

  return (
    <>
      <PageHero
        judul="Berita"
        keterangan="Kabar, kegiatan, dan pengumuman dari sekolah."
      />

      <div className="section-shell py-14 sm:py-20">
        {!daftar || daftar.length === 0 ? (
          <EmptyState
            judul="Belum ada berita"
            pesan="Kegiatan dan pengumuman sekolah akan tampil di halaman ini."
          />
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
