# AGENTS.md

This file provides guidance for AI coding agents working on this project.

## Project Overview

New Tab Shuffle is a Chrome/Edge browser extension that randomly displays URLs or local files when opening a new tab. Users can manage a list of URLs through the options page, and each new tab will randomly select and display one of the enabled URLs.

## Architecture

### Technology Stack
- **Build Tool**: Vite for fast development and optimized builds
- **Language**: TypeScript for type safety
- **Testing**: Vitest for unit testing
- **Browser APIs**: Chrome Extension Manifest V3

### Project Structure
```
src/
├── lib/              # Core library modules
│   ├── storage.ts    # Chrome Storage API wrapper
│   └── randomizer.ts # URL randomization logic
├── newtab/           # New tab page
│   ├── index.html
│   ├── newtab.ts
│   └── newtab.css
├── options/          # Options/settings page
│   ├── index.html
│   ├── options.ts
│   └── options.css
├── icons/            # Extension icons
└── manifest.json     # Extension manifest

tests/                # Vitest test files
```

### Key Design Principles
1. **Separation of Concerns**: Core logic in `lib/`, UI in separate directories
2. **Type Safety**: Full TypeScript coverage with strict mode
3. **Testability**: Pure functions in lib modules, comprehensive unit tests
4. **User Experience**: Clean, intuitive UI with inline editing

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Build in watch mode for development
npm run build        # Production build
npm test             # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Extension Loading

After building:
1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` directory

## Code Conventions

- Use TypeScript with strict type checking
- Prefer async/await over promises
- Use const for variables that don't change
- Follow existing code style and patterns
- Write tests for new functionality in lib/

## Testing Strategy

- Unit tests for all lib/ modules
- Mock Chrome APIs in tests
- Test edge cases and error conditions
- Maintain high code coverage

## Chrome Extension Specifics

- Uses Manifest V3
- Overrides new tab page with `chrome_url_overrides`
- Stores data using `chrome.storage.sync` for cross-device sync
- Minimal permissions (only storage)

## Common Tasks

### Adding a new URL validation rule
1. Update `validateUrl()` in `src/lib/randomizer.ts`
2. Add corresponding tests in `tests/randomizer.test.ts`

### Modifying storage format
1. Update `UrlEntry` interface in `src/lib/storage.ts`
2. Update storage functions as needed
3. Update tests in `tests/storage.test.ts`
4. Consider migration strategy for existing users

### Changing UI
1. Update HTML/CSS in respective directories
2. Update TypeScript if logic changes
3. Test manually by loading extension

## Known Limitations

- file:// URLs require special permissions in Chrome
- Extension cannot access chrome:// pages
- Storage sync has size limits (Chrome imposes quotas)

## Future Enhancements

Potential areas for expansion:
- Import/export URL lists
- URL categories/tags
- Custom scheduling (time-based URL selection)
- Preview before display
- Analytics/usage tracking
