import React, { useState } from 'react';
import {
  Download,
  Chrome,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Calendar,
  Image as ImageIcon,
  Zap,
  FolderSync,
  ShieldCheck
} from 'lucide-react';
import { downloadExtensionZip } from '../services/extensionExporter';

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
      const msg = target === 'firefox'
        ? 'Downloaded famly-downloader-firefox-mv3.zip! Pre-configured for Firefox.'
        : 'Downloaded famly-downloader-chrome-edge-mv3.zip! Ready for Chrome & Edge.';
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
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chrome • Edge • Firefox Ready • Manifest V3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Nursery Media Downloader
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Bulk download high-resolution photos and videos with original dates from{' '}
            <strong className="text-white">Bright Horizons FamilyApp</strong> and{' '}
            <strong className="text-white">Famly</strong>. Complete with 1920x1080 master photo recovery,
            feed auto-scroller, automatic EXIF datestamping, and smart folder sync with your online photo gallery.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onSwitchTab('preview')}
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-extrabold text-sm bg-sky-400 hover:bg-sky-300 text-slate-950 transition-all shadow-lg shadow-sky-400/25 active:scale-98 cursor-pointer border border-sky-300"
            >
              <Chrome className="w-5 h-5 text-slate-950" />
              <span>Preview Chrome App (Live Simulator)</span>
            </button>

            <button
              onClick={() => handleDownloadZip('chromium')}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{isExporting === 'chromium' ? 'Packaging Chrome/Edge...' : 'Download for Chrome & Edge (.ZIP)'}</span>
            </button>

            <button
              onClick={() => handleDownloadZip('firefox')}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-400 text-white transition-all shadow-lg shadow-orange-500/20 active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{isExporting === 'firefox' ? 'Packaging Firefox...' : 'Download for Firefox (.ZIP)'}</span>
            </button>

            <button
              onClick={() => onSwitchTab('folder')}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 border border-sky-800/60 transition-all cursor-pointer"
            >
              <FolderSync className="w-4 h-4 text-sky-300" />
              <span>Choose Destination Folder</span>
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
              <h2 className="text-xl font-bold text-slate-900">How to Install (Chrome, Edge & Firefox)</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Full Manifest V3 compatibility across all three major browsers with zero dependencies.
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
                  ? 'bg-white text-orange-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🦊 Mozilla Firefox
            </button>
            <button
              onClick={() => setInstallMode('developer')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                installMode === 'developer'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Store Publishing & ZIP
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
                <h3 className="font-bold text-sm text-slate-900 mb-1">Click "Add to Chrome"</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open the extension listing page on the official <strong>Chrome Web Store</strong> and click the blue <strong>Add to Chrome</strong> button.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Confirm Permissions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When Chrome displays the verification prompt, click <strong>Add extension</strong> to enable media access on Famly and Bright Horizons.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Pin to Toolbar</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click the <strong>Extensions puzzle icon</strong> in Chrome's top bar and click the pin icon next to <strong>Nursery Media Downloader</strong> for one-click access.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-emerald-950 mb-1">Open Famly & Download</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Visit <strong className="font-medium text-emerald-950">Bright Horizons</strong> or <strong className="font-medium text-emerald-950">Famly</strong>. The floating control panel activates automatically in the corner!
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  <strong>Official Store Security:</strong> Manifest V3 sandboxed code, zero telemetry, and permissions strictly scoped to nursery feeds.
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
                <h3 className="font-bold text-sm text-slate-900 mb-1">Allow Other Stores</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In Microsoft Edge, open the extension page. Click the banner prompt <strong>"Allow extensions from other stores"</strong> (or visit Microsoft Edge Add-ons).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Click "Get" or "Add"</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Get</strong> (or <strong>Add to Chrome</strong>). Microsoft Edge will display its native permission approval dialog.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Confirm in Edge</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Add extension</strong> in the Edge prompt. Then click the puzzle icon (`🧩`) and select <strong>Show in toolbar</strong>.
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
                  <strong>Native Chromium Architecture:</strong> Microsoft Edge runs the exact same engine as Chrome. The extension works with 100% native performance, full auto-scrolling, and options sync.
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
              <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 relative">
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Download & Unzip</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Download for Firefox (.ZIP)</strong> above and unzip <code className="bg-orange-100 text-orange-900 px-1 py-0.5 rounded font-mono text-[11px]">famly-downloader-firefox-mv3.zip</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Open Firefox Debugging</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In Firefox, type <code className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded font-mono text-[11px]">about:debugging#/runtime/this-firefox</code> in the address bar and press Enter.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Load Temporary Add-on</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click <strong>Load Temporary Add-on...</strong> and select the <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">manifest.json</code> file inside the unzipped folder.
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

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-orange-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  <strong>Gecko Manifest V3 Pre-Configured:</strong> The Firefox package automatically configures <code className="bg-orange-100 text-orange-900 px-1 py-0.5 rounded font-mono">browser_specific_settings.gecko.id</code> and standard background scripts required by Mozilla Firefox.
                </span>
              </div>
              <button
                onClick={() => setInstallMode('developer')}
                className="text-orange-700 hover:text-orange-900 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Submitting to Firefox Add-ons (AMO)? →
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
                  Download the Chrome/Edge ZIP or Firefox ZIP above. Both packages are pre-bundled with Manifest V3, background workers, and store-ready icons.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Store Dashboards</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit to <a href="https://chrome.google.com/webstore/devconsole" target="_blank" rel="noreferrer" className="text-sky-600 font-semibold hover:underline">Chrome Dev Console</a>, <a href="https://partner.microsoft.com/dashboard/microsoftedge" target="_blank" rel="noreferrer" className="text-teal-600 font-semibold hover:underline">Edge Partner Center</a>, or <a href="https://addons.mozilla.org/developers/" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">Mozilla AMO</a>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Upload Archive</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload the matching <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">.zip</code> to your chosen developer portal. No extra build tools or compiling needed.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Submit for Review</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Confirm single-purpose policy (*Photos & Downloads*), and submit for live listing across Chrome, Edge, and Firefox!
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Local Unpacked Testing:</strong> In Chrome visit <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">chrome://extensions</code>; in Edge visit <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">edge://extensions</code>; in Firefox visit <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">about:debugging</code>.
                </span>
              </div>
              <button
                onClick={() => setInstallMode('chrome')}
                className="text-sky-700 hover:text-sky-900 font-semibold underline shrink-0 cursor-pointer self-start sm:self-auto"
              >
                ← Back to User Guide
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
            <h3 className="text-base font-bold text-slate-900 mb-2">Automatic 1920x1080 Master Photos</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Famly & Bright Horizons display lower-res previews in feeds (e.g. 1040x520 or cropped thumbnails). The extension
              automatically inspects responsive <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">srcset</code> sources and CDN paths to always download the uncompressed 1920x1080 master photo.
            </p>
          </div>
          <div className="text-xs font-medium text-sky-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Always highest resolution by default</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Chronological Date Naming</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Media is stamped with its exact capture date extracted from CDN archive paths or post timestamps,
              e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">2024-05-14_media_001.jpg</code>.
              Your photos stay perfectly sorted by date.
            </p>
          </div>
          <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Preserves exact timeline</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <FolderSync className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Online Photo Gallery Sync</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pick any subfolder synced by Google Drive, iCloud Photos, or OneDrive. Every nursery download
              automatically uploads to your cloud gallery with its original capture date preserved in EXIF.
            </p>
          </div>
          <button
            onClick={() => onSwitchTab('folder')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Choose Folder in File Explorer</span>
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
            <h4 className="font-bold text-sm text-slate-900">Supported Famly Nurseries & Daycares</h4>
            <p className="text-xs text-slate-500">
              Matches <span className="font-mono text-slate-700">familyapp.brighthorizons.co.uk</span> and <span className="font-mono text-slate-700">app.famly.co</span> automatically.
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
