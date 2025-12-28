import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUrls,
  saveUrls,
  addUrl,
  removeUrl,
  updateUrl,
  toggleUrl,
  getQueue,
  saveQueue,
  clearQueue,
} from '../src/lib/storage';
import type { UrlEntry } from '../src/lib/storage';

// Mock chrome.storage API
const mockStorage: { [key: string]: any } = {};

global.chrome = {
  storage: {
    sync: {
      get: vi.fn((key: string) => {
        return Promise.resolve({ [key]: mockStorage[key] || [] });
      }),
      set: vi.fn((data: { [key: string]: any }) => {
        Object.assign(mockStorage, data);
        return Promise.resolve();
      }),
    },
  },
} as any;

describe('storage', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    vi.clearAllMocks();
  });

  describe('getUrls', () => {
    it('should return empty array when no URLs are stored', async () => {
      const urls = await getUrls();
      expect(urls).toEqual([]);
    });

    it('should return stored URLs', async () => {
      const testUrls: UrlEntry[] = [
        { url: 'https://example.com', enabled: true },
      ];
      mockStorage.urls = testUrls;
      
      const urls = await getUrls();
      expect(urls).toEqual(testUrls);
    });
  });

  describe('saveUrls', () => {
    it('should save URLs to storage', async () => {
      const testUrls: UrlEntry[] = [
        { url: 'https://example.com', enabled: true },
      ];
      
      await saveUrls(testUrls);
      
      expect(mockStorage.urls).toEqual(testUrls);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({ urls: testUrls });
    });
  });

  describe('getQueue', () => {
    it('should return empty array when no queue is stored', async () => {
      const queue = await getQueue();
      expect(queue).toEqual([]);
    });

    it('should return stored queue entries', async () => {
      const testQueue = ['https://example.com', 'https://second.com'];
      mockStorage.queue = testQueue;

      const queue = await getQueue();
      expect(queue).toEqual(testQueue);
    });
  });

  describe('saveQueue', () => {
    it('should save queue to storage', async () => {
      const testQueue = ['https://example.com'];

      await saveQueue(testQueue);

      expect(mockStorage.queue).toEqual(testQueue);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({ queue: testQueue });
    });
  });

  describe('clearQueue', () => {
    it('should clear stored queue entries', async () => {
      mockStorage.queue = ['https://example.com'];

      await clearQueue();

      const queue = await getQueue();
      expect(queue).toEqual([]);
    });
  });

  describe('addUrl', () => {
    it('should add a new URL to empty list', async () => {
      await addUrl('https://example.com');
      
      const urls = await getUrls();
      expect(urls).toHaveLength(1);
      expect(urls[0]).toEqual({
        url: 'https://example.com',
        enabled: true,
      });
    });

    it('should add a new URL to existing list', async () => {
      mockStorage.urls = [
        { url: 'https://first.com', enabled: true },
      ];
      
      await addUrl('https://second.com');
      
      const urls = await getUrls();
      expect(urls).toHaveLength(2);
      expect(urls[1]).toEqual({
        url: 'https://second.com',
        enabled: true,
      });
    });
  });

  describe('removeUrl', () => {
    it('should remove URL at specified index', async () => {
      mockStorage.urls = [
        { url: 'https://first.com', enabled: true },
        { url: 'https://second.com', enabled: true },
        { url: 'https://third.com', enabled: true },
      ];
      
      await removeUrl(1);
      
      const urls = await getUrls();
      expect(urls).toHaveLength(2);
      expect(urls[0].url).toBe('https://first.com');
      expect(urls[1].url).toBe('https://third.com');
    });
  });

  describe('updateUrl', () => {
    it('should update URL at specified index', async () => {
      mockStorage.urls = [
        { url: 'https://old.com', enabled: true },
      ];
      
      await updateUrl(0, { url: 'https://new.com', enabled: false });
      
      const urls = await getUrls();
      expect(urls[0]).toEqual({
        url: 'https://new.com',
        enabled: false,
      });
    });
  });

  describe('toggleUrl', () => {
    it('should toggle enabled state', async () => {
      mockStorage.urls = [
        { url: 'https://example.com', enabled: true },
      ];
      
      await toggleUrl(0);
      
      let urls = await getUrls();
      expect(urls[0].enabled).toBe(false);
      
      await toggleUrl(0);
      
      urls = await getUrls();
      expect(urls[0].enabled).toBe(true);
    });

    it('should handle invalid index gracefully', async () => {
      mockStorage.urls = [
        { url: 'https://example.com', enabled: true },
      ];
      
      await toggleUrl(5);
      
      const urls = await getUrls();
      expect(urls[0].enabled).toBe(true);
    });
  });
});
