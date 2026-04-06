'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  ArrowRight,
  ArrowLeft,
  Newspaper,
  ImageIcon,
  X,
} from 'lucide-react';
import Navbar from '../Navbar';

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagemBase64: string;
  imagemTipo: string;
  dataPublicacao: string;
  activo: boolean;
  destaque: boolean;
  ordem: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function TodasNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    fetch('/api/noticias')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.data) {
          setNoticias(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f0]">
      <Navbar />

      <main className="flex-1 pt-4">
        {/* Page Header */}
        <div className="bg-[#1a5c2e] text-white py-10 lg:py-14">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-[1px] w-12 lg:w-16 bg-[#d4a017]/60" />
              <Newspaper className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              <div className="h-[1px] w-12 lg:w-16 bg-[#d4a017]/60" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">Todas as Notícias</h1>
            <p className="text-sm lg:text-base text-white/80 mt-2">
              Mantenha-se informado sobre todas as novidades do Conselho
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm lg:text-base text-[#1a5c2e] font-medium hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            Voltar a Página Inicial
          </Link>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-[#d1d1cc] overflow-hidden">
                  <div className="h-48 bg-[#e8e8e3] animate-pulse" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-4 bg-[#e8e8e3] rounded animate-pulse" />
                    <div className="h-3 bg-[#e8e8e3] rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-[#e8e8e3] rounded animate-pulse w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : noticias.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 mx-auto text-[#d1d1cc] mb-4" />
              <p className="text-[#6b6b6b] text-lg">
                Nenhuma notícia disponível no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia) => (
                <Card
                  key={noticia.id}
                  className="border-[#d1d1cc] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedNoticia(noticia)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {noticia.imagemBase64 ? (
                      <img
                        src={`data:${noticia.imagemTipo || 'image/jpeg'};base64,${noticia.imagemBase64}`}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d] flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    {noticia.destaque && (
                      <Badge className="absolute top-3 left-3 bg-[#d4a017] text-white text-xs font-semibold">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-1.5 text-xs lg:text-sm text-[#6b6b6b] mb-2">
                      <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <span>{formatDate(noticia.dataPublicacao)}</span>
                    </div>
                    <h3 className="text-base lg:text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-[#1a5c2e] transition-colors line-clamp-2">
                      {noticia.titulo}
                    </h3>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-3">
                      {noticia.resumo}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1a5c2e]">
                      Ler mais <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Noticias count */}
          {!loading && noticias.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-[#6b6b6b]">
                {noticias.length} {noticias.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f3d1d] text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 text-center">
          <p className="font-semibold text-sm lg:text-base">C.P.C.M.T.Q.L.S</p>
          <p className="opacity-80 text-xs lg:text-sm mt-1">
            Conselho Provincial dos Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul
          </p>
          <Separator className="bg-white/20 my-3 max-w-xs mx-auto" />
          <p className="opacity-70 text-xs lg:text-sm">
            Contactos: 941-000-517 / 924-591-350 | WhatsApp: 941-000-517
          </p>
          <p className="opacity-60 text-xs lg:text-sm mt-1">
            Lunda Sul (Cassengo, Bairro Social da Juventude, 1º Andar do Centro Comercial do Empório, vulgo Janota)
          </p>
          <p className="opacity-50 text-xs lg:text-sm mt-2">
            Condutores organizados, trânsito mais seguro | Decreto Presidencial Nº 245/15
          </p>
        </div>
      </footer>

      {/* Noticia Detail Modal */}
      {selectedNoticia && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedNoticia(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 overflow-hidden rounded-t-xl">
              {selectedNoticia.imagemBase64 ? (
                <img
                  src={`data:${selectedNoticia.imagemTipo || 'image/jpeg'};base64,${selectedNoticia.imagemBase64}`}
                  alt={selectedNoticia.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d] flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/20" />
                </div>
              )}
              <button
                onClick={() => setSelectedNoticia(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-[#6b6b6b]" />
                <span className="text-sm lg:text-base text-[#6b6b6b]">
                  {formatDate(selectedNoticia.dataPublicacao)}
                </span>
                {selectedNoticia.destaque && (
                  <Badge className="bg-[#d4a017] text-white text-xs">Destaque</Badge>
                )}
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mb-4">
                {selectedNoticia.titulo}
              </h2>
              {selectedNoticia.resumo && (
                <p className="text-sm lg:text-base font-medium text-[#1a1a1a] mb-4 leading-relaxed bg-[#f5f5f0] p-4 rounded-lg">
                  {selectedNoticia.resumo}
                </p>
              )}
              {selectedNoticia.conteudo && (
                <div className="text-sm lg:text-base text-[#6b6b6b] leading-relaxed whitespace-pre-line">
                  {selectedNoticia.conteudo}
                </div>
              )}
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedNoticia(null)}
                  className="border-[#1a5c2e] text-[#1a5c2e] hover:bg-[#1a5c2e] hover:text-white"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
