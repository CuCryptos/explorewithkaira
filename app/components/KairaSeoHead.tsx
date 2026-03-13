import type { BrandConfig, Post } from '@/types';

interface KairaSeoHeadProps {
  brandConfig: BrandConfig;
  post?: Post;
  page: 'home' | 'post' | 'archive';
  baseUrl?: string;
}

export function KairaSeoHead({ brandConfig, post, page: _page, baseUrl = '' }: KairaSeoHeadProps) {
  const { seoDefaults } = brandConfig;

  const pageTitle = post
    ? seoDefaults.titleTemplate.replace('%s', post.seo.metaTitle || post.title)
    : `${brandConfig.siteName} | ${brandConfig.tagline}`;

  const description = post?.seo.metaDescription || post?.excerpt || seoDefaults.metaDescription;
  const rawOgImage = post?.seo.ogImage || post?.featuredImage || seoDefaults.ogImage;
  const filteredImage = rawOgImage?.includes('wp-content') ? seoDefaults.ogImage : rawOgImage;
  const ogImage = filteredImage?.startsWith('/') ? `${baseUrl}${filteredImage}` : filteredImage;
  const canonical = post ? `${baseUrl}/${post.slug}` : baseUrl || undefined;

  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {canonical && <link rel="canonical" href={canonical} />}
    </>
  );
}
