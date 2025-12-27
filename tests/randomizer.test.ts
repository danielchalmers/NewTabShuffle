import { describe, it, expect } from 'vitest';
import { getRandomUrl, validateUrl } from '../src/lib/randomizer';
import type { UrlEntry } from '../src/lib/storage';

describe('randomizer', () => {
  describe('getRandomUrl', () => {
    it('should return null for empty array', () => {
      const result = getRandomUrl([]);
      expect(result).toBeNull();
    });

    it('should return null when all URLs are disabled', () => {
      const urls: UrlEntry[] = [
        { url: 'https://example.com', enabled: false },
        { url: 'https://test.com', enabled: false },
      ];
      const result = getRandomUrl(urls);
      expect(result).toBeNull();
    });

    it('should return the only enabled URL', () => {
      const urls: UrlEntry[] = [
        { url: 'https://example.com', enabled: true },
        { url: 'https://test.com', enabled: false },
      ];
      const result = getRandomUrl(urls);
      expect(result).toBe('https://example.com');
    });

    it('should return one of the enabled URLs', () => {
      const urls: UrlEntry[] = [
        { url: 'https://example.com', enabled: true },
        { url: 'https://test.com', enabled: true },
        { url: 'https://disabled.com', enabled: false },
      ];
      const result = getRandomUrl(urls);
      expect(result).toMatch(/^https:\/\/(example|test)\.com$/);
    });

    it('should return different URLs over multiple calls (probabilistic)', () => {
      const urls: UrlEntry[] = [
        { url: 'https://example1.com', enabled: true },
        { url: 'https://example2.com', enabled: true },
        { url: 'https://example3.com', enabled: true },
        { url: 'https://example4.com', enabled: true },
        { url: 'https://example5.com', enabled: true },
      ];
      
      const results = new Set<string>();
      for (let i = 0; i < 20; i++) {
        const result = getRandomUrl(urls);
        if (result) results.add(result);
      }
      
      // With 5 URLs and 20 trials, we should get at least 2 different URLs
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('validateUrl', () => {
    it('should accept valid http URLs', () => {
      expect(validateUrl('http://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
    });

    it('should accept valid https URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('https://www.example.com/path')).toBe(true);
    });

    it('should accept valid file URLs', () => {
      expect(validateUrl('file:///path/to/file.html')).toBe(true);
      expect(validateUrl('file:///C:/Users/test/file.html')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(validateUrl('')).toBe(false);
      expect(validateUrl('   ')).toBe(false);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
      expect(validateUrl('javascript:alert(1)')).toBe(false);
    });

    it('should reject URLs without protocol', () => {
      expect(validateUrl('example.com')).toBe(false);
      expect(validateUrl('www.example.com')).toBe(false);
    });
  });
});
