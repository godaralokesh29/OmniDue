import type { Finding, RiskHeatmapData, RiskCell } from '../types';

export interface RiskCategory {
  name: string;
  subcategories: string[];
}

export const RISK_CATEGORIES: RiskCategory[] = [
  {
    name: 'Legal & Regulatory',
    subcategories: ['Contracts', 'Compliance', 'Intellectual Property', 'Regulatory Filings'],
  },
  {
    name: 'Technology',
    subcategories: ['Code Quality', 'Dependencies', 'Architecture', 'Scalability'],
  },
  {
    name: 'Security',
    subcategories: ['Vulnerabilities', 'Secrets', 'Access Control', 'Data Protection'],
  },
  {
    name: 'Privacy',
    subcategories: ['GDPR', 'CCPA', 'Data Handling', 'Consent Management'],
  },
  {
    name: 'Licensing',
    subcategories: ['Open Source', 'Copyleft', 'Commercial', 'Compatibility'],
  },
];

export function calculateRiskScore(findings: Finding[]): number {
  if (findings.length === 0) return 0;

  const severityScores = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25,
    info: 10,
  };

  const totalScore = findings.reduce((sum, finding) => {
    return sum + (severityScores[finding.severity] || 0);
  }, 0);

  const averageScore = totalScore / findings.length;
  return Math.min(100, Math.round(averageScore));
}

export function groupFindingsByCategory(findings: Finding[]): Record<string, Finding[]> {
  return findings.reduce(
    (groups, finding) => {
      if (!groups[finding.category]) {
        groups[finding.category] = [];
      }
      groups[finding.category].push(finding);
      return groups;
    },
    {} as Record<string, Finding[]>
  );
}

export function calculateCategoryRisk(categoryFindings: Finding[]): number {
  if (categoryFindings.length === 0) return 0;

  const criticalCount = categoryFindings.filter((f) => f.severity === 'critical').length;
  const highCount = categoryFindings.filter((f) => f.severity === 'high').length;
  const mediumCount = categoryFindings.filter((f) => f.severity === 'medium').length;

  // Weighted calculation
  const riskScore = (criticalCount * 40 + highCount * 25 + mediumCount * 10) / (categoryFindings.length * 40);
  return Math.min(100, Math.round(riskScore * 100));
}

export function generateRiskHeatmap(findings: Finding[]): RiskHeatmapData {
  const groupedFindings = groupFindingsByCategory(findings);
  const overallRiskScore = calculateRiskScore(findings);

  // Create heatmap matrix
  const risks: RiskCell[][] = RISK_CATEGORIES.map((category) => {
    return category.subcategories.map((subcategory) => {
      // Filter findings for this category
      const categoryKey = category.name.toLowerCase().replace(' & ', '_').replace(' ', '_');
      const categoryFindings = groupedFindings[categoryKey] || [];

      // Further filter by subcategory (this is a simplified mapping)
      const subcategoryFindings = categoryFindings.filter((f) =>
        f.description.toLowerCase().includes(subcategory.toLowerCase())
      );

      const riskValue = categoryFindings.length > 0 ? calculateCategoryRisk(categoryFindings) : 0;

      let severity: 'critical' | 'high' | 'medium' | 'low' | 'info' = 'info';
      if (riskValue >= 80) severity = 'critical';
      else if (riskValue >= 60) severity = 'high';
      else if (riskValue >= 40) severity = 'medium';
      else if (riskValue > 0) severity = 'low';

      return {
        value: riskValue,
        severity,
        findings_count: subcategoryFindings.length,
        title: `${subcategory}: ${riskValue}%`,
      };
    });
  });

  // Calculate summary
  const summary = {
    critical: findings.filter((f) => f.severity === 'critical').length,
    high: findings.filter((f) => f.severity === 'high').length,
    medium: findings.filter((f) => f.severity === 'medium').length,
    low: findings.filter((f) => f.severity === 'low').length,
  };

  return {
    categories: RISK_CATEGORIES.map((c) => c.name),
    risks,
    overallRiskScore,
    summary,
  };
}

export function calculateComplianceScore(findings: Finding[]): Record<string, number> {
  const groupedFindings = groupFindingsByCategory(findings);
  const scores: Record<string, number> = {};

  Object.entries(groupedFindings).forEach(([category, categoryFindings]) => {
    const categoryScore = 100 - calculateCategoryRisk(categoryFindings);
    scores[category] = Math.max(0, categoryScore);
  });

  // Ensure all categories are represented
  ['legal', 'security', 'privacy', 'license', 'regulatory'].forEach((category) => {
    if (!(category in scores)) {
      scores[category] = 100;
    }
  });

  return scores;
}

export function identifyHighRiskAreas(findings: Finding[]): Finding[] {
  return findings
    .filter((f) => f.severity === 'critical' || f.severity === 'high')
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1 };
      return (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
    });
}

export function generateRiskTrend(
  previousScore: number | null,
  currentScore: number
): 'improving' | 'stable' | 'declining' {
  if (previousScore === null) return 'stable';

  const difference = currentScore - previousScore;
  const threshold = 5; // 5 point difference threshold

  if (difference > threshold) return 'declining';
  if (difference < -threshold) return 'improving';
  return 'stable';
}

export function calculateComplianceScorecard(findings: Finding[], previousScores?: Record<string, number>) {
  const categoryScores = calculateComplianceScore(findings);
  const groupedFindings = groupFindingsByCategory(findings);

  const scores = {
    overall: Math.round(
      (categoryScores.legal || 100) * 0.2 +
        (categoryScores.security || 100) * 0.25 +
        (categoryScores.privacy || 100) * 0.25 +
        (categoryScores.license || 100) * 0.2 +
        (categoryScores.regulatory || 100) * 0.1
    ),
    legal: Math.round(categoryScores.legal || 100),
    security: Math.round(categoryScores.security || 100),
    privacy: Math.round(categoryScores.privacy || 100),
    license: Math.round(categoryScores.license || 100),
    regulatory: Math.round(categoryScores.regulatory || 100),
  };

  return {
    ...scores,
    critical_findings: findings.filter((f) => f.severity === 'critical').length,
    high_findings: findings.filter((f) => f.severity === 'high').length,
    trend: {
      legal: generateRiskTrend(previousScores?.legal, scores.legal),
      security: generateRiskTrend(previousScores?.security, scores.security),
      privacy: generateRiskTrend(previousScores?.privacy, scores.privacy),
      license: generateRiskTrend(previousScores?.license, scores.license),
      regulatory: generateRiskTrend(previousScores?.regulatory, scores.regulatory),
    },
  };
}
