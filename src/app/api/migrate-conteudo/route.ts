import { NextResponse } from 'next/server';

// GET /api/migrate-conteudo - Add conteudo column to servicos and cards tables
// This is a one-time setup route that adds the conteudo column if it doesn't exist
export async function GET() {
  try {
    const { Client } = await import('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log('Connected to database for conteudo migration');

    // Add conteudo column to servicos table
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'servicos' AND column_name = 'conteudo'
        ) THEN
          ALTER TABLE servicos ADD COLUMN conteudo TEXT DEFAULT '';
        END IF;
      END $$;
    `);

    // Add conteudo column to cards table
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'cards' AND column_name = 'conteudo'
        ) THEN
          ALTER TABLE cards ADD COLUMN conteudo TEXT DEFAULT '';
        END IF;
      END $$;
    `);

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Coluna "conteudo" adicionada com sucesso às tabelas servicos e cards.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao adicionar coluna conteudo';
    return NextResponse.json({
      success: false,
      error: message,
      hint: 'Se o erro for de conexao IPv6, execute add-conteudo-column.sql manualmente no Supabase Dashboard > SQL Editor.',
    }, { status: 500 });
  }
}
