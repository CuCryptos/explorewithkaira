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

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function decodeBasicEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtml(value) {
  if (!value) return '';
  return normalizeWhitespace(decodeBasicEntities(String(value).replace(/<[^>]+>/g, ' ')));
}

function isUsableImageUrl(value) {
  if (!value) return false;
  if (value.includes('404')) return false;
  return !value.includes('wp-content') && !value.includes('/wp/');
}

function normalizeSeo(rawSeo, featuredImage) {
  const metaTitle = rawSeo?.meta_title ?? rawSeo?.metaTitle ?? '';
  const focusKeyword = rawSeo?.focus_keyword ?? rawSeo?.focusKeyword ?? '';
  const metaDescription = stripHtml(rawSeo?.meta_description ?? rawSeo?.metaDescription ?? '');
  const existingOgImage = rawSeo?.og_image ?? rawSeo?.ogImage ?? '';
  const ogImage = isUsableImageUrl(existingOgImage)
    ? existingOgImage
    : isUsableImageUrl(featuredImage)
      ? featuredImage
      : '';

  return {
    meta_title: metaTitle,
    meta_description: metaDescription,
    focus_keyword: focusKeyword,
    og_image: ogImage,
  };
}

const siteId = process.env.SITE_ID;
const dryRun = process.argv.includes('--dry-run');

const { data: posts, error } = await supabase
  .from('posts')
  .select('id, slug, excerpt, featured_image, seo')
  .eq('site_id', siteId)
  .eq('status', 'published');

if (error) {
  throw new Error(`Failed to load posts: ${error.message}`);
}

const updates = [];

for (const post of posts) {
  const nextExcerpt = stripHtml(post.excerpt);
  const nextSeo = normalizeSeo(post.seo ?? {}, post.featured_image);

  const currentExcerpt = post.excerpt ?? '';
  const currentSeo = JSON.stringify(post.seo ?? {});
  const normalizedSeo = JSON.stringify(nextSeo);

  if (currentExcerpt !== nextExcerpt || currentSeo !== normalizedSeo) {
    updates.push({
      id: post.id,
      slug: post.slug,
      excerpt: nextExcerpt,
      seo: nextSeo,
    });
  }
}

console.log(
  JSON.stringify(
    {
      dryRun,
      scanned: posts.length,
      updates: updates.length,
      sample: updates.slice(0, 20).map((entry) => entry.slug),
    },
    null,
    2,
  ),
);

if (!dryRun) {
  for (const update of updates) {
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        excerpt: update.excerpt,
        seo: update.seo,
      })
      .eq('id', update.id);

    if (updateError) {
      throw new Error(`Failed to update ${update.slug}: ${updateError.message}`);
    }
  }

  console.log(`Updated ${updates.length} posts.`);
}
