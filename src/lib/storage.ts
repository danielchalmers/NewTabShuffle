/**
 * Storage service for managing URLs using Chrome Storage API
 */

export interface UrlEntry {
  url: string;
  enabled: boolean;
}

const STORAGE_KEY = 'urls';

export async function getUrls(): Promise<UrlEntry[]> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY] || [];
}

export async function saveUrls(urls: UrlEntry[]): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: urls });
}

export async function addUrl(url: string): Promise<void> {
  const urls = await getUrls();
  urls.push({ url, enabled: true });
  await saveUrls(urls);
}

export async function removeUrl(index: number): Promise<void> {
  const urls = await getUrls();
  urls.splice(index, 1);
  await saveUrls(urls);
}

export async function updateUrl(index: number, entry: UrlEntry): Promise<void> {
  const urls = await getUrls();
  urls[index] = entry;
  await saveUrls(urls);
}

export async function toggleUrl(index: number): Promise<void> {
  const urls = await getUrls();
  if (urls[index]) {
    urls[index].enabled = !urls[index].enabled;
    await saveUrls(urls);
  }
}
