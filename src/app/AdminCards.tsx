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
  ImageIcon,
  LayoutGrid,
  Upload,
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { value: 'MessageSquare', label: 'Mensagem' },
  { value: 'Calendar', label: 'Calendario' },
  { value: 'Scale', label: 'Lei' },
  { value: 'HelpCircle', label: 'Ajuda' },
  { value: 'FileText', label: 'Documento' },
  { value: 'Users', label: 'Utilizadores' },
  { value: 'Building2', label: 'Edificio' },
  { value: 'Newspaper', label: 'Noticias' },
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

interface SectionSettings {
  titulo: string;
  subtitulo: string;
  imagem_fundo_base64: string;
  imagem_fundo_tipo: string;
}

interface CardFormData {
  titulo: string;
  descricao: string;
  icone: string;
  link: string;
  ordem: number;
  activo: boolean;
}

const emptyCardForm: CardFormData = {
  titulo: '',
  descricao: '',
  icone: 'MessageSquare',
  link: '',
  ordem: 0,
  activo: true,
};

export default function AdminCards() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [section, setSection] = useState<SectionSettings>({
    titulo: '',
    subtitulo: '',
    imagem_fundo_base64: '',
    imagem_fundo_tipo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Card form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CardFormData>(emptyCardForm);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Section editing
  const [editingSection, setEditingSection] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionSettings>({
    titulo: '',
    subtitulo: '',
    imagem_fundo_base64: '',
    imagem_fundo_tipo: '',
  });
  const [savingSection, setSavingSection] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards || []);
        setSection(data.section || {});
        setSectionForm(data.section || {});
      } else {
        toast.error('Erro ao carregar cards');
      }
    } catch {
      toast.error('Erro de ligacao ao servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // ---- Section Settings ----

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
        fetchCards();
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
  };

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
      icone: card.icone,
      link: card.link,
      ordem: card.ordem,
      activo: card.activo,
    });
    setFormOpen(true);
  };

  const handleSaveCard = async () => {
    if (!form.titulo.trim()) {
      toast.error('Preencha o campo titulo');
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/cards/${editingId}` : '/api/cards';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? form
        : { titulo: form.titulo, descricao: form.descricao, icone: form.icone, link: form.link, ordem: form.ordem };

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
      toast.error('Erro de ligacao ao servidor');
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
      toast.error('Erro de ligacao ao servidor');
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
      toast.error('Erro de ligacao ao servidor');
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
      {/* Section Settings */}
      <Card className="border-[#d1d1cc] shadow-sm">
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
            </div>
          )}
        </CardContent>
      </Card>

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
                    <TableHead className="font-semibold text-xs">Titulo</TableHead>
                    <TableHead className="font-semibold text-xs hidden sm:table-cell">Icone</TableHead>
                    <TableHead className="font-semibold text-xs hidden md:table-cell">Descricao</TableHead>
                    <TableHead className="font-semibold text-xs text-center">Estado</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Accoes</TableHead>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              {editingId ? 'Editar Card' : 'Novo Card'}
            </DialogTitle>
            <DialogDescription>
              {editingId ? 'Actualize os campos do card.' : 'Preencha os campos para criar um novo card.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="card-titulo">Titulo *</Label>
              <Input
                id="card-titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Titulo do card"
                className="border-[#d1d1cc]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-descricao">Descricao</Label>
              <Textarea
                id="card-descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Descricao breve do card"
                className="border-[#d1d1cc] resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-icone">Icone</Label>
                <Select
                  value={form.icone}
                  onValueChange={(value) => setForm({ ...form, icone: value })}
                >
                  <SelectTrigger className="border-[#d1d1cc]">
                    <SelectValue placeholder="Seleccionar icone" />
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
                  placeholder="https://... ou #seccao"
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Card</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este card? Esta accao e irreversivel.
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
