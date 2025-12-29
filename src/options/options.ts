import { clearQueue, getQueue, getUrls, saveQueue, saveUrls } from '../lib/storage';
import { validateUrl } from '../lib/randomizer';
import type { UrlEntry } from '../lib/storage';

const textarea = document.getElementById('urls-textarea') as HTMLTextAreaElement;
const saveStatus = document.getElementById('save-status') as HTMLSpanElement;
const countStatus = document.getElementById('count-status') as HTMLSpanElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

const queueTextarea = document.getElementById('queue-textarea') as HTMLTextAreaElement;
const queueSaveStatus = document.getElementById('queue-save-status') as HTMLSpanElement;
const queueCountStatus = document.getElementById('queue-count-status') as HTMLSpanElement;
const queueErrorMessage = document.getElementById('queue-error-message') as HTMLParagraphElement;
const queueResetButton = document.getElementById('queue-reset') as HTMLButtonElement;

const SAVE_DELAY_MS = 500;
let saveTimer: number | undefined;
let queueSaveTimer: number | undefined;
let isQueueDirty = false;

function setFieldValidity(field: HTMLTextAreaElement, isInvalid: boolean) {
  field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
}

function formatUrls(urls: UrlEntry[]): string {
  return urls
    .map((entry) => (entry.enabled ? entry.url : `# ${entry.url}`))
    .join('\n');
}

function countUrls(urls: UrlEntry[]): { enabled: number; disabled: number } {
  return urls.reduce(
    (counts, entry) => {
      if (entry.enabled) {
        counts.enabled += 1;
      } else {
        counts.disabled += 1;
      }
      return counts;
    },
    { enabled: 0, disabled: 0 }
  );
}

function parseUrlText(text: string): {
  entries: UrlEntry[];
  invalidLines: number[];
  enabledCount: number;
  disabledCount: number;
} {
  const entries: UrlEntry[] = [];
  const invalidLines: number[] = [];
  let enabledCount = 0;
  let disabledCount = 0;

  const lines = text.split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      return;
    }

    const isDisabled = trimmed.startsWith('#');
    const candidate = isDisabled ? trimmed.slice(1).trim() : trimmed;

    if (!candidate) {
      return;
    }

    if (!validateUrl(candidate)) {
      invalidLines.push(index + 1);
      return;
    }

    entries.push({ url: candidate, enabled: !isDisabled });

    if (isDisabled) {
      disabledCount += 1;
    } else {
      enabledCount += 1;
    }
  });

  return {
    entries,
    invalidLines,
    enabledCount,
    disabledCount,
  };
}

function formatQueue(queue: string[]): string {
  return queue.join('\n');
}

function parseQueueText(text: string): {
  entries: string[];
  invalidLines: number[];
} {
  const entries: string[] = [];
  const invalidLines: number[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith('#')) {
      return;
    }

    if (!validateUrl(trimmed)) {
      invalidLines.push(index + 1);
      return;
    }

    entries.push(trimmed);
  });

  return { entries, invalidLines };
}

function setSaveState(state: 'saved' | 'saving' | 'error') {
  if (saveStatus.dataset.state === state) {
    return;
  }

  saveStatus.dataset.state = state;

  if (state === 'saving') {
    saveStatus.textContent = 'Saving...';
    return;
  }

  if (state === 'error') {
    saveStatus.textContent = 'Not saved';
    return;
  }

  saveStatus.textContent = 'Saved';
}

function setQueueSaveState(state: 'saved' | 'saving' | 'error') {
  if (queueSaveStatus.dataset.state === state) {
    return;
  }

  queueSaveStatus.dataset.state = state;

  if (state === 'saving') {
    queueSaveStatus.textContent = 'Saving...';
    return;
  }

  if (state === 'error') {
    queueSaveStatus.textContent = 'Not saved';
    return;
  }

  queueSaveStatus.textContent = 'Saved';
}

function updateCounts(enabled: number, disabled: number, invalid: number) {
  if (enabled === 0 && disabled === 0 && invalid === 0) {
    countStatus.textContent = 'No URLs yet';
    return;
  }

  const parts = [`${enabled} enabled`, `${disabled} disabled`];
  if (invalid > 0) {
    parts.push(`${invalid} invalid`);
  }
  countStatus.textContent = parts.join(' | ');
}

function updateQueueCounts(count: number, invalid: number) {
  if (count === 0 && invalid === 0) {
    queueCountStatus.textContent = 'Queue empty';
    return;
  }

  const parts = [`${count} in queue`];
  if (invalid > 0) {
    parts.push(`${invalid} invalid`);
  }
  queueCountStatus.textContent = parts.join(' | ');
}

function showError(invalidLines: number[]) {
  if (invalidLines.length === 0) {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    setFieldValidity(textarea, false);
    return;
  }

  const lineLabel = invalidLines.length === 1 ? 'line' : 'lines';
  errorMessage.textContent = `Invalid URL on ${lineLabel}: ${invalidLines.join(', ')}. Fix to save.`;
  errorMessage.classList.remove('hidden');
  setFieldValidity(textarea, true);
}

function showQueueError(invalidLines: number[]) {
  if (invalidLines.length === 0) {
    queueErrorMessage.classList.add('hidden');
    queueErrorMessage.textContent = '';
    setFieldValidity(queueTextarea, false);
    return;
  }

  const lineLabel = invalidLines.length === 1 ? 'line' : 'lines';
  queueErrorMessage.textContent = `Invalid URL on ${lineLabel}: ${invalidLines.join(', ')}. Fix to save.`;
  queueErrorMessage.classList.remove('hidden');
  setFieldValidity(queueTextarea, true);
}

async function saveFromTextarea() {
  const { entries, invalidLines, enabledCount, disabledCount } = parseUrlText(textarea.value);

  updateCounts(enabledCount, disabledCount, invalidLines.length);

  if (invalidLines.length > 0) {
    setSaveState('error');
    showError(invalidLines);
    return;
  }

  showError([]);
  await saveUrls(entries);
  setSaveState('saved');
}

async function saveQueueFromTextarea() {
  const { entries, invalidLines } = parseQueueText(queueTextarea.value);

  updateQueueCounts(entries.length, invalidLines.length);

  if (invalidLines.length > 0) {
    setQueueSaveState('error');
    showQueueError(invalidLines);
    return;
  }

  showQueueError([]);
  await saveQueue(entries);
  setQueueSaveState('saved');
  isQueueDirty = false;
}

function scheduleSave() {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }

  setSaveState('saving');
  errorMessage.classList.add('hidden');
  setFieldValidity(textarea, false);
  saveTimer = window.setTimeout(() => {
    void saveFromTextarea();
  }, SAVE_DELAY_MS);
}

function scheduleQueueSave() {
  if (queueSaveTimer) {
    window.clearTimeout(queueSaveTimer);
  }

  setQueueSaveState('saving');
  queueErrorMessage.classList.add('hidden');
  setFieldValidity(queueTextarea, false);
  isQueueDirty = true;
  queueSaveTimer = window.setTimeout(() => {
    void saveQueueFromTextarea();
  }, SAVE_DELAY_MS);
}

async function resetQueue() {
  if (queueSaveTimer) {
    window.clearTimeout(queueSaveTimer);
  }

  queueTextarea.value = '';
  showQueueError([]);
  updateQueueCounts(0, 0);
  setQueueSaveState('saving');
  await clearQueue();
  setQueueSaveState('saved');
}

function applyQueueUpdate(queue: string[]) {
  if (queueSaveTimer) {
    window.clearTimeout(queueSaveTimer);
  }

  queueTextarea.value = formatQueue(queue);
  updateQueueCounts(queue.length, 0);
  showQueueError([]);
  setQueueSaveState('saved');
  isQueueDirty = false;
}

async function init() {
  const [urls, queue] = await Promise.all([getUrls(), getQueue()]);
  textarea.value = formatUrls(urls);

  const counts = countUrls(urls);
  updateCounts(counts.enabled, counts.disabled, 0);
  setSaveState('saved');

  applyQueueUpdate(queue);

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync' || !changes.queue) {
      return;
    }

    if (document.activeElement === queueTextarea || isQueueDirty) {
      return;
    }

    const nextQueue = changes.queue.newValue as string[] | undefined;
    applyQueueUpdate(nextQueue ?? []);
  });
}

textarea.addEventListener('input', scheduleSave);
textarea.addEventListener('blur', () => {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }
  void saveFromTextarea();
});

queueTextarea.addEventListener('input', scheduleQueueSave);
queueTextarea.addEventListener('blur', () => {
  if (queueSaveTimer) {
    window.clearTimeout(queueSaveTimer);
  }
  void saveQueueFromTextarea();
  isQueueDirty = false;
});

queueResetButton.addEventListener('click', () => {
  void resetQueue();
});

void init();
