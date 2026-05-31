import type { CollectionConfig } from 'payload'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client for presigning
let s3Client: S3Client | null = null

if (process.env.SUPABASE_STORAGE_ENDPOINT) {
  s3Client = new S3Client({
    endpoint: process.env.SUPABASE_STORAGE_ENDPOINT,
    region: process.env.SUPABASE_STORAGE_REGION || 'ap-northeast-1',
    credentials: {
      accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  })
}

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    afterRead: [
      async ({ doc }) => {
        // If the URL is already an external HTTP(S) URL (like Unsplash fallbacks), leave it
        if (doc.url && (doc.url.startsWith('http://') || doc.url.startsWith('https://')) && !doc.url.includes('/api/media/file/')) {
          return doc
        }

        if (s3Client && doc.filename) {
          try {
            const command = new GetObjectCommand({
              Bucket: process.env.SUPABASE_STORAGE_BUCKET || '',
              Key: doc.filename,
            })
            // Generate a presigned URL valid for 24 hours (86400 seconds)
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 86400 })
            doc.url = signedUrl
          } catch (err) {
            console.error(`Failed to generate signed URL for ${doc.filename}:`, err)
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
