/**
 * URL randomizer service
 */

import type { UrlEntry } from './storage';

export function getRandomUrl(urls: UrlEntry[]): string | null {
  const enabledUrls = urls.filter((entry) => entry.enabled);
  
  if (enabledUrls.length === 0) {
    return null;
  }
  
  const randomIndex = getRandomIndex(enabledUrls.length);
  return enabledUrls[randomIndex].url;
}

export function getShuffledUrls(urls: UrlEntry[]): string[] {
  const enabledUrls = urls.filter((entry) => entry.enabled).map((entry) => entry.url);
  if (enabledUrls.length <= 1) {
    return [...enabledUrls];
  }

  const shuffled = [...enabledUrls];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = getRandomIndex(i + 1);
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  return shuffled;
}

function getRandomIndex(max: number): number {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    const buffer = new Uint32Array(1);
    cryptoApi.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function validateUrl(url: string): boolean {
  if (!url || url.trim().length === 0) {
    return false;
  }
  
  // Allow http(s) URLs and file:// URLs
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || 
           urlObj.protocol === 'https:' || 
           urlObj.protocol === 'file:';
  } catch {
    return false;
  }
}
