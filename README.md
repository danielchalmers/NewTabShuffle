# 🔀 New Tab Shuffle

A Chrome/Edge extension that replaces the new tab page with a randomly selected URL or local file from your list.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ofoclldedbmoenojkhnddkacilcapaee)](https://chromewebstore.google.com/detail/ofoclldedbmoenojkhnddkacilcapaee)
[![Privacy Policy](https://img.shields.io/badge/privacy-policy-blue.svg)](PRIVACY_POLICY.md)
[![Build Status](https://github.com/danielchalmers/newtabshuffle/actions/workflows/ci.yml/badge.svg)](https://github.com/danielchalmers/newtabshuffle/actions/workflows/ci.yml)
[![Latest Release](https://img.shields.io/github/v/release/danielchalmers/newtabshuffle)](https://github.com/danielchalmers/newtabshuffle/releases/latest)

New tabs pull from a shuffled queue so every enabled entry appears once before the list reshuffles.

## ✅ Features

- Shuffled queue that cycles through enabled URLs before reshuffling.
- Inline options editor with auto-save.
- Disable entries by prefixing with `#` and remove entries by deleting a line.
- Supports `http://`, `https://`, and `file://` URLs.
- Syncs list and queue via `chrome.storage.sync`.
- Popup preview of the next items in the queue.

## 🚀 Usage

1. Open the extension options (Extensions menu -> New Tab Shuffle -> Options).
2. Paste URLs one per line. Prefix a line with `#` to disable it. Delete a line to remove it.
3. Open a new tab to load the next URL. Use the popup to preview the queue or the options page to clear it.

## 🙌 Credits

- TypeScript — Apache-2.0
- Vite — MIT
- Vitest — MIT
- App icon created by Vectors Market - Flaticon
