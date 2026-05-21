'use client';

import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Audits */}
      <Card className="border border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Audits</p>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">12</div>
          <p className="text-xs text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +3 this month
          </p>
        </div>
      </Card>

      {/* Critical Findings */}
      <Card className="border border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Critical Findings</p>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">18</div>
          <p className="text-xs text-red-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            -2 from last audit
          </p>
        </div>
      </Card>

      {/* Avg Compliance Score */}
      <Card className="border border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Avg Compliance</p>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-400">64%</div>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            -2% this week
          </p>
        </div>
      </Card>

      {/* License Issues */}
      <Card className="border border-border bg-card/50 backdrop-blur-sm p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">License Issues</p>
            <AlertTriangle className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-orange-400">7</div>
          <p className="text-xs text-orange-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +1 new conflict
          </p>
        </div>
      </Card>
    </div>
  );
}
