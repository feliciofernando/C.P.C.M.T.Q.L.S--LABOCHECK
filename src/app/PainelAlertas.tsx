'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Search,
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Eye,
  RotateCcw,
  Trash2,
  CheckCheck,
  AlertTriangle,
  XCircle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface CondutorInfo {
  id: string;
  numeroOrdem: number;
  nomeCompleto: string;
  numeroBI: string;
  telefone1: string;
  tipoVeiculo: string;
  status: string;
  validadeLicenca: string;
}

interface Alerta {
  id: string;
  condutorId: string;
  tipo: string;
  dataValidade: string;
  mensagem: string;
  prioridade: string;
  estado: string;
  dataCriacao: string;
  dataLeitura: string | null;
  dataResolucao: string | null;
  resolucao: string;
  condutor: CondutorInfo;
}

interface Contagem {
  total: number;
  PENDENTE: number;
  LIDA: number;
  RESOLVIDA: number;
}

interface PainelAlertasProps {
  onUpdate?: () => void;
}

export default function PainelAlertas({ onUpdate }: PainelAlertasProps) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [contagem, setContagem] = useState<Contagem>({ total: 0, PENDENTE: 0, LIDA: 0, RESOLVIDA: 0 });
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');
  const [tipoFilter, setTipoFilter] = useState('TODOS');
  const [prioridadeFilter, setPrioridadeFilter] = useState('TODOS');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // Resolve dialog
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveAlerta, setResolveAlerta] = useState<Alerta | null>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [resolving, setResolving] = useState(false);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAlerta, setDeleteAlerta] = useState<Alerta | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAlertas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set('search', search);
      if (estadoFilter !== 'TODOS') params.set('estado', estadoFilter);
      if (tipoFilter !== 'TODOS') params.set('tipo', tipoFilter);
      if (prioridadeFilter !== 'TODOS') params.set('prioridade', prioridadeFilter);

      const res = await fetch(`/api/alertas?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setAlertas(data.data);
      setPagination(data.pagination);
      setContagem(data.contagem);
    } catch {
      toast.error('Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, estadoFilter, tipoFilter, prioridadeFilter]);

  useEffect(() => {
    fetchAlertas();
  }, [fetchAlertas]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAlertas();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCheckAlertas = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/alertas/check', { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao verificar');
      const data = await res.json();
      toast.success(data.message);
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao verificar alertas');
    } finally {
      setChecking(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/alertas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'MARCAR_LIDA' }),
      });
      if (!res.ok) throw new Error('Erro');
      toast.success('Alerta marcado como lida');
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao marcar como lida');
    }
  };

  const handleOpenResolve = (alerta: Alerta) => {
    setResolveAlerta(alerta);
    setResolveNote('');
    setResolveDialogOpen(true);
  };

  const handleResolve = async () => {
    if (!resolveAlerta) return;
    setResolving(true);
    try {
      const res = await fetch(`/api/alertas/${resolveAlerta.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'MARCAR_RESOLVIDA', resolucao: resolveNote }),
      });
      if (!res.ok) throw new Error('Erro');
      toast.success('Alerta marcado como resolvida');
      setResolveDialogOpen(false);
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao resolver alerta');
    } finally {
      setResolving(false);
    }
  };

  const handleReopen = async (id: string) => {
    try {
      const res = await fetch(`/api/alertas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'REABRIR' }),
      });
      if (!res.ok) throw new Error('Erro');
      toast.success('Alerta reaberto');
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao reabrir alerta');
    }
  };

  const handleOpenDelete = (alerta: Alerta) => {
    setDeleteAlerta(alerta);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteAlerta) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/alertas/${deleteAlerta.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro');
      toast.success('Alerta eliminado');
      setDeleteDialogOpen(false);
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao eliminar alerta');
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/alertas/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'MARCAR_TODAS_LIDAS' }),
      });
      if (!res.ok) throw new Error('Erro');
      const data = await res.json();
      toast.success(data.message);
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao marcar todas como lidas');
    }
  };

  const handleDeleteResolved = async () => {
    try {
      const res = await fetch('/api/alertas/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao: 'ELIMINAR_RESOLVIDAS' }),
      });
      if (!res.ok) throw new Error('Erro');
      const data = await res.json();
      toast.success(data.message);
      fetchAlertas();
      onUpdate?.();
    } catch {
      toast.error('Erro ao eliminar resolvidas');
    }
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'EXPIRANDO_1MES':
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            A Expirar (30 dias)
          </Badge>
        );
      case 'EXPIRADA':
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expirada
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{tipo}</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case 'ALTA':
        return (
          <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Alta
          </Badge>
        );
      case 'MEDIA':
        return (
          <Badge className="bg-amber-100 text-amber-700 border border-amber-300 text-xs">
            <Info className="w-3 h-3 mr-1" />
            Media
          </Badge>
        );
      case 'BAIXA':
        return (
          <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Baixa
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{prioridade}</Badge>;
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'PENDENTE':
        return (
          <Badge className="bg-orange-100 text-orange-800 border border-orange-300 text-xs">
            <BellRing className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case 'LIDA':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Lida
          </Badge>
        );
      case 'RESOLVIDA':
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolvida
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#d1d1cc] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[#1a1a1a]">{contagem.total}</p>
          <p className="text-xs text-[#6b6b6b]">Total Alertas</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-orange-700">{contagem.PENDENTE}</p>
          <p className="text-xs text-orange-600">Pendentes</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700">{contagem.LIDA}</p>
          <p className="text-xs text-blue-600">Lidas</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{contagem.RESOLVIDA}</p>
          <p className="text-xs text-green-600">Resolvidas</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={handleCheckAlertas}
          disabled={checking}
          className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm gap-1.5"
        >
          {checking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          {checking ? 'A Verificar...' : 'Verificar Alertas'}
        </Button>
        <Button
          variant="outline"
          onClick={handleMarkAllRead}
          disabled={contagem.PENDENTE === 0}
          className="text-sm gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <CheckCheck className="w-4 h-4" />
          Marcar Todas como Lidas
        </Button>
        <Button
          variant="outline"
          onClick={handleDeleteResolved}
          disabled={contagem.RESOLVIDA === 0}
          className="text-sm gap-1.5 border-red-300 text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar Resolvidas
        </Button>
        <Button variant="outline" onClick={fetchAlertas} className="text-sm gap-1.5 ml-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pesquisar por nome, B.I. ou mensagem..."
            className="pl-9"
          />
        </div>
        <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setPagination((prev) => ({ ...prev, page: 1 })); }}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos Estados</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="LIDA">Lida</SelectItem>
            <SelectItem value="RESOLVIDA">Resolvida</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tipoFilter} onValueChange={(v) => { setTipoFilter(v); setPagination((prev) => ({ ...prev, page: 1 })); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos Tipos</SelectItem>
            <SelectItem value="EXPIRANDO_1MES">A Expirar (30 dias)</SelectItem>
            <SelectItem value="EXPIRADA">Expirada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={prioridadeFilter} onValueChange={(v) => { setPrioridadeFilter(v); setPagination((prev) => ({ ...prev, page: 1 })); }}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Prioridade</SelectItem>
            <SelectItem value="ALTA">Alta</SelectItem>
            <SelectItem value="MEDIA">Média</SelectItem>
            <SelectItem value="BAIXA">Baixa</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSearch}
          className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white"
        >
          <Search className="w-4 h-4 mr-1" /> Pesquisar
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#6b6b6b]">
        {pagination.total} alerta(s) encontrado(s)
      </p>

      {/* Alert List */}
      <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
            <p className="text-sm text-[#6b6b6b] ml-2">A carregar alertas...</p>
          </div>
        ) : alertas.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#d1d1cc] rounded-lg">
            <Bell className="w-10 h-10 text-[#d1d1cc] mx-auto mb-3" />
            <p className="text-[#6b6b6b] text-sm">Nenhum alerta encontrado</p>
            <p className="text-[#d1d1cc] text-xs mt-1">
              Clique em &quot;Verificar Alertas&quot; para analisar as licenças
            </p>
          </div>
        ) : (
          alertas.map((alerta) => (
            <div
              key={alerta.id}
              className={`border rounded-lg p-4 bg-white transition-colors ${
                alerta.estado === 'PENDENTE'
                  ? 'border-orange-300 bg-orange-50/30'
                  : alerta.estado === 'LIDA'
                  ? 'border-blue-200 bg-blue-50/20'
                  : 'border-green-200 bg-green-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Left: Alert icon + content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getTipoBadge(alerta.tipo)}
                    {getPrioridadeBadge(alerta.prioridade)}
                    {getEstadoBadge(alerta.estado)}
                    <span className="text-xs text-[#6b6b6b] ml-auto">
                      {formatDateTime(alerta.dataCriacao)}
                    </span>
                  </div>

                  <p className="text-sm text-[#1a1a1a] font-medium leading-relaxed">
                    {alerta.mensagem}
                  </p>

                  {/* Condutor info */}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#6b6b6b]">
                    <span>
                      <strong>Nº Ordem:</strong> {"00" + alerta.condutor.numeroOrdem}
                    </span>
                    <span>
                      <strong>B.I.:</strong> {alerta.condutor.numeroBI}
                    </span>
                    <span>
                      <strong>Veículo:</strong> {alerta.condutor.tipoVeiculo}
                    </span>
                    <span>
                      <strong>Telefone:</strong> {alerta.condutor.telefone1}
                    </span>
                  </div>

                  {/* Resolução info */}
                  {alerta.estado === 'RESOLVIDA' && (
                    <div className="mt-2 text-xs bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-green-800">
                        <strong>Resolvida em:</strong> {formatDateTime(alerta.dataResolucao)}
                      </p>
                      {alerta.resolucao && (
                        <p className="text-green-700 mt-1">
                          <strong>Nota:</strong> {alerta.resolucao}
                        </p>
                      )}
                    </div>
                  )}
                  {alerta.estado === 'LIDA' && alerta.dataLeitura && (
                    <p className="mt-1 text-xs text-blue-600">
                      Lida em: {formatDateTime(alerta.dataLeitura)}
                    </p>
                  )}
                </div>

                {/* Right: Action buttons */}
                <div className="flex sm:flex-col gap-1.5 flex-shrink-0">
                  {alerta.estado === 'PENDENTE' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(alerta.id)}
                        className="text-xs gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 h-8"
                        title="Marcar como Lida"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Lida</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenResolve(alerta)}
                        className="text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50 h-8"
                        title="Marcar como Resolvida"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Resolver</span>
                      </Button>
                    </>
                  )}
                  {alerta.estado === 'LIDA' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenResolve(alerta)}
                        className="text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50 h-8"
                        title="Marcar como Resolvida"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Resolver</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReopen(alerta.id)}
                        className="text-xs gap-1 border-orange-300 text-orange-700 hover:bg-orange-50 h-8"
                        title="Reabrir Alerta"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reabrir</span>
                      </Button>
                    </>
                  )}
                  {alerta.estado === 'RESOLVIDA' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReopen(alerta.id)}
                      className="text-xs gap-1 border-orange-300 text-orange-700 hover:bg-orange-50 h-8"
                      title="Reabrir Alerta"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reabrir</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDelete(alerta)}
                    className="text-xs gap-1 border-red-300 text-red-700 hover:bg-red-50 h-8"
                    title="Eliminar Alerta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6b6b6b]">
            Página {pagination.page} de {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Próximo <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1a5c2e] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Resolver Alerta
            </DialogTitle>
          </DialogHeader>
          {resolveAlerta && (
            <div className="space-y-4">
              <div className="bg-[#f0f0eb] rounded-lg p-3 border border-[#d1d1cc]">
                <p className="text-sm font-medium text-[#1a1a1a]">{resolveAlerta.condutor.nomeCompleto}</p>
                <p className="text-xs text-[#6b6b6b] mt-1">Nº Ordem: {"00" + resolveAlerta.condutor.numeroOrdem} | B.I.: {resolveAlerta.condutor.numeroBI}</p>
                <p className="text-xs text-[#6b6b6b] mt-1">Validade: {resolveAlerta.dataValidade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1a1a1a] block mb-1.5">
                  Nota de Resolução (opcional)
                </label>
                <Textarea
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  placeholder="Descreva como o alerta foi resolvido (ex: licença renovada, contacto feito, etc.)..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleResolve}
              disabled={resolving}
              className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white gap-1.5"
            >
              {resolving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {resolving ? 'A resolver...' : 'Confirmar Resolução'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Eliminar Alerta
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar este alerta? Esta acção não pode ser desfeita.
              {deleteAlerta && (
                <span className="block mt-2 font-medium text-[#1a1a1a]">
                  {deleteAlerta.condutor.nomeCompleto} - Nº {"00" + deleteAlerta.condutor.numeroOrdem}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  A eliminar...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
