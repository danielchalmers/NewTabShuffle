import { getQueue, getUrls, saveQueue } from '../lib/storage';
import { peekQueue } from '../lib/queue';

const listEl = document.getElementById('queue-list') as HTMLUListElement;
const emptyMessage = document.getElementById('empty-message') as HTMLParagraphElement;

function showEmptyMessage(text: string, kind: 'status' | 'alert') {
  emptyMessage.textContent = text;
  emptyMessage.setAttribute('role', kind === 'alert' ? 'alert' : 'status');
  emptyMessage.setAttribute('aria-live', kind === 'alert' ? 'assertive' : 'polite');
  emptyMessage.classList.remove('hidden');
}

function renderQueue(preview: string[]) {
  listEl.innerHTML = '';
  const fragment = document.createDocumentFragment();

  preview.forEach((url, index) => {
    const item = document.createElement('li');
    item.className = 'queue-item';

    const indexEl = document.createElement('span');
    indexEl.className = 'queue-index';
    indexEl.textContent = String(index + 1);

    const urlEl = document.createElement('span');
    urlEl.className = 'queue-url';
    urlEl.textContent = url;

    item.append(indexEl, urlEl);
    fragment.appendChild(item);
  });

  listEl.appendChild(fragment);
}

async function init() {
  try {
    const [urls, queue] = await Promise.all([getUrls(), getQueue()]);
    const { queue: ensuredQueue, preview } = peekQueue(queue, urls, 5);

    if (queue.length === 0 && ensuredQueue.length > 0) {
      await saveQueue(ensuredQueue);
    }

    if (preview.length === 0) {
      listEl.classList.add('hidden');
      showEmptyMessage('Queue is empty. Add URLs in options to start.', 'status');
      return;
    }

    renderQueue(preview);
    listEl.classList.remove('hidden');
    emptyMessage.classList.add('hidden');
  } catch (error) {
    console.error('Error loading queue preview:', error);
    listEl.classList.add('hidden');
    showEmptyMessage('Unable to load queue. Check your options.', 'alert');
  }
}

void init();
