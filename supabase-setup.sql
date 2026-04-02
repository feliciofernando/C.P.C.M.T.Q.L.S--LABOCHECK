-- ============================================================
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- Script de Configuracao da Base de Dados
-- Execute este script no Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabela de Administradores (para login)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nome TEXT DEFAULT 'Administrador',
  role TEXT DEFAULT 'admin',
  activo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMPTZ DEFAULT now(),
  data_ultimo_acesso TIMESTAMPTZ
);

-- Inserir utilizador admin padrao (password: cpcmtqls2025)
INSERT INTO admin_users (username, password, nome)
VALUES ('admin', 'cpcmtqls2025', 'Administrador Geral')
ON CONFLICT (username) DO NOTHING;

-- 2. Tabela de Condutores
CREATE TABLE IF NOT EXISTS condutores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_ordem INTEGER UNIQUE NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'ATIVA',

  -- Dados Pessoais
  nome_completo TEXT NOT NULL DEFAULT '',
  data_nascimento TEXT DEFAULT '',
  sexo TEXT DEFAULT '',
  numero_bi TEXT UNIQUE DEFAULT '',
  data_emissao_bi TEXT DEFAULT '',
  estado_civil TEXT DEFAULT '',
  telefone1 TEXT DEFAULT '',
  telefone2 TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  municipio TEXT DEFAULT '',

  -- Dados Profissionais
  tipo_veiculo TEXT DEFAULT '',
  marca_veiculo TEXT DEFAULT '',
  modelo_veiculo TEXT DEFAULT '',
  cor_veiculo TEXT DEFAULT '',
  matricula_veiculo TEXT DEFAULT '',
  numero_carta_conducao TEXT DEFAULT '',
  categoria_carta TEXT DEFAULT '',
  tempo_experiencia TEXT DEFAULT '',

  -- Local de Trabalho
  municipio_trabalho TEXT DEFAULT '',
  horario_trabalho TEXT DEFAULT '',

  -- Documentacao
  tem_bi BOOLEAN DEFAULT false,
  tem_carta_conducao BOOLEAN DEFAULT false,
  tem_documento_veiculo BOOLEAN DEFAULT false,
  tem_seguro_veiculo BOOLEAN DEFAULT false,
  tem_capacete BOOLEAN DEFAULT false,
  tem_colete_refletor BOOLEAN DEFAULT false,

  -- Formacao
  participou_formacao BOOLEAN DEFAULT false,
  instituicao_formacao TEXT DEFAULT '',

  -- Dados da Licenca
  numero_membro TEXT DEFAULT '',
  nacionalidade TEXT DEFAULT 'Angolana',
  provincia TEXT DEFAULT 'Lunda Sul',
  data_emissao_licenca TEXT DEFAULT '',
  validade_licenca TEXT DEFAULT '',

  -- QR Code e Foto
  qr_code_base64 TEXT DEFAULT '',
  foto_base64 TEXT DEFAULT '',

  -- Metadados
  data_registo TIMESTAMPTZ DEFAULT now(),
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Alertas
CREATE TABLE IF NOT EXISTS alertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  condutor_id UUID REFERENCES condutores(id) ON DELETE CASCADE,
  tipo TEXT DEFAULT '',
  data_validade TEXT DEFAULT '',
  mensagem TEXT DEFAULT '',
  prioridade TEXT DEFAULT 'ALTA',
  estado TEXT DEFAULT 'PENDENTE',
  data_criacao TIMESTAMPTZ DEFAULT now(),
  data_leitura TIMESTAMPTZ,
  data_resolucao TIMESTAMPTZ,
  resolucao TEXT DEFAULT ''
);

-- 4. Indices para performance
CREATE INDEX IF NOT EXISTS idx_condutores_nome ON condutores(nome_completo);
CREATE INDEX IF NOT EXISTS idx_condutores_bi ON condutores(numero_bi);
CREATE INDEX IF NOT EXISTS idx_condutores_ordem ON condutores(numero_ordem);
CREATE INDEX IF NOT EXISTS idx_condutores_status ON condutores(status);
CREATE INDEX IF NOT EXISTS idx_alertas_condutor ON alertas(condutor_id);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas(tipo);
CREATE INDEX IF NOT EXISTS idx_alertas_criacao ON alertas(data_criacao);

-- 5. Trigger para actualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS condutores_updated_at ON condutores;
CREATE TRIGGER condutores_updated_at
  BEFORE UPDATE ON condutores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Desactivar RLS (autenticacao feita pelo NextAuth)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE condutores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Politicas permissivas (a app gere a autenticacao)
CREATE POLICY "full_access_admin" ON admin_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_condutores" ON condutores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "full_access_alertas" ON alertas FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- CONCLUIDO! As tabelas estao prontas para uso.
-- ============================================================
