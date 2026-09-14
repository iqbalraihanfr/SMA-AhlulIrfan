import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Dokumentasi kegiatan dan suasana belajar di SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/galeri' },
  openGraph: {
    title: 'Galeri | SMA Ahlul Irfan Bangsalsari',
    description: 'Dokumentasi kegiatan dan suasana belajar di SMA Ahlul Irfan Bangsalsari.',
    url: '/galeri',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function GaleriPage() {
  const supabase = await createClient()

  const { data: daftarAlbum } = await supabase
    .from('album')
    .select('*')
    .order('urutan', { ascending: true })

  return (
    <>
      <PageHero
        judul="Galeri"
        keterangan="Dokumentasi kegiatan dan suasana sekolah."
      />

      <div className="section-shell py-14 sm:py-20">
        {!daftarAlbum || daftarAlbum.length === 0 ? (
          <EmptyState
            judul="Galeri sedang disiapkan"
            pesan="Foto kegiatan sekolah akan segera kami unggah."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {daftarAlbum.map((satu: any) => (
              <Link
                key={satu.id}
                href={`/galeri/${satu.slug}`}
                className="surface-card group overflow-hidden"
              >
                {satu.image_url ? (
                  <div className="media-frame">
                    <img
                      src={satu.image_url}
                      alt={satu.judul}
                      width={800}
                      height={600}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-[4/3] w-full place-items-center bg-paper-sunken text-sm text-ink-muted">
                    Belum ada foto
                  </div>
                )}

                <div className="p-5">
                  <h2 className="font-heading text-xl font-semibold text-ink-deep group-hover:text-brand">
                    {satu.judul}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">Lihat album</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
