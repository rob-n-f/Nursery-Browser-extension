/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ExtensionOverview } from './components/ExtensionOverview';
import { FolderSetupGuide } from './components/FolderSetupGuide';
import { ChromeAppPreview } from './components/ChromeAppPreview';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('preview');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <ExtensionOverview onSwitchTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'preview' && <ChromeAppPreview />}

        {activeTab === 'folder' && <FolderSetupGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Nursery Media Downloader</span>
            <span>•</span>
            <span>Chrome, Edge & Firefox Ready • Manifest V3</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('preview')}
              className="hover:text-slate-800 transition-colors cursor-pointer font-medium text-sky-700"
            >
              Preview Chrome App
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Installation Guide
            </button>
            <button
              onClick={() => setActiveTab('folder')}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Choose Destination Folder
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
