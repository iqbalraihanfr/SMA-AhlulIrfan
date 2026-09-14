import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'
import { SimpulStruktur, type SimpulOrganisasi } from '@/components/ui/SimpulStruktur'

export const metadata: Metadata = {
  title: 'Struktur Organisasi',
  description: 'Struktur organisasi SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/profil/struktur-organisasi' },
  openGraph: {
    title: 'Struktur Organisasi | SMA Ahlul Irfan Bangsalsari',
    description: 'Struktur organisasi SMA Ahlul Irfan Bangsalsari.',
    url: '/profil/struktur-organisasi',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function StrukturOrganisasiPage() {
  const supabase = await createClient()

  const [{ data: situs }, { data: barisStruktur }] = await Promise.all([
    supabase.from('pengaturan_situs').select('nama_sekolah').limit(1).single(),
    supabase
      .from('struktur_organisasi')
      .select('*, guru(nama)')
      .order('baris', { ascending: true })
      .order('urutan', { ascending: true }),
  ])

  // Bangun pohon relasi hierarkis
  let akar: SimpulOrganisasi | null = null

  if (barisStruktur && barisStruktur.length > 0) {
    const simpulMap = new Map<number, SimpulOrganisasi>()

    for (const item of barisStruktur) {
      simpulMap.set(item.id, {
        ...item,
        anak: [],
      })
    }

    for (const item of barisStruktur) {
      const node = simpulMap.get(item.id)!
      if (item.atasan_id && simpulMap.has(item.atasan_id)) {
        simpulMap.get(item.atasan_id)!.anak!.push(node)
      } else if (!item.atasan_id && !akar) {
        akar = node
      }
    }
  }

  const namaSekolah = situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'

  return (
    <>
      <PageHero judul="Struktur Organisasi" />

      <div className="section-shell py-14 sm:py-20">
        {!akar ? (
          <EmptyState
            judul="Struktur organisasi sedang disiapkan"
            pesan="Bagan struktur organisasi sekolah sedang dalam proses pembaruan."
          />
        ) : (
          <div
            className="struktur-viewport"
            role="region"
            tabIndex={0}
            aria-label="Bagan struktur organisasi; geser secara mendatar bila bagan melebihi lebar layar"
          >
            <figure className="struktur-bagan" data-bagan-organisasi>
              <figcaption className="sr-only">
                Bagan struktur organisasi {namaSekolah}
              </figcaption>

              <ul className="struktur-bagan__akar">
                <SimpulStruktur simpul={akar} />
              </ul>
            </figure>
          </div>
        )}

        <p className="mt-10 border-t border-line pt-6 text-sm text-ink-muted">
          Data nama diambil dari daftar{' '}
          <Link href="/guru" className="text-brand underline underline-offset-2">
            guru dan tenaga kependidikan
          </Link>
          , sehingga bagan ini ikut diperbarui setiap ada perubahan personel.
        </p>
      </div>
    </>
  )
}
