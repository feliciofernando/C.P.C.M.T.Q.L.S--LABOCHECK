// Shared SVG-to-PNG renderer using @resvg/resvg-js (pure WASM).
// Replaces all sharp/dependency on system SVG rendering.
import { Resvg } from '@resvg/resvg-js';

/**
 * Render an SVG string to PNG buffer using resvg-js.
 * No filesystem dependencies - works on Vercel serverless.
 */
export async function renderSVGToPNG(svgString: string, outputWidth?: number): Promise<Buffer> {
  const opts: Record<string, unknown> = {
    font: {
      loadSystemFonts: false,
    },
  };

  if (outputWidth) {
    opts.fitTo = { mode: 'width', value: outputWidth };
  }

  const resvg = new Resvg(svgString, opts as ConstructorParameters<typeof Resvg>[1]);
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

/**
 * Render SVG to PNG at a specific width and height.
 * If height is provided, it scales proportionally from width.
 */
export async function renderSVGToPNGSized(svgString: string, width: number, _height?: number): Promise<Buffer> {
  return renderSVGToPNG(svgString, width);
}
