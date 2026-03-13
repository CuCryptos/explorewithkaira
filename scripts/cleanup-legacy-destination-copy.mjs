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
    slug: 'ultimate-luxury-guide-maui-kaira',
    excerpt:
      'An honest Maui luxury guide to the resorts, drives, beaches, and splurges that are actually worth your time on the island.',
    seo: {
      meta_description:
        'An honest Maui luxury guide to the resorts, drives, beaches, and splurges that are actually worth your time on the island.',
    },
  },
  {
    slug: 'real-white-lotus-hotels-kaira',
    excerpt:
      'The White Lotus hotels are real, but staying at them now is a different experience than the fantasy the show sells.',
    seo: {
      meta_description:
        'The White Lotus hotels are real, but staying at them now is a different experience than the fantasy the show sells.',
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
      excerpt: rewrite.excerpt,
      seo: mergedSeo,
    })
    .eq('id', existing.id);

  if (updateError) {
    throw new Error(`Failed to update ${rewrite.slug}: ${updateError.message}`);
  }

  console.log(`updated ${rewrite.slug}`);
}
