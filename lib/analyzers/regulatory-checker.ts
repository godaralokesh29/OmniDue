import { ComplianceFinding } from '@/lib/types'

interface RegulatoryRequirement {
  regulation: string
  requirement: string
  deadline: Date
  applicable: boolean
  status: 'compliant' | 'non-compliant' | 'in-progress'
  evidence?: string
}

interface RegulatoryCheckResult {
  regulations: RegulatoryRequirement[]
  complianceStatus: number
  criticalDeadlines: Array<{ requirement: string; daysUntilDeadline: number; regulation: string }>
  findings: ComplianceFinding[]
  lastChecked: Date
}

const SEC_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    regulation: 'SEC',
    requirement: 'Material contract disclosure',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'compliant',
  },
  {
    regulation: 'SEC',
    requirement: 'Financial statement audit',
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'compliant',
  },
  {
    regulation: 'SEC',
    requirement: 'Executive compensation disclosure',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'in-progress',
  },
]

const SOX_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    regulation: 'SOX',
    requirement: 'Internal control assessment',
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'compliant',
  },
  {
    regulation: 'SOX',
    requirement: 'IT governance documentation',
    deadline: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'compliant',
  },
]

const FINRA_REQUIREMENTS: RegulatoryRequirement[] = [
  {
    regulation: 'FINRA',
    requirement: 'Anti-money laundering compliance',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'compliant',
  },
  {
    regulation: 'FINRA',
    requirement: 'Know Your Customer (KYC) procedures',
    deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    applicable: false,
    status: 'in-progress',
  },
]

export async function checkRegulatory(companyInfo: string, applicableRegulations: string[] = ['SEC']): Promise<RegulatoryCheckResult> {
  try {
    console.log('[v0] Starting regulatory check...')
    
    const allRequirements: RegulatoryRequirement[] = []
    const findings: ComplianceFinding[] = []

    // Collect applicable requirements
    for (const regulation of applicableRegulations) {
      let requirements: RegulatoryRequirement[]
      
      switch (regulation) {
        case 'SEC':
          requirements = SEC_REQUIREMENTS
          break
        case 'SOX':
          requirements = SOX_REQUIREMENTS
          break
        case 'FINRA':
          requirements = FINRA_REQUIREMENTS
          break
        default:
          continue
      }

      allRequirements.push(...requirements)
    }

    // Analyze compliance status
    for (const req of allRequirements) {
      const isCompliant = req.status === 'compliant'
      
      if (!isCompliant) {
        const daysUntilDeadline = Math.ceil((req.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        const severity = daysUntilDeadline < 30 ? 'critical' : daysUntilDeadline < 60 ? 'high' : 'medium'
        
        findings.push({
          category: 'Regulatory',
          severity: severity as any,
          title: `${req.regulation} Non-Compliance: ${req.requirement}`,
          description: `Requirement not met: ${req.requirement}. Deadline is ${new Date(req.deadline).toLocaleDateString()}. Current status: ${req.status}`,
          remediation: `Implement ${req.requirement} to comply with ${req.regulation} regulations. Work with compliance team to develop implementation plan.`,
          timestamp: new Date(),
        })
      }
    }

    // Calculate compliance percentage
    const compliantCount = allRequirements.filter(r => r.status === 'compliant').length
    const complianceStatus = Math.round((compliantCount / allRequirements.length) * 100)

    // Identify critical deadlines (< 30 days)
    const criticalDeadlines = allRequirements
      .filter(r => {
        const daysUntil = Math.ceil((r.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return daysUntil < 30 && r.status !== 'compliant'
      })
      .map(r => ({
        requirement: r.requirement,
        daysUntilDeadline: Math.ceil((r.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        regulation: r.regulation,
      }))
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)

    console.log(`[v0] Regulatory check complete. Compliance: ${complianceStatus}%`)

    return {
      regulations: allRequirements,
      complianceStatus,
      criticalDeadlines,
      findings,
      lastChecked: new Date(),
    }
  } catch (error) {
    console.error('[v0] Regulatory check error:', error)
    throw new Error(`Regulatory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function generateRegulatoryReport(result: RegulatoryCheckResult): string {
  const lines: string[] = [
    'REGULATORY COMPLIANCE REPORT',
    '='.repeat(50),
    `Check Date: ${result.lastChecked.toISOString()}`,
    `Overall Compliance: ${result.complianceStatus}%`,
    '',
    'REGULATIONS CHECKED:',
  ]

  const regulationMap = new Map<string, RegulatoryRequirement[]>()
  for (const req of result.regulations) {
    if (!regulationMap.has(req.regulation)) {
      regulationMap.set(req.regulation, [])
    }
    regulationMap.get(req.regulation)!.push(req)
  }

  for (const [reg, reqs] of regulationMap.entries()) {
    const compliant = reqs.filter(r => r.status === 'compliant').length
    lines.push(`\n${reg}:`)
    lines.push(`  Compliant: ${compliant}/${reqs.length}`)
    reqs.forEach(req => {
      lines.push(`    ✓ ${req.requirement} [${req.status.toUpperCase()}]`)
    })
  }

  if (result.criticalDeadlines.length > 0) {
    lines.push('\nCRITICAL DEADLINES (< 30 days):')
    result.criticalDeadlines.forEach((deadline, idx) => {
      lines.push(`${idx + 1}. ${deadline.regulation} - ${deadline.requirement}`)
      lines.push(`   Days until deadline: ${deadline.daysUntilDeadline}`)
    })
  }

  return lines.join('\n')
}

export function calculateRegulatoryScore(result: RegulatoryCheckResult): number {
  let score = result.complianceStatus
  
  // Penalty for critical deadlines
  const criticalPenalty = result.criticalDeadlines.length * 5
  score = Math.max(0, score - criticalPenalty)
  
  return score
}
