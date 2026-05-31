import type { GlobalConfig } from 'payload'

export const WebsiteContent: GlobalConfig = {
  slug: 'website-content',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      defaultValue: '923001234567',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://www.instagram.com',
    },
    {
      name: 'footerText',
      type: 'text',
      required: true,
      defaultValue: 'Hakai Motives. Premium visual upgrades. Est. Pakistan.',
    },
    {
      name: 'heroTitleLine1',
      type: 'text',
      required: true,
      defaultValue: 'Redefine Your Ride.',
    },
    {
      name: 'heroTitleLine2Static',
      type: 'text',
      required: true,
      defaultValue: 'Upgrade Your',
    },
    {
      name: 'heroTypewriterWords',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
        },
      ],
      defaultValue: [
        { word: 'Bumpers' },
        { word: 'Spoilers' },
        { word: 'Rims' },
        { word: 'Body Kits' },
        { word: 'Carbon Fiber' },
        { word: 'Ambient Lights' },
      ],
    },
    {
      name: 'heroSubcopy',
      type: 'text',
      required: true,
      defaultValue: 'Premium modification parts — body kits, spoilers, ambient lighting & performance upgrades for Toyota, Honda & more.',
    },
  ],
}
