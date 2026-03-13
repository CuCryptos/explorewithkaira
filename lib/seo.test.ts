import { describe, expect, it } from 'vitest';
import {
  isUsableImageUrl,
  resolvePostDescription,
  resolvePostOgImage,
  resolveStructuredDataImage,
  sanitizeExcerpt,
} from './seo';

describe('seo utilities', () => {
  it('strips HTML and decodes basic entities in excerpts', () => {
    expect(sanitizeExcerpt('<p>Quiet &amp; polished&nbsp;hotels only.</p>')).toBe(
      'Quiet & polished hotels only.',
    );
  });

  it('ignores stale wordpress og images and falls back to featured images', () => {
    const post = {
      excerpt: 'A better hotel guide.',
      featuredImage: 'https://cdn.example.com/paris.webp',
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        ogImage: 'https://explorewithkaira.com/wp-content/uploads/2024/01/paris.jpg',
      },
    };

    expect(resolvePostOgImage(post, 'https://cdn.example.com/default.webp')).toBe(
      'https://cdn.example.com/paris.webp',
    );
  });

  it('falls back to the site default when no usable post image exists', () => {
    const post = {
      excerpt: 'A better hotel guide.',
      featuredImage: 'https://explorewithkaira.com/wp-content/uploads/2024/01/paris.jpg',
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        ogImage: '',
      },
    };

    expect(resolvePostOgImage(post, 'https://cdn.example.com/default.webp')).toBe(
      'https://cdn.example.com/default.webp',
    );
  });

  it('prefers clean meta descriptions and otherwise sanitizes the excerpt', () => {
    expect(
      resolvePostDescription(
        {
          excerpt: '<p>Quiet &amp; polished hotels only.</p>',
          seo: { metaTitle: '', metaDescription: '', focusKeyword: '', ogImage: '' },
        },
        'Fallback copy',
      ),
    ).toBe('Quiet & polished hotels only.');

    expect(
      resolvePostDescription(
        {
          excerpt: '<p>Ignored excerpt.</p>',
          seo: {
            metaTitle: '',
            metaDescription: 'Explicit description.',
            focusKeyword: '',
            ogImage: '',
          },
        },
        'Fallback copy',
      ),
    ).toBe('Explicit description.');
  });

  it('shares the same usable-image rules for structured data', () => {
    const post = {
      excerpt: 'A better hotel guide.',
      featuredImage: 'https://explorewithkaira.com/wp-content/uploads/2024/01/paris.jpg',
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        ogImage: 'https://cdn.example.com/paris-hero.webp',
      },
    };

    expect(resolveStructuredDataImage(post)).toBe('https://cdn.example.com/paris-hero.webp');
    expect(isUsableImageUrl(post.seo.ogImage)).toBe(true);
    expect(isUsableImageUrl(post.featuredImage)).toBe(false);
  });
});
