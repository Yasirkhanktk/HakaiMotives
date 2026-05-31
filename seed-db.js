import fs from 'fs'
import mongoose from 'mongoose'

// Parse .env file manually
const env = {}
try {
  const envFile = fs.readFileSync('.env', 'utf8')
  envFile.split('\n').forEach(line => {
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
}

const databaseUri = env.DATABASE_URI

async function seed() {
  if (!databaseUri) {
    console.error('DATABASE_URI is missing in .env')
    return
  }

  try {
    console.log('Connecting to MongoDB Atlas...')
    await mongoose.connect(databaseUri)
    console.log('Connected!')

    const db = mongoose.connection.db

    // 1. Clean collections
    console.log('Clearing existing collections...')
    await db.collection('brands').deleteMany({})
    await db.collection('categories').deleteMany({})
    await db.collection('media').deleteMany({})
    await db.collection('products').deleteMany({})
    await db.collection('banners').deleteMany({})
    await db.collection('projects').deleteMany({})
    await db.collection('testimonials').deleteMany({})

    // 2. Seed Brand
    console.log('Seeding brand...')
    const brandResult = await db.collection('brands').insertOne({
      name: 'HAKAI MOTIVES',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    const brandId = brandResult.insertedId

    // 3. Seed Categories
    console.log('Seeding categories...')
    const categoriesData = [
      { name: 'Bumpers & Body Kits', code: 'bumpers', desc: 'Aggressive splitters, lips, and diffusers.' },
      { name: 'Side Mirrors & Covers', code: 'mirrors', desc: 'Carbon fiber replacements and dynamic mirror visual upgrades.' },
      { name: 'Lighting Upgrades', code: 'lighting', desc: 'LED retrofits, dynamic indicators, and custom tail lights.' },
      { name: 'Spoilers & Wings', code: 'spoilers', desc: 'Sport trunks and high kick aerodynamic wings.' },
      { name: 'Custom Wheels', code: 'wheels', desc: 'Premium custom fit sports alloy rims.' },
      { name: 'Interior Upgrades', code: 'interior', desc: 'Steering wheels, premium trims, and custom ambient lighting.' },
      { name: 'Body Accents', code: 'body', desc: 'Aggressive extensions, grilles, and visual styling accents.' }
    ]

    const categoryMap = {}
    for (const cat of categoriesData) {
      const catResult = await db.collection('categories').insertOne({
        name: cat.name,
        code: cat.code,
        desc: cat.desc,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      categoryMap[cat.code] = catResult.insertedId
    }

    // 4. Seed Media placeholders for Products
    console.log('Seeding media documents...')
    const productsData = [
      {
        name: 'Front Bumper Lip',
        compatible: 'Toyota Corolla 2014-2021',
        price: 12500,
        originalPrice: 16000,
        rating: 4.8,
        reviews: 42,
        badge: 'BESTSELLER',
        image: 'https://images.unsplash.com/photo-1714860098789-67680153a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'bumpers',
        inventory: 12
      },
      {
        name: 'Rear Bumper Diffuser',
        compatible: 'Honda Civic 2016-2021',
        price: 14000,
        originalPrice: 18500,
        rating: 4.6,
        reviews: 28,
        badge: 'NEW',
        image: 'https://images.unsplash.com/photo-1565001151547-999ff6ccddd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'bumpers',
        inventory: 8
      },
      {
        name: 'Carbon Side Mirror Covers',
        compatible: 'Toyota Corolla / Honda Civic',
        price: 3500,
        originalPrice: 5000,
        rating: 4.7,
        reviews: 64,
        badge: 'HOT',
        image: 'https://images.unsplash.com/photo-1558556579-a8fef2bf1861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'mirrors',
        inventory: 20
      },
      {
        name: 'RGB Ambient Lighting Kit',
        compatible: 'Universal Fit',
        price: 2800,
        originalPrice: 4000,
        rating: 4.9,
        reviews: 112,
        badge: 'BESTSELLER',
        image: 'https://images.unsplash.com/photo-1720929633046-f171051f30ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'lighting',
        inventory: 15
      },
      {
        name: 'Trunk Lip Spoiler',
        compatible: 'Toyota Corolla 2017+',
        price: 8500,
        originalPrice: 11000,
        rating: 4.5,
        reviews: 37,
        badge: 'NEW',
        image: 'https://images.unsplash.com/photo-1777014586209-05ad0b7c5670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'spoilers',
        inventory: 5
      },
      {
        name: 'Sport Racing Rims (Set of 4)',
        compatible: 'Toyota Corolla / Honda Civic',
        price: 45000,
        originalPrice: 58000,
        rating: 4.8,
        reviews: 19,
        image: 'https://images.unsplash.com/photo-1668639235092-301730d1b72e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'wheels',
        inventory: 3
      },
      {
        name: 'Carbon Fiber Steering Wheel',
        compatible: 'Universal Fit (with adapter)',
        price: 18000,
        originalPrice: 24000,
        rating: 4.7,
        reviews: 31,
        badge: 'PREMIUM',
        image: 'https://images.unsplash.com/photo-1779263724552-a859e99e8678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'interior',
        inventory: 4
      },
      {
        name: 'Full Body Kit',
        compatible: 'Honda Civic 2022+',
        price: 35000,
        originalPrice: 45000,
        rating: 4.9,
        reviews: 14,
        badge: 'LIMITED',
        image: 'https://images.unsplash.com/photo-1771979623985-760ea16186d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=500',
        category: 'body',
        inventory: 2
      }
    ]

    for (const prod of productsData) {
      const mediaResult = await db.collection('media').insertOne({
        alt: prod.name,
        url: prod.image,
        filename: `${prod.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        mimeType: 'image/jpeg',
        filesize: 10240,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // 5. Seed Products
      console.log(`Seeding product: ${prod.name}`)
      await db.collection('products').insertOne({
        name: prod.name,
        brand: brandId,
        compatible: prod.compatible,
        price: prod.price,
        originalPrice: prod.originalPrice,
        rating: prod.rating,
        reviews: prod.reviews,
        badge: prod.badge,
        image: mediaResult.insertedId,
        category: categoryMap[prod.category],
        inventory: prod.inventory,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // 6. Seed Projects
    console.log('Seeding projects...')
    const projectsData = [
      {
        title: "Honda Civic 'Cyber Edition'",
        category: "HONDA CIVIC",
        image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d7f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
        description: "A complete visual overhaul featuring carbon fiber aerodynamics, precise neon accent lighting, and track-ready wheels designed for a stealth presence.",
        date: "May 2026",
        partsUsed: ["Carbon Side Mirror Covers", "Rear Bumper Diffuser", "RGB Ambient Lighting Kit", "Carbon Fiber Steering Wheel"],
        specs: {
          wheels: "18\" Matte Black Sport Rims",
          bodyKit: "Hakai V2 Front Lip & Rear Diffuser",
          interior: "Custom Alcantara & Carbon Steering",
          lighting: "Full Underglow & Multi-zone Ambient Kit",
        }
      },
      {
        title: "Toyota Corolla 'Stealth Shadow'",
        category: "TOYOTA COROLLA",
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
        description: "A deep black aesthetic accented by bright red accents. Optimized with visual body expansions and premium lighting setups.",
        date: "April 2026",
        partsUsed: ["Front Bumper Lip", "Trunk Lip Spoiler", "RGB Ambient Lighting Kit"],
        specs: {
          wheels: "18\" Gloss Black Sport Rims",
          bodyKit: "Hakai Front Splitter & Trunk Spoiler",
          lighting: "Integrated Footwell Ambient Setup",
        }
      }
    ]

    for (const proj of projectsData) {
      const mediaResult = await db.collection('media').insertOne({
        alt: proj.title,
        url: proj.image,
        filename: `${proj.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
        mimeType: 'image/jpeg',
        filesize: 15360,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await db.collection('projects').insertOne({
        title: proj.title,
        category: proj.category,
        image: mediaResult.insertedId,
        description: proj.description,
        date: proj.date,
        partsUsed: proj.partsUsed.map(partName => ({ part: partName })),
        wheels: proj.specs.wheels,
        bodyKit: proj.specs.bodyKit,
        interior: proj.specs.interior,
        lighting: proj.specs.lighting,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // 7. Seed website content settings global
    console.log('Seeding WebsiteContent settings global...')
    await db.collection('globals').insertOne({
      globalType: 'website-content',
      heroTitleLine1: 'UPGRADE YOUR RIDE WITH',
      heroTitleLine2Static: 'PREMIUM VISUAL',
      heroTypewriterWords: [
        { word: 'SPLITTERS' },
        { word: 'DIFFUSERS' },
        { word: 'SPOILERS' },
        { word: 'LIGHTS' }
      ],
      heroSubcopy: 'Uncompromising aesthetic performance parts designed in Pakistan. Discover bolt-on styling upgrades engineered to turn heads.',
      whatsappNumber: '923001234567',
      whatsappTemplate: 'Hello Hakai Motives, I would like to order: \n*{{items}}*\nTotal: *PKR {{total}}*\n\nMy details:\nName: {{name}}\nAddress: {{address}}\nPhone: {{phone}}',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // 8. Seed Testimonials
    console.log('Seeding Testimonials...')
    const testimonialsData = [
      {
        name: 'Saad Ahmed',
        carModel: 'Honda Civic X',
        location: 'Karachi',
        rating: 5,
        comment: 'The front splitter lip completely changed the visual presence of my car. Exceptional quality fitment, no adjustments needed.',
        partBought: 'Front Splitter Lip & Rear Diffuser',
        verified: true
      },
      {
        name: 'Hamza Khan',
        carModel: 'Toyota Corolla Altis',
        location: 'Lahore',
        rating: 5,
        comment: 'Fitted their Carbon mirror covers. Extremely glossy finish and absolute OEM style snap-on fit.',
        partBought: 'Carbon Side Mirror Covers',
        verified: true
      }
    ]

    await db.collection('testimonials').insertMany(testimonialsData.map(t => ({
      ...t,
      createdAt: new Date(),
      updatedAt: new Date()
    })))

    console.log('\n✅ Database successfully seeded with products, categories, projects, testimonials, and global content!')
    await mongoose.disconnect()
  } catch (err) {
    console.error('❌ Failed to seed database:', err)
  }
}

seed()
