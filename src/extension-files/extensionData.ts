/**
 * Complete Chrome Extension Manifest V3 files source code.
 * Used for in-browser inspection, individual file downloading, and ZIP packaging.
 */

export interface ExtensionFile {
  path: string;
  name: string;
  language: string;
  category: 'manifest' | 'scripts' | 'ui' | 'icons';
  description: string;
  content: string;
}

export const MANIFEST_JSON = `{
  "manifest_version": 3,
  "name": "Nursery Media Downloader",
  "short_name": "Nursery Downloader",
  "version": "1.4.0",
  "description": "Bulk download 1920x1080 photos and videos with embedded EXIF capture dates from Bright Horizons FamilyApp and Famly.",
  "permissions": [
    "downloads",
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "*://*.brighthorizons.co.uk/*",
    "*://*.brighthorizons.com/*",
    "*://*.famly.co/*",
    "*://*.famly.com/*",
    "*://*.famly.dk/*",
    "*://*.famly.net/*",
    "*://*.cloudfront.net/*",
    "*://*.amazonaws.com/*"
  ],
  "action": {
    "default_title": "Nursery Media Downloader",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.brighthorizons.co.uk/*",
        "*://*.brighthorizons.com/*",
        "*://*.famly.co/*",
        "*://*.famly.com/*",
        "*://*.famly.dk/*",
        "*://*.famly.net/*"
      ],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  },
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`;

export const FIREFOX_MANIFEST_JSON = `{
  "manifest_version": 3,
  "name": "Nursery Media Downloader",
  "short_name": "Nursery Downloader",
  "version": "1.4.0",
  "description": "Bulk download 1920x1080 photos and videos with embedded EXIF capture dates from Bright Horizons FamilyApp and Famly.",
  "permissions": [
    "downloads",
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "*://*.brighthorizons.co.uk/*",
    "*://*.brighthorizons.com/*",
    "*://*.famly.co/*",
    "*://*.famly.com/*",
    "*://*.famly.dk/*",
    "*://*.famly.net/*",
    "*://*.cloudfront.net/*",
    "*://*.amazonaws.com/*"
  ],
  "action": {
    "default_title": "Nursery Media Downloader",
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "scripts": ["background.js"]
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.brighthorizons.co.uk/*",
        "*://*.brighthorizons.com/*",
        "*://*.famly.co/*",
        "*://*.famly.com/*",
        "*://*.famly.dk/*",
        "*://*.famly.net/*"
      ],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  },
  "browser_specific_settings": {
    "gecko": {
      "id": "nursery-media-downloader@robinfowler.addon",
      "strict_min_version": "109.0",
      "data_collection_permissions": {
        "required": ["none"]
      }
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`;

export const BACKGROUND_JS = `// Background Service Worker for Nursery Media Downloader v1.4.0 (Manifest V3)
let activeDownloads = new Map();

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Nursery Media Downloader] Extension v1.4.0 installed and ready.');
  chrome.storage.sync.get(['downloadFolder', 'namingPattern'], (res) => {
    if (!res.downloadFolder) {
      chrome.storage.sync.set({
        downloadFolder: 'Nursery_Photos',
        namingPattern: '{date}_media_{index}'
      });
    }
  });
});

// Helper: Formats date to EXIF standard (YYYY:MM:DD HH:MM:SS)
// Extracts exact hour from /archive/YYYY/MM/DD/HH/ path when present
function formatExifDate(dateStr, url) {
  const archiveMatch = (url || '').match(new RegExp('/archive/(\\\\d{4})/(\\\\d{2})/(\\\\d{2})(?:/(\\\\d{2}))?'));
  if (archiveMatch) {
    const hh = archiveMatch[4] && Number(archiveMatch[4]) <= 23 ? archiveMatch[4] : '12';
    return archiveMatch[1] + ':' + archiveMatch[2] + ':' + archiveMatch[3] + ' ' + hh + ':00:00';
  }
  const match = (dateStr || '').match(new RegExp('(\\\\d{4})[-/.](\\\\d{2})[-/.](\\\\d{2})'));
  if (match) {
    return match[1] + ':' + match[2] + ':' + match[3] + ' 12:00:00';
  }
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return y + ':' + m + ':' + d + ' 12:00:00';
}

// Helper: Injects standard APP1 EXIF segment (DateTimeOriginal, DateTimeDigitized, DateTime)
function injectExifIntoJpeg(buffer, dateStr, url) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return buffer; // Not a JPEG
  }

  const exifDate = formatExifDate(dateStr, url);
  const dateBytes = new TextEncoder().encode(exifDate + '\\0');

  // Build TIFF payload (88 bytes, Little Endian)
  const tiff = new Uint8Array(88);
  const view = new DataView(tiff.buffer);

  // TIFF Header
  view.setUint16(0, 0x4949, true); // "II"
  view.setUint16(2, 0x002a, true); // 42
  view.setUint32(4, 8, true);      // Offset to IFD0 = 8

  // IFD0 (2 directory entries)
  view.setUint16(8, 2, true);
  // Tag 0x0132 (DateTime)
  view.setUint16(10, 0x0132, true);
  view.setUint16(12, 2, true);
  view.setUint32(14, 20, true);
  view.setUint32(18, 68, true);
  // Tag 0x8769 (ExifOffset)
  view.setUint16(22, 0x8769, true);
  view.setUint16(24, 4, true);
  view.setUint32(26, 1, true);
  view.setUint32(30, 38, true);
  view.setUint32(34, 0, true);

  // Exif SubIFD (2 directory entries)
  view.setUint16(38, 2, true);
  // Tag 0x9003 (DateTimeOriginal)
  view.setUint16(40, 0x9003, true);
  view.setUint16(42, 2, true);
  view.setUint32(44, 20, true);
  view.setUint32(48, 68, true);
  // Tag 0x9004 (DateTimeDigitized)
  view.setUint16(52, 0x9004, true);
  view.setUint16(54, 2, true);
  view.setUint32(56, 20, true);
  view.setUint32(60, 68, true);
  view.setUint32(64, 0, true);

  // Write Date String
  tiff.set(dateBytes, 68);

  // Complete APP1 Segment (98 bytes)
  const app1 = new Uint8Array(2 + 96);
  app1[0] = 0xff;
  app1[1] = 0xe1;
  app1[2] = 0x00;
  app1[3] = 0x60; // 96 bytes length
  app1.set([0x45, 0x78, 0x69, 0x66, 0x00, 0x00], 4); // "Exif\\0\\0"
  app1.set(tiff, 10);

  // Replace or insert APP1 segment after SOI
  let insertPos = 2;
  let skipLen = 0;
  let pos = 2;
  while (pos < bytes.length - 4) {
    if (bytes[pos] === 0xff) {
      const marker = bytes[pos + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      const segLen = (bytes[pos + 2] << 8) | bytes[pos + 3];
      if (marker === 0xe1) {
        insertPos = pos;
        skipLen = segLen + 2;
        break;
      } else if (marker === 0xe0) {
        insertPos = pos + segLen + 2;
      }
      pos += segLen + 2;
    } else {
      break;
    }
  }

  const before = bytes.slice(0, insertPos);
  const after = bytes.slice(insertPos + skipLen);
  const combined = new Uint8Array(before.length + app1.length + after.length);
  combined.set(before, 0);
  combined.set(app1, before.length);
  combined.set(after, before.length + app1.length);

  return combined.buffer;
}

// Convert ArrayBuffer to Data URL (used for JPEG EXIF injection in MV3 service workers)
function bufferToDataUrl(buffer, mimeType) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 8192) {
    const chunk = bytes.subarray(i, Math.min(i + 8192, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return 'data:' + mimeType + ';base64,' + btoa(binary);
}

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
    sendResponse({ status: 'opened' });
    return true;
  }

  if (message.action === 'DOWNLOAD_ITEMS') {
    handleBatchDownload(message.items, sender.tab?.id);
    sendResponse({ status: 'started', count: message.items.length });
    return true;
  }

  if (message.action === 'GET_DOWNLOAD_STATUS') {
    sendResponse({ activeDownloads: Array.from(activeDownloads.values()) });
    return true;
  }

  if (message.action === 'MEDIA_DISCOVERED') {
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, {
        action: 'AGGREGATE_MEDIA',
        items: message.items
      }).catch(() => {});
    }
    sendResponse({ received: true });
    return true;
  }
});

async function handleBatchDownload(items, tabId) {
  const settings = await chrome.storage.sync.get({
    downloadFolder: 'Nursery_Photos',
    namingPattern: '{date}_media_{index}',
    promptSaveAs: false
  });

  const total = items.length;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isVideo = Boolean(item.url.includes('.mp4') || item.url.includes('.mov') || item.url.includes('video') || item.isVideo);
    const ext = isVideo ? '.mp4' : '.jpg';
    const indexStr = String(i + 1).padStart(3, '0');
    const mediaTypeToken = isVideo ? 'video' : 'photo';

    // Sanitize filename tokens
    let baseName = (settings.namingPattern || '{date}_media_{index}')
      .replace('{date}', item.date || 'undated')
      .replace('{index}', indexStr)
      .replace('{type}', mediaTypeToken)
      .replace(/[^a-zA-Z0-9_\\-.]/g, '_');

    let folderPrefix = '';
    if (settings.downloadFolder && typeof settings.downloadFolder === 'string') {
      const trimmed = settings.downloadFolder.trim().replace(/^[/\\\\]+|[/\\\\]+$/g, '');
      if (trimmed.length > 0) {
        folderPrefix = trimmed + '/';
      }
    }
    const filename = folderPrefix + baseName + ext;
    const shouldPrompt = Boolean(settings.promptSaveAs && i === 0);

    try {
      await downloadItem(item, filename, isVideo, shouldPrompt);
      completed++;
    } catch (err) {
      console.error('[Nursery Media Downloader] Download failed for:', item.url, err);
      failed++;
    }

    // Notify tab of progress
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        action: 'DOWNLOAD_PROGRESS',
        progress: { completed, failed, total, currentUrl: item.url }
      }).catch(() => {});
    }

    // Rate-limit to prevent browser download throttling
    await new Promise((r) => setTimeout(r, 350));
  }

  if (tabId) {
    chrome.tabs.sendMessage(tabId, {
      action: 'DOWNLOAD_COMPLETE',
      result: { completed, failed, total }
    }).catch(() => {});
  }
}

async function downloadItem(item, filename, isVideo, promptSaveAs = false) {
  let downloadUrl = item.url;

  // Only buffer & inject EXIF metadata for photos (!isVideo).
  // Videos stream directly via native browser download manager to avoid MV3 data-URL memory limits.
  if (!isVideo) {
    try {
      const res = await fetch(item.url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const finalBuffer = injectExifIntoJpeg(buffer, item.date, item.url);
        const mimeType = 'image/jpeg';
        if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          const blob = new Blob([finalBuffer], { type: mimeType });
          downloadUrl = URL.createObjectURL(blob);
        } else {
          downloadUrl = bufferToDataUrl(finalBuffer, mimeType);
        }
      }
    } catch (fetchErr) {
      console.warn('[Nursery Media Downloader] Direct URL fallback (EXIF pre-process bypassed):', fetchErr);
      downloadUrl = item.url;
    }
  }

  return new Promise((resolve, reject) => {
    chrome.downloads.download({
      url: downloadUrl,
      filename: filename,
      conflictAction: 'uniquify',
      saveAs: Boolean(promptSaveAs)
    }, (downloadId) => {
      if (downloadUrl.startsWith('blob:')) {
        setTimeout(() => {
          try { URL.revokeObjectURL(downloadUrl); } catch (e) {}
        }, 60000);
      }
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (!downloadId) {
        return reject(new Error('Download failed to start'));
      }
      activeDownloads.set(downloadId, { url: item.url, filename, status: 'in_progress' });
      resolve(downloadId);
    });
  });
}

// Track download completion state
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    activeDownloads.delete(delta.id);
  } else if (delta.error) {
    activeDownloads.delete(delta.id);
  }
});
`;

export const CONTENT_JS = `// Content script for Famly / Bright Horizons FamilyApp Media Downloader
(function() {
  'use strict';

  // Only run in top window - completely eliminates execution inside tracking and embedded iframes
  if (typeof window !== 'undefined' && window.top !== window) {
    return;
  }

  // State
  const mediaQueue = new Map(); // key: canonicalKey, value: { key, url, date, type, isVideo, discoveredAt }
  const downloadedUrls = new Set();
  let isDownloading = false;
  let autoScrollInterval = null;
  let isPanelMinimized = false;
  let scanCycles = 0;
  let harvestDebounceTimer = null;
  let lastQueuedCount = -1;
  let lastSavedCount = -1;
  let lastDownloadingState = null;
  let cachedScrollContainer = null;

  // Restore downloaded set from extension storage (safe callback check)
  try {
    chrome.storage.local.get(['downloadedHistory'], (res) => {
      if (res && Array.isArray(res.downloadedHistory)) {
        res.downloadedHistory.forEach((u) => downloadedUrls.add(getMediaKey(u)));
      }
      updateUI();
    });
  } catch (e) {}

  /**
   * Generates a stable canonical key from a media URL.
   * Normalizes to the immutable /archive/... path when present so portrait/landscape
   * variants and daily rotating HMAC signatures / expiring tokens share one key.
   */
  function getMediaKey(url) {
    if (!url) return '';
    try {
      const parsed = new URL(url, window.location.href);
      const archiveIdx = parsed.pathname.indexOf('/archive/');
      if (archiveIdx !== -1) {
        return parsed.origin + parsed.pathname.substring(archiveIdx);
      }
      return parsed.origin + parsed.pathname;
    } catch (e) {
      return url;
    }
  }

  /**
   * Parses srcset attribute strings into individual clean URL candidates
   */
  function parseSrcsetUrls(srcset) {
    if (!srcset || typeof srcset !== 'string') return [];
    const results = [];
    const candidates = srcset.split(',').map((s) => s.trim()).filter(Boolean);
    for (const cand of candidates) {
      const spaceIdx = cand.lastIndexOf(' ');
      let candUrl = cand;
      if (spaceIdx > 0) {
        candUrl = cand.substring(0, spaceIdx).trim();
      }
      if (candUrl) results.push(candUrl);
    }
    return results;
  }

  /**
   * Transforms Famly & Bright Horizons CDN thumbnail/cropped URLs into full-res master images
   * Preserves portrait (1080x1920) vs landscape (1920x1080) orientation, /archive/ path structure,
   * valid HMAC tokens, and query credentials.
   */
  function toFullRes(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url, window.location.href);

      // Remove downscaling / cropping query parameters if present
      const paramsToDelete = ['crop', 'width', 'height', 'w', 'h', 'fit', 'max-w', 'max-h'];
      for (const p of paramsToDelete) {
        if (parsed.searchParams.has(p)) {
          parsed.searchParams.delete(p);
        }
      }

      // If already at full 1080p (landscape 1920x1080 or portrait 1080x1920), return cleaned URL
      if (parsed.pathname.includes('/1920x1080/') || parsed.pathname.includes('/1080x1920/')) {
        return parsed.toString();
      }

      // Famly & Bright Horizons image path structure:
      // /image/{hash}/{dimension}/archive/...
      const parts = parsed.pathname.split('/');
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'image' && parts[i + 2]) {
          const dimSeg = parts[i + 2];
          const dimMatch = dimSeg.match(/^([0-9]+)x([0-9]+)$/i);
          if (dimMatch) {
            const w = parseInt(dimMatch[1], 10);
            const h = parseInt(dimMatch[2], 10);
            // Preserve portrait (e.g. 520x1040 -> 1080x1920) vs landscape (e.g. 1040x520 -> 1920x1080)
            parts[i + 2] = w < h ? '1080x1920' : '1920x1080';
            break;
          } else if (/^(thumbnail|scaled|small|medium|thumb)$/i.test(dimSeg)) {
            parts[i + 2] = '1920x1080';
            break;
          } else if (dimSeg === 'archive') {
            // Dimension wasn't in path: insert 1920x1080 before archive
            parts.splice(i + 2, 0, '1920x1080');
            break;
          }
        }
      }
      parsed.pathname = parts.join('/');

      return parsed.toString();
    } catch (e) {
      return url;
    }
  }

  /**
   * Extracts date string (YYYY-MM-DD) from CDN archive/S3 path or nearby DOM elements
   */
  function extractDateFromMedia(url, element) {
    // 1. From URL pathname: matches both /archive/YYYY/MM/DD/ (photos) and /YYYY/MM/DD/HH/{uuid}/ (S3 videos)
    try {
      const parsedPath = new URL(url, window.location.href).pathname;
      const pathMatch = parsedPath.match(new RegExp('/((?:19|20)[0-9]{2})/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/', 'i'));
      if (pathMatch) {
        return pathMatch[1] + '-' + pathMatch[2] + '-' + pathMatch[3];
      }
    } catch (e) {}

    const archiveMatch = (url || '').match(new RegExp('/((?:19|20)[0-9]{2})/(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/', 'i'));
    if (archiveMatch) {
      return archiveMatch[1] + '-' + archiveMatch[2] + '-' + archiveMatch[3];
    }

    // 2. Fallback: Search parent story / activity card for timestamp element or post link (e.g. "22 Apr 2024")
    if (element) {
      try {
        const card = element.closest
          ? element.closest('.story, article, [class*="activity"], [class*="feed-item"], [class*="post"], [class*="card"]')
          : null;
        if (card) {
          const timeEl = card.querySelector('time, a[href*="/post/"], [class*="timestamp"], [class*="date"], [datetime]');
          if (timeEl) {
            const dt = timeEl.getAttribute('datetime') || timeEl.textContent;
            if (dt) {
              const parsed = new Date(dt.trim() + ' 12:00:00');
              if (!isNaN(parsed.getTime())) {
                const y = parsed.getFullYear();
                const m = String(parsed.getMonth() + 1).padStart(2, '0');
                const d = String(parsed.getDate()).padStart(2, '0');
                return y + '-' + m + '-' + d;
              }
            }
          }
        }
      } catch (e) {}
    }

    // 3. Fallback: Match ISO date pattern in URL
    const isoMatch = (url || '').match(/(202[0-9])[-_/](0[1-9]|1[0-2])[-_/](0[1-9]|[12][0-9]|3[01])/);
    if (isoMatch) {
      return isoMatch[1] + '-' + isoMatch[2] + '-' + isoMatch[3];
    }

    return 'undated';
  }

  /**
   * Determines if a candidate URL and element represent real nursery media
   */
  function isNurseryMedia(url, el) {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();

    // Ignore extension's own UI elements
    if (el) {
      try {
        if (el.closest && el.closest('#famly-downloader-panel')) return false;
      } catch (e) {}
    }

    // Ignore tracking pixels, SVG icons, and S3 video poster thumbnails (thumb-00001.jpg)
    if (
      lower.startsWith('data:image/svg') ||
      lower.startsWith('data:image/gif') ||
      lower.includes('/icons/') ||
      lower.includes('logo.svg') ||
      new RegExp('/thumb-[0-9]+\\\\.jpe?g(\\\\?|$)', 'i').test(lower)
    ) {
      return false;
    }

    // Primary matches on CDN URLs
    if (
      lower.includes('/archive/') ||
      lower.includes('/1920x1080/') ||
      lower.includes('/1080x1920/') ||
      lower.includes('/1040x520/') ||
      lower.includes('/520x1040/') ||
      lower.includes('/image/') ||
      lower.includes('/images/') ||
      lower.includes('img.familyapp') ||
      lower.includes('brighthorizons') ||
      lower.includes('famly') ||
      lower.includes('cloudfront.net') ||
      lower.includes('amazonaws.com') ||
      lower.includes('googleapis.com')
    ) {
      // Check if avatar / profile thumbnail (e.g. ?crop=face, /100x100/, /500x500/, comment form avatar, or child-profile-header)
      const isAvatar =
        lower.includes('/avatar/') ||
        lower.includes('avatar-') ||
        lower.includes('crop=face') ||
        lower.includes('/100x100/') ||
        lower.includes('/500x500/') ||
        lower.includes('empty-profile') ||
        lower.includes('profile-image') ||
        Boolean(
          el && (
            (el.className && typeof el.className === 'string' && el.className.toLowerCase().includes('avatar')) ||
            (el.closest && el.closest('#commentForm, .child-profile-header, .profile-header-wrapper, nav, header'))
          )
        );

      if (isAvatar) return false;
      if (lower.includes('/archive/')) return true;

      return (
        /\\.(jpe?g|png|webp|avif|mp4|mov)(\\?|$)/i.test(lower) ||
        lower.includes('/image/') ||
        lower.includes('/images/')
      );
    }

    // Fallback: If inside an article / post card on page
    if (el) {
      try {
        const inPost = el.closest && el.closest('article, .story, .postImages, [class*="post"], [class*="card"], [class*="feed"], [class*="activity"]');
        if (inPost && /\\.(jpe?g|png|webp|avif|mp4)(\\?|$)/i.test(lower)) {
          return true;
        }
      } catch (e) {}
    }

    return false;
  }

  /**
   * Fast node inspection: extracts media candidates from a node
   * Operates strictly on attributes without invoking getComputedStyle
   */
  function extractMediaFromNode(node) {
    if (!node || node.nodeType !== 1) return [];
    const found = [];

    // 1. <img> element
    if (node.tagName === 'IMG') {
      const srcAttrs = [
        'srcset', 'src', 'currentSrc',
        'data-src', 'data-srcset', 'data-original', 'data-url',
        'data-image', 'data-full', 'data-hires', 'data-hi-res',
        'data-large', 'data-media', 'data-asset'
      ];
      for (let i = 0; i < srcAttrs.length; i++) {
        const attr = srcAttrs[i];
        let val = '';
        if (attr === 'currentSrc' && node.currentSrc) val = node.currentSrc;
        else if (attr === 'srcset' && (node.getAttribute('srcset') || node.srcset)) val = node.getAttribute('srcset') || node.srcset;
        else if (node.getAttribute && node.getAttribute(attr)) val = node.getAttribute(attr);

        if (val) {
          if (attr.includes('srcset')) {
            const urls = parseSrcsetUrls(val);
            for (let k = 0; k < urls.length; k++) {
              found.push({ url: urls[k], el: node, type: 'image' });
            }
          } else {
            found.push({ url: val, el: node, type: 'image' });
          }
        }
      }
    }

    // 2. <source> element inside <picture> or <video>
    else if (node.tagName === 'SOURCE') {
      const srcset = node.getAttribute('srcset') || node.srcset;
      if (srcset) {
        const urls = parseSrcsetUrls(srcset);
        for (let k = 0; k < urls.length; k++) {
          found.push({ url: urls[k], el: node, type: 'image' });
        }
      }
      const src = node.getAttribute('src') || node.src;
      if (src) {
        const isVid = Boolean(
          (node.type && node.type.toLowerCase().includes('video')) ||
          (node.parentElement && node.parentElement.tagName === 'VIDEO') ||
          /\\.(mp4|mov|webm)(\\?|$)/i.test(src)
        );
        found.push({ url: src, el: node, type: isVid ? 'video' : 'image' });
      }
    }

    // 3. <video> element (including preload="none" videos with child <source> nodes)
    else if (node.tagName === 'VIDEO') {
      const src = node.currentSrc || node.src || (node.getAttribute && (node.getAttribute('src') || node.getAttribute('data-src')));
      if (src) found.push({ url: src, el: node, type: 'video' });
      if (node.querySelectorAll) {
        const sources = node.querySelectorAll('source');
        for (let s = 0; s < sources.length; s++) {
          const sUrl = sources[s].getAttribute('src') || sources[s].src;
          if (sUrl) found.push({ url: sUrl, el: node, type: 'video' });
        }
      }
    }

    // 4. Background images in style attribute (zero getComputedStyle overhead)
    else if (node.hasAttribute && node.hasAttribute('style')) {
      const styleAttr = node.getAttribute('style') || '';
      if (styleAttr.includes('url(')) {
        const matches = styleAttr.matchAll(/url\\(['"]?([^'"\\)\\s]+)['"]?\\)/gi);
        for (const m of matches) {
          if (m[1]) found.push({ url: m[1], el: node, type: 'image' });
        }
      }
    }

    // 5. <a> links pointing directly to photos
    else if (node.tagName === 'A') {
      const href = (node.getAttribute && node.getAttribute('href')) || node.href;
      if (href && (
        href.includes('/image/') ||
        href.includes('/archive/') ||
        /\\.(jpe?g|png|webp|avif|mp4)(\\?|$)/i.test(href)
      )) {
        found.push({ url: href, el: node, type: href.includes('.mp4') ? 'video' : 'image' });
      }
    }

    return found;
  }

  /**
   * Fast, targeted media harvester
   * Uses native querySelectorAll for actual media nodes instead of traversing full DOM
   */
  function harvestMedia() {
    let addedCount = 0;

    const selector = 'img, picture source, video, video source, a[href*="/image/"], a[href*="/archive/"], a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".webp"], a[href*=".mp4"], [style*="url("]';
    const elements = document.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const items = extractMediaFromNode(el);
      for (let j = 0; j < items.length; j++) {
        const raw = items[j];
        if (!raw.url) continue;

        if (isNurseryMedia(raw.url, raw.el)) {
          const highRes = raw.type === 'video' ? raw.url : toFullRes(raw.url);
          if (highRes) {
            const key = getMediaKey(highRes);
            if (!mediaQueue.has(key)) {
              const date = extractDateFromMedia(highRes, raw.el);
              mediaQueue.set(key, {
                key: key,
                url: highRes,
                date: date,
                type: raw.type || 'image',
                isVideo: raw.type === 'video' || highRes.includes('.mp4'),
                discoveredAt: Date.now()
              });
              addedCount++;
            } else {
              // Always refresh with the latest signed URL (handles rotating S3 X-Amz-Expires & CDN expires)
              const existing = mediaQueue.get(key);
              if (/expires|X-Amz-Signature/i.test(highRes)) {
                existing.url = highRes;
              }
            }
          }
        }
      }
    }

    if (addedCount > 0) {
      updateUI();
    }
    return addedCount;
  }

  /**
   * Schedules a debounced media harvest pass
   */
  function scheduleHarvest(delay) {
    const ms = typeof delay === 'number' ? delay : 400;
    if (harvestDebounceTimer) return;
    harvestDebounceTimer = setTimeout(() => {
      harvestDebounceTimer = null;
      harvestMedia();
    }, ms);
  }

  /**
   * Starts batch download via background service worker
   */
  function startDownload() {
    if (isDownloading || mediaQueue.size === 0) return;
    isDownloading = true;
    updateUI();

    const items = Array.from(mediaQueue.values());
    chrome.runtime.sendMessage({
      action: 'DOWNLOAD_ITEMS',
      items: items
    }, (response) => {
      console.log('[Nursery Downloader] Batch download initiated:', response);
    });
  }

  /**
   * Clean single-click trigger for React 18 & Material-UI (MuiButtonBase) buttons in Chrome & Firefox.
   * Dispatches pointer/mouse press sequence followed by a single native click so onClick fires once.
   */
  function triggerClick(el) {
    if (!el) return false;

    // 1. Bring button into view
    try {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    } catch (e) {
      try { el.scrollIntoView(true); } catch (e2) {}
    }

    // 2. Set focus
    try { el.focus(); } catch (e) {}

    // 3. Dispatch pointer & mouse press/release sequence (triggers MuiTouchRipple without duplicate click events)
    try {
      if (typeof PointerEvent !== 'undefined') {
        el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, composed: true, view: window, isPrimary: true, pointerType: 'mouse', button: 0, buttons: 1 }));
      }
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, composed: true, view: window, detail: 1, button: 0, buttons: 1 }));
      if (typeof PointerEvent !== 'undefined') {
        el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, composed: true, view: window, isPrimary: true, pointerType: 'mouse', button: 0, buttons: 0 }));
      }
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, composed: true, view: window, detail: 1, button: 0, buttons: 0 }));
    } catch (e) {}

    // 4. Fire a single click event (prefer un-sandboxed wrappedJSObject in Firefox if present, else standard el.click())
    let clicked = false;
    try {
      if (el.wrappedJSObject && typeof el.wrappedJSObject.click === 'function') {
        el.wrappedJSObject.click();
        clicked = true;
      }
    } catch (e) {}

    if (!clicked) {
      try {
        el.click();
        clicked = true;
      } catch (e) {
        try {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: window, detail: 1, button: 0 }));
          clicked = true;
        } catch (e2) {}
      }
    }

    return clicked;
  }

  /**
   * Smoothly scrolls all scrollable containers (window, document, and inner MUI/feed wrappers)
   */
  function scrollAllScrollableContainers() {
    // 1. Window scroll
    try {
      window.scrollBy(0, 1500);
      window.dispatchEvent(new Event('scroll'));
    } catch (e) {}

    // 2. Document elements
    try {
      if (document.documentElement) {
        document.documentElement.scrollTop += 1500;
      }
      if (document.body) {
        document.body.scrollTop += 1500;
      }
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop += 1500;
        document.scrollingElement.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
    } catch (e) {}

    // 3. Structural feed candidates (main, feed, timeline, MuiContainer, role="feed", etc.)
    try {
      const candidates = document.querySelectorAll(
        'main, #content, #learningJourneyRoot, [role="main"], [role="feed"], [class*="feed"], [class*="timeline"], [class*="stream"], [class*="MuiContainer"], [class*="scroll"], section, [class*="sc-"], [class*="css-"]'
      );
      for (let i = 0; i < candidates.length; i++) {
        const el = candidates[i];
        if (el.scrollHeight > el.clientHeight + 25) {
          el.scrollTop += 1500;
          if (typeof el.scrollBy === 'function') {
            el.scrollBy(0, 1500);
          }
          el.dispatchEvent(new Event('scroll', { bubbles: true }));
        }
      }
    } catch (e) {}

    // 4. Virtual list wheel event
    try {
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1500, bubbles: true }));
    } catch (e) {}
  }

  /**
   * Detects the feed pagination "Load More" / "Load Earlier" button
   * Ignores inline comment truncation buttons ("Show more" inside .story) and header/tab dropdowns ("More" with arrow_drop_down)
   */
  function findLoadMoreElement() {
    const candidates = Array.from(document.querySelectorAll(
      'button, [role="button"], a, input[type="button"], input[type="submit"], [class*="MuiButton"], [class*="load-more"]'
    ));

    function isPaginationCandidate(el) {
      if (!el) return false;
      if (el.closest && el.closest('#famly-downloader-panel')) return false;
      if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('disabled')) return false;
      // Ignore buttons inside individual story/post cards (e.g. inline comment "Show more" or "More options" menu)
      if (el.closest && el.closest('.story, article, .child-profile-header, .profile-header-wrapper, header, nav')) return false;
      // Ignore dropdown menu triggers containing Material icon text like "arrow_drop_down" or "more_horiz"
      const rawText = (el.textContent || '').toLowerCase();
      if (rawText.includes('arrow_drop_down') || rawText.includes('more_horiz') || rawText.includes('more_vert')) return false;
      return true;
    }

    // Priority 1: Exact pagination button labels ("load more", "load earlier", "load older", "hent mere")
    const primaryKeywords = [
      'load more', 'load earlier', 'load older', 'load previous',
      'see earlier', 'view earlier', 'hent mere', 'more posts', 'more photos'
    ];

    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      if (!isPaginationCandidate(el)) continue;

      const text = (el.textContent || '').trim().toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const testId = (el.getAttribute('data-testid') || '').toLowerCase();

      for (let k = 0; k < primaryKeywords.length; k++) {
        const kw = primaryKeywords[k];
        if (text === kw || text.includes(kw) || aria.includes(kw) || testId.includes(kw)) {
          return el;
        }
      }
    }

    // Priority 2: Secondary pagination phrases outside story cards ("show more", "show earlier", "view more", "older", "earlier", "ældre")
    const secondaryKeywords = ['show more', 'show earlier', 'view more', 'older', 'earlier', 'ældre'];
    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      if (!isPaginationCandidate(el)) continue;

      const text = (el.textContent || '').trim().toLowerCase();
      if (text.length > 0 && text.length < 30) {
        for (let k = 0; k < secondaryKeywords.length; k++) {
          const kw = secondaryKeywords[k];
          if (text === kw || text.includes(kw)) {
            return el;
          }
        }
      }
    }

    return null;
  }

  /**
   * Executes a single robust scroll and click step across Firefox and Chrome
   */
  function performScrollStep() {
    scanCycles++;
    let clickedButton = false;

    // 1. Perform smooth scroll on all scrollable containers (window + inner feed containers)
    scrollAllScrollableContainers();

    // 2. Scroll last visible card / media into view to trigger virtual list / intersection observer
    try {
      const allCards = document.querySelectorAll(
        '.story, article, [role="article"], [class*="card"], [class*="post"], [class*="feed-item"], [class*="activity"], [class*="MuiCard"], img[src*="familyapp"], img[src*="archive"], video'
      );
      if (allCards.length > 0) {
        const lastEl = allCards[allCards.length - 1];
        lastEl.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    } catch (e) {}

    // 3. Find and trigger the "Load more" button once at the bottom of the feed
    const loadMoreBtn = findLoadMoreElement();
    if (loadMoreBtn) {
      clickedButton = triggerClick(loadMoreBtn);
    }

    // 4. Harvest newly rendered media
    harvestMedia();

    // 6. Update UI labels
    const scrollBtn = document.getElementById('famly-scroll-btn');
    if (scrollBtn && autoScrollInterval) {
      scrollBtn.textContent = clickedButton
        ? 'Loading More (' + scanCycles + ')...'
        : 'Auto-Scrolling (' + scanCycles + ')...';
    }
  }

  /**
   * Toggles auto-scroll loop
   */
  function toggleAutoLoad(customBtn) {
    const btn = customBtn || document.getElementById('famly-scroll-btn');
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
      scanCycles = 0;
      if (btn) {
        btn.textContent = 'Auto-Load Feed';
        btn.classList.remove('active');
      }
    } else {
      scanCycles = 0;
      if (btn) {
        btn.textContent = 'Stop Auto-Load';
        btn.classList.add('active');
      }
      // Execute immediately on click
      performScrollStep();
      // Repeat every 1400ms
      autoScrollInterval = setInterval(performScrollStep, 1400);
    }
    return Boolean(autoScrollInterval);
  }

  /**
   * Helper: Creates DOM elements safely via document.createElement (Firefox AMO compliant)
   */
  function createEl(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k of Object.keys(attrs)) {
        if (k === 'className') el.className = attrs[k];
        else if (k === 'textContent') el.textContent = attrs[k];
        else el.setAttribute(k, attrs[k]);
      }
    }
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        if (children[i]) el.appendChild(children[i]);
      }
    }
    return el;
  }

  /**
   * Creates floating panel UI in page using safe DOM node construction
   */
  function createUI() {
    if (document.getElementById('famly-downloader-panel')) return;

    const panel = createEl('div', { id: 'famly-downloader-panel' });

    // Brand Icon badge (uses packaged icon32.png if available, with fallback glyph)
    let brandIconNode;
    try {
      const iconUrl = chrome.runtime.getURL('icons/icon32.png');
      brandIconNode = createEl('img', {
        src: iconUrl,
        alt: 'Nursery Media Downloader',
        className: 'famly-icon-img',
        width: '20',
        height: '20'
      });
    } catch (e) {
      brandIconNode = createEl('span', { className: 'famly-icon', textContent: '📷' });
    }

    const brandWrap = createEl('div', { className: 'famly-brand' }, [
      brandIconNode,
      createEl('span', { className: 'famly-title', textContent: 'Nursery Media Downloader' })
    ]);

    const minBtn = createEl('button', {
      id: 'famly-min-btn',
      title: 'Minimize / Expand',
      type: 'button',
      textContent: '_'
    });

    const header = createEl('div', { className: 'famly-header' }, [brandWrap, minBtn]);

    const queuedChip = createEl('div', { className: 'famly-stat-chip' }, [
      createEl('span', { className: 'famly-stat-num', id: 'famly-count-queued', textContent: '0' }),
      createEl('span', { className: 'famly-stat-label', textContent: 'Discovered' })
    ]);

    const savedChip = createEl('div', { className: 'famly-stat-chip' }, [
      createEl('span', { className: 'famly-stat-num', id: 'famly-count-saved', textContent: '0' }),
      createEl('span', { className: 'famly-stat-label', textContent: 'Saved' })
    ]);

    const statsRow = createEl('div', { className: 'famly-stats-row' }, [queuedChip, savedChip]);

    const scrollBtn = createEl('button', {
      id: 'famly-scroll-btn',
      className: 'famly-btn secondary',
      type: 'button',
      textContent: 'Auto-Load Feed'
    });

    const dlBtn = createEl('button', {
      id: 'famly-dl-btn',
      className: 'famly-btn primary',
      type: 'button',
      textContent: 'Download (0)'
    });

    const actionsRow = createEl('div', { className: 'famly-actions' }, [scrollBtn, dlBtn]);

    const copyBtn = createEl('button', {
      id: 'famly-copy-btn',
      className: 'famly-text-link',
      type: 'button',
      textContent: 'Copy URLs'
    });

    const optBtn = createEl('button', {
      id: 'famly-options-btn',
      className: 'famly-text-link',
      type: 'button',
      textContent: 'Folder & Settings'
    });

    const footerBar = createEl('div', { className: 'famly-footer-bar' }, [
      copyBtn,
      createEl('span', { className: 'famly-dot', textContent: '•' }),
      optBtn
    ]);

    const body = createEl('div', { className: 'famly-body' }, [
      statsRow,
      actionsRow,
      footerBar
    ]);

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    // Event Listeners
    scrollBtn.addEventListener('click', () => toggleAutoLoad(scrollBtn));
    dlBtn.addEventListener('click', () => startDownload());

    optBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
    });

    minBtn.addEventListener('click', () => {
      isPanelMinimized = !isPanelMinimized;
      panel.classList.toggle('minimized', isPanelMinimized);
      minBtn.textContent = isPanelMinimized ? '□' : '_';
    });

    copyBtn.addEventListener('click', () => {
      const urls = Array.from(mediaQueue.values()).map((v) => v.url).join('\\\\n');
      navigator.clipboard.writeText(urls);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy URLs'; }, 1500);
    });

    updateUI();
  }

  /**
   * Only updates UI when counts or download state actually change
   */
  function updateUI() {
    if (
      lastQueuedCount === mediaQueue.size &&
      lastSavedCount === downloadedUrls.size &&
      lastDownloadingState === isDownloading
    ) {
      return;
    }
    lastQueuedCount = mediaQueue.size;
    lastSavedCount = downloadedUrls.size;
    lastDownloadingState = isDownloading;

    const queueEl = document.getElementById('famly-count-queued');
    const savedEl = document.getElementById('famly-count-saved');
    const dlBtn = document.getElementById('famly-dl-btn');

    if (queueEl) queueEl.textContent = String(mediaQueue.size);
    if (savedEl) savedEl.textContent = String(downloadedUrls.size);
    if (dlBtn) {
      dlBtn.disabled = isDownloading || mediaQueue.size === 0;
      dlBtn.textContent = isDownloading ? 'Downloading...' : 'Download (' + mediaQueue.size + ')';
    }
  }

  /**
   * Lightweight debounced MutationObserver
   */
  function initObserver() {
    try {
      const observer = new MutationObserver((mutations) => {
        let relevant = false;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.type === 'attributes') {
            relevant = true;
            break;
          }
          if (m.type === 'childList') {
            const added = m.addedNodes;
            for (let j = 0; j < added.length; j++) {
              const n = added[j];
              if (n.nodeType === 1) { // ELEMENT_NODE
                if (n.tagName === 'IMG' || n.tagName === 'VIDEO' || n.tagName === 'SOURCE') {
                  relevant = true;
                  break;
                }
                if (n.querySelector && n.querySelector('img, video, [style*="url("]')) {
                  relevant = true;
                  break;
                }
              }
            }
            if (relevant) break;
          }
        }
        if (relevant) {
          scheduleHarvest(400);
        }
      });

      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'data-src', 'data-srcset', 'style']
      });
    } catch (e) {}
  }

  // Listen for messages from background and popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'TOGGLE_AUTO_LOAD') {
      const active = toggleAutoLoad();
      sendResponse({ isAutoLoading: active });
      return true;
    } else if (msg.action === 'DOWNLOAD_ITEMS') {
      startDownload();
      sendResponse({ status: 'initiated' });
      return true;
    } else if (msg.action === 'DOWNLOAD_PROGRESS') {
      const { completed, failed, total, currentUrl } = msg.progress;
      downloadedUrls.add(getMediaKey(currentUrl));
      chrome.storage.local.set({ downloadedHistory: Array.from(downloadedUrls) });
      updateUI();
    } else if (msg.action === 'DOWNLOAD_COMPLETE') {
      isDownloading = false;
      updateUI();
    } else if (msg.action === 'GET_CONTENT_STATS') {
      // Perform quick harvest to ensure current state before responding
      harvestMedia();
      sendResponse({
        queueCount: mediaQueue.size,
        savedCount: downloadedUrls.size,
        isDownloading: isDownloading,
        isAutoLoading: Boolean(autoScrollInterval),
        items: Array.from(mediaQueue.values())
      });
      return true;
    }
  });

  // Initialization - runs once on page load without high-frequency polling
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createUI();
      initObserver();
      harvestMedia();
    });
  } else {
    createUI();
    initObserver();
    harvestMedia();
  }
})();
`;

export const CONTENT_CSS = `/* Styling for in-page floating widget */
#famly-downloader-panel {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 276px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid #cbd5e1;
  box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.18), 0 8px 12px -6px rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  z-index: 2147483000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

#famly-downloader-panel * {
  box-sizing: border-box;
}

#famly-downloader-panel.minimized {
  width: auto;
  border-radius: 24px;
}

#famly-downloader-panel.minimized .famly-body {
  display: none;
}

.famly-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.famly-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.famly-icon {
  font-size: 16px;
}

.famly-icon-img {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: block;
}

.famly-title {
  font-weight: 700;
  font-size: 13px;
  color: #0f172a;
  letter-spacing: -0.01em;
}

#famly-min-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

#famly-min-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.famly-body {
  padding: 12px 14px;
}

.famly-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.famly-stat-chip {
  background: #f1f5f9;
  padding: 6px 8px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.famly-stat-num {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0284c7;
}

.famly-stat-label {
  font-size: 11px;
  color: #64748b;
}

.famly-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.famly-btn {
  flex: 1;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
}

.famly-btn.primary {
  background: #16a34a;
  color: #ffffff;
}

.famly-btn.primary:hover:not(:disabled) {
  background: #15803d;
}

.famly-btn.primary:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.famly-btn.secondary {
  background: #e2e8f0;
  color: #334155;
}

.famly-btn.secondary:hover {
  background: #cbd5e1;
}

.famly-btn.secondary.active {
  background: #ea580c;
  color: #ffffff;
  animation: famly-pulse 1.6s infinite;
}

@keyframes famly-pulse {
  0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.6); }
  70% { box-shadow: 0 0 0 7px rgba(234, 88, 12, 0); }
  100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
}

.famly-footer-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 4px;
  font-size: 11px;
}

.famly-text-link {
  color: #0284c7;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.famly-text-link:hover {
  text-decoration: underline;
}

.famly-dot {
  color: #94a3b8;
}
`;

export const POPUP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nursery Media Downloader</title>
  <style>
    body {
      width: 320px;
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    .logo-img {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .title {
      font-size: 15px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .subtitle {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    .card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      font-size: 13px;
    }
    .stat-row:last-child {
      margin-bottom: 0;
    }
    .stat-val {
      font-weight: 600;
      color: #0284c7;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 9999px;
    }
    .badge.active { background: #dcfce7; color: #15803d; }
    .badge.inactive { background: #f1f5f9; color: #64748b; }
    .btn {
      width: 100%;
      padding: 9px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      margin-bottom: 8px;
      transition: background 0.15s;
    }
    .btn-primary { background: #16a34a; color: white; }
    .btn-primary:hover:not(:disabled) { background: #15803d; }
    .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .btn-secondary:hover { background: #cbd5e1; }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      margin-top: 10px;
    }
    .footer a { color: #0284c7; text-decoration: none; font-weight: 600; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <img src="icons/icon48.png" alt="Nursery Media Downloader" class="logo-img">
    <div>
      <h1 class="title">Nursery Media Downloader</h1>
      <p class="subtitle">Bright Horizons FamilyApp &amp; Famly</p>
    </div>
  </div>

  <div class="card">
    <div class="stat-row">
      <span>Active Tab Status:</span>
      <span id="tab-status" class="badge inactive">Checking...</span>
    </div>
    <div class="stat-row">
      <span>Queued High-Res Media:</span>
      <span id="queue-count" class="stat-val">0</span>
    </div>
    <div class="stat-row">
      <span>Saved Previously:</span>
      <span id="saved-count" class="stat-val">0</span>
    </div>
  </div>

  <button id="download-btn" class="btn btn-primary" disabled>Start Download</button>
  <button id="auto-scroll-btn" class="btn btn-secondary">Toggle Auto-Scroll</button>
  <button id="options-btn" class="btn btn-secondary">Extension Settings</button>

  <div class="footer">
    <span>v1.4.0 • Manifest V3</span>
    <a href="#" id="open-options">Folder &amp; Options</a>
  </div>

  <script src="popup.js"></script>
</body>
</html>
`;

export const POPUP_JS = `// Popup logic
document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('tab-status');
  const queueEl = document.getElementById('queue-count');
  const savedEl = document.getElementById('saved-count');
  const dlBtn = document.getElementById('download-btn');
  const autoBtn = document.getElementById('auto-scroll-btn');
  const optBtn = document.getElementById('options-btn');
  const openOptionsLink = document.getElementById('open-options');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isFamlyTab = tab?.url && (
    tab.url.includes('brighthorizons') ||
    tab.url.includes('famly')
  );

  if (isFamlyTab) {
    statusEl.textContent = 'Feed Active';
    statusEl.className = 'badge active';
  }

  // Query stats from content script (works even if tab.url is restricted)
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'GET_CONTENT_STATS' }, (res) => {
      if (!chrome.runtime.lastError && res) {
        statusEl.textContent = 'Feed Active';
        statusEl.className = 'badge active';
        queueEl.textContent = res.queueCount || 0;
        savedEl.textContent = res.savedCount || 0;
        if (res.isAutoLoading) {
          autoBtn.textContent = 'Stop Auto-Scroll';
          autoBtn.classList.add('active');
        } else {
          autoBtn.textContent = 'Auto-Load Feed';
          autoBtn.classList.remove('active');
        }
        if (res.queueCount > 0 && !res.isDownloading) {
          dlBtn.disabled = false;
          dlBtn.textContent = 'Download ' + res.queueCount + ' Items';
        }
      } else if (!isFamlyTab) {
        statusEl.textContent = 'Not on Portal';
        statusEl.className = 'badge inactive';
        dlBtn.textContent = 'Open Famly / FamilyApp First';
        dlBtn.disabled = true;
      }
    });
  } else {
    statusEl.textContent = 'Not on Portal';
    statusEl.className = 'badge inactive';
    dlBtn.textContent = 'Open Famly / FamilyApp First';
    dlBtn.disabled = true;
  }

  dlBtn.addEventListener('click', () => {
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { action: 'DOWNLOAD_ITEMS' });
    window.close();
  });

  autoBtn.addEventListener('click', () => {
    if (!tab?.id) return;
    chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_AUTO_LOAD' }, (res) => {
      if (res && res.isAutoLoading) {
        autoBtn.textContent = 'Stop Auto-Scroll';
        autoBtn.classList.add('active');
      } else {
        autoBtn.textContent = 'Auto-Load Feed';
        autoBtn.classList.remove('active');
      }
    });
  });

  if (optBtn) {
    optBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  if (openOptionsLink) {
    openOptionsLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }
});
`;

export const OPTIONS_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nursery Media Downloader — Settings</title>
  <style>
    body {
      max-width: 620px;
      margin: 32px auto;
      padding: 0 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background: #f8fafc;
    }
    .card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 26px 28px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .brand-header img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    h1 { font-size: 19px; margin: 0 0 4px 0; color: #0f172a; }
    p { font-size: 13px; color: #64748b; margin: 0; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #0f172a; }
    input[type="text"], select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      box-sizing: border-box;
      background: #ffffff;
      color: #1e293b;
    }
    input[type="text"]:focus, select:focus {
      outline: none;
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
    }
    .hint { font-size: 12px; color: #64748b; margin-top: 6px; line-height: 1.4; }
    .tip-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 18px;
      font-size: 12px;
      color: #166534;
      line-height: 1.5;
    }
    .tip-box strong { color: #14532d; }
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 14px;
      margin-top: 8px;
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
    }
    .checkbox-box {
      background: #f8fafc;
      padding: 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0;
    }
    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin-top: 2px;
      cursor: pointer;
    }
    .btn {
      background: #16a34a;
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn:hover { background: #15803d; }
    .saved-toast {
      display: none;
      color: #16a34a;
      font-size: 13px;
      font-weight: 600;
      margin-left: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand-header">
      <img src="icons/icon48.png" alt="Nursery Media Downloader">
      <div>
        <h1>Nursery Media Downloader Settings</h1>
        <p>v1.4.0 • Bright Horizons FamilyApp &amp; Famly Archiver</p>
      </div>
    </div>

    <div class="form-group">
      <label for="downloadFolder">Subfolder Name in Downloads</label>
      <input type="text" id="downloadFolder" value="Nursery_Photos" placeholder="Nursery_Photos">
      
      <div class="info-box">
        <strong>How downloads work:</strong><br>
        Browser extensions save files inside your computer's <strong>Downloads</strong> folder. Files will be saved into the subfolder specified above (default: <code>Nursery_Photos</code>).
      </div>
    </div>

    <div class="form-group checkbox-box">
      <label class="checkbox-label">
        <input type="checkbox" id="promptSaveAs">
        <div>
          <span>Always prompt with File Explorer / Finder save dialog for download batch</span>
          <div class="hint" style="margin-top: 4px; font-weight: normal;">
            When enabled, the browser will open your native <strong>File Explorer</strong> (Windows) or <strong>Finder</strong> (Mac) save dialog so you can choose any custom location or drive on your computer.
          </div>
        </div>
      </label>
    </div>

    <div class="form-group">
      <label for="namingPattern">File Naming Pattern</label>
      <input type="text" id="namingPattern" value="{date}_media_{index}">
      <div class="hint">Supported tokens: <code>{date}</code> (YYYY-MM-DD), <code>{index}</code> (001, 002), <code>{type}</code> (photo, video)</div>
    </div>

    <div class="tip-box" style="background: #f8fafc; border-color: #cbd5e1; color: #334155; margin-top: 15px;">
      <strong>1920x1080 Master Recovery &amp; Local EXIF Privacy</strong><br>
      The extension automatically inspects responsive image sets (<code>srcset</code>) to download uncompressed master photos, embeds original capture dates into EXIF metadata locally in memory, and collects zero telemetry.
    </div>

    <button id="saveBtn" class="btn">Save Preferences</button>
    <span id="savedToast" class="saved-toast">Saved successfully!</span>
  </div>

  <script src="options.js"></script>
</body>
</html>
`;

export const OPTIONS_JS = `// Options page logic
document.addEventListener('DOMContentLoaded', () => {
  const folderInput = document.getElementById('downloadFolder');
  const promptSaveAs = document.getElementById('promptSaveAs');
  const patternInput = document.getElementById('namingPattern');
  const saveBtn = document.getElementById('saveBtn');
  const savedToast = document.getElementById('savedToast');

  // Load saved settings
  chrome.storage.sync.get({
    downloadFolder: 'Nursery_Photos',
    namingPattern: '{date}_media_{index}',
    promptSaveAs: false
  }, (items) => {
    folderInput.value = items.downloadFolder || 'Nursery_Photos';
    patternInput.value = items.namingPattern || '{date}_media_{index}';
    promptSaveAs.checked = Boolean(items.promptSaveAs);
  });

  saveBtn.addEventListener('click', () => {
    chrome.storage.sync.set({
      downloadFolder: folderInput.value.trim() || 'Nursery_Photos',
      namingPattern: patternInput.value.trim() || '{date}_media_{index}',
      promptSaveAs: promptSaveAs.checked
    }, () => {
      savedToast.style.display = 'inline';
      setTimeout(() => {
        savedToast.style.display = 'none';
      }, 2000);
    });
  });
});
`;

export const EXTENSION_FILES: ExtensionFile[] = [
  {
    path: 'manifest.json',
    name: 'manifest.json',
    language: 'json',
    category: 'manifest',
    description: 'Manifest V3 configuration with permissions, host matches, and service worker declaration.',
    content: MANIFEST_JSON,
  },
  {
    path: 'background.js',
    name: 'background.js',
    language: 'javascript',
    category: 'scripts',
    description: 'Service worker managing batch downloads, automatic EXIF DateTimeOriginal injection, file timestamping, and rate-limiting.',
    content: BACKGROUND_JS,
  },
  {
    path: 'content.js',
    name: 'content.js',
    language: 'javascript',
    category: 'scripts',
    description: 'In-page DOM scraper: replaces cropped thumbnails with 1920x1080 originals, parses dates, and injects floating UI.',
    content: CONTENT_JS,
  },
  {
    path: 'content.css',
    name: 'content.css',
    language: 'css',
    category: 'ui',
    description: 'Sleek floating in-page UI styling matching modern web standards with minimize and auto-load feedback.',
    content: CONTENT_CSS,
  },
  {
    path: 'popup.html',
    name: 'popup.html',
    language: 'html',
    category: 'ui',
    description: 'Extension action popup showing real-time tab status, queue count, and quick triggers.',
    content: POPUP_HTML,
  },
  {
    path: 'popup.js',
    name: 'popup.js',
    language: 'javascript',
    category: 'scripts',
    description: 'Controller script for the browser action popup.',
    content: POPUP_JS,
  },
  {
    path: 'options.html',
    name: 'options.html',
    language: 'html',
    category: 'ui',
    description: 'Options page allowing parents to customize download folders and date formatting.',
    content: OPTIONS_HTML,
  },
  {
    path: 'options.js',
    name: 'options.js',
    language: 'javascript',
    category: 'scripts',
    description: 'Settings persistence script using chrome.storage.sync.',
    content: OPTIONS_JS,
  },
];
