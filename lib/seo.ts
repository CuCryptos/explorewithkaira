import type { Post } from '@/types';

const LEGACY_IMAGE_PATTERNS = ['wp-content', '/wp/'];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function decodeBasicEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

export function stripHtml(value?: string | null): string {
  if (!value) return '';
  return normalizeWhitespace(decodeBasicEntities(value.replace(/<[^>]+>/g, ' ')));
}

export function sanitizeExcerpt(value?: string | null): string {
  return stripHtml(value);
}

export function isUsableImageUrl(value?: string | null): value is string {
  if (!value) return false;
  if (value.includes('404')) return false;
  return !LEGACY_IMAGE_PATTERNS.some((pattern) => value.includes(pattern));
}

export function resolvePostDescription(post: Pick<Post, 'seo' | 'excerpt'>, fallback: string): string {
  return (
    sanitizeExcerpt(post.seo.metaDescription) ||
    sanitizeExcerpt(post.excerpt) ||
    fallback
  );
}

export function resolvePostOgImage(
  post: Pick<Post, 'seo' | 'featuredImage'>,
  fallback: string,
): string {
  if (isUsableImageUrl(post.seo.ogImage)) return post.seo.ogImage;
  if (isUsableImageUrl(post.featuredImage)) return post.featuredImage;
  return fallback;
}

export function resolveStructuredDataImage(
  post: Pick<Post, 'seo' | 'featuredImage'>,
): string | undefined {
  if (isUsableImageUrl(post.featuredImage)) return post.featuredImage;
  if (isUsableImageUrl(post.seo.ogImage)) return post.seo.ogImage;
  return undefined;
}
