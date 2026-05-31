/**
 * seed-missing-category-images.mjs
 * Re-runs ONLY the two failed categories (mirrors + lighting) with fixed Unsplash URLs
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── Read .env ─────────────────────────────────────────────────────────────────
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

// ── Alternative images for the two 404 categories ─────────────────────────────
const MISSING_CATEGORIES = [
  {
    code: 'mirrors',
    name: 'Side Mirrors & Covers',
    filename: 'cat-mirrors.jpg',
    // Photo of car side mirror - verified working
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0729?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    alt: 'Carbon fiber side mirror covers for sports cars',
  },
  {
    code: 'lighting',
    name: 'Lighting Upgrades',
    filename: 'cat-lighting.jpg',
    // Car interior ambient LED lighting - verified working
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    alt: 'Car LED ambient interior lighting upgrades',
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
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: contentType,
    ContentLength: fileSize,
  }))
  return fileSize
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔄 Fixing missing category images...\n')

  await mongoose.connect(DB_URI)
  const db = mongoose.connection.db
  console.log('✅ Connected to MongoDB\n')

  const tmpDir = path.join(__dirname, '.tmp-cat-images')
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

  const results = []

  for (const cat of MISSING_CATEGORIES) {
    console.log(`── Processing: ${cat.name} (${cat.code}) ──`)
    const localPath = path.join(tmpDir, cat.filename)
    const s3Key = `media/${cat.filename}`

    // Try multiple fallback URLs for mirrors and lighting
    const urlsToTry = [cat.url]

    // Extra fallbacks specific to each category
    if (cat.code === 'mirrors') {
      urlsToTry.push(
        'https://images.unsplash.com/photo-1539705880098-1e3cf3700f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      )
    } else if (cat.code === 'lighting') {
      urlsToTry.push(
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
        'https://images.unsplash.com/photo-1609630875171-b1321377ee65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
      )
    }

    let downloaded = false
    for (const url of urlsToTry) {
      try {
        console.log(`  ⬇️  Trying: ${url.substring(0, 60)}...`)
        await downloadFile(url, localPath)
        const sizeMB = (fs.statSync(localPath).size / 1024 / 1024).toFixed(2)
        console.log(`  ✅ Downloaded (${sizeMB} MB)`)
        downloaded = true
        break
      } catch (err) {
        console.log(`  ⚠️  Failed (${err.message}), trying next...`)
      }
    }

    if (!downloaded) {
      console.error(`  ❌ All URLs failed for ${cat.code}, skipping`)
      continue
    }

    const fileSize = fs.statSync(localPath).size

    // Upload to S3
    console.log(`  ☁️  Uploading to S3...`)
    try {
      await uploadToS3(localPath, s3Key)
      console.log(`  ✅ Uploaded → s3://${BUCKET}/${s3Key}`)
    } catch (err) {
      console.error(`  ❌ S3 upload failed: ${err.message}`)
      continue
    }

    // Create/update media document
    let mediaId
    const existingMedia = await db.collection('media').findOne({ filename: cat.filename })
    if (existingMedia) {
      await db.collection('media').updateOne(
        { _id: existingMedia._id },
        { $set: { alt: cat.alt, url: `/api/media/file/${cat.filename}`, filename: cat.filename, mimeType: 'image/jpeg', filesize: fileSize, updatedAt: new Date() } }
      )
      mediaId = existingMedia._id
      console.log(`  ♻️  Media document updated → ID: ${mediaId}`)
    } else {
      const mediaResult = await db.collection('media').insertOne({
        alt: cat.alt,
        url: `/api/media/file/${cat.filename}`,
        filename: cat.filename,
        mimeType: 'image/jpeg',
        filesize: fileSize,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      mediaId = mediaResult.insertedId
      console.log(`  ✅ Media document created → ID: ${mediaId}`)
    }

    // Link to category
    const updateResult = await db.collection('categories').updateOne(
      { code: cat.code },
      { $set: { image: mediaId, updatedAt: new Date() } }
    )

    if (updateResult.matchedCount === 0) {
      console.error(`  ❌ No category found with code "${cat.code}"`)
    } else {
      console.log(`  ✅ Category "${cat.code}" updated with image\n`)
    }

    results.push(cat.code)
  }

  // Cleanup
  try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch (e) {}

  console.log(`\n✅ Completed: ${results.join(', ')} fixed`)

  await mongoose.disconnect()
  console.log('📦 Done!\n')
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
