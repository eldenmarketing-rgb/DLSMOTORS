import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'

export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NEXT_PUBLIC_INDEXABLE === 'true'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url

  if (!indexable) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
