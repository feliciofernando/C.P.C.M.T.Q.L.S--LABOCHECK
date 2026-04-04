// Helper for font handling in SVG-to-PDF rendering.
// Works on local dev, Vercel serverless, and any serverless platform.
//
// Strategy (zero-filesystem):
// 1. Fonts are pre-encoded as base64 strings in pdf-fonts-data.ts (build-time)
// 2. Fonts are decoded to Buffers at module load time (in-memory, no /tmp/)
// 3. SVG uses @font-face with data: URIs (embedded in the SVG string itself)
// 4. @resvg/resvg-js renders SVG→PNG using pure WASM (no libravicon, no sharp)
// 5. pdf-lib embeds the PNG into the PDF
//
// This approach has ZERO filesystem dependencies and works everywhere.
import { Resvg } from '@resvg/resvg-js';
import { DEJAVU_SANS_REGULAR_BASE64, DEJAVU_SANS_BOLD_BASE64 } from './pdf-fonts-data';

// Decode fonts to Buffers once at module load (in-memory, no files)
const fontRegularBuffer = Buffer.from(DEJAVU_SANS_REGULAR_BASE64, 'base64');
const fontBoldBuffer = Buffer.from(DEJAVU_SANS_BOLD_BASE64, 'base64');

/**
 * Returns SVG <defs><style> block with @font-face declarations.
 * Fonts are embedded as base64 data: URIs directly in the SVG.
 * No filesystem dependency.
 */
export function getFontFaceSVG(): string {
  const regularDataUri = `data:font/ttf;base64,${DEJAVU_SANS_REGULAR_BASE64}`;
  const boldDataUri = `data:font/ttf;base64,${DEJAVU_SANS_BOLD_BASE64}`;

  let css = '@font-face {\n';
  css += "  font-family: 'DJS';\n";
  css += "  font-style: normal;\n";
  css += "  font-weight: normal;\n";
  css += `  src: url('${regularDataUri}');\n`;
  css += '}\n';

  css += '@font-face {\n';
  css += "  font-family: 'DJS';\n";
  css += "  font-style: normal;\n";
  css += "  font-weight: bold;\n";
  css += `  src: url('${boldDataUri}');\n`;
  css += '}\n';

  return `<defs><style>${css}</style></defs>`;
}

/**
 * Font family string for use in SVG text elements.
 */
export const FONT_FAMILY = 'DJS,sans-serif';

/**
 * Renders an SVG string to PNG buffer using @resvg/resvg-js (pure WASM).
 * Zero filesystem dependencies - works on any serverless platform.
 */
export async function renderSVGtoPNG(svgContent: string, width: number, height: number): Promise<Buffer> {
  const opts: ResvgOptions = {
    fitTo: {
      mode: 'width',
      value: width,
    },
    font: {
      fontFiles: [
        // Provide font buffers directly to resvg (no /tmp/ needed)
        new Uint8Array(fontRegularBuffer),
        new Uint8Array(fontBoldBuffer),
      ],
      loadSystemFonts: false, // Don't rely on system fonts
    },
  };

  const resvg = new Resvg(svgContent, opts);
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

/**
 * Resvg options type (simplified).
 */
interface ResvgOptions {
  fitTo: {
    mode: 'width' | 'height' | 'original';
    value: number;
  };
  font: {
    fontFiles: Uint8Array[];
    loadSystemFonts: boolean;
  };
}
