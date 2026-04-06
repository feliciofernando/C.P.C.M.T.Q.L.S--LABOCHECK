-- =====================================================
-- Hero Slides Setup - Add descricao column to slides table
-- C.P.C.M.T.Q.L.S - LABOCHECK
-- =====================================================

-- Add descricao column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'slides' AND column_name = 'descricao'
  ) THEN
    ALTER TABLE slides ADD COLUMN descricao TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- Update example slides with descricao text
UPDATE slides SET descricao = 'Condutores de Motociclos, Triciclos e Quadriciclos da Lunda Sul' WHERE titulo = 'C.P.C.M.T.Q.L.S' AND descricao = '';
UPDATE slides SET descricao = 'Promover a seguranca rodoviaria e a organizacao dos condutores profissionais' WHERE titulo = 'Seguranca no Transito' AND descricao = '';
UPDATE slides SET descricao = 'Capacitacao continua para condutores profissionais da provincia' WHERE titulo = 'Formacao Profissional' AND descricao = '';
UPDATE slides SET descricao = 'Emita a sua licenca profissional com QR Code de verificacao instantanea' WHERE titulo = 'Licencas Profissionais' AND descricao = '';
UPDATE slides SET descricao = 'Apoio e acompanhamento completo ao condutor lunda-sulense' WHERE titulo = 'Servicos ao Condutor' AND descricao = '';
UPDATE slides SET descricao = 'Inscreva-se e obtenha a sua licenca profissional de conducao' WHERE titulo = 'Registo de Condutores' AND descricao = '';
