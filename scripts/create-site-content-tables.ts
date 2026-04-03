import pg from 'pg'

// ============================================================
// C.P.C.M.T.Q.L.S - LABOCHECK
// Setup Script: Create site content tables via direct PostgreSQL
// Usage: bun scripts/create-site-content-tables.ts
//
// NOTE: This script requires direct PostgreSQL connectivity.
// If this environment does not have IPv6, you must execute the SQL
// manually in the Supabase Dashboard > SQL Editor.
// The SQL is available in: scripts/site-content-setup.sql
// ============================================================

const DATABASE_URL = 'postgresql://postgres.bxfblegcbvdpshwhdxlt:946788879Gh!!@db.bxfblegcbvdpshwhdxlt.supabase.co:5432/postgres'

const SQL_STATEMENTS = `
-- 1. Tabela de Noticias
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

-- 2. Tabela de Secoes de Cards
CREATE TABLE IF NOT EXISTS public.cards_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  subtitulo TEXT DEFAULT '',
  imagem_fundo_base64 TEXT DEFAULT '',
  imagem_fundo_tipo TEXT DEFAULT 'image/png',
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Itens de Cards
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

-- 4. Indices para performance
CREATE INDEX IF NOT EXISTS idx_noticias_activa ON public.noticias(activa);
CREATE INDEX IF NOT EXISTS idx_noticias_ordem ON public.noticias(ordem);
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON public.noticias(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_cards_item_activo ON public.cards_item(activo);
CREATE INDEX IF NOT EXISTS idx_cards_item_ordem ON public.cards_item(ordem);

-- 5. RLS (Row Level Security) - mesmo padrao do supabase-setup.sql
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards_item ENABLE ROW LEVEL SECURITY;

-- Politicas permissivas (a app gere a autenticacao)
CREATE POLICY "full_access_noticias" ON public.noticias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards_section" ON public.cards_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards_item" ON public.cards_item FOR ALL USING (true) WITH CHECK (true);
`

async function main() {
  console.log('==========================================')
  console.log('CPCMTQLS - Criacao de Tabelas via PostgreSQL')
  console.log('==========================================')
  console.log()

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('[OK] Ligado ao PostgreSQL Supabase')
    console.log()

    // Execute each statement separately for better error reporting
    const statements = SQL_STATEMENTS
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    let successCount = 0
    for (const stmt of statements) {
      try {
        await client.query(stmt)
        // Extract a brief label from the statement
        const label = stmt.match(/CREATE\s+(TABLE|INDEX|POLICY|UNIQUE)?\s*(?:IF NOT EXISTS)?\s*public\.(\w+)/i)?.[2]
          || stmt.match(/ALTER TABLE\s+public\.(\w+)/i)?.[1]
          || '(unknown)'
        console.log(`  [OK] ${label}`)
        successCount++
      } catch (err: any) {
        const label = stmt.match(/CREATE\s+(TABLE|INDEX|POLICY|UNIQUE)?\s*(?:IF NOT EXISTS)?\s*public\.(\w+)/i)?.[2]
          || stmt.match(/ALTER TABLE\s+public\.(\w+)/i)?.[1]
          || '(statement)'
        console.log(`  [WARN] ${label}: ${err.message}`)
      }
    }

    console.log()
    console.log(`Concluido! ${successCount}/${statements.length} operacoes com sucesso.`)

    // Verify tables exist
    console.log()
    console.log('A verificar tabelas criadas...')
    const tables = ['noticias', 'cards_section', 'cards_item']
    for (const table of tables) {
      const result = await client.query(
        `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)`,
        [table]
      )
      const exists = result.rows[0].exists
      console.log(`  ${exists ? '[OK]' : '[FAIL]'} ${table} ${exists ? 'existe' : 'NAO existe'}`)
    }

  } catch (err: any) {
    console.error('[ERRO FATAL]', err.message)
    console.error()
    console.error('Se o erro for de conectividade (IPv6), execute manualmente o SQL em:')
    console.error('  scripts/site-content-setup.sql')
    console.error('via Supabase Dashboard > SQL Editor')
    process.exit(1)
  } finally {
    await client.end()
    console.log()
    console.log('Ligacao encerrada.')
  }
}

main()
