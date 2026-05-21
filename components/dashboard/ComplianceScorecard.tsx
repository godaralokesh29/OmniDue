'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComplianceScorecardProps {
  detailed?: boolean;
}

// Demo data
const scorecardData = {
  overall: 64,
  legal: 58,
  security: 45,
  privacy: 70,
  license: 32,
  regulatory: 55,
  criticalFindings: 18,
  highFindings: 24,
};

const trendData = [
  { date: 'Day 1', score: 72 },
  { date: 'Day 2', score: 70 },
  { date: 'Day 3', score: 68 },
  { date: 'Day 4', score: 66 },
  { date: 'Day 5', score: 65 },
  { date: 'Day 6', score: 64 },
];

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'from-green-900 to-green-700';
  if (score >= 60) return 'from-blue-900 to-blue-700';
  if (score >= 40) return 'from-yellow-900 to-yellow-700';
  return 'from-red-900 to-red-700';
};

const ScoreCategory = ({
  label,
  score,
  trend,
}: {
  label: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
        {trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
        {trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-400" />}
      </div>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export default function ComplianceScorecard({ detailed = false }: ComplianceScorecardProps) {
  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl">Compliance Scorecard</CardTitle>
        <CardDescription>Current compliance and risk posture</CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-600/50">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
              <div className={`text-5xl font-bold ${getScoreColor(scorecardData.overall)}`}>
                {scorecardData.overall}
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-red-400">
                <TrendingDown className="w-4 h-4" />
                <span>Declining Trend</span>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Category Breakdown</h4>
            <div className="space-y-4">
              <ScoreCategory label="Legal & Regulatory" score={scorecardData.legal} trend="declining" />
              <ScoreCategory label="Security" score={scorecardData.security} trend="declining" />
              <ScoreCategory label="Privacy & Data" score={scorecardData.privacy} trend="stable" />
              <ScoreCategory label="Licensing" score={scorecardData.license} trend="declining" />
              <ScoreCategory label="Regulatory Filings" score={scorecardData.regulatory} trend="stable" />
            </div>
          </div>

          {/* Critical Findings */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{scorecardData.criticalFindings}</div>
              <div className="text-xs text-red-300 mt-1">Critical Issues</div>
            </div>
            <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400">{scorecardData.highFindings}</div>
              <div className="text-xs text-orange-300 mt-1">High Issues</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
