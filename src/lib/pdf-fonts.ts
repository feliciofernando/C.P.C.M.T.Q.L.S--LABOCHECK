// Cache DejaVu Sans fonts as base64 for SVG rendering
import { readFileSync } from 'fs';
import path from 'path';

let _regularBase64: string | null = null;
let _boldBase64: string | null = null;

function getFontBase64(filename: string): string {
  const fontPath = path.join(process.cwd(), 'public', 'fonts', filename);
  try {
    const buf = readFileSync(fontPath);
    return buf.toString('base64');
  } catch {
    // Fallback to system fonts
    try {
      const sysPath = `/usr/share/fonts/truetype/dejavu/${filename}`;
      const buf = readFileSync(sysPath);
      return buf.toString('base64');
    } catch {
      return '';
    }
  }
}

export function getDejaVuSansRegularBase64(): string {
  if (_regularBase64 !== null) return _regularBase64;
  _regularBase64 = getFontBase64('DejaVuSans.ttf');
  return _regularBase64;
}

export function getDejaVuSansBoldBase64(): string {
  if (_boldBase64 !== null) return _boldBase64;
  _boldBase64 = getFontBase64('DejaVuSans-Bold.ttf');
  return _boldBase64;
}

/**
 * Returns SVG <defs><style> block with @font-face declarations for DejaVu Sans.
 * Include this at the start of your SVG to ensure Portuguese characters render correctly.
 */
export function getFontFaceSVG(): string {
  const regular = getDejaVuSansRegularBase64();
  const bold = getDejaVuSansBoldBase64();

  if (!regular && !bold) {
    // Fallback: use system font name directly
    return '';
  }

  let css = '@font-face {\n';
  css += "  font-family: 'DejaVuSans';\n";
  css += "  font-style: normal;\n";
  css += "  font-weight: normal;\n";
  css += `  src: url('data:font/truetype;base64,${regular}');\n`;
  css += '}\n';

  if (bold) {
    css += '@font-face {\n';
    css += "  font-family: 'DejaVuSans';\n";
    css += "  font-style: normal;\n";
    css += "  font-weight: bold;\n";
    css += `  src: url('data:font/truetype;base64,${bold}');\n`;
    css += '}\n';
  }

  return `<defs><style>${css}</style></defs>`;
}

/**
 * Use "DejaVuSans,sans-serif" as font-family in SVG text elements.
 * Falls back to system DejaVu Sans if no embedded fonts available.
 */
export const FONT_FAMILY = 'DejaVuSans,DejaVu Sans,sans-serif';
export const FONT_FAMILY_BOLD = 'DejaVuSans,DejaVu Sans,sans-serif';
