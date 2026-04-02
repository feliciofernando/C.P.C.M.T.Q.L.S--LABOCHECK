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
  ChevronRight,
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
  gradient: string;
}

const cards: ExploreCard[] = [
  {
    key: 'director-message',
    title: 'Mensagem do Director',
    description: 'Leia a mensagem do nosso Director Executivo',
    icon: MessageSquare,
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    key: 'eventos',
    title: 'Eventos',
    description: 'Confira os proximos eventos',
    icon: Calendar,
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    key: 'legislacao',
    title: 'Legislacao',
    description: 'Acesse documentos legais importantes',
    icon: Scale,
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    key: 'faqs',
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas para duvidas comuns',
    icon: HelpCircle,
    gradient: 'from-lime-500/20 to-green-500/20',
  },
  {
    key: 'documentos',
    title: 'Documentos',
    description: 'Acesse documentos importantes do Conselho',
    icon: FolderOpen,
    gradient: 'from-green-500/20 to-lime-500/20',
  },
  {
    key: 'galeria',
    title: 'Galeria dos Directores',
    description: 'Conheca os lideres da nossa historia',
    icon: Users,
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
  {
    key: 'sobre',
    title: 'Sobre o Conselho',
    description: 'Saiba mais sobre a nossa instituicao',
    icon: Building2,
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    key: 'noticias',
    title: 'Noticias',
    description: 'Fique por dentro das ultimas novidades',
    icon: Newspaper,
    gradient: 'from-cyan-500/20 to-teal-500/20',
  },
];

export default function ExploreSection({ onNavigate }: ExploreSectionProps) {
  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Cover Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/explore-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Green Gradient Blur Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0f3d1d]/70 via-[#1a5c2e]/60 to-[#0a2e15]/80 backdrop-blur-sm" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-[#1a5c2e]/40 via-transparent to-[#0f3d1d]/50" />

      {/* Subtle noise texture overlay for Apple feel */}
      <div className="absolute inset-0 z-[3] opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Explore Nosso Site
          </h2>
          <p className="mt-3 text-white/70 text-sm sm:text-base max-w-md mx-auto">
            Descubra tudo sobre o Conselho Provincial e os servicos disponiveis
          </p>
          <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-white/40 to-white/10" />
        </div>

        {/* Cards Grid - Apple Frosted Glass Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <button
                key={card.key}
                onClick={() => onNavigate(card.key)}
                className="
                  group
                  relative
                  flex flex-col items-start
                  text-left
                  rounded-3xl
                  bg-white/[0.12]
                  backdrop-blur-xl
                  backdrop-saturate-[1.8]
                  border border-white/[0.18]
                  p-6 sm:p-7
                  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                  cursor-pointer
                  transition-all duration-500 ease-out
                  hover:scale-[1.03]
                  hover:bg-white/[0.22]
                  hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]
                  hover:border-white/[0.28]
                  active:scale-[0.98]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/50
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#1a5c2e]
                "
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-24 rounded-t-3xl bg-gradient-to-br ${card.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

                {/* Icon Container */}
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.15] backdrop-blur-md border border-white/[0.12] shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover:bg-white/[0.25] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <IconComponent
                    className="h-6 w-6 text-white drop-shadow-sm"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Title */}
                <h3 className="relative text-base sm:text-lg font-semibold text-white leading-snug drop-shadow-sm">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="relative mt-2 text-sm text-white/65 leading-relaxed line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
                  {card.description}
                </p>

                {/* Arrow indicator */}
                <div className="relative mt-auto pt-5 flex items-center gap-1.5 text-white/50 group-hover:text-white/90 transition-all duration-300 group-hover:gap-2.5">
                  <span className="text-xs font-medium">Saber mais</span>
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
