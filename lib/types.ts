// Core types for M&A Due Diligence Agent

export interface Company {
  id: string;
  name: string;
  industry: string;
  founded_year: number;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

export interface Audit {
  id: string;
  company_id: string;
  audit_type: 'full' | 'compliance' | 'security' | 'license';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at: string;
  completed_at: string | null;
  risk_score: number | null;
  created_at: string;
}

export interface Document {
  id: string;
  audit_id: string;
  source_type: 'notion' | 'github' | 'sec' | 'uploaded';
  source_url: string;
  document_type: 'policy' | 'code' | 'filing' | 'contract';
  content: string;
  analyzed: boolean;
  created_at: string;
}

export interface Finding {
  id: string;
  audit_id: string;
  document_id: string | null;
  category: 'legal' | 'license' | 'security' | 'privacy' | 'regulatory';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  evidence: string;
  status: 'open' | 'resolved' | 'accepted_risk';
  created_at: string;
}

export interface LicenseScanResult {
  id: string;
  audit_id: string;
  dependency_name: string;
  version: string;
  license_type: string;
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  is_conflicting: boolean;
  conflict_reason: string | null;
  created_at: string;
}

export interface SecurityAuditResult {
  id: string;
  audit_id: string;
  check_type: 'vulnerability' | 'secret' | 'dependency' | 'code_quality';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  file_path: string | null;
  line_number: number | null;
  remediation: string;
  created_at: string;
}

export interface PrivacyMapping {
  id: string;
  audit_id: string;
  regulation: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2' | 'ISO27001';
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  evidence: string;
  gap_description: string | null;
  remediation_plan: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  audit_id: string;
  category: string;
  risk_level: number; // 0-100
  contributing_factors: string[];
  trend: 'improving' | 'stable' | 'declining';
  updated_at: string;
}

export interface ComplianceScorecard {
  id: string;
  audit_id: string;
  overall_score: number; // 0-100
  legal_score: number;
  security_score: number;
  privacy_score: number;
  license_score: number;
  regulatory_score: number;
  critical_findings_count: number;
  high_findings_count: number;
  trend_data: TrendPoint[];
  created_at: string;
}

export interface TrendPoint {
  date: string;
  score: number;
}

// API Request/Response types
export interface AnalysisRequest {
  audit_id: string;
  document_ids?: string[];
  analysis_types: ('compliance' | 'security' | 'license' | 'privacy')[];
}

export interface RiskHeatmapData {
  categories: string[];
  risks: RiskCell[][];
  overallRiskScore: number;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface RiskCell {
  value: number; // 0-100
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  findings_count: number;
  title: string;
}

export interface AnalysisResult {
  success: boolean;
  audit_id: string;
  findings: Finding[];
  licenses?: LicenseScanResult[];
  security_issues?: SecurityAuditResult[];
  privacy_mappings?: PrivacyMapping[];
  risk_score: number;
  timestamp: string;
}

export interface ReportExport {
  audit_id: string;
  format: 'pdf' | 'csv' | 'json';
  include_sections: string[];
  generated_at: string;
}
