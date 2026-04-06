import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function seedAlertas() {
  console.log('A preparar dados de alertas para teste...');

  // Get existing condutores
  const condutores = await db.condutor.findMany({
    orderBy: { numeroOrdem: 'asc' },
    select: { id: true, numeroOrdem: true, nomeCompleto: true, numeroBI: true, telefone1: true, status: true },
  });

  if (condutores.length === 0) {
    console.log('ERRO: Nenhum condutor encontrado. Execute primeiro o seed-data.ts');
    return;
  }

  console.log(`Encontrados ${condutores.length} condutores.`);

  const now = new Date();

  // Update validity dates for different scenarios
  // Condutor 1 (Garcia) - expires in 5 days (high priority)
  const c1 = condutores[0];
  await db.condutor.update({
    where: { id: c1.id },
    data: { validadeLicenca: formatDate(addDays(now, 5)) },
  });
  console.log(`  [${c1.numeroOrdem}] ${c1.nomeCompleto} - validade alterada para 5 dias`);

  // Condutor 2 (Ana Maria) - expires in 15 days (medium priority)
  const c2 = condutores[1];
  await db.condutor.update({
    where: { id: c2.id },
    data: { validadeLicenca: formatDate(addDays(now, 15)) },
  });
  console.log(`  [${c2.numeroOrdem}] ${c2.nomeCompleto} - validade alterada para 15 dias`);

  // Condutor 3 (Joao Pedro) - expires in 28 days (medium priority)
  const c3 = condutores[2];
  await db.condutor.update({
    where: { id: c3.id },
    data: { validadeLicenca: formatDate(addDays(now, 28)) },
  });
  console.log(`  [${c3.numeroOrdem}] ${c3.nomeCompleto} - validade alterada para 28 dias`);

  // Condutor 4 (Marta) - already expired 10 days ago (high priority)
  const c4 = condutores[3];
  await db.condutor.update({
    where: { id: c4.id },
    data: { validadeLicenca: formatDate(addDays(now, -10)) },
  });
  console.log(`  [${c4.numeroOrdem}] ${c4.nomeCompleto} - validade alterada para EXPIRADA (10 dias atras)`);

  // Condutor 7 (Fernando) - already expired 45 days ago (high priority)
  const c7 = condutores[6];
  await db.condutor.update({
    where: { id: c7.id },
    data: { validadeLicenca: formatDate(addDays(now, -45)) },
  });
  console.log(`  [${c7.numeroOrdem}] ${c7.nomeCompleto} - validade alterada para EXPIRADA (45 dias atras)`);

  // Condutor 9 (Luis) - expires in 2 days (high priority)
  const c9 = condutores[8];
  await db.condutor.update({
    where: { id: c9.id },
    data: { validadeLicenca: formatDate(addDays(now, 2)) },
  });
  console.log(`  [${c9.numeroOrdem}] ${c9.nomeCompleto} - validade alterada para 2 dias`);

  // Clear existing alerts
  await db.alerta.deleteMany();
  console.log('\nAlertas anteriores removidos.');

  // Create sample alerts with various states
  const alertasData = [
    {
      condutorId: c1.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, 5)),
      mensagem: `A Licenca Profissional de Condutor de ${c1.nomeCompleto} (No ${c1.numeroOrdem}) expira em 5 dias. Data de validade: ${formatDate(addDays(now, 5))}. Contacto: ${c1.telefone1}.`,
      prioridade: 'ALTA',
      estado: 'PENDENTE',
      dataCriacao: addDays(now, -25),
      dataLeitura: null,
      dataResolucao: null,
      resolucao: '',
    },
    {
      condutorId: c2.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, 15)),
      mensagem: `A Licenca Profissional de Condutor de ${c2.nomeCompleto} (No ${c2.numeroOrdem}) expira em 15 dias. Data de validade: ${formatDate(addDays(now, 15))}. Contacto: ${c2.telefone1}.`,
      prioridade: 'MEDIA',
      estado: 'PENDENTE',
      dataCriacao: addDays(now, -15),
      dataLeitura: null,
      dataResolucao: null,
      resolucao: '',
    },
    {
      condutorId: c3.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, 28)),
      mensagem: `A Licenca Profissional de Condutor de ${c3.nomeCompleto} (No ${c3.numeroOrdem}) expira em 28 dias. Data de validade: ${formatDate(addDays(now, 28))}. Contacto: ${c3.telefone1}.`,
      prioridade: 'MEDIA',
      estado: 'LIDA',
      dataCriacao: addDays(now, -2),
      dataLeitura: addDays(now, -1),
      dataResolucao: null,
      resolucao: '',
    },
    {
      condutorId: c4.id,
      tipo: 'EXPIRADA',
      dataValidade: formatDate(addDays(now, -10)),
      mensagem: `A Licenca Profissional de Condutor de ${c4.nomeCompleto} (No ${c4.numeroOrdem}) expirou ha 10 dias. Data de validade: ${formatDate(addDays(now, -10))}. Contacto: ${c4.telefone1}.`,
      prioridade: 'ALTA',
      estado: 'PENDENTE',
      dataCriacao: addDays(now, -40),
      dataLeitura: null,
      dataResolucao: null,
      resolucao: '',
    },
    {
      condutorId: c7.id,
      tipo: 'EXPIRADA',
      dataValidade: formatDate(addDays(now, -45)),
      mensagem: `A Licenca Profissional de Condutor de ${c7.nomeCompleto} (No ${c7.numeroOrdem}) expirou ha 45 dias. Data de validade: ${formatDate(addDays(now, -45))}. Contacto: ${c7.telefone1}.`,
      prioridade: 'ALTA',
      estado: 'LIDA',
      dataCriacao: addDays(now, -75),
      dataLeitura: addDays(now, -60),
      dataResolucao: null,
      resolucao: '',
    },
    {
      condutorId: c9.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, 2)),
      mensagem: `A Licenca Profissional de Condutor de ${c9.nomeCompleto} (No ${c9.numeroOrdem}) expira em 2 dias. Data de validade: ${formatDate(addDays(now, 2))}. Contacto: ${c9.telefone1}.`,
      prioridade: 'ALTA',
      estado: 'PENDENTE',
      dataCriacao: addDays(now, -28),
      dataLeitura: null,
      dataResolucao: null,
      resolucao: '',
    },
    // Historical resolved alerts (from previous months)
    {
      condutorId: c4.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, -40)),
      mensagem: `[HISTORICO] A Licenca Profissional de Condutor de ${c4.nomeCompleto} (No ${c4.numeroOrdem}) iria expirar em 30 dias. Data de validade: ${formatDate(addDays(now, -40))}. Contacto: ${c4.telefone1}.`,
      prioridade: 'MEDIA',
      estado: 'RESOLVIDA',
      dataCriacao: addDays(now, -70),
      dataLeitura: addDays(now, -65),
      dataResolucao: addDays(now, -40),
      resolucao: 'Condutor contactado por telefone. Renovacao agendada.',
    },
    {
      condutorId: c7.id,
      tipo: 'EXPIRANDO_1MES',
      dataValidade: formatDate(addDays(now, -75)),
      mensagem: `[HISTORICO] A Licenca Profissional de Condutor de ${c7.nomeCompleto} (No ${c7.numeroOrdem}) iria expirar em 30 dias. Data de validade: ${formatDate(addDays(now, -75))}. Contacto: ${c7.telefone1}.`,
      prioridade: 'MEDIA',
      estado: 'RESOLVIDA',
      dataCriacao: addDays(now, -105),
      dataLeitura: addDays(now, -100),
      dataResolucao: addDays(now, -80),
      resolucao: 'Licenca renovada com sucesso. Novo cartao PVC emitido.',
    },
  ];

  for (const alerta of alertasData) {
    await db.alerta.create({ data: alerta });
    const estadoLabel = alerta.estado === 'RESOLVIDA' ? 'RESOLVIDA' : alerta.estado === 'LIDA' ? 'LIDA' : 'PENDENTE';
    console.log(`  Alerta criado: ${alerta.tipo} - ${estadoLabel}`);
  }

  console.log(`\nConcluido! ${alertasData.length} alertas criados.`);
  console.log('\nResumo dos Alertas:');
  console.log('  - 4 PENDENTES (3 a expirar em breve, 1 expirada)');
  console.log('  - 2 LIDAS (1 a expirar, 1 expirada)');
  console.log('  - 2 RESOLVIDAS (historico)');
  console.log('\nDatas de validade alteradas:');
  console.log('  - Garcia Manuel Bamba: 5 dias');
  console.log('  - Ana Maria Tavares: 15 dias');
  console.log('  - Joao Pedro Francisco: 28 dias');
  console.log('  - Marta Conceicao Lopes: EXPIRADA (10 dias)');
  console.log('  - Fernando Antonio Silva: EXPIRADA (45 dias)');
  console.log('  - Luis Manuel Quimba: 2 dias');
}

seedAlertas()
  .catch(console.error)
  .finally(() => db.$disconnect());
