import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { Prosa } from '@/components/ui/Prosa'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data: halaman } = await supabase
    .from('konten_halaman')
    .select('judul, terbit')
    .eq('kunci', 'prestasi')
    .single()

  if (!halaman || !halaman.terbit) {
    return { title: 'Halaman Tidak Ditemukan' }
  }

  return {
    title: halaman.judul,
    description: `Prestasi siswa SMA Ahlul Irfan Bangsalsari.`,
    alternates: { canonical: '/prestasi' },
    openGraph: {
      title: `${halaman.judul} | SMA Ahlul Irfan Bangsalsari`,
      description: `Prestasi siswa SMA Ahlul Irfan Bangsalsari.`,
      url: '/prestasi',
      locale: 'id_ID',
      type: 'website',
    },
  }
}

export default async function PrestasiPage() {
  const supabase = await createClient()

  const { data: halaman } = await supabase
    .from('konten_halaman')
    .select('*')
    .eq('kunci', 'prestasi')
    .single()

  if (!halaman || !halaman.terbit) {
    notFound()
  }

  return (
    <>
      <PageHero judul={halaman.judul} />

      <div className="section-shell py-14 sm:py-20">
        <Prosa html={halaman.isi} />
      </div>
    </>
  )
}
