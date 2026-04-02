import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';
import path from 'path';

// Cache logo
let cachedLogoBase64: string | null = null;
function getLogoBase64(): string {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const imgPath = path.join(process.cwd(), 'public', 'logotipo.jpg');
    const buf = readFileSync(imgPath);
    cachedLogoBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
    return cachedLogoBase64;
  } catch {
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID obrigatorio' }, { status: 400 });
    }

    const { data: rawCondutor, error } = await supabase
      .from('condutores')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !rawCondutor) {
      return NextResponse.json({ error: 'Condutor nao encontrado' }, { status: 404 });
    }

    const condutor = toCamelCase(rawCondutor) as Record<string, unknown>;
    const pdfBuffer = await generateLicensePDF(condutor);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Licenca_${String(condutor.nomeCompleto).replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function esc(str: string): string {
  return String(str || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildFrontSVG(c: Record<string, unknown>): string {
  const W = 595;
  const H = 421;
  const GREEN = '#1a5c2e';
  const GOLD = '#d4a017';
  const DARK = '#1a1a1a';
  const WHITE = '#ffffff';
  const LGRAY = '#f0f0eb';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="${WHITE}"/>`;

  // Green header
  svg += `<rect x="0" y="0" width="${W}" height="68" fill="${GREEN}"/>`;
  svg += `<line x1="0" y1="68" x2="${W}" y2="68" stroke="${GOLD}" stroke-width="2"/>`;

  // Header text
  svg += `<text x="${W / 2}" y="22" text-anchor="middle" fill="${GOLD}" font-size="15" font-weight="bold" font-family="Helvetica,Arial,sans-serif" letter-spacing="3">C.P.C.M.T.Q.L.S</text>`;
  svg += `<text x="${W / 2}" y="38" text-anchor="middle" fill="${GOLD}" font-size="5.5" font-family="Helvetica,Arial,sans-serif">CONSELHO PROVINCIAL DOS CONDUTORES DE MOTOCICLOS, TRICICLOS E QUADRICICLOS DA LUNDA SUL</text>`;
  svg += `<text x="${W / 2}" y="56" text-anchor="middle" fill="${GOLD}" font-size="14" font-weight="bold" font-family="Helvetica,Arial,sans-serif" letter-spacing="1">LICEN\u00CA PROFISSIONAL DE CONDUTOR</text>`;

  // Fields
  const LX = 30;
  const RX = 305;
  let ly = 92;
  let ry = 92;
  const gap = 18;

  const leftField = (label: string, value: string) => {
    let s = `<text x="${LX}" y="${ly}" fill="${GREEN}" font-size="8" font-weight="bold" font-family="Helvetica,Arial,sans-serif">${esc(label)}:</text>`;
    s += `<text x="${LX}" y="${ly + 13}" fill="${DARK}" font-size="11" font-weight="bold" font-family="Helvetica,Arial,sans-serif">${esc(value || '-')}</text>`;
    return s;
  };

  const rightField = (label: string, value: string) => {
    let s = `<text x="${RX}" y="${ry}" fill="${GREEN}" font-size="8" font-weight="bold" font-family="Helvetica,Arial,sans-serif">${esc(label)}:</text>`;
    s += `<text x="${RX}" y="${ry + 13}" fill="${DARK}" font-size="11" font-weight="bold" font-family="Helvetica,Arial,sans-serif">${esc(value || '-')}</text>`;
    return s;
  };

  svg += leftField('Nome Completo', String(c.nomeCompleto)); ly += gap * 2;
  svg += leftField('Sexo', String(c.sexo)); ly += gap * 2;
  svg += leftField('No Membro', String(c.numeroMembro)); ly += gap * 2;
  svg += leftField('Categoria', String(c.tipoVeiculo)); ly += gap * 2;

  svg += rightField('Titulo', 'Condutor Profissional'); ry += gap * 2;
  svg += rightField('Nacionalidade', String(c.nacionalidade || 'Angolana')); ry += gap * 2;
  svg += rightField('Provincia', String(c.provincia || 'Lunda Sul')); ry += gap * 2;

  // Barcode area
  const bcY = Math.max(ly, ry) + 5;
  const bcH = 36;
  svg += `<rect x="30" y="${bcY}" width="${W - 60}" height="${bcH}" fill="#111"/>`;
  svg += `<text x="${W / 2}" y="${bcY + bcH / 2 + 4}" text-anchor="middle" fill="${WHITE}" font-size="9" font-family="Courier New,monospace" letter-spacing="1">CPCMTQLS-${String(c.numeroOrdem).padStart(6, '0')}-${esc(String(c.numeroBI || ''))}</text>`;

  // Photo placeholder
  const phW = 90;
  const phH = 110;
  const phX = W - 30 - phW;
  const phY = 82;
  svg += `<rect x="${phX}" y="${phY}" width="${phW}" height="${phH}" fill="${LGRAY}" stroke="#aaa" stroke-width="1"/>`;

  // Signature area
  const sigY = bcY + bcH + 30;
  svg += `<line x1="${W / 2 - 65}" y1="${sigY}" x2="${W / 2 + 65}" y2="${sigY}" stroke="${DARK}" stroke-width="0.5"/>`;
  svg += `<text x="${W / 2}" y="${sigY + 14}" text-anchor="middle" fill="${DARK}" font-size="9" font-weight="bold" font-family="Helvetica,Arial,sans-serif">O DIRECTOR EXECUTIVO</text>`;

  // Footer line
  svg += `<line x1="30" y1="${H - 50}" x2="${W - 30}" y2="${H - 50}" stroke="${DARK}" stroke-width="0.5"/>`;

  svg += '</svg>';
  return svg;
}

function buildBackSVG(c: Record<string, unknown>): string {
  const W = 595;
  const H = 421;
  const GREEN = '#1a5c2e';
  const GOLD = '#d4a017';
  const DARK = '#1a1a1a';
  const WHITE = '#ffffff';
  const GRAY = '#6b6b6b';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="${WHITE}"/>`;

  // Top info bar
  svg += `<rect x="0" y="0" width="${W}" height="36" fill="${WHITE}"/>`;
  svg += `<text x="30" y="24" fill="${GREEN}" font-size="10" font-weight="bold" font-family="Helvetica,Arial,sans-serif">Data de Emiss\u00E3o: ${esc(String(c.dataEmissaoLicenca || '-'))}</text>`;
  svg += `<text x="${W - 30}" y="24" text-anchor="end" fill="${GREEN}" font-size="10" font-weight="bold" font-family="Helvetica,Arial,sans-serif">Validade: ${esc(String(c.validadeLicenca || '-'))}</text>`;

  // Green section with declaration
  const greenTop = 50;
  const greenH = 155;
  svg += `<rect x="0" y="${greenTop}" width="${W}" height="${greenH}" fill="${GREEN}"/>`;

  const lines = [
    'Este passe \u00E9 distribu\u00EDdo para o uso pessoal ao condutor profissional',
    'credenciado pelo Conselho Provincial da Lunda Sul. \u00C9 intransfer\u00EDvel e',
    'deve-se acompanhar por um outro documento de Identifica\u00E7\u00E3o sempre',
    'que solicitado. Em caso de extravio, contactar a C.P.C.M.T.Q.L.S.',
  ];
  let ly = greenTop + 25;
  for (const line of lines) {
    svg += `<text x="30" y="${ly}" fill="${WHITE}" font-size="9" font-family="Helvetica,Arial,sans-serif">${esc(line)}</text>`;
    ly += 14;
  }
  svg += `<text x="${W / 2}" y="${ly + 8}" text-anchor="middle" fill="${GOLD}" font-size="9" font-weight="bold" font-family="Helvetica,Arial,sans-serif">Contactos: 941-000-517 / 924-591-350</text>`;
  svg += `<text x="${W / 2}" y="${ly + 22}" text-anchor="middle" fill="${WHITE}" font-size="8" font-family="Helvetica,Arial,sans-serif">Decreto Presidencial N\u00BA 245/15</text>`;

  // Bottom section
  const bottomY = greenTop + greenH + 20;
  svg += `<line x1="30" y1="${bottomY}" x2="${W - 30}" y2="${bottomY}" stroke="${DARK}" stroke-width="0.5"/>`;

  // Flag placeholder (3 stripes)
  const flagX = 30;
  const flagY = H - 50;
  const flagW = 40;
  const flagH = 20;
  svg += `<rect x="${flagX}" y="${flagY}" width="${flagW}" height="${flagH / 3}" fill="#C0392B"/>`;
  svg += `<rect x="${flagX}" y="${flagY + flagH / 3}" width="${flagW}" height="${flagH / 3}" fill="#111"/>`;
  svg += `<rect x="${flagX}" y="${flagY + (flagH / 3) * 2}" width="${flagW}" height="${flagH / 3}" fill="#F0C808"/>`;

  // Motto
  svg += `<text x="${W / 2}" y="${H - 38}" text-anchor="middle" fill="${DARK}" font-size="9" font-family="Helvetica,Arial,sans-serif">\u201CMototaxistas organizados, tr\u00E2nsito mais seguro\u201D</text>`;
  svg += `<text x="${W - 30}" y="${H - 38}" text-anchor="end" fill="${DARK}" font-size="10" font-weight="bold" font-family="Helvetica,Arial,sans-serif">Lunda Sul</text>`;

  svg += '</svg>';
  return svg;
}

async function generateLicensePDF(c: Record<string, unknown>): Promise<Buffer> {
  const frontSVG = buildFrontSVG(c);
  const backSVG = buildBackSVG(c);

  const cardW = 595;
  const cardH = 421;
  const scale = 3;

  const frontPng = await sharp(Buffer.from(frontSVG))
    .resize(cardW * scale, cardH * scale, { fit: 'fill' })
    .png({ compressionLevel: 6 })
    .toBuffer();

  const backPng = await sharp(Buffer.from(backSVG))
    .resize(cardW * scale, cardH * scale, { fit: 'fill' })
    .png({ compressionLevel: 6 })
    .toBuffer();

  const pdfDoc = await PDFDocument.create();

  // Page 1 - Front
  const page1 = pdfDoc.addPage([595, 842]);
  const frontImg = await pdfDoc.embedPng(frontPng);
  page1.drawImage(frontImg, { x: 0, y: 842 - cardH, width: cardW, height: cardH });

  // Page 2 - Back
  const page2 = pdfDoc.addPage([595, 842]);
  const backImg = await pdfDoc.embedPng(backPng);
  page2.drawImage(backImg, { x: 0, y: 842 - cardH, width: cardW, height: cardH });

  pdfDoc.setTitle(`Licenca Profissional - ${c.nomeCompleto}`);
  pdfDoc.setAuthor('C.P.C.M.T.Q.L.S');
  pdfDoc.setSubject('Licenca Profissional de Condutor');

  return Buffer.from(await pdfDoc.save());
}
