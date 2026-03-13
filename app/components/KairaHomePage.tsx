import Image from 'next/image';
import type { Category, Post } from '@/types';
import { KairaShell } from './KairaShell';
import { KairaStoryCard } from './KairaStoryCard';
import { brandConfig, navCategories } from '@/lib/brand';

interface HomeSection {
  title: string;
  posts: Post[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

interface KairaHomePageProps {
  heroPost: Post;
  heroCategory?: Category;
  sections: HomeSection[];
  categories: Category[];
  editorPicks: Post[];
}

function formatCategoryMap(categories: Category[]) {
  return new Map(categories.map((category) => [category.id, category]));
}

function storyTone(sectionTitle: string) {
  const key = sectionTitle.toLowerCase();
  if (key.includes('hotel')) return 'For readers who book with taste, not hype';
  if (key.includes('itiner')) return 'Stories with pace, structure, and a reason to go';
  if (key.includes('destination')) return 'The places worth returning to';
  if (key.includes('take')) return 'Sharper opinions on travel and luxury culture';
  return 'A few stories worth slowing down for';
}

export function KairaHomePage({
  heroPost,
  heroCategory,
  sections,
  categories,
  editorPicks,
}: KairaHomePageProps) {
  const categoryMap = formatCategoryMap(categories);
  const heroSupport = editorPicks.slice(0, 2);
  const latestStories = sections[0]?.posts.slice(0, 3) || [];
  const categorySections = sections.slice(1);

  return (
    <KairaShell brandConfig={brandConfig} navCategories={navCategories}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(122,91,58,0.14),transparent_26%),linear-gradient(180deg,rgba(255,250,244,0.96),rgba(247,241,232,0.92))]" />
        <div className="relative mx-auto max-w-[1180px] px-4 pb-12 pt-8 lg:px-6 lg:pb-16 lg:pt-10">
          <div className="mb-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-[#6c5a49]">
                <span className="rounded-full border border-mugon-border bg-mugon-surface px-3 py-1 text-mugon-primary">
                  Start here
                </span>
                <span>Honest hotel reviews and destination stories</span>
              </div>
              <h1 className="max-w-4xl font-mugon-heading text-[clamp(3rem,7vw,6rem)] leading-[0.94] text-[#1d1610]">
                Luxury travel for people who still want the truth.
              </h1>
              <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-[#5f4e3e]">
                Honest hotel reviews, destination stories, and itineraries for readers who want
                better recommendations, better hotels, and fewer brochure words.
              </p>
            </div>

            <div className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/80 p-6 shadow-[0_22px_70px_rgba(22,16,10,0.06)]">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#6c5a49]">
                Why readers come here
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="font-mugon-heading text-xl text-[#1d1610]">Hotels worth the money.</p>
                  <p className="mt-1 text-sm leading-6 text-[#5f4e3e]">
                    Reviews stay specific: what felt worth it, what disappointed, and what the glossy photos left out.
                  </p>
                </div>
                <div>
                  <p className="font-mugon-heading text-xl text-[#1d1610]">Places with texture, not just hype.</p>
                  <p className="mt-1 text-sm leading-6 text-[#5f4e3e]">
                    Stories are built around neighborhoods, hotel fit, and how a place actually feels once you arrive.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="overflow-hidden rounded-[34px] border border-mugon-border/80 bg-mugon-surface shadow-[0_28px_90px_rgba(22,16,10,0.10)]">
              <a href={`/${heroPost.slug}`} className="block">
                {heroPost.featuredImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={heroPost.featuredImage}
                      alt={heroPost.title}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#19120a]/80 via-[#19120a]/30 to-transparent" />
                  </div>
                )}
                <div className="space-y-4 p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-[#6c5a49]">
                    <span className="text-mugon-primary">Featured story</span>
                    {heroCategory && <span>{heroCategory.name}</span>}
                  </div>
                  <h2 className="max-w-3xl font-mugon-heading text-[clamp(2rem,4vw,3.6rem)] leading-[0.98] text-[#1d1610]">
                    {heroPost.title}
                  </h2>
                  {heroPost.excerpt && (
                    <p className="max-w-2xl text-sm leading-7 text-[#5f4e3e]">
                      {heroPost.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex rounded-full bg-mugon-text px-4 py-2 text-sm text-mugon-background">
                      Read the story
                    </span>
                    <span className="inline-flex rounded-full border border-mugon-border px-4 py-2 text-sm text-[#5f4e3e]">
                      No sponsors. No comped stays.
                    </span>
                  </div>
                </div>
              </a>
            </article>

            <div className="grid gap-6">
              <section className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/85 p-6 shadow-[0_20px_60px_rgba(22,16,10,0.06)]">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#6c5a49]">Start here</p>
                <div className="mt-5 space-y-5">
                  {heroSupport.map((post, index) => (
                    <KairaStoryCard
                      key={post.id}
                      post={post}
                      category={categoryMap.get(post.categoryId)}
                      variant="compact"
                      kicker={index === 0 ? 'Editor’s pick' : 'Worth your time'}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-[30px] border border-mugon-border/80 bg-[#1d1610] p-6 text-[#f6efe2] shadow-[0_22px_70px_rgba(22,16,10,0.12)]">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#d8c4a4]">What you’ll find here</p>
                <div className="mt-5 grid gap-4">
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="font-mugon-heading text-xl">Hotel reviews that help you book better</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="font-mugon-heading text-xl">Destination guides with mood, neighborhoods, and taste</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                    <p className="font-mugon-heading text-xl">Itineraries that make a short trip feel considered</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-8 lg:px-6 lg:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mugon-muted">Recent reading</p>
            <h2 className="mt-2 font-mugon-heading text-[clamp(2rem,4vw,3rem)] leading-[1] text-mugon-text">
              The latest stories worth your time.
            </h2>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          {latestStories[0] && (
            <KairaStoryCard
              post={latestStories[0]}
              category={categoryMap.get(latestStories[0].categoryId)}
              variant="feature"
              kicker="Latest"
            />
          )}
          <div className="rounded-[30px] border border-mugon-border/80 bg-mugon-surface/70 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)]">
            <div className="grid gap-5">
              {latestStories.slice(1).map((post) => (
                <KairaStoryCard
                  key={post.id}
                  post={post}
                  category={categoryMap.get(post.categoryId)}
                  variant="stacked"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-12 lg:px-6 lg:pb-16">
        <div className="rounded-[34px] border border-mugon-border/80 bg-[linear-gradient(180deg,rgba(255,250,244,0.92),rgba(251,245,236,0.78))] p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)] lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mugon-muted">Browse by intent</p>
              <h2 className="mt-2 font-mugon-heading text-[clamp(2rem,4vw,3rem)] leading-[1] text-mugon-text">
                Choose the kind of trip you’re planning.
              </h2>
            </div>
            <a href="/about" className="text-sm text-mugon-primary hover:underline">
              About Kaira
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            {navCategories.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="rounded-full border border-mugon-border bg-mugon-surface px-4 py-2 text-sm text-mugon-text transition-colors hover:border-mugon-primary hover:text-mugon-primary"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 lg:px-6 lg:pb-24">
        <div className="space-y-14">
          {categorySections.map((section, index) => {
            const lead = section.posts[0];
            const rest = section.posts.slice(1, 3);
            if (!lead) return null;

            return (
              <section key={section.title} className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.22em] text-mugon-muted">Section</p>
                      <h2 className="mt-2 font-mugon-heading text-[clamp(1.8rem,3vw,2.8rem)] leading-[1] text-mugon-text">
                        {section.title}
                      </h2>
                    </div>
                    {section.viewAllHref && (
                      <a href={section.viewAllHref} className="text-sm text-mugon-primary hover:underline">
                        {section.viewAllLabel || 'View all'}
                      </a>
                    )}
                  </div>
                  <p className="mb-5 max-w-xl text-sm leading-7 text-mugon-muted">
                    {storyTone(section.title)}
                  </p>
                  <KairaStoryCard
                    post={lead}
                    category={categoryMap.get(lead.categoryId)}
                    variant="feature"
                  />
                </div>
                <div className={`rounded-[30px] border border-mugon-border/80 bg-mugon-surface/75 p-6 shadow-[0_18px_50px_rgba(22,16,10,0.05)] ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="grid gap-6">
                    {rest.map((post) => (
                      <KairaStoryCard
                        key={post.id}
                        post={post}
                        category={categoryMap.get(post.categoryId)}
                        variant="stacked"
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </KairaShell>
  );
}
