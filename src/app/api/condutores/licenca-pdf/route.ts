import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';

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
    const pdfBuffer = generateLicensePDF(condutor);

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

function generateLicensePDF(c: {
  nomeCompleto: string;
  sexo: string;
  numeroMembro: string;
  tipoVeiculo: string;
  nacionalidade: string;
  provincia: string;
  dataEmissaoLicenca: string;
  validadeLicenca: string;
  numeroOrdem: number;
  numeroBI: string;
  fotoBase64: string;
}): Buffer {
  const W = 595;
  const H = 842;
  const cardW = 400;
  const cardH = 240;
  const cardX = Math.floor((W - cardW) / 2);

  const toPdfY = (screenY: number) => H - screenY;

  const o: string[] = [];
  const e = (s: string) => s.replace(/[()\\]/g, '\\$&');

  const rect = (x: number, y: number, w: number, h: number, fill: string, stroke = false) => {
    o.push(`${fill} rg ${x} ${y} ${w} ${h} re${stroke ? ' S' : ' f'}`);
  };

  const horizontalLine = (x1: number, y: number, x2: number, w = 0.5, color = '0.1 0.1 0.1') => {
    o.push(`${color} RG ${w} w ${x1} ${y} m ${x2} ${y} l S`);
  };

  const drawText = (x: number, y: number, str: string, size: number, font: string, color: string) => {
    o.push('BT');
    o.push(`${color} rg`);
    o.push(`/${font} ${size} Tf`);
    o.push(`${x} ${y} Td`);
    o.push(`(${e(str)}) Tj`);
    o.push('ET');
  };

  const approxCharWidth = (size: number, bold: boolean) => size * (bold ? 0.6 : 0.52);
  const textWidth = (str: string, size: number, bold: boolean) => str.length * approxCharWidth(size, bold);

  const drawCenterText = (cx: number, y: number, str: string, size: number, font: string, color: string, bold: boolean) => {
    const w = textWidth(str, size, bold);
    drawText(cx - w / 2, y, str, size, font, color);
  };

  const drawRightText = (rightX: number, y: number, str: string, size: number, font: string, color: string, bold: boolean) => {
    const w = textWidth(str, size, bold);
    drawText(rightX - w, y, str, size, font, color);
  };

  const gold = '0.831 0.627 0.09';
  const green = '0.102 0.361 0.180';
  const black = '0.1 0.1 0.1';
  const white = '1 1 1';
  const cx = cardX + cardW / 2;

  const frontScreenTop = 60;
  const frontPdfTop = toPdfY(frontScreenTop);
  const frontPdfBottom = toPdfY(frontScreenTop + cardH);

  rect(cardX, frontPdfBottom, cardW, cardH, white);
  o.push(`${black} RG 2 w ${cardX} ${frontPdfBottom} ${cardW} ${cardH} re S`);

  const greenH = 52;
  rect(cardX, frontPdfTop - greenH, cardW, greenH, green);
  horizontalLine(cardX, frontPdfTop - greenH, cardX + cardW, 1.5, gold);

  drawCenterText(cx, frontPdfTop - 16, 'C.P.C.M.T.Q.L.S', 14, 'F2', gold, true);
  drawCenterText(cx, frontPdfTop - 24, 'CONSELHO PROVINCIAL DOS CONDUTORES DE MOTOCICLOS, TRICICLOS E QUADRICICLOS DA LUNDA SUL', 5.5, 'F1', gold, false);

  drawCenterText(cx, frontPdfTop - 36, 'LICENCA PROFISSIONAL DE CONDUTOR', 13, 'F2', gold, true);
  const titleW = textWidth('LICENCA PROFISSIONAL DE CONDUTOR', 13, true);
  horizontalLine(cx - titleW / 2, frontPdfTop - 38, cx + titleW / 2, 0.8, gold);

  const fieldStartY = frontPdfTop - greenH - 14;
  let fy = fieldStartY;

  const drawField = (label: string, value: string, size = 10.5) => {
    drawText(cardX + 18, fy, `${label} ${value}`, size, 'F1', black);
    fy -= size + 4;
  };

  drawField('Nome:', c.nomeCompleto, 11);
  drawField('Sexo:', c.sexo, 10);
  drawText(cardX + 18, fy, `Membro n\u00BA: ${c.numeroMembro}`, 8.5, 'F1', black);
  fy -= 12.5;
  drawField('Categoria:', c.tipoVeiculo, 10);
  drawField('Titulo:', 'Condutor Profissional', 10);
  drawField('Nacionalidade:', c.nacionalidade || 'Angolana', 10);
  drawField('Provincia:', c.provincia || 'Lunda Sul', 10);

  const sigY = frontPdfBottom + 18;
  drawCenterText(cx, sigY + 4, 'O DIRECTOR EXECUTIVO', 9, 'F2', black, true);
  horizontalLine(cx - 60, sigY - 4, cx + 60, 0.5, black);

  const phX = cardX + cardW - 106;
  const phY = frontPdfBottom + 10;
  const phW = 88;
  const phH = 108;
  rect(phX, phY, phW, phH, '0.91 0.91 0.89');
  o.push(`${black} RG 1.5 w ${phX} ${phY} ${phW} ${phH} re S`);
  drawCenterText(phX + phW / 2, phY + phH / 2 + 4, 'FOTO', 10, 'F1', '0.6 0.6 0.6', true);

  const backScreenTop = frontScreenTop + cardH + 35;
  const backPdfTop = toPdfY(backScreenTop);
  const backPdfBottom = toPdfY(backScreenTop + cardH);

  rect(cardX, backPdfBottom, cardW, cardH, white);
  o.push(`${black} RG 2 w ${cardX} ${backPdfBottom} ${cardW} ${cardH} re S`);

  drawText(cardX + 18, backPdfTop - 16, `Data de Emissao: ${c.dataEmissaoLicenca}`, 10, 'F2', black, true);
  drawRightText(cardX + cardW - 18, backPdfTop - 16, `Validade: ${c.validadeLicenca}`, 10, 'F2', black, true);

  const bcY = backPdfTop - 50;
  const bcH = 28;
  rect(cardX + 30, bcY, cardW - 60, bcH, black);
  drawCenterText(cx, bcY + 10, `CPCMTQLS-${String(c.numeroOrdem).padStart(6, '0')}-${c.numeroBI}`, 8, 'F1', white, false);

  const greenSectionTop = bcY - 8;
  const greenSectionH = greenSectionTop - backPdfBottom;
  rect(cardX, backPdfBottom, cardW, greenSectionH, green);

  const gLines = [
    'Este passe e distribuido para o uso pessoal ao condutor profissional',
    'credenciado pelo Conselho Provincial da Lunda Sul. E intransferivel e',
    'deve-se acompanhar por um outro documento de Identificacao sempre',
    'que solicitado. Em caso de extravio, contactar a C.P.C.M.T.Q.L.S.',
  ];
  let gy = greenSectionTop - 16;
  for (const gLine of gLines) {
    drawText(cardX + 18, gy, gLine, 7, 'F1', white);
    gy -= 10;
  }

  drawCenterText(cx, gy - 2, 'Contactos: 941-000-517 / 924-591-350', 8, 'F1', gold, true);
  drawCenterText(cx, gy - 14, 'Decreto Presidencial N\u00BA 245/15', 7, 'F1', white, false);

  const bottomRowY = backPdfBottom + 22;
  horizontalLine(cardX + 14, bottomRowY, cardX + cardW - 14, 0.3, '1 1 1');

  const flagX = cardX + 14;
  const flagY = backPdfBottom + 6;
  const flagW = 32;
  const flagH = 20;
  rect(flagX, flagY, flagW, flagH / 2, '0.753 0.224 0.169');
  rect(flagX, flagY, flagW, flagH / 2, black, true);
  rect(flagX, flagY, flagW, flagH / 2, '0.1 0.1 0.1');
  drawCenterText(flagX + flagW / 2, flagY + 5, '*', 8, 'F1', '0.945 0.769 0.059', false);

  drawCenterText(cx, backPdfBottom + 11, '"Mototaxistas organizados, transito mais seguro"', 8, 'F1', white, false);
  drawRightText(cardX + cardW - 14, backPdfBottom + 11, 'Lunda Sul', 9, 'F2', white, true);

  const content = o.join('\n');
  const contentBuf = Buffer.from(content, 'latin1');

  const objs: string[] = [];
  const add = (s: string) => { objs.push(s); return objs.length; };

  add('<< /Type /Catalog /Pages 2 0 R >>');
  add(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`);
  add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`);
  add(`<< /Length ${contentBuf.length} >>\nstream\n${content}\nendstream`);
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 0; i < objs.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objs[i]}\nendobj\n`;
  }

  const xrefOff = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOff}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
}
