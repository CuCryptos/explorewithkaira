import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type {
  Category,
  Media,
  Post,
  PostFilters,
  PostInput,
  SitemapEntry,
} from '@/types';

interface PostRow {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  content_type: string;
  category_id: string;
  featured_image: string;
  seo: Record<string, string>;
  recipe_data: Record<string, unknown> | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  wp_id?: number | null;
  wp_permalink?: string | null;
  migration_verified?: boolean | null;
  embedding?: number[] | null;
  post_tags?: Array<{ tag_id: string }>;
}

interface CategoryRow {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
}

interface MediaRow {
  id: string;
  site_id: string;
  url: string;
  alt_text: string;
  caption: string;
  mime_type: string;
  width: number;
  height: number;
  created_at: string;
}

export function createContentClient(supabaseUrl: string, supabaseKey: string) {
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

function mapRowToPost(row: PostRow): Post {
  const recipe = row.recipe_data ?? {};
  return {
    id: row.id,
    siteId: row.site_id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    status: row.status as Post['status'],
    contentType: row.content_type as Post['contentType'],
    categoryId: row.category_id,
    tags: row.post_tags?.map((tag) => tag.tag_id) ?? [],
    seo: {
      metaTitle: row.seo?.meta_title ?? row.seo?.metaTitle ?? '',
      metaDescription: row.seo?.meta_description ?? row.seo?.metaDescription ?? '',
      focusKeyword: row.seo?.focus_keyword ?? row.seo?.focusKeyword ?? '',
      ogImage: row.seo?.og_image ?? row.seo?.ogImage ?? '',
    },
    featuredImage: row.featured_image,
    publishedAt: row.published_at ? new Date(row.published_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    wpId: row.wp_id ?? null,
    wpPermalink: row.wp_permalink ?? null,
    migrationVerified: row.migration_verified ?? null,
    embedding: row.embedding ?? null,
    ingredients: recipe.ingredients as Post['ingredients'],
    instructions: recipe.instructions as Post['instructions'],
    prepTime: recipe.prep_time as number | undefined,
    cookTime: recipe.cook_time as number | undefined,
    servings: recipe.servings as number | undefined,
    nutrition: recipe.nutrition as Post['nutrition'],
  };
}

function mapRowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    parentId: row.parent_id,
  };
}

function mapRowToMedia(row: MediaRow): Media {
  return {
    id: row.id,
    siteId: row.site_id,
    url: row.url,
    altText: row.alt_text ?? '',
    caption: row.caption ?? '',
    mimeType: row.mime_type ?? '',
    width: row.width ?? 0,
    height: row.height ?? 0,
    createdAt: new Date(row.created_at),
  };
}

export function createPostsSDK(client: SupabaseClient) {
  async function getPost(id: string): Promise<Post> {
    const { data, error } = await client.from('posts').select('*, post_tags(tag_id)').eq('id', id).single();
    if (error) throw error;
    return mapRowToPost(data as PostRow);
  }

  async function getPostBySlug(siteId: string, slug: string): Promise<Post> {
    const { data, error } = await client
      .from('posts')
      .select('*, post_tags(tag_id)')
      .eq('site_id', siteId)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return mapRowToPost(data as PostRow);
  }

  async function listPosts(siteId: string, filters?: PostFilters): Promise<Post[]> {
    let query = client
      .from('posts')
      .select('*, post_tags(tag_id)')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.contentType) query = query.eq('content_type', filters.contentType);
    if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;

    let posts = (data as PostRow[]).map(mapRowToPost);
    if (filters?.tagId) {
      posts = posts.filter((post) => post.tags.includes(filters.tagId!));
    }

    return posts;
  }

  async function updatePost(id: string, data: Partial<PostInput>): Promise<Post> {
    const updateRow: Record<string, unknown> = {};

    if (data.title !== undefined) updateRow.title = data.title;
    if (data.slug !== undefined) updateRow.slug = data.slug;
    if (data.content !== undefined) updateRow.content = data.content;
    if (data.excerpt !== undefined) updateRow.excerpt = data.excerpt;
    if (data.contentType !== undefined) updateRow.content_type = data.contentType;
    if (data.categoryId !== undefined) updateRow.category_id = data.categoryId;
    if (data.seo !== undefined) updateRow.seo = data.seo;
    if (data.featuredImage !== undefined) updateRow.featured_image = data.featuredImage;

    if (
      data.ingredients ||
      data.instructions ||
      data.prepTime ||
      data.cookTime ||
      data.servings ||
      data.nutrition
    ) {
      updateRow.recipe_data = {
        ingredients: data.ingredients ?? null,
        instructions: data.instructions ?? null,
        prep_time: data.prepTime ?? null,
        cook_time: data.cookTime ?? null,
        servings: data.servings ?? null,
        nutrition: data.nutrition ?? null,
      };
    }

    if (Object.keys(updateRow).length > 0) {
      const { error } = await client.from('posts').update(updateRow).eq('id', id);
      if (error) throw error;
    }

    if (data.tagIds !== undefined) {
      const { error: deleteError } = await client.from('post_tags').delete().eq('post_id', id);
      if (deleteError) throw deleteError;

      if (data.tagIds.length > 0) {
        const tagRows = data.tagIds.map((tagId) => ({
          post_id: id,
          tag_id: tagId,
        }));
        const { error: tagError } = await client.from('post_tags').insert(tagRows);
        if (tagError) throw tagError;
      }
    }

    return getPost(id);
  }

  async function getPostsBySitemap(siteId: string): Promise<SitemapEntry[]> {
    const { data, error } = await client
      .from('posts')
      .select('slug, updated_at')
      .eq('site_id', siteId)
      .eq('status', 'published');

    if (error) throw error;

    return (data as Array<{ slug: string; updated_at: string }>).map((row) => ({
      slug: row.slug,
      updatedAt: new Date(row.updated_at),
    }));
  }

  return {
    getPost,
    getPostBySlug,
    listPosts,
    updatePost,
    getPostsBySitemap,
  };
}

export function createCategoriesSDK(client: SupabaseClient) {
  async function listCategories(siteId: string): Promise<Category[]> {
    const { data, error } = await client.from('categories').select('*').eq('site_id', siteId);
    if (error) throw error;
    return (data as CategoryRow[]).map(mapRowToCategory);
  }

  return { listCategories };
}

export function createMediaSDK(client: SupabaseClient) {
  async function uploadMedia(
    siteId: string,
    data: {
      url: string;
      altText?: string;
      caption?: string;
      mimeType?: string;
      width?: number;
      height?: number;
    },
  ): Promise<Media> {
    const { data: row, error } = await client
      .from('media')
      .insert({
        site_id: siteId,
        url: data.url,
        alt_text: data.altText ?? '',
        caption: data.caption ?? '',
        mime_type: data.mimeType ?? '',
        width: data.width ?? 0,
        height: data.height ?? 0,
      })
      .select()
      .single();

    if (error) throw error;
    return mapRowToMedia(row as MediaRow);
  }

  return { uploadMedia };
}
