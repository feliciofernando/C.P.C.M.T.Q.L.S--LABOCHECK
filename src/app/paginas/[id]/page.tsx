import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import Navbar from '@/app/Navbar';
import Link from 'next/link';
import {
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Newspaper,
  type LucideIcon,
} from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Newspaper,
};

interface CardPage {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  conteudo: string;
  ordem: number;
  activo: boolean;
}

export default async function PaginaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f5f5f0]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-[#1a5c2e]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">
            Página Não Encontrada
          </h1>
          <p className="text-[#6b6b6b] mb-8">
            A página que procura não existe ou foi removida.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5c2e] text-white rounded-lg hover:bg-[#0f3d1d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  const card = toCamelCase<CardPage>(data);
  const IconComponent = iconMap[card.icone] || MessageSquare;

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 right-8 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-8 left-6 w-24 h-24 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full" />
        </div>

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Content over gradient */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          {/* Gold decorative line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-[#d4a017]/60" />
            <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
            <div className="h-[1px] w-12 bg-[#d4a017]/60" />
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border-2 border-[#d4a017]/50 flex items-center justify-center mb-5">
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-2">
            {card.titulo}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl text-center">
            {card.descricao}
          </p>
        </div>

        {/* Bottom gold accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent" />
      </div>

      {/* Content section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 text-sm font-medium text-[#1a5c2e] bg-[#1a5c2e]/10 rounded-lg hover:bg-[#1a5c2e]/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Full content */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#d1d1cc] p-6 sm:p-10">
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#1a5c2e]/10 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-[#1a5c2e]" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">
              {card.titulo}
            </h2>
          </div>

          {/* Gold divider */}
          <div className="h-[2px] w-20 bg-gradient-to-r from-[#d4a017] to-transparent mb-8" />

          {/* Description */}
          <p className="text-[#1a1a1a] text-base leading-relaxed mb-6 font-medium">
            {card.descricao}
          </p>

          {/* Full conteudo */}
          {card.conteudo ? (
            <div
              className="text-sm sm:text-base leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#1a1a1a] [&_h1]:mb-3 [&_h1]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#1a1a1a] [&_h2]:mb-2 [&_h2]:mt-5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#1a5c2e] [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-[#d4a017] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6b6b6b] [&_blockquote]:my-4 [&_strong]:font-bold [&_strong]:text-[#1a1a1a] [&_em]:italic [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-3 [&_hr]:border-[#d1d1cc] [&_hr]:my-6"
              dangerouslySetInnerHTML={{ __html: card.conteudo }}
            />
          ) : (
            <p className="text-[#6b6b6b] text-sm italic">
              Conteúdo em breve disponível.
            </p>
          )}

          {/* Bottom gold accent */}
          <div className="mt-10 h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />

          {/* Contact info card */}
          <div className="mt-8 bg-[#f5f5f0] rounded-xl p-6 border border-[#d1d1cc]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
              <span className="text-xs font-bold text-[#1a5c2e] uppercase tracking-wide">
                Precisa de Mais Informações?
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p className="text-[#6b6b6b]">
                <span className="font-medium text-[#1a1a1a]">Localização:</span>{' '}
                Cassengo, Bairro Social da Juventude, Saurimo
              </p>
              <p className="text-[#6b6b6b]">
                <span className="font-medium text-[#1a1a1a]">Horário:</span>{' '}
                Segunda a Sexta, 08:00 - 16:00
              </p>
              <p className="text-[#6b6b6b]">
                <span className="font-medium text-[#1a1a1a]">Telefone:</span>{' '}
                941-000-517 / 924-591-350
              </p>
            </div>
          </div>
        </div>

        {/* Bottom back link */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a5c2e] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
