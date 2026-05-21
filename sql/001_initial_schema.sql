-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  founded_year INTEGER,
  employee_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  audit_type VARCHAR(50) NOT NULL CHECK (audit_type IN ('full', 'compliance', 'security', 'license')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  risk_score NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('notion', 'github', 'sec', 'uploaded')),
  source_url TEXT,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('policy', 'code', 'filing', 'contract')),
  content TEXT NOT NULL,
  analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create findings table
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('legal', 'license', 'security', 'privacy', 'regulatory')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  evidence TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'accepted_risk')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create license_scan_results table
CREATE TABLE license_scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  dependency_name VARCHAR(255) NOT NULL,
  version VARCHAR(100),
  license_type VARCHAR(100) NOT NULL,
  risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('none', 'low', 'medium', 'high', 'critical')),
  is_conflicting BOOLEAN DEFAULT FALSE,
  conflict_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_audit_results table
CREATE TABLE security_audit_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  check_type VARCHAR(50) NOT NULL CHECK (check_type IN ('vulnerability', 'secret', 'dependency', 'code_quality')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  file_path VARCHAR(500),
  line_number INTEGER,
  remediation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create privacy_mappings table
CREATE TABLE privacy_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  regulation VARCHAR(50) NOT NULL CHECK (regulation IN ('GDPR', 'CCPA', 'HIPAA', 'SOC2', 'ISO27001')),
  requirement TEXT NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'partial', 'not_applicable')),
  evidence TEXT,
  gap_description TEXT,
  remediation_plan TEXT,
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create risk_assessments table
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  risk_level NUMERIC(5,2) NOT NULL,
  contributing_factors TEXT[] DEFAULT ARRAY[]::TEXT[],
  trend VARCHAR(50) NOT NULL CHECK (trend IN ('improving', 'stable', 'declining')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_scorecards table
CREATE TABLE compliance_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  overall_score NUMERIC(5,2) NOT NULL,
  legal_score NUMERIC(5,2) NOT NULL,
  security_score NUMERIC(5,2) NOT NULL,
  privacy_score NUMERIC(5,2) NOT NULL,
  license_score NUMERIC(5,2) NOT NULL,
  regulatory_score NUMERIC(5,2) NOT NULL,
  critical_findings_count INTEGER DEFAULT 0,
  high_findings_count INTEGER DEFAULT 0,
  trend_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_audits_company_id ON audits(company_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_documents_audit_id ON documents(audit_id);
CREATE INDEX idx_documents_analyzed ON documents(analyzed);
CREATE INDEX idx_findings_audit_id ON findings(audit_id);
CREATE INDEX idx_findings_category ON findings(category);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_license_scan_audit_id ON license_scan_results(audit_id);
CREATE INDEX idx_license_conflicting ON license_scan_results(is_conflicting);
CREATE INDEX idx_security_audit_audit_id ON security_audit_results(audit_id);
CREATE INDEX idx_security_audit_severity ON security_audit_results(severity);
CREATE INDEX idx_privacy_audit_id ON privacy_mappings(audit_id);
CREATE INDEX idx_privacy_regulation ON privacy_mappings(regulation);
CREATE INDEX idx_risk_audit_id ON risk_assessments(audit_id);
CREATE INDEX idx_scorecard_audit_id ON compliance_scorecards(audit_id);
