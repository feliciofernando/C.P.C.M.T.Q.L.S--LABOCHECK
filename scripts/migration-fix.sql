-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- MIGRACAO: Corrigir incompatibilidades e criar tabela servicos
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Adicionar coluna 'destaque' à tabela noticias (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'noticias' AND column_name = 'destaque'
  ) THEN
    ALTER TABLE noticias ADD COLUMN destaque BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Adicionar coluna 'imagem_base64' à tabela noticias (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'noticias' AND column_name = 'imagem_base64'
  ) THEN
    ALTER TABLE noticias ADD COLUMN imagem_base64 TEXT DEFAULT '';
  END IF;
END $$;

-- 3. Adicionar coluna 'imagem_tipo' à tabela noticias (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'noticias' AND column_name = 'imagem_tipo'
  ) THEN
    ALTER TABLE noticias ADD COLUMN imagem_tipo TEXT DEFAULT 'image/jpeg';
  END IF;
END $$;

-- 4. Renomear coluna 'activa' para 'activo' na tabela noticias
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'noticias' AND column_name = 'activa'
  ) THEN
    ALTER TABLE noticias RENAME COLUMN activa TO activo;
  END IF;
END $$;

-- 5. Marcar a primeira noticia como destaque (se existir)
UPDATE noticias SET destaque = true WHERE ordem = 1;

-- 6. Criar tabela 'servicos' (se não existir)
CREATE TABLE IF NOT EXISTS servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  icone TEXT DEFAULT 'Shield',
  imagem_base64 TEXT DEFAULT '',
  imagem_tipo TEXT DEFAULT 'image/jpeg',
  ordem INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- 7. Indice para performance
CREATE INDEX IF NOT EXISTS idx_servicos_activo ON servicos(activo);
CREATE INDEX IF NOT EXISTS idx_servicos_ordem ON servicos(ordem);

-- 8. RLS na tabela servicos
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- 9. Politica permissiva para servicos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'servicos' AND policyname = 'full_access_servicos'
  ) THEN
    CREATE POLICY "full_access_servicos" ON servicos FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 10. Dados de Exemplo - 4 Servicos
INSERT INTO servicos (titulo, descricao, icone, imagem_base64, imagem_tipo, ordem, activo) VALUES
  (
    'Emissao de Licencas',
    'Processo completo de emissao e renovacao de licencas profissionais para condutores de motociclos, triciclos e quadriciclos na Lunda Sul.',
    'CreditCard', '', 'image/jpeg', 0, true
  ),
  (
    'Registo de Condutores',
    'Registo oficial de condutores no Conselho Provincial, incluindo validacao de documentos e emissao de cartao de identificação.',
    'UserPlus', '', 'image/jpeg', 1, true
  ),
  (
    'Formacao Profissional',
    'Cursos e formacoes para capacitar condutores com conhecimentos de seguranca rodoviaria, primeiros socorros e legislacao.',
    'GraduationCap', '', 'image/jpeg', 2, true
  ),
  (
    'Consultoria e Apoio Legal',
    'Acompanhamento juridico e consultoria sobre legislacao de transito, resolucao de conflitos e defesa dos direitos dos condutores.',
    'FileCheck', '', 'image/jpeg', 3, true
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- CONCLUIDO! Todas as correcoes estao prontas.
-- Agora o site deve funcionar correctamente com:
-- - Noticias com destaque, imagem base64 e campo 'activo'
-- - Servicos com 4 dados de exemplo
-- ============================================================
