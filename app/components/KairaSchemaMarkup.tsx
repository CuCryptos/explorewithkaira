import type { BrandConfig, Category, Post } from '@/types';

interface KairaSchemaMarkupProps {
  type: 'article' | 'recipe';
  data: Post;
  brandConfig: BrandConfig;
  category?: Category;
}

function minutesToISO8601(minutes: number): string {
  return `PT${minutes}M`;
}

function safeImage(url?: string): string | undefined {
  if (!url || url.includes('wp-content')) return undefined;
  return url;
}

function buildArticleJsonLd(data: Post, brandConfig: BrandConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    datePublished: data.publishedAt?.toISOString() ?? '',
    dateModified: data.updatedAt.toISOString(),
    image: safeImage(data.featuredImage),
    description: data.seo.metaDescription || data.excerpt,
    author: {
      '@type': 'Person',
      name: brandConfig.siteName,
    },
    publisher: {
      '@type': 'Organization',
      name: brandConfig.siteName,
    },
  };
}

function buildRecipeJsonLd(data: Post, brandConfig: BrandConfig, category?: Category) {
  const prepTime = data.prepTime ?? 0;
  const cookTime = data.cookTime ?? 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: data.title,
    image: safeImage(data.featuredImage),
    description: data.seo.metaDescription || data.excerpt,
    recipeCategory: category?.name || 'Main Course',
    recipeCuisine: 'Hawaiian',
    prepTime: minutesToISO8601(prepTime),
    cookTime: minutesToISO8601(cookTime),
    totalTime: minutesToISO8601(prepTime + cookTime),
    recipeYield: data.servings ? `${data.servings} servings` : undefined,
    recipeIngredient: (data.ingredients ?? []).map(
      (ingredient) => `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`,
    ),
    recipeInstructions: (data.instructions ?? []).map((step) => ({
      '@type': 'HowToStep',
      text: step.instruction,
    })),
    nutrition: data.nutrition
      ? {
          '@type': 'NutritionInformation',
          calories: `${data.nutrition.calories} calories`,
          proteinContent: `${data.nutrition.protein} g`,
          carbohydrateContent: `${data.nutrition.carbs} g`,
          fatContent: `${data.nutrition.fat} g`,
          fiberContent: `${data.nutrition.fiber ?? 0} g`,
          sodiumContent: `${data.nutrition.sodium ?? 0} mg`,
        }
      : undefined,
    author: {
      '@type': 'Person',
      name: brandConfig.siteName,
    },
    datePublished: data.publishedAt?.toISOString() ?? '',
  };
}

export function KairaSchemaMarkup({
  type,
  data,
  brandConfig,
  category,
}: KairaSchemaMarkupProps) {
  const jsonLd =
    type === 'article'
      ? buildArticleJsonLd(data, brandConfig)
      : buildRecipeJsonLd(data, brandConfig, category);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
