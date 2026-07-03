
CREATE POLICY "own zip upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'deploy-zips' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own zip read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'deploy-zips' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "own zip delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'deploy-zips' AND (storage.foldername(name))[1] = auth.uid()::text);
