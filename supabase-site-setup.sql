-- ============================================
-- CPCMTQLS - SITE CONTENT TABLES
-- Migration: explore sections + admin CRUD
-- ============================================

-- 1. DIRECTOR MESSAGES
CREATE TABLE IF NOT EXISTS director_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Mensagem do Director Executivo',
  subtitle TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author_name TEXT DEFAULT 'O Director Executivo',
  author_position TEXT DEFAULT 'C.P.C.M.T.Q.L.S — Lunda Sul',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. EVENTOS
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  event_date DATE,
  display_date TEXT DEFAULT '',
  location TEXT DEFAULT '',
  type TEXT DEFAULT 'Geral',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. LEGISLACAO
CREATE TABLE IF NOT EXISTS legislacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'Legislação Geral',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FAQS
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DOCUMENTOS
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT 'Documentos',
  icon TEXT DEFAULT 'FileText',
  file_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DIRECTORES (Gallery)
CREATE TABLE IF NOT EXISTS directores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  photo_url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SITE SECTIONS (About page: mission, vision, values, history)
CREATE TABLE IF NOT EXISTS site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT 'Star',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. NOTICIAS
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  tag TEXT DEFAULT 'Geral',
  news_date DATE,
  display_date TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_eventos_active ON eventos(is_active);
CREATE INDEX IF NOT EXISTS idx_eventos_date ON eventos(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_legislacao_active ON legislacao(is_active);
CREATE INDEX IF NOT EXISTS idx_legislacao_category ON legislacao(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_documentos_active ON documentos(is_active);
CREATE INDEX IF NOT EXISTS idx_documentos_category ON documentos(category);
CREATE INDEX IF NOT EXISTS idx_directores_active ON directores(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_noticias_active ON noticias(is_active, news_date DESC);
CREATE INDEX IF NOT EXISTS idx_site_sections_key ON site_sections(section_key);

-- ============================================
-- SEED DATA (insert existing hardcoded content)
-- ============================================

-- Director Message
INSERT INTO director_messages (title, subtitle, content, author_name, author_position) VALUES (
  'Mensagem do Director Executivo',
  'Saurimo, Lunda Sul — Janeiro de 2025',
  E'É com grande satisfação e sentido de responsabilidade que vos dirijo esta mensagem em nome do Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul (C.P.C.M.T.Q.L.S). A nossa instituição, criada ao abrigo do Decreto Presidencial Nº 245/15, tem como missão fundamental organizar, regulamentar e proteger os direitos dos condutores de motociclos, triciclos e quadriciclos na nossa província.\n\nDesde a nossa fundação, temos trabalhado incansavelmente para garantir que cada condutor tenha acesso ao registo formal, à licença profissional reconhecida pelo Estado, e a um sistema de apoio que promova a segurança rodoviária e o desenvolvimento socioeconómico da nossa região. A Lunda Sul merece um trânsito seguro e organizado, e nós estamos comprometidos com essa causa.\n\nGostaria de apelar a todos os condutores que ainda não se encontram registados que procedam ao seu registo nas nossas instalações, no Cassengo, Bairro Social da Juventude. O registo é não apenas uma obrigação legal, mas também uma forma de protecção e reconhecimento profissional.\n\nOs nossos serviços incluem a emissão de licenças profissionais em cartão PVC, a consulta de fichas de registo, o sistema de alertas para validade de licenças, e o atendimento personalizado para cada condutor. Contamos também com uma equipa dedicada pronta para auxiliar em todas as suas necessidades.\n\nJuntos, podemos construir uma província mais segura e organizada. Condutores organizados, trânsito mais seguro!',
  'O Director Executivo',
  'C.P.C.M.T.Q.L.S — Lunda Sul'
);

-- Eventos
INSERT INTO eventos (title, description, event_date, display_date, location, type) VALUES
('Campanha de Registo Massivo — Saurimo', 'Campanha especial de registo de condutores de motociclos, triciclos e quadriciclos. Venha com o seu BI e duas fotografias tipo passe. Registo simplificado durante todo o dia.', '2025-03-15', '15 Março 2025', 'Sede do C.P.C.M.T.Q.L.S, Cassengo', 'Registo'),
('Formação em Segurança Rodoviária', 'Curso intensivo de segurança rodoviária para condutores de motociclos. Certificação incluída. Vagas limitadas a 50 participantes.', '2025-04-22', '22 Abril 2025', 'Centro de Formação Provincial', 'Formação'),
('Assembleia Geral Ordinária 2025', 'Reunião anual de todos os condutores registados para prestação de contas, apresentação do plano de actividades e eleição de novos membros do conselho fiscal.', '2025-05-10', '10 Maio 2025', 'Salão de Conferências, Saurimo', 'Assembleia'),
('Dia do Condutor — Lunda Sul', 'Celebração anual em honra dos condutores da província. Programa inclui desfile de motociclos, entregas de prémios e actividades culturais.', '2025-06-05', '5 Junho 2025', 'Avenida Principal de Saurimo', 'Celebração'),
('Renovação de Licenças — Operação Especial', 'Operação especial de renovação de licenças profissionais com desconto de 30%. Aproveite esta oportunidade para regularizar a sua situação.', '2025-07-20', '20 Julho 2025', 'Sede do C.P.C.M.T.Q.L.S, Cassengo', 'Renovação');

-- Legislacao
INSERT INTO legislacao (title, description, category) VALUES
('Decreto Presidencial Nº 245/15', 'Aprova o Regulamento do Registo e Licenciamento dos Condutores de Motociclos, Triciclos e Quadriciclos em Angola. Diploma fundamental que cria a base legal para a existência dos Conselhos Provinciais.', 'Diploma Presidencial'),
('Decreto Executivo Nº 58/16', 'Aprova o Estatuto Orgânico dos Conselhos Provinciais dos Condutores de Motociclos, Triciclos e Quadriciclos, definindo a estrutura, competências e funcionamento de cada conselho provincial.', 'Diploma Executivo'),
('Lei Nº 3/14 — Código de Trânsito Rodoviário', 'Aprova o Código de Trânsito Rodoviário de Angola, estabelecendo as regras gerais de circulação, sinalização, infrações e sanções aplicáveis a todos os utentes das vias públicas.', 'Legislação Geral'),
('Despacho Nº 12/17 — Ministério dos Transportes', 'Define os procedimentos de emissão, renovação e cancelamento das licenças profissionais para condutores de motociclos, triciclos e quadriciclos em todo o território nacional.', 'Despacho Ministerial'),
('Resolução Nº 07/19 — Conselho de Ministros', 'Aprova a política nacional de segurança rodoviária para o período 2019-2029, incluindo medidas específicas para a redução de acidentes envolvendo motociclos e veículos similares.', 'Resolução'),
('Decreto Legislativo Presidencial Nº 5/20', 'Introduz alterações ao regime de contravenções rodoviárias, incluindo novas sanções para condutores não licenciados e a obrigatoriedade de seguro para veículos de duas e três rodas.', 'Diploma Presidencial');

-- FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
('Como posso proceder ao meu registo como condutor?', 'Para se registar como condutor de motociclo, triciclo ou quadriciclo, deve dirigir-se à sede do C.P.C.M.T.Q.L.S no Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Emporio. Deve trazer consigo o seu Bilhete de Identidade (BI) original, duas fotografias tipo passe (fundo branco) e o comprovativo de residência. O atendimento é de Segunda a Sexta, das 08:00 às 16:00.', 1),
('Quais são os documentos necessários para obter a licença profissional?', 'Para obter a sua licença profissional em cartão PVC, precisa dos seguintes documentos: BI original e cópia, duas fotografias tipo passe, comprovativo de registo no conselho, e o comprovativo de pagamento da taxa de emissão. O processo leva em média 3 a 5 dias úteis após a entrega de toda a documentação.', 2),
('Qual é a validade da licença profissional e como renová-la?', 'A licença profissional tem uma validade de 2 (dois) anos, conforme estabelecido no Decreto Presidencial Nº 245/15. A renovação deve ser solicitada até 30 dias antes da data de expiração. Para renovar, dirija-se à sede do conselho com a licença anterior, BI actualizado e uma fotografia tipo passe. O nosso sistema de alertas notificá-lo-á quando a data de expiração estiver próxima.', 3),
('O conselho oferece formação para novos condutores?', 'Sim, o C.P.C.M.T.Q.L.S organiza periodicamente cursos de formação em segurança rodoviária, condução defensiva e primeiros socorros para condutores de motociclos, triciclos e quadriciclos. As formações são anunciadas na sede e através dos nossos canais de comunicação. Algumas formações são gratuitas para condutores registados.', 4),
('Como posso consultar a minha ficha de registo?', 'Pode consultar a sua ficha de registo de três formas: presencialmente na sede do conselho; por WhatsApp através do número 941-000-517 enviando o seu número de BI; ou online através da secção de consulta no nosso site oficial, inserindo o seu número de Bilhete de Identidade.', 5),
('O que fazer em caso de perda ou extravio da licença?', 'Em caso de perda ou extravio da licença profissional, deve dirigir-se à sede do conselho o mais rápido possível para solicitar a emissão de uma segunda via. Deve trazer uma denúncia policial (certidão de participação de ocorrência), BI original e uma fotografia tipo passe. A segunda via é emitida em 5 a 7 dias úteis.', 6),
('Quais são as taxas cobradas pelos serviços do conselho?', 'As taxas variam conforme o serviço solicitado: registo de condutor, emissão de licença profissional, renovação, segunda via, entre outros. Para obter a tabela actualizada de taxas, consulte a sede do conselho ou contacte-nos pelo telefone 941-000-517. Os condutores registados em dia beneficiam de condições especiais.', 7),
('Posso transferir o meu registo para outra província?', 'Sim, é possível transferir o seu registo para o conselho provincial de outra província. Para isso, deve solicitar na sede do C.P.C.M.T.Q.L.S da Lunda Sul um certificado de registo que será apresentado no conselho de destino. O processo é simples e garante a continuidade dos seus direitos como condutor registado em qualquer parte do país.', 8);

-- Documentos
INSERT INTO documentos (title, description, category, icon) VALUES
('Formulários', 'Formulários de registo, renovação, transferência e outros pedidos oficiais.', 'Formulários', 'FileText'),
('Regulamentos', 'Regulamentos internos, código de conduta e normas de funcionamento do conselho.', 'Regulamentos', 'Scale'),
('Actas', 'Actas das reuniões da direcção, assembleias gerais e deliberações do conselho.', 'Actas', 'BookOpen'),
('Relatórios', 'Relatórios de actividades, prestação de contas e balanços anuais.', 'Relatórios', 'Award'),
('Estatutos', 'Estatutos do conselho, alterações e documentos constitutivos da organização.', 'Estatutos', 'Shield');

-- Directores
INSERT INTO directores (name, position, description, sort_order) VALUES
('António Domingos Kapenda', 'Director Executivo', 'Líder visionário comprometido com a organização e protecção dos condutores da Lunda Sul.', 1),
('Maria da Conceição Lopes', 'Vice-Directora Administrativa', 'Responsável pela gestão administrativa e financeira do conselho provincial.', 2),
('José Francisco Muachango', 'Director de Registo e Licenciamento', 'Coordena os processos de registo de condutores e emissão de licenças profissionais.', 3),
('Catarina Sebastião Tchioca', 'Directora de Comunicação e Relações Públicas', 'Responsável pela comunicação institucional e ligação com os condutores e parceiros.', 4);

-- Site Sections (About page)
INSERT INTO site_sections (section_key, title, content, icon) VALUES
('missao', 'Nossa Missão', 'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul tem como missão organizar, regulamentar e defender os direitos dos condutores da província, promovendo a segurança rodoviária, o desenvolvimento profissional e o bem-estar socioeconómico dos seus membros, em conformidade com o Decreto Presidencial Nº 245/15 e a legislação em vigor na República de Angola.', 'Target'),
('visao', 'Nossa Visão', 'Ser a referência provincial na organização e representação dos condutores de motociclos, triciclos e quadriciclos, contribuindo para um trânsito seguro, ordenado e sustentável na Lunda Sul, e servindo como modelo de boa governança e serviço público para os demais conselhos provinciais de Angola.', 'Eye'),
('historia', 'Nossa História', 'O C.P.C.M.T.Q.L.S foi oficialmente constituído em 2016, na sequência da publicação do Decreto Presidencial Nº 245/15 de 30 de Dezembro de 2015, que determinou a criação dos Conselhos Provinciais dos Condutores de Motociclos, Triciclos e Quadriciclos em todas as 18 províncias de Angola.\n\nNa Lunda Sul, o conselho nasceu da necessidade de organizar milhares de condutores que utilizam motociclos e veículos similares como principal meio de transporte e fonte de rendimento. Desde a sua fundação, o conselho já registou centenas de condutores e continua a expandir os seus serviços para melhor atender a população.\n\nActualmente, a sede do conselho encontra-se no Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Emporio, em Saurimo, onde funciona de Segunda a Sexta-feira das 08:00 às 16:00.', 'Clock');

-- Noticias
INSERT INTO noticias (title, content, excerpt, tag, news_date, display_date) VALUES
('C.P.C.M.T.Q.L.S inicia campanha de registo massivo na Lunda Sul', 'O Conselho Provincial lançou uma campanha especial de registo que pretende abranger mais de 500 condutores nos próximos três meses. A iniciativa inclui unidades móveis que percorrerão os municípios da província.', 'O Conselho Provincial lançou uma campanha especial de registo que pretende abranger mais de 500 condutores nos próximos três meses. A iniciativa inclui unidades móveis que percorrerão os municípios da província.', 'Registo', '2025-01-28', '28 Janeiro 2025'),
('Novo sistema de alertas para validade de licenças já está operacional', 'O conselho implementou com sucesso um sistema de alertas que notifica os condutores 90, 60 e 30 dias antes da expiração das suas licenças profissionais. O sistema funciona via SMS e WhatsApp.', 'O conselho implementou com sucesso um sistema de alertas que notifica os condutores 90, 60 e 30 dias antes da expiração das suas licenças profissionais.', 'Tecnologia', '2025-01-15', '15 Janeiro 2025'),
('Licenças profissionais em cartão PVC agora disponíveis na Lunda Sul', 'Após meses de preparação, o C.P.C.M.T.Q.L.S começou a emitir licenças profissionais em cartão PVC com QR Code de verificação, elevando a qualidade e segurança do documento de identificação do condutor.', 'Após meses de preparação, o C.P.C.M.T.Q.L.S começou a emitir licenças profissionais em cartão PVC com QR Code de verificação.', 'Licenças', '2025-01-05', '5 Janeiro 2025'),
('Conselho realiza assembleia geral com mais de 200 condutores presentes', 'A assembleia geral ordinária de 2024 contou com a presença de mais de 200 condutores registados, onde foram apresentados os resultados do ano e aprovado o plano de actividades para 2025.', 'A assembleia geral ordinária de 2024 contou com a presença de mais de 200 condutores registados.', 'Assembleia', '2024-12-20', '20 Dezembro 2024');

-- ============================================
-- ENABLE ROW LEVEL SECURITY (optional, for public read)
-- ============================================
-- ALTER TABLE director_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE legislacao ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE directores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_sections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Public read policies (uncomment if RLS is enabled)
-- CREATE POLICY "Public read active director_messages" ON director_messages FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active eventos" ON eventos FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active legislacao" ON legislacao FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active faqs" ON faqs FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active documentos" ON documentos FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active directores" ON directores FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active site_sections" ON site_sections FOR SELECT USING (is_active = true);
-- CREATE POLICY "Public read active noticias" ON noticias FOR SELECT USING (is_active = true);
