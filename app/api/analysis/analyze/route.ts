import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeDocumentForCompliance,
  analyzeCodeForLicenses,
  analyzeCodeForSecurity,
  analyzeForPrivacyCompliance,
} from '@/lib/analyzers/coral-ai';
import {
  createFinding,
  getAuditWithFindings,
  updateAuditStatus,
} from '@/lib/supabase';
import { calculateRiskScore, generateRiskHeatmap } from '@/lib/analyzers/risk-heatmap';
import type { AnalysisRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { audit_id, document_ids, analysis_types } = body;

    console.log('[v0] Starting analysis for audit:', audit_id, 'types:', analysis_types);

    // Update audit status to in_progress
    await updateAuditStatus(audit_id, 'in_progress');

    const results = {
      audit_id,
      findings: [] as any[],
      risk_heatmap: null as any,
      risk_score: 0,
      timestamp: new Date().toISOString(),
    };

    // Fetch audit with documents
    const { audit, findings: existingFindings } = await getAuditWithFindings(audit_id);

    // Run analyses based on types requested
    for (const analysisType of analysis_types) {
      console.log('[v0] Running analysis type:', analysisType);

      if (analysisType === 'compliance') {
        // For demo purposes, analyze the first document
        // In production, iterate through document_ids
        const mockDocumentContent = `
          Company Policy Document
          
          Data Handling Procedures:
          - Customer data is stored in unencrypted database
          - No GDPR data retention policy documented
          - Third-party API calls contain API keys in logs
          - No customer consent management system
          
          Employee Access:
          - No role-based access control (RBAC)
          - Admin credentials shared via email
          - No audit logging of data access
          
          Compliance Status:
          - GDPR: Not documented
          - CCPA: Partial implementation
          - HIPAA: Not applicable
          - SOC2: Audit pending
        `;

        const complianceResult = await analyzeDocumentForCompliance(mockDocumentContent, 'policy');

        for (const finding of complianceResult.findings) {
          const created = await createFinding({
            audit_id,
            category: finding.category,
            severity: finding.severity,
            title: finding.title,
            description: finding.description,
            recommendation: finding.recommendation,
            evidence: finding.evidence,
          });
          results.findings.push(created);
        }
      }

      if (analysisType === 'security') {
        const mockCodeContent = `
          // Example vulnerable code
          app.get('/api/user/:id', async (req, res) => {
            // SQL Injection vulnerability
            const query = \`SELECT * FROM users WHERE id = \${req.params.id}\`;
            const result = await db.query(query);
            
            // Secret exposure
            const apiKey = 'sk-1234567890abcdefghij';
            const password = 'admin123';
            
            // Unencrypted data transmission
            res.send({ user: result, apiKey });
          });

          // Outdated dependencies
          // Package with known vulnerabilities: lodash@4.2.0
        `;

        const securityResult = await analyzeCodeForSecurity(mockCodeContent, 'app.js');

        for (const vuln of securityResult.vulnerabilities) {
          const created = await createFinding({
            audit_id,
            category: 'security',
            severity: vuln.severity,
            title: vuln.title,
            description: vuln.description,
            recommendation: vuln.remediation,
            evidence: vuln.filePath || 'Code review',
          });
          results.findings.push(created);
        }

        for (const secret of securityResult.secretsDetected) {
          const created = await createFinding({
            audit_id,
            category: 'security',
            severity: 'critical',
            title: `Exposed ${secret.secretType}`,
            description: `A ${secret.secretType} was found in version control: ${secret.location}`,
            recommendation: secret.recommendation,
            evidence: secret.location,
          });
          results.findings.push(created);
        }
      }

      if (analysisType === 'license') {
        const mockPackageJson = `
          {
            "dependencies": {
              "react": "^19.0.0",
              "express": "^4.18.0",
              "lodash": "^4.17.0",
              "gpl-package": "^1.0.0",
              "proprietary-lib": "^2.0.0"
            }
          }
        `;

        const licenseResult = await analyzeCodeForLicenses(mockPackageJson);

        for (const lic of licenseResult.licenses) {
          const created = await createFinding({
            audit_id,
            category: 'license',
            severity: lic.riskLevel === 'none' ? 'info' : lic.riskLevel,
            title: `${lic.dependency} - ${lic.license} License`,
            description: lic.conflicting
              ? `License conflict detected: ${lic.conflictReason}`
              : `Using ${lic.license} licensed dependency`,
            recommendation: lic.recommendation,
            evidence: `${lic.dependency}@${lic.version}`,
          });
          results.findings.push(created);
        }
      }

      if (analysisType === 'privacy') {
        const mockPrivacyContent = `
          Privacy and Data Protection Policy
          
          Current Implementation:
          - Data stored in US-only servers
          - No data encryption at rest
          - User consent not properly documented
          - Third-party data sharing not disclosed
          
          GDPR Compliance:
          - DPIA: Not completed
          - DPA: Not signed with processors
          - Right to erasure: Not fully implemented
          
          CCPA Compliance:
          - Consumer rights: Partially implemented
          - Data sale notices: Missing
          - Opt-out mechanism: Available but unclear
        `;

        const privacyResult = await analyzeForPrivacyCompliance(mockPrivacyContent);

        const privacyFindings: any[] = [];

        // Aggregate GDPR findings
        for (const req of privacyResult.gdpr) {
          if (req.status !== 'compliant' && req.status !== 'not_applicable') {
            privacyFindings.push({
              category: 'privacy',
              severity: req.gaps.length > 2 ? 'high' : 'medium',
              title: `GDPR - ${req.requirement}`,
              description: req.gaps.join('; '),
              recommendation: `Implement proper ${req.requirement.toLowerCase()} procedures`,
              evidence: req.evidence,
            });
          }
        }

        for (const issue of privacyResult.dataFlowIssues) {
          privacyFindings.push({
            category: 'privacy',
            severity: issue.severity,
            title: issue.description,
            description: `Data flow issue identified`,
            recommendation: issue.recommendation,
            evidence: 'Privacy analysis',
          });
        }

        for (const finding of privacyFindings) {
          const created = await createFinding({
            audit_id,
            ...finding,
          });
          results.findings.push(created);
        }
      }
    }

    // Calculate risk score and heatmap
    const riskScore = calculateRiskScore(results.findings);
    const heatmap = generateRiskHeatmap(results.findings);

    // Update audit with final risk score
    await updateAuditStatus(audit_id, 'completed', riskScore);

    results.risk_score = riskScore;
    results.risk_heatmap = heatmap;

    console.log('[v0] Analysis complete. Found', results.findings.length, 'findings');

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('[v0] Analysis error:', error);
    const auditId = (await request.json()).audit_id;
    try {
      await updateAuditStatus(auditId, 'failed');
    } catch (e) {
      console.error('[v0] Failed to update audit status:', e);
    }

    return NextResponse.json(
      {
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
