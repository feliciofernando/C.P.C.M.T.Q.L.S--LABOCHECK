'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Scale,
  FolderOpen,
  Newspaper,
  ChevronDown,
  ChevronUp,
  Eye,
  Target,
  Heart,
  Shield,
  Users,
  MapPin,
  BookOpen,
  Award,
  Clock,
  Download,
  FileText,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/* ==============================================================
   CONSTANTS
   ============================================================== */
const COLORS = {
  green: '#1a5c2e',
  greenLight: '#2d7a42',
  gold: '#d4a017',
  dark: '#1a1a1a',
  gray: '#6b6b6b',
  bg: '#f5f5f0',
  border: '#d1d1cc',
} as const;

/* ==============================================================
   SECTION TITLE MAP
   ============================================================== */
const SECTION_TITLES: Record<string, string> = {
  'director-message': 'Mensagem do Director Executivo',
  eventos: 'Eventos',
  legislacao: 'Legislação',
  faqs: 'Perguntas Frequentes',
  documentos: 'Documentos',
  galeria: 'Galeria dos Directores',
  sobre: 'Sobre o Conselho',
  noticias: 'Notícias',
};

/* ==============================================================
   GREEN HEADER BAR (shared across all sections)
   ============================================================== */
function SectionHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 bg-[#1a5c2e] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 hover:text-white shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-bold tracking-wide truncate">
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
          <div className="w-2 h-2 rounded-full bg-white/60" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   1. DIRECTOR MESSAGE
   ============================================================== */
function DirectorMessageContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="border-[#d1d1cc] shadow-sm overflow-hidden">
        {/* Decorative gold bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#d4a017] via-[#d4a017] to-[#b8860b]" />

        <CardHeader className="px-6 sm:px-10 pt-8 pb-2">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a5c2e]/10 border-2 border-[#1a5c2e] flex items-center justify-center shrink-0">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#1a5c2e]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#6b6b6b] mb-1">C.P.C.M.T.Q.L.S</p>
              <CardTitle className="text-lg sm:text-xl text-[#1a1a1a] leading-tight">
                Mensagem do Director Executivo
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-10 py-6">
          <div className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed space-y-4">
            <p className="text-xs text-[#6b6b6b]">
              Saurimo, Lunda Sul — Janeiro de 2025
            </p>

            <Separator className="bg-[#d1d1cc] my-4" />

            <p className="font-medium text-[#1a5c2e]">
              Exmos. Senhores Condutores e Cidadãos da Lunda Sul,
            </p>

            <p className="indent-8 text-justify">
              É com grande satisfação e sentido de responsabilidade que vos dirijo
              esta mensagem em nome do Conselho Provincial dos Condutores de
              Motociclos, Triciclos e Quadriciclos da Lunda Sul (C.P.C.M.T.Q.L.S).
              A nossa instituição, criada ao abrigo do{' '}
              <strong>Decreto Presidencial Nº 245/15</strong>, tem como missão
              fundamental organizar, regulamentar e proteger os direitos dos
              condutores de motociclos, triciclos e quadriciclos na nossa província.
            </p>

            <p className="indent-8 text-justify">
              Desde a nossa fundação, temos trabalhado incansavelmente para garantir
              que cada condutor tenha acesso ao registo formal, à licença
              profissional reconhecida pelo Estado, e a um sistema de apoio que
              promova a segurança rodoviária e o desenvolvimento socioeconómico da
              nossa região. A Lunda Sul merece um trânsito seguro e organizado, e
              nós estamos comprometidos com essa causa.
            </p>

            <p className="indent-8 text-justify">
              Gostaria de apelar a todos os condutores que ainda não se encontram
              registados que procedam ao seu registo nas nossas instalações, no
              Cassengo, Bairro Social da Juventude. O registo é não apenas uma
              obrigação legal, mas também uma forma de protecção e reconhecimento
              profissional.
            </p>

            <p className="indent-8 text-justify">
              Os nossos serviços incluem a emissão de licenças profissionais em cartão
              PVC, a consulta de fichas de registo, o sistema de alertas para
              validade de licenças, e o atendimento personalizado para cada condutor.
              Contamos também com uma equipa dedicada pronta para auxiliar em todas as
              suas necessidades.
            </p>

            <p className="indent-8 text-justify">
              Juntos, podemos construir uma província mais segura e organizada.
              Condutores organizados, trânsito mais seguro!
            </p>

            <Separator className="bg-[#d1d1cc] my-6" />

            <div className="flex flex-col items-start sm:items-end">
              <p className="font-semibold text-[#1a5c2e]">Com os melhores cumprimentos,</p>
              <div className="mt-4 w-24 h-0.5 bg-[#d4a017]" />
              <p className="mt-2 font-bold text-[#1a1a1a]">O Director Executivo</p>
              <p className="text-xs text-[#6b6b6b]">
                C.P.C.M.T.Q.L.S — Lunda Sul
              </p>
            </div>
          </div>
        </CardContent>

        {/* Decorative gold bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#b8860b] via-[#d4a017] to-[#d4a017]" />
      </Card>
    </div>
  );
}

/* ==============================================================
   2. EVENTOS
   ============================================================== */
const EVENTS = [
  {
    date: '15 Março 2025',
    title: 'Campanha de Registo Massivo — Saurimo',
    description:
      'Campanha especial de registo de condutores de motociclos, triciclos e quadriciclos. Venha com o seu BI e duas fotografias tipo passe. Registo simplificado durante todo o dia.',
    location: 'Sede do C.P.C.M.T.Q.L.S, Cassengo',
    type: 'Registo',
  },
  {
    date: '22 Abril 2025',
    title: 'Formação em Segurança Rodoviária',
    description:
      'Curso intensivo de segurança rodoviária para condutores de motociclos. Certificação incluída. Vagas limitadas a 50 participantes.',
    location: 'Centro de Formação Provincial',
    type: 'Formação',
  },
  {
    date: '10 Maio 2025',
    title: 'Assembleia Geral Ordinária 2025',
    description:
      'Reunião anual de todos os condutores registados para prestação de contas, apresentação do plano de actividades e eleição de novos membros do conselho fiscal.',
    location: 'Salão de Conferências, Saurimo',
    type: 'Assembleia',
  },
  {
    date: '5 Junho 2025',
    title: 'Dia do Condutor — Lunda Sul',
    description:
      'Celebração anual em honra dos condutores da província. Programa inclui desfile de motociclos, entregas de prémios e actividades culturais.',
    location: 'Avenida Principal de Saurimo',
    type: 'Celebração',
  },
  {
    date: '20 Julho 2025',
    title: 'Renovação de Licenças — Operação Especial',
    description:
      'Operação especial de renovação de licenças profissionais com desconto de 30%. Aproveite esta oportunidade para regularizar a sua situação.',
    location: 'Sede do C.P.C.M.T.Q.L.S, Cassengo',
    type: 'Renovação',
  },
];

function EventosContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Próximos eventos e actividades do conselho
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[21px] sm:left-[25px] top-2 bottom-2 w-0.5 bg-[#1a5c2e]/15" />

        <div className="space-y-4">
          {EVENTS.map((event, idx) => (
            <Card
              key={idx}
              className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex gap-3 sm:gap-4">
                  {/* Calendar icon dot */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <div className="w-11 h-11 sm:w-[52px] sm:h-[52px] rounded-full bg-[#1a5c2e] flex items-center justify-center">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded-full bg-[#1a5c2e]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#1a5c2e] uppercase tracking-wider">
                        {event.type}
                      </span>
                      <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.date}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed mb-2">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-[#1a5c2e]">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==============================================================
   3. LEGISLAÇÃO
   ============================================================== */
const LEGISLATION = [
  {
    title: 'Decreto Presidencial Nº 245/15',
    description:
      'Aprova o Regulamento do Registo e Licenciamento dos Condutores de Motociclos, Triciclos e Quadriciclos em Angola. Diploma fundamental que cria a base legal para a existência dos Conselhos Provinciais.',
    category: 'Diploma Presidencial',
  },
  {
    title: 'Decreto Executivo Nº 58/16',
    description:
      'Aprova o Estatuto Orgânico dos Conselhos Provinciais dos Condutores de Motociclos, Triciclos e Quadriciclos, definindo a estrutura, competências e funcionamento de cada conselho provincial.',
    category: 'Diploma Executivo',
  },
  {
    title: 'Lei Nº 3/14 — Código de Trânsito Rodoviário',
    description:
      'Aprova o Código de Trânsito Rodoviário de Angola, estabelecendo as regras gerais de circulação, sinalização, infrações e sanções aplicáveis a todos os utentes das vias públicas.',
    category: 'Legislação Geral',
  },
  {
    title: 'Despacho Nº 12/17 — Ministério dos Transportes',
    description:
      'Define os procedimentos de emissão, renovação e cancelamento das licenças profissionais para condutores de motociclos, triciclos e quadriciclos em todo o território nacional.',
    category: 'Despacho Ministerial',
  },
  {
    title: 'Resolução Nº 07/19 — Conselho de Ministros',
    description:
      'Aprova a política nacional de segurança rodoviária para o período 2019-2029, incluindo medidas específicas para a redução de acidentes envolvendo motociclos e veículos similares.',
    category: 'Resolução',
  },
  {
    title: 'Decreto Legislativo Presidencial Nº 5/20',
    description:
      'Introduz alterações ao regime de contravenções rodoviárias, incluindo novas sanções para condutores não licenciados e a obrigatoriedade de seguro para veículos de duas e três rodas.',
    category: 'Diploma Presidencial',
  },
];

function LegislacaoContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Base legal e diplomas relevantes para a organização
        </p>
      </div>

      <div className="space-y-3">
        {LEGISLATION.map((item, idx) => (
          <Card
            key={idx}
            className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex gap-3 sm:gap-4">
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-lg bg-[#1a5c2e]/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#1a5c2e]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center rounded-full bg-[#d4a017]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#b8860b] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#1a5c2e]/5 rounded-lg border border-[#1a5c2e]/10">
        <p className="text-xs text-[#6b6b6b] text-center leading-relaxed">
          <strong className="text-[#1a5c2e]">Nota:</strong> A legislação
          apresentada encontra-se sujeita a actualizações. Para informações
          actualizadas, contacte a sede do conselho ou consulte o portal oficial do
          Governo de Angola.
        </p>
      </div>
    </div>
  );
}

/* ==============================================================
   4. FAQS (Accordion)
   ============================================================== */
const FAQS = [
  {
    question: 'Como posso proceder ao meu registo como condutor?',
    answer:
      'Para se registar como condutor de motociclo, triciclo ou quadriciclo, deve dirigir-se à sede do C.P.C.M.T.Q.L.S no Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Emporio. Deve trazer consigo o seu Bilhete de Identidade (BI) original, duas fotografias tipo passe (fundo branco) e o comprovativo de residência. O atendimento é de Segunda a Sexta, das 08:00 às 16:00.',
  },
  {
    question: 'Quais são os documentos necessários para obter a licença profissional?',
    answer:
      'Para obter a sua licença profissional em cartão PVC, precisa dos seguintes documentos: BI original e cópia, duas fotografias tipo passe, comprovativo de registo no conselho, e o comprovativo de pagamento da taxa de emissão. O processo leva em média 3 a 5 dias úteis após a entrega de toda a documentação.',
  },
  {
    question: 'Qual é a validade da licença profissional e como renová-la?',
    answer:
      'A licença profissional tem uma validade de 2 (dois) anos, conforme estabelecido no Decreto Presidencial Nº 245/15. A renovação deve ser solicitada até 30 dias antes da data de expiração. Para renovar, dirija-se à sede do conselho com a licença anterior, BI actualizado e uma fotografia tipo passe. O nosso sistema de alertas notificá-lo-á quando a data de expiração estiver próxima.',
  },
  {
    question: 'O conselho oferece formação para novos condutores?',
    answer:
      'Sim, o C.P.C.M.T.Q.L.S organiza periodicamente cursos de formação em segurança rodoviária, condução defensiva e primeiros socorros para condutores de motociclos, triciclos e quadriciclos. As formações são anunciadas na sede e através dos nossos canais de comunicação. Algumas formações são gratuitas para condutores registados.',
  },
  {
    question: 'Como posso consultar a minha ficha de registo?',
    answer:
      'Pode consultar a sua ficha de registo de três formas: presencialmente na sede do conselho; por WhatsApp através do número 941-000-517 enviando o seu número de BI; ou online através da secção de consulta no nosso site oficial, inserindo o seu número de Bilhete de Identidade.',
  },
  {
    question: 'O que fazer em caso de perda ou extravio da licença?',
    answer:
      'Em caso de perda ou extravio da licença profissional, deve dirigir-se à sede do conselho o mais rápido possível para solicitar a emissão de uma segunda via. Deve trazer uma denúncia policial (certidão de participação de ocorrência), BI original e uma fotografia tipo passe. A segunda via é emitida em 5 a 7 dias úteis.',
  },
  {
    question: 'Quais são as taxas cobradas pelos serviços do conselho?',
    answer:
      'As taxas variam conforme o serviço solicitado: registo de condutor, emissão de licença profissional, renovação, segunda via, entre outros. Para obter a tabela actualizada de taxas, consulte a sede do conselho ou contacte-nos pelo telefone 941-000-517. Os condutores registados em dia beneficiam de condições especiais.',
  },
  {
    question: 'Posso transferir o meu registo para outra província?',
    answer:
      'Sim, é possível transferir o seu registo para o conselho provincial de outra província. Para isso, deve solicitar na sede do C.P.C.M.T.Q.L.S da Lunda Sul um certificado de registo que será apresentado no conselho de destino. O processo é simples e garante a continuidade dos seus direitos como condutor registado em qualquer parte do país.',
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#d1d1cc] rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-[#1a5c2e]/[0.02] transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#1a5c2e] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            Q
          </div>
          <span className="font-semibold text-sm sm:text-base text-[#1a1a1a] leading-snug">
            {question}
          </span>
        </div>
        <div className="shrink-0 text-[#1a5c2e]">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="ml-9 pl-4 border-l-2 border-[#d4a017]/40">
            <p className="text-sm text-[#6b6b6b] leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqsContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Respostas às questões mais frequentes dos condutores
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <FaqItem key={idx} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <Card className="mt-6 border-[#1a5c2e]/20 bg-[#1a5c2e]/5">
        <CardContent className="p-4 sm:p-5 text-center">
          <p className="text-sm font-medium text-[#1a5c2e] mb-1">
            Não encontrou a resposta que procura?
          </p>
          <p className="text-xs text-[#6b6b6b]">
            Contacte-nos directamente:{' '}
            <span className="font-semibold">941-000-517</span> ou visite a nossa
            sede em Cassengo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ==============================================================
   5. DOCUMENTOS
   ============================================================== */
const DOCUMENT_CATEGORIES = [
  {
    title: 'Formulários',
    description:
      'Formulários de registo, renovação, transferência e outros pedidos oficiais.',
    icon: <FileText className="w-6 h-6" />,
    count: 8,
    color: '#1a5c2e',
  },
  {
    title: 'Regulamentos',
    description:
      'Regulamentos internos, código de conduta e normas de funcionamento do conselho.',
    icon: <Scale className="w-6 h-6" />,
    count: 5,
    color: '#2d7a42',
  },
  {
    title: 'Actas',
    description:
      'Actas das reuniões da direcção, assembleias gerais e deliberações do conselho.',
    icon: <BookOpen className="w-6 h-6" />,
    count: 12,
    color: '#d4a017',
  },
  {
    title: 'Relatórios',
    description:
      'Relatórios de actividades, prestação de contas e balanços anuais.',
    icon: <Award className="w-6 h-6" />,
    count: 6,
    color: '#b8860b',
  },
  {
    title: 'Estatutos',
    description:
      'Estatutos do conselho, alterações e documentos constitutivos da organização.',
    icon: <Shield className="w-6 h-6" />,
    count: 3,
    color: '#1a1a1a',
  },
];

function DocumentosContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Documentos disponíveis para consulta e download
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENT_CATEGORIES.map((cat, idx) => (
          <Card
            key={idx}
            className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group"
          >
            <CardContent className="p-5 sm:p-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${cat.color}10`, color: cat.color }}
              >
                {cat.icon}
              </div>

              <h3 className="font-bold text-base text-[#1a1a1a] mb-1.5">
                {cat.title}
              </h3>
              <p className="text-xs text-[#6b6b6b] leading-relaxed mb-4">
                {cat.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6b6b6b]">
                  {cat.count} {cat.count === 1 ? 'documento' : 'documentos'}
                </span>
                <div className="flex items-center gap-1 text-xs font-medium text-[#1a5c2e] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-3.5 h-3.5" />
                  Aceder
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#d4a017]/5 rounded-lg border border-[#d4a017]/20 text-center">
        <p className="text-xs text-[#6b6b6b]">
          <strong className="text-[#b8860b]">Nota:</strong> Alguns documentos
          estão disponíveis apenas para condutores registados. Para acesso
          completo, contacte a sede do conselho.
        </p>
      </div>
    </div>
  );
}

/* ==============================================================
   6. GALERIA DOS DIRECTORES
   ============================================================== */
const DIRECTORS = [
  {
    name: 'António Domingos Kapenda',
    position: 'Director Executivo',
    initials: 'AK',
    description:
      'Líder visionário comprometido com a organização e protecção dos condutores da Lunda Sul.',
  },
  {
    name: 'Maria da Conceição Lopes',
    position: 'Vice-Directora Administrativa',
    initials: 'ML',
    description:
      'Responsável pela gestão administrativa e financeira do conselho provincial.',
  },
  {
    name: 'José Francisco Muachango',
    position: 'Director de Registo e Licenciamento',
    initials: 'JM',
    description:
      'Coordena os processos de registo de condutores e emissão de licenças profissionais.',
  },
  {
    name: 'Catarina Sebastião Tchioca',
    position: 'Directora de Comunicação e Relações Públicas',
    initials: 'CT',
    description:
      'Responsável pela comunicação institucional e ligação com os condutores e parceiros.',
  },
];

function GaleriasContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Equipa de direcção do conselho provincial
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {DIRECTORS.map((director, idx) => (
          <Card
            key={idx}
            className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar circle */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1a5c2e] to-[#2d7a42] flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {director.initials}
                  </span>
                </div>

                {/* Gold ring accent */}
                <div className="w-12 h-0.5 bg-[#d4a017] mb-3" />

                <h3 className="font-bold text-base sm:text-lg text-[#1a1a1a] mb-0.5">
                  {director.name}
                </h3>
                <p className="text-xs font-semibold text-[#1a5c2e] mb-2">
                  {director.position}
                </p>
                <p className="text-xs text-[#6b6b6b] leading-relaxed max-w-xs">
                  {director.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ==============================================================
   7. SOBRE O CONSELHO
   ============================================================== */
function SobreContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Mission */}
      <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-5 h-5" />
            Nossa Missão
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <p className="text-sm text-[#6b6b6b] leading-relaxed text-justify indent-8">
            O Conselho Provincial dos Condutores de Motociclos, Triciclos e
            Quadriciclos da Lunda Sul tem como missão organizar, regulamentar e
            defender os direitos dos condutores da província, promovendo a
            segurança rodoviária, o desenvolvimento profissional e o bem-estar
            socioeconómico dos seus membros, em conformidade com o Decreto
            Presidencial Nº 245/15 e a legislação em vigor na República de
            Angola.
          </p>
        </CardContent>
      </Card>

      {/* Vision */}
      <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Nossa Visão
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <p className="text-sm text-[#6b6b6b] leading-relaxed text-justify indent-8">
            Ser a referência provincial na organização e representação dos
            condutores de motociclos, triciclos e quadriciclos, contribuindo para
            um trânsito seguro, ordenado e sustentável na Lunda Sul, e servindo
            como modelo de boa governança e serviço público para os demais
            conselhos provinciais de Angola.
          </p>
        </CardContent>
      </Card>

      {/* Values */}
      <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Nossos Valores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <Shield className="w-4 h-4" />,
                title: 'Integridade',
                desc: 'Actuamos com transparência e honestidade em todos os processos.',
              },
              {
                icon: <Users className="w-4 h-4" />,
                title: 'Solidariedade',
                desc: 'Apoiamos e unimos os condutores em prol do bem comum.',
              },
              {
                icon: <Award className="w-4 h-4" />,
                title: 'Excelência',
                desc: 'Buscamos a qualidade e profissionalismo em tudo o que fazemos.',
              },
              {
                icon: <BookOpen className="w-4 h-4" />,
                title: 'Responsabilidade',
                desc: 'Cumprimos as nossas obrigações legais e sociais com dedicação.',
              },
            ].map((v, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 rounded-lg bg-[#f5f5f0] border border-[#d1d1cc]/60"
              >
                <div className="w-8 h-8 rounded-lg bg-[#1a5c2e]/10 flex items-center justify-center text-[#1a5c2e] shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#1a1a1a] mb-0.5">
                    {v.title}
                  </h4>
                  <p className="text-[11px] text-[#6b6b6b] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Nossa História
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="text-sm text-[#6b6b6b] leading-relaxed space-y-4">
            <p className="text-justify indent-8">
              O C.P.C.M.T.Q.L.S foi oficialmente constituído em 2016, na sequência
              da publicação do Decreto Presidencial Nº 245/15 de 30 de Dezembro de
              2015, que determinou a criação dos Conselhos Provinciais dos
              Condutores de Motociclos, Triciclos e Quadriciclos em todas as 18
              províncias de Angola.
            </p>
            <p className="text-justify indent-8">
              Na Lunda Sul, o conselho nasceu da necessidade de organizar milhares
              de condutores que utilizam motociclos e veículos similares como
              principal meio de transporte e fonte de rendimento. Desde a sua
              fundação, o conselho já registou centenas de condutores e continua a
              expandir os seus serviços para melhor atender a população.
            </p>
            <p className="text-justify indent-8">
              Actualmente, a sede do conselho encontra-se no Cassengo, Bairro Social
              da Juventude, 1º Andar do Centro Comercial do Emporio, em Saurimo,
              onde funciona de Segunda a Sexta-feira das 08:00 às 16:00.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="border-[#d1d1cc] shadow-sm overflow-hidden">
        <CardHeader className="bg-[#d4a017] text-[#1a1a1a] py-4 px-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contactos e Localização
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-[#1a1a1a] mb-1 text-xs uppercase tracking-wider">
                Telefone
              </p>
              <p className="text-[#6b6b6b]">941-000-517</p>
              <p className="text-[#6b6b6b]">924-591-350</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1a1a] mb-1 text-xs uppercase tracking-wider">
                WhatsApp
              </p>
              <p className="text-[#6b6b6b]">941-000-517</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-semibold text-[#1a1a1a] mb-1 text-xs uppercase tracking-wider">
                Endereço
              </p>
              <p className="text-[#6b6b6b]">
                Lunda Sul — Saurimo, Cassengo, Bairro Social da Juventude, 1º
                Andar do Centro Comercial do Emporio
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-semibold text-[#1a1a1a] mb-1 text-xs uppercase tracking-wider">
                Horário
              </p>
              <p className="text-[#6b6b6b]">
                Segunda a Sexta-feira: 08:00 — 16:00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ==============================================================
   8. NOTÍCIAS
   ============================================================== */
const NEWS = [
  {
    date: '28 Janeiro 2025',
    title: 'C.P.C.M.T.Q.L.S inicia campanha de registo massivo na Lunda Sul',
    excerpt:
      'O Conselho Provincial lançou uma campanha especial de registo que pretende abranger mais de 500 condutores nos próximos três meses. A iniciativa inclui unidades móveis que percorrerão os municípios da província.',
    tag: 'Registo',
  },
  {
    date: '15 Janeiro 2025',
    title: 'Novo sistema de alertas para validade de licenças já está operacional',
    excerpt:
      'O conselho implementou com sucesso um sistema de alertas que notifica os condutores 90, 60 e 30 dias antes da expiração das suas licenças profissionais. O sistema funciona via SMS e WhatsApp.',
    tag: 'Tecnologia',
  },
  {
    date: '5 Janeiro 2025',
    title: 'Licenças profissionais em cartão PVC agora disponíveis na Lunda Sul',
    excerpt:
      'Após meses de preparação, o C.P.C.M.T.Q.L.S começou a emitir licenças profissionais em cartão PVC com QR Code de verificação, elevando a qualidade e segurança do documento de identificação do condutor.',
    tag: 'Licenças',
  },
  {
    date: '20 Dezembro 2024',
    title: 'Conselho realiza assembleia geral com mais de 200 condutores presentes',
    excerpt:
      'A assembleia geral ordinária de 2024 contou com a presença de mais de 200 condutores registados, onde foram apresentados os resultados do ano e aprovado o plano de actividades para 2025.',
    tag: 'Assembleia',
  },
];

function NoticiasContent() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Últimas notícias e comunicados do conselho
        </p>
      </div>

      <div className="space-y-4">
        {NEWS.map((news, idx) => (
          <Card
            key={idx}
            className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex gap-4">
                {/* Newspaper icon */}
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#1a5c2e]/10 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1a5c2e]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center rounded-full bg-[#1a5c2e]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#1a5c2e] uppercase tracking-wider">
                      {news.tag}
                    </span>
                    <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {news.date}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-snug group-hover:text-[#1a5c2e] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed">
                    {news.excerpt}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#1a5c2e] opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3.5 h-3.5" />
                    Ler mais
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ==============================================================
   MAIN EXPORT: SectionPageContent
   ============================================================== */
export function SectionPageContent({
  section,
  onBack,
}: {
  section: string;
  onBack: () => void;
}) {
  const title =
    SECTION_TITLES[section] || 'Secção';

  const renderContent = () => {
    switch (section) {
      case 'director-message':
        return <DirectorMessageContent />;
      case 'eventos':
        return <EventosContent />;
      case 'legislacao':
        return <LegislacaoContent />;
      case 'faqs':
        return <FaqsContent />;
      case 'documentos':
        return <DocumentosContent />;
      case 'galeria':
        return <GaleriasContent />;
      case 'sobre':
        return <SobreContent />;
      case 'noticias':
        return <NoticiasContent />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <FileText className="w-12 h-12 text-[#d1d1cc] mb-4" />
            <p className="text-[#6b6b6b] text-sm">
              Secção não encontrada
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <SectionHeader title={title} onBack={onBack} />
      <main className="flex-1">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-[#0f3d1d] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="font-semibold text-xs">C.P.C.M.T.Q.L.S</p>
          <p className="opacity-60 text-[10px] mt-1">
            Condutores organizados, trânsito mais seguro | Decreto Presidencial
            Nº 245/15
          </p>
        </div>
      </footer>
    </div>
  );
}
