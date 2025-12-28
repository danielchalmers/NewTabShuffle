import { describe, it, expect } from 'vitest';
import { peekQueue, takeNextFromQueue } from '../src/lib/queue';
import type { UrlEntry } from '../src/lib/storage';

describe('queue helpers', () => {
  describe('takeNextFromQueue', () => {
    it('should take from the existing queue when available', () => {
      const currentQueue = ['https://first.com', 'https://second.com'];
      const urls: UrlEntry[] = [];

      const result = takeNextFromQueue(currentQueue, urls);

      expect(result.nextUrl).toBe('https://first.com');
      expect(result.remainingQueue).toEqual(['https://second.com']);
    });

    it('should return null when queue and URLs are empty', () => {
      const result = takeNextFromQueue([], []);
      expect(result.nextUrl).toBeNull();
      expect(result.remainingQueue).toEqual([]);
    });

    it('should reshuffle when queue is empty', () => {
      const urls: UrlEntry[] = [
        { url: 'https://one.com', enabled: true },
        { url: 'https://two.com', enabled: true },
        { url: 'https://disabled.com', enabled: false },
      ];

      const result = takeNextFromQueue([], urls);

      expect(result.nextUrl).not.toBeNull();
      expect(['https://one.com', 'https://two.com']).toContain(result.nextUrl);
      expect(result.remainingQueue).toHaveLength(1);
      expect(result.remainingQueue).not.toContain(result.nextUrl);
    });
  });

  describe('peekQueue', () => {
    it('should preview from the existing queue', () => {
      const currentQueue = ['https://a.com', 'https://b.com', 'https://c.com'];
      const urls: UrlEntry[] = [];

      const result = peekQueue(currentQueue, urls, 2);

      expect(result.queue).toEqual(currentQueue);
      expect(result.preview).toEqual(['https://a.com', 'https://b.com']);
    });

    it('should build a queue when empty', () => {
      const urls: UrlEntry[] = [
        { url: 'https://one.com', enabled: true },
        { url: 'https://two.com', enabled: true },
        { url: 'https://disabled.com', enabled: false },
      ];

      const result = peekQueue([], urls, 5);

      expect(result.queue).toHaveLength(2);
      expect(new Set(result.queue)).toEqual(new Set(['https://one.com', 'https://two.com']));
      expect(result.preview).toHaveLength(2);
    });
  });
});
