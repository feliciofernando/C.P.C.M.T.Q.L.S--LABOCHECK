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
} from 'lucide-react';

interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  resumo: string;
  imagem_url: string;
  autor: string;
  activa: boolean;
  ordem: number;
  data_publicacao: string;
  data_criacao?: string;
}

interface NoticiaFormData {
  titulo: string;
  conteudo: string;
  resumo: string;
  imagem_url: string;
  autor: string;
  activa: boolean;
  ordem: number;
}

const emptyForm: NoticiaFormData = {
  titulo: '',
  conteudo: '',
  resumo: '',
  imagem_url: '',
  autor: '',
  activa: true,
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

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all noticias (including inactive) - use a broader query
      const res = await fetch('/api/noticias');
      if (res.ok) {
        const data = await res.json();
        setNoticias(data);
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
    setFormOpen(true);
  };

  const openEditForm = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setForm({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      resumo: noticia.resumo,
      imagem_url: noticia.imagem_url,
      autor: noticia.autor,
      activa: noticia.activa,
      ordem: noticia.ordem,
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.titulo.trim() || !form.conteudo.trim()) {
      toast.error('Preencha os campos obrigatorios: titulo e conteudo');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/noticias/${editingId}` : '/api/noticias';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingId ? 'Noticia actualizada com sucesso' : 'Noticia criada com sucesso');
        setFormOpen(false);
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

  const handleToggleActiva = async (noticia: Noticia) => {
    try {
      const res = await fetch(`/api/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !noticia.activa }),
      });
      if (res.ok) {
        toast.success(noticia.activa ? 'Noticia desactivada' : 'Noticia activada');
        fetchNoticias();
      } else {
        toast.error('Erro ao alterar estado');
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
            <span className="ml-2 text-sm text-[#6b6b6b]">A carregar noticias...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && noticias.length === 0 && (
          <div className="text-center py-10">
            <Newspaper className="w-10 h-10 mx-auto text-[#d1d1cc] mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhuma noticia encontrada.</p>
            <Button onClick={openCreateForm} size="sm" className="mt-4 bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]">
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
                  <TableHead className="font-semibold text-xs hidden sm:table-cell">Autor</TableHead>
                  <TableHead className="font-semibold text-xs hidden md:table-cell">Data</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Ordem</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Estado</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Accoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noticias.map((noticia) => (
                  <TableRow key={noticia.id} className="hover:bg-[#f5f5f0]/50">
                    <TableCell className="max-w-[200px]">
                      <div className="flex items-center gap-3">
                        {noticia.imagem_url ? (
                          <img
                            src={noticia.imagem_url}
                            alt=""
                            className="w-10 h-10 rounded object-cover flex-shrink-0 hidden lg:block"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#1a5c2e]/10 flex items-center justify-center flex-shrink-0 hidden lg:block">
                            <Newspaper className="w-4 h-4 text-[#1a5c2e]" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-[#1a1a1a] truncate">
                          {noticia.titulo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#6b6b6b] hidden sm:table-cell">
                      {noticia.autor || '-'}
                    </TableCell>
                    <TableCell className="text-xs text-[#6b6b6b] hidden md:table-cell whitespace-nowrap">
                      {formatDate(noticia.data_publicacao)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-[#6b6b6b]">
                      {noticia.ordem}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={noticia.activa ? 'default' : 'secondary'}
                        className={
                          noticia.activa
                            ? 'bg-[#1a5c2e] text-white text-xs'
                            : 'bg-gray-200 text-gray-600 text-xs'
                        }
                      >
                        {noticia.activa ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActiva(noticia)}
                          title={noticia.activa ? 'Desactivar' : 'Activar'}
                          className="h-8 w-8 p-0"
                        >
                          {noticia.activa ? (
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="titulo">Titulo *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Titulo da noticia"
                className="border-[#d1d1cc]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumo">Resumo</Label>
              <Textarea
                id="resumo"
                value={form.resumo}
                onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                placeholder="Breve resumo da noticia (opcional)"
                className="border-[#d1d1cc] resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteudo *</Label>
              <Textarea
                id="conteudo"
                value={form.conteudo}
                onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                placeholder="Conteudo completo da noticia (suporta HTML)"
                className="border-[#d1d1cc] min-h-[200px] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imagem_url">URL da Imagem</Label>
                <Input
                  id="imagem_url"
                  value={form.imagem_url}
                  onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="border-[#d1d1cc]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="autor">Autor</Label>
                <Input
                  id="autor"
                  value={form.autor}
                  onChange={(e) => setForm({ ...form, autor: e.target.value })}
                  placeholder="Nome do autor"
                  className="border-[#d1d1cc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="activa"
                  checked={form.activa}
                  onCheckedChange={(checked) => setForm({ ...form, activa: checked })}
                />
                <Label htmlFor="activa" className="cursor-pointer">
                  Noticia activa
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
            <AlertDialogTitle>Eliminar Noticia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta noticia? Esta accao e irreversivel.
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
    </Card>
  );
}
