import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/client-side operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (use sparingly)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Helper functions for common database operations
export async function createAudit(auditData: {
  company_id: string;
  audit_type: 'full' | 'compliance' | 'security' | 'license';
}) {
  const { data, error } = await supabaseAdmin
    .from('audits')
    .insert([{ ...auditData, status: 'pending', risk_score: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadDocument(documentData: {
  audit_id: string;
  source_type: 'notion' | 'github' | 'sec' | 'uploaded';
  source_url: string;
  document_type: 'policy' | 'code' | 'filing' | 'contract';
  content: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert([{ ...documentData, analyzed: false }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createFinding(findingData: {
  audit_id: string;
  document_id?: string;
  category: 'legal' | 'license' | 'security' | 'privacy' | 'regulatory';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  recommendation: string;
  evidence: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('findings')
    .insert([{ ...findingData, status: 'open' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAuditWithFindings(auditId: string) {
  const { data: audit, error: auditError } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .single();

  if (auditError) throw auditError;

  const { data: findings, error: findingsError } = await supabaseAdmin
    .from('findings')
    .select('*')
    .eq('audit_id', auditId);

  if (findingsError) throw findingsError;

  return { audit, findings };
}

export async function updateAuditStatus(
  auditId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'failed',
  riskScore?: number
) {
  const updateData: any = { status };
  if (riskScore !== undefined) updateData.risk_score = riskScore;
  if (status === 'completed') updateData.completed_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('audits')
    .update(updateData)
    .eq('id', auditId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLicenseScanResults(auditId: string) {
  const { data, error } = await supabaseAdmin
    .from('license_scan_results')
    .select('*')
    .eq('audit_id', auditId);

  if (error) throw error;
  return data;
}

export async function getSecurityAuditResults(auditId: string) {
  const { data, error } = await supabaseAdmin
    .from('security_audit_results')
    .select('*')
    .eq('audit_id', auditId);

  if (error) throw error;
  return data;
}

export async function getPrivacyMappings(auditId: string) {
  const { data, error } = await supabaseAdmin
    .from('privacy_mappings')
    .select('*')
    .eq('audit_id', auditId);

  if (error) throw error;
  return data;
}

export async function createComplianceScorecard(scorecardData: {
  audit_id: string;
  overall_score: number;
  legal_score: number;
  security_score: number;
  privacy_score: number;
  license_score: number;
  regulatory_score: number;
  critical_findings_count: number;
  high_findings_count: number;
  trend_data: Array<{ date: string; score: number }>;
}) {
  const { data, error } = await supabaseAdmin
    .from('compliance_scorecards')
    .insert([scorecardData])
    .select()
    .single();

  if (error) throw error;
  return data;
}
