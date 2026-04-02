'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Search, Eye, Download, FileText, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function LicencaPVC() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [condutor, setCondutor] = useState<Record<string, unknown> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadingFront, setDownloadingFront] = useState(false);
  const [downloadingBack, setDownloadingBack] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.error('Insira um Nº de ordem, nome ou B.I.');
      return;
    }
    setLoading(true);
    setCondutor(null);
    try {
      const res = await fetch(`/api/condutores/consulta?search=${encodeURIComponent(search)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Nenhum registo encontrado');
      }
      const data = await res.json();
      setCondutor(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro na consulta';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const downloadPNG = async (type: 'front' | 'back') => {
    if (!condutor) return;
    if (type === 'front') setDownloadingFront(true);
    else setDownloadingBack(true);
    try {
      const endpoint = type === 'front' ? '/api/condutores/licenca-png' : '/api/condutores/licenca-back-png';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: condutor.id }),
      });
      if (!res.ok) throw new Error('Erro ao gerar PNG');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const nome = (condutor.nomeCompleto as string || 'condutor').replace(/\s+/g, '_');
      a.download = `Licença_${type === 'front' ? 'Frente' : 'Trás'}_${nome}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Licença ${type === 'front' ? 'Frente' : 'Trás'} descarregada com sucesso (PNG)`);
    } catch {
      toast.error(`Erro ao gerar PNG da ${type === 'front' ? 'frente' : 'trás'}`);
    } finally {
      if (type === 'front') setDownloadingFront(false);
      else setDownloadingBack(false);
    }
  };

  const downloadBoth = async () => {
    if (!condutor) return;
    try {
      const [frontRes, backRes] = await Promise.all([
        fetch('/api/condutores/licenca-png', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: condutor.id }),
        }),
        fetch('/api/condutores/licenca-back-png', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: condutor.id }),
        }),
      ]);
      if (!frontRes.ok || !backRes.ok) throw new Error('Erro');
      
      const [frontBlob, backBlob] = await Promise.all([frontRes.blob(), backRes.blob()]);
      
      // Download both
      const nome = (condutor.nomeCompleto as string || 'condutor').replace(/\s+/g, '_');
      [frontBlob, backBlob].forEach((blob, i) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Licença_${i === 0 ? 'Frente' : 'Trás'}_${nome}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
      
      toast.success('Licença Frente e Trás descarregadas com sucesso (PNG)');
    } catch {
      toast.error('Erro ao gerar PNGs');
    }
  };

  const frontImgUrl = condutor
    ? `/api/condutores/licenca-png?id=${condutor.id}&t=${Date.now()}`
    : '';
  const backImgUrl = condutor
    ? `/api/condutores/licenca-back-png?id=${condutor.id}&t=${Date.now()}`
    : '';

  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#d1d1cc] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#1a5c2e] rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1a1a]">Criar Licença</h3>
              <p className="text-xs text-[#6b6b6b]">
                Pesquise pelo Nome, B.I. ou Nº de Ordem do condutor
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nome, B.I. ou Nº de Ordem..."
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-1.5" />
              )}
              {loading ? 'A pesquisar...' : 'Criar Licença'}
            </Button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
        </div>
      )}

      {/* Result with PNG cards */}
      {!loading && condutor && (
        <div className="space-y-4">
          {/* Info bar */}
          <div className="max-w-3xl mx-auto flex items-center justify-between bg-[#f0f0eb] rounded-lg border border-[#d1d1cc] px-4 py-3">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#1a5c2e]" />
              <div>
                <span className="font-medium text-sm">{condutor.nomeCompleto}</span>
                <span className="text-xs text-[#6b6b6b] ml-3">
                  Nº {condutor.numeroOrdem} | {condutor.status as string}
                </span>
              </div>
            </div>
          </div>

          {/* PNG Card Previews */}
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* FRONT */}
            <div className="text-center">
              <p className="text-sm font-bold text-[#6b6b6b] mb-3">FRENTE</p>
              {frontImgUrl && (
                <img
                  src={frontImgUrl}
                  alt="Licença Frente"
                  className="max-w-full rounded-lg shadow-lg border border-[#d1d1cc]"
                  style={{ width: '400px' }}
                />
              )}
            </div>

            {/* BACK */}
            <div className="text-center">
              <p className="text-sm font-bold text-[#6b6b6b] mb-3">TRÁS</p>
              {backImgUrl && (
                <img
                  src={backImgUrl}
                  alt="Licença Tras"
                  className="max-w-full rounded-lg shadow-lg border border-[#d1d1cc]"
                  style={{ width: '400px' }}
                />
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="border-[#1a5c2e] text-[#1a5c2e] hover:bg-[#1a5c2e]/10 px-6"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Visualizar
            </Button>
            <Button
              onClick={() => downloadPNG('front')}
              disabled={downloadingFront}
              className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white px-6"
            >
              {downloadingFront ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1.5" />
              )}
              {downloadingFront ? 'A gerar...' : 'Frente (PNG)'}
            </Button>
            <Button
              onClick={() => downloadPNG('back')}
              disabled={downloadingBack}
              className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white px-6"
            >
              {downloadingBack ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-1.5" />
              )}
              {downloadingBack ? 'A gerar...' : 'Tras (PNG)'}
            </Button>
            <Button
              onClick={downloadBoth}
              className="bg-[#d4a017] hover:bg-[#b8890f] text-white px-6"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Baixar Ambas (PNG)
            </Button>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a5c2e] flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Licença Profissional de Condutor (PNG)
            </DialogTitle>
          </DialogHeader>
          {condutor && (
            <div className="space-y-8 py-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#1a1a1a] mb-3">FRENTE</p>
                <img
                  src={frontImgUrl}
                  alt="Licença Frente"
                  className="max-w-full mx-auto rounded-lg shadow-lg border border-[#d1d1cc]"
                  style={{ width: '500px' }}
                />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#1a1a1a] mb-3">TRÁS</p>
                <img
                  src={backImgUrl}
                  alt="Licença Tras"
                  className="max-w-full mx-auto rounded-lg shadow-lg border border-[#d1d1cc]"
                  style={{ width: '500px' }}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={downloadBoth}
                  className="bg-[#d4a017] hover:bg-[#b8890f] text-white px-8"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Baixar Ambas (PNG)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
