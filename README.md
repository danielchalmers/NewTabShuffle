# NewTab Shuffle

A Chrome/Edge browser extension that randomly displays URLs or local files every time you open a new tab.

## Features

- 🎲 **Random Selection**: Automatically displays a random URL from your list on each new tab
- 📝 **Easy Management**: Simple interface to add, edit, enable/disable, and remove URLs
- 🔄 **Sync Support**: URLs sync across your devices using Chrome Sync
- 🎨 **Clean UI**: Minimalist design that stays out of your way
- 🔒 **Privacy First**: Minimal permissions required (only storage)

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/danielchalmers/NewTabShuffle.git
   cd NewTabShuffle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome/Edge:
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

## Usage

### Adding URLs

1. Click the extension icon or right-click the icon and select "Options"
2. Enter a URL in the input field (supports `http://`, `https://`, and `file://`)
3. Click "Add URL"

### Managing URLs

- **Enable/Disable**: Click the checkbox next to a URL to toggle it
- **Edit**: Click on a URL to edit it inline
- **Delete**: Click the "Delete" button to remove a URL

### Supported URL Types

- **Web URLs**: `https://example.com`, `http://localhost:3000`
- **Local Files**: `file:///path/to/file.html`

> **Note**: For `file://` URLs to work, you need to enable "Allow access to file URLs" in the extension settings.

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
npm install
```

### Development Mode

Build and watch for changes:

```bash
npm run dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Project Structure

```
NewTabShuffle/
├── src/
│   ├── lib/              # Core library modules
│   │   ├── storage.ts    # Chrome Storage API wrapper
│   │   └── randomizer.ts # URL randomization logic
│   ├── newtab/           # New tab page
│   ├── options/          # Options page
│   ├── icons/            # Extension icons
│   └── manifest.json     # Extension manifest
├── tests/                # Vitest test files
├── dist/                 # Build output (generated)
└── package.json
```

## Technology Stack

- **Build Tool**: Vite - Fast, modern build tool
- **Language**: TypeScript - Type-safe JavaScript
- **Testing**: Vitest - Fast unit test framework
- **Extension API**: Chrome Extension Manifest V3

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [Daniel Chalmers](https://github.com/danielchalmers)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/danielchalmers/NewTabShuffle/issues) on GitHub.