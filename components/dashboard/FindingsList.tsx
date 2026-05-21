'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Lock, AlertCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Demo findings data
const demoFindings = [
  {
    id: '1',
    title: 'GPL License Conflict Detected',
    category: 'license',
    severity: 'critical',
    description: 'Copyleft GPL dependency detected in production codebase. Proprietary license incompatible.',
    evidence: 'node_modules/gpl-package@1.0.0',
    recommendation: 'Replace with MIT-licensed alternative or review licensing strategy',
  },
  {
    id: '2',
    title: 'Exposed API Keys in Code',
    category: 'security',
    severity: 'critical',
    description: 'API keys and secrets found in version control history',
    evidence: 'commit abc123def',
    recommendation: 'Rotate all exposed keys, implement secrets management, enable pre-commit hooks',
  },
  {
    id: '3',
    title: 'GDPR Compliance Gap',
    category: 'privacy',
    severity: 'high',
    description: 'No Data Processing Agreement (DPA) signed with third-party processors',
    evidence: 'Privacy policy audit',
    recommendation: 'Execute DPAs with all data processors, document data flows',
  },
  {
    id: '4',
    title: 'SQL Injection Vulnerability',
    category: 'security',
    severity: 'high',
    description: 'Unparameterized database queries detected in API endpoints',
    evidence: 'app/api/user/:id endpoint',
    recommendation: 'Implement parameterized queries, use ORM, add input validation',
  },
  {
    id: '5',
    title: 'Missing Access Control Policies',
    category: 'legal',
    severity: 'high',
    description: 'No role-based access control (RBAC) implementation',
    evidence: 'Code review findings',
    recommendation: 'Implement RBAC with principle of least privilege',
  },
  {
    id: '6',
    title: 'Outdated Dependencies',
    category: 'security',
    severity: 'medium',
    description: 'Multiple production dependencies with known vulnerabilities',
    evidence: 'npm audit report',
    recommendation: 'Update dependencies, implement dependency scanning in CI/CD',
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'security':
      return <Lock className="w-4 h-4" />;
    case 'license':
      return <AlertTriangle className="w-4 h-4" />;
    case 'privacy':
      return <AlertCircle className="w-4 h-4" />;
    case 'legal':
      return <Zap className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'security':
      return 'bg-red-500/10 text-red-300 border border-red-500/30';
    case 'license':
      return 'bg-orange-500/10 text-orange-300 border border-orange-500/30';
    case 'privacy':
      return 'bg-purple-500/10 text-purple-300 border border-purple-500/30';
    case 'legal':
      return 'bg-blue-500/10 text-blue-300 border border-blue-500/30';
    default:
      return 'bg-slate-500/10 text-slate-300';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/10 text-red-300 border border-red-500/50';
    case 'high':
      return 'bg-orange-500/10 text-orange-300 border border-orange-500/50';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/50';
    case 'low':
      return 'bg-blue-500/10 text-blue-300 border border-blue-500/50';
    default:
      return 'bg-slate-500/10 text-slate-300';
  }
};

export default function FindingsList() {
  const criticalCount = demoFindings.filter((f) => f.severity === 'critical').length;
  const highCount = demoFindings.filter((f) => f.severity === 'high').length;

  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Audit Findings</CardTitle>
            <CardDescription className="mt-2">
              Detailed compliance findings and recommendations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getSeverityColor('critical')}>
              {criticalCount} Critical
            </Badge>
            <Badge className={getSeverityColor('high')}>
              {highCount} High
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          {demoFindings.map((finding) => (
            <div
              key={finding.id}
              className="border border-border/50 rounded-lg p-4 hover:bg-muted/50 transition-colors space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`${getCategoryColor(finding.category)} rounded-lg p-2 flex-shrink-0`}>
                    {getCategoryIcon(finding.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground break-words">{finding.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                  </div>
                </div>
                <Badge className={`${getSeverityColor(finding.severity)} flex-shrink-0`}>
                  {finding.severity.toUpperCase()}
                </Badge>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">EVIDENCE</p>
                  <p className="text-foreground bg-muted/50 rounded px-3 py-2 font-mono text-xs break-all">
                    {finding.evidence}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold mb-1">RECOMMENDATION</p>
                  <p className="text-foreground">{finding.recommendation}</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border/30">
                <Button variant="ghost" size="sm" className="text-xs">
                  View Details
                </Button>
                <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                  Create Remediation
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {demoFindings.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <p className="text-muted-foreground">No findings. Audit completed successfully!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
