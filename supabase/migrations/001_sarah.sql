-- Sarah configurations per user
CREATE TABLE IF NOT EXISTS sarah_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  competitors text[] DEFAULT '{}',
  focus_topics text[] DEFAULT '{}',
  schedule_day int DEFAULT 1,
  schedule_hour int DEFAULT 9,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Research sources (URLs to monitor)
CREATE TABLE IF NOT EXISTS research_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  name text,
  type text CHECK (type IN ('competitor', 'industry', 'news')),
  active boolean DEFAULT true,
  last_scraped timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Generated briefs
CREATE TABLE IF NOT EXISTS briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content jsonb NOT NULL,
  sources text[],
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

-- Enable RLS
ALTER TABLE sarah_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can only access their own sarah config" ON sarah_configs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own sources" ON research_sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only access their own briefs" ON briefs FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_sarah_configs_user_id ON sarah_configs(user_id);
CREATE INDEX idx_research_sources_user_id ON research_sources(user_id);
CREATE INDEX idx_briefs_user_id ON briefs(user_id);
CREATE INDEX idx_briefs_created_at ON briefs(created_at DESC);