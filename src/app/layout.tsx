import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { siteUrl } from '@/lib/site-url'
import { schoolDescription, schoolName, schoolOpenGraph } from '@/lib/seo'

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
    default: schoolName,
    template: `%s | ${schoolName}`,
  },
  description: schoolDescription,
  applicationName: schoolName,
  robots: process.env.VERCEL_ENV === 'preview' ? { index: false, follow: false } : undefined,
  twitter: { card: 'summary_large_image' },
  openGraph: {
    ...schoolOpenGraph,
    title: schoolName,
    description: schoolDescription,
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
