-- Restrict anonymous column access on projects to public-facing fields only
REVOKE SELECT ON public.projects FROM anon;
GRANT SELECT (id, title, slug, cover_image_url, gallery, year, tags, external_url, portfolio_category_id, public_summary, public_sort_order, client_id, is_public) ON public.projects TO anon;

-- Row-level read access for public rows
DROP POLICY IF EXISTS "Public can read public clients" ON public.clients;
CREATE POLICY "Public can read public clients"
ON public.clients FOR SELECT TO anon, authenticated
USING (is_public = true);

DROP POLICY IF EXISTS "Public can read public projects" ON public.projects;
CREATE POLICY "Public can read public projects"
ON public.projects FOR SELECT TO anon, authenticated
USING (is_public = true);

-- Views now run with the querying user's permissions
ALTER VIEW public.clients_public SET (security_invoker = on);
ALTER VIEW public.projects_public SET (security_invoker = on);