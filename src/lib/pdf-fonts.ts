// Helper for font handling in SVG-to-PDF rendering.
// Works on both local dev and Vercel serverless.
//
// Strategy:
// 1. Copy DejaVu Sans fonts to /tmp/labocheck-fonts/ on first use
// 2. Write SVG to a temp file (librsvg resolves file:// URIs from files, not buffers)
// 3. Use sharp to render the SVG file to PNG
//
// This is necessary because:
// - sharp's SVG rendering (librsvg) ignores data: URI fonts when rendering from buffer
// - System fonts (Helvetica, Arial) may not exist on Vercel
// - file:// URIs only work when sharp reads SVG from a file path, not from a Buffer
import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

const TMP_FONT_DIR = '/tmp/labocheck-fonts';

let fontsCopied = false;

function ensureFontsCopied(): boolean {
  if (fontsCopied) return true;

  try {
    if (!existsSync(TMP_FONT_DIR)) {
      mkdirSync(TMP_FONT_DIR, { recursive: true });
    }

    const srcRegular = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans.ttf');
    const srcBold = path.join(process.cwd(), 'public', 'fonts', 'DejaVuSans-Bold.ttf');
    const dstRegular = path.join(TMP_FONT_DIR, 'DejaVuSans.ttf');
    const dstBold = path.join(TMP_FONT_DIR, 'DejaVuSans-Bold.ttf');

    if (existsSync(srcRegular) && !existsSync(dstRegular)) {
      copyFileSync(srcRegular, dstRegular);
    }
    if (existsSync(srcBold) && !existsSync(dstBold)) {
      copyFileSync(srcBold, dstBold);
    }

    fontsCopied = existsSync(dstRegular);
    return fontsCopied;
  } catch {
    return false;
  }
}

/**
 * Returns SVG <defs><style> block with @font-face declarations.
 * Fonts are referenced via file:// URIs to /tmp/labocheck-fonts/.
 */
export function getFontFaceSVG(): string {
  ensureFontsCopied();

  const regularUri = `file://${TMP_FONT_DIR}/DejaVuSans.ttf`;
  const boldUri = `file://${TMP_FONT_DIR}/DejaVuSans-Bold.ttf`;

  let css = '@font-face {\n';
  css += "  font-family: 'DJS';\n";
  css += "  font-style: normal;\n";
  css += "  font-weight: normal;\n";
  css += `  src: url('${regularUri}');\n`;
  css += '}\n';

  css += '@font-face {\n';
  css += "  font-family: 'DJS';\n";
  css += "  font-style: normal;\n";
  css += "  font-weight: bold;\n";
  css += `  src: url('${boldUri}');\n`;
  css += '}\n';

  return `<defs><style>${css}</style></defs>`;
}

/**
 * Font family string for use in SVG text elements.
 */
export const FONT_FAMILY = 'DJS,sans-serif';

/**
 * Renders an SVG string to PNG buffer.
 * Writes the SVG to a temp file first so librsvg can resolve file:// font URIs.
 */
export async function renderSVGtoPNG(svgContent: string, width: number, height: number): Promise<Buffer> {
  const tmpFile = `/tmp/svg-${crypto.randomBytes(8).toString('hex')}.svg`;

  try {
    writeFileSync(tmpFile, svgContent, 'utf8');
    const pngBuffer = await sharp(tmpFile)
      .resize(width, height, { fit: 'fill' })
      .png({ compressionLevel: 6 })
      .toBuffer();
    return pngBuffer;
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch {
      // ignore cleanup errors
    }
  }
}
