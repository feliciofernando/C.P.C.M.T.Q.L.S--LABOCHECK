import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync } from 'fs';
import path from 'path';

/**
 * Reliable SVG → PNG renderer using resvg-wasm (pure WASM).
 *
 * Works on ALL platforms including Vercel serverless:
 * - No native bindings (unlike @resvg/resvg-js)
 * - No system font dependencies
 * - Fonts are loaded from public/ directory as raw buffers
 */

let wasmInitialized = false;
let initPromise: Promise<void> | null = null;
let cachedFontBuffers: Uint8Array[] | null = null;

/**
 * Get font file paths
 */
function getFontPaths(): string[] {
  return [
    path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Regular.ttf'),
    path.join(process.cwd(), 'public', 'fonts', 'LiberationSans-Bold.ttf'),
  ];
}

/**
 * Load font files as raw Uint8Array buffers (cached)
 */
function loadFontBuffers(): Uint8Array[] {
  if (cachedFontBuffers) return cachedFontBuffers;

  const buffers: Uint8Array[] = [];
  for (const fontPath of getFontPaths()) {
    try {
      const buf = readFileSync(fontPath);
      buffers.push(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
    } catch {
      // Font not available, skip
    }
  }

  cachedFontBuffers = buffers;
  return buffers;
}

/**
 * Initialize the WASM module. Safe to call multiple times.
 */
async function ensureInitialized(): Promise<void> {
  if (wasmInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const wasmPath = path.join(process.cwd(), 'public', 'resvg.wasm');
      const wasmData = readFileSync(wasmPath);
      await initWasm(wasmData);
      wasmInitialized = true;
    } catch (err) {
      initPromise = null;
      throw new Error(`Failed to initialize resvg WASM: ${err instanceof Error ? err.message : String(err)}`);
    }
  })();

  return initPromise;
}

export interface SvgToPngOptions {
  /** Target width in pixels (default: use SVG's natural width) */
  width?: number;
  /** Target height in pixels (default: use SVG's natural height) */
  height?: number;
}

/**
 * Renders an SVG string to a PNG buffer using resvg-wasm.
 * Uses embedded Liberation Sans font files for reliable text rendering.
 */
export async function svgToPng(svgString: string, options?: SvgToPngOptions): Promise<Buffer> {
  await ensureInitialized();

  const fontBuffers = loadFontBuffers();

  const resvgOpts: Parameters<typeof Resvg>[1] = {};

  if (fontBuffers.length > 0) {
    resvgOpts.font = {
      fontBuffers,
      sansSerifFamily: 'Liberation Sans',
    };
  }

  if (options?.width) {
    resvgOpts.fitTo = { mode: 'width', value: options.width };
  }

  const resvg = new Resvg(svgString, resvgOpts);
  const rendered = resvg.render();
  return Buffer.from(rendered.asPng());
}

/**
 * Renders SVG to PNG at a specific target size.
 * The SVG's width/height attributes are temporarily overridden.
 */
export async function svgToPngSized(svgString: string, targetWidth: number, targetHeight: number): Promise<Buffer> {
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
