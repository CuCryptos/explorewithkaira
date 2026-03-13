import type { MetadataRoute } from 'next';
import { posts, categories } from '@/lib/supabase';
import { siteId, baseUrl } from '@/lib/brand';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [allPosts, allCategories] = await Promise.all([
    posts.getPostsBySitemap(siteId),
    categories.listCategories(siteId),
  ]);

  const categoryEntries: MetadataRoute.Sitemap = allCategories
    .filter((c) => c.name.toLowerCase() !== 'uncategorized')
    .map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...allPosts.map((entry) => ({
      url: `${baseUrl}/${entry.slug}`,
      lastModified: entry.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...categoryEntries,
  ];
}
