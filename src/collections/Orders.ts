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
