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
      className="group block rounded-xl bg-black/60 border border-white/25 p-6 hover:bg-black/70 hover:border-[#d4a017]/50 transition-colors duration-150 text-center backdrop-blur-sm"
    >
      {/* Icon */}
      <div className="w-14 h-14 mx-auto mb-4">
        <div className="w-14 h-14 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-[#d4a017]/20 group-hover:border-[#d4a017]/50 transition-colors duration-150">
          <IconComponent className="w-6 h-6 text-white group-hover:text-[#d4a017] transition-colors duration-150" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-2 leading-snug group-hover:text-[#d4a017] transition-colors duration-150">
        {card.titulo}
      </h3>

      {/* Description */}
      <p className="text-white/85 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 group-hover:text-white transition-colors duration-150">
        {card.descricao}
      </p>

      {/* Bottom gold accent line */}
      <div className="mt-4 mx-auto w-0 group-hover:w-10 h-[2px] bg-[#d4a017] transition-all duration-150" />
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl bg-black/60 border border-white/25 p-6 animate-pulse">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/15" />
      <div className="h-4 w-3/4 mx-auto bg-white/10 rounded mb-2" />
      <div className="h-3 w-full bg-white/10 rounded mb-1" />
      <div className="h-3 w-5/6 mx-auto bg-white/10 rounded" />
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
          {/* Blur overlay on the background image */}
          <div className="absolute inset-0 backdrop-blur-[3px]" />
        </>
      )}

      {/* Gradient fallback if no background image */}
      {!hasBgImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]" />
      )}

      {/* Dark overlay for text and card readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#d4a017]/[0.03] blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-white/[0.04] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-14">
          {/* Gold decorative element */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-16 h-[1px] bg-gradient-to-r from-transparent to-[#d4a017]/70" />
            <span className="block w-2.5 h-2.5 rounded-full bg-[#d4a017] shadow-sm shadow-[#d4a017]/30" />
            <span className="block w-16 h-[1px] bg-gradient-to-l from-transparent to-[#d4a017]/70" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            {section.titulo || 'Explore Nosso Conselho'}
          </h2>

          {section.subtitulo && (
            <p className="text-white/70 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
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
            <MessageSquare className="w-12 h-12 mx-auto text-white/20 mb-4" />
            <p className="text-white/50 text-sm">
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
          <span className="block w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent" />
        </div>
      </div>

      {/* Decorative bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017]/60 to-transparent" />
    </section>
  );
}
