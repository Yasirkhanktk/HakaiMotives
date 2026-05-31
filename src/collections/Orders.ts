import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'customerName',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true, // Anonymous checkout allowed
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const items = doc.items || [];
          for (const item of items) {
            if (item.product) {
              const productId = typeof item.product === 'object' ? item.product.id : item.product;
              try {
                // Fetch the product using Payload Local API
                const product = await req.payload.findByID({
                  collection: 'products',
                  id: productId,
                });

                // Decrement inventory
                const newInventory = Math.max(0, (product.inventory || 0) - (item.quantity || 0));
                
                await req.payload.update({
                  collection: 'products',
                  id: productId,
                  data: {
                    inventory: newInventory,
                  },
                });
              } catch (err) {
                req.payload.logger.error(`Failed to update inventory for product ${productId}: ${err}`);
              }
            }
          }

          // Send confirmation email
          try {
            // Determine absolute site URL dynamically for email client images
            const host = req.headers?.get('host') || 'hakaimotives.com';
            const protocol = host.includes('localhost') ? 'http' : 'https';
            const siteUrl = `${protocol}://${host}`;

            const itemsHtml: string = items.map((item: { name: string; quantity: number; price: number; product: unknown }) =>
              `<tr style="border-bottom: 1px solid #f4f4f4;">
                <td style="padding: 12px 0; font-size: 14px; font-weight: bold; color: #333; text-align: left;">${item.name}</td>
                <td style="padding: 12px 0; font-size: 14px; color: #666; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 0; font-size: 14px; color: #666; text-align: right;">PKR ${item.price.toLocaleString()}</td>
                <td style="padding: 12px 0; font-size: 14px; font-weight: bold; color: #e8192c; text-align: right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
              </tr>`
            ).join('');

            const htmlMessage = `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px;">
                <div style="text-align: center; padding: 15px 0; border-bottom: 2px solid #e8192c; margin-bottom: 20px;">
                  <img src="${siteUrl}/api/media/file/logo.png" alt="Hakai Motives Logo" width="80" height="80" style="display: block; margin: 0 auto 10px auto; border-radius: 8px;" />
                  <div style="font-family: Arial, sans-serif; color: #e8192c; font-weight: 700; font-size: 26px; letter-spacing: 4px; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; justify-content: center;">
                    HAKAI <span style="color: #111111; font-weight: 600;">MOTIVES</span>
                  </div>
                </div>
                
                <h2 style="text-align: center; padding-bottom: 5px; margin-top: 0; color: #111;">Order Confirmation</h2>
                <p>Hi <strong>${doc.customerName}</strong>,</p>
                <p>Thank you for placing an order with Hakai Motives! We have received your order and are currently processing it.</p>

                <h3 style="margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 8px; color: #111; font-size: 16px;">Order Details</h3>
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <thead>
                    <tr style="border-bottom: 2px solid #eee; text-align: left;">
                      <th style="padding: 10px 0; font-size: 13px; color: #666; text-align: left;">Item</th>
                      <th style="padding: 10px 0; font-size: 13px; color: #666; text-align: center; width: 60px;">Qty</th>
                      <th style="padding: 10px 0; font-size: 13px; color: #666; text-align: right; width: 100px;">Price</th>
                      <th style="padding: 10px 0; font-size: 13px; color: #666; text-align: right; width: 110px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <div style="margin-top: 20px; font-size: 18px; text-align: right; border-top: 1px solid #eee; padding-top: 15px;">
                  <strong>Grand Total: <span style="color: #e8192c;">PKR ${doc.total.toLocaleString()}</span></strong>
                </div>

                <div style="margin-top: 30px; background: #f9f9f9; padding: 15px; border-left: 4px solid #e8192c; border-radius: 0 4px 4px 0;">
                  <h4 style="margin: 0 0 10px 0; color: #111; font-size: 15px;">Delivery Information</h4>
                  <p style="margin: 0; font-size: 14px;"><strong>Address:</strong> ${doc.customerAddress}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Phone:</strong> ${doc.customerPhone}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Payment Method:</strong> ${doc.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>

                <div style="margin-top: 35px; border-top: 1px solid #eee; padding-top: 20px; font-size: 13px; color: #666;">
                  <h4 style="margin: 0 0 10px 0; color: #111; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Contact Details</h4>
                  <p style="margin: 5px 0;"><strong>WhatsApp:</strong> <a href="https://wa.me/923490090074" style="color: #25D366; text-decoration: none; font-weight: bold;">+92 349 0090074</a></p>
                  <p style="margin: 5px 0;"><strong>Instagram:</strong> <a href="https://www.instagram.com" style="color: #e8192c; text-decoration: none;">@HakaiMotives</a></p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:info@hakaimotives.com" style="color: #e8192c; text-decoration: none;">info@hakaimotives.com</a></p>
                  <p style="margin: 5px 0;"><strong>Location:</strong> Pakistan — Nationwide Delivery</p>
                </div>

                <p style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px dashed #eee; padding-top: 15px; margin-bottom: 0;">
                  Thank you for shopping with Hakai Motives!
                </p>
              </div>
            `;

            req.payload.logger.info(`Attempting to send order confirmation email to ${doc.customerEmail}...`);
            await req.payload.sendEmail({
              to: doc.customerEmail,
              subject: 'Your Hakai Motives Order Confirmation',
              html: htmlMessage,
            });
            req.payload.logger.info(`Order confirmation email sent to ${doc.customerEmail}`);
          } catch (err) {
            req.payload.logger.error(`Failed to send order confirmation email: ${err}`);
          }
        }
      }
    ]
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'customerAddress',
      type: 'text',
      required: true,
    },
    {
      name: 'customerCity',
      type: 'text',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Pending',
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Shipped', value: 'Shipped' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Cash on Delivery', value: 'COD' },
        { label: 'Easypaisa / JazzCash', value: 'easypaisa' },
        { label: 'Bank Transfer', value: 'bank' },
      ],
    },
  ],
}
