import React, { useState } from 'react';
import {
  Download,
  Chrome,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Zap,
  FolderSync,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { downloadExtensionZip } from '../services/extensionExporter';
import { BRAND } from '../constants/brand';
import { BrandLogo } from './BrandLogo';

interface ExtensionOverviewProps {
  onSwitchTab: (tab: string) => void;
}

type InstallMode = 'chrome' | 'edge' | 'firefox' | 'developer';

export const ExtensionOverview: React.FC<ExtensionOverviewProps> = ({ onSwitchTab }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [installMode, setInstallMode] = useState<InstallMode>('chrome');

  const handleDownloadZip = async (target: 'chromium' | 'firefox') => {
    setIsExporting(target);
    try {
      await downloadExtensionZip(target);
      const msg =
        target === 'firefox'
          ? `Downloaded ${BRAND.zipFileNames.firefox}! Pre-configured for Firefox MV3.`
          : `Downloaded ${BRAND.zipFileNames.chromium}! Ready for Chrome & Edge.`;
      setDownloadSuccessMessage(msg);
      setTimeout(() => setDownloadSuccessMessage(null), 4500);
    } catch (err) {
      console.error('Failed to export zip:', err);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-5">
            <BrandLogo size="lg" className="rounded-2xl shadow-lg" />
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                v{BRAND.version} • Chrome, Edge &amp; Firefox Manifest V3
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {BRAND.subtitle}
              </p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {BRAND.name}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Bulk download high-resolution photos and videos with original capture dates from{' '}
            <strong className="text-white">Bright Horizons FamilyApp</strong> and{' '}
            <strong className="text-white">Famly</strong>. Complete with 1920×1080 master photo recovery,
            feed auto-scroller, automatic JPEG EXIF datestamping, and smart folder sync with your cloud photo gallery.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              id="hero-download-chromium-btn"
              onClick={() => handleDownloadZip('chromium')}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>
                {isExporting === 'chromium'
                  ? 'Packaging Chrome/Edge...'
                  : 'Download for Chrome & Edge (.ZIP)'}
              </span>
            </button>

            <button
              id="hero-download-firefox-btn"
              onClick={() => handleDownloadZip('firefox')}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>
                {isExporting === 'firefox'
                  ? 'Packaging Firefox...'
                  : 'Download for Firefox (.ZIP)'}
              </span>
            </button>

            <button
              id="hero-store-kit-btn"
              onClick={() => onSwitchTab('store-kit')}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Store Kit &amp; Brand Assets</span>
            </button>
          </div>

          {downloadSuccessMessage && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Installation Walkthrough with Chrome, Edge & Firefox support */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700">
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                How to Install (Chrome, Edge &amp; Firefox)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Full Manifest V3 compatibility across all three major browsers with zero external dependencies.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setInstallMode('chrome')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                installMode === 'chrome'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Chrome
            </button>
            <button
              onClick={() => setInstallMode('edge')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                installMode === 'edge'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Microsoft Edge
            </button>
            <button
              onClick={() => setInstallMode('firefox')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                installMode === 'firefox'
                  ? 'bg-white text-amber-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mozilla Firefox
            </button>
            <button
              onClick={() => setInstallMode('developer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                installMode === 'developer'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Store Publishing &amp; ZIP
            </button>
          </div>
        </div>

        {installMode === 'chrome' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Download &amp; Unzip</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Download for Chrome &amp; Edge (.ZIP)</strong> above and extract{' '}
                  <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                    {BRAND.zipFileNames.chromium}
                  </code>
                  , or install from the Chrome Web Store.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Load Extension</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">chrome://extensions</code>, enable <strong>Developer mode</strong>, and click <strong>Load unpacked</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Pin to Toolbar</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click the <strong>Extensions puzzle icon</strong> in Chrome&apos;s top bar and pin <strong>{BRAND.name}</strong> for one-click access.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-emerald-950 mb-1">Open Feed &amp; Archive</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Visit <strong className="font-medium text-emerald-950">Bright Horizons</strong> or <strong className="font-medium text-emerald-950">Famly</strong>. The floating control panel activates automatically!
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  <strong>Store-Hardened Privacy:</strong> Manifest V3 sandboxed service worker, zero telemetry, and minimal permissions (<code className="font-mono">downloads, storage, activeTab</code>).
                </span>
              </div>
              <button
                onClick={() => setInstallMode('firefox')}
                className="text-sky-700 hover:text-sky-900 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Using Mozilla Firefox? See Firefox guide →
              </button>
            </div>
          </div>
        )}

        {installMode === 'edge' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Download &amp; Unzip</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download and extract{' '}
                  <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                    {BRAND.zipFileNames.chromium}
                  </code>
                  , or install directly from Microsoft Edge Add-ons.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Open Edge Extensions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Navigate to <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">edge://extensions</code>, turn on <strong>Developer mode</strong>, and click <strong>Load unpacked</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Pin in Toolbar</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click the puzzle icon in Edge&apos;s toolbar and toggle <strong>Show in toolbar</strong> next to <strong>{BRAND.name}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-emerald-950 mb-1">Ready in Famly</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Open your Famly or Bright Horizons account in Edge. The floating panel appears with full EXIF datestamping and 1080p recovery!
                </p>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Native Chromium Architecture:</strong> Microsoft Edge runs the exact same Manifest V3 engine as Chrome with 100% native performance and options sync.
                </span>
              </div>
              <button
                onClick={() => setInstallMode('firefox')}
                className="text-teal-700 hover:text-teal-900 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Using Mozilla Firefox? See Firefox guide →
              </button>
            </div>
          </div>
        )}

        {installMode === 'firefox' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 relative">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Download &amp; Unzip</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Download for Firefox (.ZIP)</strong> above and unzip{' '}
                  <code className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono text-[11px]">
                    {BRAND.zipFileNames.firefox}
                  </code>
                  .
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Open Firefox Debugging</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In Firefox, type{' '}
                  <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">
                    about:debugging#/runtime/this-firefox
                  </code>{' '}
                  in the address bar and press Enter.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Load Temporary Add-on</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Load Temporary Add-on...</strong> and select the{' '}
                  <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">
                    manifest.json
                  </code>{' '}
                  file inside the unzipped folder.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-emerald-950 mb-1">Active in Famly</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Open <strong className="font-medium text-emerald-950">Bright Horizons</strong> or <strong className="font-medium text-emerald-950">Famly</strong> in Firefox. The floating widget activates with 1080p recovery!
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Gecko Manifest V3 Pre-Configured:</strong> Automatically configures{' '}
                  <code className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono">
                    {BRAND.geckoAddonId}
                  </code>
                  , <code className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono">data_collection_permissions</code>, and zero-innerHTML DOM construction.
                </span>
              </div>
              <button
                onClick={() => onSwitchTab('store-kit')}
                className="text-amber-800 hover:text-amber-950 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Open Store Publishing Kit →
              </button>
            </div>
          </div>
        )}

        {installMode === 'developer' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Download Store ZIP</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download the Chrome/Edge ZIP or Firefox ZIP above. Both archives include Manifest V3, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">PRIVACY_POLICY.md</code>, and 16/32/48/128 icons.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Export Visual Artefacts</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open the{' '}
                  <button
                    onClick={() => onSwitchTab('store-kit')}
                    className="text-sky-600 font-semibold hover:underline cursor-pointer"
                  >
                    Store Kit &amp; Brand Assets
                  </button>{' '}
                  tab to export your 440×280 Promo Tile, 1280×800 Screenshot, and 512×512 Store Icon.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Upload Archive</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit to{' '}
                  <a
                    href="https://chrome.google.com/webstore/devconsole"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Chrome Dev Console
                  </a>
                  ,{' '}
                  <a
                    href="https://partner.microsoft.com/dashboard/microsoftedge"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 font-semibold hover:underline"
                  >
                    Edge Partner Center
                  </a>
                  , or{' '}
                  <a
                    href="https://addons.mozilla.org/developers/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    Mozilla AMO
                  </a>
                  .
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Paste Disclosures</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Copy the pre-written permission justifications and Privacy Policy from the Store Kit tab and submit for review!
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Complete Store Kit Ready:</strong> Includes 440×280 promo tile, 1280×800 annotated screenshot, permission justification table, and privacy policy.
                </span>
              </div>
              <button
                onClick={() => onSwitchTab('store-kit')}
                className="text-sky-700 hover:text-sky-900 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Open Store Publishing Kit →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Automatic 1920×1080 Master Photos
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Famly &amp; Bright Horizons display lower-res previews in feeds (e.g. 1040×520 or cropped thumbnails). The extension
              automatically inspects responsive{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">srcset</code> sources and CDN paths to always download the uncompressed 1920×1080 master photo.
            </p>
          </div>
          <div className="text-xs font-semibold text-sky-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Always highest resolution by default</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              EXIF Datestamps &amp; Date Naming
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Every JPEG has its capture date injected into the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">DateTimeOriginal</code> EXIF tag and filename, e.g.,{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">2024-05-14_media_001.jpg</code>.
              Your photos stay sorted chronologically in any gallery.
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Preserves exact capture timeline</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <FolderSync className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Cloud Photo Gallery Sync
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pick any subfolder synced by Google Drive, Apple iCloud Photos, or Microsoft OneDrive. Every nursery download
              automatically uploads to your cloud gallery with its original capture date intact.
            </p>
          </div>
          <button
            onClick={() => onSwitchTab('folder')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Configure Download Subfolder</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Platforms Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Supported Famly &amp; Bright Horizons Portals
            </h4>
            <p className="text-xs text-slate-500">
              Matches <span className="font-mono text-slate-700">familyapp.brighthorizons.co.uk</span> and{' '}
              <span className="font-mono text-slate-700">app.famly.co</span> automatically.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://familyapp.brighthorizons.co.uk"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <span>Bright Horizons</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://app.famly.co"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <span>Famly Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
