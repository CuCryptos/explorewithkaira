import Image from 'next/image';
import type { Category, Post } from '@/types';
import { KairaShell } from './KairaShell';
import { KairaStoryCard } from './KairaStoryCard';
import { KairaSchemaMarkup } from './KairaSchemaMarkup';
import { KairaSeoHead } from './KairaSeoHead';
import { brandConfig, navCategories } from '@/lib/brand';

interface KairaPostPageProps {
  post: Post;
  category?: Category;
  baseUrl: string;
  relatedPosts: Post[];
  otherCategories: Category[];
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function estimateReadTime(post: Post) {
  const words = stripHtml(post.content).split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 220));
}

function formatDate(date?: Date | null) {
  return date
    ? date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
}

function articleMood(category?: Category) {
  const key = category?.slug || '';
  if (key === 'hotel-reviews') return 'Paid stays. Honest opinions. Named properties.';
  if (key === 'itineraries') return 'Built to help you arrive well and spend your time better.';
  if (key === 'destinations') return 'The corners that make a place worth returning to.';
  return 'Luxury travel stories from someone who has actually been there.';
}

export function KairaPostPage({
  post,
  category,
  baseUrl,
  relatedPosts,
  otherCategories,
}: KairaPostPageProps) {
  const readTime = estimateReadTime(post);
  const formattedDate = formatDate(post.publishedAt);
  const visibleRelated = relatedPosts.filter((entry) => entry.featuredImage).slice(0, 3);
  const categoryName = category && category.name.toLowerCase() !== 'uncategorized' ? category.name : null;

  return (
    <>
      <KairaSeoHead brandConfig={brandConfig} post={post} page="post" baseUrl={baseUrl} />
      <KairaSchemaMarkup type="article" data={post} brandConfig={brandConfig} />
      <KairaShell brandConfig={brandConfig} navCategories={navCategories}>
        <article>
          <section className="relative overflow-hidden border-b border-mugon-border/70 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.16),transparent_30%),linear-gradient(180deg,rgba(255,250,244,0.95),rgba(247,241,232,0.82))]">
            <div className="mx-auto grid max-w-[1180px] gap-8 px-4 pb-10 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-6 lg:pb-14 lg:pt-10">
              <div className="flex flex-col justify-end">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#6c5a49]">
                  <a href="/" className="hover:text-mugon-primary">Home</a>
                  {categoryName && (
                    <>
                      <span>/</span>
                      <a href={`/category/${category?.slug}`} className="hover:text-mugon-primary">
                        {categoryName}
                      </a>
                    </>
                  )}
                </div>
                <div className="mb-4 flex flex-wrap gap-3 text-[0.72rem] uppercase tracking-[0.18em] text-[#6c5a49]">
                  {categoryName && (
                    <span className="rounded-full border border-mugon-border bg-mugon-surface px-3 py-1 text-mugon-primary">
                      {categoryName}
                    </span>
                  )}
                  {formattedDate && <span>{formattedDate}</span>}
                  <span>{readTime} min read</span>
                </div>
                <h1 className="max-w-4xl font-mugon-heading text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.95] text-[#1d1610]">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 max-w-2xl text-[1rem] leading-8 text-[#5f4e3e]">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-mugon-text px-4 py-2 text-mugon-background">
                    {articleMood(category)}
                  </span>
                  <a
                    href="/about"
                    className="rounded-full border border-mugon-border bg-mugon-surface px-4 py-2 text-[#1d1610] transition-colors hover:border-mugon-primary hover:text-mugon-primary"
                  >
                    Read the philosophy
                  </a>
                </div>
              </div>

              {post.featuredImage && (
                <div className="relative overflow-hidden rounded-[34px] border border-mugon-border/80 bg-mugon-surface shadow-[0_28px_90px_rgba(22,16,10,0.10)]">
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 640px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="mx-auto grid max-w-[1180px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6 lg:py-14">
            <div className="min-w-0">
              <div
                className="prose-mugon kaira-prose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[28px] border border-mugon-border/80 bg-mugon-surface p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mugon-muted">About this site</p>
                <h2 className="mt-3 font-mugon-heading text-2xl text-mugon-text">Kaira writes with skin in the game.</h2>
                <p className="mt-3 text-sm leading-7 text-mugon-muted">
                  No sponsors, no comped stays, and no affiliate rankings dressed up as editorial authority.
                  If a hotel is praised here, it had to earn it.
                </p>
              </div>

              <div className="rounded-[28px] border border-mugon-border/80 bg-[#1d1610] p-6 text-[#f6efe2] shadow-[0_18px_50px_rgba(22,16,10,0.10)]">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d8c4a4]">Keep reading</p>
                <div className="mt-4 flex flex-col gap-3 text-sm leading-6">
                  {category && (
                    <a href={`/category/${category.slug}`} className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/6">
                      More from {category.name}
                    </a>
                  )}
                  <a href="/category/hotel-reviews" className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/6">
                    Honest hotel reviews
                  </a>
                  <a href="/category/itineraries" className="rounded-2xl border border-white/10 px-4 py-3 hover:bg-white/6">
                    Weekend itineraries
                  </a>
                </div>
              </div>
            </aside>
          </section>

          <section className="mx-auto max-w-[1180px] px-4 pb-10 lg:px-6 lg:pb-14">
            <div className="rounded-[34px] border border-mugon-border/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(251,245,236,0.8))] p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)] lg:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mugon-muted">Worth reading next</p>
                  <h2 className="mt-2 font-mugon-heading text-[clamp(2rem,4vw,3rem)] leading-[1] text-mugon-text">
                    Don’t drop out after one good story.
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                {visibleRelated[0] && (
                  <KairaStoryCard
                    post={visibleRelated[0]}
                    category={category}
                    variant="feature"
                    kicker="Next read"
                  />
                )}
                <div className="rounded-[28px] border border-mugon-border/70 bg-mugon-surface/80 p-6">
                  <div className="grid gap-5">
                    {visibleRelated.slice(1).map((related) => (
                      <KairaStoryCard
                        key={related.id}
                        post={related}
                        category={otherCategories.find((entry) => entry.id === related.categoryId) || category}
                        variant="stacked"
                      />
                    ))}
                    <div className="rounded-[22px] border border-mugon-border bg-mugon-background p-5">
                      <p className="font-mugon-heading text-xl text-mugon-text">About Kaira</p>
                      <p className="mt-2 text-sm leading-7 text-mugon-muted">
                        Explore With Kaira is built for readers who want the atmosphere of a luxury travel magazine without the emptiness of sponsored copy.
                      </p>
                      <a href="/about" className="mt-4 inline-flex text-sm text-mugon-primary hover:underline">
                        Read the philosophy
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </article>
      </KairaShell>
    </>
  );
}
