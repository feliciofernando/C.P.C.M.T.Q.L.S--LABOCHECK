import { NextResponse } from 'next/server';

// GET /api/setup-audit - Criar tabelas de auditoria
export async function GET() {
  try {
    const { Client } = await import('pg');

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
        admin_username TEXT NOT NULL DEFAULT '',
        admin_nome TEXT NOT NULL DEFAULT '',
        acao TEXT NOT NULL,
        categoria TEXT NOT NULL DEFAULT 'GERAL',
        detalhes TEXT DEFAULT '',
        ip_address TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_online_status (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
        admin_username TEXT NOT NULL DEFAULT '',
        admin_nome TEXT NOT NULL DEFAULT '',
        sessao_id TEXT DEFAULT '',
        ip_address TEXT DEFAULT '',
        last_heartbeat TIMESTAMPTZ DEFAULT now(),
        login_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    // Indices
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activity_log_admin ON admin_activity_log(admin_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activity_log_categoria ON admin_activity_log(categoria);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activity_log_acao ON admin_activity_log(acao);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activity_log_created ON admin_activity_log(created_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_online_status_heartbeat ON admin_online_status(last_heartbeat);`);

    // RLS
    await client.query('ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE admin_online_status ENABLE ROW LEVEL SECURITY;');
    await client.query(`DO $$ BEGIN CREATE POLICY "full_access_activity_log" ON admin_activity_log FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await client.query(`DO $$ BEGIN CREATE POLICY "full_access_online_status" ON admin_online_status FOR ALL USING (true) WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Tabelas de auditoria criadas com sucesso!',
      tables: ['admin_activity_log', 'admin_online_status'],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao criar tabelas';
    return NextResponse.json({
      success: false,
      error: message,
      hint: 'Se falhar, execute audit-setup.sql manualmente no Supabase Dashboard > SQL Editor.',
    }, { status: 500 });
  }
}
