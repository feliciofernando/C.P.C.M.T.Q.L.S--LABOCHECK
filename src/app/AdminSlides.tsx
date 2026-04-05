'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Upload,
} from 'lucide-react';

interface Slide {
  id: string;
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  linkBotao: string;
  imagemBase64: string;
  imagemTipo: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
  dataCriacao?: string;
}

interface SlideFormData {
  titulo: string;
  subtitulo: string;
  textoBotao: string;
  linkBotao: string;
  imagemBase64: string;
  imagemTipo: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
}

const emptyForm: SlideFormData = {
  titulo: '',
  subtitulo: '',
  textoBotao: 'Saber Mais',
  linkBotao: '#',
  imagemBase64: '',
  imagemTipo: 'image/jpeg',
  activo: true,
  ordem: 0,
  tempoTransicao: 5000,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SlideFormData>(emptyForm);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Preview dialog
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null);

  // Upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/slides?all=true');
      if (res.ok) {
        const data = await res.json();
        setSlides(data.data || []);
      } else {
        toast.error('Erro ao carregar slides');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const openCreateForm = () => {
    setEditingId(null);
    const maxOrdem = slides.length > 0 ? Math.max(...slides.map(s => s.ordem)) + 1 : 1;
    setForm({ ...emptyForm, ordem: maxOrdem });
    setFormOpen(true);
  };

  const openEditForm = (slide: Slide) => {
    setEditingId(slide.id);
    setForm({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      textoBotao: slide.textoBotao,
      linkBotao: slide.linkBotao,
      imagemBase64: slide.imagemBase64 || '',
      imagemTipo: slide.imagemTipo || 'image/jpeg',
      activo: slide.activo,
      ordem: slide.ordem,
      tempoTransicao: slide.tempoTransicao,
    });
    setFormOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Imagem demasiado grande. Máximo 2MB.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setForm({
        ...form,
        imagemBase64: base64,
        imagemTipo: file.type,
      });
      toast.success('Imagem carregada com sucesso');
    } catch {
      toast.error('Erro ao carregar imagem');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      toast.error('Preencha o campo título');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/slides/${editingId}` : '/api/slides';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingId ? 'Slide actualizado com sucesso' : 'Slide criado com sucesso');
        setFormOpen(false);
        fetchSlides();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao guardar slide');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/slides/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Slide eliminado com sucesso');
        fetchSlides();
      } else {
        toast.error('Erro ao eliminar slide');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleActivo = async (slide: Slide) => {
    try {
      const res = await fetch(`/api/slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !slide.activo }),
      });
      if (res.ok) {
        toast.success(slide.activo ? 'Slide desactivado' : 'Slide activado');
        fetchSlides();
      } else {
        toast.error('Erro ao alterar estado');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    const sortedSlides = [...slides].sort((a, b) => a.ordem - b.ordem);
    const current = sortedSlides[index];
    const previous = sortedSlides[index - 1];

    try {
      await Promise.all([
        fetch(`/api/slides/${current.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: previous.ordem }),
        }),
        fetch(`/api/slides/${previous.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: current.ordem }),
        }),
      ]);
      toast.success('Ordem actualizada');
      fetchSlides();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  const handleMoveDown = async (index: number) => {
    const sortedSlides = [...slides].sort((a, b) => a.ordem - b.ordem);
    if (index >= sortedSlides.length - 1) return;
    const current = sortedSlides[index];
    const next = sortedSlides[index + 1];

    try {
      await Promise.all([
        fetch(`/api/slides/${current.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: next.ordem }),
        }),
        fetch(`/api/slides/${next.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: current.ordem }),
        }),
      ]);
      toast.success('Ordem actualizada');
      fetchSlides();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.ordem - b.ordem);

  return (
    <Card className="border-[#d1d1cc] shadow-sm">
      <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Gestão de Slides
          </CardTitle>
          <Button
            onClick={openCreateForm}
            size="sm"
            className="bg-white text-[#1a5c2e] hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Novo Slide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
            <span className="ml-2 text-sm text-[#6b6b6b]">A carregar slides...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && slides.length === 0 && (
          <div className="text-center py-10">
            <ImageIcon className="w-10 h-10 mx-auto text-[#d1d1cc] mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhum slide encontrado.</p>
            <Button onClick={openCreateForm} size="sm" className="mt-4 bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]">
              <Plus className="w-4 h-4 mr-1.5" />
              Criar primeiro slide
            </Button>
          </div>
        )}

        {/* Slides List */}
        {!loading && slides.length > 0 && (
          <div className="space-y-4">
            {sortedSlides.map((slide, index) => (
              <div
                key={slide.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-[#d1d1cc] bg-white hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div
                  className="w-full sm:w-40 h-24 rounded-md overflow-hidden flex-shrink-0 bg-[#f5f5f0] cursor-pointer"
                  onClick={() => setPreviewSlide(slide)}
                >
                  {slide.imagemBase64 ? (
                    <img
                      src={`data:${slide.imagemTipo || 'image/png'};base64,${slide.imagemBase64}`}
                      alt={slide.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#d1d1cc]" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[#1a1a1a] truncate">{slide.titulo}</h3>
                      <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-2">{slide.subtitulo || 'Sem subtítulo'}</p>
                    </div>
                    <Badge
                      variant={slide.activo ? 'default' : 'secondary'}
                      className={
                        slide.activo
                          ? 'bg-[#1a5c2e] text-white text-[10px] flex-shrink-0'
                          : 'bg-gray-200 text-gray-600 text-[10px] flex-shrink-0'
                      }
                    >
                      {slide.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[#999]">
                    <span>Ordem: {slide.ordem}</span>
                    <span>•</span>
                    <span>Tempo: {slide.tempoTransicao / 1000}s</span>
                    {slide.textoBotao && (
                      <>
                        <span>•</span>
                        <span>Botão: {slide.textoBotao}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:flex-col sm:justify-center flex-shrink-0">
                  <div className="flex sm:flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      title="Mover para cima"
                      className="h-8 w-8 p-0"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedSlides.length - 1}
                      title="Mover para baixo"
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex sm:flex-col gap-1 ml-1 sm:ml-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewSlide(slide)}
                      title="Pre-visualizar"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4 text-[#1a5c2e]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActivo(slide)}
                      title={slide.activo ? 'Desactivar' : 'Activar'}
                      className="h-8 w-8 p-0"
                    >
                      {slide.activo ? (
                        <Pause className="w-4 h-4 text-[#6b6b6b]" />
                      ) : (
                        <Play className="w-4 h-4 text-[#1a5c2e]" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditForm(slide)}
                      title="Editar"
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="w-4 h-4 text-[#d4a017]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(slide.id)}
                      title="Eliminar"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              {editingId ? 'Editar Slide' : 'Novo Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Actualize os campos do slide.'
                : 'Preencha os campos para criar um novo slide.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem do Slide</Label>
              <div className="flex items-center gap-4">
                <div className="w-48 h-28 rounded-md border-2 border-dashed border-[#d1d1cc] overflow-hidden bg-[#f5f5f0] flex items-center justify-center">
                  {form.imagemBase64 ? (
                    <img
                      src={`data:${form.imagemTipo};base64,${form.imagemBase64}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-[#d1d1cc]" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
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
                  {form.imagemBase64 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({ ...form, imagemBase64: '', imagemTipo: 'image/jpeg' })}
                      className="border-red-300 text-red-500 hover:bg-red-50 text-xs"
                    >
                      Remover Imagem
                    </Button>
                  )}
                  <p className="text-[10px] text-[#999]">Máximo 2MB. PNG ou JPEG.</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título do slide"
                className="border-[#d1d1cc]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo</Label>
              <Input
                id="subtitulo"
                value={form.subtitulo}
                onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                placeholder="Subtítulo ou descrição do slide"
                className="border-[#d1d1cc]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="textoBotao">Texto do Botão</Label>
                <Input
                  id="textoBotao"
                  value={form.textoBotao}
                  onChange={(e) => setForm({ ...form, textoBotao: e.target.value })}
                  placeholder="Saber Mais"
                  className="border-[#d1d1cc]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkBotao">Link do Botão</Label>
                <Input
                  id="linkBotao"
                  value={form.linkBotao}
                  onChange={(e) => setForm({ ...form, linkBotao: e.target.value })}
                  placeholder="#servicos"
                  className="border-[#d1d1cc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                  className="border-[#d1d1cc]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempoTransicao">Transição (ms)</Label>
                <Input
                  id="tempoTransicao"
                  type="number"
                  value={form.tempoTransicao}
                  onChange={(e) => setForm({ ...form, tempoTransicao: parseInt(e.target.value) || 5000 })}
                  className="border-[#d1d1cc]"
                  min={1000}
                  max={30000}
                  step={500}
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="activo"
                  checked={form.activo}
                  onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Slide activo
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              className="border-[#d1d1cc]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Actualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este slide? Esta acção é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d1d1cc]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewSlide} onOpenChange={(open) => { if (!open) setPreviewSlide(null); }}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="relative w-full aspect-video bg-[#0f3d1d]">
            {/* Background */}
            {previewSlide?.imagemBase64 && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(data:${previewSlide.imagemTipo};base64,${previewSlide.imagemBase64})`,
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f3d1d]/70 via-[#1a5c2e]/50 to-[#0f3d1d]/75" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-8">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-wider drop-shadow-lg">
                  {previewSlide?.titulo}
                </h2>
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="h-[1px] w-12 bg-[#d4a017]/60" />
                  <div className="w-2 h-2 rounded-full bg-[#d4a017]" />
                  <div className="h-[1px] w-12 bg-[#d4a017]/60" />
                </div>
                <p className="text-sm sm:text-lg opacity-95 max-w-2xl mx-auto leading-relaxed">
                  {previewSlide?.subtitulo}
                </p>
                {previewSlide?.textoBotao && (
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 bg-[#d4a017] text-[#0f3d1d] font-bold px-8 py-3 rounded-full text-sm sm:text-base">
                      {previewSlide.textoBotao}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a017] to-transparent opacity-60" />
          </div>
          <div className="p-4 bg-white flex items-center justify-between">
            <div className="text-xs text-[#6b6b6b]">
              <span>Ordem: {previewSlide?.ordem}</span>
              <span className="mx-2">•</span>
              <span>Transição: {previewSlide ? (previewSlide.tempoTransicao / 1000) : 0}s</span>
              <span className="mx-2">•</span>
              <Badge variant={previewSlide?.activo ? 'default' : 'secondary'} className={previewSlide?.activo ? 'bg-[#1a5c2e] text-white text-[10px]' : 'bg-gray-200 text-gray-600 text-[10px]'}>
                {previewSlide?.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
