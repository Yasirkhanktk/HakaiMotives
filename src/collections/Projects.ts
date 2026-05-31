import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Toyota Corolla', value: 'TOYOTA COROLLA' },
        { label: 'Honda Civic', value: 'HONDA CIVIC' },
        { label: 'Toyota Yaris', value: 'TOYOTA YARIS' },
        { label: 'Honda BR-V', value: 'HONDA BRV' },
      ],
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'date',
      type: 'text',
      required: true,
    },
    {
      name: 'partsUsed',
      type: 'array',
      fields: [
        {
          name: 'part',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'wheels',
      type: 'text',
    },
    {
      name: 'bodyKit',
      type: 'text',
    },
    {
      name: 'interior',
      type: 'text',
    },
    {
      name: 'lighting',
      type: 'text',
    },
  ],
}
