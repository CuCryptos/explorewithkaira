import type { BrandConfig, Temperament } from '@/types';

export const temperament: Temperament = 'ikki';

export const brandConfig: BrandConfig = {
  siteName: 'Explore With Kaira',
  tagline: 'Luxury Travel & Lifestyle',
  logo: '/images/logo-explorewithkaira.png',
  colors: { primary: '#c9a84c', secondary: '#1a1510', accent: '#d4b875' },
  fonts: { heading: 'Playfair Display', body: 'Inter' },
  voiceDescription: 'Luxury travel storyteller, honest, sensory, first-person lived experience',
  socialLinks: {},
  seoDefaults: {
    titleTemplate: '%s | Explore With Kaira',
    metaDescription: 'Luxury travel stories, honest hotel reviews, and insider guides to the world\'s most extraordinary places.',
    ogImage: '/images/og-default.jpg',
  },
};
