const productionUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)

if (process.env.VERCEL_ENV === 'production' && !productionUrl) {
  throw new Error('Set NEXT_PUBLIC_SITE_URL or enable Vercel system environment variables')
}

export const siteUrl = new URL(productionUrl || 'http://localhost:3000')
