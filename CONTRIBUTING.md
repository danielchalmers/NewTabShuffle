# Contributing to NewTab Shuffle

Thank you for your interest in contributing to NewTab Shuffle! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment for all contributors

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/NewTabShuffle.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Process

### Setting Up Your Environment

```bash
# Install dependencies
npm install

# Start development mode (watch for changes)
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build the extension
npm run build
```

### Testing Your Changes

1. Load the extension in Chrome/Edge:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

2. Test your changes thoroughly:
   - Add various types of URLs
   - Open new tabs to verify randomization
   - Test edge cases (empty list, disabled URLs, etc.)

### Code Style

- Use TypeScript with strict type checking
- Follow existing code formatting
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Writing Tests

- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage
- Tests should be in the `tests/` directory
- Use descriptive test names

Example test structure:
```typescript
describe('feature', () => {
  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Submitting Changes

### Pull Request Process

1. Update the README.md if needed
2. Run all tests: `npm test`
3. Build the extension: `npm run build`
4. Commit your changes with a clear message
5. Push to your fork
6. Submit a Pull Request

### Pull Request Guidelines

- **Title**: Clear, concise description of changes
- **Description**: 
  - What changed and why
  - How to test the changes
  - Any breaking changes
  - Screenshots for UI changes
- **Tests**: Include relevant tests
- **Documentation**: Update docs as needed

### Commit Messages

Use clear, descriptive commit messages:

```
Add feature to export URL list

- Implemented export to JSON functionality
- Added export button to options page
- Included unit tests for export function
```

## Types of Contributions

### Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser version and OS
- Screenshots if applicable

### Feature Requests

When requesting features:
- Describe the feature and use case
- Explain why it would be valuable
- Consider implementation complexity
- Be open to discussion

### Code Contributions

Areas where contributions are welcome:
- Bug fixes
- New features (discuss first in an issue)
- Performance improvements
- Test coverage improvements
- Documentation improvements
- UI/UX enhancements

## Project Structure

```
src/
├── lib/              # Core business logic
│   ├── storage.ts    # Chrome Storage API wrapper
│   └── randomizer.ts # URL randomization logic
├── newtab/           # New tab page
├── options/          # Options page
├── icons/            # Extension icons
└── manifest.json     # Extension manifest

tests/                # Unit tests
```

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion in the repository
- Reach out to the maintainers

Thank you for contributing! 🎉
