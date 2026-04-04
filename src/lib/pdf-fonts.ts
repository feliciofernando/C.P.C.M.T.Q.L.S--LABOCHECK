// Helper for font handling in SVG-to-PDF rendering.
// Works on both local dev and Vercel serverless.
//
// Strategy (Vercel-compatible):
// 1. Fonts are pre-encoded as base64 strings in pdf-fonts-data.ts (build-time)
// 2. At first use, decode base64 and write font files to /tmp/labocheck-fonts/
// 3. Reference fonts via file:// URIs in SVG @font-face declarations
// 4. Write SVG to a temp file (librsvg resolves file:// URIs from files)
// 5. Use sharp to render the SVG file to PNG
// 6. pdf-lib embeds the PNG into the PDF
//
// This works on Vercel because the font data is bundled into the JS code,
// eliminating the dependency on public/fonts/ (which is CDN-served, not
// available in the serverless filesystem).
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import sharp from 'sharp';
import crypto from 'crypto';
import { DEJAVU_SANS_REGULAR_BASE64, DEJAVU_SANS_BOLD_BASE64 } from './pdf-fonts-data';

const TMP_FONT_DIR = '/tmp/labocheck-fonts';

let fontsReady = false;

/**
 * Write bundled base64 font data to /tmp/ so librsvg can access them via file:// URIs.
 * This only runs once per cold start (subsequent calls are no-ops).
 */
function ensureFontsReady(): boolean {
  if (fontsReady) return true;

  try {
    if (!existsSync(TMP_FONT_DIR)) {
      mkdirSync(TMP_FONT_DIR, { recursive: true });
    }

    const regularPath = `${TMP_FONT_DIR}/DejaVuSans.ttf`;
    const boldPath = `${TMP_FONT_DIR}/DejaVuSans-Bold.ttf`;

    if (!existsSync(regularPath)) {
      writeFileSync(regularPath, Buffer.from(DEJAVU_SANS_REGULAR_BASE64, 'base64'));
    }
    if (!existsSync(boldPath)) {
      writeFileSync(boldPath, Buffer.from(DEJAVU_SANS_BOLD_BASE64, 'base64'));
    }

    fontsReady = existsSync(regularPath) && existsSync(boldPath);
    return fontsReady;
  } catch (err) {
    console.error('Failed to prepare fonts:', err);
    return false;
  }
}

/**
 * Returns SVG <defs><style> block with @font-face declarations.
 * Fonts are referenced via file:// URIs to /tmp/labocheck-fonts/.
 */
export function getFontFaceSVG(): string {
  ensureFontsReady();

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
  ensureFontsReady();
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
