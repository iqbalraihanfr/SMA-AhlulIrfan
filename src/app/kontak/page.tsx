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

  let tautanWa: string | null = null
  if (situs?.whatsapp) {
    const rawWa = situs.whatsapp.replace(/\D/g, '')
    const waNormalized = rawWa.startsWith('0') ? '62' + rawWa.slice(1) : rawWa
    const pesan = encodeURIComponent(
      `Assalamu'alaikum, saya ingin bertanya tentang ${namaSekolah}`
    )
    tautanWa = `https://wa.me/${waNormalized}?text=${pesan}`
  }

  const cleanTelepon = situs?.telepon ? situs.telepon.replace(/\D/g, '') : null

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
              <dt className="text-sm font-semibold text-ink">Telepon</dt>
              <dd className="mt-1 text-ink-muted">
                {situs?.telepon ? (
                  <a
                    href={`tel:${cleanTelepon}`}
                    className="underline underline-offset-2 hover:text-brand"
                  >
                    {situs.telepon}
                  </a>
                ) : (
                  'Belum tersedia.'
                )}
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

          {tautanWa && (
            <div className="pt-2">
              <a
                href={tautanWa}
                target="_blank"
                rel="noopener noreferrer"
                className="button-highlight inline-flex"
              >
                Chat WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="surface-card overflow-hidden p-2">
          {situs?.peta_lat && situs?.peta_lng ? (
            <iframe
              title={`Peta lokasi ${namaSekolah}`}
              className="aspect-[4/3] w-full rounded-lg border border-line"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                Number(situs.peta_lng) - 0.01
              },${Number(situs.peta_lat) - 0.01},${Number(situs.peta_lng) + 0.01},${
                Number(situs.peta_lat) + 0.01
              }&layer=mapnik&marker=${situs.peta_lat},${situs.peta_lng}`}
            />
          ) : (
            <EmptyState
              judul="Peta lokasi belum tersedia"
              pesan="Titik koordinat sekolah sedang kami lengkapi."
            />
          )}
        </div>
      </div>
    </>
  )
}
