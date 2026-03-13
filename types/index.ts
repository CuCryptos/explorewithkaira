export type Temperament = 'shizuka' | 'kozo' | 'ikki';

export interface PinterestBoard {
  id: string;
  name: string;
  categories: string[];
}

export interface PinterestConfig {
  boards: PinterestBoard[];
  defaultBoardId: string;
}

export interface SEODefaults {
  titleTemplate: string;
  metaDescription: string;
  ogImage: string;
}

export interface BrandConfig {
  siteName: string;
  tagline: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  voiceDescription: string;
  socialLinks: Record<string, string>;
  seoDefaults: SEODefaults;
  pinterest?: PinterestConfig;
}

export type PostStatus = 'draft' | 'review' | 'published' | 'archived';
export type ContentType = 'article' | 'recipe' | 'guide';

export interface PostSEO {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  ogImage: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  group?: string;
}

export interface Step {
  order: number;
  instruction: string;
  image?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

export interface Post {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  contentType: ContentType;
  categoryId: string;
  tags: string[];
  seo: PostSEO;
  featuredImage: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  wpId?: number | null;
  wpPermalink?: string | null;
  migrationVerified?: boolean | null;
  embedding?: number[] | null;
  ingredients?: Ingredient[];
  instructions?: Step[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  nutrition?: NutritionInfo;
}

export interface PostInput {
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  contentType?: ContentType;
  categoryId?: string;
  tagIds?: string[];
  seo?: Partial<PostSEO>;
  featuredImage?: string;
  ingredients?: Ingredient[];
  instructions?: Step[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  nutrition?: NutritionInfo;
}

export interface PostFilters {
  status?: PostStatus;
  contentType?: ContentType;
  categoryId?: string;
  tagId?: string;
  limit?: number;
  offset?: number;
}

export interface Category {
  id: string;
  siteId: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
}

export interface Media {
  id: string;
  siteId: string;
  url: string;
  altText: string;
  caption: string;
  mimeType: string;
  width: number;
  height: number;
  createdAt: Date;
}

export interface SitemapEntry {
  slug: string;
  updatedAt: Date;
}

export interface GSCQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSnapshotData {
  indexedPages: number;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  crawlErrors: number;
  queries: GSCQueryRow[];
  pages: GSCPageRow[];
  dateRange: { start: string; end: string };
}

export interface GA4PageRow {
  path: string;
  pageviews: number;
  users: number;
  avgEngagementTime: number;
}

export interface GA4TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
}

export interface GA4SnapshotData {
  sessions: number;
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: GA4PageRow[];
  trafficSources: GA4TrafficSource[];
  dateRange: { start: string; end: string };
}
