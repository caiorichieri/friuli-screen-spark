
-- 1. Rebuild clients_public as security_invoker=off so it doesn't depend on a permissive RLS policy
DROP VIEW IF EXISTS public.clients_public;
CREATE VIEW public.clients_public
WITH (security_invoker = off) AS
SELECT id, name, slug, logo_url, website, sort_order, description, is_public, created_at, updated_at
FROM public.clients
WHERE is_public = true;

GRANT SELECT ON public.clients_public TO anon, authenticated;

-- 2. Drop permissive public SELECT policy on clients (email/phone no longer reachable by non-admins)
DROP POLICY IF EXISTS "Public can read public clients" ON public.clients;

-- 3. Create projects_public view exposing only safe portfolio columns + client name
CREATE OR REPLACE VIEW public.projects_public
WITH (security_invoker = off) AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.cover_image_url,
  p.gallery,
  p.year,
  p.tags,
  p.external_url,
  p.portfolio_category_id,
  p.public_summary,
  p.public_sort_order,
  p.client_id,
  c.name AS client_name
FROM public.projects p
LEFT JOIN public.clients c ON c.id = p.client_id
WHERE p.is_public = true;

GRANT SELECT ON public.projects_public TO anon, authenticated;

-- 4. Drop permissive public SELECT policy on projects (internal fields no longer reachable)
DROP POLICY IF EXISTS "Public projects read" ON public.projects;

-- 5. Lock down storage writes on the `downloads` bucket to admins only.
--    Public read access continues to work via the bucket's public CDN setting.
DROP POLICY IF EXISTS "Admins upload downloads" ON storage.objects;
DROP POLICY IF EXISTS "Admins update downloads" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete downloads" ON storage.objects;

CREATE POLICY "Admins upload downloads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'downloads' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update downloads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'downloads' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete downloads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'downloads' AND public.has_role(auth.uid(), 'admin'::app_role));
