'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Upload, Image as ImageIcon, Trash2, CheckCircle2, Info,
  Save, Sun, Moon
} from 'lucide-react';
import { toast } from 'sonner';

export default function PainelConfiguracoes() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

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
      {/* Theme Toggle */}
      <Card className="border-[#d1d1cc] dark:border-[#30363d]">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Tema do Painel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-[#6b6b6b] dark:text-[#8b949e]">
            Escolha o tema visual para o painel administrativo. Esta opcao e apenas para administradores
            e nao afecta a pagina publica.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-[#1a5c2e] bg-[#1a5c2e]/5'
                  : 'border-[#d1d1cc] dark:border-[#30363d] hover:border-[#1a5c2e]/50'
              }`}
            >
              <div className="w-full h-16 rounded-md bg-white border border-[#d1d1cc] flex items-center justify-center">
                <Sun className="w-6 h-6 text-[#1a5c2e]" />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  theme === 'light' ? 'border-[#1a5c2e] bg-[#1a5c2e]' : 'border-[#d1d1cc] dark:border-[#484f58]'
                }`} />
                <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#e6e6e1]">Claro</span>
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#2ea356] bg-[#2ea356]/5'
                  : 'border-[#d1d1cc] dark:border-[#30363d] hover:border-[#2ea356]/50'
              }`}
            >
              <div className="w-full h-16 rounded-md bg-[#0d1117] border border-[#30363d] flex items-center justify-center">
                <Moon className="w-6 h-6 text-[#e6e6e1]" />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-3 h-3 rounded-full border-2 ${
                  theme === 'dark' ? 'border-[#2ea356] bg-[#2ea356]' : 'border-[#d1d1cc] dark:border-[#484f58]'
                }`} />
                <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#e6e6e1]">Escuro</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Hero Image Section */}
      <Card className="border-[#d1d1cc] dark:border-[#30363d]">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem de Fundo do Hero
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1a1a1a] dark:text-[#e6e6e1]">Pre-visualizacao</Label>
            <div className="relative w-full h-56 sm:h-72 rounded-lg overflow-hidden border-2 border-[#d1d1cc] dark:border-[#30363d] bg-[#0f3d1d]">
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
            <div className="flex items-center justify-between bg-[#f0f0eb] dark:bg-[#1c2128] rounded-lg px-4 py-3 border border-[#d1d1cc] dark:border-[#30363d]">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#1a5c2e] dark:text-[#2ea356]" />
                <span className="font-medium text-[#1a1a1a] dark:text-[#e6e6e1]">{settings.hero_imagem_nome}</span>
                <span className="text-[#6b6b6b] dark:text-[#8b949e] text-xs">
                  ({(Math.round((settings.hero_imagem_base64?.length || 0) * 0.75 / 1024))} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 gap-1"
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
              className="border-[#1a5c2e] dark:border-[#2ea356] text-[#1a5c2e] dark:text-[#2ea356] hover:bg-[#1a5c2e]/10 dark:hover:bg-[#2ea356]/10 gap-2"
            >
              <Upload className="w-4 h-4" />
              Selecionar Nova Imagem
            </Button>
          </div>

          <Separator />

          <div className="bg-[#f8f8f5] dark:bg-[#1c2128] rounded-lg p-4 border border-[#d1d1cc] dark:border-[#30363d]">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#1a5c2e] dark:text-[#2ea356] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#6b6b6b] dark:text-[#8b949e] space-y-1.5">
                <p className="font-semibold text-[#1a1a1a] dark:text-[#e6e6e1]">Recomendacoes para a imagem:</p>
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
