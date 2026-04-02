import { Resvg } from '@resvg/resvg-js';
import path from 'path';

/**
 * Reliable SVG → PNG renderer using resvg-js (WASM-based).
 *
 * sharp's SVG rendering (via librsvg) often fails on Vercel serverless
 * because system fonts are unavailable, resulting in blank rectangles
 * instead of text.
 *
 * resvg-js is a pure WASM renderer with built-in font fallback that
 * works reliably on all platforms including Vercel.
 */

const FONT_FILES: string[] = [
  path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Regular.ttf'),
  path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Bold.ttf'),
];

export interface SvgToPngOptions {
  /** Target width in pixels (default: use SVG's natural width) */
  width?: number;
  /** Target height in pixels (default: use SVG's natural height) */
  height?: number;
}

/**
 * Renders an SVG string to a PNG buffer using resvg-js.
 * Uses embedded Liberation Sans font files for reliable text rendering.
 */
export function svgToPng(svgString: string, options?: SvgToPngOptions): Buffer {
  const resvgOpts: ConstructorParameters<typeof Resvg>[1] = {};

  // Font configuration
  try {
    resvgOpts.font = { fontFiles: FONT_FILES };
  } catch {
    // ignore if font files not found
  }

  // Fit-to dimensions
  if (options?.width && options?.height) {
    resvgOpts.fitTo = { mode: 'orig' };
    // We'll set the SVG viewBox dimensions directly
  }

  const resvg = new Resvg(svgString, resvgOpts);
  const rendered = resvg.render();
  return Buffer.from(rendered.asPng());
}

/**
 * Renders SVG to PNG at a specific target size.
 * The SVG's width/height attributes are temporarily overridden.
 */
export function svgToPngSized(svgString: string, targetWidth: number, targetHeight: number): Buffer {
  // Override width/height in the SVG root element
  const sizedSvg = svgString.replace(
    /(<svg[^>]*?)\s+width="[^"]*"/,
    '$1'
  ).replace(
    /(<svg[^>]*?)\s+height="[^"]*"/,
    '$1'
  ).replace(
    /(<svg[^>]*?)\s+viewBox="[^"]*"/,
    '$1'
  ).replace(
    /<svg/,
    `<svg width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}"`
  );

  return svgToPng(sizedSvg);
}
