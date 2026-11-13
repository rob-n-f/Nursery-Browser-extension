import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

/**
 * Official Vector Brand Mark for Nursery Media Downloader.
 * Matches the generated 16/32/48/128/512 PNG icons packaged inside the extension ZIP.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const uniqueId = React.useId();

  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${SIZE_CLASSES[size]} shrink-0 select-none ${className}`}
      aria-label="Nursery Media Downloader Logo"
    >
      <defs>
        <linearGradient id={`bg-${uniqueId}`} x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="48%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id={`lens-${uniqueId}`} x1="44" y1="48" x2="84" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Squircle Base */}
      <rect x="4" y="4" width="120" height="120" rx="28" fill={`url(#bg-${uniqueId})`} />
      <rect
        x="6"
        y="6"
        width="116"
        height="116"
        rx="26"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="2"
      />

      {/* Camera Top Viewfinder Prism & Shutter Button */}
      <path
        d="M44 37C44 33.6863 46.6863 31 50 31H66C69.3137 31 72 33.6863 72 37V42H44V37Z"
        fill="white"
      />
      <rect x="78" y="34" width="12" height="5" rx="2.5" fill="#fde047" />

      {/* Camera Main Body */}
      <rect x="24" y="40" width="80" height="56" rx="14" fill="white" />

      {/* Outer Lens Barrel */}
      <circle cx="60" cy="68" r="21" fill={`url(#lens-${uniqueId})`} />
      <circle cx="60" cy="68" r="16" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="2" />

      {/* Inner Lens Core & Specular Glint */}
      <circle cx="60" cy="68" r="9.5" fill="#38bdf8" fillOpacity="0.25" />
      <circle cx="54" cy="62" r="3.5" fill="white" fillOpacity="0.9" />
      <circle cx="65" cy="73" r="1.8" fill="#34d399" fillOpacity="0.85" />

      {/* Flash Indicator */}
      <circle cx="89" cy="51" r="3.5" fill="#10b981" />

      {/* Download / Archive Badge in Bottom-Right */}
      <circle cx="94" cy="86" r="16" fill="#0f172a" />
      <circle cx="94" cy="86" r="13.5" fill="#10b981" />
      <path
        d="M94 79V90M94 90L89 85M94 90L99 85M88 93.5H100"
        stroke="#052e16"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
