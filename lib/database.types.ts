export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          industry: string
          founded_year: number
          employee_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry: string
          founded_year: number
          employee_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          founded_year?: number
          employee_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      audits: {
        Row: {
          id: string
          company_id: string
          audit_type: 'full' | 'compliance' | 'security' | 'license'
          status: 'pending' | 'in_progress' | 'completed' | 'failed'
          started_at: string
          completed_at: string | null
          risk_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          audit_type: 'full' | 'compliance' | 'security' | 'license'
          status?: 'pending' | 'in_progress' | 'completed' | 'failed'
          started_at?: string
          completed_at?: string | null
          risk_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          audit_type?: 'full' | 'compliance' | 'security' | 'license'
          status?: 'pending' | 'in_progress' | 'completed' | 'failed'
          started_at?: string
          completed_at?: string | null
          risk_score?: number | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          audit_id: string
          source_type: 'notion' | 'github' | 'sec' | 'uploaded'
          source_url: string
          document_type: 'policy' | 'code' | 'filing' | 'contract'
          content: string
          analyzed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          source_type: 'notion' | 'github' | 'sec' | 'uploaded'
          source_url: string
          document_type: 'policy' | 'code' | 'filing' | 'contract'
          content: string
          analyzed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          source_type?: 'notion' | 'github' | 'sec' | 'uploaded'
          source_url?: string
          document_type?: 'policy' | 'code' | 'filing' | 'contract'
          content?: string
          analyzed?: boolean
          created_at?: string
        }
      }
      findings: {
        Row: {
          id: string
          audit_id: string
          document_id: string | null
          category: 'legal' | 'license' | 'security' | 'privacy' | 'regulatory'
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description: string
          recommendation: string
          evidence: string
          status: 'open' | 'resolved' | 'accepted_risk'
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          document_id?: string | null
          category: 'legal' | 'license' | 'security' | 'privacy' | 'regulatory'
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description: string
          recommendation: string
          evidence: string
          status?: 'open' | 'resolved' | 'accepted_risk'
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          document_id?: string | null
          category?: 'legal' | 'license' | 'security' | 'privacy' | 'regulatory'
          severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title?: string
          description?: string
          recommendation?: string
          evidence?: string
          status?: 'open' | 'resolved' | 'accepted_risk'
          created_at?: string
        }
      }
      license_scan_results: {
        Row: {
          id: string
          audit_id: string
          dependency_name: string
          version: string
          license_type: string
          risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical'
          is_conflicting: boolean
          conflict_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          dependency_name: string
          version: string
          license_type: string
          risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical'
          is_conflicting?: boolean
          conflict_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          dependency_name?: string
          version?: string
          license_type?: string
          risk_level?: 'none' | 'low' | 'medium' | 'high' | 'critical'
          is_conflicting?: boolean
          conflict_reason?: string | null
          created_at?: string
        }
      }
      security_audit_results: {
        Row: {
          id: string
          audit_id: string
          check_type: 'vulnerability' | 'secret' | 'dependency' | 'code_quality'
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description: string
          file_path: string | null
          line_number: number | null
          remediation: string
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          check_type: 'vulnerability' | 'secret' | 'dependency' | 'code_quality'
          severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title: string
          description: string
          file_path?: string | null
          line_number?: number | null
          remediation: string
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          check_type?: 'vulnerability' | 'secret' | 'dependency' | 'code_quality'
          severity?: 'critical' | 'high' | 'medium' | 'low' | 'info'
          title?: string
          description?: string
          file_path?: string | null
          line_number?: number | null
          remediation?: string
          created_at?: string
        }
      }
      privacy_mappings: {
        Row: {
          id: string
          audit_id: string
          regulation: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2' | 'ISO27001'
          requirement: string
          status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable'
          evidence: string
          gap_description: string | null
          remediation_plan: string | null
          priority: 'critical' | 'high' | 'medium' | 'low'
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          regulation: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2' | 'ISO27001'
          requirement: string
          status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable'
          evidence: string
          gap_description?: string | null
          remediation_plan?: string | null
          priority: 'critical' | 'high' | 'medium' | 'low'
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          regulation?: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2' | 'ISO27001'
          requirement?: string
          status?: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable'
          evidence?: string
          gap_description?: string | null
          remediation_plan?: string | null
          priority?: 'critical' | 'high' | 'medium' | 'low'
          created_at?: string
        }
      }
      risk_assessments: {
        Row: {
          id: string
          audit_id: string
          category: string
          risk_level: number
          contributing_factors: string[]
          trend: 'improving' | 'stable' | 'declining'
          updated_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          category: string
          risk_level: number
          contributing_factors: string[]
          trend: 'improving' | 'stable' | 'declining'
          updated_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          category?: string
          risk_level?: number
          contributing_factors?: string[]
          trend?: 'improving' | 'stable' | 'declining'
          updated_at?: string
        }
      }
      compliance_scorecards: {
        Row: {
          id: string
          audit_id: string
          overall_score: number
          legal_score: number
          security_score: number
          privacy_score: number
          license_score: number
          regulatory_score: number
          critical_findings_count: number
          high_findings_count: number
          trend_data: Array<{ date: string; score: number }>
          created_at: string
        }
        Insert: {
          id?: string
          audit_id: string
          overall_score: number
          legal_score: number
          security_score: number
          privacy_score: number
          license_score: number
          regulatory_score: number
          critical_findings_count: number
          high_findings_count: number
          trend_data: Array<{ date: string; score: number }>
          created_at?: string
        }
        Update: {
          id?: string
          audit_id?: string
          overall_score?: number
          legal_score?: number
          security_score?: number
          privacy_score?: number
          license_score?: number
          regulatory_score?: number
          critical_findings_count?: number
          high_findings_count?: number
          trend_data?: Array<{ date: string; score: number }>
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
