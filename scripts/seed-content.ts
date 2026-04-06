/**
 * Seed script for noticias and servicos tables.
 * Run: cd /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK && npx tsx scripts/seed-content.ts
 *
 * Prerequisites:
 * 1. Run content-setup.sql in Supabase Dashboard > SQL Editor
 * 2. Tables noticias and servicos must exist
 */

const SUPABASE_URL = 'https://bxfblegcbvdpshwhdxlt.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZmJsZWdjYnZkcHNod2hkeGx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA3NDQxMiwiZXhwIjoyMDkwNjUwNDEyfQ.bkJsEX-Z27UT-2b6HllunV_v_uc-usk8XVnM64uKR7w';

const noticias = [
  {
    titulo: 'Inscricao Aberta para Novos Membros 2026',
    resumo: 'O C.P.C.M.T.Q.L.S abriu oficialmente o periodo de inscricao para novos membros para o ano de 2026. Todos os condutores de motociclos, triciclos e quadriciclos da provincia da Lunda Sul podem candidatar-se.',
    conteudo: 'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul (C.P.C.M.T.Q.L.S) tem a honra de anunciar a abertura oficial do periodo de inscricao para novos membros referente ao ano de 2026.\n\nEste periodo de inscricao destina-se a todos os condutores profissionais de motociclos, triciclos e quadriciclos que operam na provincia da Lunda Sul, independentemente do municipio de residencia. A campanha visa fortalecer a representatividade da classe e garantir melhores condicoes de trabalho para todos os associados.\n\nPara se inscrever, os candidatos devem dirigir-se a sede do C.P.C.M.T.Q.L.S, localizada no Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Emporio, e apresentar os seguintes documentos: Bilhete de Identidade, Carta de Conducao categoria A, documento do veiculo, seguro do veiculo e comprovativo de residencia.\n\nA inscricao confere varios beneficios, incluindo a emissao da Licenca Profissional em cartao PVC, acesso a formacoes profissionais, protecao juridica e representatividade junto das autoridades competentes. Nao perca esta oportunidade de fazer parte desta instituicao que luta pelos direitos dos condutores profissionais da Lunda Sul.',
    imagem_tipo: 'image/jpeg',
    activo: true,
    destaque: true,
    ordem: 1,
  },
  {
    titulo: 'Formacao em Seguranca Rodoviaria em Saurimo',
    resumo: 'Decorreu com sucesso a formacao em seguranca rodoviaria destinada aos condutores associados do CPCMTQLS. O evento contou com a participacao de mais de 50 condutores e especialistas do INAT.',
    conteudo: 'Nos dias 15 e 16 do corrente mes, o C.P.C.M.T.Q.L.S promoveu com grande sucesso uma formacao intensiva em seguranca rodoviaria, realizada nas instalacoes do Centro de Formacao Profissional de Saurimo.\n\nO evento contou com a participacao de mais de 50 condutores associados e teve como formadores especialistas do Instituto Nacional de Transito (INAT) e oficiais da Policia Nacional de Transito. Os temas abordados incluiram a nova legislacao de transito, normas de circulacao para motociclos, triciclos e quadriciclos, primeiros socorros em caso de acidentes, e a importancia do uso correcto do equipamento de seguranca.\n\nO coordenador provincial do CPCMTQLS destacou a importancia desta formacao para a reducao do indice de acidentes nas vias publicas da provincia. "A formacao continua dos nossos associados e fundamental para garantir que todos possam exercer a sua actividade de forma segura e profissional", afirmou.\n\nO C.P.C.M.T.Q.L.S vai continuar a promover acoes de formacao ao longo do ano, com o objectivo de capacitar cada vez mais condutores e contribuir para um transito mais seguro em toda a provincia da Lunda Sul.',
    imagem_tipo: 'image/jpeg',
    activo: true,
    destaque: false,
    ordem: 2,
  },
  {
    titulo: 'Nova Sede do CPCMTQLS em Construcao',
    resumo: 'As obras de construcao da nova sede do Conselho Provincial avancam a bom ritmo. O novo espaco vai dispor de salas de formacao, atendimento ao publico e escritorios administrativos.',
    conteudo: 'O C.P.C.M.T.Q.L.S tem o prazer de informar que as obras de construcao da sua nova sede estao a avancar de forma satisfatoria, devendo estar concluidas no primeiro semestre do proximo ano. A nova estrutura ficara localizada numa zona estrategica da cidade de Saurimo, facilitando o acesso de todos os condutores associados.\n\nO projecto de construcao prevê um espaco moderno e funcional que ira incluir: uma ampla sala de atendimento ao publico, salas de formacao equipadas com meios audiovisuais, escritorios administrativos, uma sala de reunioes, arquivo documental, e espacos de descanso para os associados. O edificio tera tambem acesso para pessoas com mobilidade reduzida e parque de estacionamento para motociclos e viaturas.\n\nO financiamento da obra esta a ser garantido atraves de cotas dos associados e do apoio de parceiros institucionais. A direccao do CPCMTQLS agradece a todos os que tem contribuido para a concretizacao deste sonho, que representa um marco importante na historia da instituicao.\n\nCom a nova sede, o CPCMTQLS podera oferecer um servico de melhor qualidade aos seus associados e a toda a comunidade de condutores profissionais da Lunda Sul, reforçando o seu papel como entidade representativa e formativa.',
    imagem_tipo: 'image/jpeg',
    activo: true,
    destaque: true,
    ordem: 3,
  },
  {
    titulo: 'Campanha de Sensibilizacao no Transito',
    resumo: 'O CPCMTQLS lancou uma campanha de sensibilizacao sobre o uso de equipamentos de seguranca. A campanha percorre os principais bairros e vias de Saurimo.',
    conteudo: 'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul lancou oficialmente uma campanha de sensibilizacao intitulada "Seguranca Primeiro", que tem como objectivo consciencializar os condutores e o publico em geral sobre a importancia do uso de equipamentos de seguranca no transito.\n\nA campanha, que teve inicio no Bairro Cassengue e se estendera aos principais bairros e vias de acesso da cidade de Saurimo, inclui a distribuicao de materiais informativos, palestras educativas, e demonstracoes praticas sobre o uso correcto do capacete e do colete refletor. Voluntarios do CPCMTQLS estao a percorrer as ruas da cidade, abordando condutores e pedestres.\n\nDe acordo com dados do INAT, a provincia da Lunda Sul regista anualmente centenas de acidentes de transito envolvendo motociclos, muitos dos quais poderiam ser evitados com o uso adequado de equipamentos de seguranca. A campanha pretende inverter esta tendencia, promovendo uma cultura de seguranca rodoviaria entre os condutores profissionais e amadores.\n\nO C.P.C.M.T.Q.L.S convida todos os condutores a aderirem a esta campanha e a tornarem-se multiplicadores das boas praticas de seguranca. Juntos, podemos fazer do transito na Lunda Sul um espaco mais seguro para todos.',
    imagem_tipo: 'image/jpeg',
    activo: true,
    destaque: false,
    ordem: 4,
  },
];

const servicos = [
  {
    titulo: 'Registo de Condutores',
    descricao: 'Registo completo de condutores profissionais de motociclos, triciclos e quadriciclos. Inclui emissao de ficha de registo, numero de membro e integracao na base de dados do CPCMTQLS.',
    icone: 'UserPlus',
    imagem_tipo: 'image/jpeg',
    ordem: 1,
    activo: true,
  },
  {
    titulo: 'Emissao de Licencas',
    descricao: 'Emissao de licencas profissionais em cartao PVC com QR Code de verificacao. A licenca atesta a condicao de condutor profissional e permite o exercicio legal da actividade.',
    icone: 'CreditCard',
    imagem_tipo: 'image/jpeg',
    ordem: 2,
    activo: true,
  },
  {
    titulo: 'Formacao Profissional',
    descricao: 'Cursos de formacao em seguranca rodoviaria, legislacao de transito, primeiros socorros e mecanica basica. Formacoes credenciadas pelo INAT e outras instituicoes reconhecidas.',
    icone: 'GraduationCap',
    imagem_tipo: 'image/jpeg',
    ordem: 3,
    activo: true,
  },
  {
    titulo: 'Consultoria Rodoviaria',
    descricao: 'Assessoria e consultoria em materia de legislacao rodoviaria, resolucao de conflitos e representacao institucional. Apoio juridico e administrativo aos condutores associados.',
    icone: 'Shield',
    imagem_tipo: 'image/jpeg',
    ordem: 4,
    activo: true,
  },
];

async function seed() {
  console.log('Seeding noticias and servicos...');

  // Seed noticias
  console.log('\n--- Noticias ---');
  for (const noticia of noticias) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/noticias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(noticia),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`  OK: ${noticia.titulo}`);
    } else {
      const err = await res.text();
      console.error(`  ERRO: ${noticia.titulo} - ${err}`);
    }
  }

  // Seed servicos
  console.log('\n--- Servicos ---');
  for (const servico of servicos) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/servicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(servico),
    });

    if (res.ok) {
      console.log(`  OK: ${servico.titulo}`);
    } else {
      const err = await res.text();
      console.error(`  ERRO: ${servico.titulo} - ${err}`);
    }
  }

  console.log('\nSeeding complete!');
}

seed().catch(console.error);
