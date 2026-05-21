// AI Agent types for cross-reference analysis

export interface DataSource {
  name: 'notion' | 'github' | 'sec' | 'gdpr' | 'ccpa' | 'hipaa';
  documents: DocumentData[];
  lastFetched: Date;
}

export interface DocumentData {
  id: string;
  title: string;
  source: DataSource['name'];
  url?: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface CrossReferenceResult {
  id: string;
  inconsistencies: Inconsistency[];
  correlations: Correlation[];
  risks: IdentifiedRisk[];
  recommendations: Recommendation[];
  summary: string;
  confidence: number; // 0-100
}

export interface Inconsistency {
  type: 'missing_mapping' | 'conflict' | 'gap' | 'mismatch';
  sourceA: DocumentData;
  sourceB: DocumentData;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  evidence: string;
}

export interface Correlation {
  type: 'compliance_requirement' | 'implementation' | 'testing' | 'monitoring' | 'incident_response';
  sources: DocumentData[];
  description: string;
  status: 'aligned' | 'partially_aligned' | 'misaligned';
  details: string;
}

export interface IdentifiedRisk {
  id: string;
  category: 'legal' | 'security' | 'privacy' | 'operational' | 'financial';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedSources: DocumentData[];
  rootCause: string;
  potentialImpact: string;
}

export interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actionItems: string[];
  affectedRisks: string[];
  estimatedEffort: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  successCriteria: string[];
}

export interface AgentAnalysisContext {
  auditId: string;
  companyName: string;
  notionDocuments?: DocumentData[];
  githubDocuments?: DocumentData[];
  secDocuments?: DocumentData[];
  regulatoryChecklists?: Record<string, RegulatoryRequirement[]>;
}

export interface RegulatoryRequirement {
  regulation: string;
  requirement: string;
  description: string;
  category: string;
  evidence?: string;
  status?: 'compliant' | 'non_compliant' | 'partial';
}

export interface AgentState {
  status: 'initializing' | 'fetching_documents' | 'analyzing' | 'cross_referencing' | 'complete' | 'error';
  progress: number; // 0-100
  currentStep: string;
  results?: CrossReferenceResult;
  error?: string;
}
