-- =====================================================
-- Slides Table Setup for C.P.C.M.T.Q.L.S - LABOCHECK
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Create slides table
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT,
  subtitulo TEXT,
  texto_botao TEXT DEFAULT 'Saber Mais',
  link_botao TEXT DEFAULT '#',
  imagem_base64 TEXT DEFAULT '',
  imagem_tipo TEXT DEFAULT 'image/jpeg',
  activo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  tempo_transicao INTEGER DEFAULT 5000,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Full access policy (public read/write for this table)
CREATE POLICY full_access ON slides FOR ALL USING (true) WITH CHECK (true);

-- Insert 6 example slides
INSERT INTO slides (titulo, subtitulo, texto_botao, link_botao, activo, ordem, tempo_transicao) VALUES
  (
    'C.P.C.M.T.Q.L.S',
    'Condutores organizados, transito mais seguro — Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul',
    'Saiba Mais',
    '#servicos',
    true,
    1,
    6000
  ),
  (
    'Registo de Condutores',
    'Inscreva-se agora e faca parte da nossa comunidade. Benefícios exclusivos para membros associados.',
    'Inscreva-se',
    '/admin',
    true,
    2,
    5000
  ),
  (
    'Formacao Profissional',
    'Capacitacao continua para condutores. Cursos de seguranca rodoviaria, legislacao e primeiros socorros.',
    'Ver Cursos',
    '#servicos',
    true,
    3,
    5000
  ),
  (
    'Seguranca no Transito',
    'Comprometidos com a seguranca rodoviaria. Decreto Presidencial No 245/15 em plena aplicacao.',
    'Consultar',
    '#contactos',
    true,
    4,
    5000
  ),
  (
    'Licencas Profissionais',
    'Emita a sua licenca profissional em cartao PVC com QR Code de verificacao instantanea.',
    'Solicitar',
    '#consultar',
    true,
    5,
    5000
  ),
  (
    'Servicos ao Condutor',
    'Apoio e acompanhamento completo. Consultoria juridica, representacao institucional e muito mais.',
    'Contactar',
    '#contactos',
    true,
    6,
    5000
  );
