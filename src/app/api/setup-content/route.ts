import { NextResponse } from 'next/server';

// GET /api/setup-content - Create noticias and servicos tables
// This is a one-time setup route that creates the required tables
export async function GET() {
  try {
    const { Client } = await import('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('Connected to database for setup');

    // Create noticias table
    await client.query(`
      CREATE TABLE IF NOT EXISTS noticias (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        titulo TEXT NOT NULL,
        resumo TEXT DEFAULT '',
        conteudo TEXT DEFAULT '',
        imagem_base64 TEXT DEFAULT '',
        imagem_tipo TEXT DEFAULT 'image/jpeg',
        data_publicacao TIMESTAMPTZ DEFAULT now(),
        activo BOOLEAN DEFAULT true,
        destaque BOOLEAN DEFAULT false,
        ordem INTEGER DEFAULT 0
      );
    `);

    await client.query('ALTER TABLE noticias ENABLE ROW LEVEL SECURITY');
    await client.query(`DO $$ BEGIN
      CREATE POLICY "full_access_noticias" ON noticias FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$`);

    // Create servicos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS servicos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT DEFAULT '',
        icone TEXT DEFAULT '',
        imagem_base64 TEXT DEFAULT '',
        imagem_tipo TEXT DEFAULT 'image/jpeg',
        ordem INTEGER DEFAULT 0,
        activo BOOLEAN DEFAULT true
      );
    `);

    await client.query('ALTER TABLE servicos ENABLE ROW LEVEL SECURITY');
    await client.query(`DO $$ BEGIN
      CREATE POLICY "full_access_servicos" ON servicos FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$`);

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_noticias_activo ON noticias(activo)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_noticias_ordem ON noticias(ordem)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_noticias_data ON noticias(data_publicacao)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_servicos_activo ON servicos(activo)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_servicos_ordem ON servicos(ordem)');

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Tabelas noticias e servicos criadas com sucesso. Execute o seed script para inserir dados iniciais.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar tabelas';
    return NextResponse.json({
      success: false,
      error: message,
      hint: 'Se o erro for de conexao IPv6, execute content-setup.sql manualmente no Supabase Dashboard > SQL Editor.',
    }, { status: 500 });
  }
}
