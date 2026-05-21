import { Audit, ComplianceFinding, RiskHeatmapData } from './types'

export const SAMPLE_AUDITS: Audit[] = [
  {
    id: 'AUD-001',
    companyName: 'TechCorp Inc.',
    auditType: 'Legal, Security, Privacy',
    status: 'completed',
    riskScore: 72,
    overallRisk: 'high',
    documentsCount: 24,
    createdAt: new Date('2024-05-10'),
    updatedAt: new Date('2024-05-15'),
  },
  {
    id: 'AUD-002',
    companyName: 'DataStream Analytics',
    auditType: 'Privacy, Regulatory',
    status: 'completed',
    riskScore: 48,
    overallRisk: 'medium',
    documentsCount: 18,
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date('2024-05-12'),
  },
  {
    id: 'AUD-003',
    companyName: 'CloudFirst Solutions',
    auditType: 'Security, Compliance',
    status: 'in-progress',
    riskScore: 35,
    overallRisk: 'low',
    documentsCount: 31,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-20'),
  },
]

export const SAMPLE_FINDINGS: ComplianceFinding[] = [
  {
    id: 'FND-001',
    auditId: 'AUD-001',
    category: 'Security',
    severity: 'critical',
    title: 'Unencrypted Database Connection',
    description: 'Database connections in production environment are not encrypted. Customer data may be exposed in transit.',
    remediation: 'Implement SSL/TLS encryption for all database connections. Update connection strings in production environment.',
    evidence: 'Connection string: mysql://user:pass@db.example.com',
    timestamp: new Date('2024-05-11'),
  },
  {
    id: 'FND-002',
    auditId: 'AUD-001',
    category: 'Privacy',
    severity: 'high',
    title: 'Missing Data Processing Agreement',
    description: 'Third-party vendors processing customer data lack formal Data Processing Agreements (DPA).',
    remediation: 'Execute Data Processing Agreements with all vendors who have access to customer data. Document all processors.',
    timestamp: new Date('2024-05-12'),
  },
  {
    id: 'FND-003',
    auditId: 'AUD-001',
    category: 'Compliance',
    severity: 'high',
    title: 'GPL License Violation Risk',
    description: 'Application includes GPL-licensed components but does not open-source required code.',
    remediation: 'Either replace GPL dependencies with permissive alternatives or open-source the entire product.',
    timestamp: new Date('2024-05-13'),
  },
  {
    id: 'FND-004',
    auditId: 'AUD-001',
    category: 'Security',
    severity: 'medium',
    title: 'Weak Password Policy',
    description: 'Admin password requirements do not meet security standards (minimum 12 characters, special characters).',
    remediation: 'Implement strong password policy requiring minimum 12 characters, uppercase, lowercase, numbers, and special characters.',
    timestamp: new Date('2024-05-14'),
  },
  {
    id: 'FND-005',
    auditId: 'AUD-001',
    category: 'Privacy',
    severity: 'medium',
    title: 'Incomplete Privacy Policy',
    description: 'Privacy policy does not disclose all data processing activities or third-party sharing.',
    remediation: 'Update privacy policy to include complete list of data types collected, processing purposes, and third-party recipients.',
    timestamp: new Date('2024-05-15'),
  },
  {
    id: 'FND-006',
    auditId: 'AUD-002',
    category: 'Compliance',
    severity: 'high',
    title: 'CCPA Opt-Out Mechanism Missing',
    description: 'California users cannot exercise their CCPA right to opt-out of data sale.',
    remediation: 'Implement CCPA-compliant opt-out mechanism and prominently display "Do Not Sell" link on website.',
    timestamp: new Date('2024-05-06'),
  },
  {
    id: 'FND-007',
    auditId: 'AUD-002',
    category: 'Privacy',
    severity: 'medium',
    title: 'No Breach Notification Procedure',
    description: 'Organization lacks documented breach notification procedures required under GDPR (72-hour requirement).',
    remediation: 'Develop and document incident response plan with specific breach notification timeline and procedures.',
    timestamp: new Date('2024-05-08'),
  },
  {
    id: 'FND-008',
    auditId: 'AUD-003',
    category: 'Security',
    severity: 'medium',
    title: 'Insufficient API Rate Limiting',
    description: 'API endpoints lack rate limiting, making them vulnerable to DoS attacks.',
    remediation: 'Implement API rate limiting with appropriate thresholds per user and IP address.',
    timestamp: new Date('2024-05-18'),
  },
]

export const SAMPLE_HEATMAP_DATA: RiskHeatmapData = {
  categories: ['Legal', 'Security', 'Privacy', 'Compliance', 'Data Protection'],
  dimensions: ['Documentation', 'Implementation', 'Testing', 'Monitoring', 'Response'],
  matrix: [
    [8, 6, 7, 5, 4],
    [9, 8, 7, 6, 5],
    [7, 6, 8, 7, 6],
    [6, 5, 6, 7, 8],
    [8, 7, 7, 6, 5],
  ],
  riskLevels: ['critical', 'high', 'high', 'medium', 'medium'],
  lastUpdated: new Date('2024-05-15'),
}

export function getAuditById(auditId: string): Audit | undefined {
  return SAMPLE_AUDITS.find(a => a.id === auditId)
}

export function getFindingsByAuditId(auditId: string): ComplianceFinding[] {
  return SAMPLE_FINDINGS.filter(f => f.auditId === auditId)
}

export function getAllAudits(): Audit[] {
  return SAMPLE_AUDITS
}

export function getComplianceStats() {
  return {
    totalAudits: SAMPLE_AUDITS.length,
    completedAudits: SAMPLE_AUDITS.filter(a => a.status === 'completed').length,
    inProgressAudits: SAMPLE_AUDITS.filter(a => a.status === 'in-progress').length,
    totalFindings: SAMPLE_FINDINGS.length,
    criticalFindings: SAMPLE_FINDINGS.filter(f => f.severity === 'critical').length,
    averageRiskScore: Math.round(
      SAMPLE_AUDITS.reduce((sum, a) => sum + a.riskScore, 0) / SAMPLE_AUDITS.length
    ),
  }
}
