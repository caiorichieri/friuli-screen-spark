CREATE POLICY "Public can read public clients"
ON public.clients
FOR SELECT
TO anon, authenticated
USING (is_public = true);