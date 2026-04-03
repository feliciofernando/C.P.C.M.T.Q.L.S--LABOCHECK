import { NextResponse } from 'next/server';

// GET /api/setup-slides - Create slides table
// One-time setup route to create the slides table in Supabase
export async function GET() {
  try {
    const { Client } = await import('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // Create slides table with descricao column
    await client.query(`
      CREATE TABLE IF NOT EXISTS slides (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    `);

    await client.query('ALTER TABLE slides ENABLE ROW LEVEL SECURITY');
    await client.query(`DO $$ BEGIN
      CREATE POLICY full_access ON slides FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$`);

    // Add descricao column if table exists but missing column
    try {
      await client.query("ALTER TABLE slides ADD COLUMN IF NOT EXISTS descricao TEXT NOT NULL DEFAULT '';");
    } catch {
      // Column might already exist
    }

    // Insert sample data if empty
    const count = await client.query('SELECT COUNT(*) FROM slides');
    if (count.rows[0].count === '0') {
      await client.query(`
        INSERT INTO slides (titulo, subtitulo, descricao, texto_botao, link_botao, activo, ordem, tempo_transicao) VALUES
          ('C.P.C.M.T.Q.L.S', 'Conselho Provincial', 'Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul', 'Saiba Mais', '#servicos', true, 1, 6000),
          ('Registo de Condutores', 'Condutas Legalizadas', 'Inscreva-se agora e faca parte da nossa comunidade', 'Inscreva-se', '#consultar', true, 2, 5000),
          ('Formacao Profissional', 'Capacitacao', 'Capacitacao continua para condutores profissionais', 'Ver Cursos', '#servicos', true, 3, 5000),
          ('Seguranca no Transito', 'Decreto Presidencial No 245/15', 'Comprometidos com a seguranca rodoviaria', 'Consultar', '#contactos', true, 4, 5000),
          ('Licencas Profissionais', 'Cartao PVC com QR Code', 'Emita a sua licenca profissional com verificacao instantanea', 'Solicitar', '#consultar', true, 5, 5000),
          ('Servicos ao Condutor', 'Apoio Completo', 'Apoio e acompanhamento completo ao condutor', 'Contactar', '#contactos', true, 6, 5000);
      `);
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Tabela slides criada com sucesso.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar tabela';
    return NextResponse.json({
      success: false,
      error: message,
      hint: 'Se o erro for de conexao IPv6, execute hero-slides-setup.sql manualmente no Supabase Dashboard > SQL Editor.',
    }, { status: 500 });
  }
}
