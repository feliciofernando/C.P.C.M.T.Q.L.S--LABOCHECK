'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  FileDown,
  ImageDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface CondutorSummary {
  id: string;
  numeroOrdem: number;
  nomeCompleto: string;
  numeroBI: string;
  sexo: string;
  tipoVeiculo: string;
  municipio: string;
  status: string;
  dataRegisto: string;
  dataEmissaoLicenca: string;
  validadeLicenca: string;
  numeroMembro: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PainelVisualizar() {
  const [condutores, setCondutores] = useState<CondutorSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [loading, setLoading] = useState(false);
  const [selectedCondutor, setSelectedCondutor] = useState<CondutorSummary | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [condutorDetail, setCondutorDetail] = useState<Record<string, unknown> | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [downloadingFicha, setDownloadingFicha] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);

  const fetchCondutores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/condutores/registo?${params}`);
      if (!res.ok) throw new Error('Erro ao carregar');
      const data = await res.json();
      setCondutores(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Erro ao carregar condutores');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter]);

  useEffect(() => {
    fetchCondutores();
  }, [fetchCondutores]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchCondutores();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ATIVA' ? 'INATIVO' : 'ATIVA';
    try {
      const res = await fetch('/api/condutores/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Erro ao actualizar');
      toast.success(`Ficha ${newStatus === 'ATIVA' ? 'activada' : 'desactivada'} com sucesso`);
      fetchCondutores();
    } catch {
      toast.error('Erro ao actualizar status');
    }
  };

  const viewDetail = async (condutor: CondutorSummary) => {
    setSelectedCondutor(condutor);
    setShowDetail(true);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/condutores/qr-code?id=${condutor.id}`);
      if (res.ok) {
        const data = await res.json();
        setCondutorDetail(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDownloadFicha = async () => {
    if (!condutorDetail) return;
    setDownloadingFicha(true);
    try {
      const res = await fetch('/api/condutores/ficha-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: condutorDetail.id }),
      });
      if (!res.ok) throw new Error('Erro ao gerar PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ficha_Registo_${condutorDetail.numeroOrdem}_${String(condutorDetail.nomeCompleto).replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Ficha de Registo descarregada com sucesso');
    } catch {
      toast.error('Erro ao gerar o PDF da Ficha');
    } finally {
      setDownloadingFicha(false);
    }
  };

  const handleDownloadQR = async () => {
    if (!condutorDetail) return;
    setDownloadingQR(true);
    try {
      const res = await fetch(`/api/condutores/qr-jpeg?id=${condutorDetail.id}`);
      if (!res.ok) throw new Error('Erro ao descarregar QR Code');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_Code_${condutorDetail.numeroOrdem}_${String(condutorDetail.nomeCompleto).replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Código QR descarregado com sucesso (JPEG)');
    } catch {
      toast.error('Erro ao descarregar o QR Code');
    } finally {
      setDownloadingQR(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-AO');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pesquisar por Nome, B.I. ou Nº de Ordem..."
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPagination((prev) => ({ ...prev, page: 1 })); }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="ATIVA">Activa</SelectItem>
            <SelectItem value="INATIVO">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleSearch}
          className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white"
        >
          <Search className="w-4 h-4 mr-1" /> Pesquisar
        </Button>
        <Button variant="outline" onClick={fetchCondutores}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-[#6b6b6b]">
        {pagination.total} registo(s) encontrado(s)
        {search && <> para &quot;<span className="font-medium text-[#1a1a1a]">{search}</span>&quot;</>}
      </p>

      {/* Table */}
      <div className="border border-[#d1d1cc] rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f0f0eb] hover:bg-[#f0f0eb]">
                <TableHead className="font-bold text-[#1a1a1a] w-20">Nº</TableHead>
                <TableHead className="font-bold text-[#1a1a1a]">Nome Completo</TableHead>
                <TableHead className="font-bold text-[#1a1a1a] hidden md:table-cell">B.I.</TableHead>
                <TableHead className="font-bold text-[#1a1a1a] hidden lg:table-cell">Veículo</TableHead>
                <TableHead className="font-bold text-[#1a1a1a] hidden lg:table-cell">Município</TableHead>
                <TableHead className="font-bold text-[#1a1a1a] w-28">Situação</TableHead>
                <TableHead className="font-bold text-[#1a1a1a] w-20">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#1a5c2e]" />
                    <p className="text-sm text-[#6b6b6b] mt-2">A carregar...</p>
                  </TableCell>
                </TableRow>
              ) : condutores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-[#6b6b6b]">Nenhum registo encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                condutores.map((c) => (
                  <TableRow key={c.id} className="hover:bg-[#f8f8f5]">
                    <TableCell className="font-medium">{c.numeroOrdem}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{c.nomeCompleto}</span>
                        <span className="text-xs text-[#6b6b6b] block">{c.sexo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{c.numeroBI}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{c.tipoVeiculo}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{c.municipio || '-'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleStatus(c.id, c.status)}
                        className="cursor-pointer"
                        title="Clique para alterar"
                      >
                        <Badge className={`${c.status === 'ATIVA' ? 'status-ativa' : 'status-inativa'} text-xs px-2 py-0.5`}>
                          {c.status}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewDetail(c)}
                        className="h-8 w-8 p-0 text-[#1a5c2e] hover:text-[#0f3d1d] hover:bg-[#1a5c2e]/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a5c2e]">
              Ficha de Registo - Nº {selectedCondutor?.numeroOrdem}
            </DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a5c2e]" />
            </div>
          ) : condutorDetail ? (
            <div className="space-y-6">
              {/* Status + Download Ficha */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge className={`${condutorDetail.status === 'ATIVA' ? 'status-ativa' : 'status-inativa'} text-sm px-3 py-1`}>
                    {condutorDetail.status as string}
                  </Badge>
                  <span className="text-sm text-[#6b6b6b]">
                    Registo: {formatDate(condutorDetail.dataRegisto as string)}
                  </span>
                </div>
                <Button
                  onClick={handleDownloadFicha}
                  disabled={downloadingFicha}
                  className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white text-sm gap-1.5"
                >
                  {downloadingFicha ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  {downloadingFicha ? 'A gerar...' : 'Baixar Ficha (PDF)'}
                </Button>
              </div>

              {/* Full Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-[#1a5c2e] border-b border-[#d1d1cc] pb-1">Dados Pessoais</h4>
                  <DetailRow label="Nome Completo" value={condutorDetail.nomeCompleto as string} />
                  <DetailRow label="Data de Nascimento" value={condutorDetail.dataNascimento as string} />
                  <DetailRow label="Sexo" value={condutorDetail.sexo as string} />
                  <DetailRow label="Nº B.I." value={condutorDetail.numeroBI as string} />
                  <DetailRow label="Data Emissão B.I." value={condutorDetail.dataEmissaoBI as string} />
                  <DetailRow label="Estado Civil" value={condutorDetail.estadoCivil as string} />
                  <DetailRow label="Telefone 1" value={condutorDetail.telefone1 as string} />
                  <DetailRow label="Telefone 2" value={(condutorDetail.telefone2 as string) || '-'} />
                  <DetailRow label="Endereço" value={condutorDetail.endereco as string} />
                  <DetailRow label="Município" value={condutorDetail.municipio as string} />
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-[#1a5c2e] border-b border-[#d1d1cc] pb-1">Dados Profissionais</h4>
                  <DetailRow label="Tipo de Veículo" value={condutorDetail.tipoVeiculo as string} />
                  <DetailRow label="Marca" value={(condutorDetail.marcaVeiculo as string) || '-'} />
                  <DetailRow label="Modelo" value={(condutorDetail.modeloVeiculo as string) || '-'} />
                  <DetailRow label="Cor" value={(condutorDetail.corVeiculo as string) || '-'} />
                  <DetailRow label="Matricula" value={(condutorDetail.matriculaVeiculo as string) || '-'} />
                  <DetailRow label="Nº Carta Condução" value={(condutorDetail.numeroCartaConducao as string) || '-'} />
                  <DetailRow label="Categoria" value={(condutorDetail.categoriaCarta as string) || '-'} />
                  <DetailRow label="Experiência" value={(condutorDetail.tempoExperiencia as string) || '-'} />
                  <DetailRow label="Município Trabalho" value={(condutorDetail.municipioTrabalho as string) || '-'} />
                  <DetailRow label="Horario" value={(condutorDetail.horarioTrabalho as string) || '-'} />
                </div>
              </div>

              {/* QR Code with download button */}
              {condutorDetail.qrCodeBase64 && (
                <div className="flex items-center gap-5 p-4 bg-[#f0f0eb] rounded-lg border border-[#d1d1cc]">
                  <div className="flex-shrink-0 bg-white p-2 rounded border border-[#d1d1cc]">
                    <img
                      src={condutorDetail.qrCodeBase64 as string}
                      alt="QR Code"
                      className="w-28 h-28"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1a1a1a]">Código QR</p>
                    <p className="text-xs text-[#6b6b6b] mt-1">
                      Este código QR está armazenado na base de dados e pode ser utilizado
                      para geração de certificados (MS Word).
                    </p>
                    <p className="text-xs text-[#6b6b6b] mt-1">
                      Formato: JPEG (Base64)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQR}
                      disabled={downloadingQR}
                      className="mt-2 border-[#1a5c2e] text-[#1a5c2e] hover:bg-[#1a5c2e]/10 text-xs gap-1.5"
                    >
                      {downloadingQR ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImageDown className="w-3.5 h-3.5" />
                      )}
                      {downloadingQR ? 'A descarregar...' : 'Baixar QR Code (JPEG)'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-[#6b6b6b] py-8">Erro ao carregar detalhes</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b border-[#e8e8e3] pb-1">
      <span className="text-[#6b6b6b]">{label}:</span>
      <span className="font-medium text-[#1a1a1a]">{value || '-'}</span>
    </div>
  );
}
