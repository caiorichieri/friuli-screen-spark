
-- 1) Portfolio categories
CREATE TABLE public.portfolio_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio categories public read"
  ON public.portfolio_categories FOR SELECT USING (true);

CREATE POLICY "Admins manage portfolio categories"
  ON public.portfolio_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_portfolio_categories_updated_at
  BEFORE UPDATE ON public.portfolio_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categorie di default
INSERT INTO public.portfolio_categories (name, slug, sort_order) VALUES
  ('Eventi', 'eventi', 1),
  ('Campagne stampa', 'campagne-stampa', 2),
  ('Outdoor', 'outdoor', 3),
  ('Digital', 'digital', 4),
  ('Video', 'video', 5);

-- 2) Estendi projects
ALTER TABLE public.projects
  ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN slug TEXT,
  ADD COLUMN cover_image_url TEXT,
  ADD COLUMN gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN year INTEGER,
  ADD COLUMN tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN external_url TEXT,
  ADD COLUMN portfolio_category_id UUID REFERENCES public.portfolio_categories(id) ON DELETE SET NULL,
  ADD COLUMN public_sort_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN public_summary TEXT;

CREATE UNIQUE INDEX projects_slug_unique ON public.projects(slug) WHERE slug IS NOT NULL;
CREATE INDEX projects_is_public_idx ON public.projects(is_public) WHERE is_public = true;

-- Public read policy: solo progetti pubblicati
CREATE POLICY "Public projects read"
  ON public.projects FOR SELECT
  USING (is_public = true);

-- 3) Storage bucket
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-images', 'project-images', true);

CREATE POLICY "Project images public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Admins upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update project images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND has_role(auth.uid(), 'admin'));
