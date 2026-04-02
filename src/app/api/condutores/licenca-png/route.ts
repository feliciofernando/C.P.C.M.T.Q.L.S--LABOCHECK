import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';

let cachedLogoBase64: string | null = null;
function getLogoBase64(): string {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo-pvc.png');
    const buf = readFileSync(logoPath);
    cachedLogoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
    return cachedLogoBase64;
  } catch {
    return '';
  }
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

// GET handler for preview
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

    const frontPng = await generateFrontPNG(condutor);
    return new NextResponse(frontPng, {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PNG';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST handler for download
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

    const frontPng = await generateFrontPNG(condutor);
    return new NextResponse(frontPng, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="Licenca_Frente_${String(condutor.nomeCompleto).replace(/\s+/g, '_')}.png"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PNG';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function generateFrontPNG(c: {
  nomeCompleto: string; sexo: string; numeroMembro: string; tipoVeiculo: string;
  nacionalidade: string; provincia: string; dataEmissaoLicenca: string; validadeLicenca: string;
  numeroOrdem: number; numeroBI: string; fotoBase64: string; qrCodeBase64: string;
}): Promise<Buffer> {
  const W = 1200;
  const H = 750;

  let fotoBase64 = c.fotoBase64 || '';
  let qrBase64 = c.qrCodeBase64 || '';
  const logoBase64 = getLogoBase64();

  if (fotoBase64 && !fotoBase64.startsWith('data:')) fotoBase64 = `data:image/jpeg;base64,${fotoBase64}`;
  if (qrBase64 && !qrBase64.startsWith('data:')) qrBase64 = `data:image/jpeg;base64,${qrBase64}`;

  let photoSvg = '';
  if (fotoBase64) {
    photoSvg = `
    <clipPath id="photoClip"><rect x="990" y="260" width="180" height="200" rx="4"/></clipPath>
    <image href="${fotoBase64}" x="990" y="260" width="180" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>
    <rect x="990" y="260" width="180" height="200" fill="none" stroke="#1a1a1a" stroke-width="3" rx="4"/>`;
  } else {
    photoSvg = `<rect x="990" y="260" width="180" height="200" fill="#e8e8e3" stroke="#1a1a1a" stroke-width="3" rx="4"/><text x="1080" y="370" text-anchor="middle" fill="#999" font-size="20">FOTO</text>`;
  }

  let qrSvg = '';
  if (qrBase64) {
    qrSvg = `<rect x="990" y="475" width="180" height="180" fill="white" stroke="#d1d1cc" stroke-width="2" rx="4"/><image href="${qrBase64}" x="1000" y="485" width="160" height="160" preserveAspectRatio="xMidYMid meet"/>`;
  } else {
    qrSvg = `<rect x="990" y="475" width="180" height="180" fill="white" stroke="#d1d1cc" stroke-width="2" rx="4"/><text x="1080" y="575" text-anchor="middle" fill="#bbb" font-size="16">QR CODE</text>`;
  }

  const logoSvg = logoBase64
    ? `<image href="${logoBase64}" x="25" y="20" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>`
    : `<circle cx="75" cy="70" r="40" fill="none" stroke="#d4a017" stroke-width="2"/>`;

  const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>text { font-family: Georgia, 'Times New Roman', serif; }</style>
    <linearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color:#1f6b36;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#145028;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.15"/></filter>
  </defs>
  <rect x="0" y="0" width="${W}" height="${H}" rx="24" fill="white" stroke="#1a1a1a" stroke-width="4"/>
  <rect x="0" y="0" width="${W}" height="240" rx="24" fill="url(#headerGrad)"/>
  <rect x="0" y="200" width="${W}" height="40" fill="url(#headerGrad)"/>
  <line x1="0" y1="240" x2="${W}" y2="240" stroke="#d4a017" stroke-width="4"/>
  <line x1="0" y1="237" x2="${W}" y2="237" stroke="#d4a017" stroke-width="1" opacity="0.5"/>
  ${logoSvg}
  <text x="620" y="75" text-anchor="middle" fill="#d4a017" font-size="44" font-weight="bold" letter-spacing="3" filter="url(#shadow)">C.P.C.M.T.Q.L.S</text>
  <text x="620" y="110" text-anchor="middle" fill="#d4a017" font-size="14" letter-spacing="1" opacity="0.95">CONSELHO PROVINCIAL DOS CONDUTORES DE MOTOCICLOS, TRICICLOS E QUADRICICLOS DA LUNDA SUL</text>
  <line x1="200" y1="128" x2="1040" y2="128" stroke="#d4a017" stroke-width="1.5" opacity="0.7"/>
  <text x="620" y="165" text-anchor="middle" fill="#d4a017" font-size="44" font-weight="bold" letter-spacing="2" filter="url(#shadow)">LICENCA PROFISSIONAL DE CONDUTOR</text>
  <line x1="280" y1="180" x2="960" y2="180" stroke="#d4a017" stroke-width="2"/>
  <rect x="10" y="210" width="40" height="3" rx="1.5" fill="#d4a017" opacity="0.6"/>
  <rect x="1150" y="210" width="40" height="3" rx="1.5" fill="#d4a017" opacity="0.6"/>
  <text x="60" y="286" fill="#1a1a1a" font-size="26" font-weight="bold">Nome:</text>
  <text x="220" y="286" fill="#1a1a1a" font-size="26">${escapeXml(c.nomeCompleto)}</text>
  <text x="60" y="318" fill="#1a1a1a" font-size="24" font-weight="bold">Sexo:</text>
  <text x="190" y="318" fill="#1a1a1a" font-size="24">${escapeXml(c.sexo)}</text>
  <text x="60" y="350" fill="#1a1a1a" font-size="20" font-weight="bold">Membro N\u00ba C.P.C.M.T.Q.L.S</text>
  <text x="60" y="378" fill="#1a1a1a" font-size="16">${escapeXml(c.numeroMembro)}</text>
  <text x="60" y="416" fill="#1a1a1a" font-size="24" font-weight="bold">Categoria:</text>
  <text x="270" y="416" fill="#1a1a1a" font-size="24">${escapeXml(c.tipoVeiculo)}</text>
  <text x="60" y="448" fill="#1a1a1a" font-size="24" font-weight="bold">Titulo:</text>
  <text x="230" y="448" fill="#1a1a1a" font-size="24">Condutor Profissional</text>
  <text x="60" y="480" fill="#1a1a1a" font-size="24" font-weight="bold">Nacionalidade:</text>
  <text x="345" y="480" fill="#1a1a1a" font-size="24">${escapeXml(c.nacionalidade || 'Angolana')}</text>
  <text x="60" y="512" fill="#1a1a1a" font-size="24" font-weight="bold">Provincia:</text>
  <text x="295" y="512" fill="#1a1a1a" font-size="24">${escapeXml(c.provincia || 'Lunda Sul')}</text>
  ${photoSvg}
  ${qrSvg}
  <line x1="40" y1="670" x2="1160" y2="670" stroke="#d1d1cc" stroke-width="0.5" opacity="0.5"/>
  <text x="600" y="705" text-anchor="middle" fill="#1a1a1a" font-size="22" font-weight="bold" letter-spacing="1">O DIRECTOR EXECUTIVO</text>
  <line x1="480" y1="715" x2="720" y2="715" stroke="#1a1a1a" stroke-width="1.5"/>
</svg>`;

  return await sharp(Buffer.from(frontSvg)).png({ quality: 100 }).toBuffer();
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
