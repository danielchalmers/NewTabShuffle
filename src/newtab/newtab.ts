import { getUrls } from '../lib/storage';
import { getRandomUrl } from '../lib/randomizer';

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

async function loadRandomUrl() {
  const messageEl = document.getElementById('message') as HTMLDivElement;
  const frameEl = document.getElementById('content-frame') as HTMLIFrameElement;
  
  try {
    const urls = await getUrls();
    const randomUrl = getRandomUrl(urls);
    
    if (randomUrl) {
      if (isFileUrl(randomUrl) && !(await canLoadFileUrls())) {
        frameEl.classList.add('hidden');
        messageEl.classList.remove('hidden');
        messageEl.textContent = 'File URLs require enabling "Allow access to file URLs" in the extension details.';
        return;
      }

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
