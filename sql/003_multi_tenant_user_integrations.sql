/*
Multi-tenant User Integrations Migration
Creates schema for storing user API credentials for different data sources
*/

CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company/Audit Info
  company_name TEXT NOT NULL,
  display_name TEXT,
  
  -- Notion Integration
  notion_api_key TEXT,
  notion_database_id TEXT,
  notion_connected BOOLEAN DEFAULT FALSE,
  notion_last_tested TIMESTAMP,
  
  -- GitHub Integration
  github_token TEXT,
  github_owner TEXT,
  github_repo TEXT,
  github_connected BOOLEAN DEFAULT FALSE,
  github_last_tested TIMESTAMP,
  
  -- OpenAI Integration
  openai_api_key TEXT,
  openai_connected BOOLEAN DEFAULT FALSE,
  openai_last_tested TIMESTAMP,
  
  -- Status & Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_active ON user_integrations(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_integrations_created ON user_integrations(created_at DESC);

-- RLS Policy: Users can only see their own integrations
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integrations"
  ON user_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integrations"
  ON user_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations"
  ON user_integrations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations"
  ON user_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Audit table for tracking changes
CREATE TABLE IF NOT EXISTS user_integrations_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_integration_id UUID REFERENCES user_integrations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'tested'
  field_changed TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_integration_id ON user_integrations_audit(user_integration_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON user_integrations_audit(created_at DESC);
