import { getUrls, saveUrls } from '../lib/storage';
import { validateUrl } from '../lib/randomizer';
import type { UrlEntry } from '../lib/storage';

const textarea = document.getElementById('urls-textarea') as HTMLTextAreaElement;
const saveStatus = document.getElementById('save-status') as HTMLSpanElement;
const countStatus = document.getElementById('count-status') as HTMLSpanElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

const SAVE_DELAY_MS = 500;
let saveTimer: number | undefined;

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

function setSaveState(state: 'saved' | 'saving' | 'error') {
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

function showError(invalidLines: number[]) {
  if (invalidLines.length === 0) {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    return;
  }

  const lineLabel = invalidLines.length === 1 ? 'line' : 'lines';
  errorMessage.textContent = `Invalid URL on ${lineLabel}: ${invalidLines.join(', ')}. Fix to save.`;
  errorMessage.classList.remove('hidden');
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

function scheduleSave() {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }

  setSaveState('saving');
  errorMessage.classList.add('hidden');
  saveTimer = window.setTimeout(() => {
    void saveFromTextarea();
  }, SAVE_DELAY_MS);
}

async function init() {
  const urls = await getUrls();
  textarea.value = formatUrls(urls);

  const counts = countUrls(urls);
  updateCounts(counts.enabled, counts.disabled, 0);
  setSaveState('saved');
}

textarea.addEventListener('input', scheduleSave);
textarea.addEventListener('blur', () => {
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }
  void saveFromTextarea();
});

void init();
