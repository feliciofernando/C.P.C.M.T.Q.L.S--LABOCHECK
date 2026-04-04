'use client';

import { useState, useEffect } from 'react';
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

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  imagemBase64: string;
  imagemTipo: string;
  ordem: number;
  activo: boolean;
}

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

// Gradient fallbacks for cards without images
const gradientFallbacks = [
  'from-[#1a5c2e] to-[#0f3d1d]',
  'from-[#0f3d1d] to-[#1a5c2e]',
  'from-[#2d7a42] to-[#0f3d1d]',
  'from-[#0f3d1d] to-[#2d7a42]',
];

export default function ServicosSection() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/servicos')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.data) {
          setServicos(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="servicos" className="py-12 lg:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] text-center mb-8">Os Nossos Servicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-[#e8e8e3] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (servicos.length === 0) {
    return (
      <section id="servicos" className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Os Nossos Servicos</h2>
          <p className="text-[#6b6b6b] text-sm lg:text-base">Nenhum servico disponivel no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="py-12 lg:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-12 lg:w-16 bg-[#d4a017]/60" />
            <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
            <div className="h-[1px] w-12 lg:w-16 bg-[#d4a017]/60" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a]">Os Nossos Servicos</h2>
          <p className="text-sm lg:text-base text-[#6b6b6b] mt-1">
            Solucoes completas para condutores profissionais
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {servicos.map((servico, index) => {
            const IconComponent = iconMap[servico.icone] || Shield;
            const hasImage = !!servico.imagemBase64;

            return (
              <Link
                key={servico.id}
                href={'/servicos/' + servico.id}
                className="group block relative rounded-xl overflow-hidden h-64"
              >
                {/* Background image (or gradient fallback) */}
                {hasImage ? (
                  <>
                    <img
                      src={`data:${servico.imagemTipo || 'image/jpeg'};base64,${servico.imagemBase64}`}
                      alt={servico.titulo}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Blur overlay on the image */}
                    <div className="absolute inset-0 backdrop-blur-sm bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
                  </>
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientFallbacks[index % gradientFallbacks.length]} group-hover:opacity-90 transition-opacity duration-300`} />
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
                      <div className="absolute bottom-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
                    </div>
                  </>
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-5 text-center">
                  {/* Icon circle */}
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 group-hover:bg-[#d4a017]/30 transition-colors duration-300">
                    <IconComponent className="w-12 h-12 lg:w-14 lg:h-14" />
                  </div>

                  {/* Gold accent line */}
                  <div className="w-8 h-[2px] bg-[#d4a017] mb-3 group-hover:w-12 transition-all duration-300" />

                  {/* Title */}
                  <h3 className="text-base lg:text-lg font-bold mb-2 group-hover:text-[#d4a017] transition-colors duration-300">
                    {servico.titulo}
                  </h3>

                  {/* Description (hidden on mobile, shown on hover) */}
                  <p className="text-xs lg:text-sm text-white/80 leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {servico.descricao}
                  </p>
                </div>

                {/* Bottom gold accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
