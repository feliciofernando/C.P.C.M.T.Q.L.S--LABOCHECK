import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import sharp from 'sharp';
import { svgToPngSized } from '@/lib/svg-render';
import { readFileSync } from 'fs';
import path from 'path';

let cachedLundaSulBuf: Buffer | null = null;
let cachedAngolaFlagBuf: Buffer | null = null;

async function getLundaSulImage(): Promise<Buffer> {
  if (cachedLundaSulBuf) return cachedLundaSulBuf;
  const imgPath = path.join(process.cwd(), 'public', 'lunda-sul-provincia.png');
  const buf = readFileSync(imgPath);
  cachedLundaSulBuf = await sharp(buf).resize(180, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return cachedLundaSulBuf;
}

async function getAngolaFlagImage(): Promise<Buffer> {
  if (cachedAngolaFlagBuf) return cachedAngolaFlagBuf;
  const imgPath = path.join(process.cwd(), 'public', 'bandeira-angola.png');
  const buf = readFileSync(imgPath);
  cachedAngolaFlagBuf = await sharp(buf).resize(180, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return cachedAngolaFlagBuf;
}

async function getCondutorById(id: string) {
  const { data, error } = await supabase
    .from('condutores')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return toCamelCase(data) as Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID obrigatorio' }, { status: 400 });
    }

    const condutor = await getCondutorById(id);
    if (!condutor) {
      return NextResponse.json({ error: 'Condutor nao encontrado' }, { status: 404 });
    }

    const backPng = await generateBackPNG(condutor);
    return new NextResponse(backPng, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PNG';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID obrigatorio' }, { status: 400 });
    }

    const condutor = await getCondutorById(id);
    if (!condutor) {
      return NextResponse.json({ error: 'Condutor nao encontrado' }, { status: 404 });
    }

    const backPng = await generateBackPNG(condutor);
    return new NextResponse(backPng, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="Licenca_Tras_${String(condutor.nomeCompleto).replace(/\s+/g, '_')}.png"`
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PNG';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function generateBackPNG(c: {
  validadeLicenca: string; dataEmissaoLicenca: string; numeroOrdem: number;
  numeroBI: string; nomeCompleto: string;
}): Promise<Buffer> {
  const BW = 1200;
  const BH = 720;

  const barcodeData = `CPCMTQLS-${String(c.numeroOrdem).padStart(6, '0')}-${c.numeroBI}`;
  let barcodeBars = '';
  const barStartX = 100;
  const barEndX = BW - 100;
  let bx = barStartX;
  let seed = 0;
  for (let i = 0; i < barcodeData.length; i++) {
    seed = ((seed << 5) - seed + barcodeData.charCodeAt(i)) | 0;
  }
  const nextRand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };
  while (bx < barEndX) {
    const isBar = nextRand() > 0.45;
    if (isBar) {
      const w = nextRand() > 0.5 ? 2 + nextRand() * 3 : 1 + nextRand() * 1.5;
      if (bx + w > barEndX) break;
      barcodeBars += `<rect x="${bx}" y="68" width="${w}" height="40" fill="white" opacity="0.85"/>`;
      bx += w;
    } else {
      bx += 1 + nextRand() * 1.5;
    }
  }

  const backSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BW}" height="${BH}" viewBox="0 0 ${BW} ${BH}">
  <defs>
    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color:#145028;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f3d1d;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${BW}" height="${BH}" rx="24" fill="white" stroke="#1a1a1a" stroke-width="4"/>
  <rect x="30" y="12" width="3" height="38" rx="1.5" fill="#1a5c2e"/>
  <text x="45" y="30" fill="#1a1a1a" font-size="18" font-weight="bold">Data de Emiss\u00e3o:</text>
  <text x="45" y="48" fill="#1a5c2e" font-size="20" font-weight="bold">${escapeXml(c.dataEmissaoLicenca)}</text>
  <rect x="800" y="12" width="3" height="38" rx="1.5" fill="#1a5c2e"/>
  <text x="815" y="30" fill="#1a1a1a" font-size="18" font-weight="bold">Validade:</text>
  <text x="815" y="48" fill="#c0392b" font-size="20" font-weight="bold">${escapeXml(c.validadeLicenca)}</text>
  <rect x="80" y="62" width="1040" height="55" rx="6" fill="#1a1a1a"/>
  ${barcodeBars}
  <text x="600" y="95" text-anchor="middle" fill="white" font-size="15" font-family="'Courier New', monospace" letter-spacing="2">${escapeXml(barcodeData)}</text>
  <rect x="0" y="130" width="${BW}" height="${BH - 130}" fill="url(#greenGrad)"/>
  <rect x="0" y="${BH - 24}" width="${BW}" height="24" rx="24" fill="url(#greenGrad)"/>
  <rect x="0" y="${BH - 24}" width="${BW}" height="12" fill="url(#greenGrad)"/>
  <line x1="0" y1="132" x2="${BW}" y2="132" stroke="#d4a017" stroke-width="2"/>
  <rect x="30" y="148" width="30" height="2" rx="1" fill="#d4a017" opacity="0.6"/>
  <rect x="1140" y="148" width="30" height="2" rx="1" fill="#d4a017" opacity="0.6"/>
  <text x="600" y="185" text-anchor="middle" fill="white" font-size="18" letter-spacing="0.3">Este passe e distribuido para o uso pessoal ao condutor profissional</text>
  <text x="600" y="210" text-anchor="middle" fill="white" font-size="18" letter-spacing="0.3">credenciado pelo Conselho Provincial da Lunda Sul. E intransferivel e</text>
  <text x="600" y="235" text-anchor="middle" fill="white" font-size="18" letter-spacing="0.3">deve-se acompanhar por um outro documento de Identificacao sempre</text>
  <text x="600" y="260" text-anchor="middle" fill="white" font-size="18" letter-spacing="0.3">que solicitado. Em caso de extravio, contactar a C.P.C.M.T.Q.L.S.</text>
  <text x="600" y="300" text-anchor="middle" fill="#d4a017" font-size="20" font-weight="bold">Contactos: 941-000-517 / 924-591-350</text>
  <text x="600" y="328" text-anchor="middle" fill="white" font-size="16" opacity="0.9">Decreto Presidencial No 245/15</text>
  <text x="600" y="358" text-anchor="middle" fill="white" font-size="18" font-style="italic" opacity="0.9">"Mototaxistas organizados, transito mais seguro"</text>
  <line x1="30" y1="380" x2="1170" y2="380" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
  <text x="600" y="410" text-anchor="middle" fill="#d4a017" font-size="14" font-weight="bold" letter-spacing="1">C.P.C.M.T.Q.L.S</text>
  <text x="600" y="432" text-anchor="middle" fill="white" font-size="12" opacity="0.8">Conselho Provincial da Lunda Sul</text>
  <text x="600" y="454" text-anchor="middle" fill="white" font-size="11" font-style="italic" opacity="0.7">"Mototaxistas organizados, transito mais seguro"</text>
  <line x1="30" y1="470" x2="1170" y2="470" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <rect x="60" y="490" width="200" height="130" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <text x="160" y="562" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="13">LUNDA SUL</text>
  <rect x="940" y="490" width="200" height="130" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  <text x="1040" y="562" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="13">ANGOLA</text>
  <line x1="400" y1="${BH - 35}" x2="800" y2="${BH - 35}" stroke="#d4a017" stroke-width="1" opacity="0.4"/>
</svg>`;

  const backSvgPng = await svgToPngSized(backSvg, BW, BH);
  let basePng = sharp(backSvgPng);
  const lundaSulImage = await getLundaSulImage();
  basePng = basePng.composite([{ input: lundaSulImage, left: 70, top: 495 }]);
  const angolaFlagImage = await getAngolaFlagImage();
  basePng = basePng.composite([{ input: angolaFlagImage, left: 950, top: 495 }]);

  return await basePng.toBuffer();
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
