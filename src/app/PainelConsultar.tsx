'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, User, FileText, Shield, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface PainelConsultarProps {
  autoSearch?: string;
}

export default function PainelConsultar({ autoSearch }: PainelConsultarProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [condutor, setCondutor] = useState<Record<string, unknown> | null>(null);
  const [notFound, setNotFound] = useState(false);

  const doSearch = async (searchValue: string) => {
    if (!searchValue.trim()) return;
    setLoading(true);
    setCondutor(null);
    setNotFound(false);
    try {
      const res = await fetch(`/api/condutores/consulta?search=${encodeURIComponent(searchValue)}`);
      if (!res.ok) {
        setNotFound(true);
        setCondutor(null);
        return;
      }
      const data = await res.json();
      setCondutor(data);
    } catch {
      toast.error('Erro na consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    doSearch(search);
  };

  // Auto-search when component mounts with autoSearch prop (QR code scan)
  useEffect(() => {
    if (autoSearch) {
      setSearch(autoSearch);
      doSearch(autoSearch);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Scan banner */}
      {autoSearch && (
        <div className="max-w-xl mx-auto bg-[#1a5c2e]/10 border border-[#1a5c2e]/30 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-[#1a1c2e]">
            📱 Escaneado via Código QR — a mostrar dados do condutor
          </p>
          <p className="text-xs text-[#6b6b6b] mt-1">
            B.I.: {autoSearch}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="max-w-xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <User className="w-6 h-6 text-[#1a5c2e]" />
          <h3 className="text-lg font-bold text-[#1a1a1a]">Consultar a Minha Ficha</h3>
        </div>
        <p className="text-sm text-[#6b6b6b]">
          Insira o seu <span className="font-medium">Número do Bilhete de Identidade</span>,{' '}
          <span className="font-medium">Nome Completo</span> ou{' '}
          <span className="font-medium">Número de Ordem</span> para visualizar
          os seus dados e a situação da sua ficha.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="B.I., Nome ou Nº de Ordem..."
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
            Consultar
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a5c2e]" />
        </div>
      )}

      {/* Not Found */}
      {notFound && !loading && (
        <Card className="max-w-md mx-auto border-[#d1d1cc]">
          <CardContent className="p-6 text-center">
            <FileText className="w-10 h-10 mx-auto text-[#6b6b6b] mb-3" />
            <p className="font-medium text-[#1a1a1a]">Nenhum registo encontrado</p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              Verifique os dados e tente novamente. Se o problema persistir, contacte o Conselho.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {!loading && condutor && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg ${
            condutor.status === 'ATIVA'
              ? 'bg-[#1a5c2e]/10 border border-[#1a5c2e]/30'
              : 'bg-[#c0392b]/10 border border-[#c0392b]/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 ${
                  condutor.status === 'ATIVA' ? 'text-[#1a5c2e]' : 'text-[#c0392b]'
                }`} />
                <div>
                  <p className="font-bold text-sm">Situação da Ficha</p>
                  <p className="text-xs text-[#6b6b6b]">
                    Data de Registo: {formatDate(condutor.dataRegisto as string)}
                  </p>
                </div>
              </div>
              <Badge className={`${condutor.status === 'ATIVA' ? 'status-ativa' : 'status-inativa'} text-sm px-4 py-1`}>
                {condutor.status as string}
              </Badge>
            </div>
          </div>

          {/* Personal Data */}
          <Card className="border-[#d1d1cc]">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#1a5c2e] mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Dados Pessoais
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="Nome Completo" value={condutor.nomeCompleto as string} highlight />
                <InfoRow label="Nº de Ordem" value={String(condutor.numeroOrdem)} highlight />
                <InfoRow label="Nº do B.I." value={condutor.numeroBI as string} />
                <InfoRow label="Data de Nascimento" value={condutor.dataNascimento as string} />
                <InfoRow label="Sexo" value={condutor.sexo as string} />
                <InfoRow label="Estado Civil" value={condutor.estadoCivil as string} />
                <InfoRow label="Endereço" value={condutor.endereco as string} />
                <InfoRow label="Município" value={condutor.municipio as string} />
              </div>
            </CardContent>
          </Card>

          {/* Professional Data */}
          <Card className="border-[#d1d1cc]">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#1a5c2e] mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Dados Profissionais
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="Tipo de Veículo" value={condutor.tipoVeiculo as string} />
                <InfoRow label="Categoria" value={(condutor.categoriaCarta as string) || '-'} />
                <InfoRow label="Marca / Modelo" value={
                  [condutor.marcaVeiculo, condutor.modeloVeiculo].filter(Boolean).join(' - ') || '-'
                } />
                <InfoRow label="Cor" value={(condutor.corVeiculo as string) || '-'} />
                <InfoRow label="Matrícula" value={(condutor.matriculaVeiculo as string) || '-'} />
                <InfoRow label="Município de Trabalho" value={(condutor.municipioTrabalho as string) || '-'} />
              </div>
            </CardContent>
          </Card>

          {/* License Info */}
          <Card className="border-[#d1d1cc]">
            <CardContent className="p-5">
              <h4 className="font-bold text-[#1a5c2e] mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Dados da Licença
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoRow label="Nº Membro" value={(condutor.numeroMembro as string) || '-'} highlight />
                <InfoRow label="Título" value="Condutor Profissional" />
                <InfoRow label="Nacionalidade" value={(condutor.nacionalidade as string) || 'Angolana'} />
                <InfoRow label="Província" value={(condutor.provincia as string) || 'Lunda Sul'} />
                <InfoRow label="Data de Emissão" value={condutor.dataEmissaoLicenca as string} />
                <InfoRow label="Validade" value={condutor.validadeLicenca as string} />
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          <div className="bg-[#f0f0eb] p-4 rounded-lg border border-[#d1d1cc]">
            <p className="text-xs text-[#6b6b6b] text-center">
              Para qualquer esclarecimento, contacte o Conselho Provincial:
            </p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-[#1a1a1a]">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> 941-000-517
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Lunda Sul
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between border-b border-[#e8e8e3] pb-1.5">
      <span className="text-[#6b6b6b]">{label}:</span>
      <span className={`font-medium ${highlight ? 'text-[#1a5c2e]' : 'text-[#1a1a1a]'}`}>
        {value || '-'}
      </span>
    </div>
  );
}
