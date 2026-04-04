import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { readFileSync } from 'fs';
import path from 'path';
import { getFontFaceSVG, FONT_FAMILY } from '@/lib/pdf-fonts';

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

    const { data, error } = await supabase
      .from('condutores')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Condutor nao encontrado' }, { status: 404 });
    }

    const condutor = toCamelCase(data) as Record<string, unknown>;
    const pdfBuffer = await generateFichaPDF(condutor);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Ficha_Registo_${condutor.numeroOrdem}_${String(condutor.nomeCompleto).replace(/\s+/g, '_')}.pdf"`,
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

function truncate(str: string, maxLen: number): string {
  const s = String(str || '-');
  if (s.length <= maxLen) return s;
  return s.substring(0, maxLen - 3) + '...';
}

const FF = FONT_FAMILY;

function buildFichaSVG(c: Record<string, unknown>): string {
  const W = 595;
  const H = 842;
  const ML = 45;
  const MR = W - 45;
  const CW = MR - ML;

  const logoBase64 = getLogoBase64();
  const fontDefs = getFontFaceSVG();

  const GREEN = '#1a5c2e';
  const DARK = '#1a1a1a';
  const GOLD = '#d4a017';
  const WHITE = '#ffffff';
  const LGRAY = '#f0f0eb';
  const GRAY = '#6b6b6b';
  const DGRAY = '#d1d1cc';

  let y = 44;
  const addY = (amount: number) => { y += amount; };

  const sectionHeader = (num: string, title: string): string => {
    let s = '';
    s += `<text x="${ML}" y="${y}" fill="${GREEN}" font-size="13" font-weight="bold" font-family="${FF}">${num}. ${title}</text>\n`;
    addY(5);
    s += `<line x1="${ML}" y1="${y}" x2="${MR}" y2="${y}" stroke="${DGRAY}" stroke-width="0.5"/>\n`;
    addY(9);
    return s;
  };

  const fieldRow = (label: string, value: string, valueMaxLen = 36): string => {
    return `<text x="${ML}" y="${y}" fill="${DARK}" font-size="10" font-weight="bold" font-family="${FF}">${esc(label)}:</text>` +
      `<text x="${ML + 178}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">${esc(truncate(String(value || '-'), valueMaxLen))}</text>\n`;
  };

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += fontDefs;
  svg += `<rect x="0" y="0" width="${W}" height="${H}" fill="${WHITE}"/>`;

  if (logoBase64) {
    const wmSize = 450;
    svg += `<image href="${logoBase64}" x="${W / 2 - wmSize / 2}" y="${H / 2 - wmSize / 2}" width="${wmSize}" height="${wmSize}" preserveAspectRatio="xMidYMid meet" opacity="0.055"/>`;
  }

  svg += `<rect x="0" y="0" width="${W}" height="34" fill="${GREEN}"/>`;
  svg += `<line x1="0" y1="34" x2="${W}" y2="34" stroke="${GOLD}" stroke-width="1.5"/>`;
  svg += `<text x="${W / 2}" y="15" text-anchor="middle" fill="${GOLD}" font-size="16" font-weight="bold" font-family="${FF}" letter-spacing="2">C.P.C.M.T.Q.L.S</text>`;
  svg += `<text x="${W / 2}" y="28" text-anchor="middle" fill="${WHITE}" font-size="7.5" font-family="${FF}" letter-spacing="0.5">Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul</text>`;

  svg += `<text x="${W / 2}" y="${y + 10}" text-anchor="middle" fill="${GREEN}" font-size="16" font-weight="bold" font-family="${FF}" letter-spacing="1.5">FICHA DE REGISTO DO CONDUTOR</text>`;
  addY(16);
  svg += `<line x1="${ML}" y1="${y}" x2="${MR}" y2="${y}" stroke="${GREEN}" stroke-width="1"/>`;
  addY(12);

  // 1. DADOS PESSOAIS
  svg += sectionHeader('1', 'DADOS PESSOAIS');
  const rows1: [string, unknown, number?][] = [
    ['Nome Completo', c.nomeCompleto, 34],
    ['Data de Nascimento', c.dataNascimento],
    ['Sexo', c.sexo],
    ['No do Bilhete de Identidade', c.numeroBI],
    ['Data de Emissao do B.I.', c.dataEmissaoBI],
    ['Estado Civil', c.estadoCivil],
    ['Telefone 1', c.telefone1],
    ['Telefone 2', c.telefone2],
    ['Endereco / Bairro', c.endereco, 32],
    ['Municipio', c.municipio],
  ];
  for (const [label, value, maxLen] of rows1) {
    svg += fieldRow(label, String(value), (maxLen as number) || 42);
    addY(15);
  }
  addY(6);

  // 2. DADOS PROFISSIONAIS
  svg += sectionHeader('2', 'DADOS PROFISSIONAIS');
  const tipo = String(c.tipoVeiculo || '');
  const chkM = tipo === 'Motociclo' ? 'X' : ' ';
  const chkT = tipo === 'Triciclo' ? 'X' : ' ';
  const chkQ = tipo === 'Quadriciclo' ? 'X' : ' ';
  svg += `<text x="${ML}" y="${y}" fill="${DARK}" font-size="10" font-weight="bold" font-family="${FF}">Tipo de Veiculo:</text>`;
  svg += `<text x="${ML + 178}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">[${chkM}] Motociclo  [${chkT}] Triciclo  [${chkQ}] Quadriciclo</text>\n`;
  addY(16);

  const rows2: [string, unknown][] = [
    ['Marca do Veiculo', c.marcaVeiculo],
    ['Modelo', c.modeloVeiculo],
    ['Cor', c.corVeiculo],
    ['Matricula', c.matriculaVeiculo],
    ['No da Carta de Conducao', c.numeroCartaConducao],
    ['Categoria da Carta', c.categoriaCarta],
    ['Tempo de Experiencia', c.tempoExperiencia],
  ];
  for (const [label, value] of rows2) {
    svg += fieldRow(label, String(value));
    addY(15);
  }
  addY(6);

  // 3. LOCAL DE TRABALHO
  svg += sectionHeader('3', 'LOCAL DE TRABALHO');
  svg += fieldRow('Municipio (actividade)', String(c.municipioTrabalho || '-'));
  addY(15);
  svg += fieldRow('Horario de Trabalho', String(c.horarioTrabalho || '-'));
  addY(15);
  addY(6);

  // 4. DOCUMENTACAO
  svg += sectionHeader('4', 'DOCUMENTACAO E EQUIPAMENTOS');
  svg += `<text x="${ML}" y="${y}" fill="${GRAY}" font-size="9" font-style="italic" font-family="${FF}">Assinale os documentos e equipamentos que possui:</text>\n`;
  addY(15);

  const docs: [string, string][] = [
    ['temBI', 'Bilhete de Identidade'],
    ['temCartaConducao', 'Carta de Conducao'],
    ['temDocumentoVeiculo', 'Documento do Veiculo'],
    ['temSeguroVeiculo', 'Seguro do Veiculo'],
    ['temCapacete', 'Capacete de Protecao'],
    ['temColeteRefletor', 'Colete Refletor'],
  ];

  for (let i = 0; i < docs.length; i += 2) {
    const [key1, label1] = docs[i];
    const checked1 = c[key1] ? 'X' : ' ';
    let line = `<text x="${ML + 14}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">[${checked1}]  ${esc(label1)}</text>`;
    if (i + 1 < docs.length) {
      const [key2, label2] = docs[i + 1];
      const checked2 = c[key2] ? 'X' : ' ';
      line += `<text x="${ML + CW / 2 + 14}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">[${checked2}]  ${esc(label2)}</text>`;
    }
    svg += line + '\n';
    addY(15);
  }
  addY(6);

  // 5. FORMACAO
  svg += sectionHeader('5', 'FORMACAO');
  svg += `<text x="${ML}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">Ja participou em formacao sobre seguranca rodoviaria?</text>\n`;
  addY(15);
  const formSim = c.participouFormacao ? 'X' : ' ';
  const formNao = !c.participouFormacao ? 'X' : ' ';
  svg += `<text x="${ML + 14}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">[${formSim}] Sim            [${formNao}] Nao</text>\n`;
  addY(16);
  if (c.participouFormacao && c.instituicaoFormacao) {
    svg += fieldRow('Instituicao', String(c.instituicaoFormacao));
    addY(15);
  }
  addY(6);

  // 6. DECLARACAO
  svg += sectionHeader('6', 'DECLARACAO');
  const declBoxY = y;
  const declBoxH = 56;
  svg += `<rect x="${ML}" y="${declBoxY}" width="${CW}" height="${declBoxH}" rx="3" fill="${LGRAY}" stroke="${DGRAY}" stroke-width="0.5"/>`;
  const declLines = [
    'Declaro que as informacoes acima prestadas sao verdadeiras e comprometo-me a',
    'cumprir as normas do Conselho Provincial dos Condutores de Motociclos, Triciclos e',
    'Quadriciclos da Lunda Sul, bem como respeitar o Codigo de Estrada e as regras de',
    'seguranca rodoviaria.',
  ];
  let dy = declBoxY + 14;
  for (const dl of declLines) {
    svg += `<text x="${ML + 8}" y="${dy}" fill="${DARK}" font-size="9" font-family="${FF}">${esc(dl)}</text>\n`;
    dy += 11;
  }
  addY(declBoxH + 14);

  // 7. DADOS DA LICENCA
  svg += sectionHeader('7', 'DADOS DA LICENCA');
  const rowsLicenca: [string, string][] = [
    ['No de Registo', String(c.numeroOrdem)],
    ['No Membro', String(c.numeroMembro)],
    ['Nacionalidade', String(c.nacionalidade || 'Angolana')],
    ['Provincia', String(c.provincia || 'Lunda Sul')],
    ['Data de Emissao', String(c.dataEmissaoLicenca)],
    ['Validade', String(c.validadeLicenca)],
    ['Situacao', String(c.status)],
  ];

  for (let i = 0; i < rowsLicenca.length; i += 2) {
    const [label1, value1] = rowsLicenca[i];
    let line = `<text x="${ML}" y="${y}" fill="${DARK}" font-size="10" font-weight="bold" font-family="${FF}">${esc(label1)}:</text>`;
    line += `<text x="${ML + 95}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">${esc(truncate(value1, 26))}</text>`;
    if (i + 1 < rowsLicenca.length) {
      const [label2, value2] = rowsLicenca[i + 1];
      line += `<text x="${ML + CW / 2}" y="${y}" fill="${DARK}" font-size="10" font-weight="bold" font-family="${FF}">${esc(label2)}:</text>`;
      line += `<text x="${ML + CW / 2 + 95}" y="${y}" fill="${DARK}" font-size="10" font-family="${FF}">${esc(truncate(value2, 26))}</text>`;
    }
    svg += line + '\n';
    addY(15);
  }
  addY(14);

  // SIGNATURES
  svg += `<line x1="${ML}" y1="${y}" x2="${MR}" y2="${y}" stroke="${DGRAY}" stroke-width="0.5"/>\n`;
  addY(20);

  const sigLeftX = ML + CW / 4;
  const sigRightX = ML + CW * 3 / 4;
  const regDate = c.dataRegisto
    ? new Date(String(c.dataRegisto)).toLocaleDateString('pt-AO')
    : '-';

  svg += `<text x="${sigLeftX}" y="${y}" text-anchor="middle" fill="${DARK}" font-size="9.5" font-family="${FF}">Data: ____/____/________</text>\n`;
  addY(14);
  svg += `<text x="${sigLeftX}" y="${y}" text-anchor="middle" fill="${GRAY}" font-size="8.5" font-style="italic" font-family="${FF}">Assinatura do Condutor</text>\n`;
  addY(5);
  svg += `<line x1="${sigLeftX - 70}" y1="${y}" x2="${sigLeftX + 70}" y2="${y}" stroke="${DARK}" stroke-width="0.5"/>\n`;

  const sigBaseY = y - 19;
  svg += `<text x="${sigRightX}" y="${sigBaseY}" text-anchor="middle" fill="${DARK}" font-size="9.5" font-family="${FF}">Data de Registo: ${esc(regDate)}</text>\n`;
  svg += `<text x="${sigRightX}" y="${sigBaseY + 14}" text-anchor="middle" fill="${GRAY}" font-size="8.5" font-style="italic" font-family="${FF}">O Responsavel pelo Registo</text>\n`;
  svg += `<line x1="${sigRightX - 70}" y1="${sigBaseY + 19}" x2="${sigRightX + 70}" y2="${sigBaseY + 19}" stroke="${DARK}" stroke-width="0.5"/>\n`;

  // FOOTER
  svg += `<rect x="0" y="${H - 30}" width="${W}" height="30" fill="${GREEN}"/>`;
  svg += `<text x="${W / 2}" y="${H - 19}" text-anchor="middle" fill="${WHITE}" font-size="8.5" font-family="${FF}">Condutores organizados, transito mais seguro</text>`;
  svg += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" fill="${GOLD}" font-size="7" font-family="${FF}">C.P.C.M.T.Q.L.S | Contactos: 941-000-517 / 924-591-350</text>`;

  svg += '</svg>';
  return svg;
}

async function generateFichaPDF(c: Record<string, unknown>): Promise<Buffer> {
  const svgContent = buildFichaSVG(c);
  const scale = 3;
  const pngBuffer = await sharp(Buffer.from(svgContent))
    .resize(595 * scale, 842 * scale, { fit: 'fill' })
    .png({ compressionLevel: 6 })
    .toBuffer();

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const pngImage = await pdfDoc.embedPng(pngBuffer);
  page.drawImage(pngImage, { x: 0, y: 0, width: 595, height: 842 });

  pdfDoc.setTitle(`Ficha de Registo - ${c.nomeCompleto}`);
  pdfDoc.setAuthor('C.P.C.M.T.Q.L.S');
  pdfDoc.setSubject('Ficha de Registo do Condutor');

  return Buffer.from(await pdfDoc.save());
}
