'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import TipTapEditor from '@/components/TipTapEditor';
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
  Eye,
  EyeOff,
  Loader2,
  Newspaper,
  Star,
  ImageIcon,
  X,
} from 'lucide-react';

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  resumo: string;
  imagemBase64: string;
  imagemTipo: string;
  activo: boolean;
  destaque: boolean;
  ordem: number;
  dataPublicacao: string;
  dataCriacao?: string;
}

interface NoticiaFormData {
  titulo: string;
  conteudo: string;
  resumo: string;
  imagemBase64: string;
  imagemTipo: string;
  activo: boolean;
  destaque: boolean;
  ordem: number;
}

const emptyForm: NoticiaFormData = {
  titulo: '',
  conteudo: '',
  resumo: '',
  imagemBase64: '',
  imagemTipo: 'image/jpeg',
  activo: true,
  destaque: false,
  ordem: 0,
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NoticiaFormData>(emptyForm);

  // Image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/noticias?all=true');
      if (res.ok) {
        const data = await res.json();
        setNoticias(data.data || []);
      } else {
        toast.error('Erro ao carregar noticias');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview(null);
    setFormOpen(true);
  };

  const openEditForm = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setForm({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo || '',
      resumo: noticia.resumo || '',
      imagemBase64: noticia.imagemBase64 || '',
      imagemTipo: noticia.imagemTipo || 'image/jpeg',
      activo: noticia.activo,
      destaque: noticia.destaque || false,
      ordem: noticia.ordem,
    });
    setImagePreview(
      noticia.imagemBase64
        ? `data:${noticia.imagemTipo || 'image/jpeg'};base64,${noticia.imagemBase64}`
        : null
    );
    setFormOpen(true);
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem demasiado grande. Maximo 2MB.');
        e.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Ficheiro invalido. Apenas imagens sao aceites.');
        e.target.value = '';
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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    []
  );

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      imagemBase64: '',
      imagemTipo: 'image/jpeg',
    }));
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      toast.error('Preencha o campo titulo');
      return;
    }
    if (!form.conteudo.trim() || form.conteudo === '<p></p>') {
      toast.error('Escreva o conteudo da noticia');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/noticias/${editingId}` : '/api/noticias';
      const method = editingId ? 'PUT' : 'POST';
      const body = {
        titulo: form.titulo,
        conteudo: form.conteudo,
        resumo: form.resumo,
        imagemBase64: form.imagemBase64,
        imagemTipo: form.imagemTipo,
        activo: form.activo,
        destaque: form.destaque,
        ordem: form.ordem,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(
          editingId ? 'Noticia actualizada com sucesso' : 'Noticia criada com sucesso'
        );
        setFormOpen(false);
        setImagePreview(null);
        fetchNoticias();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao guardar noticia');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/noticias/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Noticia eliminada com sucesso');
        fetchNoticias();
      } else {
        toast.error('Erro ao eliminar noticia');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleActivo = async (noticia: Noticia) => {
    try {
      const res = await fetch(`/api/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !noticia.activo }),
      });
      if (res.ok) {
        toast.success(noticia.activo ? 'Noticia desactivada' : 'Noticia activada');
        fetchNoticias();
      } else {
        toast.error('Erro ao alterar estado');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    }
  };

  const handleToggleDestaque = async (noticia: Noticia) => {
    try {
      const res = await fetch(`/api/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destaque: !noticia.destaque }),
      });
      if (res.ok) {
        toast.success(
          noticia.destaque ? 'Destaque removido' : 'Noticia destacada'
        );
        fetchNoticias();
      } else {
        toast.error('Erro ao alterar destaque');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    }
  };

  return (
    <Card className="border-[#d1d1cc] shadow-sm">
      <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Gestao de Noticias
          </CardTitle>
          <Button
            onClick={openCreateForm}
            size="sm"
            className="bg-white text-[#1a5c2e] hover:bg-gray-100"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Noticia
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
            <span className="ml-2 text-sm text-[#6b6b6b]">
              A carregar noticias...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loading && noticias.length === 0 && (
          <div className="text-center py-10">
            <Newspaper className="w-10 h-10 mx-auto text-[#d1d1cc] mb-3" />
            <p className="text-[#6b6b6b] text-sm">
              Nenhuma noticia encontrada.
            </p>
            <Button
              onClick={openCreateForm}
              size="sm"
              className="mt-4 bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Criar primeira noticia
            </Button>
          </div>
        )}

        {/* News Table */}
        {!loading && noticias.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-[#d1d1cc]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f5f0]">
                  <TableHead className="font-semibold text-xs">Titulo</TableHead>
                  <TableHead className="font-semibold text-xs hidden sm:table-cell">
                    Data
                  </TableHead>
                  <TableHead className="font-semibold text-xs text-center">
                    Ordem
                  </TableHead>
                  <TableHead className="font-semibold text-xs text-center">
                    Estado
                  </TableHead>
                  <TableHead className="font-semibold text-xs text-right">
                    Accoes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noticias.map((noticia) => (
                  <TableRow
                    key={noticia.id}
                    className="hover:bg-[#f5f5f0]/50"
                  >
                    <TableCell className="max-w-[250px]">
                      <div className="flex items-center gap-3">
                        {noticia.imagemBase64 ? (
                          <img
                            src={`data:${noticia.imagemTipo || 'image/jpeg'};base64,${noticia.imagemBase64}`}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0 hidden lg:block"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1a5c2e]/10 flex items-center justify-center flex-shrink-0 hidden lg:block">
                            <Newspaper className="w-4 h-4 text-[#1a5c2e]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-[#1a1a1a] truncate block">
                            {noticia.titulo}
                          </span>
                          {noticia.destaque && (
                            <Badge className="bg-[#d4a017] text-white text-[10px] mt-0.5">
                              <Star className="w-2.5 h-2.5 mr-0.5" />
                              Destaque
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#6b6b6b] hidden sm:table-cell whitespace-nowrap">
                      {formatDate(noticia.dataPublicacao)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-[#6b6b6b]">
                      {noticia.ordem}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={noticia.activo ? 'default' : 'secondary'}
                        className={
                          noticia.activo
                            ? 'bg-[#1a5c2e] text-white text-xs'
                            : 'bg-gray-200 text-gray-600 text-xs'
                        }
                      >
                        {noticia.activo ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleDestaque(noticia)}
                          title={
                            noticia.destaque
                              ? 'Remover destaque'
                              : 'Destacar noticia'
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              noticia.destaque
                                ? 'text-[#d4a017] fill-[#d4a017]'
                                : 'text-[#d1d1cc]'
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActivo(noticia)}
                          title={noticia.activo ? 'Desactivar' : 'Activar'}
                          className="h-8 w-8 p-0"
                        >
                          {noticia.activo ? (
                            <EyeOff className="w-4 h-4 text-[#6b6b6b]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#1a5c2e]" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditForm(noticia)}
                          title="Editar"
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-4 h-4 text-[#d4a017]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(noticia.id)}
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

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              {editingId ? 'Editar Noticia' : 'Nova Noticia'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Actualize os campos da noticia.'
                : 'Preencha os campos para criar uma nova noticia.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Titulo */}
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Titulo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Titulo da noticia"
                className="border-[#d1d1cc] text-base"
              />
            </div>

            {/* Resumo */}
            <div className="space-y-2">
              <Label htmlFor="resumo">Resumo</Label>
              <Textarea
                id="resumo"
                value={form.resumo}
                onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                placeholder="Breve resumo da noticia (aparece no card de preview)"
                className="border-[#d1d1cc] resize-none"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem de Capa</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg border border-[#d1d1cc]"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-24 rounded-lg border-2 border-dashed border-[#d1d1cc] flex flex-col items-center justify-center bg-[#f5f5f0]/50 flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-[#d1d1cc] mb-1" />
                    <span className="text-[10px] text-[#d1d1cc]">Sem imagem</span>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-[#6b6b6b] file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-[#1a5c2e]/10 file:text-[#1a5c2e] hover:file:bg-[#1a5c2e]/20 cursor-pointer"
                  />
                  <p className="text-[10px] text-[#6b6b6b]">
                    Formatos: JPG, PNG, WebP. Maximo 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Conteudo - Rich Text Editor */}
            <div className="space-y-2">
              <Label>
                Conteudo <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-[#6b6b6b]">
                Utilize o editor para formatar o texto com negrito, italico,
                titulos, listas, imagens, links e mais.
              </p>
              <TipTapEditor
                content={form.conteudo}
                onChange={(html) => setForm({ ...form, conteudo: html })}
                placeholder="Escreva o conteudo completo da noticia..."
                minHeight="300px"
              />
            </div>

            {/* Bottom row: Ordem, Activo, Destaque */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem</Label>
                <Input
                  id="ordem"
                  type="number"
                  value={form.ordem}
                  onChange={(e) =>
                    setForm({ ...form, ordem: parseInt(e.target.value) || 0 })
                  }
                  className="border-[#d1d1cc]"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="activo"
                  checked={form.activo}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, activo: checked })
                  }
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  Noticia activa
                </Label>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="destaque"
                  checked={form.destaque}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, destaque: checked })
                  }
                />
                <Label htmlFor="destaque" className="cursor-pointer flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#d4a017]" />
                  Destaque
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
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
              {editingId ? 'Actualizar' : 'Criar Noticia'}
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
            <AlertDialogTitle>Eliminar Noticia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta noticia? Esta accao e
              irreversivel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d1d1cc]">
              Cancelar
            </AlertDialogCancel>
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
    </Card>
  );
}
