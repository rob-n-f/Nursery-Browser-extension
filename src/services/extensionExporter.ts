import JSZip from 'jszip';
import { EXTENSION_FILES, FIREFOX_MANIFEST_JSON } from '../extension-files/extensionData';

/**
 * Generates an extension icon PNG blob using HTML Canvas.
 */
function createExtensionIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(new Blob([], { type: 'image/png' }));
      return;
    }

    // Background rounded squircle
    const radius = size * 0.22;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();

    // Vibrant gradient background (famly teal / emerald)
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(1, '#16a34a');
    ctx.fillStyle = grad;
    ctx.fill();

    // Camera / Picture icon glyph
    ctx.fillStyle = '#ffffff';
    const padding = size * 0.24;
    const boxW = size - padding * 2;
    const boxH = boxW * 0.75;
    const boxY = (size - boxH) / 2 + size * 0.05;

    // Camera body
    ctx.beginPath();
    ctx.roundRect(padding, boxY, boxW, boxH, size * 0.1);
    ctx.fill();

    // Camera lens ring
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(size / 2, boxY + boxH / 2, boxH * 0.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, boxY + boxH / 2, boxH * 0.15, 0, Math.PI * 2);
    ctx.fill();

    canvas.toBlob((blob) => {
      resolve(blob || new Blob([], { type: 'image/png' }));
    }, 'image/png');
  });
}

const README_CONTENT = `# Nursery Media Downloader Extension (Chrome & Edge MV3)

A Manifest V3 Chromium Extension to bulk download high-resolution photos and videos with original dates from Bright Horizons FamilyApp, Famly, and supported nursery feeds.

## Features
- **Full-Res Master Images:** Upscales 200x200 / cropped CDN thumbnails to full 1920x1080 resolution.
- **Embedded EXIF Datestamping (Default):** Injects \`DateTimeOriginal\` (\`YYYY:MM:DD 12:00:00\`) directly into image byte headers so Google Photos, Apple Photos, and Windows/Mac file explorers sort every nursery photo on its exact chronological date.
- **Original Date Naming:** Formats filenames with post dates (\`YYYY-MM-DD_media_001.jpg\`) from CDN archive paths or post timestamps.
- **Auto-Feed Loader:** Automatically scrolls feed and clicks "Load more" to harvest months or years of nursery photos.
- **Local Batch Download:** Direct to your computer via \`chrome.downloads\` API (stored neatly in \`Nursery_Photos/\`).
- **Online Photo Gallery Sync:** Easily choose your download folder in Settings to sync with Google Drive, iCloud Photos, or OneDrive.

---

## 🛠️ Installation Instructions (Chrome & Edge)

1. **Unzip** this archive into a folder on your computer.
2. In Google Chrome open \`chrome://extensions\`, or in Microsoft Edge open \`edge://extensions\`.
3. Turn **ON** the **Developer mode** toggle.
4. Click the **Load unpacked** button.
5. Select the unzipped extension folder.
6. Done! Pin the extension to your browser toolbar.
`;

const FIREFOX_README_CONTENT = `# Nursery Media Downloader (Mozilla Firefox MV3)

A Manifest V3 Mozilla Firefox WebExtension to bulk download high-resolution photos and videos with original dates from Bright Horizons FamilyApp, Famly, and supported nursery feeds.

## Features
- **Full-Res Master Images:** Automatically downloads the full 1920x1080 resolution master photo.
- **Embedded EXIF Datestamping:** Embeds original capture dates directly into image metadata for Google Photos, Apple Photos, and file timelines.
- **Firefox Compatible:** Pre-configured with Gecko Add-on ID and standard background script loading for Firefox.

---

## 🦊 How to Install in Mozilla Firefox (Takes 30 Seconds)

1. **Unzip** this archive to a folder on your computer.
2. Open Mozilla Firefox and enter in the address bar: \`about:debugging#/runtime/this-firefox\`
3. Click the **"Load Temporary Add-on..."** button.
4. Select the \`manifest.json\` file inside the unzipped folder.
5. The extension is now loaded and running in Firefox!
6. Navigate to \`https://familyapp.brighthorizons.co.uk\` or \`https://app.famly.co\` to start downloading.
`;

/**
 * Builds the zip archive and triggers a browser download.
 */
export async function downloadExtensionZip(targetBrowser: 'chromium' | 'firefox' = 'chromium'): Promise<void> {
  const zip = new JSZip();

  // Add all code files
  for (const file of EXTENSION_FILES) {
    if (file.path === 'manifest.json' && targetBrowser === 'firefox') {
      zip.file('manifest.json', FIREFOX_MANIFEST_JSON);
    } else {
      zip.file(file.path, file.content);
    }
  }

  // Generate and add icons
  const icon16Blob = await createExtensionIconBlob(16);
  const icon48Blob = await createExtensionIconBlob(48);
  const icon128Blob = await createExtensionIconBlob(128);

  const iconsFolder = zip.folder('icons');
  if (iconsFolder) {
    iconsFolder.file('icon16.png', icon16Blob);
    iconsFolder.file('icon48.png', icon48Blob);
    iconsFolder.file('icon128.png', icon128Blob);
  }

  const readme = targetBrowser === 'firefox' ? FIREFOX_README_CONTENT : README_CONTENT;
  zip.file('README.md', readme);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const fileName = targetBrowser === 'firefox'
    ? 'nursery-media-downloader-firefox-mv3.zip'
    : 'nursery-media-downloader-chrome-edge-mv3.zip';

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
