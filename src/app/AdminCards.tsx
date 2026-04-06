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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  LayoutGrid,
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { value: 'MessageSquare', label: 'Mensagem' },
  { value: 'Calendar', label: 'Calendário' },
  { value: 'Scale', label: 'Lei' },
  { value: 'HelpCircle', label: 'Ajuda' },
  { value: 'FileText', label: 'Documento' },
  { value: 'Users', label: 'Utilizadores' },
  { value: 'Building2', label: 'Edifício' },
  { value: 'Newspaper', label: 'Notícias' },
];

interface CardItem {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  link: string;
  ordem: number;
  activo: boolean;
}

interface CardFormData {
  titulo: string;
  descricao: string;
  conteudo: string;
  icone: string;
  link: string;
  ordem: number;
  activo: boolean;
}

const emptyCardForm: CardFormData = {
  titulo: '',
  descricao: '',
  conteudo: '',
  icone: 'MessageSquare',
  link: '',
  ordem: 0,
  activo: true,
};

export default function AdminCards() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Card form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormData>(emptyCardForm);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards?all=true');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
      } else {
        toast.error('Erro ao carregar cards');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // ---- Card CRUD ----

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyCardForm, ordem: cards.length });
    setFormOpen(true);
  };

  const openEditForm = (card: CardItem) => {
    setEditingId(card.id);
    setForm({
      titulo: card.titulo,
      descricao: card.descricao,
      conteudo: (card as Record<string, unknown>).conteudo as string || '',
      icone: card.icone,
      link: card.link,
      ordem: card.ordem,
      activo: card.activo,
    });
    setFormOpen(true);
  };

  const handleSaveCard = async () => {
    if (!form.titulo.trim()) {
      toast.error('Preencha o campo título');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/cards/${editingId}` : '/api/cards';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? form
        : { titulo: form.titulo, descricao: form.descricao, conteudo: form.conteudo, icone: form.icone, link: form.link, ordem: form.ordem };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? 'Card actualizado com sucesso' : 'Card criado com sucesso');
        setFormOpen(false);
        fetchCards();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erro ao guardar card');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cards/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Card eliminado com sucesso');
        fetchCards();
      } else {
        toast.error('Erro ao eliminar card');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleActivo = async (card: CardItem) => {
    try {
      const res = await fetch(`/api/cards/${card.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !card.activo }),
      });
      if (res.ok) {
        toast.success(card.activo ? 'Card desactivado' : 'Card activado');
        fetchCards();
      } else {
        toast.error('Erro ao alterar estado');
      }
    } catch {
      toast.error('Erro de ligação ao servidor');
    }
  };

  const handleMoveUp = async (card: CardItem) => {
    const idx = cards.findIndex((c) => c.id === card.id);
    if (idx <= 0) return;
    const prevCard = cards[idx - 1];
    try {
      await Promise.all([
        fetch(`/api/cards/${card.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: prevCard.ordem }),
        }),
        fetch(`/api/cards/${prevCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: card.ordem }),
        }),
      ]);
      fetchCards();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  const handleMoveDown = async (card: CardItem) => {
    const idx = cards.findIndex((c) => c.id === card.id);
    if (idx < 0 || idx >= cards.length - 1) return;
    const nextCard = cards[idx + 1];
    try {
      await Promise.all([
        fetch(`/api/cards/${card.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: nextCard.ordem }),
        }),
        fetch(`/api/cards/${nextCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ordem: card.ordem }),
        }),
      ]);
      fetchCards();
    } catch {
      toast.error('Erro ao reordenar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards List */}
      <Card className="border-[#d1d1cc] shadow-sm">
        <CardHeader className="bg-[#1a5c2e] text-white py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <LayoutGrid className="w-5 h-5" />
              Cards ({cards.length})
            </CardTitle>
            <Button
              onClick={openCreateForm}
              size="sm"
              className="bg-white text-[#1a5c2e] hover:bg-gray-100"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Card
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
              <span className="ml-2 text-sm text-[#6b6b6b]">A carregar cards...</span>
            </div>
          )}

          {!loading && cards.length === 0 && (
            <div className="text-center py-10">
              <LayoutGrid className="w-10 h-10 mx-auto text-[#d1d1cc] mb-3" />
              <p className="text-[#6b6b6b] text-sm">Nenhum card encontrado.</p>
              <Button onClick={openCreateForm} size="sm" className="mt-4 bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]">
                <Plus className="w-4 h-4 mr-1.5" />
                Criar primeiro card
              </Button>
            </div>
          )}

          {!loading && cards.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-[#d1d1cc]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f5f5f0]">
                    <TableHead className="font-semibold text-xs w-10">Ordem</TableHead>
                    <TableHead className="font-semibold text-xs">Título</TableHead>
                    <TableHead className="font-semibold text-xs hidden sm:table-cell">Ícone</TableHead>
                    <TableHead className="font-semibold text-xs hidden md:table-cell">Descrição</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Estado</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cards.map((card) => (
                    <TableRow key={card.id} className="hover:bg-[#f5f5f0]/50">
                      <TableCell className="text-xs text-[#6b6b6b] text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(card)}
                            disabled={cards.indexOf(card) === 0}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <span className="w-5 text-center">{card.ordem}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(card)}
                            disabled={cards.indexOf(card) === cards.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#1a1a1a]">
                        {card.titulo}
                      </TableCell>
                      <TableCell className="text-xs text-[#6b6b6b] hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs font-normal border-[#d1d1cc]">
                          {card.icone}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[#6b6b6b] hidden md:table-cell max-w-[200px] truncate">
                        {card.descricao}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={card.activo ? 'default' : 'secondary'}
                          className={
                            card.activo
                              ? 'bg-[#1a5c2e] text-white text-xs'
                              : 'bg-gray-200 text-gray-600 text-xs'
                          }
                        >
                          {card.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActivo(card)}
                            className="h-8 w-8 p-0"
                            title={card.activo ? 'Desactivar' : 'Activar'}
                          >
                            <div className={`w-2 h-2 rounded-full ${card.activo ? 'bg-[#1a5c2e]' : 'bg-gray-300'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(card)}
                            title="Editar"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-4 h-4 text-[#d4a017]" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(card.id)}
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

      {/* Create/Edit Card Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0">
          <div className="px-6 pt-6 pb-2 flex-shrink-0">
            <DialogHeader>
              <DialogTitle className="text-[#1a1a1a]">
                {editingId ? 'Editar Card' : 'Novo Card'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Actualize os campos do card.' : 'Preencha os campos para criar um novo card.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="overflow-y-auto flex-1 px-6 space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="card-titulo">Título *</Label>
              <Input
                id="card-titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Título do card"
                className="border-[#d1d1cc]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-descricao">Descrição Breve</Label>
              <Textarea
                id="card-descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Descrição breve do card"
                className="border-[#d1d1cc] resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo Completo da Página</Label>
              <TipTapEditor
                content={form.conteudo}
                onChange={(html) => setForm({ ...form, conteudo: html })}
                placeholder="Escreva o conteúdo completo da página do card..."
                minHeight="200px"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-icone">Ícone</Label>
                <Select
                  value={form.icone}
                  onValueChange={(value) => setForm({ ...form, icone: value })}
                >
                  <SelectTrigger className="border-[#d1d1cc]">
                    <SelectValue placeholder="Seleccionar ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ICONS.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label} ({icon.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-link">Link</Label>
                <Input
                  id="card-link"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://... ou #secção"
                  className="border-[#d1d1cc]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-ordem">Ordem</Label>
                <Input
                  id="card-ordem"
                  type="number"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                  className="border-[#d1d1cc]"
                />
              </div>

              {editingId && (
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    id="card-activo"
                    checked={form.activo}
                    onCheckedChange={(checked) => setForm({ ...form, activo: checked })}
                  />
                  <Label htmlFor="card-activo" className="cursor-pointer">
                    Card activo
                  </Label>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#d1d1cc] flex-shrink-0">
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="border-[#d1d1cc]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCard}
                disabled={saving}
                className="bg-[#1a5c2e] text-white hover:bg-[#0f3d1d]"
              >
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Actualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Card</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este card? Esta acção é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#d1d1cc]">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCard}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
