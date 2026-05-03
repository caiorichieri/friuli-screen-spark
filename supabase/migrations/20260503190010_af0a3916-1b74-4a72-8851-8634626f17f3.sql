-- Create a public view that excludes sensitive contact fields (email, phone)
CREATE OR REPLACE VIEW public.clients_public
WITH (security_invoker = on) AS
SELECT id, name, slug, logo_url, website, sort_order, description, is_public, created_at, updated_at
FROM public.clients
WHERE is_public = true;

GRANT SELECT ON public.clients_public TO anon, authenticated;

-- Remove the public SELECT policy that exposed email and phone
DROP POLICY IF EXISTS "Public clients read" ON public.clients;