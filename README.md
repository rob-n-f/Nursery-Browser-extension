# Nursery Media Downloader (v1.4.0 • Manifest V3)

**High-Resolution 1920×1080 Photo & Video Archiver with Embedded EXIF Datestamps for Bright Horizons FamilyApp & Famly**

Supports **Google Chrome**, **Microsoft Edge**, and **Mozilla Firefox** (Manifest V3).

---

## Overview

This repository contains both:
1. **The Interactive Web App, Simulator & Store Packager** (`src/`) — Live browser simulator, installation walkthrough, destination folder guide, and one-click `.zip` packager for Chrome/Edge, Firefox, and Store Promotional Visual Artefacts.
2. **The Manifest V3 Browser Extension Source** (`src/extension-files/extensionData.ts`) — Complete, zero-dependency WebExtension source code with embedded JPEG `APP1` EXIF datestamp injection, 1920×1080 CDN master photo recovery, direct MP4/MOV video streaming, and automated feed scrolling.

---

## Publish-Readiness Highlights (v1.4.0)

* **Minimal Scoped Permissions:** Requests only `downloads`, `storage`, and `activeTab` (no broad `tabs` permission) plus explicit host permissions for Famly, Bright Horizons, and their CloudFront/S3 media CDNs.
* **Direct Video Streaming:** `.mp4` and `.mov` videos stream directly through `chrome.downloads.download` while JPEG photos undergo in-memory `APP1` EXIF `DateTimeOriginal` header injection.
* **Mozilla Firefox AMO Ready:** Configured with `browser_specific_settings.gecko.id` (`nursery-media-downloader@robinfowler.addon`), `data_collection_permissions: { required: ["none"] }`, and 100% `document.createElement`-based DOM construction (zero `innerHTML` usage).
* **Unified Visual Brand & Store Kit:** High-DPI vector brand emblem (`16×16`, `32×32`, `48×48`, `128×128`, `512×512`), `440×280` Promotional Tile, `1280×800` Annotated Store Screenshot, and [PRIVACY_POLICY.md](./PRIVACY_POLICY.md).

---

## Development

```bash
npm install
npm run dev
```
