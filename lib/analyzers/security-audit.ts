import { SecurityAuditResult, ComplianceFinding } from '@/lib/types'

interface SecurityIssue {
  type: 'vulnerability' | 'secret-exposure' | 'weak-crypto' | 'injection' | 'auth-issue'
  severity: 'critical' | 'high' | 'medium' | 'low'
  location: string
  code: string
  issue: string
  remediation: string
  cveId?: string
}

// Patterns for detecting common security issues
const SECURITY_PATTERNS = {
  secrets: [
    /AWS_SECRET_ACCESS_KEY\s*=\s*['"][^'"]+['"]/gi,
    /PRIVATE_KEY\s*=\s*['"][^'"]+['"]/gi,
    /API_KEY\s*=\s*['"][^'"]+['"]/gi,
    /DATABASE_PASSWORD\s*=\s*['"][^'"]+['"]/gi,
    /auth_token\s*=\s*['"][^'"]+['"]/gi,
    /(?:password|passwd|pwd)\s*=\s*['"][^'"]{3,}['"]/gi,
  ],
  
  vulnerabilities: [
    { pattern: /eval\s*\(/gi, issue: 'eval() usage - potential code injection', type: 'injection' },
    { pattern: /require\(\s*['"].*['"].*user.*['"][^)]*\)/gi, issue: 'Dynamic require with user input', type: 'injection' },
    { pattern: /innerHTML\s*=/gi, issue: 'Direct innerHTML assignment - XSS vulnerability', type: 'injection' },
    { pattern: /dangerous.*parseHtml/gi, issue: 'Unsafe HTML parsing', type: 'injection' },
  ],

  weakCrypto: [
    { pattern: /md5\s*\(/gi, issue: 'MD5 hashing - weak cryptographic function', type: 'weak-crypto' },
    { pattern: /sha1\s*\(/gi, issue: 'SHA-1 hashing - deprecated cryptographic function', type: 'weak-crypto' },
    { pattern: /Math\.random\(\)/gi, issue: 'Math.random() for security - not cryptographically secure', type: 'weak-crypto' },
  ],

  authIssues: [
    { pattern: /password.*plaintext/gi, issue: 'Password stored in plaintext', type: 'auth-issue' },
    { pattern: /hardcoded.*password/gi, issue: 'Hardcoded credentials detected', type: 'auth-issue' },
    { pattern: /basicAuth\s*=\s*['"][^:]+:[^'"]+['"]/gi, issue: 'Basic auth credentials in code', type: 'auth-issue' },
  ],
}

export async function scanSecurity(codeContent: string, fileName?: string): Promise<SecurityAuditResult> {
  try {
    console.log('[v0] Starting security audit...')
    
    const issues: SecurityIssue[] = []
    const auditDetails: ComplianceFinding[] = []

    // Scan for exposed secrets
    for (const pattern of SECURITY_PATTERNS.secrets) {
      const matches = codeContent.matchAll(pattern)
      for (const match of matches) {
        const lineNum = codeContent.substring(0, match.index).split('\n').length
        issues.push({
          type: 'secret-exposure',
          severity: 'critical',
          location: `${fileName || 'code'}:${lineNum}`,
          code: match[0],
          issue: 'Exposed secret or credential in code',
          remediation: 'Remove all secrets from codebase. Use environment variables or secret management services.',
        })
      }
    }

    // Scan for vulnerabilities
    for (const vulnPattern of SECURITY_PATTERNS.vulnerabilities) {
      const matches = codeContent.matchAll(vulnPattern.pattern)
      for (const match of matches) {
        const lineNum = codeContent.substring(0, match.index).split('\n').length
        issues.push({
          type: vulnPattern.type as any,
          severity: 'high',
          location: `${fileName || 'code'}:${lineNum}`,
          code: match[0],
          issue: vulnPattern.issue,
          remediation: 'Review and replace with secure alternative. Use parameterized queries or secure rendering methods.',
        })
      }
    }

    // Scan for weak cryptography
    for (const cryptoPattern of SECURITY_PATTERNS.weakCrypto) {
      const matches = codeContent.matchAll(cryptoPattern.pattern)
      for (const match of matches) {
        const lineNum = codeContent.substring(0, match.index).split('\n').length
        issues.push({
          type: cryptoPattern.type as any,
          severity: 'high',
          location: `${fileName || 'code'}:${lineNum}`,
          code: match[0],
          issue: cryptoPattern.issue,
          remediation: `Use secure cryptographic functions. For hashing, use bcrypt, argon2, or scrypt. For randomness, use crypto.getRandomValues().`,
        })
      }
    }

    // Scan for authentication issues
    for (const authPattern of SECURITY_PATTERNS.authIssues) {
      const matches = codeContent.matchAll(authPattern.pattern)
      for (const match of matches) {
        const lineNum = codeContent.substring(0, match.index).split('\n').length
        issues.push({
          type: 'auth-issue',
          severity: 'critical',
          location: `${fileName || 'code'}:${lineNum}`,
          code: match[0],
          issue: authPattern.issue,
          remediation: 'Never hardcode credentials. Use secure secret management and environment variables.',
        })
      }
    }

    // Convert to compliance findings
    for (const issue of issues) {
      auditDetails.push({
        category: 'Security',
        severity: issue.severity as any,
        title: issue.issue,
        description: `Found ${issue.type} at ${issue.location}`,
        remediation: issue.remediation,
        evidence: issue.code,
        timestamp: new Date(),
      })
    }

    // Calculate security score
    const criticalCount = issues.filter(i => i.severity === 'critical').length
    const highCount = issues.filter(i => i.severity === 'high').length
    const mediumCount = issues.filter(i => i.severity === 'medium').length
    
    let securityScore = 100
    securityScore -= criticalCount * 20
    securityScore -= highCount * 10
    securityScore -= mediumCount * 5

    console.log(`[v0] Security audit complete. Found ${issues.length} issues.`)

    return {
      totalIssues: issues.length,
      issues: auditDetails,
      securityScore: Math.max(0, securityScore),
      lastAudited: new Date(),
      summary: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: issues.filter(i => i.severity === 'low').length,
      },
      findings: {
        vulnerabilities: issues.filter(i => i.type === 'vulnerability' || i.type === 'injection').length,
        secretExposures: issues.filter(i => i.type === 'secret-exposure').length,
        weakCrypto: issues.filter(i => i.type === 'weak-crypto').length,
        authIssues: issues.filter(i => i.type === 'auth-issue').length,
      },
    }
  } catch (error) {
    console.error('[v0] Security audit error:', error)
    throw new Error(`Security audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function calculateSecurityRiskScore(result: SecurityAuditResult): number {
  let score = 100
  score -= result.summary.critical * 20
  score -= result.summary.high * 10
  score -= result.summary.medium * 5
  return Math.max(0, score)
}

export function generateSecurityReport(result: SecurityAuditResult): string {
  const lines: string[] = [
    'SECURITY AUDIT REPORT',
    '='.repeat(50),
    `Audit Date: ${result.lastAudited.toISOString()}`,
    `Total Issues: ${result.totalIssues}`,
    `Security Score: ${result.securityScore}/100`,
    '',
    'ISSUE SUMMARY:',
    `  Critical: ${result.summary.critical}`,
    `  High: ${result.summary.high}`,
    `  Medium: ${result.summary.medium}`,
    `  Low: ${result.summary.low}`,
    '',
    'FINDING BREAKDOWN:',
    `  Vulnerabilities: ${result.findings.vulnerabilities}`,
    `  Secret Exposures: ${result.findings.secretExposures}`,
    `  Weak Cryptography: ${result.findings.weakCrypto}`,
    `  Authentication Issues: ${result.findings.authIssues}`,
    '',
  ]

  if (result.issues.length > 0) {
    lines.push('TOP FINDINGS:')
    result.issues.slice(0, 10).forEach((issue, idx) => {
      lines.push(`\n${idx + 1}. ${issue.title} (${issue.severity.toUpperCase()})`)
      lines.push(`   Description: ${issue.description}`)
      lines.push(`   Remediation: ${issue.remediation}`)
    })
  }

  return lines.join('\n')
}
