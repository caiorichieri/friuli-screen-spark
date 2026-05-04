-- 1) Harden has_role: ignore caller-supplied user id, always check auth.uid()
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

-- 2) Restrict project-images public read to images of public projects only
DROP POLICY IF EXISTS "Project images public read" ON storage.objects;

CREATE POLICY "Public project images read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-images'
    AND EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id::text = (storage.foldername(storage.objects.name))[1]
        AND projects.is_public = true
    )
  );