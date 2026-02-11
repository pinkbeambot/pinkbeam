-- Enable RLS for files and storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Storage policies
DROP POLICY IF EXISTS "Public assets are readable" ON storage.objects;
CREATE POLICY "Public assets are readable" ON storage.objects
FOR SELECT
USING (bucket_id = 'public-assets');

DROP POLICY IF EXISTS "Authenticated can read related files" ON storage.objects;
CREATE POLICY "Authenticated can read related files" ON storage.objects
FOR SELECT
USING (
  bucket_id IN ('attachments', 'deliverables')
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1
    FROM public.files f
    LEFT JOIN public.projects p ON p.id = f."projectId"
    LEFT JOIN public.support_tickets t ON t.id = f."ticketId"
    LEFT JOIN public.ticket_comments c ON c.id = f."commentId"
    LEFT JOIN public.invoices i ON i.id = f."invoiceId"
    LEFT JOIN public.users u ON u.id = auth.uid()
    WHERE f."storagePath" = storage.objects.name
      AND f.bucket = storage.objects.bucket_id
      AND (
        f."uploadedById" = auth.uid()
        OR p."clientId" = auth.uid()
        OR t."clientId" = auth.uid()
        OR t."assigneeId" = auth.uid()
        OR c."authorId" = auth.uid()
        OR (i.id IS NOT NULL AND p."clientId" = auth.uid())
        OR u.role IN ('ADMIN', 'MANAGER')
      )
  )
);

DROP POLICY IF EXISTS "Owners can update their objects" ON storage.objects;
CREATE POLICY "Owners can update their objects" ON storage.objects
FOR UPDATE
USING (auth.uid() = owner);

DROP POLICY IF EXISTS "Owners can delete their objects" ON storage.objects;
CREATE POLICY "Owners can delete their objects" ON storage.objects
FOR DELETE
USING (auth.uid() = owner);

-- Files table policies
DROP POLICY IF EXISTS "Files are readable by related users" ON public.files;
CREATE POLICY "Files are readable by related users" ON public.files
FOR SELECT
USING (
  "uploadedById" = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.projects p WHERE p.id = "projectId" AND p."clientId" = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.support_tickets t
    WHERE t.id = "ticketId"
      AND (t."clientId" = auth.uid() OR t."assigneeId" = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.ticket_comments c WHERE c.id = "commentId" AND c."authorId" = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.invoices i
    JOIN public.projects p2 ON p2.id = i."projectId"
    WHERE i.id = "invoiceId" AND p2."clientId" = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('ADMIN', 'MANAGER')
  )
);

DROP POLICY IF EXISTS "Files are writable by owners" ON public.files;
CREATE POLICY "Files are writable by owners" ON public.files
FOR INSERT
WITH CHECK (
  "uploadedById" = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('ADMIN', 'MANAGER')
  )
);

DROP POLICY IF EXISTS "Files are updatable by owners" ON public.files;
CREATE POLICY "Files are updatable by owners" ON public.files
FOR UPDATE
USING (
  "uploadedById" = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('ADMIN', 'MANAGER')
  )
);

DROP POLICY IF EXISTS "Files are deletable by owners" ON public.files;
CREATE POLICY "Files are deletable by owners" ON public.files
FOR DELETE
USING (
  "uploadedById" = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('ADMIN', 'MANAGER')
  )
);
