import type { UrlEntry } from './storage';
import { getShuffledUrls } from './randomizer';

export function takeNextFromQueue(
  currentQueue: string[],
  urls: UrlEntry[]
): { nextUrl: string | null; remainingQueue: string[] } {
  if (currentQueue.length > 0) {
    return {
      nextUrl: currentQueue[0],
      remainingQueue: currentQueue.slice(1),
    };
  }

  const reshuffledQueue = getShuffledUrls(urls);
  if (reshuffledQueue.length === 0) {
    return { nextUrl: null, remainingQueue: [] };
  }

  return {
    nextUrl: reshuffledQueue[0],
    remainingQueue: reshuffledQueue.slice(1),
  };
}

export function peekQueue(
  currentQueue: string[],
  urls: UrlEntry[],
  max: number
): { queue: string[]; preview: string[] } {
  const ensuredQueue = currentQueue.length > 0 ? [...currentQueue] : getShuffledUrls(urls);
  const previewCount = Math.max(0, max);

  return {
    queue: ensuredQueue,
    preview: ensuredQueue.slice(0, previewCount),
  };
}
