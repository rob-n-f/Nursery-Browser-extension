import React from 'react';
import { Download, Code, Layers, Sparkles, FolderSync, Folder, Chrome } from 'lucide-react';
import { downloadExtensionZip } from '../services/extensionExporter';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadExtensionZip();
    } finally {
      setIsExporting(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview & Install', icon: Download },
    { id: 'preview', label: 'Preview Chrome App', icon: Chrome, badge: 'Interactive' },
    { id: 'folder', label: 'Choose Destination Folder', icon: FolderSync },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  Nursery Media Downloader
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Chrome • Edge • Firefox Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Bulk high-resolution media archiver with automatic EXIF datestamping for Chrome, Edge, and Firefox
              </p>
            </div>
          </div>

          {/* Quick Download Button */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Packaging...' : 'Download Extension (.ZIP)'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
