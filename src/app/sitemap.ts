import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { siteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const staticRoutes = [
    '',
    '/profil',
    '/profil/struktur-organisasi',
    '/guru',
    '/ekstrakurikuler',
    '/berita',
    '/galeri',
    '/kontak',
  ].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
  }))

  const [
    { data: konten },
    { data: berita },
    { data: album },
  ] = await Promise.all([
    supabase.from('konten_halaman').select('kunci, updated_at').eq('terbit', true),
    supabase
      .from('berita')
      .select('slug, updated_at')
      .eq('status', 'terbit')
      .lte('diterbitkan_pada', new Date().toISOString()),
    supabase.from('album').select('slug, updated_at'),
  ])

  const routeHalamanMap: Record<string, string> = {
    kurikulum: '/kurikulum',
    prestasi: '/prestasi',
    tata_tertib: '/tata-tertib',
    organisasi_siswa: '/organisasi-siswa',
  }

  const proseRoutes = (konten || [])
    .filter((k: any) => routeHalamanMap[k.kunci])
    .map((k: any) => ({
      url: new URL(routeHalamanMap[k.kunci], siteUrl).toString(),
      lastModified: k.updated_at ? new Date(k.updated_at) : new Date(),
    }))

  const beritaRoutes = (berita || []).map((b: any) => ({
    url: new URL(`/berita/${b.slug}`, siteUrl).toString(),
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
  }))

  const albumRoutes = (album || []).map((a: any) => ({
    url: new URL(`/galeri/${a.slug}`, siteUrl).toString(),
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
  }))

  return [...staticRoutes, ...proseRoutes, ...beritaRoutes, ...albumRoutes]
}
