-- =====================================================
-- Hero Slides - Criacao completa da tabela
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Criar a tabela slides
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

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- 3. Politica de acesso total (todos podem ler/criar/editar/eliminar)
DO $$ BEGIN
  CREATE POLICY full_access ON slides FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Inserir 6 slides de exemplo
INSERT INTO slides (titulo, subtitulo, descricao, texto_botao, link_botao, activo, ordem, tempo_transicao) VALUES
  ('C.P.C.M.T.Q.L.S', 'Conselho Provincial', 'Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul', 'Saiba Mais', '#servicos', true, 1, 6000),
  ('Registo de Condutores', 'Condutas Legalizadas', 'Inscreva-se agora e faca parte da nossa comunidade de condutores profissionais', 'Inscreva-se', '#consultar', true, 2, 5000),
  ('Formacao Profissional', 'Capacitacao', 'Programas de formacao continua para condutores profissionais da provincia', 'Ver Cursos', '#servicos', true, 3, 5000),
  ('Seguranca no Transito', 'Decreto Presidencial No 245/15', 'Comprometidos com a seguranca rodoviaria e organizacao do transito', 'Consultar', '#contactos', true, 4, 5000),
  ('Licencas Profissionais', 'Cartao PVC com QR Code', 'Emita a sua licenca profissional com verificacao instantanea via QR Code', 'Solicitar', '#consultar', true, 5, 5000),
  ('Servicos ao Condutor', 'Apoio Completo', 'Apoio e acompanhamento completo ao condutor lunda-sulense', 'Contactar', '#contactos', true, 6, 5000)
ON CONFLICT DO NOTHING;
