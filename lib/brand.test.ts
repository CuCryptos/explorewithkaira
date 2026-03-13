import { describe, expect, it } from 'vitest';
import { normalizeBaseUrl } from './brand';

describe('normalizeBaseUrl', () => {
  it('falls back to the production domain when env is missing', () => {
    expect(normalizeBaseUrl(undefined)).toBe('https://explorewithkaira.com');
  });

  it('removes trailing slashes from configured base URLs', () => {
    expect(normalizeBaseUrl('https://preview.explorewithkaira.com/')).toBe(
      'https://preview.explorewithkaira.com',
    );
  });

  it('ignores empty configured values', () => {
    expect(normalizeBaseUrl('')).toBe('https://explorewithkaira.com');
  });
});
