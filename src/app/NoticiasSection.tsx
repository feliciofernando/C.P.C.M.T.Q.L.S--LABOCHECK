'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Newspaper, ImageIcon, X } from 'lucide-react';

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

export default function NoticiasSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);

  useEffect(() => {
    fetch('/api/noticias?limit=4')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.data) {
          setNoticias(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="noticias" className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a1a] text-center mb-8">Noticias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-[#d1d1cc] overflow-hidden">
                <div className="h-40 bg-[#e8e8e3] animate-pulse" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-[#e8e8e3] rounded animate-pulse" />
                  <div className="h-3 bg-[#e8e8e3] rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-[#e8e8e3] rounded animate-pulse w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (noticias.length === 0) {
    return (
      <section id="noticias" className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Noticias</h2>
          <p className="text-[#6b6b6b] text-sm">Nenhuma noticia disponivel no momento.</p>
        </div>
      </section>
    );
  }

  // Featured noticia - first one with destaque=true or first one
  const featuredIndex = noticias.findIndex((n) => n.destaque);
  const featured = featuredIndex >= 0 ? noticias[featuredIndex] : noticias[0];
  const others = noticias.filter((n) => n.id !== featured.id).slice(0, 3);

  return (
    <section id="noticias" className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-12 bg-[#d4a017]/60" />
            <Newspaper className="w-5 h-5 text-[#1a5c2e]" />
            <div className="h-[1px] w-12 bg-[#d4a017]/60" />
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Noticias</h2>
          <p className="text-sm text-[#6b6b6b] mt-1">
            Mantenha-se informado sobre as ultimas novidades
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured noticia */}
          <Card
            className="border-[#d1d1cc] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => setSelectedNoticia(featured)}
          >
            <div className="relative h-56 lg:h-64 overflow-hidden">
              {featured.imagemBase64 ? (
                <img
                  src={`data:${featured.imagemTipo || 'image/jpeg'};base64,${featured.imagemBase64}`}
                  alt={featured.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d] flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/20" />
                </div>
              )}
              {featured.destaque && (
                <Badge className="absolute top-3 left-3 bg-[#d4a017] text-white text-xs font-semibold">
                  Destaque
                </Badge>
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(featured.dataPublicacao)}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-[#1a5c2e] transition-colors line-clamp-2">
                {featured.titulo}
              </h3>
              <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-3">
                {featured.resumo}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#1a5c2e]">
                Ler mais <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Other noticias */}
          <div className="flex flex-col gap-4">
            {others.map((noticia) => (
              <Card
                key={noticia.id}
                className="border-[#d1d1cc] overflow-hidden cursor-pointer hover:shadow-md transition-shadow group flex flex-col sm:flex-row"
                onClick={() => setSelectedNoticia(noticia)}
              >
                <div className="relative w-full sm:w-40 h-36 sm:h-auto flex-shrink-0 overflow-hidden">
                  {noticia.imagemBase64 ? (
                    <img
                      src={`data:${noticia.imagemTipo || 'image/jpeg'};base64,${noticia.imagemBase64}`}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a5c2e] to-[#0f3d1d] flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(noticia.dataPublicacao)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1 group-hover:text-[#1a5c2e] transition-colors line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed line-clamp-2">
                    {noticia.resumo}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#1a5c2e]">
                    Ler mais <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

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
            {/* Modal image */}
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

            {/* Modal content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#6b6b6b]" />
                <span className="text-sm text-[#6b6b6b]">
                  {formatDate(selectedNoticia.dataPublicacao)}
                </span>
                {selectedNoticia.destaque && (
                  <Badge className="bg-[#d4a017] text-white text-xs">Destaque</Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">
                {selectedNoticia.titulo}
              </h2>
              {selectedNoticia.resumo && (
                <p className="text-sm font-medium text-[#1a1a1a] mb-4 leading-relaxed bg-[#f5f5f0] p-4 rounded-lg">
                  {selectedNoticia.resumo}
                </p>
              )}
              {selectedNoticia.conteudo && (
                <div className="text-sm text-[#6b6b6b] leading-relaxed whitespace-pre-line">
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
    </section>
  );
}

