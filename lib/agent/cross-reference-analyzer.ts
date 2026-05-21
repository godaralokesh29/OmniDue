import { generateObject } from 'ai';
import { z } from 'zod';
import type {
  CrossReferenceResult,
  DocumentData,
  Inconsistency,
  Correlation,
  IdentifiedRisk,
  Recommendation,
  RegulatoryRequirement,
} from './types';

const MODEL = 'openai/gpt-4';

const InconsistencySchema = z.object({
  type: z.enum(['missing_mapping', 'conflict', 'gap', 'mismatch']),
  description: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  evidence: z.string(),
});

const CorrelationSchema = z.object({
  type: z.enum(['compliance_requirement', 'implementation', 'testing', 'monitoring', 'incident_response']),
  description: z.string(),
  status: z.enum(['aligned', 'partially_aligned', 'misaligned']),
  details: z.string(),
});

const RiskSchema = z.object({
  category: z.enum(['legal', 'security', 'privacy', 'operational', 'financial']),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  title: z.string(),
  description: z.string(),
  rootCause: z.string(),
  potentialImpact: z.string(),
});

const RecommendationSchema = z.object({
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  actionItems: z.array(z.string()),
  estimatedEffort: z.enum(['immediate', 'short-term', 'medium-term', 'long-term']),
  successCriteria: z.array(z.string()),
});

const CrossReferenceSchema = z.object({
  inconsistencies: z.array(InconsistencySchema),
  correlations: z.array(CorrelationSchema),
  risks: z.array(RiskSchema),
  recommendations: z.array(RecommendationSchema),
  summary: z.string(),
  confidence: z.number().min(0).max(100),
});

export class CrossReferenceAnalyzer {
  async analyzeDocuments(
    documents: Record<string, DocumentData[]>,
    regulatoryChecklists: Record<string, RegulatoryRequirement[]>,
    companyName: string,
    auditId: string
  ): Promise<CrossReferenceResult> {
    // Prepare context from all sources
    const context = this.buildAnalysisContext(documents, regulatoryChecklists, companyName);

    // Generate AI-powered analysis
    const analysis = await generateObject({
      model: MODEL,
      schema: CrossReferenceSchema,
      prompt: this.buildPrompt(context, companyName),
    });

    // Enrich with additional metadata
    const enrichedResult: CrossReferenceResult = {
      id: auditId,
      inconsistencies: analysis.object.inconsistencies.map((inc, idx) => ({
        ...inc,
        sourceA: this.findMostRelevantDocument(documents, 'internal'),
        sourceB: this.findMostRelevantDocument(documents, 'external'),
      })),
      correlations: analysis.object.correlations.map((cor) => ({
        ...cor,
        sources: this.findCorrelatedDocuments(documents, cor.description),
      })),
      risks: analysis.object.risks.map((risk, idx) => ({
        id: `RISK-${auditId}-${idx}`,
        ...risk,
        affectedSources: this.findAffectedDocuments(documents, risk.title),
      })),
      recommendations: analysis.object.recommendations.map((rec, idx) => ({
        id: `REC-${auditId}-${idx}`,
        ...rec,
        affectedRisks: [],
      })),
      summary: analysis.object.summary,
      confidence: analysis.object.confidence,
    };

    return enrichedResult;
  }

  private buildAnalysisContext(
    documents: Record<string, DocumentData[]>,
    regulatoryChecklists: Record<string, RegulatoryRequirement[]>,
    companyName: string
  ): string {
    let context = `# Cross-Reference Analysis for ${companyName}\n\n`;

    // Add document summaries
    for (const [source, docs] of Object.entries(documents)) {
      context += `## ${source.toUpperCase()} Documents (${docs.length} files)\n`;
      docs.forEach((doc) => {
        context += `- **${doc.title}**: ${doc.content.substring(0, 500)}...\n\n`;
      });
    }

    // Add regulatory requirements
    context += `## Regulatory Requirements\n`;
    for (const [regulation, requirements] of Object.entries(regulatoryChecklists)) {
      context += `### ${regulation}\n`;
      requirements.forEach((req) => {
        context += `- ${req.requirement}: ${req.description}\n`;
      });
    }

    return context;
  }

  private buildPrompt(context: string, companyName: string): string {
    return `You are an expert compliance and due diligence analyst. Analyze the following documents and regulatory requirements for ${companyName}.

Your task is to:
1. Identify inconsistencies between internal documentation (Notion/GitHub) and external regulatory requirements
2. Find correlations between compliance claims and actual implementation
3. Identify risks based on gaps and misalignments
4. Provide specific, actionable recommendations

Focus on:
- Security practices vs documented policies
- Privacy policies vs actual data handling
- Compliance claims vs regulatory requirements
- Code quality vs security requirements
- License compliance across dependencies

${context}

Provide a detailed analysis with:
- Specific inconsistencies (missing mappings, conflicts, gaps)
- Correlations showing alignment or misalignment
- Identified risks with root causes
- Prioritized recommendations with action items
- Overall confidence in the analysis`;
  }

  private findMostRelevantDocument(documents: Record<string, DocumentData[]>, type: 'internal' | 'external'): DocumentData {
    const sources = type === 'internal' ? ['notion', 'github'] : ['sec'];
    for (const source of sources) {
      const docs = documents[source];
      if (docs && docs.length > 0) {
        return docs[0];
      }
    }
    return {
      id: 'unknown',
      title: 'Unknown Document',
      source: 'notion',
      content: '',
    };
  }

  private findCorrelatedDocuments(documents: Record<string, DocumentData[]>, description: string): DocumentData[] {
    const allDocs = Object.values(documents).flat();
    return allDocs.filter((doc) => doc.content.toLowerCase().includes(description.toLowerCase())).slice(0, 3);
  }

  private findAffectedDocuments(documents: Record<string, DocumentData[]>, riskTitle: string): DocumentData[] {
    const allDocs = Object.values(documents).flat();
    return allDocs.filter((doc) => doc.content.toLowerCase().includes(riskTitle.toLowerCase())).slice(0, 2);
  }
}

export class ComplianceMappingAnalyzer {
  async mapComplianceRequirements(
    documents: Record<string, DocumentData[]>,
    regulatoryChecklists: Record<string, RegulatoryRequirement[]>
  ): Promise<Map<string, string[]>> {
    const mappings = new Map<string, string[]>();

    for (const [regulation, requirements] of Object.entries(regulatoryChecklists)) {
      const evidences: string[] = [];

      for (const req of requirements) {
        const evidence = await this.findEvidenceInDocuments(documents, req.requirement);
        if (evidence) {
          evidences.push(`${req.requirement}: ${evidence}`);
        }
      }

      mappings.set(regulation, evidences);
    }

    return mappings;
  }

  private async findEvidenceInDocuments(documents: Record<string, DocumentData[]>, requirement: string): Promise<string | null> {
    const allDocs = Object.values(documents).flat();

    for (const doc of allDocs) {
      if (doc.content.toLowerCase().includes(requirement.toLowerCase())) {
        const index = doc.content.toLowerCase().indexOf(requirement.toLowerCase());
        return doc.title + ': ' + doc.content.substring(Math.max(0, index - 50), Math.min(doc.content.length, index + 150));
      }
    }

    return null;
  }
}

export class RiskCalculator {
  calculateCombinedRiskScore(
    inconsistencies: Inconsistency[],
    risks: IdentifiedRisk[]
  ): number {
    let score = 0;
    const severityWeights: Record<string, number> = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    };

    // Weight inconsistencies
    for (const inc of inconsistencies) {
      score += severityWeights[inc.severity] * 0.3;
    }

    // Weight risks
    for (const risk of risks) {
      score += severityWeights[risk.severity] * 0.7;
    }

    // Normalize to 0-100
    const normalizedScore = Math.min(100, score / (inconsistencies.length + risks.length) || 0);
    return Math.round(normalizedScore);
  }
}
