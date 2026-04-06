-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Script de Configuracao - Sistema de Auditoria e Controlo
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabela de Registo de Actividades (Audit Log)
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

-- 2. Tabela de Status Online dos Administradores
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

-- 3. Indices para performance
CREATE INDEX IF NOT EXISTS idx_activity_log_admin ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_categoria ON admin_activity_log(categoria);
CREATE INDEX IF NOT EXISTS idx_activity_log_acao ON admin_activity_log(acao);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_online_status_heartbeat ON admin_online_status(last_heartbeat);

-- 4. RLS (Row Level Security)
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_online_status ENABLE ROW LEVEL SECURITY;

-- Politicas permissivas (a app gere a autenticacao)
CREATE POLICY "full_access_activity_log" ON admin_activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_online_status" ON admin_online_status FOR ALL USING (true) WITH CHECK (true);

-- 5. Funcao para limpar sessoes expiradas (mais de 3 minutos sem heartbeat)
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_online_status WHERE last_heartbeat < now() - interval '3 minutes';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- CONCLUIDO! Execute tambem a URL: /api/setup-audit para verificar.
-- ============================================================
