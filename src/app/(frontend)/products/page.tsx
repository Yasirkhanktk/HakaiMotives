import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { ProductsClient } from './ProductsClient'

export const revalidate = 30 // Cache and revalidate every 30s to keep it fast and dynamic

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams.category || 'all'
  const q = resolvedSearchParams.q || ''

  let products: any[] = []
  let categories: any[] = []
  let whatsapp = '923001234567'

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch products
    try {
      const prodRes = await payload.find({
        collection: 'products',
        limit: 1000,
        depth: 1,
      })
      products = prodRes.docs
    } catch (e) {
      console.error('Failed to fetch products for catalog:', e)
    }

    // Fetch categories
    try {
      const catsRes = await payload.find({
        collection: 'categories',
        limit: 100,
      })
      categories = catsRes.docs
    } catch (e) {
      console.error('Failed to fetch categories for catalog:', e)
    }

    // Fetch WhatsApp number from website-content global
    try {
      const siteContent = await payload.findGlobal({
        slug: 'website-content',
      })
      if (siteContent?.whatsappNumber) {
        whatsapp = siteContent.whatsappNumber
      }
    } catch (e) {
      console.error('Failed to fetch WhatsApp number from global config:', e)
    }
  } catch (err) {
    console.error('Payload initialization failed on ProductsPage:', err)
  }

  return (
    <ProductsClient
      initialCategory={category}
      initialQuery={q}
      products={products}
      categories={categories}
      whatsapp={whatsapp}
    />
  )
}
