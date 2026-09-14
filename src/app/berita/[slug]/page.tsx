import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Prosa } from '@/components/ui/Prosa'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { KartuBerita, formatTanggal } from '@/components/ui/KartuBerita'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'terbit')
    .lte('diterbitkan_pada', new Date().toISOString())
    .single()

  if (!berita) {
    return { title: 'Berita Tidak Ditemukan' }
  }

  return {
    title: berita.judul,
    description: berita.ringkasan || berita.judul,
    alternates: { canonical: `/berita/${slug}` },
    openGraph: {
      title: `${berita.judul} | SMA Ahlul Irfan Bangsalsari`,
      description: berita.ringkasan || berita.judul,
      url: `/berita/${slug}`,
      locale: 'id_ID',
      type: 'article',
      publishedTime: berita.diterbitkan_pada,
      images: berita.image_url ? [{ url: berita.image_url, alt: berita.judul }] : undefined,
    },
  }
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: berita } = await supabase
    .from('berita')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'terbit')
    .lte('diterbitkan_pada', new Date().toISOString())
    .single()

  if (!berita) {
    notFound()
  }

  const { data: lainnya } = await supabase
    .from('berita')
    .select('*')
    .eq('status', 'terbit')
    .neq('id', berita.id)
    .lte('diterbitkan_pada', new Date().toISOString())
    .order('diterbitkan_pada', { ascending: false })
    .limit(3)

  return (
    <>
      <article className="section-shell max-w-3xl py-14 sm:py-20">
        <p className="text-sm">
          <Link
            href="/berita"
            className="text-brand underline-offset-4 hover:underline"
          >
            &larr; Semua berita
          </Link>
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink-deep sm:text-5xl">
          {berita.judul}
        </h1>

        {berita.diterbitkan_pada && (
          <time
            dateTime={berita.diterbitkan_pada}
            className="mt-3 block text-sm text-ink-muted"
          >
            {formatTanggal(berita.diterbitkan_pada)}
          </time>
        )}

        {berita.image_url && (
          <img
            src={berita.image_url}
            alt={berita.judul}
            width={1600}
            height={1000}
            className="mt-10 w-full rounded-md object-cover shadow-card"
          />
        )}

        <div className="mt-8">
          <Prosa html={berita.isi} />
        </div>
      </article>

      {lainnya && lainnya.length > 0 && (
        <section className="section section--muted">
          <div className="section-shell">
            <SectionHeading judul="Berita lainnya" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lainnya.map((lain: any) => (
                <KartuBerita key={lain.id} berita={lain} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
