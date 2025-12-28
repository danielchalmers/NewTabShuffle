import { getQueue, getUrls, saveQueue } from '../lib/storage';
import { getShuffledUrls } from '../lib/randomizer';
import { takeNextFromQueue } from '../lib/queue';

function isFileUrl(url: string): boolean {
  return url.startsWith('file://');
}

async function canLoadFileUrls(): Promise<boolean> {
  if (!chrome?.extension?.isAllowedFileSchemeAccess) {
    return true;
  }

  return new Promise((resolve) => {
    chrome.extension.isAllowedFileSchemeAccess((isAllowed) => resolve(isAllowed));
  });
}

async function loadNextUrl() {
  const messageEl = document.getElementById('message') as HTMLDivElement;
  const frameEl = document.getElementById('content-frame') as HTMLIFrameElement;
  
  try {
    const [urls, queue] = await Promise.all([getUrls(), getQueue()]);
    const { nextUrl, remainingQueue } = takeNextFromQueue(queue, urls);
    const nextQueue =
      nextUrl && remainingQueue.length === 0 ? getShuffledUrls(urls) : remainingQueue;
    await saveQueue(nextQueue);
    
    if (nextUrl) {
      if (isFileUrl(nextUrl) && !(await canLoadFileUrls())) {
        frameEl.classList.add('hidden');
        messageEl.classList.remove('hidden');
        messageEl.textContent = 'File URLs require enabling "Allow access to file URLs" in the extension details.';
        return;
      }

      frameEl.src = nextUrl;
      frameEl.classList.remove('hidden');
      messageEl.classList.add('hidden');
    } else {
      frameEl.classList.add('hidden');
      messageEl.classList.remove('hidden');
      messageEl.textContent = 'No URLs configured. Open the extension options to add URLs.';
    }
  } catch (error) {
    console.error('Error loading next URL:', error);
    frameEl.classList.add('hidden');
    messageEl.classList.remove('hidden');
    messageEl.textContent = 'Error loading URL. Please check your settings.';
  }
}

loadNextUrl();
