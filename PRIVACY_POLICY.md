# Privacy Policy

The extension replaces the new tab page with a randomly selected item from a list you manage, cycling through all enabled entries before reshuffling. It does not provide any unrelated features, tracking, or external services.

## Permission justification

- `storage`: Required to save your URL list and the shuffled queue so the extension can consistently rotate through your entries across browser sessions and devices.
- `file:///*`: Optional access to local files you choose, enabled only if you turn on "Allow access to file URLs" in the extension details.

## Data we store

- The list of URLs you enter, including enabled or disabled state.
- The current shuffled queue order.

This data is stored with `chrome.storage.sync` so it can sync across devices signed into the same browser profile. The browser may also keep a local copy.

## Data we do not collect

- No analytics, tracking, advertising IDs, or browsing history.
- No data is sent to external servers by the extension.

## Third-party content

When a URL loads in a new tab, that website may collect data according to its own policies. The extension does not control or share that data.

## Your choices

- Edit or delete URLs in the options page at any time.
- Clear the queue in the options page.
- Uninstall the extension to remove stored data.

## Contact

For questions or concerns, open an issue at https://github.com/danielchalmers/newtabshuffle/issues.
