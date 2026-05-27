
-- 1) Restrict sensitive client columns from anonymous users
REVOKE SELECT ON public.clients FROM anon;
GRANT SELECT (id, name, slug, logo_url, website, description, sort_order, is_public, created_at, updated_at)
  ON public.clients TO anon;

-- 2) Remove broad SELECT (listing) on public storage buckets — direct public URLs still work
DROP POLICY IF EXISTS "Public can view client-landings" ON storage.objects;
DROP POLICY IF EXISTS "Public can read downloads" ON storage.objects;

-- 3) Lock down SECURITY DEFINER trigger-only functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_payment_overdue() FROM PUBLIC, anon, authenticated;
