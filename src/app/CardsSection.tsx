'use client';

import { useState, useEffect, useCallback, type ComponentType, type LucideProps } from 'react';
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
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Icon mapping from string names to components
const iconMap: Record<string, ComponentType<LucideProps>> = {
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Newspaper,
};

interface CardItem {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  link: string;
  ordem: number;
  activo: boolean;
}

interface CardsSectionData {
  titulo: string;
  subtitulo: string;
  imagem_fundo_base64: string;
  imagem_fundo_tipo: string;
}

function CardBox({ card }: { card: CardItem }) {
  const IconComponent = iconMap[card.icone] || MessageSquare;

  return (
    <Link
      href={'/paginas/' + card.id}
      className="group block rounded-2xl bg-white/70 border border-white/60 p-6 hover:bg-white/90 hover:border-[#2d7a42]/40 hover:shadow-xl hover:shadow-green-900/10 hover:-translate-y-2 transition-all duration-300 text-center backdrop-blur-sm"
    >
      {/* Icon */}
      <div className="w-14 h-14 mx-auto mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] border border-[#a5d6a7]/50 flex items-center justify-center group-hover:from-[#1a5c2e] group-hover:to-[#2d7a42] group-hover:border-[#1a5c2e] group-hover:shadow-lg group-hover:shadow-green-900/20 transition-all duration-300">
          <IconComponent className="w-6 h-6 text-[#1a5c2e] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[#1a3a24] font-bold text-sm sm:text-base lg:text-lg mb-2 leading-snug group-hover:text-[#1a5c2e] transition-colors duration-300">
        {card.titulo}
      </h3>

      {/* Description */}
      <p className="text-[#4a6b54] text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 group-hover:text-[#2a4a34] transition-colors duration-300">
        {card.descricao}
      </p>

      {/* Bottom accent line */}
      <div className="mt-4 mx-auto w-0 group-hover:w-10 h-[2px] bg-[#1a5c2e] rounded-full transition-all duration-300" />
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/70 border border-white/60 p-6 animate-pulse backdrop-blur-sm">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#e8f5e9]" />
      <div className="h-4 w-3/4 mx-auto bg-[#c8e6c9]/60 rounded mb-2" />
      <div className="h-3 w-full bg-[#c8e6c9]/40 rounded mb-1" />
      <div className="h-3 w-5/6 mx-auto bg-[#c8e6c9]/40 rounded" />
    </div>
  );
}

export default function CardsSection() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [section, setSection] = useState<CardsSectionData>({
    titulo: 'Explore Nosso Conselho',
    subtitulo: '',
    imagem_fundo_base64: '',
    imagem_fundo_tipo: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
        setSection(data.section || {});
      }
    } catch {
      // silent fail, show defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasBgImage = !!section.imagem_fundo_base64;

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Blur Overlay */}
      {hasBgImage && (
        <>
          <img
            src={`data:${section.imagem_fundo_tipo || 'image/jpeg'};base64,${section.imagem_fundo_base64}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-105"
            aria-hidden="true"
          />
          {/* Strong blur overlay for light design */}
          <div className="absolute inset-0 backdrop-blur-[6px] bg-white/50" />
        </>
      )}

      {/* Light green gradient background */}
      {!hasBgImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#f1f8e9] to-[#dcedc8]" />
      )}

      {/* Subtle decorative blurred circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#a5d6a7]/30 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#c8e6c9]/40 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#dcedc8]/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#e8f5e9]/60 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-14">
          {/* Green decorative element */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-16 h-[1px] bg-gradient-to-r from-transparent to-[#1a5c2e]/40" />
            <span className="block w-2.5 h-2.5 rounded-full bg-[#1a5c2e] shadow-sm shadow-[#1a5c2e]/20" />
            <span className="block w-16 h-[1px] bg-gradient-to-l from-transparent to-[#1a5c2e]/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1a3a24] mb-3">
            {section.titulo || 'Explore Nosso Conselho'}
          </h2>

          {section.subtitulo && (
            <p className="text-[#4a6b54] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              {section.subtitulo}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-[#a5d6a7]/50 mb-4" />
            <p className="text-[#4a6b54]/60 text-sm">
              Nenhum card disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {cards.map((card, index) => (
              <CardBox key={card.id} card={card} />
            ))}
          </div>
        )}

        {/* Bottom decorative accent */}
        <div className="mt-14 flex items-center justify-center">
          <span className="block w-24 h-[1px] bg-gradient-to-r from-transparent via-[#1a5c2e]/25 to-transparent" />
        </div>
      </div>

      {/* Decorative bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a5c2e]/30 to-transparent" />
    </section>
  );
}
