import { PrivacyMappingResult, ComplianceFinding } from '@/lib/types'

interface PrivacyControl {
  regulation: string
  requirement: string
  implemented: boolean
  evidence?: string
  gap?: string
}

interface RegulationChecklist {
  regulation: string
  controls: PrivacyControl[]
  compliancePercentage: number
  criticalGaps: string[]
}

// GDPR Requirements
const GDPR_CHECKLIST: PrivacyControl[] = [
  {
    regulation: 'GDPR',
    requirement: 'Legal basis for processing personal data',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Privacy notice and transparency',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Data subject rights (access, erasure, portability)',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Data Protection Impact Assessment (DPIA)',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Breach notification procedures (72 hours)',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Data Processing Agreement with vendors',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Data retention limits and deletion',
    implemented: false,
  },
  {
    regulation: 'GDPR',
    requirement: 'Consent management (explicit and granular)',
    implemented: false,
  },
]

// CCPA Requirements
const CCPA_CHECKLIST: PrivacyControl[] = [
  {
    regulation: 'CCPA',
    requirement: 'California Privacy Rights disclosures',
    implemented: false,
  },
  {
    regulation: 'CCPA',
    requirement: 'Consumer rights (access, delete, opt-out)',
    implemented: false,
  },
  {
    regulation: 'CCPA',
    requirement: 'Do Not Sell/Share My Personal Information link',
    implemented: false,
  },
  {
    regulation: 'CCPA',
    requirement: 'Service provider agreements',
    implemented: false,
  },
  {
    regulation: 'CCPA',
    requirement: 'Opt-out mechanisms for sale of data',
    implemented: false,
  },
  {
    regulation: 'CCPA',
    requirement: 'Annual privacy policy audits',
    implemented: false,
  },
]

// HIPAA Requirements (Health Insurance Portability and Accountability Act)
const HIPAA_CHECKLIST: PrivacyControl[] = [
  {
    regulation: 'HIPAA',
    requirement: 'Protected Health Information (PHI) identification',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Access controls and authentication',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Encryption of PHI in transit and at rest',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Audit logs and monitoring',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Breach notification procedures',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Business Associate Agreements',
    implemented: false,
  },
  {
    regulation: 'HIPAA',
    requirement: 'Minimum necessary principle',
    implemented: false,
  },
]

export async function mapPrivacy(policyContent: string, applicableRegulations: string[] = ['GDPR', 'CCPA']): Promise<PrivacyMappingResult> {
  try {
    console.log('[v0] Starting privacy mapping...')
    
    const regulationChecklists: RegulationChecklist[] = []
    const findings: ComplianceFinding[] = []

    for (const regulation of applicableRegulations) {
      let checklist: PrivacyControl[]
      
      switch (regulation) {
        case 'GDPR':
          checklist = GDPR_CHECKLIST
          break
        case 'CCPA':
          checklist = CCPA_CHECKLIST
          break
        case 'HIPAA':
          checklist = HIPAA_CHECKLIST
          break
        default:
          checklist = GDPR_CHECKLIST
      }

      // Analyze policy content for compliance signals
      const analyzeChecklist = checklist.map(control => ({
        ...control,
        implemented: analyzeControl(control.requirement, policyContent),
      }))

      const implementedCount = analyzeChecklist.filter(c => c.implemented).length
      const compliancePercentage = Math.round((implementedCount / analyzeChecklist.length) * 100)
      
      const criticalGaps = analyzeChecklist
        .filter(c => !c.implemented && isControlCritical(c.requirement))
        .map(c => c.requirement)

      regulationChecklists.push({
        regulation,
        controls: analyzeChecklist,
        compliancePercentage,
        criticalGaps,
      })

      // Create findings for gaps
      criticalGaps.forEach(gap => {
        findings.push({
          category: 'Privacy',
          severity: 'critical',
          title: `${regulation} Gap: ${gap}`,
          description: `Missing implementation of ${regulation} requirement: ${gap}`,
          remediation: `Implement ${gap} in your privacy program and update documentation.`,
          timestamp: new Date(),
        })
      })

      const nonCriticalGaps = analyzeChecklist
        .filter(c => !c.implemented && !isControlCritical(c.requirement))
        .map(c => c.requirement)

      nonCriticalGaps.forEach(gap => {
        findings.push({
          category: 'Privacy',
          severity: 'medium',
          title: `${regulation} Gap: ${gap}`,
          description: `Missing implementation of ${regulation} requirement: ${gap}`,
          remediation: `Plan implementation of ${gap} in your privacy program.`,
          timestamp: new Date(),
        })
      })
    }

    // Calculate overall privacy score
    const avgCompliance = Math.round(
      regulationChecklists.reduce((sum, r) => sum + r.compliancePercentage, 0) / regulationChecklists.length
    )

    console.log(`[v0] Privacy mapping complete. Compliance: ${avgCompliance}%`)

    return {
      regulationChecklists,
      overallComplianceScore: avgCompliance,
      findings,
      dataFlowRisks: identifyDataFlowRisks(policyContent),
      lastMapped: new Date(),
      summary: {
        gdprCompliance: regulationChecklists.find(r => r.regulation === 'GDPR')?.compliancePercentage || 0,
        ccpaCompliance: regulationChecklists.find(r => r.regulation === 'CCPA')?.compliancePercentage || 0,
        hipaaCompliance: regulationChecklists.find(r => r.regulation === 'HIPAA')?.compliancePercentage || 0,
        criticalGapsCount: findings.filter(f => f.severity === 'critical').length,
      },
    }
  } catch (error) {
    console.error('[v0] Privacy mapping error:', error)
    throw new Error(`Privacy mapping failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function analyzeControl(requirement: string, policyContent: string): boolean {
  const keywords = extractKeywords(requirement)
  const policyLower = policyContent.toLowerCase()
  
  // Check if at least 50% of keywords appear in policy
  const matchingKeywords = keywords.filter(kw => policyLower.includes(kw.toLowerCase()))
  return matchingKeywords.length >= keywords.length * 0.5
}

function extractKeywords(requirement: string): string[] {
  return requirement
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
}

function isControlCritical(requirement: string): boolean {
  const criticalKeywords = ['encryption', 'breach', 'consent', 'access', 'delete', 'authentication', 'audit']
  return criticalKeywords.some(kw => requirement.toLowerCase().includes(kw))
}

function identifyDataFlowRisks(policyContent: string): any[] {
  const risks: any[] = []
  
  const dataTypes = ['personal data', 'user information', 'customer data', 'health data', 'financial data']
  const destinations = ['third parties', 'vendors', 'service providers', 'international', 'cloud']
  
  for (const dataType of dataTypes) {
    if (policyContent.toLowerCase().includes(dataType)) {
      for (const dest of destinations) {
        if (policyContent.toLowerCase().includes(dest)) {
          risks.push({
            source: 'User Data',
            dataType,
            destination: dest,
            riskLevel: 'high',
            requiresCompliance: true,
          })
        }
      }
    }
  }
  
  return risks
}

export function calculatePrivacyScore(result: PrivacyMappingResult): number {
  const score = result.overallComplianceScore
  const gapPenalty = result.summary.criticalGapsCount * 15
  return Math.max(0, score - gapPenalty)
}

export function generatePrivacyReport(result: PrivacyMappingResult): string {
  const lines: string[] = [
    'PRIVACY COMPLIANCE REPORT',
    '='.repeat(50),
    `Mapping Date: ${result.lastMapped.toISOString()}`,
    `Overall Compliance: ${result.overallComplianceScore}%`,
    '',
    'REGULATION BREAKDOWN:',
    `  GDPR Compliance: ${result.summary.gdprCompliance}%`,
    `  CCPA Compliance: ${result.summary.ccpaCompliance}%`,
    `  HIPAA Compliance: ${result.summary.hipaaCompliance}%`,
    '',
    'CRITICAL GAPS: ' + result.summary.criticalGapsCount,
    '',
  ]

  if (result.dataFlowRisks.length > 0) {
    lines.push('DATA FLOW RISKS:')
    result.dataFlowRisks.forEach((risk, idx) => {
      lines.push(`\n${idx + 1}. ${risk.dataType} → ${risk.destination}`)
      lines.push(`   Risk Level: ${risk.riskLevel.toUpperCase()}`)
    })
    lines.push('')
  }

  lines.push('DETAILED FINDINGS:')
  result.findings.slice(0, 10).forEach((finding, idx) => {
    lines.push(`\n${idx + 1}. ${finding.title}`)
    lines.push(`   Severity: ${finding.severity.toUpperCase()}`)
    lines.push(`   Description: ${finding.description}`)
    lines.push(`   Remediation: ${finding.remediation}`)
  })

  return lines.join('\n')
}
