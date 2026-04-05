'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Clock,
  User,
  Shield,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Filter,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

/* ============================================================
   TYPES
   ============================================================ */

interface LogEntry {
  id: string;
  admin_username: string;
  admin_nome: string;
  acao: string;
  categoria: string;
  detalhes: string;
  ip_address: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LogsResponse {
  data: LogEntry[];
  pagination: Pagination;
  setup: boolean;
}

interface LogStats {
  total: number;
  hoje: number;
  estaSemana: number;
  adminsActivos: number;
}

/* ============================================================
   LABEL MAPPINGS
   ============================================================ */

const CATEGORIA_LABELS: Record<string, string> = {
  AUTENTICACAO: 'Autenticacao',
  CONDUTORES: 'Condutores',
  NOTICIAS: 'Noticias',
  SERVICOS: 'Servicos',
  ALERTAS: 'Alertas',
  SLIDES: 'Slides',
  CARDS: 'Cards',
  CONFIGURACAO: 'Configuracao',
  SISTEMA: 'Sistema',
};

const ACAO_LABELS: Record<string, string> = {
  LOGIN: 'Inicio de Sessao',
  LOGOUT: 'Fim de Sessao',
  CRIAR_FICHA: 'Ficha Criada',
  EDITAR_FICHA: 'Ficha Editada',
  ELIMINAR_FICHA: 'Ficha Eliminada',
  ALTERAR_STATUS: 'Status Alterado',
  CRIAR_NOTICIA: 'Noticia Criada',
  EDITAR_NOTICIA: 'Noticia Editada',
  ELIMINAR_NOTICIA: 'Noticia Eliminada',
  CRIAR_SERVICO: 'Servico Criado',
  EDITAR_SERVICO: 'Servico Editado',
  ELIMINAR_SERVICO: 'Servico Eliminado',
  VERIFICAR_VALIDADES: 'Verificacao de Validades',
  MARCAR_LIDA: 'Alerta Lida',
  MARCAR_RESOLVIDA: 'Alerta Resolvido',
  REABRIR_ALERTA: 'Alerta Reaberto',
  ELIMINAR_ALERTA: 'Alerta Eliminado',
  OPERACAO_EM_MASSA: 'Operacao em Massa',
  CRIAR_SLIDE: 'Slide Criado',
  EDITAR_SLIDE: 'Slide Editado',
  ELIMINAR_SLIDE: 'Slide Eliminado',
  CRIAR_CARD: 'Card Criado',
  EDITAR_CARD: 'Card Editado',
  ELIMINAR_CARD: 'Card Eliminado',
  ALTERAR_SECCAO: 'Seccao de Cards Alterada',
  ALTERAR_CONFIGURACAO: 'Configuracao Alterada',
};

/* ============================================================
   CATEGORY BADGE COLORS
   ============================================================ */

const CATEGORIA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  AUTENTICACAO: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  CONDUTORES: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  NOTICIAS: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  SERVICOS: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  ALERTAS: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  SLIDES: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  CARDS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  CONFIGURACAO: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  SISTEMA: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
};

/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

function formatDateTime(dateStr: string): { date: string; time: string } {
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return { date, time };
  } catch {
    return { date: dateStr, time: '' };
  }
}

function getCategoriaBadge(categoria: string): React.ReactNode {
  const label = CATEGORIA_LABELS[categoria] || categoria;
  const colors = CATEGORIA_COLORS[categoria];

  if (colors) {
    return (
      <Badge
        className={`${colors.bg} ${colors.text} ${colors.border} border text-xs font-medium px-2 py-0.5`}
      >
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs px-2 py-0.5">
      {label}
    </Badge>
  );
}

function getAcaoLabel(acao: string): string {
  return ACAO_LABELS[acao] || acao;
}

/* ============================================================
   CUSTOM SCROLLBAR STYLES
   ============================================================ */

const scrollbarStyles = `
  .logs-table-container::-webkit-scrollbar {
    width: 6px;
  }
  .logs-table-container::-webkit-scrollbar-track {
    background: #f1f1ec;
    border-radius: 3px;
  }
  .logs-table-container::-webkit-scrollbar-thumb {
    background: #c5c5c0;
    border-radius: 3px;
  }
  .logs-table-container::-webkit-scrollbar-thumb:hover {
    background: #a0a09b;
  }
`;

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function PainelLogs() {
  /* ---- State ---- */
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<LogStats>({
    total: 0,
    hoje: 0,
    estaSemana: 0,
    adminsActivos: 0,
  });
  const [setup, setSetup] = useState<boolean | null>(null);

  // Filters
  const [searchAdmin, setSearchAdmin] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('TODOS');
  const [acaoFilter, setAcaoFilter] = useState('TODOS');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // UI
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const isInitialMount = useRef(true);

  /* ---- Fetch logs ---- */
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (searchAdmin) params.set('admin', searchAdmin);
      if (categoriaFilter !== 'TODOS') params.set('categoria', categoriaFilter);
      if (acaoFilter !== 'TODOS') params.set('acao', acaoFilter);
      if (dataInicio) params.set('dataInicio', dataInicio);
      if (dataFim) params.set('dataFim', dataFim);

      const res = await fetch(`/api/admin/logs?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar logs');
      const data: LogsResponse = await res.json();
      setLogs(data.data);
      setPagination(data.pagination);
      setSetup(data.setup);
    } catch {
      toast.error('Erro ao carregar registos de actividade');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchAdmin, categoriaFilter, acaoFilter, dataInicio, dataFim]);

  /* ---- Fetch stats ---- */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/logs?limit=1');
      if (!res.ok) throw new Error('Erro');
      const data: LogsResponse = await res.json();
      setSetup(data.setup);

      // Derive stats from pagination total (first request)
      if (data.setup) {
        setStats((prev) => ({
          ...prev,
          total: data.pagination.total,
        }));

        // Fetch today's count
        const today = new Date().toISOString().split('T')[0];
        const todayRes = await fetch(
          `/api/admin/logs?dataInicio=${today}&dataFim=${today}&limit=1`
        );
        if (todayRes.ok) {
          const todayData = await todayRes.json();
          setStats((prev) => ({
            ...prev,
            hoje: todayData.pagination?.total || 0,
          }));
        }

        // Fetch this week's count
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - mondayOffset);
        const weekStart = monday.toISOString().split('T')[0];
        const weekRes = await fetch(
          `/api/admin/logs?dataInicio=${weekStart}&limit=1`
        );
        if (weekRes.ok) {
          const weekData = await weekRes.json();
          setStats((prev) => ({
            ...prev,
            estaSemana: weekData.pagination?.total || 0,
          }));
        }

        // Estimate active admins by fetching a larger set and counting unique
        const adminsRes = await fetch('/api/admin/logs?limit=200');
        if (adminsRes.ok) {
          const adminsData = await adminsRes.json();
          const uniqueAdmins = new Set(
            adminsData.data?.map((log: LogEntry) => log.admin_username) || []
          );
          setStats((prev) => ({
            ...prev,
            adminsActivos: uniqueAdmins.size,
          }));
        }
      }
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* ---- Effects ---- */
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchStats();
    }
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /* ---- Handlers ---- */
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleResetFilters = () => {
    setSearchAdmin('');
    setCategoriaFilter('TODOS');
    setAcaoFilter('TODOS');
    setDataInicio('');
    setDataFim('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: string) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
  };

  const hasActiveFilters =
    searchAdmin || categoriaFilter !== 'TODOS' || acaoFilter !== 'TODOS' || dataInicio || dataFim;

  /* ---- Setup Warning ---- */
  if (setup === false) {
    return (
      <div className="space-y-4">
        <style>{scrollbarStyles}</style>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-[#1a5c2e]" />
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Registo de Actividades - Auditoria
            </h2>
            <p className="text-xs text-[#6b6b6b]">
              Controlo completo de todas as accoes realizadas no sistema
            </p>
          </div>
        </div>

        <div className="border border-amber-300 bg-amber-50 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-800 mb-2">
                Tabela de auditoria nao configurada
              </h3>
              <p className="text-sm text-amber-700 max-w-lg leading-relaxed">
                Execute o script{' '}
                <code className="bg-amber-100 border border-amber-300 rounded px-2 py-0.5 text-xs font-mono">
                  audit-setup.sql
                </code>{' '}
                no Supabase Dashboard &gt; SQL Editor para activar o sistema de auditoria.
              </p>
            </div>
            <Button
              onClick={fetchLogs}
              variant="outline"
              className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100 text-sm gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              Verificar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- Main Render ---- */
  return (
    <div className="space-y-4">
      <style>{scrollbarStyles}</style>

      {/* ============================
          HEADER
          ============================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1a5c2e] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              Registo de Actividades - Auditoria
            </h2>
            <p className="text-xs text-[#6b6b6b]">
              Controlo completo de todas as accoes realizadas no sistema
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchLogs}
          disabled={loading}
          className="text-sm gap-1.5 ml-auto sm:ml-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* ============================
          STATS ROW
          ============================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#d1d1cc] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#6b6b6b]" />
            <p className="text-xs text-[#6b6b6b] font-medium">Total de Registros</p>
          </div>
          <p className="text-2xl font-bold text-[#1a1a1a]">
            {statsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#6b6b6b] inline" />
            ) : (
              stats.total.toLocaleString('pt-AO')
            )}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-blue-600 font-medium">Hoje</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {statsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-400 inline" />
            ) : (
              stats.hoje.toLocaleString('pt-AO')
            )}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-600 font-medium">Esta Semana</p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {statsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-green-400 inline" />
            ) : (
              stats.estaSemana.toLocaleString('pt-AO')
            )}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <User className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-purple-600 font-medium">Admins Activos</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {statsLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-purple-400 inline" />
            ) : (
              stats.adminsActivos.toLocaleString('pt-AO')
            )}
          </p>
        </div>
      </div>

      {/* ============================
          FILTER BAR
          ============================ */}
      <div className="bg-white border border-[#d1d1cc] rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[#1a5c2e]" />
          <p className="text-sm font-semibold text-[#1a1a1a]">Filtros</p>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">
              Activos
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search admin */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
            <Input
              value={searchAdmin}
              onChange={(e) => setSearchAdmin(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pesquisar administrador..."
              className="pl-9 text-sm"
            />
          </div>

          {/* Categoria dropdown */}
          <Select
            value={categoriaFilter}
            onValueChange={(v) => {
              setCategoriaFilter(v);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Todas Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas Categorias</SelectItem>
              {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Accao dropdown */}
          <Select
            value={acaoFilter}
            onValueChange={(v) => {
              setAcaoFilter(v);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Todas Accoes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todas Accoes</SelectItem>
              {Object.entries(ACAO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range */}
          <div className="flex gap-2">
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="text-sm flex-1"
              placeholder="Data inicio"
            />
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="text-sm flex-1"
              placeholder="Data fim"
            />
          </div>
        </div>

        {/* Filter action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            onClick={handleSearch}
            className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm gap-1.5"
          >
            <Search className="w-4 h-4" />
            Pesquisar
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="text-sm gap-1.5 text-[#6b6b6b] hover:text-[#1a1a1a]"
            >
              <X className="w-4 h-4" />
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* ============================
          RESULTS COUNT
          ============================ */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b6b6b]">
          {pagination.total} registo(s) encontrado(s)
          {hasActiveFilters && (
            <span className="text-[#1a5c2e] ml-1">(filtrado)</span>
          )}
        </p>

        {/* Limit selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6b6b6b]">Mostrar:</span>
          <Select
            value={pagination.limit.toString()}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger className="w-[80px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ============================
          ACTIVITY TABLE
          ============================ */}
      <div className="border border-[#d1d1cc] rounded-lg overflow-hidden bg-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
            <p className="text-sm text-[#6b6b6b] mt-3">A carregar registos...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Clock className="w-12 h-12 text-[#d1d1cc] mb-3" />
            <p className="text-[#6b6b6b] text-sm font-medium">
              Nenhum registo encontrado
            </p>
            {hasActiveFilters && (
              <p className="text-[#b0b0ab] text-xs mt-1">
                Tente ajustar os filtros para ver resultados
              </p>
            )}
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto logs-table-container">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f5f5f0] hover:bg-[#f5f5f0] sticky top-0 z-10">
                  <TableHead className="text-xs font-semibold text-[#1a1a1a] w-[140px]">
                    Data/Hora
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#1a1a1a] w-[160px]">
                    Administrador
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#1a1a1a] w-[130px]">
                    Categoria
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#1a1a1a] w-[160px]">
                    Accao
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#1a1a1a]">
                    Detalhes
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#1a1a1a] w-[120px]">
                    IP
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, index) => {
                  const { date, time } = formatDateTime(log.created_at);
                  return (
                    <TableRow
                      key={log.id}
                      className={`hover:bg-[#f5f5f0]/60 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                      }`}
                    >
                      {/* Data/Hora */}
                      <TableCell className="py-2.5">
                        <div className="text-xs text-[#1a1a1a] font-medium">{date}</div>
                        <div className="text-[11px] text-[#6b6b6b]">{time}</div>
                      </TableCell>

                      {/* Administrador */}
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#1a5c2e]/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-[#1a5c2e]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1a1a1a] truncate">
                              {log.admin_nome}
                            </p>
                            <p className="text-[10px] text-[#6b6b6b] truncate">
                              @{log.admin_username}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Categoria */}
                      <TableCell className="py-2.5">
                        {getCategoriaBadge(log.categoria)}
                      </TableCell>

                      {/* Accao */}
                      <TableCell className="py-2.5">
                        <span className="text-xs text-[#1a1a1a]">
                          {getAcaoLabel(log.acao)}
                        </span>
                      </TableCell>

                      {/* Detalhes */}
                      <TableCell className="py-2.5">
                        <p className="text-xs text-[#6b6b6b] leading-relaxed line-clamp-2">
                          {log.detalhes || '-'}
                        </p>
                      </TableCell>

                      {/* IP */}
                      <TableCell className="py-2.5">
                        <span className="text-[11px] font-mono text-[#6b6b6b] bg-[#f0f0eb] px-1.5 py-0.5 rounded">
                          {log.ip_address || '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ============================
          PAGINATION
          ============================ */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#6b6b6b]">
            Pagina {pagination.page} de {pagination.totalPages}
            <span className="ml-2 text-xs">
              ({((pagination.page - 1) * pagination.limit + 1)}
              -
              {Math.min(pagination.page * pagination.limit, pagination.total)}
              de {pagination.total})
            </span>
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="text-sm gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            {/* Page number indicators */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={
                      pageNum === pagination.page
                        ? 'bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white w-8 h-8 p-0 text-xs'
                        : 'w-8 h-8 p-0 text-xs'
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="text-sm gap-1.5"
            >
              Proximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Single page pagination info */}
      {pagination.totalPages <= 1 && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#b0b0ab]">
            Mostrando {logs.length} de {pagination.total} registo(s)
          </p>
        </div>
      )}
    </div>
  );
}
