import { LicenseScannerResult, ComplianceFinding } from '@/lib/types'

// Common open source license patterns and their compliance levels
const LICENSE_PATTERNS = {
  'MIT': { type: 'MIT', riskLevel: 'low', permissive: true },
  'Apache-2.0': { type: 'Apache-2.0', riskLevel: 'low', permissive: true },
  'ISC': { type: 'ISC', riskLevel: 'low', permissive: true },
  'BSD': { type: 'BSD', riskLevel: 'low', permissive: true },
  'GPL-2.0': { type: 'GPL-2.0', riskLevel: 'critical', copyleft: true },
  'GPL-3.0': { type: 'GPL-3.0', riskLevel: 'critical', copyleft: true },
  'AGPL-3.0': { type: 'AGPL-3.0', riskLevel: 'critical', copyleft: true },
  'MPL-2.0': { type: 'MPL-2.0', riskLevel: 'medium', copyleft: true },
  'LGPL-2.1': { type: 'LGPL-2.1', riskLevel: 'medium', copyleft: true },
  'LGPL-3.0': { type: 'LGPL-3.0', riskLevel: 'medium', copyleft: true },
  'SSPL': { type: 'SSPL', riskLevel: 'critical', proprietary: true },
  'BSL-1.0': { type: 'BSL-1.0', riskLevel: 'low', permissive: true },
  'UNLICENSE': { type: 'UNLICENSE', riskLevel: 'low', permissive: true },
}

interface ParsedDependency {
  name: string
  version: string
  license: string
  source?: string
}

interface LicenseIssue {
  dependency: string
  detectedLicense: string
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
  issue: string
  remediation: string
  type: 'copyleft' | 'proprietary' | 'unknown' | 'multiple'
}

export async function scanLicenses(packageJsonContent: string): Promise<LicenseScannerResult> {
  try {
    console.log('[v0] Starting license scan...')
    
    const parsed = JSON.parse(packageJsonContent)
    const dependencies = {
      ...parsed.dependencies,
      ...parsed.devDependencies,
      ...parsed.optionalDependencies,
    }

    const issues: LicenseIssue[] = []
    const scannedDeps: Array<{
      name: string
      license: string
      riskLevel: string
    }> = []

    for (const [depName, depVersion] of Object.entries(dependencies)) {
      // Simulate fetching license info (in production, would query npm registry or license database)
      const licenseInfo = await fetchLicenseInfo(depName as string)
      
      if (!licenseInfo) {
        issues.push({
          dependency: depName as string,
          detectedLicense: 'UNKNOWN',
          riskLevel: 'high',
          issue: `License information not found for ${depName}`,
          remediation: `Check ${depName} repository or package.json for license field`,
          type: 'unknown',
        })
        continue
      }

      scannedDeps.push({
        name: depName as string,
        license: licenseInfo.license,
        riskLevel: licenseInfo.riskLevel,
      })

      // Check for known problematic licenses
      const licenseEntry = (LICENSE_PATTERNS as Record<string, any>)[licenseInfo.license]
      
      if (licenseEntry?.copyleft && licenseEntry?.riskLevel === 'critical') {
        issues.push({
          dependency: depName as string,
          detectedLicense: licenseInfo.license,
          riskLevel: 'critical',
          issue: `${licenseInfo.license} is a strong copyleft license. Using this library may require you to open-source your entire codebase.`,
          remediation: `Either remove this dependency, replace it with a permissive alternative, or ensure your product is open-source compliant.`,
          type: 'copyleft',
        })
      }

      if (licenseEntry?.riskLevel === 'medium') {
        issues.push({
          dependency: depName as string,
          detectedLicense: licenseInfo.license,
          riskLevel: 'medium',
          issue: `${licenseInfo.license} requires careful integration. Ensure proper attribution and compliance.`,
          remediation: `Review license terms and ensure your project structure complies with ${licenseInfo.license} requirements.`,
          type: 'copyleft',
        })
      }
    }

    // Calculate overall compliance score
    const totalDeps = scannedDeps.length
    const criticalIssues = issues.filter(i => i.riskLevel === 'critical').length
    const complianceScore = Math.max(0, 100 - (criticalIssues * 25 + issues.length * 5))

    console.log(`[v0] License scan complete. Found ${issues.length} issues.`)

    return {
      totalDependencies: totalDeps,
      scannedDependencies: scannedDeps,
      issues,
      complianceScore: Math.round(complianceScore),
      lastScanned: new Date(),
      summary: {
        critical: criticalIssues,
        high: issues.filter(i => i.riskLevel === 'high').length,
        medium: issues.filter(i => i.riskLevel === 'medium').length,
        low: issues.filter(i => i.riskLevel === 'low').length,
      }
    }
  } catch (error) {
    console.error('[v0] License scan error:', error)
    throw new Error(`License scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

async function fetchLicenseInfo(packageName: string): Promise<{ license: string; riskLevel: string } | null> {
  // Mock implementation - in production, query npm registry or license database
  const mockLicenses: Record<string, string> = {
    'react': 'MIT',
    'vue': 'MIT',
    'angular': 'MIT',
    'next': 'MIT',
    'express': 'MIT',
    'lodash': 'MIT',
    'axios': 'MIT',
    'webpack': 'MIT',
    'babel': 'MIT',
    'typescript': 'Apache-2.0',
    'prisma': 'Apache-2.0',
    'supabase-js': 'MIT',
    'jest': 'MIT',
    'vitest': 'MIT',
    'testing-library': 'MIT',
  }

  const license = mockLicenses[packageName.toLowerCase()] || 'MIT'
  const licenseEntry = (LICENSE_PATTERNS as Record<string, any>)[license]
  
  return {
    license,
    riskLevel: licenseEntry?.riskLevel || 'low',
  }
}

export function calculateLicenseRiskScore(result: LicenseScannerResult): number {
  let score = 100
  score -= result.summary.critical * 30
  score -= result.summary.high * 15
  score -= result.summary.medium * 5
  return Math.max(0, score)
}

export function generateLicenseReport(result: LicenseScannerResult): string {
  const lines: string[] = [
    'LICENSE COMPLIANCE REPORT',
    '='.repeat(50),
    `Scan Date: ${result.lastScanned.toISOString()}`,
    `Total Dependencies: ${result.totalDependencies}`,
    `Compliance Score: ${result.complianceScore}/100`,
    '',
    'ISSUE SUMMARY:',
    `  Critical: ${result.summary.critical}`,
    `  High: ${result.summary.high}`,
    `  Medium: ${result.summary.medium}`,
    `  Low: ${result.summary.low}`,
    '',
  ]

  if (result.issues.length > 0) {
    lines.push('DETAILED ISSUES:')
    result.issues.forEach((issue, idx) => {
      lines.push(`\n${idx + 1}. ${issue.dependency} (${issue.detectedLicense})`)
      lines.push(`   Risk Level: ${issue.riskLevel.toUpperCase()}`)
      lines.push(`   Issue: ${issue.issue}`)
      lines.push(`   Remediation: ${issue.remediation}`)
    })
  }

  return lines.join('\n')
}
