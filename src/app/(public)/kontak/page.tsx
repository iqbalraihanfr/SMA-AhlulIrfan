import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'

export const metadata: Metadata = {
  title: 'Kontak',
  description: 'Alamat dan kontak resmi SMA Ahlul Irfan Bangsalsari.',
  alternates: { canonical: '/kontak' },
  openGraph: {
    title: 'Kontak | SMA Ahlul Irfan Bangsalsari',
    description: 'Alamat dan kontak resmi SMA Ahlul Irfan Bangsalsari.',
    url: '/kontak',
    locale: 'id_ID',
    type: 'website',
  },
}

export default async function KontakPage() {
  const supabase = await createClient()

  const { data: situs } = await supabase
    .from('pengaturan_situs')
    .select('*')
    .limit(1)
    .single()

  const namaSekolah = situs?.nama_sekolah || 'SMA Ahlul Irfan Bangsalsari'

      return (
    <>
      <PageHero
        judul="Kontak"
        keterangan="Hubungi kami untuk informasi pendaftaran, kunjungan, dan pertanyaan lainnya."
      />

      <div className="section-shell grid gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div className="surface-card space-y-6 p-6 sm:p-8">
          <dl className="space-y-5">
            <div>
              <dt className="text-sm font-semibold text-ink">Alamat</dt>
              <dd className="mt-1 text-ink-muted">
                {situs?.alamat || 'Alamat lengkap sedang dilengkapi.'}
              </dd>
            </div>

                        <div>
              <dt className="text-sm font-semibold text-ink">Email</dt>
              <dd className="mt-1 text-ink-muted">
                {situs?.email ? (
                  <a
                    href={`mailto:${situs.email}`}
                    className="underline underline-offset-2 hover:text-brand"
                  >
                    {situs.email}
                  </a>
                ) : (
                  'Belum tersedia.'
                )}
              </dd>
            </div>

            {situs?.npsn && (
              <div>
                <dt className="text-sm font-semibold text-ink">NPSN</dt>
                <dd className="mt-1 text-ink-muted">{situs.npsn}</dd>
              </div>
            )}

            {situs?.akreditasi && (
              <div>
                <dt className="text-sm font-semibold text-ink">Akreditasi</dt>
                <dd className="mt-1 text-ink-muted">{situs.akreditasi}</dd>
              </div>
            )}
          </dl>

                  </div>

        <div className="surface-card overflow-hidden p-2">
          <iframe
            title={`Peta lokasi ${namaSekolah}`}
            className="aspect-[4/3] w-full rounded-lg border border-line"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=SMA+Ahlul+Irfan+Bangsalsari&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </div>
    </>

  )
}
