
DROP POLICY IF EXISTS "Client logos public read" ON storage.objects;

CREATE POLICY "Admins list client logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'));
