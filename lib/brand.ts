export { brandConfig, temperament } from '../brand.config';

export const siteId = process.env.SITE_ID!;

const DEFAULT_BASE_URL = 'https://explorewithkaira.com';
const DEFAULT_GA_MEASUREMENT_ID = 'G-N037N6XJT6';
const DEFAULT_GA4_PROPERTY_ID = '526351184';

export function normalizeBaseUrl(url?: string): string {
  if (!url) return DEFAULT_BASE_URL;
  return url.replace(/\/+$/, '') || DEFAULT_BASE_URL;
}

export const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL);
export const gscSiteUrl = `${baseUrl}/`;
export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;
export const ga4PropertyId = process.env.GA4_PROPERTY_ID || DEFAULT_GA4_PROPERTY_ID;

export const navCategories = [
  { label: 'Destinations', href: '/category/destinations' },
  { label: 'Hotel Reviews', href: '/category/hotel-reviews' },
  { label: 'Itineraries', href: '/category/itineraries' },
  { label: 'The Take', href: '/category/the-take' },
  { label: 'Living Well', href: '/category/living-well' },
];
