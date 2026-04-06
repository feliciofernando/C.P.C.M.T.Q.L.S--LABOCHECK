/**
 * Ficha de Registo do Condutor - PDF Generator
 * 
 * Uses jsPDF (pure JavaScript) - ZERO filesystem dependencies.
 * Works on Vercel serverless, local dev, and any Node.js environment.
 * 
 * Fonts: Uses PDF standard14 fonts (Helvetica/Helvetica-Bold) which
 * support all Portuguese characters via WinAnsiEncoding.
 * No custom font files needed.
 */

import jsPDF from 'jspdf';

// ─── Constants ─────────────────────────────────────────────
const W = 210; // A4 width in mm
const H = 297; // A4 height in mm
const ML = 15; // Left margin
const MR = W - 15; // Right margin
const CW = MR - ML; // Content width

const GREEN = '#1a5c2e';
const DARK = '#1a1a1a';
const GOLD = '#d4a017';
const WHITE = '#ffffff';
const LGRAY = '#f0f0eb';
const GRAY = '#6b6b6b';
const DGRAY = '#d1d1cc';

// ─── Helpers ───────────────────────────────────────────────

function str(val: unknown): string {
  const s = String(val ?? '-');
  return s.trim() === '' ? '-' : s;
}

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.substring(0, maxLen - 3) + '...';
}

/** Convert UTF-8 accented chars to WinAnsi equivalents for standard14 fonts */
function toWinAnsi(text: string): string {
  const map: Record<string, string> = {
    '\u00c0': '\xc0', '\u00c1': '\xc1', '\u00c2': '\xc2', '\u00c3': '\xc3', '\u00c4': '\xc4', '\u00c5': '\xc5',
    '\u00c6': '\xc6', '\u00c7': '\xc7', '\u00c8': '\xc8', '\u00c9': '\xc9', '\u00ca': '\xca', '\u00cb': '\xcb',
    '\u00cc': '\xcc', '\u00cd': '\xcd', '\u00ce': '\xce', '\u00cf': '\xcf', '\u00d0': '\xd0', '\u00d1': '\xd1',
    '\u00d2': '\xd2', '\u00d3': '\xd3', '\u00d4': '\xd4', '\u00d5': '\xd5', '\u00d6': '\xd6', '\u00d7': '\xd7',
    '\u00d8': '\xd8', '\u00d9': '\xd9', '\u00da': '\xda', '\u00db': '\xdb', '\u00dc': '\xdc', '\u00dd': '\xdd',
    '\u00de': '\xde', '\u00df': '\xdf',
    '\u00e0': '\xe0', '\u00e1': '\xe1', '\u00e2': '\xe2', '\u00e3': '\xe3', '\u00e4': '\xe4', '\u00e5': '\xe5',
    '\u00e6': '\xe6', '\u00e7': '\xe7', '\u00e8': '\xe8', '\u00e9': '\xe9', '\u00ea': '\xea', '\u00eb': '\xeb',
    '\u00ec': '\xec', '\u00ed': '\xed', '\u00ee': '\xee', '\u00ef': '\xef', '\u00f0': '\xf0', '\u00f1': '\xf1',
    '\u00f2': '\xf2', '\u00f3': '\xf3', '\u00f4': '\xf4', '\u00f5': '\xf5', '\u00f6': '\xf6', '\u00f7': '\xf7',
    '\u00f8': '\xf8', '\u00f9': '\xf9', '\u00fa': '\xfa', '\u00fb': '\xfb', '\u00fc': '\xfc', '\u00fd': '\xfd',
    '\u00fe': '\xfe', '\u00ff': '\xff',
  };
  let result = '';
  for (const ch of text) {
    result += map[ch] ?? ch;
  }
  return result;
}

function t(text: string): string {
  return toWinAnsi(str(text));
}

// ─── PDF Builder ────────────────────────────────────────────

export function generateFichaPDF(c: Record<string, unknown>): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = 12;

  // ── WHITE BACKGROUND ──
  doc.setFillColor(WHITE);
  doc.rect(0, 0, W, H, 'F');

  // ── GREEN HEADER BAR ──
  doc.setFillColor(GREEN);
  doc.rect(0, 0, W, 17, 'F');
  doc.setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(0, 17, W, 17);

  // Header text
  doc.setTextColor(GOLD);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('C.P.C.M.T.Q.L.S', W / 2, 7, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(WHITE);
  doc.text('Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul', W / 2, 13.5, { align: 'center' });

  // ── TITLE ──
  y = 27;
  doc.setTextColor(GREEN);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHA DE REGISTO DO CONDUTOR', W / 2, y, { align: 'center' });
  y += 4;
  doc.setDrawColor(GREEN);
  doc.setLineWidth(0.3);
  doc.line(ML, y, MR, y);
  y += 7;

  // ── SECTION 1: DADOS PESSOAIS ──
  y = sectionHeader(doc, y, '1', 'DADOS PESSOAIS');

  const rows1: [string, unknown, number?][] = [
    ['Nome Completo', c.nomeCompleto, 34],
    ['Data de Nascimento', c.dataNascimento],
    ['Sexo', c.sexo],
    ['No do Bilhete de Identidade', c.numeroBI],
    ['Data de Emissão do B.I.', c.dataEmissaoBI],
    ['Estado Civil', c.estadoCivil],
    ['Telefone 1', c.telefone1],
    ['Telefone 2', c.telefone2],
    ['Endereço / Bairro', c.endereco, 32],
    ['Município', c.municipio],
  ];
  for (const [label, value, maxLen] of rows1) {
    y = fieldRow(doc, y, label, String(value), (maxLen as number) || 42);
  }
  y += 2;

  // ── SECTION 2: DADOS PROFISSIONAIS ──
  y = sectionHeader(doc, y, '2', 'DADOS PROFISSIONAIS');

  const tipo = str(c.tipoVeiculo);
  doc.setTextColor(DARK);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Tipo de Veículo:', ML, y);
  doc.setFont('helvetica', 'normal');
  const chkM = tipo === 'Motociclo' ? '[X]' : '[ ]';
  const chkT = tipo === 'Triciclo' ? '[X]' : '[ ]';
  const chkQ = tipo === 'Quadriciclo' ? '[X]' : '[ ]';
  doc.text(`${chkM} Motociclo  ${chkT} Triciclo  ${chkQ} Quadriciclo`, ML + 42, y);
  y += 5.5;

  const rows2: [string, unknown][] = [
    ['Marca do Veículo', c.marcaVeiculo],
    ['Modelo', c.modeloVeiculo],
    ['Cor', c.corVeiculo],
    ['Matrícula', c.matriculaVeiculo],
    ['N.º da Carta de Condução', c.numeroCartaConducao],
    ['Categoria da Carta', c.categoriaCarta],
    ['Tempo de Experiência', c.tempoExperiencia],
  ];
  for (const [label, value] of rows2) {
    y = fieldRow(doc, y, label, String(value));
  }
  y += 2;

  // ── SECTION 3: LOCAL DE TRABALHO ──
  y = sectionHeader(doc, y, '3', 'LOCAL DE TRABALHO');
  y = fieldRow(doc, y, 'Município (actividade)', String(c.municipioTrabalho));
  y = fieldRow(doc, y, 'Horário de Trabalho', String(c.horarioTrabalho));
  y += 2;

  // ── SECTION 4: DOCUMENTAÇÃO E EQUIPAMENTOS ──
  y = sectionHeader(doc, y, '4', 'DOCUMENTAÇÃO E EQUIPAMENTOS');

  doc.setTextColor(GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Assinale os documentos e equipamentos que possui:', ML, y);
  y += 5;

  const docs: [string, string][] = [
    ['temBI', 'Bilhete de Identidade'],
    ['temCartaConducao', 'Carta de Condução'],
    ['temDocumentoVeiculo', 'Documento do Veículo'],
    ['temSeguroVeiculo', 'Seguro do Veículo'],
    ['temCapacete', 'Capacete de Proteção'],
    ['temColeteRefletor', 'Colete Refletor'],
  ];

  doc.setTextColor(DARK);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  for (let i = 0; i < docs.length; i += 2) {
    const [key1, label1] = docs[i];
    const checked1 = c[key1] ? 'X' : ' ';
    doc.text(`[${checked1}]  ${t(label1)}`, ML + 4, y);
    if (i + 1 < docs.length) {
      const [key2, label2] = docs[i + 1];
      const checked2 = c[key2] ? 'X' : ' ';
      doc.text(`[${checked2}]  ${t(label2)}`, ML + CW / 2 + 4, y);
    }
    y += 5;
  }
  y += 2;

  // ── SECTION 5: FORMACAO ──
  y = sectionHeader(doc, y, '5', 'FORMAÇÃO');

  doc.setTextColor(DARK);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Já participou em formação sobre segurança rodoviária?', ML, y);
  y += 5;

  const formSim = c.participouFormacao ? 'X' : ' ';
  const formNao = !c.participouFormacao ? 'X' : ' ';
  doc.text(`[${formSim}] Sim            [${formNao}] Não`, ML + 4, y);
  y += 6;

  if (c.participouFormacao && c.instituicaoFormacao) {
    y = fieldRow(doc, y, 'Instituição', String(c.instituicaoFormacao));
  }
  y += 2;

  // ── SECTION 6: DECLARACAO ──
  y = sectionHeader(doc, y, '6', 'DECLARAÇÃO');

  const declBoxH = 23;
  doc.setFillColor(LGRAY);
  doc.setDrawColor(DGRAY);
  doc.setLineWidth(0.2);
  doc.roundedRect(ML, y, CW, declBoxH, 1, 1, 'FD');

  const declLines = [
    'Declaro que as informações acima prestadas são verdadeiras e comprometo-me a',
    'cumprir as normas do Conselho Provincial dos Condutores de Motociclos, Triciclos e',
    'Quadriciclos da Lunda Sul, bem como respeitar o Código de Estrada e as regras de',
    'segurança rodoviária.',
  ];
  doc.setTextColor(DARK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  let dy = y + 5;
  for (const dl of declLines) {
    doc.text(t(dl), ML + 3, dy);
    dy += 4.5;
  }
  y += declBoxH + 5;

  // ── SECTION 7: DADOS DA LICENCA ──
  y = sectionHeader(doc, y, '7', 'DADOS DA LICENÇA');

  const rowsLicenca: [string, string][] = [
    ['Nº de Registo', String(c.numeroOrdem).padStart(3, '0')],
    ['Nº Membro', str(c.numeroMembro)],
    ['Nacionalidade', str(c.nacionalidade || 'Angolana')],
    ['Província', str(c.provincia || 'Lunda Sul')],
    ['Data de Emissão', str(c.dataEmissaoLicenca)],
    ['Validade', str(c.validadeLicenca)],
    ['Situação', str(c.status)],
  ];

  for (let i = 0; i < rowsLicenca.length; i += 2) {
    const [label1, value1] = rowsLicenca[i];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(`${t(label1)}:`, ML, y);
    doc.setFont('helvetica', 'normal');
    doc.text(t(truncate(value1, 22)), ML + 26, y);

    if (i + 1 < rowsLicenca.length) {
      const [label2, value2] = rowsLicenca[i + 1];
      doc.setFont('helvetica', 'bold');
      doc.text(`${t(label2)}:`, ML + CW / 2, y);
      doc.setFont('helvetica', 'normal');
      doc.text(t(truncate(value2, 22)), ML + CW / 2 + 26, y);
    }
    y += 5.5;
  }
  y += 5;

  // ── SIGNATURES ──
  doc.setDrawColor(DGRAY);
  doc.setLineWidth(0.2);
  doc.line(ML, y, MR, y);
  y += 10;

  const sigLeftX = ML + CW / 4;
  const sigRightX = ML + CW * 3 / 4;

  doc.setTextColor(DARK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Data: ____/____/________', sigLeftX, y, { align: 'center' });
  y += 5;
  doc.setTextColor(GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Assinatura do Condutor', sigLeftX, y, { align: 'center' });
  y += 2;
  doc.setDrawColor(DARK);
  doc.setLineWidth(0.3);
  doc.line(sigLeftX - 25, y, sigLeftX + 25, y);

  const sigBaseY = y - 9;
  doc.setTextColor(DARK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const regDate = c.dataRegisto
    ? new Date(String(c.dataRegisto)).toLocaleDateString('pt-AO')
    : '-';
  doc.text(`Data de Registo: ${t(regDate)}`, sigRightX, sigBaseY, { align: 'center' });
  doc.setTextColor(GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('O Responsável pelo Registo', sigRightX, sigBaseY + 5, { align: 'center' });
  doc.setDrawColor(DARK);
  doc.setLineWidth(0.3);
  doc.line(sigRightX - 25, sigBaseY + 6.5, sigRightX + 25, sigBaseY + 6.5);

  // ── FOOTER ──
  doc.setFillColor(GREEN);
  doc.rect(0, H - 11, W, 11, 'F');
  doc.setTextColor(WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Condutores organizados, trânsito mais seguro', W / 2, H - 7, { align: 'center' });
  doc.setTextColor(GOLD);
  doc.setFontSize(6.5);
  doc.text('C.P.C.M.T.Q.L.S | Contactos: 941-000-517 / 924-591-350', W / 2, H - 3, { align: 'center' });

  // ── METADATA ──
  doc.setProperties({
    title: `Ficha de Registo - ${str(c.nomeCompleto)}`,
    author: 'C.P.C.M.T.Q.L.S',
    subject: 'Ficha de Registo do Condutor',
  });

  return Buffer.from(doc.output('arraybuffer'));
}

// ─── Drawing helpers ───────────────────────────────────────

function sectionHeader(doc: jsPDF, y: number, num: string, title: string): number {
  doc.setTextColor(GREEN);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`${num}. ${t(title)}`, ML, y);
  y += 2;
  doc.setDrawColor(DGRAY);
  doc.setLineWidth(0.2);
  doc.line(ML, y, MR, y);
  y += 3.5;
  return y;
}

function fieldRow(doc: jsPDF, y: number, label: string, value: string, maxLen = 36): number {
  doc.setTextColor(DARK);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${t(label)}:`, ML, y);
  doc.setFont('helvetica', 'normal');
  doc.text(t(truncate(str(value), maxLen)), ML + 48, y);
  return y + 5;
}
