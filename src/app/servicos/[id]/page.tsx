import { supabase } from '@/lib/supabase-server';
import { toCamelCase } from '@/lib/utils-supabase';
import Navbar from '@/app/Navbar';
import Link from 'next/link';
import {
  UserPlus,
  CreditCard,
  GraduationCap,
  Shield,
  Wrench,
  FileCheck,
  Users,
  Car,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  CreditCard,
  GraduationCap,
  Shield,
  Wrench,
  FileCheck,
  Users,
  Car,
  BookOpen,
};

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  imagemBase64: string;
  imagemTipo: string;
  conteudo: string;
  ordem: number;
  activo: boolean;
}

export default async function ServicoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f5f5f0]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-[#1a5c2e]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">
            Servico Nao Encontrado
          </h1>
          <p className="text-[#6b6b6b] mb-8">
            O servico que procura nao existe ou foi removido.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a5c2e] text-white rounded-lg hover:bg-[#0f3d1d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Inicio
          </Link>
        </div>
      </div>
    );
  }

  const servico = toCamelCase<Servico>(data);
  const IconComponent = iconMap[servico.icone] || Shield;
  const hasImage = !!servico.imagemBase64;

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Navbar />

      {/* Hero banner with background image or gradient */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={`data:${servico.imagemTipo || 'image/jpeg'};base64,${servico.imagemBase64}`}
              alt={servico.titulo}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d]" />
        )}

        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Content over image */}
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
            {servico.titulo}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl text-center">
            {servico.descricao}
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
              {servico.titulo}
            </h2>
          </div>

          {/* Gold divider */}
          <div className="h-[2px] w-20 bg-gradient-to-r from-[#d4a017] to-transparent mb-8" />

          {/* Description */}
          <p className="text-[#1a1a1a] text-base leading-relaxed mb-6 font-medium">
            {servico.descricao}
          </p>

          {/* Full conteudo */}
          {servico.conteudo ? (
            <div className="prose prose-sm sm:prose max-w-none">
              {servico.conteudo.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) {
                  return <div key={index} className="h-4" />;
                }

                // Check if it's a numbered list item
                const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
                if (numberedMatch) {
                  return (
                    <div key={index} className="flex gap-3 mb-3 pl-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1a5c2e] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {numberedMatch[1]}
                      </span>
                      <div>
                        <p className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed font-medium">
                          {numberedMatch[2]}
                        </p>
                      </div>
                    </div>
                  );
                }

                // Check if it's a bullet point
                if (trimmed.startsWith('- ')) {
                  return (
                    <div key={index} className="flex items-start gap-2.5 mb-2 pl-4">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#d4a017] mt-2" />
                      <p className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed">
                        {trimmed.substring(2)}
                      </p>
                    </div>
                  );
                }

                // Check if it's a sub-heading (ends with colon or is short)
                if (
                  trimmed.endsWith(':') ||
                  (trimmed.length < 60 && !trimmed.includes('.') && trimmed === trimmed.toUpperCase())
                ) {
                  return (
                    <h3
                      key={index}
                      className="text-[#1a5c2e] font-bold text-sm sm:text-base mt-6 mb-3 uppercase tracking-wide"
                    >
                      {trimmed}
                    </h3>
                  );
                }

                // Regular paragraph
                return (
                  <p
                    key={index}
                    className="text-[#6b6b6b] text-sm sm:text-base leading-relaxed mb-4"
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-[#6b6b6b] text-sm italic">
              Conteudo em breve disponivel.
            </p>
          )}

          {/* Bottom gold accent */}
          <div className="mt-10 h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4a017]/30 to-transparent" />

          {/* Contact info card */}
          <div className="mt-8 bg-[#f5f5f0] rounded-xl p-6 border border-[#d1d1cc]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
              <span className="text-xs font-bold text-[#1a5c2e] uppercase tracking-wide">
                Informacoes de Contacto
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p className="text-[#6b6b6b]">
                <span className="font-medium text-[#1a1a1a]">Localizacao:</span>{' '}
                Cassengo, Bairro Social da Juventude, Saurimo
              </p>
              <p className="text-[#6b6b6b]">
                <span className="font-medium text-[#1a1a1a]">Horario:</span>{' '}
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
            Voltar a pagina inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
