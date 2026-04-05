'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  ArrowLeft,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import Navbar from '@/app/Navbar';

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
  conteudo: string;
  icone: string;
  imagemBase64: string;
  imagemTipo: string;
  ordem: number;
  activo: boolean;
}

export default function ServicoDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [servico, setServico] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchServico = async () => {
      try {
        const res = await fetch('/api/servicos?all=true');
        if (res.ok) {
          const data = await res.json();
          const found = (data.data || []).find(
            (s: Servico) => s.id === id
          );
          if (found) {
            setServico(found);
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

    fetchServico();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
            <p className="text-sm text-[#6b6b6b]">A carregar serviço...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !servico) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-[#1a5c2e]/40" />
            </div>
            <h1 className="text-xl font-bold text-[#1a1a1a]">
              Serviço não encontrado
            </h1>
            <p className="text-sm text-[#6b6b6b]">
              O serviço que procura não existe ou foi removido.
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

  const IconComponent = iconMap[servico.icone] || Shield;
  const hasImage = !!servico.imagemBase64;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={`data:${servico.imagemTipo || 'image/jpeg'};base64,${servico.imagemBase64}`}
              alt={servico.titulo}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 backdrop-blur-[2px]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c2e] via-[#0f3d1d] to-[#1a5c2e]" />
        )}

        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 border-2 border-white/10 rounded-full" />
          <div className="absolute top-8 left-1/4 w-20 h-20 border border-[#d4a017]/20 rounded-full" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4">
            <IconComponent className="w-8 h-8" />
          </div>
          <div className="w-12 h-[2px] bg-[#d4a017] mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight max-w-3xl">
            {servico.titulo}
          </h1>
          {servico.descricao && (
            <p className="text-white/80 text-sm sm:text-base mt-3 text-center max-w-2xl">
              {servico.descricao}
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
                  {servico.titulo}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-[#d4a017] text-[#d4a017]"
                  >
                    {servico.icone}
                  </Badge>
                  <Badge className="bg-[#1a5c2e]/10 text-[#1a5c2e] text-[10px] px-1.5 py-0 border-0">
                    Servico #{servico.ordem + 1}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-[#d1d1cc] mb-6" />

            {/* Description */}
            {servico.descricao && (
              <div className="mb-6">
                <p className="text-sm text-[#6b6b6b] leading-relaxed italic">
                  {servico.descricao}
                </p>
              </div>
            )}

            {/* Full content */}
            {servico.conteudo ? (
              <div className="prose prose-sm max-w-none">
                <div className="text-[#1a1a1a] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {servico.conteudo}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#6b6b6b]">
                  Conteúdo detalhado deste serviço será disponibilizado em breve.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom back button */}
        <div className="mt-6 text-center">
          <Link href="/#servicos">
            <Button
              variant="ghost"
              className="text-[#6b6b6b] hover:text-[#1a5c2e] gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos os serviços
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
            Condutores organizados, trânsito mais seguro | Decreto Presidencial
            Nº 245/15
          </p>
        </div>
      </footer>
    </div>
  );
}
