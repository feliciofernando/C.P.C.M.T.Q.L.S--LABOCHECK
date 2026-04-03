-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Site Content Tables Setup
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabela de Noticias
CREATE TABLE IF NOT EXISTS noticias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  conteudo TEXT DEFAULT '',
  resumo TEXT DEFAULT '',
  imagem_url TEXT DEFAULT '',
  autor TEXT DEFAULT '',
  activa BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  data_publicacao TIMESTAMPTZ DEFAULT now(),
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Secao de Cards (configuracao da seccao)
CREATE TABLE IF NOT EXISTS cards_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  subtitulo TEXT DEFAULT '',
  imagem_fundo_base64 TEXT DEFAULT '',
  imagem_fundo_tipo TEXT DEFAULT 'image/png',
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Cards (itens individuais)
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL DEFAULT '',
  descricao TEXT DEFAULT '',
  icone TEXT DEFAULT '',
  link TEXT DEFAULT '',
  ordem INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMPTZ DEFAULT now()
);

-- 4. Indices para performance
CREATE INDEX IF NOT EXISTS idx_noticias_activa ON noticias(activa);
CREATE INDEX IF NOT EXISTS idx_noticias_ordem ON noticias(ordem);
CREATE INDEX IF NOT EXISTS idx_noticias_data_publicacao ON noticias(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_cards_activo ON cards(activo);
CREATE INDEX IF NOT EXISTS idx_cards_ordem ON cards(ordem);

-- 5. RLS (Row Level Security)
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Politicas permissivas
CREATE POLICY "full_access_noticias" ON noticias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards_section" ON cards_section FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_cards" ON cards FOR ALL USING (true) WITH CHECK (true);

-- 6. Dados de Exemplo - Seccao de Cards
INSERT INTO cards_section (titulo, subtitulo) VALUES
  ('Explore Nosso Conselho', 'Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul')
ON CONFLICT DO NOTHING;

-- 7. Dados de Exemplo - 8 Cards
INSERT INTO cards (titulo, descricao, icone, link, ordem, activo) VALUES
  ('Mensagem do Presidente', 'Leia a mensagem do nosso Presidente sobre os desafios e conquistas do Conselho Provincial.', 'MessageSquare', '#sobre', 0, true),
  ('Eventos', 'Confira nossos proximos eventos, reunioes e actividades programadas para a comunidade de condutores.', 'Calendar', '#eventos', 1, true),
  ('Legislacao', 'Acesse documentos legais importantes, decretos e regulamentacoes que regem a actividade dos condutores.', 'Scale', '#documentos', 2, true),
  ('Perguntas Frequentes', 'Encontre respostas para as duvidas mais comuns sobre licencas, registos e procedimentos.', 'HelpCircle', '#faq', 3, true),
  ('Documentos', 'Acesse documentos importantes do Conselho, incluindo formularios, regulamentos e comunicados oficiais.', 'FileText', '#documentos', 4, true),
  ('Galeria de Diretores', 'Conheca os lideres que marcaram a historia do nosso Conselho Provincial ao longo dos anos.', 'Users', '#galeria', 5, true),
  ('Sobre o Conselho', 'Saiba mais sobre a nossa instituicao, a sua missao, visao e valores para os condutores da Lunda Sul.', 'Building2', '#sobre', 6, true),
  ('Noticias', 'Fique por dentro das ultimas novidades, comunicados e informacoes relevantes para os condutores.', 'Newspaper', '#noticias', 7, true)
ON CONFLICT DO NOTHING;

-- 8. Dados de Exemplo - 4 Noticias
INSERT INTO noticias (titulo, conteudo, resumo, autor, activa, ordem, data_publicacao) VALUES
  (
    'Inscricoes Abertas para Novos Condutores 2025',
    'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul (C.P.C.M.T.Q.L.S) informa a todos os condutores da provincia que as inscricoes para o ano de 2025 estao oficialmente abertas. Todos os condutores de motociclos, triciclos e quadriciclos que pretendam exercer a sua actividade de forma legal e regularizada devem proceder ao seu registo junto ao escritorio do Conselho, localizado no Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Emporio. O processo de inscricao e simples e rapido, sendo necessario apresentar o Bilhete de Identidade, Carta de Conducao, documento do veiculo e comprovativo de residencia. O horario de atendimento e de Segunda a Sexta-feira, das 08:00 as 16:00. Nao perca esta oportunidade de regularizar a sua situacao e contribuir para um transito mais seguro na Lunda Sul.',
    'O CPCMTQLS abre inscricoes para 2025. Condutores de motociclos, triciclos e quadriciclos podem regularizar a sua situacao.',
    'C.P.C.M.T.Q.L.S',
    true,
    1,
    '2025-01-15T10:00:00Z'
  ),
  (
    'Campanha de Seguranca Rodoviaria na Lunda Sul',
    'O Conselho Provincial, em parceria com a Comandancia Provincial da Policia Nacional e a Administracao Municipal do Saurimo, lancou uma campanha abrangente de seguranca rodoviaria direccionada aos condutores de motociclos, triciclos e quadriciclos. A campanha, que decorre durante todo o primeiro trimestre de 2025, inclui accoes de formacao sobre normas de transito, distribuicao de equipamentos de seguranca como capacetes e coletes reflectores, e fiscalizacao preventiva nas principais vias da cidade. Segundo o Presidente do Conselho, a iniciativa visa reduzir o indice de acidentes envolvendo condutores de motociclos e similares, que tem vindo a aumentar nos ultimos anos. Todos os condutores registados terao acesso preferencial as formacoes e receberao material de seguranca gratuito.',
    'Campanha conjunta com a Policia Nacional para promover seguranca rodoviaria entre condutores de motociclos.',
    'Departamento de Seguranca',
    true,
    2,
    '2025-02-20T09:00:00Z'
  ),
  (
    'Novo Regulamento de Licencas Profissionais',
    'Foi publicado o novo regulamento de licencas profissionais para condutores de motociclos, triciclos e quadriciclos, entrando em vigor a partir de Marco de 2025. O novo regulamento traz mudancas significativas no processo de emissao e renovacao de licencas, incluindo a digitalizacao completa do processo, novas categorias de licencas conforme o tipo de veiculo, e actualizacao dos requisitos de formacao obrigatoria. Os condutores ja licenciados terao um periodo de transicao de 90 dias para adequar a sua documentacao ao novo formato. O Conselho Provincial disponibilizara pontos de apoio para ajudar os condutores no processo de transicao. Para mais informacoes, contacte o escritorio do CPCMTQLS ou visite o nosso site.',
    'Novas regras para emissao e renovacao de licencas profissionais entram em vigor em Marco de 2025.',
    'Conselho Directivo',
    true,
    3,
    '2025-03-01T14:00:00Z'
  ),
  (
    'Formacao em Primeiros Socorros para Condutores',
    'O C.P.C.M.T.Q.L.S, em colaboracao com o Hospital Provincial da Lunda Sul, organizará uma formacao gratuita em primeiros socorros destinada a todos os condutores registados. A formacao tera lugar nos dias 15 e 16 de Abril de 2025, no auditorio do Centro Comercial do Emporio, e abordara topicos essenciais como avaliacao inicial de vitimas, suporte basico de vida, imobilizacao de fracturas, e manejo de ferimentos. Os participantes receberao um certificado de participacao reconhecido pelo Conselho Provincial. As vagas sao limitadas a 100 participantes, pelo que se recomenda a inscricao antecipada. O horario sera das 08:00 as 17:00, com intervalo para almoco. Esta formacao integra o programa de capacitacao continua do Conselho, que visa formar condutores mais preparados e responsaveis.',
    'Formacao gratuita em primeiros socorros nos dias 15 e 16 de Abril. Vagas limitadas a 100 participantes.',
    'Departamento de Formacao',
    true,
    4,
    '2025-03-25T11:00:00Z'
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- CONCLUIDO! Todas as tabelas e dados de exemplo estao prontos.
-- ============================================================
