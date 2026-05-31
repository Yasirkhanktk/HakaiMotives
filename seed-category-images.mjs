/**
 * seed-category-images.mjs
 * Downloads Unsplash images for each category, uploads to Supabase S3,
 * creates media documents in MongoDB, and links them to the categories.
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Read .env ────────────────────────────────────────────────────────────────
const env = {}
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8')
  envFile.split('\n').forEach((line) => {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/)
    if (match) {
      const key = match[1].trim()
      let val = match[2].trim()
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      env[key] = val
    }
  })
} catch (e) {
  console.error('Failed to read .env file', e)
  process.exit(1)
}

// ── S3 Client ────────────────────────────────────────────────────────────────
const s3 = new S3Client({
  endpoint: env.SUPABASE_STORAGE_ENDPOINT,
  region: env.SUPABASE_STORAGE_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: env.SUPABASE_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.SUPABASE_STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

const BUCKET = env.SUPABASE_STORAGE_BUCKET
const DB_URI = env.DATABASE_URI

// ── Category image definitions ────────────────────────────────────────────────
// Each category gets a carefully chosen Unsplash image that represents it well
const CATEGORY_IMAGES = [
  {
    code: 'bumpers',
    name: 'Bumpers & Body Kits',
    filename: 'cat-bumpers.jpg',
    url: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Car front bumper body kit',
  },
  {
    code: 'mirrors',
    name: 'Side Mirrors & Covers',
    filename: 'cat-mirrors.jpg',
    url: 'https://images.unsplash.com/photo-1565799557186-47a8d4e3e7a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Carbon fiber side mirror covers',
  },
  {
    code: 'lighting',
    name: 'Lighting Upgrades',
    filename: 'cat-lighting.jpg',
    url: 'https://images.unsplash.com/photo-1669658249874-c02a8ffdc7a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Car LED ambient lighting interior',
  },
  {
    code: 'spoilers',
    name: 'Spoilers & Wings',
    filename: 'cat-spoilers.jpg',
    url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Car rear spoiler wing',
  },
  {
    code: 'wheels',
    name: 'Custom Wheels',
    filename: 'cat-wheels.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Custom sport alloy wheels rims',
  },
  {
    code: 'interior',
    name: 'Interior Upgrades',
    filename: 'cat-interior.jpg',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Premium car interior steering wheel',
  },
  {
    code: 'body',
    name: 'Body Accents',
    filename: 'cat-body.jpg',
    url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    alt: 'Car body styling accents',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(destPath)
    const request = protocol.get(url, { headers: { 'User-Agent': 'HakaiMotives/1.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        fs.unlink(destPath, () => {})
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject)
      }
      if (response.statusCode !== 200) {
        file.close()
        fs.unlink(destPath, () => {})
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`))
      }
      response.pipe(file)
      file.on('finish', () => file.close(resolve))
    })
    request.on('error', (err) => {
      fs.unlink(destPath, () => {})
      reject(err)
    })
  })
}

async function uploadToS3(localPath, s3Key, contentType = 'image/jpeg') {
  const fileBuffer = fs.readFileSync(localPath)
  const fileSize = fs.statSync(localPath).size

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: contentType,
      ContentLength: fileSize,
    })
  )

  return fileSize
}

function getS3Url(key) {
  // Payload CMS S3 plugin serves media via /api/media/file/<key>
  // The public URL depends on bucket visibility. Since it's private Supabase,
  // Payload proxies it via /api/media/file/<filename>
  return `/api/media/file/${key}`
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Category Image Seeder - Hakai Motives\n')

  // Connect to MongoDB
  console.log('📦 Connecting to MongoDB Atlas...')
  await mongoose.connect(DB_URI)
  const db = mongoose.connection.db
  console.log('✅ Connected to MongoDB\n')

  const tmpDir = path.join(__dirname, '.tmp-cat-images')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  const results = []

  for (const cat of CATEGORY_IMAGES) {
    console.log(`\n── Processing: ${cat.name} (${cat.code}) ──`)
    const localPath = path.join(tmpDir, cat.filename)
    const s3Key = `media/${cat.filename}`

    // Step 1: Download the image
    console.log(`  ⬇️  Downloading from Unsplash...`)
    try {
      await downloadFile(cat.url, localPath)
      const sizeMB = (fs.statSync(localPath).size / 1024 / 1024).toFixed(2)
      console.log(`  ✅ Downloaded (${sizeMB} MB)`)
    } catch (err) {
      console.error(`  ❌ Download failed: ${err.message}`)
      // Try fallback URL
      const fallbackUrl = cat.url.replace('&q=80', '').replace('w=800', 'w=600')
      try {
        console.log(`  🔄 Trying fallback URL...`)
        await downloadFile(fallbackUrl, localPath)
        console.log(`  ✅ Fallback download successful`)
      } catch (err2) {
        console.error(`  ❌ Both downloads failed, skipping: ${err2.message}`)
        continue
      }
    }

    const fileSize = fs.statSync(localPath).size

    // Step 2: Upload to Supabase S3
    console.log(`  ☁️  Uploading to Supabase S3 bucket (${BUCKET})...`)
    try {
      await uploadToS3(localPath, s3Key)
      console.log(`  ✅ Uploaded → s3://${BUCKET}/${s3Key}`)
    } catch (err) {
      console.error(`  ❌ S3 upload failed: ${err.message}`)
      continue
    }

    // Step 3: Create/update media document in MongoDB
    console.log(`  📄 Creating media document in MongoDB...`)
    let mediaId

    // Check if media document already exists for this filename
    const existingMedia = await db.collection('media').findOne({ filename: cat.filename })
    if (existingMedia) {
      console.log(`  ♻️  Media document already exists, updating...`)
      await db.collection('media').updateOne(
        { _id: existingMedia._id },
        {
          $set: {
            alt: cat.alt,
            url: getS3Url(cat.filename),
            filename: cat.filename,
            mimeType: 'image/jpeg',
            filesize: fileSize,
            updatedAt: new Date(),
          },
        }
      )
      mediaId = existingMedia._id
    } else {
      const mediaResult = await db.collection('media').insertOne({
        alt: cat.alt,
        url: getS3Url(cat.filename),
        filename: cat.filename,
        mimeType: 'image/jpeg',
        filesize: fileSize,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mediaId = mediaResult.insertedId
    }
    console.log(`  ✅ Media document → ID: ${mediaId}`)

    // Step 4: Link media to category
    console.log(`  🔗 Linking image to category "${cat.code}"...`)
    const updateResult = await db.collection('categories').updateOne(
      { code: cat.code },
      {
        $set: {
          image: mediaId,
          updatedAt: new Date(),
        },
      }
    )

    if (updateResult.matchedCount === 0) {
      console.error(`  ❌ No category found with code "${cat.code}"`)
    } else if (updateResult.modifiedCount > 0) {
      console.log(`  ✅ Category "${cat.code}" updated with image`)
    } else {
      console.log(`  ℹ️  Category "${cat.code}" image was already set (no change)`)
    }

    results.push({ code: cat.code, name: cat.name, mediaId, s3Key })
  }

  // Cleanup tmp files
  console.log('\n🧹 Cleaning up temp files...')
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    console.log('✅ Temp files removed')
  } catch (e) {
    console.warn('⚠️  Could not clean temp files:', e.message)
  }

  // Summary
  console.log('\n\n╔══════════════════════════════════════════════╗')
  console.log('║         CATEGORY IMAGE SEEDING COMPLETE         ║')
  console.log('╚══════════════════════════════════════════════╝')
  console.log(`\n✅ ${results.length}/${CATEGORY_IMAGES.length} categories updated with images:\n`)
  results.forEach((r) => {
    console.log(`  • ${r.name.padEnd(28)} → ${r.s3Key}`)
  })

  await mongoose.disconnect()
  console.log('\n📦 Disconnected from MongoDB. Done!\n')
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
