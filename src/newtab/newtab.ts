import { getUrls } from '../lib/storage';
import { getRandomUrl } from '../lib/randomizer';

async function loadRandomUrl() {
  const messageEl = document.getElementById('message') as HTMLDivElement;
  const frameEl = document.getElementById('content-frame') as HTMLIFrameElement;
  
  try {
    const urls = await getUrls();
    const randomUrl = getRandomUrl(urls);
    
    if (randomUrl) {
      frameEl.src = randomUrl;
      frameEl.classList.remove('hidden');
      messageEl.classList.add('hidden');
    } else {
      frameEl.classList.add('hidden');
      messageEl.classList.remove('hidden');
      messageEl.textContent = 'No URLs configured. Click the extension icon to set up URLs.';
    }
  } catch (error) {
    console.error('Error loading random URL:', error);
    frameEl.classList.add('hidden');
    messageEl.classList.remove('hidden');
    messageEl.textContent = 'Error loading URL. Please check your settings.';
  }
}

loadRandomUrl();
