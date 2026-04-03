-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Script de Configuracao - Tabelas de Conteudo (Noticias e Servicos)
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabela de Noticias
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

-- 2. Tabela de Servicos
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

-- 3. Indices
CREATE INDEX IF NOT EXISTS idx_noticias_activo ON noticias(activo);
CREATE INDEX IF NOT EXISTS idx_noticias_ordem ON noticias(ordem);
CREATE INDEX IF NOT EXISTS idx_noticias_data ON noticias(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_servicos_activo ON servicos(activo);
CREATE INDEX IF NOT EXISTS idx_servicos_ordem ON servicos(ordem);

-- 4. RLS
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "full_access_noticias" ON noticias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_servicos" ON servicos FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- CONCLUIDO! Execute tambem o script scripts/seed-content.ts
-- para inserir os dados iniciais.
-- ============================================================
