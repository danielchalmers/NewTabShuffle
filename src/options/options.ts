import { getUrls, addUrl, removeUrl, toggleUrl, updateUrl } from '../lib/storage';
import { validateUrl } from '../lib/randomizer';

const urlInput = document.getElementById('url-input') as HTMLInputElement;
const addButton = document.getElementById('add-button') as HTMLButtonElement;
const urlList = document.getElementById('url-list') as HTMLDivElement;
const emptyMessage = document.getElementById('empty-message') as HTMLParagraphElement;

async function renderUrls() {
  const urls = await getUrls();
  
  if (urls.length === 0) {
    urlList.innerHTML = '';
    emptyMessage.classList.remove('hidden');
    return;
  }
  
  emptyMessage.classList.add('hidden');
  
  urlList.innerHTML = urls.map((entry, index) => `
    <div class="url-item ${entry.enabled ? '' : 'disabled'}">
      <div class="url-checkbox">
        <input 
          type="checkbox" 
          ${entry.enabled ? 'checked' : ''} 
          data-index="${index}"
          class="toggle-checkbox"
        />
      </div>
      <div class="url-content">
        <input 
          type="text" 
          value="${escapeHtml(entry.url)}" 
          data-index="${index}"
          class="url-edit-input"
        />
      </div>
      <div class="url-actions">
        <button class="delete-button" data-index="${index}">Delete</button>
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  document.querySelectorAll('.toggle-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', handleToggle);
  });
  
  document.querySelectorAll('.delete-button').forEach((button) => {
    button.addEventListener('click', handleDelete);
  });
  
  document.querySelectorAll('.url-edit-input').forEach((input) => {
    input.addEventListener('blur', handleEdit);
  });
}

async function handleAdd() {
  const url = urlInput.value.trim();
  
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  
  if (!validateUrl(url)) {
    alert('Please enter a valid URL (must start with http://, https://, or file://)');
    return;
  }
  
  await addUrl(url);
  urlInput.value = '';
  await renderUrls();
}

async function handleToggle(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  const index = parseInt(checkbox.dataset.index || '0', 10);
  await toggleUrl(index);
  await renderUrls();
}

async function handleDelete(event: Event) {
  const button = event.target as HTMLButtonElement;
  const index = parseInt(button.dataset.index || '0', 10);
  
  if (confirm('Are you sure you want to delete this URL?')) {
    await removeUrl(index);
    await renderUrls();
  }
}

async function handleEdit(event: Event) {
  const input = event.target as HTMLInputElement;
  const index = parseInt(input.dataset.index || '0', 10);
  const newUrl = input.value.trim();
  
  if (!newUrl) {
    alert('URL cannot be empty');
    await renderUrls();
    return;
  }
  
  if (!validateUrl(newUrl)) {
    alert('Please enter a valid URL (must start with http://, https://, or file://)');
    await renderUrls();
    return;
  }
  
  const urls = await getUrls();
  await updateUrl(index, { ...urls[index], url: newUrl });
  await renderUrls();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
addButton.addEventListener('click', handleAdd);
urlInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleAdd();
  }
});

// Initial render
renderUrls();
