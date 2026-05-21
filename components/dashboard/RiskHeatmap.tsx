'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RISK_CATEGORIES } from '@/lib/analyzers/risk-heatmap';

interface RiskHeatmapProps {
  detailed?: boolean;
}

// Demo data
const demoHeatmapData = [
  [
    { value: 85, severity: 'critical' as const, findings: 3, title: 'Contracts: 85%' },
    { value: 60, severity: 'high' as const, findings: 2, title: 'Compliance: 60%' },
    { value: 45, severity: 'medium' as const, findings: 1, title: 'IP: 45%' },
    { value: 70, severity: 'high' as const, findings: 4, title: 'Regulatory: 70%' },
  ],
  [
    { value: 55, severity: 'medium' as const, findings: 2, title: 'Code Quality: 55%' },
    { value: 35, severity: 'low' as const, findings: 1, title: 'Dependencies: 35%' },
    { value: 20, severity: 'low' as const, findings: 0, title: 'Architecture: 20%' },
    { value: 40, severity: 'low' as const, findings: 1, title: 'Scalability: 40%' },
  ],
  [
    { value: 92, severity: 'critical' as const, findings: 8, title: 'Vulnerabilities: 92%' },
    { value: 75, severity: 'high' as const, findings: 5, title: 'Secrets: 75%' },
    { value: 50, severity: 'medium' as const, findings: 2, title: 'Access: 50%' },
    { value: 65, severity: 'high' as const, findings: 3, title: 'Data Protection: 65%' },
  ],
  [
    { value: 80, severity: 'high' as const, findings: 6, title: 'GDPR: 80%' },
    { value: 55, severity: 'medium' as const, findings: 2, title: 'CCPA: 55%' },
    { value: 40, severity: 'low' as const, findings: 1, title: 'Data Handling: 40%' },
    { value: 70, severity: 'high' as const, findings: 3, title: 'Consent: 70%' },
  ],
  [
    { value: 88, severity: 'critical' as const, findings: 7, title: 'Open Source: 88%' },
    { value: 95, severity: 'critical' as const, findings: 9, title: 'Copyleft: 95%' },
    { value: 30, severity: 'low' as const, findings: 0, title: 'Commercial: 30%' },
    { value: 75, severity: 'high' as const, findings: 4, title: 'Compatibility: 75%' },
  ],
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 ring-red-500/50';
    case 'high':
      return 'from-orange-900 to-orange-700 hover:from-orange-800 hover:to-orange-600 ring-orange-500/50';
    case 'medium':
      return 'from-yellow-900 to-yellow-700 hover:from-yellow-800 hover:to-yellow-600 ring-yellow-500/50';
    case 'low':
      return 'from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 ring-blue-500/50';
    case 'info':
      return 'from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 ring-slate-500/50';
    default:
      return 'from-slate-700 to-slate-600';
  }
};

const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-500/20 text-red-300 border border-red-500/50';
    case 'high':
      return 'bg-orange-500/20 text-orange-300 border border-orange-500/50';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50';
    case 'low':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/50';
    default:
      return 'bg-slate-500/20 text-slate-300';
  }
};

export default function RiskHeatmap({ detailed = false }: RiskHeatmapProps) {
  const overallRiskScore = 68;
  const trend = 'declining';

  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">Risk Heatmap</CardTitle>
            <CardDescription className="mt-2">
              AI-powered compliance risk assessment across all audit dimensions
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {overallRiskScore}%
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-400">Declining Risk</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {RISK_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <Badge
                  className={`${getSeverityBadgeColor(
                    demoHeatmapData[categoryIndex]?.[0]?.severity || 'info'
                  )}`}
                >
                  {Math.max(...demoHeatmapData[categoryIndex].map((d) => d.value))}% Max
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {demoHeatmapData[categoryIndex].map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`group relative bg-gradient-to-br ${getSeverityColor(
                      cell.severity
                    )} rounded-lg p-3 cursor-pointer transition-all duration-300 ring-1 hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="flex flex-col items-center justify-center h-20">
                      <div className="text-2xl font-bold text-white mb-1">{cell.value}%</div>
                      <div className="text-xs text-white/70">
                        {cell.findings} {cell.findings === 1 ? 'finding' : 'findings'}
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {cell.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {detailed && (
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-semibold mb-4">Risk Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">18</div>
                <div className="text-xs text-red-300 mt-1">Critical Issues</div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-400">24</div>
                <div className="text-xs text-orange-300 mt-1">High Issues</div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                <div className="text-2xl font-bold text-yellow-400">12</div>
                <div className="text-xs text-yellow-300 mt-1">Medium Issues</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-400">8</div>
                <div className="text-xs text-blue-300 mt-1">Low Issues</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
