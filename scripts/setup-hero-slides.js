// ============================================================
// C.P.C.M.T.Q.L.S - LABOCHECK
// Setup Script: Create slides table via direct PostgreSQL
// Usage: cd /home/z/my-project/C.P.C.M.T.Q.L.S--LABOCHECK && node scripts/setup-hero-slides.js
//
// NOTE: If IPv6 is not available, execute the SQL manually in
// Supabase Dashboard > SQL Editor using scripts/hero-slides-setup.sql
// ============================================================

/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');

const DATABASE_URL = 'postgresql://postgres.bxfblegcbvdpshwhdxlt:946788879Gh!!@db.bxfblegcbvdpshwhdxlt.supabase.co:5432/postgres';

const SQL_STATEMENTS = `
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL DEFAULT '',
  subtitulo TEXT NOT NULL DEFAULT '',
  descricao TEXT NOT NULL DEFAULT '',
  texto_botao TEXT DEFAULT 'Saber Mais',
  link_botao TEXT DEFAULT '#',
  imagem_base64 TEXT DEFAULT '',
  imagem_tipo TEXT DEFAULT 'image/jpeg',
  activo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  tempo_transicao INTEGER DEFAULT 5000,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY full_access ON slides FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
`;

const INSERT_SLIDES = `
INSERT INTO slides (titulo, subtitulo, descricao, texto_botao, link_botao, activo, ordem, tempo_transicao)
SELECT * FROM (VALUES
  ('C.P.C.M.T.Q.L.S', 'Conselho Provincial', 'Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul', 'Saiba Mais', '#servicos', true, 1, 6000),
  ('Registo de Condutores', 'Condutas Legalizadas', 'Inscreva-se agora e faca parte da nossa comunidade', 'Inscreva-se', '#consultar', true, 2, 5000),
  ('Formacao Profissional', 'Capacitacao', 'Capacitacao continua para condutores profissionais', 'Ver Cursos', '#servicos', true, 3, 5000),
  ('Seguranca no Transito', 'Decreto Presidencial No 245/15', 'Comprometidos com a seguranca rodoviaria', 'Consultar', '#contactos', true, 4, 5000),
  ('Licencas Profissionais', 'Cartao PVC com QR Code', 'Emita a sua licenca profissional com verificacao instantanea', 'Solicitar', '#consultar', true, 5, 5000),
  ('Servicos ao Condutor', 'Apoio Completo', 'Apoio e acompanhamento completo ao condutor', 'Contactar', '#contactos', true, 6, 5000)
) AS t(titulo, subtitulo, descricao, texto_botao, link_botao, activo, ordem, tempo_transicao)
WHERE NOT EXISTS (SELECT 1 FROM slides LIMIT 1);
`;

async function main() {
  console.log('==========================================');
  console.log('CPCMTQLS - Criacao da tabela slides');
  console.log('==========================================');
  console.log();

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('[OK] Ligado ao PostgreSQL Supabase');

    // Create table
    await client.query(SQL_STATEMENTS);
    console.log('[OK] Tabela slides criada/verificada');

    // Insert sample data
    const result = await client.query('SELECT COUNT(*) FROM slides');
    if (result.rows[0].count === '0') {
      await client.query(INSERT_SLIDES);
      console.log('[OK] 6 slides de exemplo inseridos');
    } else {
      console.log(`[OK] Tabela ja possui ${result.rows[0].count} slides`);

      // Add descricao column if missing
      try {
        await client.query("ALTER TABLE slides ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '';");
        console.log('[OK] Coluna descricao verificada');
      } catch (e) {
        console.log('[WARN] Nao foi possivel verificar coluna descricao:', e.message);
      }
    }

    console.log();
    console.log('Concluido com sucesso!');
  } catch (err) {
    console.error('[ERRO]', err.message);
    console.error();
    console.error('Se o erro for de conexao (IPv6), execute manualmente:');
    console.error('  scripts/hero-slides-setup.sql');
    console.error('via Supabase Dashboard > SQL Editor');
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
