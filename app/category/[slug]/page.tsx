import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts, categories } from '@/lib/supabase';
import { brandConfig, siteId, baseUrl, navCategories } from '@/lib/brand';
import { KairaShell } from '@/app/components/KairaShell';
import { KairaStoryCard } from '@/app/components/KairaStoryCard';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const allCategories = await categories.listCategories(siteId);
  const category = allCategories.find((entry) => entry.slug === slug);
  if (!category) return {};

  const title = `${category.name} | ${brandConfig.siteName}`;
  const description =
    category.description ||
    `${category.name} — luxury travel stories and guides from ${brandConfig.siteName}.`;
  const url = `${baseUrl}/category/${slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

function hasValidImage(post: { featuredImage?: string }) {
  return Boolean(
    post.featuredImage &&
      !post.featuredImage.includes('404') &&
      !post.featuredImage.includes('wp-content'),
  );
}

function categoryDeck(name: string) {
  const key = name.toLowerCase();
  if (key.includes('hotel')) return 'Reviews with enough specificity to help you book well.';
  if (key.includes('itiner')) return 'Trip structure for readers who want their time to feel expensive in the right way.';
  if (key.includes('destination')) return 'Places worth returning to, not just photographing once.';
  return 'A tighter archive of stories, guides, and strong opinions.';
}

export async function generateStaticParams() {
  const allCategories = await categories.listCategories(siteId);
  return allCategories
    .filter((category) => category.name.toLowerCase() !== 'uncategorized')
    .map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const allCategories = await categories.listCategories(siteId);
  const category = allCategories.find((entry) => entry.slug === slug);
  if (!category) notFound();

  const categoryPosts = await posts.listPosts(siteId, {
    status: 'published',
    categoryId: category.id,
  });
  const postsWithImages = categoryPosts.filter(hasValidImage);
  const lead = postsWithImages[0];
  const rest = postsWithImages.slice(1);

  return (
    <KairaShell brandConfig={brandConfig} navCategories={navCategories}>
      <section className="border-b border-mugon-border/70 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.16),transparent_30%),linear-gradient(180deg,rgba(255,250,244,0.95),rgba(247,241,232,0.82))]">
        <div className="mx-auto max-w-[1180px] px-4 py-10 lg:px-6 lg:py-14">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">Category</p>
          <h1 className="mt-3 font-mugon-heading text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.95] text-mugon-text">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-mugon-muted">
            {category.description || categoryDeck(category.name)}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-10 lg:px-6 lg:py-14">
        {lead ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <KairaStoryCard post={lead} category={category} variant="feature" kicker="Lead story" />
            <div className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/75 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
              <div className="grid gap-6">
                {rest.map((post) => (
                  <KairaStoryCard key={post.id} post={post} category={category} variant="stacked" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="py-20 text-center text-mugon-muted">No posts in this category yet.</p>
        )}
      </section>
    </KairaShell>
  );
}
