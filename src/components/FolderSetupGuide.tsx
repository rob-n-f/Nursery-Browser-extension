import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Laptop,
  Image as ImageIcon,
  Info,
  ShieldCheck,
  HardDrive,
  Cloud
} from 'lucide-react';

export const FolderSetupGuide: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [copiedFolder, setCopiedFolder] = useState<boolean>(false);

  const handleLaunchFileExplorer = async () => {
    // 1. Try modern File System Access API (Chrome/Edge)
    if ('showDirectoryPicker' in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker();
        if (dirHandle && dirHandle.name) {
          setSelectedFolder(dirHandle.name);
          return;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User cancelled
      }
    }

    // 2. Fallback / Firefox
    const folderName = prompt(
      'Enter download subfolder name (default: Nursery_Photos):',
      selectedFolder || 'Nursery_Photos'
    );
    if (folderName && folderName.trim()) {
      setSelectedFolder(folderName.trim());
    }
  };

  const handleCopyFolder = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedFolder(true);
    setTimeout(() => setCopiedFolder(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Organized Downloads Folder</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
            Choose Your Download Folder
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Browser extensions save downloaded files inside your computer's <strong className="text-white">Downloads</strong> folder.
            By default, all your child's high-resolution photos and videos are cleanly organized inside a dedicated
            <strong className="text-white"> Nursery_Photos</strong> subfolder.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              The extension automatically embeds original capture dates into each photo’s <strong>EXIF metadata</strong> so when you import them into Google Photos, Apple Photos, or file managers, each picture sorts onto its <strong>exact date in your timeline</strong>!
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Folder Picker Sandbox */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-sky-600" />
              <span>Configure Download Subfolder</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Files are saved in your Downloads directory under this subfolder (default: <code>Nursery_Photos</code>).
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunchFileExplorer}
            className="inline-flex items-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0 select-none border-0"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Set Subfolder Name</span>
          </button>
        </div>

        {selectedFolder ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <span className="text-xs text-emerald-700 font-medium">Selected Destination Folder:</span>
                <div className="font-bold text-slate-900 text-base">{selectedFolder}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyFolder(selectedFolder)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                {copiedFolder ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Folder Name</span>
                  </>
                )}
              </button>
              <button
                onClick={handleLaunchFileExplorer}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline px-2 cursor-pointer"
              >
                Change Folder
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-xs sm:text-sm text-slate-600">
            <Folder className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-medium text-slate-700 mb-1">No folder selected yet in preview test</p>
            <p className="text-slate-500 text-xs">
              Click <strong>"Launch File Explorer"</strong> above to test choosing a destination folder on your machine.
            </p>
          </div>
        )}
      </div>

      {/* How to configure in Extension */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h4 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-sky-600" />
          <span>How to Pick Your Folder in the Extension (3 Simple Steps):</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-2">
              1
            </div>
            <h5 className="font-bold text-slate-900 mb-1">Open Extension Options</h5>
            <p className="text-slate-600 text-xs">
              Right-click the Nursery Media Downloader icon in Chrome or Edge and click <strong>Options</strong>, or click <strong>Folder & Settings ⚙️</strong> in the in-page floating widget.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
            <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              2
            </div>
            <h5 className="font-bold text-sky-950 mb-1">Set Subfolder Name</h5>
            <p className="text-sky-900 text-xs">
              Keep the default <strong>Nursery_Photos</strong> or type your preferred folder name (e.g. <code>Nursery/2025</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-2">
              3
            </div>
            <h5 className="font-bold text-emerald-950 mb-1">Save & Auto-Sync</h5>
            <p className="text-emerald-900 text-xs">
              Click <strong>Save Preferences</strong>. All downloaded photos are now immediately saved into your chosen folder with automatic EXIF datestamping!
            </p>
          </div>
        </div>
      </div>

      {/* Online Gallery Sync Suggestion Card */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 rounded-2xl p-6 sm:p-8 text-white shadow-xs border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold">Why sync with an online photo gallery?</h4>
              <p className="text-xs text-slate-400">Turn your computer into an automatic cloud nursery backup bridge</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Recommended
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-bold text-white mb-1">Google Drive & Photos</div>
            <p className="leading-relaxed">
              If you use Google Drive for Desktop, choosing your synced Drive folder uploads pictures straight to Google Photos automatically.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-bold text-white mb-1">Apple iCloud Photos</div>
            <p className="leading-relaxed">
              On Mac or Windows with iCloud Photos, choosing your iCloud folder puts all high-res photos instantly onto your iPhone, iPad, and family albums.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <div className="font-bold text-white mb-1">Microsoft OneDrive</div>
            <p className="leading-relaxed">
              Choosing your OneDrive Pictures folder backs up everything to your Microsoft account with mobile photo gallery integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
