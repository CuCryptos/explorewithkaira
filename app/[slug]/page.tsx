import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts, categories } from '@/lib/supabase';
import { siteId, baseUrl } from '@/lib/brand';
import { KairaPostPage } from '../components/KairaPostPage';

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

function hasValidImage(post: { featuredImage?: string }): boolean {
  return Boolean(
    post.featuredImage &&
    !post.featuredImage.includes('404') &&
    !post.featuredImage.includes('wp-content'),
  );
}

export async function generateStaticParams() {
  const entries = await posts.getPostsBySitemap(siteId);
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await posts.getPostBySlug(siteId, slug);
    return { title: post.seo.metaTitle || post.title };
  } catch {
    return {};
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  let post;
  try { post = await posts.getPostBySlug(siteId, slug); } catch { notFound(); }
  const [allCategories, sameCategoryPosts, recentPosts] = await Promise.all([
    categories.listCategories(siteId),
    posts.listPosts(siteId, { status: 'published', categoryId: post.categoryId }),
    posts.listPosts(siteId, { status: 'published', limit: 60 }),
  ]);
  const category = allCategories.find((c) => c.id === post.categoryId);

  const prioritizedRelated = sameCategoryPosts.filter(
    (p) => p.id !== post.id && p.categoryId === post.categoryId && hasValidImage(p),
  );
  const prioritizedIds = new Set(prioritizedRelated.map((p) => p.id));
  const fallbackRelated = recentPosts.filter(
    (p) =>
      p.id !== post.id &&
      p.categoryId !== post.categoryId &&
      hasValidImage(p) &&
      !prioritizedIds.has(p.id),
  );
  const relatedPosts = [...prioritizedRelated, ...fallbackRelated].slice(0, 3);

  const otherCategories = allCategories.filter(
    (c) => c.id !== post.categoryId && c.name.toLowerCase() !== 'uncategorized',
  );

  return (
    <KairaPostPage
      post={post}
      category={category}
      baseUrl={baseUrl}
      relatedPosts={relatedPosts}
      otherCategories={otherCategories}
    />
  );
}
