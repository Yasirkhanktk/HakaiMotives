import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { HomeClient } from './HomeClient'

export const revalidate = 30 // Cache and revalidate every 30s to keep it fast and dynamic

export default async function HomePage() {
  let siteContent: any = null
  let categories: any[] = []
  let topProducts: any[] = []
  let featuredProduct: any = null
  let projects: any[] = []
  let testimonials: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Fetch website-content global
    try {
      siteContent = await payload.findGlobal({
        slug: 'website-content',
      })
    } catch (e) {
      console.error('Failed to fetch website-content global', e)
    }

    // 2. Fetch categories
    try {
      const catsRes = await payload.find({
        collection: 'categories',
        limit: 100,
        depth: 1, // Populate image relationship so we get media.url
      })
      categories = catsRes.docs
    } catch (e) {
      console.error('Failed to fetch categories', e)
    }

    // 3. Fetch top products (query BESTSELLER products)
    try {
      const prodRes = await payload.find({
        collection: 'products',
        where: {
          badge: {
            equals: 'BESTSELLER',
          },
        },
        limit: 4,
        depth: 1,
      })
      topProducts = prodRes.docs

      // Fallback: If no bestseller products, query first 4 products
      if (topProducts.length === 0) {
        const fallbackProdRes = await payload.find({
          collection: 'products',
          limit: 4,
          depth: 1,
        })
        topProducts = fallbackProdRes.docs
      }
    } catch (e) {
      console.error('Failed to fetch top products', e)
    }

    // 4. Fetch featured product (query LIMITED product)
    try {
      const featRes = await payload.find({
        collection: 'products',
        where: {
          badge: {
            equals: 'LIMITED',
          },
        },
        limit: 1,
        depth: 1,
      })
      if (featRes.docs.length > 0) {
        featuredProduct = featRes.docs[0]
      } else if (topProducts.length > 0) {
        featuredProduct = topProducts[0]
      }
    } catch (e) {
      console.error('Failed to fetch featured product', e)
    }

    // 5. Fetch projects
    try {
      const projRes = await payload.find({
        collection: 'projects',
        limit: 6,
        depth: 1,
      })
      projects = projRes.docs
    } catch (e) {
      console.error('Failed to fetch projects', e)
    }

    // 6. Fetch testimonials
    try {
      const testRes = await payload.find({
        collection: 'testimonials',
        where: {
          verified: {
            equals: true,
          },
        },
        limit: 100,
      })
      testimonials = testRes.docs
    } catch (e) {
      console.error('Failed to fetch testimonials', e)
    }
  } catch (err) {
    console.error('Payload initialization failed on HomePage:', err)
  }

  // Compute product counts dynamically for each category
  if (categories.length > 0) {
    try {
      const payload = await getPayload({ config: configPromise })
      const allProducts = await payload.find({
        collection: 'products',
        limit: 1000,
        depth: 1,
      })
      categories = categories.map((cat: any) => {
        const count = allProducts.docs.filter((p: any) => {
          const catId = typeof p.category === 'object' && p.category !== null ? p.category.id : p.category;
          return catId === cat.id;
        }).length;
        return { ...cat, count };
      })
    } catch (err) {
      console.error('Failed to compute category counts:', err)
    }
  }

  return (
    <HomeClient
      siteContent={siteContent}
      categories={categories}
      topProducts={topProducts}
      featuredProduct={featuredProduct}
      projects={projects}
      testimonials={testimonials}
    />
  )
}
