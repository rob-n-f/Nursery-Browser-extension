import JSZip from 'jszip';
import { EXTENSION_FILES, FIREFOX_MANIFEST_JSON } from '../extension-files/extensionData';
import { BRAND, PRIVACY_POLICY_MD, STORE_LISTING_MD } from '../constants/brand';

/**
 * Draws the official Nursery Media Downloader vector emblem onto a 2D canvas of any square dimension.
 * Matches BrandLogo.tsx down to the camera prism, multi-ring lens, specular glint, and download badge.
 */
export function drawBrandIconOnCanvas(canvas: HTMLCanvasElement, size: number): void {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = (v: number) => (v / 128) * size;
  ctx.clearRect(0, 0, size, size);

  // 1. Squircle Base with 3-stop gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0369a1');
  grad.addColorStop(0.48, '#0d9488');
  grad.addColorStop(1, '#16a34a');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(s(4), s(4), s(120), s(120), s(28));
  ctx.fill();

  // Inner subtle highlight rim
  if (size >= 32) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = Math.max(1, s(2));
    ctx.beginPath();
    ctx.roundRect(s(6), s(6), s(116), s(116), s(26));
    ctx.stroke();
  }

  // 2. Camera Top Viewfinder Prism & Golden Shutter Button
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(s(44), s(31), s(28), s(13), [s(6), s(6), 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.roundRect(s(78), s(34), s(12), s(5), s(2.5));
  ctx.fill();

  // 3. Camera Main Body
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(s(24), s(40), s(80), s(56), s(14));
  ctx.fill();

  // 4. Outer Lens Barrel
  const lensGrad = ctx.createLinearGradient(s(44), s(48), s(84), s(88));
  lensGrad.addColorStop(0, '#0f172a');
  lensGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = lensGrad;
  ctx.beginPath();
  ctx.arc(s(60), s(68), s(21), 0, Math.PI * 2);
  ctx.fill();

  // Aperture ring
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = Math.max(1, s(2));
  ctx.beginPath();
  ctx.arc(s(60), s(68), s(15.5), 0, Math.PI * 2);
  ctx.stroke();

  // Inner lens core & specular glints
  ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.beginPath();
  ctx.arc(s(60), s(68), s(9.5), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.arc(s(54), s(62), s(3.5), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
  ctx.beginPath();
  ctx.arc(s(65), s(73), s(1.8), 0, Math.PI * 2);
  ctx.fill();

  // Flash indicator
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(s(89), s(51), s(3.5), 0, Math.PI * 2);
  ctx.fill();

  // 5. Download / Archive Badge in Bottom-Right
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(s(94), s(86), s(16), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(s(94), s(86), s(13.5), 0, Math.PI * 2);
  ctx.fill();

  // Arrow glyph inside badge
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = Math.max(1.2, s(2.8));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(s(94), s(79));
  ctx.lineTo(s(94), s(90));
  ctx.moveTo(s(89), s(85));
  ctx.lineTo(s(94), s(90));
  ctx.lineTo(s(99), s(85));
  ctx.moveTo(s(88), s(93.5));
  ctx.lineTo(s(100), s(93.5));
  ctx.stroke();
}

/**
 * Generates an extension icon PNG blob using HTML Canvas.
 */
export function createExtensionIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    drawBrandIconOnCanvas(canvas, size);
    canvas.toBlob((blob) => {
      resolve(blob || new Blob([], { type: 'image/png' }));
    }, 'image/png');
  });
}

/**
 * Renders the 440x280 Chrome Web Store / Edge Add-ons Promotional Tile onto a canvas.
 */
export function drawStorePromoTile(canvas: HTMLCanvasElement): void {
  const W = 440;
  const H = 280;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Deep slate-to-teal background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(0.55, '#0c4a6e');
  bg.addColorStop(1, '#064e3b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle decorative glow circles
  const glow = ctx.createRadialGradient(360, 70, 10, 360, 70, 160);
  glow.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
  glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Draw Brand Icon at top-left
  const iconCanvas = document.createElement('canvas');
  drawBrandIconOnCanvas(iconCanvas, 72);
  ctx.drawImage(iconCanvas, 32, 32, 64, 64);

  // Version & MV3 Pill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(112, 46, 196, 26, 13);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('CHROME • EDGE • FIREFOX MV3', 126, 63);

  // Main Headline
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Nursery Media', 32, 134);
  ctx.fillText('Downloader', 32, 164);

  // Subtitle
  ctx.fillStyle = '#bae6fd';
  ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('1920×1080 Master Photos & EXIF Dates', 32, 192);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('For Bright Horizons FamilyApp & Famly', 32, 212);

  // Feature Chips at bottom
  const chips = ['1080p Originals', 'EXIF DateTime', 'Auto-Scroll'];
  let chipX = 32;
  for (const label of chips) {
    const textW = ctx.measureText(label).width + 20;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.roundRect(chipX, 232, textW, 24, 6);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(label, chipX + 10, 248);
    chipX += textW + 8;
  }

  // Right-side floating mini preview card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(290, 96, 122, 130, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('1080p', 320, 134);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 10px sans-serif';
  ctx.fillText('EXIF EMBEDDED', 312, 152);

  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.roundRect(304, 174, 94, 32, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Save Batch', 321, 194);
}

/**
 * Renders the 1280x800 Annotated Store Listing Screenshot onto a canvas.
 */
export function drawStoreScreenshot(canvas: HTMLCanvasElement): void {
  const W = 1280;
  const H = 800;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(0.5, '#0c4a6e');
  bg.addColorStop(1, '#064e3b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Top Header Callout
  const iconCanvas = document.createElement('canvas');
  drawBrandIconOnCanvas(iconCanvas, 64);
  ctx.drawImage(iconCanvas, 72, 44, 56, 56);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`${BRAND.name} v${BRAND.version}`, 144, 74);

  ctx.fillStyle = '#7dd3fc';
  ctx.font = '500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Bulk 1920×1080 Master Photo & Video Archiver with Automatic EXIF Capture Dates • Zero Telemetry', 144, 102);

  // Simulated Browser Frame (x: 72, y: 136, w: 1136, h: 604)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(72, 136, 1136, 604, 18);
  ctx.fill();

  // Browser Window Controls
  const dots = ['#f43f5e', '#f59e0b', '#10b981'];
  dots.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(102 + idx * 20, 162, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // URL Bar
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(180, 148, 720, 28, 14);
  ctx.fill();
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('https://familyapp.brighthorizons.co.uk/news-feed  •  https://app.famly.co', 202, 166);

  // Content Area
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(74, 188, 1132, 550, [0, 0, 16, 16]);
  ctx.fill();

  // Left: Feed Cards
  for (let i = 0; i < 2; i++) {
    const cardY = 212 + i * 252;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(108, cardY, 680, 232, 14);
    ctx.fill();
    ctx.stroke();

    // Post Header
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(140, cardY + 32, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(i === 0 ? 'Pre-School • Oak Room Activity' : 'Outdoor Garden Exploration', 168, cardY + 28);
    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px monospace';
    ctx.fillText(i === 0 ? 'Captured: 2024-05-15 • 3 Master Photos (1920×1080)' : 'Captured: 2024-05-14 • 1080p HD Video + Photos', 168, cardY + 46);

    // 3 Photo Thumbnails inside Card
    for (let m = 0; m < 3; m++) {
      const thumbX = 128 + m * 214;
      const thumbY = cardY + 68;
      const thumbGrad = ctx.createLinearGradient(thumbX, thumbY, thumbX + 198, thumbY + 140);
      thumbGrad.addColorStop(0, m % 2 === 0 ? '#0369a1' : '#0f766e');
      thumbGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = thumbGrad;
      ctx.beginPath();
      ctx.roundRect(thumbX, thumbY, 198, 144, 10);
      ctx.fill();

      // 1920x1080 Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(thumbX + 10, thumbY + 10, 118, 22, 5);
      ctx.fill();
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('1920x1080 Master', thumbX + 18, thumbY + 25);

      // EXIF Stamp Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(thumbX + 10, thumbY + 112, 178, 22, 5);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 11px monospace';
      ctx.fillText(`EXIF: 2024:05:1${5 - i} 12:00`, thumbX + 18, thumbY + 127);
    }
  }

  // Right: Floating Extension Widget Overlay
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(828, 212, 344, 480, 16);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(iconCanvas, 852, 236, 36, 36);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(BRAND.name, 898, 254);
  ctx.fillStyle = '#34d399';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('In-Page Scraper & EXIF Engine Active', 898, 272);

  // Stat Boxes inside Widget
  const stats = [
    { label: 'DISCOVERED', val: '48', color: '#34d399' },
    { label: '1080P PHOTOS', val: '42', color: '#38bdf8' },
    { label: 'HD VIDEOS', val: '6', color: '#fbbf24' },
  ];
  stats.forEach((st, idx) => {
    const bx = 852 + idx * 102;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(bx, 298, 92, 66, 10);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(st.label, bx + 10, 318);
    ctx.fillStyle = st.color;
    ctx.font = '800 22px monospace';
    ctx.fillText(st.val, bx + 10, 348);
  });

  // Action Buttons inside Widget
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(852, 384, 296, 46, 10);
  ctx.fill();
  ctx.fillStyle = '#052e16';
  ctx.font = '800 14px sans-serif';
  ctx.fillText('Download 48 Media (1080p Originals)', 878, 412);

  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(852, 444, 296, 42, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Auto-Load Feed (Scroll & Load More)', 882, 470);

  // Feature Highlights List inside Widget
  const highlights = [
    '✓ Upscaled 1920×1080 CDN master photos',
    '✓ APP1 EXIF DateTimeOriginal header',
    '✓ Direct streaming for MP4/MOV videos',
    '✓ Saves to Downloads/Nursery_Photos/',
    '✓ Zero external servers or analytics',
  ];
  ctx.font = '500 13px sans-serif';
  ctx.fillStyle = '#cbd5e1';
  highlights.forEach((line, idx) => {
    ctx.fillText(line, 856, 524 + idx * 28);
  });
}

const README_CONTENT = `# ${BRAND.name} (Chrome & Microsoft Edge — Manifest V3)

**Version:** ${BRAND.version}  
**Package:** \`${BRAND.zipFileNames.chromium}\`

A Manifest V3 browser extension to bulk-download high-resolution 1920×1080 master photos and videos with original capture dates from **Bright Horizons FamilyApp** and **Famly**.

## Key Features
- **1920×1080 Master Photo Recovery:** Automatically upgrades cropped/downscaled feed thumbnails to uncompressed 1920×1080 CDN originals.
- **Embedded EXIF Datestamping:** Injects \`DateTimeOriginal\`, \`DateTimeDigitized\`, and \`DateTime\` (\`YYYY:MM:DD 12:00:00\`) directly into JPEG \`APP1\` headers in browser memory so Google Photos, Apple iCloud Photos, OneDrive, and desktop file managers sort every picture on its exact capture date.
- **Native Video Streaming:** Streams \`.mp4\` and \`.mov\` clips directly through \`chrome.downloads\` without data-URL memory bottlenecks.
- **Smart Auto-Feed Scroller:** Automatically scrolls the feed and triggers "Load more" / "Load earlier" buttons to harvest full historical timelines.
- **Privacy First:** Zero analytics, zero external servers, and minimal permissions (\`downloads\`, \`storage\`, \`activeTab\`). See \`PRIVACY_POLICY.md\`.

---

## Installation Instructions (Google Chrome & Microsoft Edge)

1. **Unzip** \`${BRAND.zipFileNames.chromium}\` into a folder on your computer.
2. In **Google Chrome** open \`chrome://extensions\`, or in **Microsoft Edge** open \`edge://extensions\`.
3. Enable the **Developer mode** toggle.
4. Click **Load unpacked** and select the unzipped folder.
5. Open \`https://familyapp.brighthorizons.co.uk\` or \`https://app.famly.co\` to start archiving!
`;

const FIREFOX_README_CONTENT = `# ${BRAND.name} (Mozilla Firefox — Manifest V3)

**Version:** ${BRAND.version}  
**Package:** \`${BRAND.zipFileNames.firefox}\`  
**Gecko Add-on ID:** \`${BRAND.geckoAddonId}\`

A Manifest V3 Mozilla Firefox WebExtension to bulk-download high-resolution 1920×1080 master photos and videos with original capture dates from **Bright Horizons FamilyApp** and **Famly**.

## Key Features
- **1920×1080 Master Photo Recovery:** Automatically downloads the full 1920×1080 master photo.
- **Embedded EXIF Datestamping:** Embeds original capture dates directly into JPEG \`APP1\` EXIF metadata.
- **Firefox AMO Compliant:** Pre-configured with \`browser_specific_settings.gecko\`, \`data_collection_permissions: { required: ["none"] }\`, and zero \`innerHTML\` usage.

---

## How to Install in Mozilla Firefox

1. **Unzip** \`${BRAND.zipFileNames.firefox}\` to a folder on your computer.
2. Open Mozilla Firefox and navigate to: \`about:debugging#/runtime/this-firefox\`
3. Click **"Load Temporary Add-on..."** and select \`manifest.json\` inside the unzipped folder.
4. Navigate to \`https://familyapp.brighthorizons.co.uk\` or \`https://app.famly.co\` to start downloading.
`;

/**
 * Builds the browser-specific extension ZIP archive and triggers a download.
 */
export async function downloadExtensionZip(targetBrowser: 'chromium' | 'firefox' = 'chromium'): Promise<void> {
  const zip = new JSZip();

  // Add all extension code files
  for (const file of EXTENSION_FILES) {
    if (file.path === 'manifest.json' && targetBrowser === 'firefox') {
      zip.file('manifest.json', FIREFOX_MANIFEST_JSON);
    } else {
      zip.file(file.path, file.content);
    }
  }

  // Generate and add crisp multi-resolution brand icons (16, 32, 48, 128)
  const [icon16Blob, icon32Blob, icon48Blob, icon128Blob] = await Promise.all([
    createExtensionIconBlob(16),
    createExtensionIconBlob(32),
    createExtensionIconBlob(48),
    createExtensionIconBlob(128),
  ]);

  const iconsFolder = zip.folder('icons');
  if (iconsFolder) {
    iconsFolder.file('icon16.png', icon16Blob);
    iconsFolder.file('icon32.png', icon32Blob);
    iconsFolder.file('icon48.png', icon48Blob);
    iconsFolder.file('icon128.png', icon128Blob);
  }

  // Include README, Privacy Policy, and Store Listing documentation
  const readme = targetBrowser === 'firefox' ? FIREFOX_README_CONTENT : README_CONTENT;
  zip.file('README.md', readme);
  zip.file('PRIVACY_POLICY.md', PRIVACY_POLICY_MD);
  zip.file('STORE_LISTING.md', STORE_LISTING_MD);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const fileName = targetBrowser === 'firefox'
    ? BRAND.zipFileNames.firefox
    : BRAND.zipFileNames.chromium;

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}

/**
 * Downloads a complete Store Publishing Visual & Compliance Kit (.ZIP)
 * containing 128x128 & 512x512 icons, 440x280 Promo Tile, 1280x800 Store Screenshot,
 * Privacy Policy, and Store Review Justifications.
 */
export async function downloadStorePublishingKitZip(): Promise<void> {
  const zip = new JSZip();

  const [icon128, icon512] = await Promise.all([
    createExtensionIconBlob(128),
    createExtensionIconBlob(512),
  ]);

  const promoCanvas = document.createElement('canvas');
  drawStorePromoTile(promoCanvas);
  const promoBlob = await new Promise<Blob>((r) =>
    promoCanvas.toBlob((b) => r(b || new Blob()), 'image/png')
  );

  const screenCanvas = document.createElement('canvas');
  drawStoreScreenshot(screenCanvas);
  const screenBlob = await new Promise<Blob>((r) =>
    screenCanvas.toBlob((b) => r(b || new Blob()), 'image/png')
  );

  zip.file('store-icon-128x128.png', icon128);
  zip.file('store-icon-512x512.png', icon512);
  zip.file('store-promo-tile-440x280.png', promoBlob);
  zip.file('store-screenshot-1280x800.png', screenBlob);
  zip.file('PRIVACY_POLICY.md', PRIVACY_POLICY_MD);
  zip.file('STORE_LISTING.md', STORE_LISTING_MD);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${BRAND.slug}-store-publishing-kit-v${BRAND.version}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
}
