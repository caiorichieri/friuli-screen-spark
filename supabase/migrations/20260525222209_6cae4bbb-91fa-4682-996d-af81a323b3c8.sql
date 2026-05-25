-- 1. Add 'client' to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- 2. client_managers: maps auth users to clients they can edit
CREATE TABLE public.client_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, user_id)
);

CREATE INDEX idx_client_managers_user_id ON public.client_managers(user_id);
CREATE INDEX idx_client_managers_client_id ON public.client_managers(client_id);

ALTER TABLE public.client_managers ENABLE ROW LEVEL SECURITY;

-- Security-definer helper to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.is_client_manager(_client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.client_managers
    WHERE client_id = _client_id
      AND user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_client_manager(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_client_manager(uuid) TO authenticated;

-- client_managers policies
CREATE POLICY "Admins manage client_managers"
ON public.client_managers FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users view own client_managers"
ON public.client_managers FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 3. client_landings: 1:1 with clients
CREATE TABLE public.client_landings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE REFERENCES public.clients(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  cover_image_url text,
  avatar_url text,
  intro_title text,
  intro_text text,
  accent_color text NOT NULL DEFAULT '#f59e0b',
  video_url text,
  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_landings_client_id ON public.client_landings(client_id);
CREATE INDEX idx_client_landings_enabled ON public.client_landings(enabled) WHERE enabled = true;

ALTER TABLE public.client_landings ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at
CREATE TRIGGER update_client_landings_updated_at
BEFORE UPDATE ON public.client_landings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- client_landings policies
CREATE POLICY "Public can read enabled landings"
ON public.client_landings FOR SELECT TO anon, authenticated
USING (enabled = true);

CREATE POLICY "Admins manage all landings"
ON public.client_landings FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers read own client landings"
ON public.client_landings FOR SELECT TO authenticated
USING (public.is_client_manager(client_id));

CREATE POLICY "Managers insert own client landings"
ON public.client_landings FOR INSERT TO authenticated
WITH CHECK (public.is_client_manager(client_id));

CREATE POLICY "Managers update own client landings"
ON public.client_landings FOR UPDATE TO authenticated
USING (public.is_client_manager(client_id))
WITH CHECK (public.is_client_manager(client_id));

GRANT SELECT ON public.client_landings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.client_landings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_managers TO authenticated;

-- 4. Storage bucket for landing assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-landings', 'client-landings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: files stored under '<client_id>/...'
CREATE POLICY "Public can view client-landings"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'client-landings');

CREATE POLICY "Admins manage client-landings"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'client-landings' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'client-landings' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Managers upload to own client folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'client-landings'
  AND public.is_client_manager(((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Managers update own client folder"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'client-landings'
  AND public.is_client_manager(((storage.foldername(name))[1])::uuid)
);

CREATE POLICY "Managers delete own client folder"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'client-landings'
  AND public.is_client_manager(((storage.foldername(name))[1])::uuid)
);