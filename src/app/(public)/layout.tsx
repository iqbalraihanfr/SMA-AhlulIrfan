import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const [{ data: pengaturan }, { data: halamanRows }] = await Promise.all([
    supabase.from('pengaturan_situs').select('*').limit(1).single(),
    supabase.from('konten_halaman').select('kunci, terbit').eq('terbit', true),
  ])

  const halamanTerbit = halamanRows && halamanRows.length > 0
    ? halamanRows.map((h: any) => h.kunci)
    : ['sejarah', 'visi_misi', 'sambutan_kepsek', 'kurikulum']

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
      >
        Lompat ke konten utama
      </a>
      <Navbar situs={pengaturan} halamanTerbit={halamanTerbit} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <Footer situs={pengaturan} />
    </div>
  )
}
