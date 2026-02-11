-- File versioning columns and backfill
ALTER TABLE public.files
  ADD COLUMN IF NOT EXISTS "versionGroupId" text,
  ADD COLUMN IF NOT EXISTS version integer,
  ADD COLUMN IF NOT EXISTS "isLatest" boolean;

UPDATE public.files
SET "versionGroupId" = id
WHERE "versionGroupId" IS NULL;

UPDATE public.files
SET version = 1
WHERE version IS NULL;

UPDATE public.files
SET "isLatest" = true
WHERE "isLatest" IS NULL;

ALTER TABLE public.files
  ALTER COLUMN version SET DEFAULT 1,
  ALTER COLUMN version SET NOT NULL,
  ALTER COLUMN "isLatest" SET DEFAULT true,
  ALTER COLUMN "isLatest" SET NOT NULL;

CREATE INDEX IF NOT EXISTS files_version_group_idx ON public.files ("versionGroupId");
CREATE INDEX IF NOT EXISTS files_version_group_latest_idx ON public.files ("versionGroupId", "isLatest");
CREATE UNIQUE INDEX IF NOT EXISTS files_version_unique_idx ON public.files ("versionGroupId", version);
