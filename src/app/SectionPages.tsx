'use client';

import { useState, useEffect } from 'react';
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
   TYPES
   ============================================================== */
interface DirectorMessage {
  id?: string;
  title: string;
  subtitle?: string;
  content: string;
  authorName?: string;
  authorPosition?: string;
}

interface Evento {
  id?: string;
  title: string;
  description: string;
  eventDate?: string;
  displayDate?: string;
  location?: string;
  type?: string;
}

interface Legislacao {
  id?: string;
  title: string;
  description?: string;
  category?: string;
}

interface Faq {
  id?: string;
  question: string;
  answer: string;
}

interface Documento {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  fileUrl?: string;
}

interface Director {
  id?: string;
  name: string;
  position?: string;
  description?: string;
  photoUrl?: string;
}

interface SiteSection {
  id?: string;
  sectionKey: string;
  title: string;
  content?: string;
  icon?: string;
}

interface Noticia {
  id?: string;
  title: string;
  content?: string;
  excerpt?: string;
  tag?: string;
  newsDate?: string;
  displayDate?: string;
}

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
   LOADING SKELETON
   ============================================================== */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-8 h-8 border-[3px] border-[#d1d1cc] border-t-[#1a5c2e] rounded-full animate-spin mb-4" />
      <p className="text-sm text-[#6b6b6b]">A carregar...</p>
    </div>
  );
}

/* ==============================================================
   EMPTY STATE
   ============================================================== */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <FileText className="w-12 h-12 text-[#d1d1cc] mb-4" />
      <p className="text-sm text-[#6b6b6b]">{message}</p>
    </div>
  );
}

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
  const [message, setMessage] = useState<DirectorMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/director-message')
      .then((res) => res.json())
      .then((data) => setMessage(data))
      .catch(() => setMessage(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (!message) return <EmptyState message="Nenhum conteúdo disponível" />;

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
                {message.title || 'Mensagem do Director Executivo'}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-10 py-6">
          <div className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed space-y-4">
            {message.subtitle && (
              <p className="text-xs text-[#6b6b6b]">{message.subtitle}</p>
            )}

            <Separator className="bg-[#d1d1cc] my-4" />

            <div className="text-sm text-[#6b6b6b] leading-relaxed space-y-4">
              {message.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="indent-8 text-justify">
                  {paragraph}
                </p>
              ))}
            </div>

            <Separator className="bg-[#d1d1cc] my-6" />

            <div className="flex flex-col items-start sm:items-end">
              <p className="font-semibold text-[#1a5c2e]">Com os melhores cumprimentos,</p>
              <div className="mt-4 w-24 h-0.5 bg-[#d4a017]" />
              <p className="mt-2 font-bold text-[#1a1a1a]">
                {message.authorName || 'O Director Executivo'}
              </p>
              {message.authorPosition && (
                <p className="text-xs text-[#6b6b6b]">
                  {message.authorPosition}
                </p>
              )}
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
function EventosContent() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/eventos')
      .then((res) => res.json())
      .then((data) => setEventos(Array.isArray(data) ? data : []))
      .catch(() => setEventos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (eventos.length === 0) return <EmptyState message="Nenhum conteúdo disponível" />;

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
          {eventos.map((event, idx) => (
            <Card
              key={event.id || idx}
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
                      {event.type && (
                        <span className="inline-flex items-center rounded-full bg-[#1a5c2e]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#1a5c2e] uppercase tracking-wider">
                          {event.type}
                        </span>
                      )}
                      {(event.displayDate || event.eventDate) && (
                        <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.displayDate || event.eventDate}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-tight">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed mb-2">
                        {event.description}
                      </p>
                    )}

                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-[#1a5c2e]">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
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
function LegislacaoContent() {
  const [legislacao, setLegislacao] = useState<Legislacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/legislacao')
      .then((res) => res.json())
      .then((data) => setLegislacao(Array.isArray(data) ? data : []))
      .catch(() => setLegislacao([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (legislacao.length === 0) return <EmptyState message="Nenhum conteúdo disponível" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Base legal e diplomas relevantes para a organização
        </p>
      </div>

      <div className="space-y-3">
        {legislacao.map((item, idx) => (
          <Card
            key={item.id || idx}
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
                    {item.category && (
                      <span className="inline-flex items-center rounded-full bg-[#d4a017]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#b8860b] uppercase tracking-wider">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed">
                      {item.description}
                    </p>
                  )}
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
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/faqs')
      .then((res) => res.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Respostas às questões mais frequentes dos condutores
        </p>
      </div>

      {faqs.length === 0 ? (
        <EmptyState message="Nenhum conteúdo disponível" />
      ) : (
        <>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FaqItem key={faq.id || idx} question={faq.question} answer={faq.answer} />
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
        </>
      )}
    </div>
  );
}

/* ==============================================================
   5. DOCUMENTOS
   ============================================================== */
function DocumentosContent() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/documentos')
      .then((res) => res.json())
      .then((data) => setDocumentos(Array.isArray(data) ? data : []))
      .catch(() => setDocumentos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (documentos.length === 0) return <EmptyState message="Nenhum conteúdo disponível" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Documentos disponíveis para consulta e download
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentos.map((doc, idx) => (
          <Card
            key={doc.id || idx}
            className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#1a5c2e]/10 text-[#1a5c2e]">
                <FolderOpen className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-base text-[#1a1a1a] mb-1.5">
                {doc.title}
              </h3>
              {doc.description && (
                <p className="text-xs text-[#6b6b6b] leading-relaxed mb-4">
                  {doc.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                {doc.category && (
                  <span className="inline-flex items-center rounded-full bg-[#d4a017]/15 px-2 py-0.5 text-[10px] font-semibold text-[#b8860b] uppercase tracking-wider">
                    {doc.category}
                  </span>
                )}
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
function GaleriasContent() {
  const [directores, setDirectores] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/directores')
      .then((res) => res.json())
      .then((data) => setDirectores(Array.isArray(data) ? data : []))
      .catch(() => setDirectores([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (directores.length === 0) return <EmptyState message="Nenhum conteúdo disponível" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Equipa de direcção do conselho provincial
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {directores.map((director, idx) => {
          const initials = director.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2);

          return (
            <Card
              key={director.id || idx}
              className="border-[#d1d1cc] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar circle */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1a5c2e] to-[#2d7a42] flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {initials}
                    </span>
                  </div>

                  {/* Gold ring accent */}
                  <div className="w-12 h-0.5 bg-[#d4a017] mb-3" />

                  <h3 className="font-bold text-base sm:text-lg text-[#1a1a1a] mb-0.5">
                    {director.name}
                  </h3>
                  {director.position && (
                    <p className="text-xs font-semibold text-[#1a5c2e] mb-2">
                      {director.position}
                    </p>
                  )}
                  {director.description && (
                    <p className="text-xs text-[#6b6b6b] leading-relaxed max-w-xs">
                      {director.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ==============================================================
   7. SOBRE O CONSELHO
   ============================================================== */
function SobreContent() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/sections')
      .then((res) => res.json())
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  const getSection = (key: string) => sections.find((s) => s.sectionKey === key);
  const missao = getSection('missao');
  const visao = getSection('visao');
  const historia = getSection('historia');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Mission */}
      {missao ? (
        <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
          <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5" />
              {missao.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="text-sm text-[#6b6b6b] leading-relaxed space-y-4">
              {(missao.content || '').split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-justify indent-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Vision */}
      {visao ? (
        <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
          <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {visao.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="text-sm text-[#6b6b6b] leading-relaxed space-y-4">
              {(visao.content || '').split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-justify indent-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Values (static) */}
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
      {historia ? (
        <Card className="border-[#d1d1cc] shadow-sm mb-4 overflow-hidden">
          <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {historia.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="text-sm text-[#6b6b6b] leading-relaxed space-y-4">
              {(historia.content || '').split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-justify indent-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Contact (static) */}
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

      {/* Empty state if no dynamic sections at all */}
      {!missao && !visao && !historia && (
        <EmptyState message="Nenhum conteúdo disponível" />
      )}
    </div>
  );
}

/* ==============================================================
   8. NOTÍCIAS
   ============================================================== */
function NoticiasContent() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/site/noticias')
      .then((res) => res.json())
      .then((data) => setNoticias(Array.isArray(data) ? data : []))
      .catch(() => setNoticias([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (noticias.length === 0) return <EmptyState message="Nenhum conteúdo disponível" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-[#d4a017]" />
        <p className="text-sm text-[#6b6b6b]">
          Últimas notícias e comunicados do conselho
        </p>
      </div>

      <div className="space-y-4">
        {noticias.map((news, idx) => (
          <Card
            key={news.id || idx}
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
                    {news.tag && (
                      <span className="inline-flex items-center rounded-full bg-[#1a5c2e]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#1a5c2e] uppercase tracking-wider">
                        {news.tag}
                      </span>
                    )}
                    {(news.displayDate || news.newsDate) && (
                      <span className="text-xs text-[#6b6b6b] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {news.displayDate || news.newsDate}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] mb-1.5 leading-snug group-hover:text-[#1a5c2e] transition-colors">
                    {news.title}
                  </h3>
                  {(news.excerpt || news.content) && (
                    <p className="text-xs sm:text-sm text-[#6b6b6b] leading-relaxed">
                      {news.excerpt || news.content}
                    </p>
                  )}

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
