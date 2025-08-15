// Remove the hardcoded templates array since we're now fetching from database
// export const templates = [...]; // Remove this

// Design options
export const designOptions = {
  colors: [
    { name: 'Classic', value: 'classic' },
    { name: 'Romantic', value: 'romantic' },
    { name: 'Modern', value: 'modern' },
    { name: 'Vintage', value: 'vintage' },
  ],
  fonts: [
    { name: 'Playfair Display', value: 'playfair' },
    { name: 'Montserrat', value: 'montserrat' },
    { name: 'Great Vibes', value: 'great-vibes' },
    { name: 'Open Sans', value: 'open-sans' },
  ]
};

// Tab types
export type TabType = 'design' | 'content' | 'settings';

// Default expanded sections
export const defaultExpandedSections = {
  templates: true,
  colors: true,
  typography: false,
  layout: false,
  couple: true,
  story: true,
  contact: true,
  moreInfo: true,
  weddingDetails: true,
  schedule: true,
  gallery: true
};