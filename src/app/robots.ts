import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV === 'preview') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/login', '/setup'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  }
}
