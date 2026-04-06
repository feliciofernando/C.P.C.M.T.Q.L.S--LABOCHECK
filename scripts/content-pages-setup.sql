-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Adicionar campo 'conteudo' às tabelas servicos e cards
-- e inserir conteúdo de exemplo detalhado
-- Execute no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Adicionar campo 'conteudo' à tabela servicos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'servicos' AND column_name = 'conteudo'
  ) THEN
    ALTER TABLE servicos ADD COLUMN conteudo TEXT DEFAULT '';
  END IF;
END $$;

-- 2. Adicionar campo 'conteudo' à tabela cards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'conteudo'
  ) THEN
    ALTER TABLE cards ADD COLUMN conteudo TEXT DEFAULT '';
  END IF;
END $$;

-- 3. Adicionar campo 'imagem_base64' à tabela cards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'imagem_base64'
  ) THEN
    ALTER TABLE cards ADD COLUMN imagem_base64 TEXT DEFAULT '';
  END IF;
END $$;

-- 4. Adicionar campo 'imagem_tipo' à tabela cards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cards' AND column_name = 'imagem_tipo'
  ) THEN
    ALTER TABLE cards ADD COLUMN imagem_tipo TEXT DEFAULT 'image/jpeg';
  END IF;
END $$;

-- 5. Atualizar conteúdo dos SERVICOS com texto completo
UPDATE servicos SET conteudo = 'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul oferece um serviço completo de emissão e renovação de licenças profissionais, em conformidade com o Decreto Presidencial No 245/15.

O processo de emissão de licenças inclui as seguintes etapas:

1. Registo e Validação de Documentos: O condutor deve apresentar o Bilhete de Identidade, Carta de Condução válida, documento do veículo e comprovativo de residência. Todos os documentos são verificados pela nossa equipa administrativa para garantir a sua autenticidade e validade.

2. Emissão da Licença Profissional: Após a validação dos documentos, é emitida a licença profissional que comprova a condição legal do condutor para exercer a actividade de transporte de motociclos, triciclos e quadriciclos na província da Lunda Sul. A licença inclui um número de membro único, data de emissão e data de validade.

3. Renovação: As licenças têm validade de 1 ano e devem ser renovadas antes da data de expiração. O processo de renovação é simplificado para condutores que já possuem registo activo no sistema.

4. Cartão PVC: Juntamente com a licença, o condutor recebe um cartão PVC profissional que contém o seu número de membro, dados pessoais, QR code para verificação online e fotografia. Este cartão deve ser apresentado sempre que solicitado pelas autoridades.

Horário de atendimento: Segunda a Sexta-feira, das 08:00 às 16:00.
Localização: Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Empório.
Contactos: 941-000-517 / 924-591-350' WHERE titulo = 'Emissao de Licencas';

UPDATE servicos SET conteudo = 'O registo de condutores é o primeiro passo para qualquer pessoa que pretenda exercer a actividade de condução de motociclos, triciclos e quadriciclos de forma legal e regularizada na província da Lunda Sul.

O processo de registo é simples e rápido, e pode ser concluído numa única visita ao nosso escritório. Os requisitos são:

Documentação Necessária:
- Bilhete de Identidade original e cópia
- Carta de Condução válida (categorias A, A1, A2)
- Documento do veículo (certificado de registo e matrícula)
- Comprovativo de residência na Lunda Sul
- 2 fotografias tipo passe (fundo branco)

Após o registo, o condutor recebe:
- Número de membro único do CPCMTQLS
- Cartão de identificação profissional (PVC)
- Acesso ao sistema de consulta online
- Certificado de registo provisório

Benefícios do Registo:
- Proteção legal contra fiscalizações indevidas
- Acesso a formação profissional gratuita
- Cobertura do seguro de responsabilidade civil
- Participação em eventos e actividades do Conselho
- Direito a voto nas assembleias gerais
- Acesso a linhas de crédito para aquisição de veículos

O registo é obrigatório para todos os condutores que exercem actividade profissional de transporte na província, conforme estabelecido pelo Decreto Presidencial No 245/15.' WHERE titulo = 'Registo de Condutores';

UPDATE servicos SET conteudo = 'O C.P.C.M.T.Q.L.S desenvolve um programa contínuo de formação profissional destinado a todos os condutores registados, com o objectivo de capacitar e qualificar os profissionais para um exercício mais seguro e eficiente da actividade.

Cursos Disponíveis:

1. Segurança Rodoviária: Módulo obrigatório que aborda normas de trânsito, sinalização, velocidades máximas, distâncias de segurança, condução defensiva e prevenção de acidentes. Duração: 16 horas.

2. Primeiros Socorros: Formação prática sobre como agir em caso de acidentes, incluindo avaliação inicial de vítimas, suporte básico de vida, imobilização de fracturas, manejo de ferimentos e hemorragias, e comunicação com serviços de emergência. Duração: 12 horas.

3. Legislação e Direitos do Condutor: Módulo sobre os direitos e deveres dos condutores, legislação aplicável, processo de fiscalização, defesa em caso de infracções e recursos administrativos. Duração: 8 horas.

4. Manutenção Básica de Veículos: Formação prática sobre manutenção preventiva de motociclos, triciclos e quadriciclos, incluindo verificação de pneus, travões, luzes, motor e sistema eléctrico. Duração: 8 horas.

5. Empreendedorismo e Gestão: Para condutores que desejam iniciar o seu próprio negócio de transporte, incluindo noções de gestão financeira, atendimento ao cliente e planeamento empresarial. Duração: 12 horas.

Todos os cursos são gratuitos para condutores registados e são ministrados por profissionais qualificados. Os participantes recebem certificado de participação reconhecido pelo Conselho Provincial.

As formações são realizadas no auditorium do Centro Comercial do Empório e em parceria com instituições como a Polícia Nacional, Hospital Provincial e instituições de ensino técnico.' WHERE titulo = 'Formacao Profissional';

UPDATE servicos SET conteudo = 'O C.P.C.M.T.Q.L.S disponibiliza um serviço de consultoria e apoio jurídico para todos os condutores registados, garantindo que os seus direitos são protegidos e que têm acesso a informação legal actualizada.

Áreas de Consultoria:

1. Legislação de Trânsito: Aconselhamento sobre as leis e regulamentos que regem a actividade dos condutores de motociclos, triciclos e quadriciclos, incluindo o Decreto Presidencial No 245/15, o Código de Estrada e regulamentos municipais.

2. Defesa de Direitos: Apoio na defesa dos direitos dos condutores em situações de fiscalização indevida, multas injustas, apreensão de veículos ou qualquer outra situação que viole os direitos legalmente estabelecidos.

3. Resolução de Conflitos: Mediação em conflitos entre condutores e passageiros, entre condutores e autoridades, ou entre condutores e outras partes. A equipa de consultoria trabalha para encontrar soluções amigáveis e justas.

4. Acidentes de Trânsito: Orientação sobre os procedimentos a seguir em caso de acidente, incluindo comunicação às autoridades, registo do acidente, direitos a indemnização e acompanhamento de processos.

5. Questões Laborais: Consultoria sobre direitos laborais dos condutores que trabalham por conta de outrem, incluindo contratos de trabalho, remuneração mínima, condições de segurança e saúde no trabalho.

O serviço de consultoria é confidencial e gratuito para todos os condutores registados no C.P.C.M.T.Q.L.S. Para marcar consulta, contacte o nosso escritório pelo telefone 941-000-517 ou visite o nosso escritório no Cassengo.' WHERE titulo = 'Consultoria e Apoio Legal';

-- 6. Atualizar conteúdo dos CARDS com texto completo
UPDATE cards SET conteudo = 'Caro Condutor,

É com grande satisfação que me dirijo a todos os membros do Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul.

Desde a nossa fundação, temos trabalhado incansavelmente para promover a organização, a profissionalização e a defesa dos direitos dos condutores da nossa província. O Decreto Presidencial No 245/15 conferiu-nos a responsabilidade de regulamentar e supervisionar a actividade dos condutores, e temos honrado essa missão com dedicação.

Os nossos principais objectivos são:
- Garantir que todos os condutores exerçam a sua actividade de forma legal e regulada
- Promover a formação contínua e a segurança rodoviária
- Defender os direitos e interesses dos nossos membros
- Contribuir para o desenvolvimento económico e social da Lunda Sul
- Colaborar com as autoridades locais na melhoria do sistema de transporte

Convido todos os condutores a aderirem ao Conselho e a participarem activamente nas nossas actividades. Juntos, podemos construir um futuro melhor para todos.

Com os melhores cumprimentos,
O Presidente do C.P.C.M.T.Q.L.S' WHERE titulo = 'Mensagem do Presidente';

UPDATE cards SET conteudo = 'O C.P.C.M.T.Q.L.S organiza regularmente eventos e actividades para a comunidade de condutores da Lunda Sul. Fique a par dos próximos eventos:

Eventos Programados:

- Reunião Geral de Condutores: Realizada trimestralmente, é o espaço onde os membros discutem os assuntos do Conselho, apresentam propostas e votam decisões importantes. A próxima reunião será no auditório do Centro Comercial do Empório.

- Campanhas de Segurança Rodoviária: Realizadas em parceria com a Polícia Nacional e a Administração Municipal, estas campanhas incluem distribuição de equipamentos de segurança, formação sobre normas de trânsito e fiscalização preventiva.

- Formações Profissionais: Cursos regulares sobre segurança rodoviária, primeiros socorros, legislação, manutenção de veículos e empreendedorismo. As formações são gratuitas para membros registados.

- Dia do Condutor: Celebração anual que reconhece a importância dos condutores para o desenvolvimento da província, com actividades culturais, desportivas e sociais.

- Feira de Emprego e Empreendedorismo: Evento anual que conecta condutores com oportunidades de emprego e formação em gestão de pequenos negócios.

Para se inscrever em qualquer evento, contacte o nosso escritório ou visite o site oficial do CPCMTQLS.' WHERE titulo = 'Eventos';

UPDATE cards SET conteudo = 'A actividade dos condutores de motociclos, triciclos e quadriciclos em Angola é regulamentada por um conjunto de leis e decretos que todos os profissionais devem conhecer e cumprir.

Legislação Principal:

Decreto Presidencial No 245/15:
Estabelece a criação e funcionamento dos Conselhos Provinciais dos Condutores de Motociclos, Triciclos e Quadriciclos em todas as províncias de Angola. Define as competências, estrutura organizativa e normas de funcionamento dos Conselhos.

Código de Estrada:
Contém as normas gerais de trânsito aplicáveis a todos os veículos, incluindo motociclos, triciclos e quadriciclos. Estabelece regras sobre velocidade, prioridade, estacionamento, sinalização e infrações.

Regulamento Municipal de Transporte:
Regulamentação específica do município do Saurimo que define as condições de exercício da actividade de transporte de passageiros e mercadorias.

Documentos Disponíveis:
- Estatutos do CPCMTQLS
- Regulamento Interno
- Tabela de multas e infrações
- Guia do condutor profissional
- Formulários de registo e renovação

Todos os documentos podem ser consultados no nosso escritório ou solicitados por telefone.' WHERE titulo = 'Legislacao';

UPDATE cards SET conteudo = 'Aqui encontram as respostas para as dúvidas mais frequentes sobre o registo, licenças e serviços do C.P.C.M.T.Q.L.S.

Perguntas Frequentes:

1. O que é o C.P.C.M.T.Q.L.S?
É o Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul, uma instituição criada pelo Decreto Presidencial No 245/15 para regulamentar e organizar a actividade dos condutores na província.

2. O registo é obrigatório?
Sim, todos os condutores que exercem actividade profissional de transporte na Lunda Sul devem estar registados no Conselho Provincial.

3. Quais os documentos necessários para o registo?
Bilhete de Identidade, Carta de Condução, documento do veículo e comprovativo de residência.

4. Quanto custa o registo?
Os valores de registo estão disponíveis no nosso escritório e são actualizados anualmente. Contacte-nos para informações actualizadas.

5. Qual a validade da licença profissional?
A licença tem validade de 1 ano e deve ser renovada até 30 dias antes da data de expiração.

6. Posso conduzir sem estar registado?
Não. A condução sem registo no Conselho Provincial é considerada uma infracção e pode resultar em multas e apreensão do veículo.

7. Onde fica o escritório do CPCMTQLS?
Cassengo, Bairro Social da Juventude, 1o Andar do Centro Comercial do Empório (vulgo Janota), Saurimo, Lunda Sul.

8. Qual o horário de atendimento?
Segunda a Sexta-feira, das 08:00 às 16:00.

9. Perdi o meu cartão de membro, o que faço?
Dirija-se ao nosso escritório com o seu Bilhete de Identidade. Emitiremos um novo cartão em 48 horas.

10. Como posso verificar o meu registo online?
Acesse a secção "Consultar a Minha Ficha" no nosso site e introduza o seu número de Bilhete de Identidade.' WHERE titulo = 'Perguntas Frequentes';

UPDATE cards SET conteudo = 'O C.P.C.M.T.Q.L.S disponibiliza diversos documentos importantes para os condutores registados e para o público em geral.

Documentos Disponíveis:

Formulários:
- Ficha de Registo do Condutor (original e renovação)
- Formulário de actualização de dados
- Formulário de reclamação e sugestões
- Pedido de segunda via de cartão de membro
- Pedido de certificado de registo

Regulamentos:
- Estatutos do CPCMTQLS
- Regulamento Interno
- Código de Ética do Condutor
- Normas de Segurança Rodoviária

Relatórios:
- Relatório anual de actividades
- Balanço financeiro anual
- Relatório de formação profissional
- Estatísticas de registo de condutores

Para solicitar qualquer documento, dirija-se ao nosso escritório ou contacte-nos pelo telefone 941-000-517. Alguns documentos estão disponíveis para download no nosso site.' WHERE titulo = 'Documentos';

UPDATE cards SET conteudo = 'Conheça os líderes que têm marcado a história do C.P.C.M.T.Q.L.S ao longo dos anos, dedicando o seu tempo e energia ao serviço da comunidade de condutores da Lunda Sul.

A direcção do Conselho Provincial é composta por profissionais comprometidos com o desenvolvimento e a organização dos condutores da província.

Os membros da direcção são eleitos democraticamente em Assembleias Gerais, com mandatos de 3 anos. A actual direcção tem trabalhado para modernizar os processos do Conselho, implementar o registo digital e expandir os serviços de formação e apoio aos condutores.

Para saber mais sobre a actual direcção, visite o nosso escritório ou contacte-nos pelos canais disponíveis.' WHERE titulo = 'Galeria de Diretores';

UPDATE cards SET conteudo = 'O Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul (C.P.C.M.T.Q.L.S) é uma instituição pública criada pelo Decreto Presidencial No 245/15, com a missão de organizar, regulamentar e defender os direitos dos condutores de motociclos, triciclos e quadriciclos na província.

A Nossa Missão:
Promover a organização e profissionalização dos condutores, garantindo o exercício legal e seguro da actividade de transporte, contribuindo para o desenvolvimento económico e social da Lunda Sul.

A Nossa Visão:
Ser uma instituição de referência na organização e capacitação de condutores, reconhecida pela excelência dos serviços prestados e pelo compromisso com a segurança rodoviária.

Os Nossos Valores:
- Integridade e transparência em todas as acções
- Compromisso com a segurança rodoviária
- Respeito pelos direitos dos condutores
- Excelência no atendimento ao público
- Inovação e modernização contínua
- Espírito comunitário e solidariedade

Estrutura Organizativa:
- Assembleia Geral (todos os condutores registados)
- Conselho Directivo (dirigentes eleitos)
- Conselho Fiscal (fiscalização financeira)
- Secretariado Executivo (equipa administrativa)

Desde a sua criação, o CPCMTQLS tem trabalhado para transformar a realidade dos condutores na Lunda Sul, oferecendo formação, apoio jurídico, representação institucional e serviços administrativos de qualidade.' WHERE titulo = 'Sobre o Conselho';

UPDATE cards SET conteudo = 'Mantenha-se informado sobre as últimas novidades, comunicados e informações relevantes do C.P.C.M.T.Q.L.S.

As notícias publicadas nesta secção incluem:
- Comunicados oficiais do Conselho Directivo
- Informações sobre novas regulamentações
- Avisos sobre campanhas de segurança
- Convites para eventos e formações
- Resultados de reuniões e assembleias
- Informações sobre mudanças nos serviços
- Notícias sobre parcerias e projectos

Visite regularmente esta secção para se manter actualizado. As notícias mais importantes são marcadas como "Destaque" e aparecem em primeiro lugar.

Para receber notificações, contacte o nosso escritório e forneça o seu número de telefone para o nosso serviço de mensagens.' WHERE titulo = 'Noticias';

-- ============================================================
-- CONCLUIDO!
-- ============================================================
