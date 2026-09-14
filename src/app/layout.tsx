import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SMA Ahlul Irfan Bangsalsari',
  description: 'Situs resmi SMA Ahlul Irfan Bangsalsari',
}

export default async function RootLayout({
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
    <html lang="id" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${newsreader.variable} flex min-h-screen flex-col bg-paper font-sans text-ink antialiased`}>
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
      </body>
    </html>
  )
}

