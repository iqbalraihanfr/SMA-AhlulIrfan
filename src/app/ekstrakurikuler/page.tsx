import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'

export const metadata: Metadata = {
  title: 'Ekstrakurikuler',
  description: 'Wadah pengembangan minat, bakat, serta karakter siswa di SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/ekstrakurikuler' },
  openGraph: {
    title: 'Ekstrakurikuler | SMA Ahlul Irfan Bangsalsari',
    description: 'Wadah pengembangan minat, bakat, serta karakter siswa di SMA Ahlul Irfan Bangsalsari.',
    url: '/ekstrakurikuler',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function EkstrakurikulerPage() {
  const supabase = await createClient()

  const { data: daftar } = await supabase
    .from('ekstrakurikuler')
    .select('*')
    .order('urutan', { ascending: true })

  return (
    <>
      <PageHero
        judul="Ekstrakurikuler"
        keterangan="Wadah pengembangan minat, bakat, serta karakter siswa di luar kegiatan akademik."
      />

      <div className="section-shell py-14 sm:py-20">
        {!daftar || daftar.length === 0 ? (
          <EmptyState
            judul="Ekstrakurikuler segera hadir"
            pesan="Daftar kegiatan ekstrakurikuler sedang kami siapkan."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {daftar.map((ekskul: any) => (
              <article key={ekskul.id} className="surface-card group overflow-hidden">
                {ekskul.image_url && (
                  <img
                    src={ekskul.image_url}
                    alt={`Kegiatan ${ekskul.nama}`}
                    width={800}
                    height={500}
                    loading="lazy"
                    className="media-frame aspect-[8/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                )}

                <div className="p-6">
                  <h2 className="font-heading text-xl font-semibold text-ink-deep group-hover:text-brand">
                    {ekskul.nama}
                  </h2>

                  {ekskul.deskripsi && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {ekskul.deskripsi}
                    </p>
                  )}

                  {(ekskul.pembina || ekskul.jadwal) && (
                    <dl className="mt-4 space-y-1 text-sm">
                      {ekskul.pembina && (
                        <div className="flex gap-2">
                          <dt className="font-medium text-ink-muted">Pembina</dt>
                          <dd className="text-ink-muted">{ekskul.pembina}</dd>
                        </div>
                      )}
                      {ekskul.jadwal && (
                        <div className="flex gap-2">
                          <dt className="font-medium text-ink-muted">Jadwal</dt>
                          <dd className="text-ink-muted">{ekskul.jadwal}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
