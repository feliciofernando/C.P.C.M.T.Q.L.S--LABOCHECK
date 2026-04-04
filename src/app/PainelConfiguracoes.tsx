'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Upload, Image as ImageIcon, Trash2, CheckCircle2, Info,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function PainelConfiguracoes() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/site-settings');
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setSettings(data);
      if (data.hero_imagem_base64) {
        setPreview(data.hero_imagem_tipo === 'image/jpeg'
          ? `data:image/jpeg;base64,${data.hero_imagem_base64}`
          : `data:image/png;base64,${data.hero_imagem_base64}`);
      } else {
        setPreview(null);
      }
    } catch {
      toast.error('Erro ao carregar configuracoes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor seleccione um ficheiro de imagem (PNG ou JPG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem nao pode exceder 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setSettings(prev => ({
        ...prev,
        hero_imagem_base64: base64 || '',
        hero_imagem_tipo: file.type,
        hero_imagem_nome: file.name,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setSettings(prev => ({
      ...prev,
      hero_imagem_base64: '',
      hero_imagem_tipo: 'image/png',
      hero_imagem_nome: '',
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Erro ao guardar');
      toast.success('Configuracoes guardadas com sucesso!');
    } catch {
      toast.error('Erro ao guardar configuracoes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Image Section */}
      <Card className="border-[#d1d1cc]">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem de Fundo do Hero
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1a1a1a]">Pre-visualizacao</Label>
            <div className="relative w-full h-56 sm:h-72 rounded-lg overflow-hidden border-2 border-[#d1d1cc] bg-[#0f3d1d]">
              {preview ? (
                <>
                  <img src={preview} alt="Preview Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d1d]/55 via-[#1a5c2e]/45 to-[#0f3d1d]/65 pointer-events-none" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/70">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-40" />
                  <p className="text-sm">Nenhuma imagem definida</p>
                  <p className="text-xs opacity-60 mt-1">A imagem padrao sera usada</p>
                </div>
              )}
            </div>
          </div>

          {settings.hero_imagem_nome && (
            <div className="flex items-center justify-between bg-[#f0f0eb] rounded-lg px-4 py-3 border border-[#d1d1cc]">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#1a5c2e]" />
                <span className="font-medium text-[#1a1a1a]">{settings.hero_imagem_nome}</span>
                <span className="text-[#6b6b6b] text-xs">
                  ({(Math.round((settings.hero_imagem_base64?.length || 0) * 0.75 / 1024))} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remover
              </Button>
            </div>
          )}

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-[#1a5c2e] text-[#1a5c2e] hover:bg-[#1a5c2e]/10 gap-2"
            >
              <Upload className="w-4 h-4" />
              Selecionar Nova Imagem
            </Button>
          </div>

          <Separator />

          <div className="bg-[#f8f8f5] rounded-lg p-4 border border-[#d1d1cc]">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#1a5c2e] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#6b6b6b] space-y-1.5">
                <p className="font-semibold text-[#1a1a1a]">Recomendacoes para a imagem:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li><strong>Dimensao minima:</strong> 1920 x 600 pixels (ideal)</li>
                  <li><strong>Formatos aceites:</strong> PNG, JPG, WebP</li>
                  <li><strong>Tamanho maximo:</strong> 5 MB</li>
                  <li><strong>Orientacao:</strong> Horizontal (paisagem)</li>
                  <li><strong>Conteudo:</strong> Imagem institucional, paisagem urbana ou related a motociclos/transporte</li>
                  <li><strong>Nota:</strong> A imagem sera coberta por um overlay verde semi-transparente</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white px-8 gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'A guardar...' : 'Guardar Configuracoes'}
        </Button>
      </div>
    </div>
  );
}
