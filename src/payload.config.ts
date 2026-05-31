import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Banners } from './collections/Banners'
import { Testimonials } from './collections/Testimonials'
import { Projects } from './collections/Projects'
import { WebsiteContent } from './globals/WebsiteContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('Payload S3 Plugin Check - SUPABASE_STORAGE_ENDPOINT is:', process.env.SUPABASE_STORAGE_ENDPOINT ? 'FOUND' : 'NOT FOUND')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'super-secret-key-change-in-env',
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/hakai-motives',
  }),
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Categories,
    Brands,
    Products,
    Orders,
    Banners,
    Testimonials,
    Projects,
  ],
  globals: [
    WebsiteContent,
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    // Conditionally enable Supabase Storage to allow offline/local fallback
    ...(process.env.SUPABASE_STORAGE_ENDPOINT
      ? [
          s3Storage({
            collections: {
              media: true,
            },
            bucket: process.env.SUPABASE_STORAGE_BUCKET || '',
            config: {
              endpoint: process.env.SUPABASE_STORAGE_ENDPOINT || '',
              region: process.env.SUPABASE_STORAGE_REGION || 'us-east-1',
              credentials: {
                accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY || '',
              },
              forcePathStyle: true,
            },
          }),
        ]
      : []),
  ],
})
