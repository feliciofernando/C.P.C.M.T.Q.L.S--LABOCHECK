'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import TipTapEditor from '@/components/TipTapEditor';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  ImageIcon,
  Upload,
  RefreshCw,
} from 'lucide-react';

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagemBase64: string;
  imagemTipo: string;
  dataPublicacao: string;
  activo: boolean;
  destaque: boolean;
  ordem: number;
}

const emptyNoticia = {
  titulo: '',
  resumo: '',
  conteudo: '',
  imagemBase64: '',
  imagemTipo: 'image/jpeg',
  activo: true,
  destaque: false,
  ordem: 0,
};

export default function PainelNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Noticia | null>(null);
  const [form, setForm] = useState(emptyNoticia);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadNoticias = useCallback(async () => {
    try {
      const res = await fetch('/api/noticias?all=true&limit=100');
      if (res.ok) {
        const data = await res.json();
        setNoticias(data.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNoticias();
  }, [loadNoticias]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Imagem demasiado grande. Maximo 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setForm((prev) => ({ ...prev, imagemBase64: base64, imagemTipo: file.type }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      toast.error('Titulo e obrigatorio');
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/noticias/${editing.id}` : '/api/noticias';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing ? 'Noticia actualizada!' : 'Noticia criada!');
        setEditing(null);
        setForm(emptyNoticia);
        loadNoticias();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Erro ao guardar');
      }
    } catch {
      toast.error('Erro de conexao');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (noticia: Noticia) => {
    setEditing(noticia);
    setForm({
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      imagemBase64: noticia.imagemBase64,
      imagemTipo: noticia.imagemTipo,
      activo: noticia.activo,
      destaque: noticia.destaque,
      ordem: noticia.ordem,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta noticia?')) return;
    try {
      const res = await fetch(`/api/noticias/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Noticia eliminada!');
        loadNoticias();
      } else {
        toast.error('Erro ao eliminar');
      }
    } catch {
      toast.error('Erro de conexao');
    }
  };

  const handleToggleActive = async (noticia: Noticia) => {
    try {
      const res = await fetch(`/api/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !noticia.activo }),
      });
      if (res.ok) loadNoticias();
    } catch {
      // silent
    }
  };

  const handleToggleDestaque = async (noticia: Noticia) => {
    try {
      const res = await fetch(`/api/noticias/${noticia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destaque: !noticia.destaque }),
      });
      if (res.ok) loadNoticias();
    } catch {
      // silent
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(emptyNoticia);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-[#6b6b6b]" />
        <span className="ml-2 text-sm text-[#6b6b6b]">A carregar noticias...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b6b6b]">
          {noticias.length} {noticias.length === 1 ? 'noticia' : 'noticias'} registadas
        </p>
        {!editing && (
          <Button
            onClick={() => setEditing(null as unknown as Noticia)}
            className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nova Noticia
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {editing !== null && (
        <div className="border border-[#d1d1cc] rounded-lg p-4 bg-[#f5f5f0]/50 space-y-4">
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            {editing?.id ? 'Editar Noticia' : 'Nova Noticia'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Titulo *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                placeholder="Titulo da noticia"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Ordem</Label>
              <Input
                type="number"
                value={form.ordem}
                onChange={(e) => setForm((p) => ({ ...p, ordem: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="text-sm w-24"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Resumo</Label>
            <Textarea
              value={form.resumo}
              onChange={(e) => setForm((p) => ({ ...p, resumo: e.target.value }))}
              placeholder="Breve resumo da noticia (2-3 frases)"
              className="text-sm min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Conteudo Completo</Label>
            <TipTapEditor
              content={form.conteudo}
              onChange={(html) => setForm((p) => ({ ...p, conteudo: html }))}
              placeholder="Escreva o conteudo completo da noticia..."
              minHeight="500px"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Imagem</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  {form.imagemBase64 ? 'Alterar Imagem' : 'Carregar Imagem'}
                </Button>
                {form.imagemBase64 && (
                  <button
                    onClick={() => setForm((p) => ({ ...p, imagemBase64: '', imagemTipo: 'image/jpeg' }))}
                    className="ml-2 text-xs text-red-500 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
              {form.imagemBase64 && (
                <div className="w-20 h-14 rounded border border-[#d1d1cc] overflow-hidden flex-shrink-0">
                  <img
                    src={`data:${form.imagemTipo};base64,${form.imagemBase64}`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.activo}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, activo: checked }))}
              />
              <Label className="text-xs">Activa</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.destaque}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, destaque: checked }))}
              />
              <Label className="text-xs">Destaque</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm"
            >
              {saving ? 'A guardar...' : 'Guardar'}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="text-sm">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Noticias List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {noticias.length === 0 ? (
          <p className="text-center text-sm text-[#6b6b6b] py-8">
            Nenhuma noticia registada. Crie a primeira!
          </p>
        ) : (
          noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#d1d1cc] bg-white hover:bg-[#f5f5f0]/50 transition-colors"
            >
              {/* Image thumbnail */}
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-[#e8e8e3]">
                {noticia.imagemBase64 ? (
                  <img
                    src={`data:${noticia.imagemTipo};base64,${noticia.imagemBase64}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-[#b0b0ab]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {noticia.titulo}
                  </p>
                  {noticia.destaque && (
                    <Badge className="bg-[#d4a017] text-white text-[10px] px-1.5 py-0">
                      Destaque
                    </Badge>
                  )}
                  {!noticia.activo && (
                    <Badge className="bg-gray-400 text-white text-[10px] px-1.5 py-0">
                      Inactiva
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#6b6b6b] truncate">{noticia.resumo || 'Sem resumo'}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleDestaque(noticia)}
                  className={`h-8 w-8 p-0 ${noticia.destaque ? 'text-[#d4a017]' : 'text-[#b0b0ab]'}`}
                  title={noticia.destaque ? 'Remover destaque' : 'Marcar como destaque'}
                >
                  {noticia.destaque ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(noticia)}
                  className={`h-8 w-8 p-0 ${noticia.activo ? 'text-green-600' : 'text-gray-400'}`}
                  title={noticia.activo ? 'Desactivar' : 'Activar'}
                >
                  {noticia.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(noticia)}
                  className="h-8 w-8 p-0 text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(noticia.id)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
