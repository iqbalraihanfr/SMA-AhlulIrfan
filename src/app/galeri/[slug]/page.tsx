import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/ui/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: album } = await supabase
    .from('album')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!album) {
    return { title: 'Album Tidak Ditemukan' }
  }

  return {
    title: album.judul,
    description: album.deskripsi || `Dokumentasi foto ${album.judul} SMA Ahlul Irfan Bangsalsari.`,
    alternates: { canonical: `/galeri/${slug}` },
    openGraph: {
      title: `${album.judul} | SMA Ahlul Irfan Bangsalsari`,
      description: album.deskripsi || `Dokumentasi foto ${album.judul} SMA Ahlul Irfan Bangsalsari.`,
      url: `/galeri/${slug}`,
      locale: 'id_ID',
      type: 'website',
      images: album.image_url ? [{ url: album.image_url, alt: album.judul }] : undefined,
    },
  }
}

export default async function GaleriDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: album } = await supabase
    .from('album')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!album) {
    notFound()
  }

  return (
    <>
      <PageHero
        judul={album.judul}
        keterangan={album.deskripsi}
        gambar={album.image_url}
      />

      <div className="section-shell py-14 sm:py-20">
        <p className="text-sm">
          <Link
            href="/galeri"
            className="text-brand underline-offset-4 hover:underline"
          >
            &larr; Semua album
          </Link>
        </p>

        {!album.image_url ? (
          <EmptyState className="mt-8" judul="Album ini belum berisi foto" />
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <li>
              <a
                href={album.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-md border border-line"
              >
                <img
                  src={album.image_url}
                  alt={album.judul}
                  width={600}
                  height={600}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition hover:opacity-90"
                />
              </a>
            </li>
          </ul>
        )}
      </div>
    </>
  )
}
