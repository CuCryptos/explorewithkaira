import type { Metadata } from 'next';
import type { Post, Category } from '@/types';
import { posts, categories } from '@/lib/supabase';
import { brandConfig, siteId, baseUrl } from '@/lib/brand';
import { KairaHomePage } from './components/KairaHomePage';

interface HomeSection {
  title: string;
  posts: Post[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export const metadata: Metadata = {
  openGraph: {
    title: `${brandConfig.siteName} | ${brandConfig.tagline}`,
    description: brandConfig.seoDefaults.metaDescription,
    url: baseUrl,
    siteName: brandConfig.siteName,
    images: [{ url: `${baseUrl}/images/og-default.jpg`, width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandConfig.siteName} | ${brandConfig.tagline}`,
    description: brandConfig.seoDefaults.metaDescription,
    images: [`${baseUrl}/images/og-default.jpg`],
  },
};

const POSTS_PER_SECTION = 3;

const HERO_SLUGS = [
  'marrakech-hidden-gems-beyond-souks',
  'tokyo-hidden-gems-secret-corners',
  'paris-hidden-gems',
  'the-brando-tetiaroa-honest-review',
  'the-city-that-keeps-its-doors-half-open-istanbuls-hidden-worlds-beyond-the-minarets',
];

const HOMEPAGE_CATEGORY_SLUGS = [
  'destinations',
  'hotel-reviews',
  'itineraries',
  'the-take',
  'living-well',
];

function hasValidImage(post: Post): boolean {
  return Boolean(
    post.featuredImage &&
    !post.featuredImage.includes('404') &&
    !post.featuredImage.includes('wp-content'),
  );
}

function buildSections(allPosts: Post[], allCategories: Category[]): {
  heroPost: Post;
  heroCategory: Category | undefined;
  sections: HomeSection[];
} {
  const categoryMap = new Map(allCategories.map((c) => [c.id, c]));
  const postsWithImages = allPosts.filter(hasValidImage);

  const heroPost =
    HERO_SLUGS.map((slug) => postsWithImages.find((p) => p.slug === slug)).find(Boolean) ||
    postsWithImages[0] ||
    allPosts[0];
  const heroCategory = categoryMap.get(heroPost.categoryId);
  const remaining = postsWithImages.filter((p) => p.id !== heroPost.id);

  const byCategory = new Map<string, Post[]>();
  for (const post of remaining) {
    const cat = categoryMap.get(post.categoryId);
    const key = cat?.id || 'uncategorized';
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(post);
  }

  const latestSection: HomeSection = {
    title: 'Latest Stories',
    posts: remaining.slice(0, POSTS_PER_SECTION),
  };

  const categorySections: HomeSection[] = [];
  const categoryBySlug = new Map(allCategories.map((c) => [c.slug, c]));

  for (const slug of HOMEPAGE_CATEGORY_SLUGS) {
    const cat = categoryBySlug.get(slug);
    if (!cat) continue;
    const catPosts = byCategory.get(cat.id);
    if (!catPosts || catPosts.length < 2) continue;
    categorySections.push({
      title: cat.name,
      posts: catPosts.slice(0, POSTS_PER_SECTION),
      viewAllHref: `/category/${cat.slug}`,
      viewAllLabel: `All ${cat.name}`,
    });
  }

  return { heroPost, heroCategory, sections: [latestSection, ...categorySections] };
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  await searchParams;
  const [allPosts, allCategories] = await Promise.all([
    posts.listPosts(siteId, { status: 'published' }),
    categories.listCategories(siteId),
  ]);

  const { heroPost, heroCategory, sections } = buildSections(allPosts, allCategories);

  const editorPickSlugs = [
    'the-brando-tetiaroa-honest-review',
    'marrakech-hidden-gems-beyond-souks',
    'oman-the-gulf-state-that-chose-silence-over-spectacle',
  ];
  const editorPicks = editorPickSlugs
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is Post => Boolean(p));

  return (
    <KairaHomePage
      categories={allCategories}
      heroPost={heroPost}
      sections={sections}
      editorPicks={editorPicks}
      heroCategory={heroCategory}
    />
  );
}
