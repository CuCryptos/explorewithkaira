import { describe, expect, it } from 'vitest';
import type { Post } from '@/types';
import { buildDefaultKairaPrompt, buildKairaPrompt, inferKairaIntent, inferKairaPreset, KAIRA_NEGATIVE_PROMPT } from './kaira-image';

function makePost(overrides: Partial<Post>): Post {
  return {
    id: 'post-1',
    siteId: 'site-1',
    title: 'Best Luxury Hotels in Paris',
    slug: 'paris-luxury-hotels-honest-review',
    content: '',
    excerpt: 'Where to stay in Paris when you want quiet luxury.',
    status: 'published',
    contentType: 'article',
    categoryId: 'cat-1',
    tags: [],
    seo: { metaTitle: '', metaDescription: '', focusKeyword: '', ogImage: '' },
    featuredImage: '',
    publishedAt: new Date('2026-03-01'),
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-01'),
    ...overrides,
  };
}

describe('buildKairaPrompt', () => {
  it('builds prompt in identity, scene, style order', () => {
    const prompt = buildKairaPrompt('KAIRA', 'paris_night', 'standing on a bridge');
    expect(prompt).toContain('A candid photograph of KAIRA');
    expect(prompt).toContain('Parisian street at night');
    expect(prompt).toContain('standing on a bridge');
    expect(prompt.indexOf('A candid photograph of KAIRA')).toBeLessThan(prompt.indexOf('Parisian street at night'));
  });

  it('falls back to custom scene without preset', () => {
    const prompt = buildKairaPrompt('KAIRA', null, 'inside a marble hotel lobby');
    expect(prompt).toContain('inside a marble hotel lobby');
  });

  it('keeps the canonical negative prompt blocks', () => {
    expect(KAIRA_NEGATIVE_PROMPT).toContain('multiple people');
    expect(KAIRA_NEGATIVE_PROMPT).toContain('airbrushed skin');
  });

  it('auto-detects hotel-review imagery', () => {
    const post = makePost({});
    expect(inferKairaIntent(post)).toBe('hotel_review');
    expect(inferKairaPreset(post)).toBe('hotel_review_editorial');
    const prompt = buildDefaultKairaPrompt(post, 'KAIRA');
    expect(prompt).toContain('Luxury hotel suite or terrace');
    expect(prompt).toContain('Editorial hero image for a luxury hotel review');
  });

  it('auto-detects hidden-gems imagery', () => {
    const post = makePost({
      title: 'Paris Hidden Gems',
      slug: 'paris-hidden-gems',
      excerpt: 'Quiet backstreets and courtyards worth finding.',
    });
    expect(inferKairaIntent(post)).toBe('hidden_gems');
    expect(inferKairaPreset(post)).toBe('hidden_gems_stroll');
    const prompt = buildDefaultKairaPrompt(post, 'KAIRA');
    expect(prompt).toContain('Walking through a quiet side street');
  });
});
