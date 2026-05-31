import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ekgrepccvtqpcqqxwbft.storage.supabase.co',
      },
    ],
  },
}

export default withPayload(nextConfig)
