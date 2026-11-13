import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Image as ImageIcon,
  FileText,
  PackageCheck,
  Lock
} from 'lucide-react';
import { BRAND, PRIVACY_POLICY_MD } from '../constants/brand';
import {
  drawBrandIconOnCanvas,
  drawStorePromoTile,
  drawStoreScreenshot,
  downloadStorePublishingKitZip,
  downloadExtensionZip
} from '../services/extensionExporter';
import { BrandLogo } from './BrandLogo';

const SINGLE_PURPOSE_STATEMENT = `${BRAND.name} has a single, clear purpose: allowing parents and guardians to bulk-download high-resolution 1920x1080 photos and videos of their children from their authenticated Famly and Bright Horizons FamilyApp nursery feeds directly to their local computer with original capture dates preserved in EXIF metadata and filenames.`;

const PERMISSION_JUSTIFICATIONS = [
  {
    permission: 'downloads',
    scope: 'Core Archiver',
    justification:
      'Required exclusively to save discovered high-resolution nursery photos and videos directly into the user\'s local Downloads/Nursery_Photos subfolder using chrome.downloads.download.',
  },
  {
    permission: 'storage',
    scope: 'Local Preferences',
    justification:
      'Required to persist user settings (destination subfolder name, filename pattern, and Save-As prompt toggle) in chrome.storage.sync and deduplicate previously downloaded URLs in chrome.storage.local.',
  },
  {
    permission: 'activeTab',
    scope: 'Popup Interaction',
    justification:
      'Allows the browser action popup to query media queue counts and trigger batch downloads or feed auto-scrolling on the currently active nursery portal tab without requiring broad "tabs" browsing history access.',
  },
  {
    permission: 'host_permissions',
    scope: 'Nursery Feeds & CDNs',
    justification:
      'Strictly scoped to Bright Horizons (*.brighthorizons.co.uk, *.brighthorizons.com), Famly (*.famly.co, *.famly.com, *.famly.dk, *.famly.net), and their media CDNs (*.cloudfront.net, *.amazonaws.com) to discover feed media and inject capture dates into JPEG EXIF headers.',
  },
];

export const StorePublishingKit: React.FC = () => {
  const icon128Ref = useRef<HTMLCanvasElement>(null);
  const promoTileRef = useRef<HTMLCanvasElement>(null);
  const screenshotRef = useRef<HTMLCanvasElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExportingKit, setIsExportingKit] = useState<boolean>(false);
  const [isExportingExt, setIsExportingExt] = useState<'chromium' | 'firefox' | null>(null);

  useEffect(() => {
    if (icon128Ref.current) {
      drawBrandIconOnCanvas(icon128Ref.current, 128);
    }
    if (promoTileRef.current) {
      drawStorePromoTile(promoTileRef.current);
    }
    if (screenshotRef.current) {
      drawStoreScreenshot(screenshotRef.current);
    }
  }, []);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCanvas = (canvas: HTMLCanvasElement | null, filename: string) => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  };

  const handleDownloadIconSize = (size: number) => {
    const temp = document.createElement('canvas');
    drawBrandIconOnCanvas(temp, size);
    handleDownloadCanvas(temp, `${BRAND.slug}-icon-${size}x${size}.png`);
  };

  const handleExportStoreKit = async () => {
    setIsExportingKit(true);
    try {
      await downloadStorePublishingKitZip();
    } finally {
      setIsExportingKit(false);
    }
  };

  const handleExportExtension = async (target: 'chromium' | 'firefox') => {
    setIsExportingExt(target);
    try {
      await downloadExtensionZip(target);
    } finally {
      setIsExportingExt(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-14">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-8 sm:p-10 shadow-xl border border-slate-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Release v{BRAND.version} • Store Submission & Visual Artefacts Kit</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              Store Publishing & Brand Artefacts
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Everything needed to publish <strong className="text-white">{BRAND.name}</strong> to the{' '}
              <strong className="text-white">Chrome Web Store</strong>,{' '}
              <strong className="text-white">Microsoft Edge Add-ons</strong>, and{' '}
              <strong className="text-white">Mozilla Firefox Add-ons (AMO)</strong>—including live-rendered promotional banners, icons, permission disclosures, and privacy policy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              id="download-store-kit-btn"
              onClick={handleExportStoreKit}
              disabled={isExportingKit}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {isExportingKit
                  ? 'Bundling Store Kit...'
                  : `Download Store Assets Kit (.ZIP)`}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                id="store-kit-dl-chromium"
                onClick={() => handleExportExtension('chromium')}
                disabled={isExportingExt !== null}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Chrome/Edge ZIP</span>
              </button>
              <button
                id="store-kit-dl-firefox"
                onClick={() => handleExportExtension('firefox')}
                disabled={isExportingExt !== null}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Firefox MV3 ZIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Publish-Readiness Audit Grid */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>v{BRAND.version} Store Readiness & Compliance Verification</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Hardened for automated Chrome Web Store, Edge Partner Center, and Firefox AMO linters.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>6 / 6 Store Checks Passing</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Minimal Scoped Permissions</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Removed broad <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">tabs</code> permission. Uses only <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">downloads</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">storage</code>, and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">activeTab</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Video Streaming</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              MP4/MOV videos bypass in-memory base64 <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">data:</code> URL conversion and stream directly through <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">chrome.downloads</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero-innerHTML DOM Safety</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              In-page widget built strictly with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">document.createElement</code> so Mozilla's <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">addons-linter</code> reports 0 warnings.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gecko Data Collection Schema</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Includes <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">data_collection_permissions: &#123; required: ["none"] &#125;</code> and ID <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{BRAND.geckoAddonId}</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CDN EXIF Header Access</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Explicit host permissions for nursery portals and CloudFront/S3 media CDNs ensure JPEG EXIF <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">DateTimeOriginal</code> injection succeeds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bundled Privacy Policy</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Every exported ZIP includes <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">PRIVACY_POLICY.md</code> and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">STORE_LISTING.md</code> alongside icons (`16`, `32`, `48`, `128`).
            </p>
          </div>
        </div>
      </div>

      {/* Visual Artefacts Studio */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            <span>Official Brand & Store Visual Artefacts</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            High-DPI PNG assets rendered directly from the unified vector specification. Download individual files or export all in the Store Kit ZIP.
          </p>
        </div>

        {/* Row 1: Brand Icon Suite + 440x280 Store Promo Tile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Brand Icon Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Extension Icon Suite
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  16 • 32 • 48 • 128 • 512px
                </span>
              </div>

              <div className="flex items-center gap-5 py-4 px-4 bg-white rounded-xl border border-slate-200 mb-4">
                <canvas
                  ref={icon128Ref}
                  className="w-20 h-20 rounded-2xl shadow-sm shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="font-bold text-sm text-slate-900">{BRAND.name}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Precision camera body, multi-ring aperture lens, and emerald local-download badge on a teal-emerald squircle.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <BrandLogo size="xs" />
                    <BrandLogo size="sm" />
                    <BrandLogo size="md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[16, 32, 48, 128, 512].map((sz) => (
                <button
                  key={sz}
                  onClick={() => handleDownloadIconSize(sz)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3 text-sky-600" />
                  <span>{sz}×{sz}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 440x280 Small Promo Tile Card */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Chrome Web Store & Edge Small Promo Tile
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  440 × 280 PNG
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-900 flex justify-center mb-4">
                <canvas
                  ref={promoTileRef}
                  className="w-full max-w-[440px] h-auto block"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500">
                Ready for Chrome Web Store & Edge Partner Center promotional tile slot
              </span>
              <button
                onClick={() =>
                  handleDownloadCanvas(
                    promoTileRef.current,
                    `${BRAND.slug}-promo-tile-440x280.png`
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download 440×280 PNG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: 1280x800 Annotated Store Listing Screenshot */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Store Listing Primary Screenshot (Chrome, Edge & Firefox AMO)
              </span>
              <p className="text-xs text-slate-500">
                Annotated 1280×800 showcase of the 1920×1080 feed harvester, EXIF DateTimeOriginal stamps, and floating control widget.
              </p>
            </div>
            <button
              onClick={() =>
                handleDownloadCanvas(
                  screenshotRef.current,
                  `${BRAND.slug}-screenshot-1280x800.png`
                )
              }
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download 1280×800 Screenshot PNG</span>
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-950">
            <canvas
              ref={screenshotRef}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>

      {/* Store Portal Copy & Privacy Policy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Single-Purpose & Permission Justifications */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-600" />
                <span>Store Permission Justifications</span>
              </h3>
              <button
                onClick={() => handleCopyText('single-purpose', SINGLE_PURPOSE_STATEMENT)}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'single-purpose' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Statement</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Single-Purpose</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Single-Purpose Policy Statement:</strong>
              {SINGLE_PURPOSE_STATEMENT}
            </div>

            <div className="space-y-2.5">
              {PERMISSION_JUSTIFICATIONS.map((item) => (
                <div
                  key={item.permission}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <code className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.permission}
                    </code>
                    <button
                      onClick={() => handleCopyText(item.permission, item.justification)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === item.permission ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{item.justification}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Privacy Policy Document */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Official Privacy Policy (PRIVACY_POLICY.md)</span>
              </h3>
              <button
                onClick={() => handleCopyText('privacy-policy', PRIVACY_POLICY_MD)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'privacy-policy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Privacy Policy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[430px] whitespace-pre-wrap border border-slate-800">
              {PRIVACY_POLICY_MD}
            </pre>
          </div>

          <p className="text-[11px] text-slate-500 mt-3">
            Tip: Host this Markdown file in your GitHub repository or landing page and paste the URL into the Privacy Policy field on Chrome Web Store, Edge Partner Center, and Firefox AMO.
          </p>
        </div>
      </div>
    </div>
  );
};
