import { describe, expect, it } from 'vitest';
import type { Post } from '@/types';
import { buildDefaultDestinationPrompt, buildDestinationPrompt, inferDestinationIntent } from './destination-image';

function makePost(overrides: Partial<Post>): Post {
  return {
    id: 'post-1',
    siteId: 'site-1',
    title: '3 Days in Paris',
    slug: 'paris-weekend-guide',
    content: '',
    excerpt: 'Long lunches and quiet corners in Paris.',
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

describe('destination image prompts', () => {
  it('builds prompt from preset and options', () => {
    const prompt = buildDestinationPrompt('european_cityscape', 'quiet Paris side street', {
      mood: 'warm',
    });
    expect(prompt).toContain('Cinematic editorial photography');
    expect(prompt).toContain('European cobblestone street');
    expect(prompt).toContain('quiet Paris side street');
    expect(prompt).toContain('Mood: warm');
  });

  it('builds a default destination prompt from post content', () => {
    const prompt = buildDefaultDestinationPrompt(makePost({}));
    expect(prompt).toContain('3 Days in Paris');
    expect(prompt).toContain('No people, no text, no watermarks');
  });

  it('switches to hotel scenes for hotel-review posts', () => {
    const prompt = buildDefaultDestinationPrompt(
      makePost({
        title: 'Best Luxury Hotels in Paris',
        slug: 'paris-luxury-hotels-honest-review',
      }),
    );
    expect(prompt).toContain('Luxury hotel interior');
  });

  it('builds itinerary prompts around arrival and destination feel', () => {
    const post = makePost({
      title: '3 Days in Paris: A Luxury Weekend Itinerary',
      slug: 'paris-weekend-guide',
    });
    expect(inferDestinationIntent(post)).toBe('itinerary');
    const prompt = buildDefaultDestinationPrompt(post);
    expect(prompt).toContain('Cover image for a luxury itinerary');
    expect(prompt).toContain('Time of day: golden hour or blue-hour transition');
  });

  it('builds hidden-gems prompts away from postcard landmarks', () => {
    const post = makePost({
      title: 'Paris Hidden Gems',
      slug: 'paris-hidden-gems',
      excerpt: 'Quiet courtyards and side streets that still feel discovered.',
    });
    expect(inferDestinationIntent(post)).toBe('hidden_gems');
    const prompt = buildDefaultDestinationPrompt(post);
    expect(prompt).toContain('Cover image for a hidden gems travel piece');
    expect(prompt).toContain('Avoid postcard landmarks');
  });
});
