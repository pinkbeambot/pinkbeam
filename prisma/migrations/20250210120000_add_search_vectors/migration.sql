-- Add search_vector columns to all searchable tables
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "search_vector" TEXT;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "search_vector" TEXT;
ALTER TABLE "support_tickets" ADD COLUMN IF NOT EXISTS "search_vector" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "search_vector" TEXT;

-- Create GIN indexes for full-text search using to_tsvector
-- Note: We use a functional index on to_tsvector for proper FTS
DROP INDEX IF EXISTS "users_search_vector_idx";
DROP INDEX IF EXISTS "projects_search_vector_idx";
DROP INDEX IF EXISTS "support_tickets_search_vector_idx";
DROP INDEX IF EXISTS "blog_posts_search_vector_idx";

CREATE INDEX "users_search_vector_idx" ON "users" USING GIN (to_tsvector('english', COALESCE("search_vector", '')));
CREATE INDEX "projects_search_vector_idx" ON "projects" USING GIN (to_tsvector('english', COALESCE("search_vector", '')));
CREATE INDEX "support_tickets_search_vector_idx" ON "support_tickets" USING GIN (to_tsvector('english', COALESCE("search_vector", '')));
CREATE INDEX "blog_posts_search_vector_idx" ON "blog_posts" USING GIN (to_tsvector('english', COALESCE("search_vector", '')));

-- Create function to update search vector for users (clients)
CREATE OR REPLACE FUNCTION update_user_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" := COALESCE(NEW."name", '') || ' ' ||
                         COALESCE(NEW."email", '') || ' ' ||
                         COALESCE(NEW."company", '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update search vector for projects
CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER AS $$
DECLARE
  client_name TEXT;
BEGIN
  SELECT COALESCE(u."name", '') INTO client_name
  FROM "users" u WHERE u."id" = NEW."clientId";
  
  NEW."search_vector" := COALESCE(NEW."title", '') || ' ' ||
                         COALESCE(NEW."description", '') || ' ' ||
                         client_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update search vector for support tickets
CREATE OR REPLACE FUNCTION update_ticket_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" := COALESCE(NEW."title", '') || ' ' ||
                         COALESCE(NEW."description", '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update search vector for blog posts
CREATE OR REPLACE FUNCTION update_blog_post_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."search_vector" := COALESCE(NEW."title", '') || ' ' ||
                         COALESCE(NEW."excerpt", '') || ' ' ||
                         COALESCE(NEW."content", '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS user_search_vector_trigger ON "users";
DROP TRIGGER IF EXISTS project_search_vector_trigger ON "projects";
DROP TRIGGER IF EXISTS ticket_search_vector_trigger ON "support_tickets";
DROP TRIGGER IF EXISTS blog_post_search_vector_trigger ON "blog_posts";

-- Create triggers to auto-update search vectors
CREATE TRIGGER user_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "users"
  FOR EACH ROW
  EXECUTE FUNCTION update_user_search_vector();

CREATE TRIGGER project_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "projects"
  FOR EACH ROW
  EXECUTE FUNCTION update_project_search_vector();

CREATE TRIGGER ticket_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "support_tickets"
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_search_vector();

CREATE TRIGGER blog_post_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "blog_posts"
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_post_search_vector();
