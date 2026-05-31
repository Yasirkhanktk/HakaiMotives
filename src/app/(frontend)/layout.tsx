import React from 'react'
import { CartProvider } from '@/app/context/CartContext'
import '@/styles/index.css'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { Navbar } from '@/app/components/Navbar'
import { Footer } from '@/app/components/Footer'
import { Cart } from '@/app/components/Cart'
import { WhatsAppButton } from '@/app/components/WhatsAppButton'

export async function generateMetadata() {
  try {
    const payload = await getPayload({ config: configPromise })
    const siteContent = await payload.findGlobal({
      slug: 'website-content',
    })
    return {
      title: siteContent.heroTitleLine1
        ? `${siteContent.heroTitleLine1} | HakaiMotives`
        : 'HakaiMotives | Premium Auto Parts & Modification Store',
      description: siteContent.heroSubcopy || 'Browse, customize, and order premium visual auto upgrades in Pakistan.',
      icons: {
        icon: '/icon.svg',
      },
    }
  } catch (e) {
    return {
      title: 'HakaiMotives | Premium Auto Parts & Modification Store',
      description: 'Browse, customize, and order premium visual auto upgrades in Pakistan.',
      icons: {
        icon: '/icon.svg',
      },
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let siteContent = {
    whatsappNumber: '923490090074',
    instagramUrl: 'https://www.instagram.com',
    footerText: 'Hakai Motives. Premium visual upgrades. Est. Pakistan.',
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const data = await payload.findGlobal({
      slug: 'website-content',
    })
    if (data) {
      siteContent = data as any
    }
  } catch (e) {
    console.error('Failed to fetch global site content', e)
  }

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
        <CartProvider>
          <Navbar whatsapp={siteContent.whatsappNumber} instagram={siteContent.instagramUrl} />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
          <Footer footerText={siteContent.footerText} instagram={siteContent.instagramUrl} whatsapp={siteContent.whatsappNumber} />
          <Cart whatsapp={siteContent.whatsappNumber} />
          <WhatsAppButton whatsapp={siteContent.whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  )
}
