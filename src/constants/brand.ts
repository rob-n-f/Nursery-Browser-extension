/**
 * Central Brand, Versioning, and Store Compliance Configuration
 * Single source of truth across Web App, Extension Package, and Store Kit.
 */

export const BRAND = {
  name: 'Nursery Media Downloader',
  shortName: 'Nursery Downloader',
  slug: 'nursery-media-downloader',
  version: '1.4.0',
  manifestVersion: 3,
  tagline: 'Bulk 1080p photo & video archiver with embedded EXIF datestamps for Famly & Bright Horizons FamilyApp',
  subtitle: 'Bright Horizons FamilyApp & Famly Archiver',
  defaultFolder: 'Nursery_Photos',
  defaultNamingPattern: '{date}_media_{index}',
  geckoAddonId: 'nursery-media-downloader@robinfowler.addon',
  zipFileNames: {
    chromium: 'nursery-media-downloader-chrome-edge-mv3.zip',
    firefox: 'nursery-media-downloader-firefox-mv3.zip',
  },
  colors: {
    sky: '#0284c7',
    teal: '#0d9488',
    emerald: '#16a34a',
    slateDark: '#0f172a',
  },
  supportedDomains: [
    'familyapp.brighthorizons.co.uk',
    'brighthorizons.com',
    'app.famly.co',
    'famly.com',
    'famly.dk',
    'famly.net',
  ],
} as const;

export const PRIVACY_POLICY_MD = `# Privacy Policy — ${BRAND.name} (v${BRAND.version})

**Effective Date:** November 2026  
**Extension Name:** ${BRAND.name}  
**Supported Browsers:** Google Chrome, Microsoft Edge, Mozilla Firefox (Manifest V3)

---

## 1. Summary: Zero Telemetry & 100% Local Processing

**${BRAND.name}** does **not** collect, transmit, store, share, or sell any personal data, browsing history, credentials, photos, or analytics to any external server or third party. Every operation happens 100% locally inside your web browser on your own device.

## 2. How Media & Metadata Are Processed

1. **In-Page Discovery:** When you visit an authorized nursery portal (\`*.brighthorizons.co.uk\`, \`*.brighthorizons.com\`, \`*.famly.co\`, \`*.famly.com\`, \`*.famly.dk\`, \`*.famly.net\`), the content script inspects the page DOM locally to identify photo and video URLs and their post dates.
2. **EXIF Datestamp Injection:** When downloading JPEG photos, the background worker reads the image bytes in local memory, inserts the capture date into the standard \`APP1\` EXIF tags (\`DateTimeOriginal\`, \`DateTimeDigitized\`, \`DateTime\`), and saves the file directly to your computer's \`Downloads\` folder.
3. **Direct Video Streaming:** Video files (\`.mp4\`, \`.mov\`) are passed directly to your browser's native download manager (\`chrome.downloads\`) without intermediate external proxying.

## 3. Browser Permissions & Justification

* **\`downloads\`**: Required exclusively to save discovered high-resolution photos and videos into your local \`Downloads/${BRAND.defaultFolder}/\` subfolder.
* **\`storage\`**: Required exclusively to persist your local preferences (subfolder name, filename pattern, save dialog toggle) via \`chrome.storage.sync\` and your locally saved URL deduplication list via \`chrome.storage.local\`.
* **\`activeTab\`**: Required to communicate between the toolbar popup and the active nursery portal tab when you click the extension icon.
* **\`host_permissions\`**: Strictly scoped to Bright Horizons (\`*.brighthorizons.co.uk\`, \`*.brighthorizons.com\`), Famly (\`*.famly.co\`, \`*.famly.com\`, \`*.famly.dk\`, \`*.famly.net\`), and their media CDNs (\`*.cloudfront.net\`, \`*.amazonaws.com\`) to discover feed media and read image headers for EXIF datestamping.

## 4. Third-Party Sharing & Analytics

* **No Analytics / Tracking SDKs:** The extension contains zero tracking scripts, telemetry beacons, or remote code.
* **No Remote Servers:** The extension never communicates with any developer-operated server.

## 5. User Control & Data Deletion

You can clear your saved settings or local download history at any time via the Extension Options page or by uninstalling the extension from your browser.
`;

export const STORE_LISTING_MD = `# Store Submission & Review Guide — ${BRAND.name} (v${BRAND.version})

Use the pre-written disclosures below when submitting **${BRAND.name}** to the **Chrome Web Store Developer Console**, **Microsoft Edge Partner Center**, or **Mozilla Add-ons (AMO)**.

---

## Single-Purpose Description
> ${BRAND.name} has a single, clear purpose: allowing parents and guardians to bulk-download high-resolution photos and videos of their children from their authenticated Famly and Bright Horizons FamilyApp nursery feeds directly to their local computer with original capture dates preserved in EXIF metadata and filenames.

## Permission Justifications

| Permission | Store Review Justification |
| :--- | :--- |
| **\`downloads\`** | Saves high-resolution nursery photos and videos directly into the user's local \`Downloads/${BRAND.defaultFolder}\` folder using \`chrome.downloads.download\`. |
| **\`storage\`** | Stores user preferences (destination subfolder name, filename pattern, and Save-As prompt preference) in \`chrome.storage.sync\` and tracks previously downloaded media URLs in \`chrome.storage.local\`. |
| **\`activeTab\`** | Allows the extension action popup to query media queue counts and trigger batch downloads or feed auto-scrolling on the currently active nursery tab. |
| **\`host_permissions\`** | Scoped strictly to Famly (\`*.famly.co\`, \`*.famly.com\`, \`*.famly.dk\`, \`*.famly.net\`), Bright Horizons (\`*.brighthorizons.co.uk\`, \`*.brighthorizons.com\`), and their media delivery CDNs (\`*.cloudfront.net\`, \`*.amazonaws.com\`) to detect feed media and inject original capture dates into JPEG EXIF headers prior to saving. |

## Mozilla Firefox AMO Compliance Notes
* **Gecko Add-on ID:** \`${BRAND.geckoAddonId}\`
* **Data Collection Disclosure:** \`browser_specific_settings.gecko.data_collection_permissions.required = ["none"]\`
* **DOM Safety:** All in-page UI elements are constructed via \`document.createElement\` (zero \`innerHTML\` assignments) to pass \`addons-linter\` with zero warnings.
`;
