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
    slug: 'paris-luxury-hotels-honest-review',
    title: 'Best Luxury Hotels in Paris: Honest Reviews of Where to Stay',
    excerpt:
      'An honest guide to the best luxury hotels in Paris, including where to stay, which properties are worth the money, and what the glossy photos leave out.',
    seo: {
      meta_title: 'Best Luxury Hotels in Paris: Honest Reviews of Where to Stay',
      meta_description:
        'An honest guide to the best luxury hotels in Paris, including where to stay, which properties are worth the money, and what the glossy photos leave out.',
      focus_keyword: 'best luxury hotels in paris',
    },
  },
  {
    slug: 'paris-weekend-guide',
    title: '3 Days in Paris: A Luxury Weekend Itinerary',
    excerpt:
      'A practical 3-day Paris itinerary with the right neighborhoods, long lunches, beautiful hotels, and the version of Paris worth returning for.',
    seo: {
      meta_title: '3 Days in Paris: A Luxury Weekend Itinerary',
      meta_description:
        'A practical 3-day Paris itinerary with the right neighborhoods, long lunches, beautiful hotels, and the version of Paris worth returning for.',
      focus_keyword: '3 days in paris',
    },
  },
  {
    slug: 'paris-hidden-gems',
    title: 'Paris Hidden Gems: Secret Places Worth Finding',
    excerpt:
      'A guide to Paris hidden gems beyond the postcard version, with quieter streets, rooms, tables, and corners that still feel discovered.',
    seo: {
      meta_title: 'Paris Hidden Gems: Secret Places Worth Finding',
      meta_description:
        'A guide to Paris hidden gems beyond the postcard version, with quieter streets, rooms, tables, and corners that still feel discovered.',
      focus_keyword: 'paris hidden gems',
    },
  },
  {
    slug: 'ritz-paris-review',
    title: 'Ritz Paris Review: Is It Still Worth It?',
    excerpt:
      'An honest Ritz Paris review covering what still feels iconic, what feels tired, and whether the price is justified now.',
    seo: {
      meta_title: 'Ritz Paris Review: Is It Still Worth It?',
      meta_description:
        'An honest Ritz Paris review covering what still feels iconic, what feels tired, and whether the price is justified now.',
      focus_keyword: 'ritz paris review',
    },
  },
  {
    slug: 'secret-paris-hotel-suites-unlisted-rooms',
    title: 'The Best Hotel Suites in Paris and How to Book Them',
    excerpt:
      'A guide to the Paris hotel suites worth asking for, how to book better rooms, and why the best options are often not the ones hotels lead with online.',
    seo: {
      meta_title: 'The Best Hotel Suites in Paris and How to Book Them',
      meta_description:
        'A guide to the Paris hotel suites worth asking for, how to book better rooms, and why the best options are often not the ones hotels lead with online.',
      focus_keyword: 'best hotel suites in paris',
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
