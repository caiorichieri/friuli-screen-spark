-- Enum stato progetto
CREATE TYPE public.project_status AS ENUM ('richiesto', 'in_corso', 'completato', 'archiviato');

-- Enum stato pagamento
CREATE TYPE public.payment_status AS ENUM ('da_pagare', 'pagato', 'in_ritardo');

-- Tabella progetti (lavori) per cliente
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status public.project_status NOT NULL DEFAULT 'richiesto',
  -- Modalità "flat": importo singolo se non si usano voci dettagliate
  flat_amount NUMERIC(10, 2),
  notes TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);

-- Voci di un progetto (modalità dettagliata tipo fattura)
CREATE TABLE public.project_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_items_project ON public.project_items(project_id);

-- Scadenze di pagamento (rate)
CREATE TABLE public.payment_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'da_pagare',
  paid_at TIMESTAMPTZ,
  notes TEXT,
  notified_at TIMESTAMPTZ, -- per evitare email duplicate
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_schedules_project ON public.payment_schedules(project_id);
CREATE INDEX idx_payment_schedules_due_date ON public.payment_schedules(due_date);
CREATE INDEX idx_payment_schedules_status ON public.payment_schedules(status);

-- Aggiungo email cliente per future notifiche
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS phone TEXT;

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;

-- Policies: solo admin gestisce tutto (dati interni gestionali)
CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage project_items" ON public.project_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage payment_schedules" ON public.payment_schedules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers updated_at
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_payment_schedules_updated_at BEFORE UPDATE ON public.payment_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger per marcare automaticamente scadenze in ritardo
CREATE OR REPLACE FUNCTION public.update_payment_overdue()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'da_pagare' AND NEW.due_date < CURRENT_DATE THEN
    NEW.status = 'in_ritardo';
  END IF;
  IF NEW.status = 'pagato' AND NEW.paid_at IS NULL THEN
    NEW.paid_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payment_overdue BEFORE INSERT OR UPDATE ON public.payment_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_payment_overdue();