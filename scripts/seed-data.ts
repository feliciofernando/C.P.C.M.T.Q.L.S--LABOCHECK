import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import sharp from 'sharp';

const db = new PrismaClient();

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function makeMemberNumber(ordem: number): string {
  return `${String(ordem).padStart(6, '0')}/C.P.C.M.T.Q.L.S/${String(new Date().getFullYear()).slice(2)}`;
}

async function generateQR(ordem: number, nome: string, bi: string): Promise<string> {
  const data = JSON.stringify({ numeroOrdem: ordem, nome, bi });
  const qrPng = await QRCode.toDataURL(data, {
    type: 'image/png',
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  const buf = Buffer.from(qrPng.replace(/^data:image\/png;base64,/, ''), 'base64');
  const jpegBuf = await sharp(buf)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 92 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpegBuf.toString('base64')}`;
}

function makePlaceholderFoto(cor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150">
    <rect width="120" height="150" fill="${cor}" rx="8"/>
    <circle cx="60" cy="55" r="25" fill="rgba(255,255,255,0.3)"/>
    <ellipse cx="60" cy="130" rx="35" ry="25" fill="rgba(255,255,255,0.3)"/>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const condutores = [
  {
    nomeCompleto: 'Garcia Manuel Bamba',
    dataNascimento: '15-03-1990',
    sexo: 'Masculino',
    numeroBI: '007248035UE044',
    dataEmissaoBI: '10-01-2018',
    estadoCivil: 'Casado/a',
    telefone1: '924-591-350',
    telefone2: '941-000-517',
    endereco: 'Bairro Social da Juventude, Rua 5',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Honda',
    modeloVeiculo: 'CG 125',
    corVeiculo: 'Vermelha',
    matriculaVeiculo: 'LD-452-AB',
    numeroCartaConducao: 'A-002356',
    categoriaCarta: 'A',
    tempoExperiencia: '5 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '06h - 18h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'INAT - Instituto Nacional de Transito',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#2d5a3d',
  },
  {
    nomeCompleto: 'Ana Maria Tavares',
    dataNascimento: '22-07-1995',
    sexo: 'Feminino',
    numeroBI: '005823174LF072',
    dataEmissaoBI: '05-06-2019',
    estadoCivil: 'Solteiro/a',
    telefone1: '923-456-789',
    telefone2: '',
    endereco: 'Bairro Cassengue, Rua das Flores 12',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'TVS',
    modeloVeiculo: 'Apache RTR 200',
    corVeiculo: 'Preta',
    matriculaVeiculo: 'LD-789-CD',
    numeroCartaConducao: 'A-004512',
    categoriaCarta: 'A',
    tempoExperiencia: '2 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '07h - 17h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: false, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'CPCMTQLS - Formacao Interna',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#5a3d2d',
  },
  {
    nomeCompleto: 'Joao Pedro Francisco',
    dataNascimento: '08-11-1988',
    sexo: 'Masculino',
    numeroBI: '004125698ME033',
    dataEmissaoBI: '20-03-2017',
    estadoCivil: 'Casado/a',
    telefone1: '916-234-567',
    telefone2: '945-123-456',
    endereco: 'Bairro Mundundo, Av. Principal',
    municipio: 'Saurimo',
    tipoVeiculo: 'Triciclo',
    marcaVeiculo: 'Bajaj',
    modeloVeiculo: 'RE Maxima',
    corVeiculo: 'Azul',
    matriculaVeiculo: 'LD-234-EF',
    numeroCartaConducao: 'A-001789',
    categoriaCarta: 'A',
    tempoExperiencia: '7 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '05h - 19h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: false,
    participouFormacao: false, instituicaoFormacao: '',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#2d3d5a',
  },
  {
    nomeCompleto: 'Marta Conceicao Lopes',
    dataNascimento: '30-04-1992',
    sexo: 'Feminino',
    numeroBI: '006345012NK058',
    dataEmissaoBI: '12-09-2020',
    estadoCivil: 'Uniao de Facto',
    telefone1: '927-891-234',
    telefone2: '',
    endereco: 'Bairro 1o de Maio, Rua 8',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Yamaha',
    modeloVeiculo: 'YB 125',
    corVeiculo: 'Branca',
    matriculaVeiculo: 'LD-567-GH',
    numeroCartaConducao: 'A-005678',
    categoriaCarta: 'A',
    tempoExperiencia: '3 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '06h - 18h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'INAT - Instituto Nacional de Transito',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#5a2d3d',
  },
  {
    nomeCompleto: 'Carlos Alberto Mendes',
    dataNascimento: '17-12-1985',
    sexo: 'Masculino',
    numeroBI: '003256789QZ021',
    dataEmissaoBI: '25-07-2015',
    estadoCivil: 'Casado/a',
    telefone1: '948-567-890',
    telefone2: '923-456-123',
    endereco: 'Zona Industrial, Rua D',
    municipio: 'Saurimo',
    tipoVeiculo: 'Quadriciclo',
    marcaVeiculo: 'Suzuki',
    modeloVeiculo: 'Burgman 200',
    corVeiculo: 'Cinzenta',
    matriculaVeiculo: 'LD-890-IJ',
    numeroCartaConducao: 'A-000987',
    categoriaCarta: 'A',
    tempoExperiencia: '10 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '06h - 18h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: false, temSeguroVeiculo: true, temCapacete: false, temColeteRefletor: false,
    participouFormacao: true, instituicaoFormacao: 'Escola de Conducao Lunda Sul',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'INATIVO',
    fotoCor: '#4a4a4a',
  },
  {
    nomeCompleto: 'Teresa Domingos Jose',
    dataNascimento: '05-09-1998',
    sexo: 'Feminino',
    numeroBI: '007890123RP065',
    dataEmissaoBI: '03-02-2021',
    estadoCivil: 'Solteiro/a',
    telefone1: '931-234-567',
    telefone2: '',
    endereco: 'Bairro do Aeroporto, Rua 3',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Haojue',
    modeloVeiculo: 'HJ125-8',
    corVeiculo: 'Vermelha',
    matriculaVeiculo: 'LD-123-KL',
    numeroCartaConducao: 'A-006234',
    categoriaCarta: 'A',
    tempoExperiencia: '1 ano',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '07h - 17h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: false, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'CPCMTQLS - Formacao Interna',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#3d5a2d',
  },
  {
    nomeCompleto: 'Fernando Antonio Silva',
    dataNascimento: '14-06-1982',
    sexo: 'Masculino',
    numeroBI: '002345678AB009',
    dataEmissaoBI: '18-11-2012',
    estadoCivil: 'Viuvo/a',
    telefone1: '912-678-901',
    telefone2: '945-789-012',
    endereco: 'Bairro Comercial, Av. de Angola',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Honda',
    modeloVeiculo: 'CB 300F',
    corVeiculo: 'Preta',
    matriculaVeiculo: 'LD-456-MN',
    numeroCartaConducao: 'A-000456',
    categoriaCarta: 'A',
    tempoExperiencia: '12 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '05h - 19h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'INAT - Instituto Nacional de Transito',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#2d4a5a',
  },
  {
    nomeCompleto: 'Beatriz Katumbela Francisco',
    dataNascimento: '20-02-1997',
    sexo: 'Feminino',
    numeroBI: '006789012CD047',
    dataEmissaoBI: '07-04-2022',
    estadoCivil: 'Casado/a',
    telefone1: '935-890-123',
    telefone2: '',
    endereco: 'Bairro Cassengue, Rua 15',
    municipio: 'Saurimo',
    tipoVeiculo: 'Triciclo',
    marcaVeiculo: 'Piaggio',
    modeloVeiculo: 'Ape',
    corVeiculo: 'Amarela',
    matriculaVeiculo: 'LD-789-OP',
    numeroCartaConducao: 'A-007890',
    categoriaCarta: 'A',
    tempoExperiencia: '2 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '06h - 18h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: false,
    participouFormacao: false, instituicaoFormacao: '',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'INATIVO',
    fotoCor: '#5a4a2d',
  },
  {
    nomeCompleto: 'Luis Manuel Quimba',
    dataNascimento: '11-08-1993',
    sexo: 'Masculino',
    numeroBI: '004567890EF038',
    dataEmissaoBI: '22-08-2019',
    estadoCivil: 'Casado/a',
    telefone1: '919-012-345',
    telefone2: '946-123-456',
    endereco: 'Bairro Cacolo, Rua da Paz',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Kawasaki',
    modeloVeiculo: 'Ninja 250',
    corVeiculo: 'Verde',
    matriculaVeiculo: 'LD-321-QR',
    numeroCartaConducao: 'A-003456',
    categoriaCarta: 'A',
    tempoExperiencia: '4 anos',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '06h - 18h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: true, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'Escola de Conducao Lunda Sul',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#3d2d5a',
  },
  {
    nomeCompleto: 'Patricia Ngola Joaquim',
    dataNascimento: '26-01-2000',
    sexo: 'Feminino',
    numeroBI: '008901234GH078',
    dataEmissaoBI: '15-05-2023',
    estadoCivil: 'Solteiro/a',
    telefone1: '937-234-567',
    telefone2: '',
    endereco: 'Bairro Popular, Rua 20',
    municipio: 'Saurimo',
    tipoVeiculo: 'Motociclo',
    marcaVeiculo: 'Royal Enfield',
    modeloVeiculo: 'Classic 350',
    corVeiculo: 'Azul Escuro',
    matriculaVeiculo: 'LD-654-ST',
    numeroCartaConducao: 'A-008901',
    categoriaCarta: 'A',
    tempoExperiencia: '6 meses',
    municipioTrabalho: 'Saurimo',
    horarioTrabalho: '07h - 17h',
    temBI: true, temCartaConducao: true, temDocumentoVeiculo: true, temSeguroVeiculo: false, temCapacete: true, temColeteRefletor: true,
    participouFormacao: true, instituicaoFormacao: 'CPCMTQLS - Formacao Interna',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
    status: 'ATIVA',
    fotoCor: '#2d5a5a',
  },
];

async function seed() {
  console.log('A criar dados de exemplo...');

  await db.condutor.deleteMany();
  console.log('Dados anteriores removidos.');

  const now = new Date();
  let ordem = 1;

  for (const c of condutores) {
    const memberNum = makeMemberNumber(ordem);
    const emissao = formatDate(now);
    const validade = formatDate(addYears(now, 1));
    const qr = await generateQR(ordem, c.nomeCompleto, c.numeroBI);
    const foto = makePlaceholderFoto(c.fotoCor);

    await db.condutor.create({
      data: {
        numeroOrdem: ordem,
        nomeCompleto: c.nomeCompleto,
        dataNascimento: c.dataNascimento,
        sexo: c.sexo,
        numeroBI: c.numeroBI,
        dataEmissaoBI: c.dataEmissaoBI,
        estadoCivil: c.estadoCivil,
        telefone1: c.telefone1,
        telefone2: c.telefone2,
        endereco: c.endereco,
        municipio: c.municipio,
        tipoVeiculo: c.tipoVeiculo,
        marcaVeiculo: c.marcaVeiculo,
        modeloVeiculo: c.modeloVeiculo,
        corVeiculo: c.corVeiculo,
        matriculaVeiculo: c.matriculaVeiculo,
        numeroCartaConducao: c.numeroCartaConducao,
        categoriaCarta: c.categoriaCarta,
        tempoExperiencia: c.tempoExperiencia,
        municipioTrabalho: c.municipioTrabalho,
        horarioTrabalho: c.horarioTrabalho,
        temBI: c.temBI,
        temCartaConducao: c.temCartaConducao,
        temDocumentoVeiculo: c.temDocumentoVeiculo,
        temSeguroVeiculo: c.temSeguroVeiculo,
        temCapacete: c.temCapacete,
        temColeteRefletor: c.temColeteRefletor,
        participouFormacao: c.participouFormacao,
        instituicaoFormacao: c.instituicaoFormacao,
        nacionalidade: c.nacionalidade,
        provincia: c.provincia,
        numeroMembro: memberNum,
        dataEmissaoLicenca: emissao,
        validadeLicenca: validade,
        qrCodeBase64: qr,
        fotoBase64: foto,
        status: c.status,
      },
    });

    console.log(`  [${ordem}] ${c.nomeCompleto} - ${c.tipoVeiculo} (${c.status})`);
    ordem++;
  }

  console.log(`\nConcluido! ${ordem - 1} condutores criados com sucesso.`);
  console.log('\nResumo:');
  console.log('  - 10 condutores com dados completos');
  console.log('  - 8 fichas ACTIVAS, 2 fichas INACTIVAS');
  console.log('  - Tipos: 7 Motociclos, 2 Triciclos, 1 Quadriciclo');
  console.log('  - Todos com QR Code e foto placeholder');
  console.log('\nPara testar no site:');
  console.log('  Publico -> Consultar -> pesquise por nome ou B.I.');
  console.log('  Admin   -> Login: admin / cpcmtqls2025');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
