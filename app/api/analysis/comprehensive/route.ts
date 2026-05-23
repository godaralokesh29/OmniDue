import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { 
  analyzeDocumentForCompliance, 
  analyzeCodeForLicenses,
  analyzeCodeForSecurity,
  analyzeForPrivacyCompliance,
  generateRemediationPlan 
} from '@/lib/analyzers/coral-ai'
import { scanLicenses } from '@/lib/analyzers/license-scanner'
import { scanSecurity } from '@/lib/analyzers/security-audit'
import { mapPrivacy } from '@/lib/analyzers/privacy-mapper'
import { checkRegulatory } from '@/lib/analyzers/regulatory-checker'
import { calculateRiskHeatmap } from '@/lib/analyzers/risk-heatmap'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      auditId, 
      documentContent, 
      documentType,
      packageJson,
      codeContent,
      privacyPolicy,
      analysisTypes = ['compliance', 'license', 'security', 'privacy', 'regulatory']
    } = body

    if (!auditId) {
      return NextResponse.json(
        { error: 'auditId is required' },
        { status: 400 }
      )
    }

    const findings: any[] = []
    const analysisResults: Record<string, any> = {}

    // 1. Compliance Analysis (Coral.ai)
    if (analysisTypes.includes('compliance') && documentContent) {
      console.log('[v0] Running compliance analysis via Coral.ai...')
      try {
        const complianceResult = await analyzeDocumentForCompliance(documentContent, documentType || 'legal')
        analysisResults.compliance = complianceResult
        
        // Convert to findings format
        complianceResult.findings?.forEach((f: any) => {
          findings.push({
            audit_id: auditId,
            category: f.category,
            severity: f.severity,
            title: f.title,
            description: f.description,
            remediation: f.recommendation,
            evidence: f.evidence,
          })
        })
      } catch (error) {
        console.error('[v0] Compliance analysis error:', error)
        analysisResults.compliance = { error: 'Compliance analysis failed' }
      }
    }

    // 2. License Analysis
    if (analysisTypes.includes('license') && (packageJson || codeContent)) {
      console.log('[v0] Running license scan...')
      try {
        // Try AI analysis first
        const licenseResult = await analyzeCodeForLicenses(codeContent || '', packageJson)
        analysisResults.licenses = licenseResult
        
        // Convert to findings
        licenseResult.licenses?.forEach((l: any) => {
          if (l.riskLevel === 'critical' || l.riskLevel === 'high') {
            findings.push({
              audit_id: auditId,
              category: 'Compliance',
              severity: l.riskLevel === 'critical' ? 'critical' : 'high',
              title: `License Risk: ${l.dependency} (${l.license})`,
              description: l.conflictReason || `License ${l.license} may conflict with compliance requirements`,
              remediation: l.recommendation,
              evidence: `${l.dependency}@${l.version}`,
            })
          }
        })
      } catch (error) {
        console.error('[v0] License analysis error:', error)
        // Fallback to pattern-based scanning
        if (packageJson) {
          try {
            const fallbackResult = await scanLicenses(packageJson)
            analysisResults.licenses_fallback = fallbackResult
          } catch (fallbackError) {
            console.error('[v0] License fallback error:', fallbackError)
          }
        }
      }
    }

    // 3. Security Analysis
    if (analysisTypes.includes('security') && codeContent) {
      console.log('[v0] Running security analysis...')
      try {
        // Try AI analysis first
        const securityResult = await analyzeCodeForSecurity(codeContent)
        analysisResults.security = securityResult
        
        // Convert to findings
        securityResult.vulnerabilities?.forEach((v: any) => {
          findings.push({
            audit_id: auditId,
            category: 'Security',
            severity: v.severity,
            title: v.title,
            description: v.description,
            remediation: v.remediation,
            evidence: v.filePath ? `${v.filePath}:${v.lineNumber}` : 'Code analysis',
          })
        })

        // Add secret exposure findings
        securityResult.secretsDetected?.forEach((s: any) => {
          findings.push({
            audit_id: auditId,
            category: 'Security',
            severity: 'critical',
            title: `Exposed ${s.secretType}`,
            description: `Found exposed ${s.secretType} at ${s.location}`,
            remediation: s.recommendation,
            evidence: s.location,
          })
        })
      } catch (error) {
        console.error('[v0] Security analysis error:', error)
        // Fallback to pattern-based scanning
        try {
          const fallbackResult = await scanSecurity(codeContent)
          analysisResults.security_fallback = fallbackResult
        } catch (fallbackError) {
          console.error('[v0] Security fallback error:', fallbackError)
        }
      }
    }

    // 4. Privacy Analysis
    if (analysisTypes.includes('privacy') && (privacyPolicy || documentContent)) {
      console.log('[v0] Running privacy analysis...')
      try {
        // Try AI analysis first
        const privacyResult = await analyzeForPrivacyCompliance(privacyPolicy || documentContent || '')
        analysisResults.privacy = privacyResult
        
        // Convert to findings
        privacyResult.gdpr?.forEach((g: any) => {
          if (g.status === 'non_compliant' || g.status === 'partial') {
            findings.push({
              audit_id: auditId,
              category: 'Privacy',
              severity: g.status === 'non_compliant' ? 'high' : 'medium',
              title: `GDPR Gap: ${g.requirement}`,
              description: `GDPR requirement not met: ${g.requirement}`,
              remediation: `Implement ${g.requirement} to achieve GDPR compliance`,
              evidence: g.evidence,
            })
          }
        })

        privacyResult.dataFlowIssues?.forEach((d: any) => {
          findings.push({
            audit_id: auditId,
            category: 'Privacy',
            severity: d.severity,
            title: `Data Flow Issue: ${d.description}`,
            description: d.description,
            remediation: d.recommendation,
            evidence: 'Privacy policy analysis',
          })
        })
      } catch (error) {
        console.error('[v0] Privacy analysis error:', error)
        // Fallback to checklist-based assessment
        try {
          const fallbackResult = await mapPrivacy(privacyPolicy || documentContent || '')
          analysisResults.privacy_fallback = fallbackResult
        } catch (fallbackError) {
          console.error('[v0] Privacy fallback error:', fallbackError)
        }
      }
    }

    // 5. Regulatory Analysis
    if (analysisTypes.includes('regulatory')) {
      console.log('[v0] Running regulatory check...')
      try {
        const regulatoryResult = await checkRegulatory(documentContent || '', ['SEC', 'SOX'])
        analysisResults.regulatory = regulatoryResult
        
        // Convert critical deadlines to findings
        regulatoryResult.criticalDeadlines?.forEach((d: any) => {
          findings.push({
            audit_id: auditId,
            category: 'Regulatory',
            severity: 'high',
            title: `${d.regulation} Deadline: ${d.requirement}`,
            description: `${d.requirement} deadline in ${d.daysUntilDeadline} days`,
            remediation: `Complete ${d.requirement} before deadline`,
            evidence: `Deadline: ${new Date(Date.now() + d.daysUntilDeadline * 24 * 60 * 60 * 1000).toISOString()}`,
          })
        })
      } catch (error) {
        console.error('[v0] Regulatory analysis error:', error)
      }
    }

    // Store findings in database
    if (findings.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('findings')
        .insert(findings)

      if (insertError) {
        console.error('[v0] Error storing findings:', insertError)
      }
    }

    // Calculate overall risk score
    const criticalCount = findings.filter(f => f.severity === 'critical').length
    const highCount = findings.filter(f => f.severity === 'high').length
    let riskScore = 0
    riskScore += criticalCount * 20
    riskScore += highCount * 10
    riskScore = Math.min(100, Math.round(riskScore / Math.max(1, findings.length)))

    // Generate remediation plan
    let remediationPlan: any = null
    if (findings.length > 0) {
      try {
        remediationPlan = await generateRemediationPlan(
          findings.slice(0, 10).map(f => ({
            title: f.title,
            description: f.description,
            category: f.category,
          }))
        )
      } catch (error) {
        console.error('[v0] Error generating remediation plan:', error)
      }
    }

    return NextResponse.json({
      success: true,
      auditId,
      findingsCount: findings.length,
      riskScore,
      analysisResults,
      remediationPlan,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] Comprehensive analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}
