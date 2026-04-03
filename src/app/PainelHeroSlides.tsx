'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  ArrowUp,
  ArrowDown,
  Loader2,
  ImageIcon,
  Upload,
  Eye,
  EyeOff,
  Play,
  RefreshCw,
} from 'lucide-react';

interface SlideItem {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagemBase64: string;
  imagemTipo: string;
  textoBotao: string;
  linkBotao: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
}

interface SlideFormData {
  titulo: string;
  subtitulo: string;
  descricao: string;
  imagemBase64: string;
  imagemTipo: string;
  textoBotao: string;
  linkBotao: string;
  activo: boolean;
  ordem: number;
  tempoTransicao: number;
}

const emptyForm: SlideFormData = {
  titulo: '',
  subtitulo: '',
  descricao: '',
  imagemBase64: '',
  imagemTipo: 'image/jpeg',
  textoBotao: 'Saber Mais',
  linkBotao: '#',
  activo: true,
  ordem: 0,
  tempoTransicao: 5000,
};

export default function PainelHeroSlides() {
  const [slides, setSlides] = useState<SlideItem[]>([]);
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
  const [previewId, setPreviewId] = useState<string | null>(null);

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
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  // ---- Image Upload ----
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
      setForm((prev) => ({
        ...prev,
        imagemBase64: base64,
        imagemTipo: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ---- CRUD ----
  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, ordem: slides.length });
    setFormOpen(true);
  };

  const openEditForm = (slide: SlideItem) => {
    setEditingId(slide.id);
    setForm({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      descricao: slide.descricao,
      imagemBase64: slide.imagemBase64,
      imagemTipo: slide.imagemTipo,
      textoBotao: slide.textoBotao,
      linkBotao: slide.linkBotao,
      activo: slide.activo,
      ordem: slide.ordem,
      tempoTransicao: slide.tempoTransicao,
    });
    setFormOpen(true);
  };

  const handleSaveSlide = async () => {
    if (!form.titulo.trim()) {
      toast.error('Preencha o campo titulo');
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
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async () => {
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
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleActivo = async (slide: SlideItem) => {
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
      toast.error('Erro de ligacao ao servidor');
    }
  };

  // ---- Reorder ----
  const handleMoveUp = async (slide: SlideItem) => {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx <= 0) return;
    const prevSlide = slides[idx - 1];
    try {
      await Promise.all([
        fetch(`/api/slides/${slide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: prevSlide.ordem }),
        }),
        fetch(`/api/slides/${prevSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: slide.ordem }),
        }),
      ]);
      fetchSlides();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  const handleMoveDown = async (slide: SlideItem) => {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx < 0 || idx >= slides.length - 1) return;
    const nextSlide = slides[idx + 1];
    try {
      await Promise.all([
        fetch(`/api/slides/${slide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: nextSlide.ordem }),
        }),
        fetch(`/api/slides/${nextSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: slide.ordem }),
        }),
      ]);
      fetchSlides();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  const previewSlide = slides.find((s) => s.id === previewId);

  return (
    <div className="space-y-6">
      {/* Slides List Card */}
      <Card className="border-[#d1d1cc] shadow-sm">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              Slides do Hero ({slides.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchSlides}
                size="sm"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
              <Button
                onClick={openCreateForm}
                size="sm"
                className="bg-white text-[#1a5c2e] hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Novo Slide
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
              <span className="ml-2 text-sm text-[#6b6b6b]">A carregar slides...</span>
            </div>
          )}

          {!loading && slides.length === 0 && (
            <div className="text-center py-10">
              <Play className="w-10 h-10 mx-auto text-[#d1d1cc] mb-3" />
              <p className="text-[#6b6b6b] text-sm">Nenhum slide encontrado.</p>
              <Button
                onClick={openCreateForm}
                size="sm"
                className="mt-4 bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Criar primeiro slide
              </Button>
            </div>
          )}

          {!loading && slides.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-[#d1d1cc] max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f5f5f0]">
                    <TableHead className="font-semibold text-xs w-10">Ordem</TableHead>
                    <TableHead className="font-semibold text-xs w-16">Imagem</TableHead>
                    <TableHead className="font-semibold text-xs">Titulo</TableHead>
                    <TableHead className="font-semibold text-xs hidden md:table-cell">Subtitulo</TableHead>
                    <TableHead className="font-semibold text-xs hidden lg:table-cell">Descricao</TableHead>
                    <TableHead className="font-semibold text-xs text-center w-20">Estado</TableHead>
                    <TableHead className="font-semibold text-xs text-right w-32">Accoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slides.map((slide) => (
                    <TableRow key={slide.id} className="hover:bg-[#f5f5f0]/50">
                      <TableCell className="text-xs text-[#6b6b6b] text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(slide)}
                            disabled={slides.indexOf(slide) === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <span className="w-5 text-center font-medium">{slide.ordem}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(slide)}
                            disabled={slides.indexOf(slide) === slides.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="w-12 h-8 rounded overflow-hidden border border-[#d1d1cc] cursor-pointer hover:ring-2 hover:ring-[#d4a017] transition-all"
                          onClick={() => setPreviewId(slide.id)}
                        >
                          {slide.imagemBase64 ? (
                            <img
                              src={`data:${slide.imagemTipo};base64,${slide.imagemBase64}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#f5f5f0]">
                              <ImageIcon className="w-4 h-4 text-[#d1d1cc]" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#1a1a1a] max-w-[150px] truncate">
                        {slide.titulo}
                      </TableCell>
                      <TableCell className="text-xs text-[#6b6b6b] hidden md:table-cell max-w-[180px] truncate">
                        {slide.subtitulo || '-'}
                      </TableCell>
                      <TableCell className="text-xs text-[#6b6b6b] hidden lg:table-cell max-w-[200px] truncate">
                        {slide.descricao || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={slide.activo ? 'default' : 'secondary'}
                          className={
                            slide.activo
                              ? 'bg-[#1a5c2e] text-white text-xs'
                              : 'bg-gray-200 text-gray-600 text-xs'
                          }
                        >
                          {slide.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActivo(slide)}
                            className="h-8 w-8 p-0"
                            title={slide.activo ? 'Desactivar' : 'Activar'}
                          >
                            {slide.activo ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Slide Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              {editingId ? 'Editar Slide' : 'Novo Slide'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Actualize os campos do slide do hero.'
                : 'Preencha os campos para criar um novo slide.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="slide-titulo">Titulo *</Label>
              <Input
                id="slide-titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ex: C.P.C.M.T.Q.L.S"
                className="border-[#d1d1cc]"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="slide-subtitulo">Subtitulo</Label>
              <Input
                id="slide-subtitulo"
                value={form.subtitulo}
                onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                placeholder="Ex: Conselho Provincial"
                className="border-[#d1d1cc]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="slide-descricao">Descricao</Label>
              <Textarea
                id="slide-descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Texto descritivo do slide"
                className="border-[#d1d1cc] resize-none"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem de Fundo</Label>
              <div className="flex items-start gap-4">
                {form.imagemBase64 ? (
                  <div className="relative w-28 h-18 rounded overflow-hidden border border-[#d1d1cc] flex-shrink-0">
                    <img
                      src={`data:${form.imagemTipo};base64,${form.imagemBase64}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setForm({ ...form, imagemBase64: '', imagemTipo: 'image/jpeg' })
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <div className="w-28 h-18 rounded bg-[#f5f5f0] border-2 border-dashed border-[#d1d1cc] flex items-center justify-center flex-shrink-0">
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
                  <p className="text-xs text-[#6b6b6b] mt-1">Max: 2MB. Recomendado: 1920x600px</p>
                </div>
              </div>
            </div>

            {/* Button Text + Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slide-texto-botao">Texto do Botao</Label>
                <Input
                  id="slide-texto-botao"
                  value={form.textoBotao}
                  onChange={(e) => setForm({ ...form, textoBotao: e.target.value })}
                  placeholder="Saber Mais"
                  className="border-[#d1d1cc]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-link-botao">Link do Botao</Label>
                <Input
                  id="slide-link-botao"
                  value={form.linkBotao}
                  onChange={(e) => setForm({ ...form, linkBotao: e.target.value })}
                  placeholder="#servicos ou URL"
                  className="border-[#d1d1cc]"
                />
              </div>
            </div>

            {/* Order + Transition Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slide-ordem">Ordem</Label>
                <Input
                  id="slide-ordem"
                  type="number"
                  value={form.ordem}
                  onChange={(e) =>
                    setForm({ ...form, ordem: parseInt(e.target.value) || 0 })
                  }
                  className="border-[#d1d1cc]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slide-tempo">Tempo de Transicao (ms)</Label>
                <Input
                  id="slide-tempo"
                  type="number"
                  value={form.tempoTransicao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tempoTransicao: parseInt(e.target.value) || 5000,
                    })
                  }
                  placeholder="5000"
                  className="border-[#d1d1cc]"
                />
              </div>
            </div>

            {/* Active toggle */}
            {editingId && (
              <div className="flex items-center gap-3">
                <Switch
                  id="slide-activo"
                  checked={form.activo}
                  onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
                />
                <Label htmlFor="slide-activo" className="cursor-pointer">
                  Slide activo
                </Label>
              </div>
            )}
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
              onClick={handleSaveSlide}
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
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este slide? Esta accao e irreversivel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d1d1cc]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSlide}
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
      <Dialog open={!!previewId} onOpenChange={(open) => { if (!open) setPreviewId(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview do Slide</DialogTitle>
          </DialogHeader>
          {previewSlide && (
            <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden border border-[#d1d1cc]">
              {previewSlide.imagemBase64 ? (
                <img
                  src={`data:${previewSlide.imagemTipo};base64,${previewSlide.imagemBase64}`}
                  alt={previewSlide.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#0f3d1d]/60 via-[#1a5c2e]/45 to-[#0f3d1d]/70" />
              )}
              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg mb-1">
                  {previewSlide.titulo}
                </h3>
                {previewSlide.subtitulo && (
                  <p className="text-[#d4a017] font-semibold text-sm sm:text-base mb-1">
                    {previewSlide.subtitulo}
                  </p>
                )}
                {previewSlide.descricao && (
                  <p className="text-white/80 text-xs sm:text-sm">
                    {previewSlide.descricao}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
