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

### Using Pre-built Package

1. Build a package:
   ```bash
   npm run package
   ```
   
2. This creates `newtab-shuffle.zip` which you can:
   - Unzip and load as an unpacked extension
   - Upload to Chrome Web Store (for distribution)

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

> **Note**: For `file://` URLs to work, you need to enable "Allow access to file URLs" in the extension settings (`chrome://extensions/` → Details → Allow access to file URLs).

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
│   │   ├── index.html
│   │   ├── newtab.ts
│   │   └── newtab.css
│   ├── options/          # Options page
│   │   ├── index.html
│   │   ├── options.ts
│   │   └── options.css
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

## Scripts

- `npm run dev` - Build in watch mode for development
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run package` - Build and create distributable ZIP file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Build the extension (`npm run build`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

Created by [Daniel Chalmers](https://github.com/danielchalmers)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/danielchalmers/NewTabShuffle/issues) on GitHub.

## Roadmap

Potential future enhancements:
- Import/export URL lists
- URL categories/tags
- Custom scheduling (time-based URL selection)
- Preview URLs before display
- Usage statistics