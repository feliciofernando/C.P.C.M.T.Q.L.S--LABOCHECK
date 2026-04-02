/**
 * Conversão entre snake_case (Supabase) e camelCase (TypeScript).
 * Usa mapeamento explícito para acrónimos (BI, QR, ID, etc.)
 * que não podem ser convertidos automaticamente por regex.
 */

// Mapeamento completo de todos os campos do projecto
const CAMEL_TO_SNAKE: Record<string, string> = {
  // Condutores - Dados Pessoais
  nomeCompleto: 'nome_completo',
  dataNascimento: 'data_nascimento',
  dataEmissaoBI: 'data_emissao_bi',
  numeroBI: 'numero_bi',
  estadoCivil: 'estado_civil',
  telefone1: 'telefone1',
  telefone2: 'telefone2',
  // Condutores - Profissionais
  tipoVeiculo: 'tipo_veiculo',
  marcaVeiculo: 'marca_veiculo',
  modeloVeiculo: 'modelo_veiculo',
  corVeiculo: 'cor_veiculo',
  matriculaVeiculo: 'matricula_veiculo',
  numeroCartaConducao: 'numero_carta_conducao',
  categoriaCarta: 'categoria_carta',
  tempoExperiencia: 'tempo_experiencia',
  // Condutores - Trabalho
  municipioTrabalho: 'municipio_trabalho',
  horarioTrabalho: 'horario_trabalho',
  // Condutores - Documentação
  temBI: 'tem_bi',
  temCartaConducao: 'tem_carta_conducao',
  temDocumentoVeiculo: 'tem_documento_veiculo',
  temSeguroVeiculo: 'tem_seguro_veiculo',
  temCapacete: 'tem_capacete',
  temColeteRefletor: 'tem_colete_refletor',
  // Condutores - Formação
  participouFormacao: 'participou_formacao',
  instituicaoFormacao: 'instituicao_formacao',
  // Condutores - Licença
  numeroMembro: 'numero_membro',
  dataEmissaoLicenca: 'data_emissao_licenca',
  validadeLicenca: 'validade_licenca',
  qrCodeBase64: 'qr_code_base64',
  fotoBase64: 'foto_base64',
  // Condutores - Metadados
  numeroOrdem: 'numero_ordem',
  dataRegisto: 'data_registo',
  dataAtualizacao: 'data_atualizacao',
  // Alertas
  condutorId: 'condutor_id',
  dataValidade: 'data_validade',
  dataCriacao: 'data_criacao',
  dataLeitura: 'data_leitura',
  dataResolucao: 'data_resolucao',
  // Admin
  dataCriacao: 'data_criacao',
  dataUltimoAcesso: 'data_ultimo_acesso',
}

// Mapeamento inverso
const SNAKE_TO_CAMEL: Record<string, string> = {}
for (const [camel, snake] of Object.entries(CAMEL_TO_SNAKE)) {
  SNAKE_TO_CAMEL[snake] = camel
}

// Regex para campos não mapeados (fallback automático)
function autoCamelToSnake(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function autoSnakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

export function camelToSnake(str: string): string {
  return CAMEL_TO_SNAKE[str] || autoCamelToSnake(str)
}

export function snakeToCamel(str: string): string {
  return SNAKE_TO_CAMEL[str] || autoSnakeToCamel(str)
}

export function toCamelCase<T = Record<string, unknown>>(
  obj: Record<string, unknown>
): T {
  if (obj === null || typeof obj !== 'object') return obj as T
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key)
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = toCamelCase(value as Record<string, unknown>)
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map((item) =>
        item !== null && typeof item === 'object'
          ? toCamelCase(item as Record<string, unknown>)
          : item
      )
    } else {
      result[camelKey] = value
    }
  }
  return result as T
}

export function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[camelToSnake(key)] = value
  }
  return result
}

export function arrayToCamelCase<T = Record<string, unknown>>(
  arr: Record<string, unknown>[]
): T[] {
  return arr.map((item) => toCamelCase<T>(item))
}
