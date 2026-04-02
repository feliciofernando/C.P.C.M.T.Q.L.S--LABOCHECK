'use client';

import {
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FolderOpen,
  Users,
  Building2,
  Newspaper,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ExploreSectionProps {
  onNavigate: (section: string) => void;
}

interface ExploreCard {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const cards: ExploreCard[] = [
  {
    key: 'director-message',
    title: 'Mensagem do Director',
    description: 'Leia a mensagem do nosso Director Executivo',
    icon: MessageSquare,
  },
  {
    key: 'eventos',
    title: 'Eventos',
    description: 'Confira os nossos proximos eventos',
    icon: Calendar,
  },
  {
    key: 'legislacao',
    title: 'Legislacao',
    description: 'Acesse documentos legais importantes',
    icon: Scale,
  },
  {
    key: 'faqs',
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas para duvidas comuns',
    icon: HelpCircle,
  },
  {
    key: 'documentos',
    title: 'Documentos',
    description: 'Acesse documentos importantes do Conselho',
    icon: FolderOpen,
  },
  {
    key: 'galeria',
    title: 'Galeria dos Directores',
    description: 'Conheca os lideres da nossa historia',
    icon: Users,
  },
  {
    key: 'sobre',
    title: 'Sobre o Conselho',
    description: 'Saiba mais sobre a nossa instituicao',
    icon: Building2,
  },
  {
    key: 'noticias',
    title: 'Noticias',
    description: 'Fique por dentro das ultimas novidades',
    icon: Newspaper,
  },
];

export default function ExploreSection({ onNavigate }: ExploreSectionProps) {
  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #1a5c2e 0%, #0f3d1d 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Explore Nosso Site
          </h2>
          <div className="mt-3 h-1 w-20 mx-auto rounded-full bg-white/30" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => {
            const IconComponent = card.icon;

            return (
              <button
                key={card.key}
                onClick={() => onNavigate(card.key)}
                className="
                  group
                  relative
                  flex flex-col items-center justify-center
                  text-center
                  rounded-2xl
                  bg-white/15
                  backdrop-blur-sm
                  border border-white/10
                  px-6 py-8 sm:px-8 sm:py-10
                  shadow-lg shadow-black/10
                  cursor-pointer
                  transition-all duration-300 ease-out
                  hover:scale-[1.04]
                  hover:bg-white/25
                  hover:shadow-xl hover:shadow-black/20
                  hover:border-white/20
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/50
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#1a5c2e]
                "
              >
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                  <IconComponent className="h-7 w-7 text-white" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
