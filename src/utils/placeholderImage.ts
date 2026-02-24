import type { SyntheticEvent } from 'react';

/**
 * Branded SVG placeholder for missing/broken product images.
 * Uses a data URI so there are zero network requests.
 */
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="#F3F4F6"/>
  <g transform="translate(200,220)" text-anchor="middle">
    <!-- Camera/image icon -->
    <g stroke="#9CA3AF" stroke-width="2" fill="none" transform="translate(-30,-30)">
      <rect x="4" y="8" width="52" height="40" rx="4"/>
      <circle cx="30" cy="28" r="10"/>
      <path d="M16 8l4-6h20l4 6"/>
    </g>
    <!-- Brand text -->
    <text y="45" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="#9CA3AF">
      SunStyle
    </text>
    <text y="65" font-family="system-ui,sans-serif" font-size="11" fill="#D1D5DB">
      Image not available
    </text>
  </g>
</svg>
`)}`;

/**
 * Reusable onError handler for <img> elements.
 * Swaps the broken image with the branded placeholder and removes
 * the handler to prevent an infinite error loop.
 */
export const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  img.onerror = null;           // prevent infinite loop
  img.src = PLACEHOLDER_IMAGE;
};
