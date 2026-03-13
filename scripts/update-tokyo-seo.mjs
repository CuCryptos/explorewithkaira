import { createClient } from '@supabase/supabase-js';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SITE_ID',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const siteId = process.env.SITE_ID;

const rewrites = [
  {
    slug: 'tokyo-luxury-hotels-aman-park-hyatt',
    title: 'Best Luxury Hotels in Tokyo: Honest Reviews and Where to Stay',
    excerpt:
      'An honest guide to Tokyo’s best luxury hotels, including where to stay, what each neighborhood feels like, and which hotels justify the price.',
    seo: {
      meta_title: 'Best Luxury Hotels in Tokyo: Honest Reviews and Where to Stay',
      meta_description:
        'An honest guide to Tokyo’s best luxury hotels, including where to stay, what each neighborhood feels like, and which hotels justify the price.',
      focus_keyword: 'best luxury hotels in tokyo',
    },
  },
  {
    slug: 'tokyo-weekend-guide-three-days',
    title: '3 Days in Tokyo: A Luxury Weekend Itinerary',
    excerpt:
      'A 3-day Tokyo itinerary built around neighborhoods, rituals, restaurants, and hotels that make the city feel unforgettable.',
    seo: {
      meta_title: '3 Days in Tokyo: A Luxury Weekend Itinerary',
      meta_description:
        'A 3-day Tokyo itinerary built around neighborhoods, rituals, restaurants, and hotels that make the city feel unforgettable.',
      focus_keyword: '3 days in tokyo',
    },
  },
  {
    slug: 'tokyo-hidden-gems-secret-corners',
    title: 'Tokyo Hidden Gems: Quiet Corners Worth Finding',
    excerpt:
      'A guide to Tokyo hidden gems with quieter streets, tucked-away bars, thoughtful shops, and the corners of the city that still feel discovered.',
    seo: {
      meta_title: 'Tokyo Hidden Gems: Quiet Corners Worth Finding',
      meta_description:
        'A guide to Tokyo hidden gems with quieter streets, tucked-away bars, thoughtful shops, and the corners of the city that still feel discovered.',
      focus_keyword: 'tokyo hidden gems',
    },
  },
  {
    slug: 'aman-tokyo-honest-review',
    title: 'Aman Tokyo Review: Is It Worth It?',
    excerpt:
      'An honest Aman Tokyo review covering what the hotel gets right, where the money goes, and whether it still deserves its reputation.',
    seo: {
      meta_title: 'Aman Tokyo Review: Is It Worth It?',
      meta_description:
        'An honest Aman Tokyo review covering what the hotel gets right, where the money goes, and whether it still deserves its reputation.',
      focus_keyword: 'aman tokyo review',
    },
  },
];

for (const rewrite of rewrites) {
  const { data: existing, error: fetchError } = await supabase
    .from('posts')
    .select('id, seo')
    .eq('site_id', siteId)
    .eq('slug', rewrite.slug)
    .single();

  if (fetchError) {
    throw new Error(`Failed to load ${rewrite.slug}: ${fetchError.message}`);
  }

  const mergedSeo = {
    ...(existing.seo ?? {}),
    ...rewrite.seo,
  };

  const { error: updateError } = await supabase
    .from('posts')
    .update({
      title: rewrite.title,
      excerpt: rewrite.excerpt,
      seo: mergedSeo,
    })
    .eq('id', existing.id);

  if (updateError) {
    throw new Error(`Failed to update ${rewrite.slug}: ${updateError.message}`);
  }

  console.log(`updated ${rewrite.slug}`);
}
