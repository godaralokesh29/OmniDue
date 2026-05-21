import { DataFetcher } from './data-fetcher';
import { CrossReferenceAnalyzer, ComplianceMappingAnalyzer, RiskCalculator } from './cross-reference-analyzer';
import type { CrossReferenceResult, AgentState, DocumentData, RegulatoryRequirement } from './types';
import { supabaseAdmin } from '../supabase';

export interface AgentConfig {
  auditId: string;
  companyName: string;
  notionDatabaseId?: string;
  githubOwner?: string;
  githubRepo?: string;
}

export class AIAuditAgent {
  private dataFetcher: DataFetcher;
  private analyzer: CrossReferenceAnalyzer;
  private mappingAnalyzer: ComplianceMappingAnalyzer;
  private riskCalculator: RiskCalculator;
  private state: AgentState;

  constructor() {
    this.dataFetcher = new DataFetcher();
    this.analyzer = new CrossReferenceAnalyzer();
    this.mappingAnalyzer = new ComplianceMappingAnalyzer();
    this.riskCalculator = new RiskCalculator();
    this.state = {
      status: 'initializing',
      progress: 0,
      currentStep: 'Initializing agent...',
    };
  }

  getState(): AgentState {
    return this.state;
  }

  private updateState(update: Partial<AgentState>) {
    this.state = { ...this.state, ...update };
  }

  async runFullAudit(config: AgentConfig): Promise<CrossReferenceResult> {
    try {
      this.updateState({
        status: 'fetching_documents',
        progress: 10,
        currentStep: 'Fetching documents from all sources...',
      });

      // Fetch documents from all sources
      const documents = await this.dataFetcher.fetchAllDataSources(
        config.companyName,
        config.notionDatabaseId,
        config.githubOwner,
        config.githubRepo
      );

      this.updateState({
        progress: 30,
        currentStep: 'Fetching regulatory requirements...',
      });

      // Fetch regulatory checklists
      const regulatoryChecklists = await this.dataFetcher.fetchRegulatoryChecklists();

      this.updateState({
        progress: 50,
        currentStep: 'Analyzing documents for cross-references...',
        status: 'analyzing',
      });

      // Perform cross-reference analysis
      const crossReferenceResult = await this.analyzer.analyzeDocuments(
        documents,
        regulatoryChecklists,
        config.companyName,
        config.auditId
      );

      this.updateState({
        progress: 75,
        currentStep: 'Mapping compliance requirements...',
      });

      // Map compliance requirements to evidence
      const complianceMappings = await this.mappingAnalyzer.mapComplianceRequirements(
        documents,
        regulatoryChecklists
      );

      this.updateState({
        progress: 90,
        currentStep: 'Calculating risk scores...',
      });

      // Enhance risk score with mapped evidence
      const enhancedResult = {
        ...crossReferenceResult,
        summary: this.buildExecutiveSummary(crossReferenceResult, complianceMappings),
      };

      // Save results to database
      await this.saveAnalysisResults(config.auditId, enhancedResult);

      this.updateState({
        status: 'complete',
        progress: 100,
        currentStep: 'Analysis complete',
        results: enhancedResult,
      });

      return enhancedResult;
    } catch (error) {
      this.updateState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private buildExecutiveSummary(result: CrossReferenceResult, mappings: Map<string, string[]>): string {
    const criticalRisks = result.risks.filter((r) => r.severity === 'critical').length;
    const criticalInconsistencies = result.inconsistencies.filter((i) => i.severity === 'critical').length;

    return `
## Executive Summary

### Cross-Reference Analysis Results
- **Total Inconsistencies**: ${result.inconsistencies.length}
- **Critical Issues**: ${criticalRisks + criticalInconsistencies}
- **Aligned Correlations**: ${result.correlations.filter((c) => c.status === 'aligned').length}
- **Misaligned Correlations**: ${result.correlations.filter((c) => c.status === 'misaligned').length}
- **Overall Risk Score**: ${this.riskCalculator.calculateCombinedRiskScore(result.inconsistencies, result.risks)}/100

### Key Findings
${result.risks
  .slice(0, 5)
  .map((r) => `- **${r.severity.toUpperCase()}**: ${r.title} - ${r.description}`)
  .join('\n')}

### Regulatory Compliance Status
${Array.from(mappings.entries())
  .map(([regulation, evidence]) => `- **${regulation}**: ${evidence.length} requirements mapped to evidence`)
  .join('\n')}

### Top Recommendations
${result.recommendations
  .filter((r) => r.priority === 'critical' || r.priority === 'high')
  .slice(0, 5)
  .map((r) => `1. **${r.title}** (${r.priority})\n   ${r.description}`)
  .join('\n')}

### Next Steps
1. Review and prioritize identified risks
2. Implement recommended remediation actions
3. Schedule follow-up audit in 30/60/90 days
4. Establish compliance monitoring dashboard
    `;
  }

  private async saveAnalysisResults(auditId: string, result: CrossReferenceResult): Promise<void> {
    try {
      // Save cross-reference findings
      for (const inconsistency of result.inconsistencies) {
        await supabaseAdmin.from('findings').insert({
          audit_id: auditId,
          category: 'legal',
          severity: inconsistency.severity,
          title: `Inconsistency: ${inconsistency.type}`,
          description: inconsistency.description,
          recommendation: inconsistency.evidence,
          evidence: inconsistency.evidence,
          status: 'open',
        });
      }

      // Save identified risks
      for (const risk of result.risks) {
        await supabaseAdmin.from('findings').insert({
          audit_id: auditId,
          category: risk.category,
          severity: risk.severity,
          title: risk.title,
          description: risk.description,
          recommendation: risk.potentialImpact,
          evidence: risk.rootCause,
          status: 'open',
        });
      }

      // Update audit with overall results
      const overallRiskScore = this.riskCalculator.calculateCombinedRiskScore(
        result.inconsistencies,
        result.risks
      );

      await supabaseAdmin
        .from('audits')
        .update({
          status: 'completed',
          risk_score: overallRiskScore,
          completed_at: new Date().toISOString(),
        })
        .eq('id', auditId);
    } catch (error) {
      console.error('Error saving analysis results:', error);
      throw error;
    }
  }

  async streamAnalysisProgress(
    config: AgentConfig,
    onProgress: (state: AgentState) => void
  ): Promise<CrossReferenceResult> {
    const progressInterval = setInterval(() => {
      onProgress(this.state);
    }, 500);

    try {
      const result = await this.runFullAudit(config);
      clearInterval(progressInterval);
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }
}

// Export singleton instance
export const aiAuditAgent = new AIAuditAgent();
