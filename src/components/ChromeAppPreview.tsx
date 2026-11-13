import React, { useState, useEffect, useRef } from 'react';
import {
  Chrome,
  Download,
  FolderOpen,
  Settings,
  Sparkles,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  Film,
  Calendar,
  Lock,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minus,
  X,
  Play,
  Pause,
  Sliders,
  Puzzle,
  Eye,
  Info,
  Check
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BRAND } from '../constants/brand';

interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  room: string;
  date: string;
  timestampStr: string;
  caption: string;
  media: {
    id: string;
    type: 'photo' | 'video';
    previewUrl: string;
    originalUrl: string;
    resolution: string;
    title: string;
    date: string;
  }[];
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Sarah Jenkins (Key Person)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    room: 'Pre-School • Oak Room',
    date: '2024-05-15',
    timestampStr: 'Today, 10:45 AM',
    caption: '🎨 Spring Garden Art & Flower Painting: The children loved exploring watercolors and mixed textures today, creating vibrant spring sunflowers and daisies for our seasonal display!',
    media: [
      {
        id: 'm1',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Painting sunflower petals',
        date: '2024-05-15 10:32:00'
      },
      {
        id: 'm2',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Finished spring watercolor',
        date: '2024-05-15 10:41:12'
      },
      {
        id: 'm3',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Child proudly showing artwork',
        date: '2024-05-15 10:44:28'
      }
    ]
  },
  {
    id: 'post-2',
    author: 'Emily Hughes',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    room: 'Pre-School • Oak Room',
    date: '2024-05-14',
    timestampStr: 'Yesterday, 2:15 PM',
    caption: '🌱 Planting Sunflower Seeds in Nursery Garden: Hands-on sensory exploration as we scooped compost, sowed seeds, and watered our seedlings ready for sunny days.',
    media: [
      {
        id: 'm4',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Potting compost and seeds',
        date: '2024-05-14 14:05:10'
      },
      {
        id: 'm5',
        type: 'video',
        previewUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1080p Video',
        title: 'Watering can action clip',
        date: '2024-05-14 14:12:44'
      }
    ]
  },
  {
    id: 'post-3',
    author: 'David Clarke (Sports & Movement)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    room: 'Outdoor Playground',
    date: '2024-05-12',
    timestampStr: 'May 12, 11:10 AM',
    caption: '🏃 Outdoor Obstacle Course & Balance Beam: Excellent coordination, teamwork, and jumping skills demonstrated by everyone today!',
    media: [
      {
        id: 'm6',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Balancing on wooden beams',
        date: '2024-05-12 11:02:15'
      },
      {
        id: 'm7',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Tricycle race around cones',
        date: '2024-05-12 11:08:33'
      }
    ]
  }
];

const OLDER_POSTS_BATCH: FeedPost[] = [
  {
    id: 'post-4',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    room: 'Pre-School • Oak Room',
    date: '2024-05-08',
    timestampStr: 'May 8, 9:50 AM',
    caption: '🥞 Fresh Fruit Salad & Healthy Snack Prep: Developing independence and fine motor skills by peeling clementines, chopping bananas, and sharing.',
    media: [
      {
        id: 'm8',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Fruit cutting with toddler safety knives',
        date: '2024-05-08 09:42:00'
      },
      {
        id: 'm9',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Colorful berry bowls',
        date: '2024-05-08 09:47:18'
      }
    ]
  },
  {
    id: 'post-5',
    author: 'Emily Hughes',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    room: 'Reading Corner',
    date: '2024-05-02',
    timestampStr: 'May 2, 3:30 PM',
    caption: '📚 The Gruffalo Storytime & Puppet Show: Deep listening and character voices during afternoon book club.',
    media: [
      {
        id: 'm10',
        type: 'photo',
        previewUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=450&q=80',
        originalUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1920&h=1080&q=95',
        resolution: '1920x1080 Master',
        title: 'Listening attentively on the rug',
        date: '2024-05-02 15:22:10'
      }
    ]
  }
];

interface ChromeAppPreviewProps {
  onSwitchTab?: (tab: string) => void;
}

export const ChromeAppPreview: React.FC<ChromeAppPreviewProps> = () => {
  // Navigation tabs in the simulated Chrome browser
  const [activeChromeTab, setActiveChromeTab] = useState<'feed' | 'options' | 'extensions'>('feed');
  const [browserPortal, setBrowserPortal] = useState<'brighthorizons' | 'famly'>('brighthorizons');

  // Extension popup state (opened via Chrome toolbar icon)
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  // Content script floating widget states
  const [isWidgetMinimized, setIsWidgetMinimized] = useState<boolean>(false);
  const [isWidgetVisible, setIsWidgetVisible] = useState<boolean>(true);

  // Feed & Auto-loader states
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasLoadedOlder, setHasLoadedOlder] = useState<boolean>(false);
  const [isAutoLoading, setIsAutoLoading] = useState<boolean>(false);
  const [autoLoadCount, setAutoLoadCount] = useState<number>(0);

  // Download simulation states
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadStatusText, setDownloadStatusText] = useState<string>('');
  const [savedCount, setSavedCount] = useState<number>(0);
  const [downloadLogs, setDownloadLogs] = useState<string[]>([]);

  // Extension Options settings state
  const [subfolderName, setSubfolderName] = useState<string>(BRAND.defaultFolder);
  const [promptSaveAs, setPromptSaveAs] = useState<boolean>(false);
  const [namingPattern, setNamingPattern] = useState<string>(BRAND.defaultNamingPattern);
  const [savedOptionsToast, setSavedOptionsToast] = useState<boolean>(false);

  const feedContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreBtnRef = useRef<HTMLButtonElement>(null);

  // Calculate total media detected
  const totalMediaItems = posts.reduce((acc, p) => acc + p.media.length, 0);
  const totalPhotos = posts.reduce((acc, p) => acc + p.media.filter(m => m.type === 'photo').length, 0);
  const totalVideos = posts.reduce((acc, p) => acc + p.media.filter(m => m.type === 'video').length, 0);

  // Handle Load More click
  const handleLoadMore = () => {
    if (isLoadingMore || hasLoadedOlder) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setPosts(prev => [...prev, ...OLDER_POSTS_BATCH]);
      setIsLoadingMore(false);
      setHasLoadedOlder(true);
      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop += 350;
      }
    }, 750);
  };

  // Auto-load feed interval simulator (finds and clicks MuiButton "Load more")
  useEffect(() => {
    let interval: any;
    if (isAutoLoading) {
      interval = setInterval(() => {
        // Scroll down
        if (feedContainerRef.current) {
          feedContainerRef.current.scrollTop += 500;
        }

        // Trigger load more if available
        if (!hasLoadedOlder && !isLoadingMore) {
          handleLoadMore();
          setAutoLoadCount(c => c + 1);
        } else {
          // Finished auto-loading
          setIsAutoLoading(false);
        }
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isAutoLoading, hasLoadedOlder, isLoadingMore]);

  // Simulate Batch Download
  const handleStartDownload = () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadLogs([]);
    setDownloadStatusText('Initializing Chrome Downloads API & checking EXIF headers...');

    let current = 0;
    const total = totalMediaItems;

    const interval = setInterval(() => {
      current++;
      const percent = Math.round((current / total) * 100);
      setDownloadProgress(percent);

      const postIndex = Math.min(Math.floor((current - 1) / 3), posts.length - 1);
      const post = posts[postIndex];
      const mediaItem = post.media[(current - 1) % post.media.length];
      const isVideo = mediaItem.type === 'video';
      const baseName = (namingPattern || BRAND.defaultNamingPattern)
        .replace('{date}', mediaItem.date.slice(0, 10))
        .replace('{index}', String(current).padStart(3, '0'))
        .replace('{type}', isVideo ? 'video' : 'photo');
      const filename = `${subfolderName}/${baseName}.${isVideo ? 'mp4' : 'jpg'}`;

      setDownloadStatusText(`Saving item ${current}/${total}: ${filename}`);
      setDownloadLogs(prev => [
        isVideo
          ? `[Direct Video Stream] Saved "${filename}" via native chrome.downloads`
          : `[EXIF APP1 Injected] Saved "${filename}" with DateTimeOriginal "${mediaItem.date}"`,
        ...prev.slice(0, 5)
      ]);

      if (current >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDownloading(false);
          setSavedCount(prev => prev + total);
          setDownloadStatusText(`All ${total} files saved successfully into Downloads/${subfolderName}/!`);
        }, 800);
      }
    }, 400);
  };

  const handleSaveOptions = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedOptionsToast(true);
    setTimeout(() => setSavedOptionsToast(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
            <Chrome className="w-3.5 h-3.5 text-sky-600" />
            <span>Interactive Browser Extension Simulator • v{BRAND.version}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {BRAND.name} — Live Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Test the complete extension workflow: open the <strong>Action Popup</strong>, inspect the <strong>in-page floating widget</strong> on live nursery feeds, trigger the <strong>auto-scroll &apos;Load More&apos; detector</strong>, and customize <strong>Folder &amp; Options</strong>.
          </p>
        </div>

        {/* Quick Simulator Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPopupOpen(!isPopupOpen)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPopupOpen
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5 text-amber-500" />
            <span>{isPopupOpen ? 'Close Popup' : 'Click Extension Icon (Popup)'}</span>
          </button>

          <button
            onClick={() => {
              setActiveChromeTab('feed');
              setIsAutoLoading(!isAutoLoading);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAutoLoading
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isAutoLoading ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoLoading ? 'Pause Auto-Scroll' : 'Test Auto-Load Feed'}</span>
          </button>

          <button
            onClick={() => {
              setActiveChromeTab('feed');
              handleStartDownload();
            }}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simulate Download (1080p)</span>
          </button>
        </div>
      </div>

      {/* Simulated Google Chrome Window */}
      <div className="rounded-2xl border border-slate-300 shadow-2xl bg-slate-900 overflow-hidden flex flex-col">
        {/* Chrome Window Titlebar & Tabs */}
        <div className="bg-slate-800/90 border-b border-slate-700/80 px-4 pt-3 flex items-center justify-between select-none">
          {/* macOS Window Controls */}
          <div className="flex items-center gap-2 mr-4">
            <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition-opacity" />
          </div>

          {/* Chrome Tab Strip */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
            {/* Tab 1: Nursery Feed */}
            <button
              onClick={() => setActiveChromeTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-medium transition-all max-w-[240px] truncate cursor-pointer ${
                activeChromeTab === 'feed'
                  ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <span className="text-sm">🧸</span>
              <span className="truncate">
                {browserPortal === 'brighthorizons'
                  ? 'FamilyApp • Bright Horizons Feed'
                  : 'Famly • Nursery Activities Feed'}
              </span>
              <span className="text-[10px] ml-auto text-slate-400">×</span>
            </button>

            {/* Tab 2: Extension Options */}
            <button
              onClick={() => setActiveChromeTab('options')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-medium transition-all max-w-[220px] truncate cursor-pointer ${
                activeChromeTab === 'options'
                  ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-sky-500" />
              <span className="truncate">{BRAND.shortName} Settings</span>
              <span className="text-[10px] ml-auto text-slate-400">×</span>
            </button>

            {/* Tab 3: Extensions Manager */}
            <button
              onClick={() => setActiveChromeTab('extensions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-medium transition-all max-w-[200px] truncate cursor-pointer ${
                activeChromeTab === 'extensions'
                  ? 'bg-slate-100 text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">chrome://extensions</span>
              <span className="text-[10px] ml-auto text-slate-400">×</span>
            </button>
          </div>

          <div className="text-slate-400 text-xs px-2 flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">Chrome • MV3</span>
          </div>
        </div>

        {/* Chrome Address Bar & Extension Toolbar */}
        <div className="bg-slate-100 border-b border-slate-300 px-3 py-2 flex items-center gap-2.5">
          {/* Back, Forward, Refresh */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              disabled
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              disabled
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-40"
              title="Forward"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setPosts(INITIAL_POSTS);
                setHasLoadedOlder(false);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Reload Nursery Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Omnibox / URL Bar */}
          <div className="flex-1 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-300 text-xs text-slate-700 shadow-inner">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="font-mono text-slate-500 text-[11px] select-none">
              {activeChromeTab === 'feed'
                ? browserPortal === 'brighthorizons'
                  ? 'https://familyapp.brighthorizons.co.uk/news-feed'
                  : 'https://app.famly.co/#/feed'
                : activeChromeTab === 'options'
                ? `chrome-extension://${BRAND.chromeExtensionSimulatedId}/options.html`
                : 'chrome://extensions'}
            </span>

            {activeChromeTab === 'feed' && (
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => setBrowserPortal('brighthorizons')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                    browserPortal === 'brighthorizons'
                      ? 'bg-sky-100 text-sky-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Bright Horizons
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setBrowserPortal('famly')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                    browserPortal === 'famly'
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Famly Portal
                </button>
              </div>
            )}
          </div>

          {/* Chrome Extensions Toolbar */}
          <div className="relative flex items-center gap-1.5">
            {/* Extensions Puzzle Icon */}
            <button
              onClick={() => setActiveChromeTab('extensions')}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
              title="Chrome Extensions Manager"
            >
              <Puzzle className="w-4 h-4" />
            </button>

            {/* Pinned Extension Icon: Nursery Media Downloader */}
            <div className="relative">
              <button
                onClick={() => setIsPopupOpen(!isPopupOpen)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isPopupOpen
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200 text-slate-900 border border-slate-300 shadow-xs'
                }`}
                title={`${BRAND.name} (Click to open extension popup)`}
              >
                <BrandLogo size="xs" />
                <span className="hidden sm:inline font-mono text-[11px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  {totalMediaItems}
                </span>
              </button>

              {/* The Realistic Chrome Extension Action Popup (`popup.html`) */}
              {isPopupOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-300 z-50 p-4 text-slate-900 animate-in fade-in zoom-in-95 font-sans">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <BrandLogo size="sm" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-none">
                          {BRAND.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Bright Horizons FamilyApp &amp; Famly
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPopupOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Stats */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Active Tab Status:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        Feed Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Queued High-Res Media:</span>
                      <span className="font-bold text-sky-700 font-mono">
                        {totalMediaItems} ({totalPhotos} photos, {totalVideos} videos)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Saved Previously:</span>
                      <span className="font-bold text-slate-700 font-mono">
                        {savedCount} items
                      </span>
                    </div>
                  </div>

                  {/* Actions in Popup */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleStartDownload();
                        setIsPopupOpen(false);
                      }}
                      disabled={isDownloading || totalMediaItems === 0}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isDownloading ? 'Downloading...' : `Download ${totalMediaItems} Items (1080p)`}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAutoLoading(!isAutoLoading);
                      }}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                        isAutoLoading
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      }`}
                    >
                      {isAutoLoading ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isAutoLoading ? 'Stop Auto-Scroll' : 'Toggle Auto-Scroll'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveChromeTab('options');
                        setIsPopupOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Extension Settings</span>
                    </button>
                  </div>

                  {/* Popup Footer */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>v{BRAND.version} • Manifest V3</span>
                    <button
                      onClick={() => {
                        setActiveChromeTab('options');
                        setIsPopupOpen(false);
                      }}
                      className="text-sky-600 hover:underline font-semibold cursor-pointer"
                    >
                      Folder &amp; Options
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chrome User Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-teal-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
              RF
            </div>
          </div>
        </div>

        {/* Viewport Content Area */}
        <div className="bg-slate-100 min-h-[580px] max-h-[700px] overflow-hidden flex flex-col relative">
          {/* TAB 1: NURSERY FEED VIEW */}
          {activeChromeTab === 'feed' && (
            <div
              ref={feedContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative scroll-smooth"
            >
              {/* Site Banner inside Feed */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    🌱
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {browserPortal === 'brighthorizons'
                        ? 'Bright Horizons • FamilyApp'
                        : 'Famly Nursery Network'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Daily Activity Feed & Photo Timeline • Pre-School Room (Oak)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Feed Active • {posts.length} Posts
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                    {totalMediaItems} High-Res Items
                  </span>
                </div>
              </div>

              {/* Feed Posts */}
              <div className="space-y-6 max-w-3xl mx-auto">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Post Header */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                            {post.author}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span>{post.room}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {post.timestampStr}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {post.date}
                      </span>
                    </div>

                    {/* Post Caption */}
                    <div className="px-4 sm:px-5 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {post.caption}
                    </div>

                    {/* Post Media Grid */}
                    <div className={`p-4 sm:p-5 pt-0 grid gap-3 ${
                      post.media.length === 1
                        ? 'grid-cols-1'
                        : post.media.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-3'
                    }`}>
                      {post.media.map((item) => (
                        <div
                          key={item.id}
                          className="group relative rounded-xl overflow-hidden bg-slate-900 aspect-4/3 border border-slate-200 shadow-xs"
                        >
                          <img
                            src={item.previewUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Media Type Overlay */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white">
                            {item.type === 'video' ? (
                              <Film className="w-3 h-3 text-amber-400" />
                            ) : (
                              <ImageIcon className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>{item.resolution}</span>
                          </div>

                          {/* EXIF Date Badge */}
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90 bg-slate-950/70 backdrop-blur-xs px-2 py-1 rounded">
                            <span className="truncate">{item.title}</span>
                            <span className="font-mono text-emerald-300 ml-1 shrink-0">{item.date.slice(0, 10)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}

                {/* THE "LOAD MORE" BUTTON MATCHING THE USER'S EXACT MUIBUTTON HTML STRUCTURE */}
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  {!hasLoadedOlder ? (
                    <button
                      ref={loadMoreBtnRef}
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      type="button"
                      tabIndex={0}
                      className="MuiButtonBase-root MuiButton-root MuiButton-primary MuiButton-primaryPrimary MuiButton-sizeCompact MuiButton-primarySizeCompact MuiButton-colorPrimary MuiButton-root MuiButton-primary MuiButton-primaryPrimary MuiButton-sizeCompact MuiButton-primarySizeCompact MuiButton-colorPrimary css-173kuy1 px-6 py-2.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-700 active:scale-98 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isLoadingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Loading older posts...</span>
                        </>
                      ) : (
                        <>
                          <span>Load more</span>
                          <div className="css-vo7irb"></div>
                          <span className="MuiTouchRipple-root css-w0pj6f"></span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200/80 text-slate-600 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>All timeline posts and photos loaded!</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 text-center">
                    The extension auto-scroll engine automatically locates and clicks this button to scrape full historical photo archives.
                  </p>
                </div>
              </div>

              {/* THE IN-PAGE FLOATING WIDGET (content.js injection) */}
              {isWidgetVisible && (
                <div
                  id="famly-downloader-panel"
                  className={`fixed sm:absolute bottom-4 right-4 z-40 transition-all duration-200 font-sans ${
                    isWidgetMinimized ? 'w-auto' : 'w-80 sm:w-88'
                  }`}
                >
                  {isWidgetMinimized ? (
                    /* Minimized Floating Pill */
                    <button
                      onClick={() => setIsWidgetMinimized(false)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer animate-in fade-in"
                    >
                      <BrandLogo size="xs" />
                      <span className="font-bold text-xs">{BRAND.shortName}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                        {totalMediaItems}
                      </span>
                    </button>
                  ) : (
                    /* Expanded Floating Widget Panel */
                    <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 text-white p-4 animate-in fade-in zoom-in-95">
                      {/* Widget Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <BrandLogo size="sm" />
                          <div>
                            <h4 className="font-bold text-xs text-white leading-none">
                              {BRAND.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              v{BRAND.version} • In-Page Scraper Active
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            onClick={() => setIsWidgetMinimized(true)}
                            className="p-1 hover:text-white rounded hover:bg-slate-800"
                            title="Minimize Widget"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setIsWidgetVisible(false)}
                            className="p-1 hover:text-white rounded hover:bg-slate-800"
                            title="Hide Panel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stat Counters */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold">Media</span>
                          <span className="text-sm font-extrabold text-emerald-400 font-mono">
                            {totalMediaItems}
                          </span>
                        </div>
                        <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold">Photos</span>
                          <span className="text-sm font-extrabold text-sky-400 font-mono">
                            {totalPhotos}
                          </span>
                        </div>
                        <div className="bg-slate-800/80 rounded-xl p-2 border border-slate-700">
                          <span className="block text-[10px] text-slate-400 uppercase font-bold">Videos</span>
                          <span className="text-sm font-extrabold text-amber-400 font-mono">
                            {totalVideos}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar & Live EXIF/Video Stream Log if Downloading */}
                      {(isDownloading || downloadLogs.length > 0) && (
                        <div className="mb-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>{isDownloading ? 'Archiving 1080p originals...' : 'Last batch complete'}</span>
                            <span className="font-mono font-bold text-emerald-400">{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono text-emerald-300 truncate">
                            {downloadLogs[0] || downloadStatusText}
                          </p>
                        </div>
                      )}

                      {/* Widget Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={handleStartDownload}
                          disabled={isDownloading || totalMediaItems === 0}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          <span>
                            {isDownloading
                              ? 'Saving Media...'
                              : `Download ${totalMediaItems} Media (1080p Originals)`}
                          </span>
                        </button>

                        <button
                          onClick={() => setIsAutoLoading(!isAutoLoading)}
                          className={`w-full py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                            isAutoLoading
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          }`}
                        >
                          {isAutoLoading ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                          <span>
                            {isAutoLoading
                              ? `Auto-Loading Feed (${autoLoadCount})...`
                              : 'Auto-Load Feed (Scroll & Load More)'}
                          </span>
                        </button>
                      </div>

                      {/* Folder hint */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate">Destination: <strong>Downloads/{subfolderName}/</strong></span>
                        <button
                          onClick={() => setActiveChromeTab('options')}
                          className="text-sky-400 hover:underline font-semibold shrink-0 ml-1 cursor-pointer"
                        >
                          Folder &amp; Options
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OPTIONS.HTML PREVIEW */}
          {activeChromeTab === 'options' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-50">
              <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 my-auto">
                <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-3.5">
                  <BrandLogo size="md" />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold mb-1">
                      <Settings className="w-3 h-3 text-sky-600" />
                      <span>options.html • v{BRAND.version}</span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900">
                      {BRAND.name} Settings
                    </h2>
                  </div>
                </div>

                <form onSubmit={handleSaveOptions} className="space-y-5">
                  {/* Subfolder input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      Subfolder Name in Downloads
                    </label>
                    <input
                      type="text"
                      value={subfolderName}
                      onChange={(e) => setSubfolderName(e.target.value)}
                      placeholder="Nursery_Photos"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                      <strong>How downloads work:</strong> Browser extensions save files directly inside your computer&apos;s <strong>Downloads</strong> folder. Files will be saved into the subfolder specified above (default: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">{BRAND.defaultFolder}</code>).
                    </div>
                  </div>

                  {/* Prompt Save As Checkbox */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={promptSaveAs}
                        onChange={(e) => setPromptSaveAs(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Always prompt with File Explorer / Finder save dialog for download batch
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          When enabled, Chrome, Edge, or Firefox will open your native File Explorer (Windows) or Finder (Mac) save dialog so you can choose any custom location or external drive.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Naming Pattern */}
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1.5">
                      File Naming Pattern
                    </label>
                    <input
                      type="text"
                      value={namingPattern}
                      onChange={(e) => setNamingPattern(e.target.value)}
                      placeholder="{date}_media_{index}"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 mt-1.5">
                      <span>Tokens: <code className="font-mono">&#123;date&#125;</code>, <code className="font-mono">&#123;index&#125;</code>, <code className="font-mono">&#123;type&#125;</code></span>
                      <span className="text-emerald-700 font-semibold font-mono">
                        Preview: {(namingPattern || BRAND.defaultNamingPattern).replace('{date}', '2024-05-15').replace('{index}', '001').replace('{type}', 'photo')}.jpg
                      </span>
                    </div>
                  </div>

                  {/* Automatic Resolution Tip Box */}
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>1920×1080 Master Recovery &amp; Local EXIF Privacy</strong>
                      <p className="text-[11px] text-emerald-900 mt-0.5">
                        The extension automatically inspects responsive image sets (<code className="font-mono">srcset</code>) to download uncompressed 1080p master photos, embeds original capture dates into EXIF metadata locally in memory, and collects zero telemetry.
                      </p>
                    </div>
                  </div>

                  {/* Form Submission */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Save Preferences
                    </button>

                    {savedOptionsToast && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saved successfully!</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveChromeTab('feed')}
                      className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Back to Nursery Feed →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: CHROME://EXTENSIONS MANAGER PREVIEW */}
          {activeChromeTab === 'extensions' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-sky-600" />
                    <h2 className="text-lg font-bold text-slate-900">Chrome Extensions</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span>Developer mode</span>
                    <span className="w-9 h-5 rounded-full bg-sky-600 flex items-center justify-end px-1 cursor-pointer">
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
                    </span>
                  </div>
                </div>

                {/* Extension Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <BrandLogo size="lg" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">
                            {BRAND.name}
                          </h3>
                          <span className="text-xs font-mono text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                            v{BRAND.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 max-w-xl">
                          {BRAND.tagline}.
                        </p>
                      </div>
                    </div>

                    {/* Extension Enable Toggle */}
                    <span className="w-10 h-5 rounded-full bg-sky-600 flex items-center justify-end px-1 cursor-pointer">
                      <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                    </span>
                  </div>

                  {/* Extension Technical Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-700">
                    <div>
                      <span className="font-bold text-slate-900">ID: </span>
                      <code className="text-slate-600 font-mono text-[11px]">{BRAND.chromeExtensionSimulatedId}</code>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Inspect views: </span>
                      <span className="text-sky-600 font-semibold cursor-pointer underline">service worker (background.js)</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Permissions: </span>
                      <code className="text-slate-600 font-mono text-[11px]">downloads, storage, activeTab</code>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Host matches: </span>
                      <code className="text-slate-600 font-mono text-[11px]">*.brighthorizons.co.uk, *.famly.co, *.cloudfront.net</code>
                    </div>
                  </div>

                  {/* Extension Card Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveChromeTab('options')}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Extension options
                    </button>
                    <button
                      onClick={() => setActiveChromeTab('feed')}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold hover:bg-sky-100 cursor-pointer"
                    >
                      Open Nursery Feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Breakdown & Guide below simulator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
            <Puzzle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Browser Action Popup
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Click the pinned <strong>{BRAND.name}</strong> badge in the Chrome toolbar above to preview the quick action popup menu, real-time item counter, and auto-scroll control.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            In-Page Floating Widget
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In Bright Horizons or Famly, the floating control panel renders in the bottom-right corner with 1080p resolution recovery, feed auto-scroller, and batch progress tracking.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <FolderOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            EXIF &amp; Folder Setup
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Original dates are permanently embedded into the EXIF header of every photo before being saved into your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">Downloads/{subfolderName}/</code> folder.
          </p>
        </div>
      </div>
    </div>
  );
};
