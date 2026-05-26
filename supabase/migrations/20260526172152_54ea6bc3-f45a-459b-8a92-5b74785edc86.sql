
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('downloads', 'downloads', true, 104857600, NULL)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 104857600;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public can read downloads') THEN
    CREATE POLICY "Public can read downloads" ON storage.objects FOR SELECT USING (bucket_id = 'downloads');
  END IF;
END $$;
