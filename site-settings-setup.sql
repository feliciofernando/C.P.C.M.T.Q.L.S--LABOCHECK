-- ============================================================
-- Tabela de Configuracoes do Site (Hero, etc.)
-- Execute no Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT DEFAULT '',
  descricao TEXT DEFAULT '',
  data_atualizacao TIMESTAMPTZ DEFAULT now()
);

-- Inserir configuracoes padrao
INSERT INTO site_settings (chave, valor, descricao) VALUES
  ('hero_imagem_base64', '', 'Imagem de fundo do Hero (base64 PNG/JPG)'),
  ('hero_imagem_tipo', 'image/png', 'Tipo MIME da imagem do Hero'),
  ('hero_imagem_nome', '', 'Nome original do ficheiro da imagem do Hero')
ON CONFLICT (chave) DO NOTHING;

-- Desactivar RLS para esta tabela
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "full_access_site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
