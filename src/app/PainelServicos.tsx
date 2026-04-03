'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ImageIcon,
  Upload,
  RefreshCw,
  GripVertical,
} from 'lucide-react';

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  imagemBase64: string;
  imagemTipo: string;
  ordem: number;
  activo: boolean;
}

const ICON_OPTIONS = [
  { value: 'UserPlus', label: 'Utilizador +' },
  { value: 'CreditCard', label: 'Cartao' },
  { value: 'GraduationCap', label: 'Formacao' },
  { value: 'Shield', label: 'Escudo' },
  { value: 'Wrench', label: 'Chave' },
  { value: 'FileCheck', label: 'Documento' },
  { value: 'Users', label: 'Grupo' },
  { value: 'Car', label: 'Veiculo' },
  { value: 'BookOpen', label: 'Livro' },
];

const emptyServico = {
  titulo: '',
  descricao: '',
  icone: 'Shield',
  imagemBase64: '',
  imagemTipo: 'image/jpeg',
  ordem: 0,
  activo: true,
};

export default function PainelServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [form, setForm] = useState(emptyServico);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadServicos = useCallback(async () => {
    try {
      const res = await fetch('/api/servicos?all=true');
      if (res.ok) {
        const data = await res.json();
        setServicos(data.data || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

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
      const url = editing ? `/api/servicos/${editing.id}` : '/api/servicos';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing ? 'Servico actualizado!' : 'Servico criado!');
        setEditing(null);
        setForm(emptyServico);
        loadServicos();
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

  const handleEdit = (servico: Servico) => {
    setEditing(servico);
    setForm({
      titulo: servico.titulo,
      descricao: servico.descricao,
      icone: servico.icone,
      imagemBase64: servico.imagemBase64,
      imagemTipo: servico.imagemTipo,
      ordem: servico.ordem,
      activo: servico.activo,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este servico?')) return;
    try {
      const res = await fetch(`/api/servicos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Servico eliminado!');
        loadServicos();
      } else {
        toast.error('Erro ao eliminar');
      }
    } catch {
      toast.error('Erro de conexao');
    }
  };

  const handleToggleActive = async (servico: Servico) => {
    try {
      const res = await fetch(`/api/servicos/${servico.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !servico.activo }),
      });
      if (res.ok) loadServicos();
    } catch {
      // silent
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(emptyServico);
  };

  const handleMove = async (servico: Servico, direction: 'up' | 'down') => {
    const newOrdem = direction === 'up' ? servico.ordem - 1 : servico.ordem + 1;
    try {
      const res = await fetch(`/api/servicos/${servico.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordem: newOrdem }),
      });
      if (res.ok) loadServicos();
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-[#6b6b6b]" />
        <span className="ml-2 text-sm text-[#6b6b6b]">A carregar servicos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b6b6b]">
          {servicos.length} {servicos.length === 1 ? 'servico' : 'servicos'} registados
        </p>
        {!editing && (
          <Button
            onClick={() => setEditing(null as unknown as Servico)}
            className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Novo Servico
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {editing !== null && (
        <div className="border border-[#d1d1cc] rounded-lg p-4 bg-[#f5f5f0]/50 space-y-4">
          <h3 className="text-sm font-bold text-[#1a1a1a]">
            {editing?.id ? 'Editar Servico' : 'Novo Servico'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Titulo *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm((p) => ({ ...p, titulo: e.target.value }))}
                placeholder="Nome do servico"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Icone</Label>
              <Select
                value={form.icone}
                onValueChange={(value) => setForm((p) => ({ ...p, icone: value }))}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Descricao</Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
              placeholder="Descricao do servico"
              className="text-sm min-h-[80px]"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Imagem de Fundo</Label>
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
                <p className="text-xs text-[#6b6b6b] mt-1">
                  Imagem de fundo para o cartao de servico. Se nao carregada, sera usada uma cor de gradiente.
                </p>
              </div>
              {form.imagemBase64 && (
                <div className="w-24 h-16 rounded border border-[#d1d1cc] overflow-hidden flex-shrink-0">
                  <img
                    src={`data:${form.imagemTipo};base64,${form.imagemBase64}`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order and active */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold">Ordem:</Label>
              <Input
                type="number"
                value={form.ordem}
                onChange={(e) => setForm((p) => ({ ...p, ordem: parseInt(e.target.value) || 0 }))}
                className="text-sm w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.activo}
                onCheckedChange={(checked) => setForm((p) => ({ ...p, activo: checked }))}
              />
              <Label className="text-xs">Activo</Label>
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

      {/* Servicos List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {servicos.length === 0 ? (
          <p className="text-center text-sm text-[#6b6b6b] py-8">
            Nenhum servico registado. Crie o primeiro!
          </p>
        ) : (
          servicos.map((servico) => (
            <div
              key={servico.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#d1d1cc] bg-white hover:bg-[#f5f5f0]/50 transition-colors"
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(servico, 'up')}
                  className="h-6 w-6 p-0 text-[#6b6b6b] hover:text-[#1a1a1a]"
                  disabled={servico.ordem <= 0}
                >
                  <span className="text-xs font-bold">▲</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMove(servico, 'down')}
                  className="h-6 w-6 p-0 text-[#6b6b6b] hover:text-[#1a1a1a]"
                >
                  <span className="text-xs font-bold">▼</span>
                </Button>
              </div>

              {/* Image thumbnail */}
              <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-[#e8e8e3]">
                {servico.imagemBase64 ? (
                  <img
                    src={`data:${servico.imagemTipo};base64,${servico.imagemBase64}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1a5c2e]">
                    <ImageIcon className="w-5 h-5 text-white/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                    {servico.titulo}
                  </p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#d4a017] text-[#d4a017]">
                    {servico.icone}
                  </Badge>
                  {!servico.activo && (
                    <Badge className="bg-gray-400 text-white text-[10px] px-1.5 py-0">
                      Inactivo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#6b6b6b] truncate">
                  {servico.descricao || 'Sem descricao'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(servico)}
                  className={`h-8 w-8 p-0 ${servico.activo ? 'text-green-600' : 'text-gray-400'}`}
                  title={servico.activo ? 'Desactivar' : 'Activar'}
                >
                  {servico.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(servico)}
                  className="h-8 w-8 p-0 text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(servico.id)}
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
