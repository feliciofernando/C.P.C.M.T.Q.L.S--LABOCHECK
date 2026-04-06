'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MessageSquare,
  Calendar,
  Scale,
  HelpCircle,
  FileText,
  Users,
  Building2,
  Newspaper,
  ArrowLeft,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import Navbar from '@/app/Navbar';

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

interface CardItem {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  icone: string;
  link: string;
  ordem: number;
  activo: boolean;
}

export default function PaginaDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [card, setCard] = useState<CardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCard = async () => {
      try {
        const res = await fetch('/api/cards');
        if (res.ok) {
          const data = await res.json();
          const found = (data.cards || []).find(
            (c: CardItem) => c.id === id
          );
          if (found) {
            setCard(found);
          } else {
            setNotFound(true);
          }
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
            <p className="text-sm text-[#6b6b6b]">A carregar página...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-[#1a5c2e]/40" />
            </div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">
              Página não encontrada
            </h1>
            <p className="text-sm text-[#6b6b6b]">
              A página que procura não existe ou foi removida.
            </p>
            <Link href="/">
              <Button className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[card.icone] || MessageSquare;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Navbar />

      {/* Hero Banner (gradient only since cards don't have images) */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f3d1d] via-[#1a5c2e] to-[#0f3d1d]" />

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-white/10 rounded-full" />
          <div className="absolute top-8 right-1/4 w-20 h-20 border border-[#d4a017]/20 rounded-full" />
          <div className="absolute bottom-12 left-1/3 w-32 h-32 border border-white/5 rounded-full" />
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8" />
          </div>
          <div className="w-12 h-[2px] bg-[#d4a017] mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight max-w-3xl">
            {card.titulo}
          </h1>
          {card.descricao && (
            <p className="text-white/80 text-sm sm:text-base mt-3 text-center max-w-2xl">
              {card.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-4xl mx-auto w-full px-4 -mt-6 relative z-20">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-white border-[#d1d1cc] hover:bg-[#e8e8e3] text-[#1a1a1a] gap-2 shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </Link>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-xl border border-[#d1d1cc] shadow-sm overflow-hidden">
          {/* Card header accent */}
          <div className="h-1 bg-gradient-to-r from-[#1a5c2e] via-[#d4a017] to-[#1a5c2e]" />

          <div className="p-6 sm:p-8">
            {/* Title + icon row */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#1a5c2e]/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-[#1a5c2e]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  {card.titulo}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-[#d4a017] text-[#d4a017]"
                  >
                    {card.icone}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-[#d1d1cc] mb-6" />

            {/* Description */}
            {card.descricao && (
              <div className="mb-6">
                <p className="text-sm text-[#6b6b6b] leading-relaxed italic">
                  {card.descricao}
                </p>
              </div>
            )}

            {/* Full content */}
            {card.conteudo ? (
              <div className="prose prose-sm max-w-none">
                <div className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {card.conteudo}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#6b6b6b]">
                  Conteúdo detalhado desta secção será disponibilizado em breve.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom back button */}
        <div className="mt-6 text-center">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#6b6b6b] hover:text-[#1a5c2e] gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar a página inicial
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer id="contactos" className="bg-[#0f3d1d] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="font-semibold text-sm">C.P.C.M.T.Q.L.S</p>
          <p className="opacity-80 text-xs mt-1">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e
            Quadriciclos da Lunda Sul
          </p>
          <Separator className="bg-white/20 my-3 max-w-xs mx-auto" />
          <p className="opacity-70 text-xs">
            Contactos: 941-000-517 / 924-591-350 | WhatsApp: 941-000-517
          </p>
          <p className="opacity-60 text-xs mt-1">
            Lunda Sul (Cassengo, Bairro Social da Juventude, 1º Andar do Centro
            Comercial do Empório, vulgo Janota)
          </p>
          <p className="opacity-50 text-xs mt-2">
            Condutores organizados, transito mais seguro | Decreto Presidencial
            Nº 245/15
          </p>
        </div>
      </footer>
    </div>
  );
}
