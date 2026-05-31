import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
    },
    {
      name: 'compatible',
      type: 'text',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'reviews',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'badge',
      type: 'select',
      options: [
        { label: 'Bestseller', value: 'BESTSELLER' },
        { label: 'New', value: 'NEW' },
        { label: 'Hot', value: 'HOT' },
        { label: 'Premium', value: 'PREMIUM' },
        { label: 'Limited', value: 'LIMITED' },
      ],
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'inventory',
      type: 'number',
      required: true,
      defaultValue: 10,
    },
  ],
}
