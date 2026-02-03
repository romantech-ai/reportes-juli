-- Tabla de reportes (sin autenticación - acceso público)
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Datos del reporte (JSON para mantener estructura actual)
  data JSONB NOT NULL,

  -- Campos indexables para búsquedas
  zona TEXT GENERATED ALWAYS AS (data->'portada'->>'zona') STORED,
  fecha TEXT GENERATED ALWAYS AS (data->'portada'->>'fecha') STORED
);

-- Índices
CREATE INDEX idx_reports_zona ON public.reports(zona);
CREATE INDEX idx_reports_fecha ON public.reports(fecha DESC);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);

-- Row Level Security - permitir acceso público
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Política: acceso público total (solo un usuario)
CREATE POLICY "Public access" ON public.reports
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for reports table
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
