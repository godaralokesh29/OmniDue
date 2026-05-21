import { generateObject } from 'ai';
import { z } from 'zod';

// Using Vercel AI Gateway with a model that supports analysis
const MODEL = 'openai/gpt-4';

const ComplianceAnalysisSchema = z.object({
  findings: z.array(
    z.object({
      title: z.string().describe('Title of the finding'),
      description: z.string().describe('Detailed description of the issue'),
      category: z.enum(['legal', 'license', 'security', 'privacy', 'regulatory']).describe('Category of finding'),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).describe('Severity level'),
      recommendation: z.string().describe('Recommended remediation'),
      evidence: z.string().describe('Evidence from the document supporting this finding'),
      riskScore: z.number().min(0).max(100).describe('Risk score 0-100'),
    })
  ),
  overallRiskScore: z.number().min(0).max(100).describe('Overall risk score for the document'),
  summary: z.string().describe('Executive summary of findings'),
});

const LicenseAnalysisSchema = z.object({
  licenses: z.array(
    z.object({
      dependency: z.string().describe('Dependency name'),
      version: z.string().describe('Version'),
      license: z.string().describe('License type'),
      riskLevel: z.enum(['none', 'low', 'medium', 'high', 'critical']).describe('Risk level'),
      conflicting: z.boolean().describe('Is this license conflicting with project license?'),
      conflictReason: z.string().optional().describe('Reason for conflict if any'),
      recommendation: z.string().describe('Recommendation for this dependency'),
    })
  ),
  criticalConflicts: z.number().describe('Number of critical license conflicts'),
  summary: z.string().describe('Summary of license compliance status'),
});

const SecurityAnalysisSchema = z.object({
  vulnerabilities: z.array(
    z.object({
      title: z.string().describe('Vulnerability title'),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
      description: z.string(),
      filePath: z.string().optional(),
      lineNumber: z.number().optional(),
      remediation: z.string(),
      cveId: z.string().optional(),
    })
  ),
  secretsDetected: z.array(
    z.object({
      secretType: z.string().describe('Type of secret (API key, password, token, etc)'),
      location: z.string().describe('File path and line number'),
      recommendation: z.string(),
    })
  ),
  securityScore: z.number().min(0).max(100),
  summary: z.string(),
});

const PrivacyAnalysisSchema = z.object({
  gdpr: z.array(
    z.object({
      requirement: z.string(),
      status: z.enum(['compliant', 'non_compliant', 'partial', 'not_applicable']),
      evidence: z.string(),
      gaps: z.array(z.string()),
    })
  ),
  ccpa: z.array(
    z.object({
      requirement: z.string(),
      status: z.enum(['compliant', 'non_compliant', 'partial', 'not_applicable']),
      evidence: z.string(),
      gaps: z.array(z.string()),
    })
  ),
  dataFlowIssues: z.array(
    z.object({
      description: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low']),
      recommendation: z.string(),
    })
  ),
  privacyScore: z.number().min(0).max(100),
  summary: z.string(),
});

export async function analyzeDocumentForCompliance(documentContent: string, documentType: string) {
  try {
    const prompt = `You are a compliance and legal expert. Analyze the following ${documentType} document and identify any legal, regulatory, or compliance issues.

Document:
${documentContent}

Provide a detailed compliance analysis including findings, their severity, and recommendations.`;

    const result = await generateObject({
      model: MODEL,
      schema: ComplianceAnalysisSchema,
      prompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('[v0] Error in compliance analysis:', error);
    throw error;
  }
}

export async function analyzeCodeForLicenses(codeContent: string, packageJson?: string) {
  try {
    const prompt = `You are a software licensing expert. Analyze the following code and dependencies for license compliance issues.

Code/Files:
${codeContent}

${packageJson ? `Package.json:\n${packageJson}` : ''}

Identify:
1. All licenses used in dependencies
2. Any GPL or copyleft conflicts
3. License compatibility issues
4. Risk levels for each dependency
5. Recommendations for remediation`;

    const result = await generateObject({
      model: MODEL,
      schema: LicenseAnalysisSchema,
      prompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('[v0] Error in license analysis:', error);
    throw error;
  }
}

export async function analyzeCodeForSecurity(codeContent: string, fileInfo?: string) {
  try {
    const prompt = `You are a security expert and code reviewer. Analyze the following code for security vulnerabilities, secrets exposure, and code quality issues.

Code:
${codeContent}

${fileInfo ? `File Information:\n${fileInfo}` : ''}

Identify:
1. Security vulnerabilities (SQL injection, XSS, etc)
2. Exposed secrets (API keys, passwords, tokens)
3. Unsafe dependencies
4. Code quality issues with security implications
5. Remediation steps for each issue`;

    const result = await generateObject({
      model: MODEL,
      schema: SecurityAnalysisSchema,
      prompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('[v0] Error in security analysis:', error);
    throw error;
  }
}

export async function analyzeForPrivacyCompliance(documentContent: string) {
  try {
    const prompt = `You are a data privacy expert. Analyze the following document/code for GDPR, CCPA, HIPAA, and other privacy regulation compliance.

Content:
${documentContent}

Provide:
1. GDPR compliance assessment
2. CCPA compliance assessment
3. Data flow analysis
4. Privacy gaps
5. Recommendations for remediation`;

    const result = await generateObject({
      model: MODEL,
      schema: PrivacyAnalysisSchema,
      prompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('[v0] Error in privacy analysis:', error);
    throw error;
  }
}

export async function generateRemediationPlan(
  findings: Array<{ title: string; description: string; category: string }>,
  companyContext?: string
) {
  try {
    const prompt = `Based on the following compliance findings from an M&A due diligence audit, create a prioritized remediation plan.

Findings:
${findings.map((f) => `- ${f.title} (${f.category}): ${f.description}`).join('\n')}

${companyContext ? `Company Context:\n${companyContext}` : ''}

Provide:
1. Prioritized list of issues to address
2. Timeline recommendations
3. Resource requirements
4. Quick wins vs long-term improvements
5. Cost-benefit analysis for each remediation`;

    const result = await generateObject({
      model: MODEL,
      schema: z.object({
        prioritizedPlan: z.array(
          z.object({
            priority: z.number().describe('Priority rank'),
            finding: z.string(),
            timeline: z.string(),
            resources: z.array(z.string()),
            estimatedCost: z.string(),
            estimatedEffort: z.string(),
            benefits: z.array(z.string()),
          })
        ),
        summary: z.string(),
      }),
      prompt,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error('[v0] Error in remediation planning:', error);
    throw error;
  }
}
