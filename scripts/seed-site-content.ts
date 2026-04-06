import { createClient } from '@supabase/supabase-js'
import pg from 'pg'

// ============================================================
// C.P.C.M.T.Q.L.S - LABOCHECK
// Seed Script: Site Content (noticias, cards_section, cards_item)
// Usage: bun scripts/seed-site-content.ts
//
// This script will:
// 1. Try to create the tables via direct PostgreSQL connection
// 2. If that fails (e.g. no IPv6), seed only if tables already exist
// 3. If tables don't exist and can't be created, report what's needed
// ============================================================

const SUPABASE_URL = 'https://bxfblegcbvdpshwhdxlt.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZmJsZWdjYnZkcHNod2hkeGx0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA3NDQxMiwiZXhwIjoyMDkwNjUwNDEyfQ.bkJsEX-Z27UT-2b6HllunV_v_uc-usk8XVnM64uKR7w'
const DATABASE_URL = 'postgresql://postgres.bxfblegcbvdpshwhdxlt:946788879Gh!!@db.bxfblegcbvdpshwhdxlt.supabase.co:5432/postgres'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ============================================================
// SQL for table creation
// ============================================================

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS public.noticias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  conteudo TEXT DEFAULT '',
  resumo TEXT DEFAULT '',
  imagem_url TEXT DEFAULT '',
  autor TEXT DEFAULT '',
  activa BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_publicacao TIMESTAMPTZ DEFAULT now(),
  data_criacao TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cards_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  subtitulo TEXT DEFAULT '',
  imagem_fundo_base64 TEXT DEFAULT '',
  imagem_fundo_tipo TEXT DEFAULT 'image/png',
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cards_item (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  icone TEXT DEFAULT '',
  link TEXT DEFAULT '',
  ordem INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noticias_activa ON public.noticias(activa);
CREATE INDEX IF NOT EXISTS idx_noticias_ordem ON public.noticias(ordem);
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON public.noticias(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_cards_item_activo ON public.cards_item(activo);
CREATE INDEX IF NOT EXISTS idx_cards_item_ordem ON public.cards_item(ordem);

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards_item ENABLE ROW LEVEL SECURITY;

CREATE POLICY "full_access_noticias" ON public.noticias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards_section" ON public.cards_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards_item" ON public.cards_item FOR ALL USING (true) WITH CHECK (true);
`

// ============================================================
// Sample Data
// ============================================================

const cardsItems = [
  {
    titulo: 'Mensagem do Presidente',
    descricao: 'Leia a mensagem do nosso Presidente',
    icone: 'MessageSquare',
    link: '#mensagem-presidente',
    ordem: 1,
    activo: true,
  },
  {
    titulo: 'Eventos',
    descricao: 'Confira nossos proximos eventos',
    icone: 'Calendar',
    link: '#eventos',
    ordem: 2,
    activo: true,
  },
  {
    titulo: 'Legislacao',
    descricao: 'Acesse documentos legais importantes',
    icone: 'Scale',
    link: '#legislacao',
    ordem: 3,
    activo: true,
  },
  {
    titulo: 'Perguntas Frequentes',
    descricao: 'Encontre respostas para duvidas comuns',
    icone: 'HelpCircle',
    link: '#faq',
    ordem: 4,
    activo: true,
  },
  {
    titulo: 'Documentos',
    descricao: 'Acesse documentos importantes do Conselho',
    icone: 'FileText',
    link: '#documentos',
    ordem: 5,
    activo: true,
  },
  {
    titulo: 'Galeria de Diretores',
    descricao: 'Conheca os lideres da nossa historia',
    icone: 'Users',
    link: '#diretores',
    ordem: 6,
    activo: true,
  },
  {
    titulo: 'Sobre o Conselho',
    descricao: 'Saiba mais sobre a nossa instituicao',
    icone: 'Building2',
    link: '#sobre',
    ordem: 7,
    activo: true,
  },
  {
    titulo: 'Noticias',
    descricao: 'Fique por dentro das ultimas novidades',
    icone: 'Newspaper',
    link: '#noticias',
    ordem: 8,
    activo: true,
  },
]

const noticias = [
  {
    titulo: 'Inscricoes Abertas para Novos Condutores 2025',
    conteudo: `O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul (CPCMTQLS) informa que estao abertas as inscricoes para novos condutores no ano de 2025.\n\nTodos os interessados em obter a Licenca Profissional de Condutor deverao dirigir-se a sede do Conselho na cidade de Saurimo, munidos dos seguintes documentos:\n\n- Bilhete de Identidade original e copia\n- Carta de Conducao categoria A\n- Atestado medico actualizado\n- Duas fotografias tipo passe\n- Comprovativo de residencia\n\nAs inscricoes decorrem de segunda a sexta-feira, das 08h00 as 16h00. Para mais informacoes, contacte o numero +244 924-XXX-XXX.\n\nVagas limitadas! Inscreva-se ja e faca parte da nossa familia de condutores profissionais.`,
    resumo: 'O CPCMTQLS abre inscricoes para novos condutores de motociclos, triciclos e quadriciclos na provincia da Lunda Sul para o ano de 2025.',
    imagem_url: '',
    autor: 'Administracao CPCMTQLS',
    activa: true,
    ordem: 1,
    data_publicacao: new Date().toISOString(),
  },
  {
    titulo: 'Campanha de Seguranca Rodoviaria na Lunda Sul',
    conteudo: `O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul, em parceria com o Governo Provincial e a Policia Nacional, lancou uma campanha abrangente de seguranca rodoviaria.\n\nA campanha "Conducao Segura, Vida Protegida" visa sensibilizar todos os condutores de motociclos, triciclos e quadriciclos sobre a importancia do uso de equipamentos de seguranca, nomeadamente:\n\n- Capacetes homologados\n- Colete refletor\n- Luvas de protecao\n- Calcado adequado\n\nA campanha inclui accoes de formacao em varios municipios da provincia, distribuicao de materiais informativos e operacoes de fiscalizacao conjunta com as forcas de ordem.\n\nRecordamos que a seguranca rodoviaria e responsabilidade de todos. Proteja-se e proteja os outros!`,
    resumo: 'Campanha conjunta de seguranca rodoviaria para condutores de motociclos, triciclos e quadriciclos na provincia da Lunda Sul.',
    imagem_url: '',
    autor: 'Departamento de Seguranca',
    activa: true,
    ordem: 2,
    data_publicacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    titulo: 'Novo Regulamento de Licencas Profissionais',
    conteudo: `O CPCMTQLS comunica a todos os condutores que entrou em vigor o novo regulamento para a emissao e renovacao de Licencas Profissionais de Condutor.\n\nPrincipais alteracoes:\n\n1. **Renovacao antecipada**: As licencas devem ser renovadas com pelo menos 30 dias de antecedencia antes da data de validade.\n\n2. **Formacao obrigatoria**: Todos os condutores devem apresentar comprovativo de participacao em accoes de formacao continua, com carga horaria minima de 20 horas anuais.\n\n3. **Inspeccao veicular**: Exigencia de inspeccao tecnica periodica do veiculo para renovacao da licenca.\n\n4. **Categorias actualizadas**: Novas categorias para veiculos electricos e hibridos.\n\n5. **Taxas actualizadas**: Novos valores para emissao e renovacao de licencas, conforme tabela aprovada pelo Conselho Provincial.\n\nPara esclarecimentos adicionais, dirija-se a sede do Conselho ou contacte-nos pelos canais oficiais.`,
    resumo: 'Entrou em vigor o novo regulamento para emissao e renovacao de Licencas Profissionais de Condutor com novas exigencias e procedimentos actualizados.',
    imagem_url: '',
    autor: 'Conselho Directivo',
    activa: true,
    ordem: 3,
    data_publicacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    titulo: 'Formacao em Primeiros Socorros para Condutores',
    conteudo: `O CPCMTQLS, em colaboracao com a Direccao Provincial de Saude, vai realizar uma accao de formacao em Primeiros Socorros destinada a condutores de motociclos, triciclos e quadriciclos da provincia da Lunda Sul.\n\n**Detalhes da Formacao:**\n\n- **Data**: A confirmar (previsto para o proximo mes)\n- **Local**: Sede do CPCMTQLS, Saurimo\n- **Duracao**: 3 dias (16 horas)\n- **Vagas**: 50 participantes\n- **Certificado**: Aprovado pelo Ministerio da Saude\n\n**Conteudos Programaticos:**\n\n1. Avaliacao inicial da vitima\n2. Suporte basico de vida (SBV)\n3. Controlo de hemorragias\n4. Imobilizacao de fracturas\n5. Queimaduras e emergencias termicas\n6. Transporte de vitimas\n7. Primeiros socorros em acidentes rodoviarios\n\nAs inscricoes sao gratuitas e devem ser feitas na sede do Conselho. Preferencia para condutores com licenca activa.\n\nEsta formacao e fundamental para que os condutores possam actuar de forma eficaz em caso de acidentes, podendo salvar vidas enquanto aguardam o socorro medico especializado.`,
    resumo: 'Formacao gratuita em primeiros socorros para condutores, em parceria com a Direccao Provincial de Saude da Lunda Sul.',
    imagem_url: '',
    autor: 'Departamento de Formacao',
    activa: true,
    ordem: 4,
    data_publicacao: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const cardsSection = {
  titulo: 'Explore Nosso Conselho',
  subtitulo: 'Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul',
  imagem_fundo_base64: '',
  imagem_fundo_tipo: 'image/png',
}

// ============================================================
// Helper Functions
// ============================================================

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase.from(tableName).select('id').limit(1)
    // PostgREST error codes for "table not found"
    if (error && (
      error.code === 'PGRST205' || // "Could not find the table ... in the schema cache"
      error.code === '42P01' || // "relation does not exist"
      error.message.includes('does not exist') ||
      error.message.includes('schema cache')
    )) {
      return false
    }
    // If no error at all, table exists
    return !error
  } catch {
    return false
  }
}

async function tryCreateTablesViaPg(): Promise<boolean> {
  console.log('  A tentar criar tabelas via PostgreSQL directo...')
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })

  try {
    await client.connect()
    console.log('  [OK] Ligado ao PostgreSQL')

    const statements = CREATE_TABLES_SQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      try {
        await client.query(stmt)
      } catch (err: any) {
        // Ignore "already exists" errors for policies
        if (!err.message.includes('already exists')) {
          console.log(`  [WARN] ${err.message.substring(0, 80)}`)
        }
      }
    }

    await client.end()
    console.log('  [OK] Tabelas criadas via PostgreSQL')
    return true
  } catch (err: any) {
    try { await client.end() } catch {}
    console.log(`  [INFO] PostgreSQL nao disponivel: ${err.message.substring(0, 60)}`)
    return false
  }
}

async function seedCardsSection(): Promise<boolean> {
  const exists = await checkTableExists('cards_section')
  if (!exists) {
    console.log('  [SKIP] Tabela "cards_section" nao existe.')
    return false
  }

  const { error: deleteError } = await supabase.from('cards_section').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.log(`  [ERROR] Falha ao limpar cards_section: ${deleteError.message}`)
    return false
  }

  const { data, error } = await supabase.from('cards_section').insert({
    ...cardsSection,
    data_atualizacao: new Date().toISOString(),
  }).select()

  if (error) {
    console.log(`  [ERROR] Falha ao inserir cards_section: ${error.message}`)
    return false
  }

  console.log(`  [OK] cards_section criado: "${cardsSection.titulo}"`)
  return true
}

async function seedCardsItems(): Promise<boolean> {
  const exists = await checkTableExists('cards_item')
  if (!exists) {
    console.log('  [SKIP] Tabela "cards_item" nao existe.')
    return false
  }

  const { error: deleteError } = await supabase.from('cards_item').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.log(`  [ERROR] Falha ao limpar cards_item: ${deleteError.message}`)
    return false
  }

  const insertData = cardsItems.map((item) => ({
    ...item,
    data_criacao: new Date().toISOString(),
  }))

  const { data, error } = await supabase.from('cards_item').insert(insertData).select()

  if (error) {
    console.log(`  [ERROR] Falha ao inserir cards_item: ${error.message}`)
    return false
  }

  console.log(`  [OK] ${data?.length ?? 0} cards_item criados:`)
  cardsItems.forEach((item, i) => {
    console.log(`       ${i + 1}. ${item.titulo} (${item.icone})`)
  })
  return true
}

async function seedNoticias(): Promise<boolean> {
  const exists = await checkTableExists('noticias')
  if (!exists) {
    console.log('  [SKIP] Tabela "noticias" nao existe.')
    return false
  }

  const { error: deleteError } = await supabase.from('noticias').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.log(`  [ERROR] Falha ao limpar noticias: ${deleteError.message}`)
    return false
  }

  const insertData = noticias.map((noticia) => ({
    ...noticia,
    data_criacao: new Date().toISOString(),
  }))

  const { data, error } = await supabase.from('noticias').insert(insertData).select()

  if (error) {
    console.log(`  [ERROR] Falha ao inserir noticias: ${error.message}`)
    return false
  }

  console.log(`  [OK] ${data?.length ?? 0} noticias criadas:`)
  noticias.forEach((noticia, i) => {
    console.log(`       ${i + 1}. "${noticia.titulo}"`)
  })
  return true
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('==========================================')
  console.log('CPCMTQLS - Seed de Conteudo do Site')
  console.log('==========================================')
  console.log()
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log(`Timestamp: ${new Date().toISOString()}`)
  console.log()

  // Step 0: Check if tables exist, try to create if not
  const tableNames = ['noticias', 'cards_section', 'cards_item']
  const existingTables: string[] = []
  const missingTables: string[] = []

  for (const t of tableNames) {
    if (await checkTableExists(t)) {
      existingTables.push(t)
    } else {
      missingTables.push(t)
    }
  }

  console.log(`[INFO] Tabelas existentes: ${existingTables.length > 0 ? existingTables.join(', ') : 'nenhuma'}`)
  console.log(`[INFO] Tabelas em falta: ${missingTables.length > 0 ? missingTables.join(', ') : 'nenhuma'}`)
  console.log()

  // Try to create missing tables via direct PostgreSQL
  if (missingTables.length > 0) {
    console.log('[0] A tentar criar tabelas em falta...')
    const created = await tryCreateTablesViaPg()
    if (!created) {
      console.log()
      console.log('  AVISO: Nao foi possivel criar as tabelas automaticamente.')
      console.log('  Execute manualmente o SQL em scripts/site-content-setup.sql')
      console.log('  no Supabase Dashboard > SQL Editor.')
      console.log()
    } else {
      console.log()
      // Re-check tables after creation
      for (const t of missingTables) {
        if (await checkTableExists(t)) {
          existingTables.push(t)
        }
      }
    }
  }

  const results: Record<string, boolean> = {}

  console.log('[1/3] A semear cards_section...')
  results['cards_section'] = await seedCardsSection()
  console.log()

  console.log('[2/3] A semear cards_item...')
  results['cards_item'] = await seedCardsItems()
  console.log()

  console.log('[3/3] A semear noticias...')
  results['noticias'] = await seedNoticias()
  console.log()

  // Summary
  console.log('==========================================')
  console.log('RESUMO FINAL')
  console.log('==========================================')

  const seeded = Object.entries(results).filter(([, v]) => v).map(([k]) => k)
  const failed = Object.entries(results).filter(([, v]) => !v).map(([k]) => k)

  if (seeded.length > 0) {
    console.log(`\nTabelas semeadas com sucesso: ${seeded.join(', ')}`)
    console.log('\nDados inseridos:')
    if (seeded.includes('cards_section')) {
      console.log('  - 1 cards_section (Explore Nosso Conselho)')
    }
    if (seeded.includes('cards_item')) {
      console.log('  - 8 cards_item (Mensagem, Eventos, Legislacao, FAQ, Docs, Diretores, Sobre, Noticias)')
    }
    if (seeded.includes('noticias')) {
      console.log('  - 4 noticias (Inscricoes 2025, Seguranca Rodoviaria, Regulamento, Primeiros Socorros)')
    }
  }

  if (failed.length > 0) {
    console.log(`\nTabelas que NAO foram semeadas: ${failed.join(', ')}`)
    console.log('\nPara resolver, execute o SQL em scripts/site-content-setup.sql')
    console.log('no Supabase Dashboard > SQL Editor, depois reexecute este script.')
  }

  if (failed.length === 0) {
    console.log('\nTodas as operacoes concluidas com sucesso!')
  }
}

main().catch((err) => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
