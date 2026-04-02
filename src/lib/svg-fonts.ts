import { readFileSync } from 'fs';
import path from 'path';

/**
 * Font embedding utility for SVG → sharp rendering.
 *
 * On Vercel serverless, system fonts (Helvetica, Arial) are NOT available,
 * causing sharp/librsvg to render SVG text as empty rectangles.
 *
 * This module embeds Liberation Sans (a free Helvetica clone) directly
 * into the SVG using @font-face with base64 data URLs.
 *
 * Usage:
 *   import { getSvgFontStyle, FONT_FAMILY } from '@/lib/svg-fonts';
 *   const svg = `<svg ...>
 *     <defs><style>${getSvgFontStyle()}</style></defs>
 *     <text font-family="${FONT_FAMILY}">Hello</text>
 *   </svg>`;
 */

let cachedStyle: string | null = null;
let cachedBold: string | null = null;
let cachedRegular: string | null = null;

export const FONT_FAMILY = 'LibSans';

function loadFont(name: string): string {
  try {
    const p = path.join(process.cwd(), 'public', 'fonts', name);
    const buf = readFileSync(p);
    return buf.toString('base64');
  } catch {
    return '';
  }
}

/**
 * Returns the CSS @font-face rules as a <style> block for embedding in SVG <defs>.
 * Caches the result after first call.
 */
export function getSvgFontStyle(): string {
  if (cachedStyle) return cachedStyle;

  const regular = loadFont('LiberationSans-Regular.ttf');
  const bold = loadFont('LiberationSans-Bold.ttf');

  if (!regular) {
    // Fallback: no embedded font, rely on system fonts
    cachedStyle = '';
    return '';
  }

  cachedStyle = `
    @font-face {
      font-family: '${FONT_FAMILY}';
      src: url('data:font/ttf;base64,${regular}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    ${bold ? `
    @font-face {
      font-family: '${FONT_FAMILY}';
      src: url('data:font/ttf;base64,${bold}') format('truetype');
      font-weight: bold;
      font-style: normal;
    }` : ''}
  `.trim();

  return cachedStyle;
}

/**
 * Returns the full font-family string to use in SVG text elements.
 */
export function getFontFamily(): string {
  return `${FONT_FAMILY}, sans-serif`;
}

/**
 * Returns the monospace font-family string for barcode-like text.
 */
export function getMonoFontFamily(): string {
  return `'Courier New', monospace`;
}
