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
            const itemsHtml: string = items.map((item: { name: string; quantity: number; price: number; product: unknown }) =>
              `<li style="margin-bottom: 10px; display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 5px;">
                <span>${item.name} (Qty: ${item.quantity})</span>
                <strong>PKR ${(item.price * item.quantity).toLocaleString()}</strong>
              </li>`
            ).join('');

            const htmlMessage = `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px;">
                <div style="text-align: center; padding: 20px 0 10px 0; border-bottom: 2px solid #e8192c; margin-bottom: 20px;">
                  <div style="display: inline-flex; align-items: center; gap: 12px;">
                    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 6px rgba(232,25,44,0.5));">
                      <path d="M1.5 76.5L34.5 23.5H55.5L41 46.5L75 23.5H95.5L76.5 54L81.5 76.5H58.5L71.5 56.5L43 76.5H20.5L1.5 76.5Z" fill="#e8192c"/>
                    </svg>
                    <div>
                      <span style="font-family: Arial, sans-serif; color: #e8192c; font-weight: 700; font-size: 26px; letter-spacing: 4px;">HAKAI</span><span style="font-family: Arial, sans-serif; color: #111; font-weight: 600; font-size: 26px; letter-spacing: 4px;"> MOTIVES</span>
                    </div>
                  </div>
                </div>
                <h2 style="text-align: center; padding-bottom: 10px;">Order Confirmation</h2>
                <p>Hi <strong>${doc.customerName}</strong>,</p>
                <p>Thank you for placing an order with Hakai Motives! We have received your order and are currently processing it.</p>

                <h3 style="margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h3>
                <ul style="list-style-type: none; padding: 0;">
                  ${itemsHtml}
                </ul>

                <div style="margin-top: 20px; font-size: 18px; text-align: right;">
                  <strong>Total: <span style="color: #e8192c;">PKR ${doc.total.toLocaleString()}</span></strong>
                </div>

                <div style="margin-top: 30px; background: #f9f9f9; padding: 15px; border-left: 4px solid #e8192c;">
                  <h4 style="margin: 0 0 10px 0;">Delivery Information</h4>
                  <p style="margin: 0;"><strong>Address:</strong> ${doc.customerAddress}, ${doc.customerCity}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Phone:</strong> ${doc.customerPhone}</p>
                  <p style="margin: 5px 0 0 0;"><strong>Payment Method:</strong> ${doc.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>

                <p style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
                  If you have any questions, please contact us on WhatsApp.
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
