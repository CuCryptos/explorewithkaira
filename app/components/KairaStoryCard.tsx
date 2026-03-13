import Image from 'next/image';
import type { Category, Post } from '@/types';

type StoryCardVariant = 'feature' | 'compact' | 'stacked';

interface KairaStoryCardProps {
  post: Post;
  category?: Category;
  variant?: StoryCardVariant;
  kicker?: string;
}

function formatDate(date?: Date | null) {
  return date
    ? date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
}

export function KairaStoryCard({
  post,
  category,
  variant = 'feature',
  kicker,
}: KairaStoryCardProps) {
  const formattedDate = formatDate(post.publishedAt);
  const categoryLabel =
    category && category.name.toLowerCase() !== 'uncategorized' ? category.name : undefined;

  if (variant === 'compact') {
    return (
      <article className="group rounded-[28px] border border-mugon-border/80 bg-mugon-surface/80 p-3 shadow-[0_18px_50px_rgba(22,16,10,0.06)] transition-transform hover:-translate-y-1">
        <a href={`/${post.slug}`} className="grid grid-cols-[110px_1fr] gap-4">
          {post.featuredImage && (
            <div className="relative overflow-hidden rounded-[20px] aspect-[4/5]">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="110px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          )}
          <div className="min-w-0 py-1">
            <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-mugon-muted">
              {kicker && <span className="text-mugon-primary">{kicker}</span>}
              {categoryLabel && <span>{categoryLabel}</span>}
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <h3 className="mt-2 font-mugon-heading text-xl leading-tight text-mugon-text">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-mugon-muted">
                {post.excerpt}
              </p>
            )}
          </div>
        </a>
      </article>
    );
  }

  if (variant === 'stacked') {
    return (
      <article className="group border-b border-mugon-border/70 pb-5 last:border-b-0 last:pb-0">
        <a href={`/${post.slug}`} className="grid gap-4 sm:grid-cols-[140px_1fr]">
          {post.featuredImage && (
            <div className="relative overflow-hidden rounded-[22px] aspect-[4/3]">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="140px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-mugon-muted">
              {categoryLabel && <span className="text-mugon-primary">{categoryLabel}</span>}
              {formattedDate && <span>{formattedDate}</span>}
            </div>
            <h3 className="mt-2 font-mugon-heading text-[1.5rem] leading-tight text-mugon-text">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-mugon-muted">
                {post.excerpt}
              </p>
            )}
          </div>
        </a>
      </article>
    );
  }

  return (
    <article className="group overflow-hidden rounded-[32px] border border-mugon-border/80 bg-mugon-surface/85 shadow-[0_22px_70px_rgba(22,16,10,0.07)]">
      <a href={`/${post.slug}`} className="block">
        {post.featuredImage && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          </div>
        )}
        <div className="space-y-3 p-6">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em] text-mugon-muted">
            {kicker && <span className="text-mugon-primary">{kicker}</span>}
            {categoryLabel && <span>{categoryLabel}</span>}
            {formattedDate && <span>{formattedDate}</span>}
          </div>
          <h3 className="font-mugon-heading text-[clamp(1.7rem,2vw,2.45rem)] leading-[1.05] text-mugon-text">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="max-w-2xl text-sm leading-7 text-mugon-muted">
              {post.excerpt}
            </p>
          )}
        </div>
      </a>
    </article>
  );
}
