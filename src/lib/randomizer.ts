/**
 * URL randomizer service
 */

import type { UrlEntry } from './storage';

export function getRandomUrl(urls: UrlEntry[]): string | null {
  const enabledUrls = urls.filter((entry) => entry.enabled);
  
  if (enabledUrls.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * enabledUrls.length);
  return enabledUrls[randomIndex].url;
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
