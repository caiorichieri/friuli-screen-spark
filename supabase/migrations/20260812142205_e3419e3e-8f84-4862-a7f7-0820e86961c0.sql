-- 1. Restrict sensitive columns from the authenticated role
REVOKE SELECT ON public.clients FROM authenticated;
GRANT SELECT (id, name, slug, logo_url, website, description, sort_order, is_public, created_at, updated_at)
  ON public.clients TO authenticated;

REVOKE SELECT ON public.projects FROM authenticated;
GRANT SELECT (id, client_id, title, slug, cover_image_url, gallery, external_url, is_public,
              portfolio_category_id, public_sort_order, public_summary, tags, year)
  ON public.projects TO authenticated;

-- 2. Internal/SECURITY DEFINER functions must not be callable through the API
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_client_manager(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_payment_overdue() FROM anon, authenticated, public;