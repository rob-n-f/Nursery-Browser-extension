# Privacy Policy — Nursery Media Downloader (v1.4.0)

**Effective Date:** November 2026  
**Extension Name:** Nursery Media Downloader  
**Supported Browsers:** Google Chrome, Microsoft Edge, Mozilla Firefox (Manifest V3)

---

## 1. Summary: Zero Telemetry & 100% Local Processing

**Nursery Media Downloader** does **not** collect, transmit, store, share, or sell any personal data, browsing history, credentials, photos, or analytics to any external server or third party. Every operation happens 100% locally inside your web browser on your own device.

## 2. How Media & Metadata Are Processed

1. **In-Page Discovery:** When you visit an authorized nursery portal (`*.brighthorizons.co.uk`, `*.brighthorizons.com`, `*.famly.co`, `*.famly.com`, `*.famly.dk`, `*.famly.net`), the content script inspects the page DOM locally to identify photo and video URLs and their post dates.
2. **EXIF Datestamp Injection:** When downloading JPEG photos, the background worker reads the image bytes in local memory, inserts the capture date into the standard `APP1` EXIF tags (`DateTimeOriginal`, `DateTimeDigitized`, `DateTime`), and saves the file directly to your computer's `Downloads` folder.
3. **Direct Video Streaming:** Video files (`.mp4`, `.mov`) are passed directly to your browser's native download manager (`chrome.downloads`) without intermediate external proxying.

## 3. Browser Permissions & Justification

* **`downloads`**: Required exclusively to save discovered high-resolution photos and videos into your local `Downloads/Nursery_Photos/` subfolder.
* **`storage`**: Required exclusively to persist your local preferences (subfolder name, filename pattern, save dialog toggle) via `chrome.storage.sync` and your locally saved URL deduplication list via `chrome.storage.local`.
* **`activeTab`**: Required to communicate between the toolbar popup and the active nursery portal tab when you click the extension icon.
* **`host_permissions`**: Strictly scoped to Bright Horizons (`*.brighthorizons.co.uk`, `*.brighthorizons.com`), Famly (`*.famly.co`, `*.famly.com`, `*.famly.dk`, `*.famly.net`), and their media CDNs (`*.cloudfront.net`, `*.amazonaws.com`) to discover feed media and read image headers for EXIF datestamping.

## 4. Third-Party Sharing & Analytics

* **No Analytics / Tracking SDKs:** The extension contains zero tracking scripts, telemetry beacons, or remote code.
* **No Remote Servers:** The extension never communicates with any developer-operated server.

## 5. User Control & Data Deletion

You can clear your saved settings or local download history at any time via the Extension Options page or by uninstalling the extension from your browser.
