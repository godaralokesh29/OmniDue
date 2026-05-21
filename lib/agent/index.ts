// Main exports for AI Agent functionality
export { AIAuditAgent, aiAuditAgent } from './orchestrator';
export { DataFetcher } from './data-fetcher';
export { CrossReferenceAnalyzer, ComplianceMappingAnalyzer, RiskCalculator } from './cross-reference-analyzer';

export type {
  CrossReferenceResult,
  Inconsistency,
  Correlation,
  IdentifiedRisk,
  Recommendation,
  AgentAnalysisContext,
  RegulatoryRequirement,
  AgentState,
  DocumentData,
  DataSource,
} from './types';
