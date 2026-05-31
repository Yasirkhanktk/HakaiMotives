import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address, city, items, total, paymentMethod } = body

    // 1. Server-side Validations
    if (!name || !email || !phone || !address || !city || !items || !total || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Please fill out all checkout details.' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Phone validation (Supporting both 03xxxxxxxxx and +92xxxxxxxxxx formats)
    const phoneRegex = /^((\+92)?(3\d{2}))\d{7}$|^03\d{9}$/
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return NextResponse.json({ success: false, error: 'Please enter a valid Pakistani phone number (e.g. 03XXXXXXXXX).' }, { status: 400 })
    }

    // Validate items exist and have stock
    const payload = await getPayload({ config: configPromise })
    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
      })

      if (!product) {
        return NextResponse.json({ success: false, error: `Product "${item.name}" not found.` }, { status: 400 })
      }

      if ((product.inventory || 0) < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for "${item.name}". Only ${product.inventory || 0} items remaining.`,
        }, { status: 400 })
      }
    }

    // Map cart items to the Orders collection schema items format
    const orderItems = items.map((item: any) => ({
      product: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    // Normalize paymentMethod casing to match Payload schema options ('COD' | 'easypaisa' | 'bank')
    const normalizedPaymentMethod = paymentMethod === 'EASYPAISA' 
      ? 'easypaisa' 
      : paymentMethod === 'BANK' 
        ? 'bank' 
        : paymentMethod;

    // Create the order inside Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: `${address}, ${city}`,
        customerCity: city,
        items: orderItems,
        total: total,
        paymentMethod: normalizedPaymentMethod,
        status: 'Pending',
      },
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err: any) {
    console.error('Error placing order:', err)
    return NextResponse.json({ success: false, error: err.message || 'Internal server error.' }, { status: 500 })
  }
}
