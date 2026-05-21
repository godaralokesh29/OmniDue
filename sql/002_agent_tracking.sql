"""
SQL: Add agent-related columns to audits table if not present

This migration adds tracking fields for the AI agent analysis.
Run this manually if the columns don't exist.
"""

-- Add agent analysis tracking columns
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_started_at TIMESTAMP;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_completed_at TIMESTAMP;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_confidence INTEGER DEFAULT 0;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS cross_reference_count INTEGER DEFAULT 0;

-- Add agent metadata
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_config JSONB;
ALTER TABLE audits ADD COLUMN IF NOT EXISTS agent_results JSONB;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_agent_status ON audits(agent_status);
CREATE INDEX IF NOT EXISTS idx_audits_agent_completed ON audits(agent_completed_at DESC);

-- Add findings enhancement (if not exists)
ALTER TABLE findings ADD COLUMN IF NOT EXISTS cross_reference_id VARCHAR(255);
ALTER TABLE findings ADD COLUMN IF NOT EXISTS affected_sources JSONB;
ALTER TABLE findings ADD COLUMN IF NOT EXISTS root_cause TEXT;
ALTER TABLE findings ADD COLUMN IF NOT EXISTS potential_impact TEXT;

CREATE INDEX IF NOT EXISTS idx_findings_cross_reference ON findings(cross_reference_id);
