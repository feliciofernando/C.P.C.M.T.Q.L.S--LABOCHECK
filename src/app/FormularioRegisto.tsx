'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  UserPlus,
  Loader2,
  Upload,
  Search,
  Pencil,
  Trash2,
  XCircle,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

interface FormularioRegistoProps {
  onSucesso: () => void;
}

export default function FormularioRegisto({ onSucesso }: FormularioRegistoProps) {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [fotoBase64, setFotoBase64] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editOrdem, setEditOrdem] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const defaultForm = {
    nomeCompleto: '',
    dataNascimento: '',
    sexo: '',
    numeroBI: '',
    dataEmissaoBI: '',
    estadoCivil: '',
    telefone1: '',
    telefone2: '',
    endereco: '',
    municipio: '',
    tipoVeiculo: '',
    marcaVeiculo: '',
    modeloVeiculo: '',
    corVeiculo: '',
    matriculaVeiculo: '',
    numeroCartaConducao: '',
    categoriaCarta: '',
    tempoExperiencia: '',
    municipioTrabalho: '',
    horarioTrabalho: '',
    temBI: false,
    temCartaConducao: false,
    temDocumentoVeiculo: false,
    temSeguroVeiculo: false,
    temCapacete: false,
    temColeteRefletor: false,
    participouFormacao: false,
    instituicaoFormacao: '',
    nacionalidade: 'Angolana',
    provincia: 'Lunda Sul',
  };

  const [form, setForm] = useState(defaultForm);

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setFotoBase64('');
    setEditId(null);
    setEditNome('');
    setEditOrdem(null);
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast.error('Digite um nome ou número de ordem para buscar');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(
        `/api/condutores/consulta?search=${encodeURIComponent(searchInput.trim())}`
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Condutor não encontrado');
      }

      const condutor = await res.json();

      setEditId(condutor.id);
      setEditNome(condutor.nomeCompleto || '');
      setEditOrdem(condutor.numeroOrdem || null);
      setFotoBase64(condutor.fotoBase64 || '');

      setForm({
        nomeCompleto: condutor.nomeCompleto || '',
        dataNascimento: condutor.dataNascimento ? condutor.dataNascimento.slice(0, 10) : '',
        sexo: condutor.sexo || '',
        numeroBI: condutor.numeroBI || '',
        dataEmissaoBI: condutor.dataEmissaoBI ? condutor.dataEmissaoBI.slice(0, 10) : '',
        estadoCivil: condutor.estadoCivil || '',
        telefone1: condutor.telefone1 || '',
        telefone2: condutor.telefone2 || '',
        endereco: condutor.endereco || '',
        municipio: condutor.municipio || '',
        tipoVeiculo: condutor.tipoVeiculo || '',
        marcaVeiculo: condutor.marcaVeiculo || '',
        modeloVeiculo: condutor.modeloVeiculo || '',
        corVeiculo: condutor.corVeiculo || '',
        matriculaVeiculo: condutor.matriculaVeiculo || '',
        numeroCartaConducao: condutor.numeroCartaConducao || '',
        categoriaCarta: condutor.categoriaCarta || '',
        tempoExperiencia: condutor.tempoExperiencia || '',
        municipioTrabalho: condutor.municipioTrabalho || '',
        horarioTrabalho: condutor.horarioTrabalho || '',
        temBI: Boolean(condutor.temBI),
        temCartaConducao: Boolean(condutor.temCartaConducao),
        temDocumentoVeiculo: Boolean(condutor.temDocumentoVeiculo),
        temSeguroVeiculo: Boolean(condutor.temSeguroVeiculo),
        temCapacete: Boolean(condutor.temCapacete),
        temColeteRefletor: Boolean(condutor.temColeteRefletor),
        participouFormacao: Boolean(condutor.participouFormacao),
        instituicaoFormacao: condutor.instituicaoFormacao || '',
        nacionalidade: condutor.nacionalidade || 'Angolana',
        provincia: condutor.provincia || 'Lunda Sul',
      });

      toast.success('Condutor carregado para edição');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro na busca';
      toast.error(message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja eliminar este condutor? Esta acção é irreversível.'
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/condutores/${editId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao eliminar');
      }

      toast.success('Condutor eliminado com sucesso');
      resetForm();
      onSucesso();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao eliminar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A foto deve ter no máximo 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFotoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.nomeCompleto.trim()) {
      toast.error('Nome completo é obrigatório');
      return;
    }
    if (!form.numeroBI.trim()) {
      toast.error('Número do Bilhete de Identidade é obrigatório');
      return;
    }
    if (!form.sexo) {
      toast.error('Sexo é obrigatório');
      return;
    }
    if (!form.tipoVeiculo) {
      toast.error('Tipo de veículo é obrigatório');
      return;
    }

    setLoading(true);

    if (editId) {
      // EDIT mode
      try {
        const res = await fetch(`/api/condutores/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, fotoBase64 }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao actualizar');
        }

        toast.success('Condutor actualizado com sucesso!');
        resetForm();
        onSucesso();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao actualizar';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    } else {
      // CREATE mode
      try {
        const res = await fetch('/api/condutores/registo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, fotoBase64 }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao registar');
        }

        resetForm();
        onSucesso();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro ao registar';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Search Bar */}
      <div className="bg-white border border-[#d1d1cc] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6b6b6b] shrink-0" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Buscar por nome, número de BI ou número de ordem..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSearch}
            disabled={searchLoading}
            variant="outline"
            className="border-[#1a5c2e] text-[#1a5c2e] hover:bg-[#1a5c2e] hover:text-white shrink-0"
          >
            {searchLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Buscar
          </Button>
        </div>
      </div>

      {/* Edit Mode Banner */}
      {editId && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium text-amber-800">
              Editando: <span className="font-bold">{editNome}</span>
              {editOrdem !== null && (
                <span className="ml-2 text-amber-600">
                  &mdash; Nº de Ordem: {editOrdem}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={resetForm}
              variant="outline"
              className="text-sm h-8 border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Cancelar Edição
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
              className="text-sm h-8 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Eliminar Condutor
            </Button>
          </div>
        </div>
      )}

      {/* Foto Upload */}
      <div className="flex items-start gap-4">
        <div className="w-28 h-36 border-2 border-dashed border-[#d1d1cc] rounded-lg flex flex-col items-center justify-center bg-white overflow-hidden">
          {fotoBase64 ? (
            <img src={fotoBase64} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <Upload className="w-6 h-6 mx-auto text-[#6b6b6b] mb-1" />
              <span className="text-xs text-[#6b6b6b]">Foto</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="foto" className="text-sm font-medium text-[#1a1a1a]">
            Foto do Condutor
          </Label>
          <p className="text-xs text-[#6b6b6b] mt-1 mb-2">
            Formato: JPG ou PNG, máximo 2MB
          </p>
          <Input
            id="foto"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="max-w-xs text-sm file:text-sm file:bg-[#1a5c2e] file:text-white file:border-0 file:mr-4"
          />
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 1. Dados Pessoais */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          1. Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="md:col-span-2 lg:col-span-2">
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              value={form.nomeCompleto}
              onChange={(e) => updateField('nomeCompleto', e.target.value)}
              placeholder="Nome completo do condutor"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={(e) => updateField('dataNascimento', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Sexo *</Label>
            <RadioGroup
              value={form.sexo}
              onValueChange={(v) => updateField('sexo', v)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Masculino" id="masculino" />
                <Label htmlFor="masculino" className="cursor-pointer">Masculino</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Feminino" id="feminino" />
                <Label htmlFor="feminino" className="cursor-pointer">Feminino</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="numeroBI">Nº do Bilhete de Identidade *</Label>
            <Input
              id="numeroBI"
              value={form.numeroBI}
              onChange={(e) => updateField('numeroBI', e.target.value)}
              placeholder="Ex: 007248035UE044"
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="dataEmissaoBI">Data de Emissão do B.I.</Label>
            <Input
              id="dataEmissaoBI"
              type="date"
              value={form.dataEmissaoBI}
              onChange={(e) => updateField('dataEmissaoBI', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="estadoCivil">Estado Civil</Label>
            <Select
              value={form.estadoCivil}
              onValueChange={(v) => updateField('estadoCivil', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solteiro/a">Solteiro/a</SelectItem>
                <SelectItem value="Casado/a">Casado/a</SelectItem>
                <SelectItem value="União de Facto">União de Facto</SelectItem>
                <SelectItem value="Viúvo/a">Viúvo/a</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="telefone1">Telefone 1</Label>
            <Input
              id="telefone1"
              value={form.telefone1}
              onChange={(e) => updateField('telefone1', e.target.value)}
              placeholder="Ex: 924-591-350"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="telefone2">Telefone 2</Label>
            <Input
              id="telefone2"
              value={form.telefone2}
              onChange={(e) => updateField('telefone2', e.target.value)}
              placeholder="Opcional"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="endereco">Endereço / Bairro</Label>
            <Input
              id="endereco"
              value={form.endereco}
              onChange={(e) => updateField('endereco', e.target.value)}
              placeholder="Endereço completo"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="municipio">Município</Label>
            <Input
              id="municipio"
              value={form.municipio}
              onChange={(e) => updateField('municipio', e.target.value)}
              placeholder="Ex: Saurimo"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 2. Dados Profissionais */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          2. Dados Profissionais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Tipo de Veículo *</Label>
            <RadioGroup
              value={form.tipoVeiculo}
              onValueChange={(v) => updateField('tipoVeiculo', v)}
              className="flex gap-3 mt-2"
            >
              {['Motociclo', 'Triciclo', 'Quadriciclo'].map((tipo) => (
                <div key={tipo} className="flex items-center gap-1.5">
                  <RadioGroupItem value={tipo} id={`tipo-${tipo}`} />
                  <Label htmlFor={`tipo-${tipo}`} className="cursor-pointer text-sm">{tipo}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="marcaVeiculo">Marca do Veículo</Label>
            <Input
              id="marcaVeiculo"
              value={form.marcaVeiculo}
              onChange={(e) => updateField('marcaVeiculo', e.target.value)}
              placeholder="Ex: Honda"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="modeloVeiculo">Modelo</Label>
            <Input
              id="modeloVeiculo"
              value={form.modeloVeiculo}
              onChange={(e) => updateField('modeloVeiculo', e.target.value)}
              placeholder="Ex: CG 125"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="corVeiculo">Cor</Label>
            <Input
              id="corVeiculo"
              value={form.corVeiculo}
              onChange={(e) => updateField('corVeiculo', e.target.value)}
              placeholder="Ex: Vermelha"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="matriculaVeiculo">Número da Matrícula</Label>
            <Input
              id="matriculaVeiculo"
              value={form.matriculaVeiculo}
              onChange={(e) => updateField('matriculaVeiculo', e.target.value)}
              placeholder="Ex: LD-000-AA"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="numeroCartaConducao">N.º da Carta de Condução</Label>
            <Input
              id="numeroCartaConducao"
              value={form.numeroCartaConducao}
              onChange={(e) => updateField('numeroCartaConducao', e.target.value)}
              placeholder="Numero da carta"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="categoriaCarta">Categoria da Carta</Label>
            <Input
              id="categoriaCarta"
              value={form.categoriaCarta}
              onChange={(e) => updateField('categoriaCarta', e.target.value)}
              placeholder="Ex: A, A1, A2"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tempoExperiencia">Tempo de Experiência</Label>
            <Input
              id="tempoExperiencia"
              value={form.tempoExperiencia}
              onChange={(e) => updateField('tempoExperiencia', e.target.value)}
              placeholder="Ex: 3 anos"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 3. Local de Trabalho */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          3. Local de Trabalho
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="municipioTrabalho">Município onde exerce actividade</Label>
            <Input
              id="municipioTrabalho"
              value={form.municipioTrabalho}
              onChange={(e) => updateField('municipioTrabalho', e.target.value)}
              placeholder="Ex: Saurimo"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="horarioTrabalho">Horário de Trabalho</Label>
            <Input
              id="horarioTrabalho"
              value={form.horarioTrabalho}
              onChange={(e) => updateField('horarioTrabalho', e.target.value)}
              placeholder="Ex: 06h - 18h"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 4. Documentação */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          4. Documentação e Equipamentos
        </h3>
        <p className="text-sm text-[#6b6b6b] mb-3">Assinale os documentos e equipamentos que possui:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'temBI', label: 'Bilhete de Identidade' },
            { key: 'temCartaConducao', label: 'Carta de Condução' },
            { key: 'temDocumentoVeiculo', label: 'Documento do Veículo' },
            { key: 'temSeguroVeiculo', label: 'Seguro do Veículo' },
            { key: 'temCapacete', label: 'Capacete de Proteção' },
            { key: 'temColeteRefletor', label: 'Colete Refletor' },
          ].map((doc) => (
            <div key={doc.key} className="flex items-center gap-2">
              <Checkbox
                id={doc.key}
                checked={form[doc.key as keyof typeof form] as boolean}
                onCheckedChange={(checked) => updateField(doc.key, !!checked)}
              />
              <Label htmlFor={doc.key} className="cursor-pointer text-sm">{doc.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 5. Formação */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          5. Formação
        </h3>
        <p className="text-sm text-[#6b6b6b] mb-3">Já participou em formação sobre segurança rodoviária?</p>
        <RadioGroup
          value={form.participouFormacao ? 'Sim' : 'Nao'}
          onValueChange={(v) => updateField('participouFormacao', v === 'Sim')}
          className="flex gap-4 mb-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Sim" id="form-sim" />
            <Label htmlFor="form-sim" className="cursor-pointer">Sim</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="Não" id="form-nao" />
            <Label htmlFor="form-nao" className="cursor-pointer">Não</Label>
          </div>
        </RadioGroup>
        {form.participouFormacao && (
          <div className="max-w-md">
            <Label htmlFor="instituicaoFormacao">Indique a instituição</Label>
            <Input
              id="instituicaoFormacao"
              value={form.instituicaoFormacao}
              onChange={(e) => updateField('instituicaoFormacao', e.target.value)}
              placeholder="Nome da instituição"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* 6. Declaração */}
      <div>
        <h3 className="text-base font-bold text-[#1a5c2e] mb-4 border-b border-[#d1d1cc] pb-2">
          6. Declaração
        </h3>
        <div className="bg-[#f0f0eb] p-4 rounded-lg border border-[#d1d1cc]">
          <p className="text-sm text-[#1a1a1a] leading-relaxed">
            Declaro que as informações acima prestadas são verdadeiras e comprometo-me a cumprir
            as normas do Conselho Provincial dos Condutores de Motociclos, Triciclos e
            Quadriciclos da Lunda Sul, bem como respeitar o Código de Estrada e as regras de
            segurança rodoviária.
          </p>
        </div>
      </div>

      <Separator className="bg-[#d1d1cc]" />

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#1a5c2e] hover:bg-[#0f3d1d] text-white px-8 py-2.5 text-sm font-medium"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : editId ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {loading
            ? editId
              ? 'A guardar...'
              : 'A registar...'
            : editId
              ? 'Guardar Alterações'
              : 'Registar Condutor'}
        </Button>
      </div>
    </form>
  );
}
