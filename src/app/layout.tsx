import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { siteUrl } from '@/lib/site-url'

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
  metadataBase: siteUrl,
  title: {
    default: 'SMA Ahlul Irfan Bangsalsari',
    template: '%s | SMA Ahlul Irfan Bangsalsari',
  },
  description: 'Situs resmi SMA Ahlul Irfan Bangsalsari',
  openGraph: {
    title: 'SMA Ahlul Irfan Bangsalsari',
    description: 'Situs resmi SMA Ahlul Irfan Bangsalsari',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${newsreader.variable} bg-paper font-sans text-ink antialiased`}>
        {children}
      </body>
    </html>
  )
}
