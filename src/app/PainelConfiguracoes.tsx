'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, ImageIcon, Upload, Pencil, Info, Save,
} from 'lucide-react';
import { toast } from 'sonner';

interface SectionSettings {
  titulo: string;
  subtitulo: string;
  imagem_fundo_base64: string;
  imagem_fundo_tipo: string;
}

export default function PainelConfiguracoes() {
  const [section, setSection] = useState<SectionSettings>({
    titulo: '',
    subtitulo: '',
    imagem_fundo_base64: '',
    imagem_fundo_tipo: '',
  });
  const [sectionForm, setSectionForm] = useState<SectionSettings>({
    titulo: '',
    subtitulo: '',
    imagem_fundo_base64: '',
    imagem_fundo_tipo: '',
  });
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      const sec = data.section || {};
      setSection(sec);
      setSectionForm(sec);
    } catch {
      toast.error('Erro ao carregar configuracoes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter menos de 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSectionForm({
        ...sectionForm,
        imagem_fundo_base64: base64,
        imagem_fundo_tipo: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm),
      });
      if (res.ok) {
        toast.success('Seccao actualizada com sucesso');
        setEditingSection(false);
        loadSection();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao actualizar seccao');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setSavingSection(false);
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
      {/* Cards Section Settings */}
      <Card className="border-[#d1d1cc]">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Seccao de Cards
            </CardTitle>
            {!editingSection ? (
              <Button
                onClick={() => setEditingSection(true)}
                size="sm"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <Pencil className="w-4 h-4 mr-1.5" />
                Editar Seccao
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setEditingSection(false);
                    setSectionForm(section);
                  }}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveSection}
                  size="sm"
                  disabled={savingSection}
                  className="bg-white text-[#1a5c2e] hover:bg-gray-100"
                >
                  {savingSection && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Display Mode */}
          {!editingSection && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {section.imagem_fundo_base64 ? (
                  <div className="relative w-24 h-16 rounded overflow-hidden border border-[#d1d1cc]">
                    <img
                      src={`data:${section.imagem_fundo_tipo};base64,${section.imagem_fundo_base64}`}
                      alt="Imagem de fundo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded bg-[#f5f5f0] border border-[#d1d1cc] flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#d1d1cc]" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">{section.titulo || 'Sem titulo'}</p>
                  <p className="text-xs text-[#6b6b6b]">{section.subtitulo || 'Sem subtitulo'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {editingSection && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sec-titulo">Titulo da Seccao</Label>
                  <Input
                    id="sec-titulo"
                    value={sectionForm.titulo}
                    onChange={(e) => setSectionForm({ ...sectionForm, titulo: e.target.value })}
                    placeholder="Ex: Explore Nosso Conselho"
                    className="border-[#d1d1cc]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sec-subtitulo">Subtitulo</Label>
                  <Input
                    id="sec-subtitulo"
                    value={sectionForm.subtitulo}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitulo: e.target.value })}
                    placeholder="Subtitulo opcional"
                    className="border-[#d1d1cc]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <div className="flex items-center gap-4">
                  {sectionForm.imagem_fundo_base64 ? (
                    <div className="relative w-32 h-20 rounded overflow-hidden border border-[#d1d1cc]">
                      <img
                        src={`data:${sectionForm.imagem_fundo_tipo};base64,${sectionForm.imagem_fundo_base64}`}
                        alt="Imagem de fundo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setSectionForm({ ...sectionForm, imagem_fundo_base64: '', imagem_fundo_tipo: '' })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded bg-[#f5f5f0] border-2 border-dashed border-[#d1d1cc] flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-[#d1d1cc]" />
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-[#d1d1cc]"
                    >
                      <Upload className="w-4 h-4 mr-1.5" />
                      Carregar Imagem
                    </Button>
                    <p className="text-xs text-[#6b6b6b] mt-1">Max: 2MB</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-[#f8f8f5] rounded-lg p-4 border border-[#d1d1cc]">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#1a5c2e] mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-[#6b6b6b] space-y-1.5">
                    <p className="font-semibold text-[#1a1a1a]">Informacoes:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Os cards individuais sao geridos na aba &quot;Cards&quot; do menu</li>
                      <li>A imagem de fundo sera usada como plano de fundo da seccao</li>
                      <li>Formatos aceites: PNG, JPG, WebP (max 2MB)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
