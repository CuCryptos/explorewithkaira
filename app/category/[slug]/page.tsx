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

  const title = category.name;
  const description =
    category.description ||
    `${category.name} — luxury travel stories and guides from ${brandConfig.siteName}.`;
  const url = `${baseUrl}/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
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

function categoryLens(name: string) {
  const key = name.toLowerCase();
  if (key.includes('hotel')) {
    return {
      eyebrow: 'Archive focus',
      title: 'Named properties. Paid stays. Opinions that survive checkout.',
      bullets: [
        'Use this archive when you need booking-level clarity, not glossy atmosphere.',
        'Lead with hotel roundups, then drop into individual property reviews.',
        'Expect sharper calls on what is overpriced, overrated, or quietly worth it.',
      ],
    };
  }

  if (key.includes('itiner')) {
    return {
      eyebrow: 'Archive focus',
      title: 'Trip structure for readers who want their time to feel expensive in the right way.',
      bullets: [
        'Built for long weekends, short luxury trips, and destination-first planning.',
        'Use these when you know the city but need the order of operations.',
        'The point is rhythm, not checklist tourism.',
      ],
    };
  }

  if (key.includes('destination')) {
    return {
      eyebrow: 'Archive focus',
      title: 'The places, neighborhoods, and detours that make a destination worth repeating.',
      bullets: [
        'This archive works best when paired with the matching itinerary and hotel pages.',
        'Read for texture, neighborhoods, and the corners that survive the postcard version.',
        'Best used as the top of a destination cluster rather than a final booking page.',
      ],
    };
  }

  return {
    eyebrow: 'Archive focus',
    title: 'A tighter archive of stories, guides, and opinions with an actual point of view.',
    bullets: [
      'Use these pages to discover what deserves a stronger cluster next.',
      'The goal is a site that feels edited, not mechanically filled.',
      'Strong archives should create a next read, not a dead end.',
    ],
  };
}

function archiveStats(postCount: number, categoryName: string) {
  return [
    { label: 'Stories live', value: String(postCount).padStart(2, '0') },
    { label: 'Archive type', value: categoryName },
    { label: 'Best used for', value: categoryName.toLowerCase().includes('hotel') ? 'Booking intent' : 'Trip planning' },
  ];
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
  const highlights = postsWithImages.slice(1, 3);
  const archive = postsWithImages.slice(3, 11);
  const quickReads = postsWithImages.slice(11, 15);
  const relatedCategories = navCategories.filter((entry) => entry.href !== `/category/${category.slug}`);
  const lens = categoryLens(category.name);
  const stats = archiveStats(postsWithImages.length, category.name);

  return (
    <KairaShell brandConfig={brandConfig} navCategories={navCategories}>
      <section className="border-b border-mugon-border/70 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.16),transparent_30%),linear-gradient(180deg,rgba(255,250,244,0.95),rgba(247,241,232,0.82))]">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-6 lg:py-14">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">Category archive</p>
            <h1 className="mt-3 font-mugon-heading text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.95] text-mugon-text">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-mugon-muted">
              {category.description || categoryDeck(category.name)}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-mugon-border/80 bg-mugon-surface/80 px-5 py-4 shadow-[0_14px_40px_rgba(22,16,10,0.05)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-mugon-muted">{item.label}</p>
                  <p className="mt-2 font-mugon-heading text-[1.6rem] leading-none text-mugon-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-mugon-border/80 bg-[#1d1610] p-6 text-[#f6efe2] shadow-[0_22px_60px_rgba(22,16,10,0.12)] lg:p-7">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d8c4a4]">{lens.eyebrow}</p>
            <h2 className="mt-3 font-mugon-heading text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.02] text-white">
              {lens.title}
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[#efe0cb]">
              {lens.bullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedCategories.slice(0, 3).map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  className="rounded-full border border-white/12 px-4 py-2 text-[0.74rem] uppercase tracking-[0.16em] text-[#f6efe2] transition-colors hover:bg-white/7"
                >
                  {entry.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-10 lg:px-6 lg:py-14">
        {lead ? (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <KairaStoryCard post={lead} category={category} variant="feature" kicker="Start here" />
              <div className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/75 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
                <div className="mb-5">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">Then read</p>
                  <h2 className="mt-2 font-mugon-heading text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.02] text-mugon-text">
                    Build your way deeper into the archive.
                  </h2>
                </div>
                <div className="grid gap-6">
                  {highlights.map((post) => (
                    <KairaStoryCard key={post.id} post={post} category={category} variant="stacked" />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
              <aside className="space-y-6">
                <div className="rounded-[28px] border border-mugon-border/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.94),rgba(251,245,236,0.82))] p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
                  <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">How to use this archive</p>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-mugon-muted">
                    <p>Lead with the feature if you want the strongest entry point.</p>
                    <p>Use the archive grid for breadth, then jump sideways into the matching destination or itinerary cluster.</p>
                    <p>This should feel like an edited front, not a dumping ground of old posts.</p>
                  </div>
                </div>

                {quickReads.length > 0 && (
                  <div className="rounded-[28px] border border-mugon-border/80 bg-mugon-surface/80 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">Quick reads</p>
                    <div className="mt-4 grid gap-4">
                      {quickReads.map((post) => (
                        <KairaStoryCard key={post.id} post={post} category={category} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              <div className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/75 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)] lg:p-7">
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.22em] text-mugon-muted">Archive grid</p>
                    <h2 className="mt-2 font-mugon-heading text-[clamp(2rem,3vw,3rem)] leading-[1.02] text-mugon-text">
                      The rest of the category should still feel chosen.
                    </h2>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {archive.map((post, index) => (
                    <KairaStoryCard
                      key={post.id}
                      post={post}
                      category={category}
                      variant={index === 0 ? 'feature' : 'compact'}
                      kicker={index === 0 ? 'Editor’s note' : undefined}
                    />
                  ))}
                </div>
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
