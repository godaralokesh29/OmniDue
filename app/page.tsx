'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuditCreationModal from '@/components/modals/AuditCreationModal';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';
import ComplianceScorecard from '@/components/dashboard/ComplianceScorecard';
import FindingsList from '@/components/dashboard/FindingsList';
import QuickStats from '@/components/dashboard/QuickStats';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ShieldAlert, FileText, Eye, AlertTriangle, TrendingUp, BarChart3, Plus } from 'lucide-react';
import { SAMPLE_AUDITS, SAMPLE_FINDINGS, getComplianceStats } from '@/lib/sample-data';

export default function Dashboard() {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [activeAudit, setActiveAudit] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  useEffect(() => {
    const complianceStats = getComplianceStats();
    setStats(complianceStats);
    setRecentAudits(SAMPLE_AUDITS.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3));
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 70) return '#dc2626';
    if (score >= 40) return '#ea580c';
    return '#16a34a';
  };

  const criticalFindings = SAMPLE_FINDINGS.filter(f => f.severity === 'critical');

  return (
    <DashboardLayout>
      <div className="space-y-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">M&A Due Diligence Agent</h1>
            <p className="mt-2 text-muted-foreground">
              AI-powered legal and compliance analysis for mergers and acquisitions
            </p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={() => {window.location.href = '/audits'}}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Audit
          </Button>
        </div>

        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Audits</p>
              <p className="text-3xl font-bold">{stats.totalAudits}</p>
              <p className="text-xs text-muted-foreground mt-2">{stats.completedAudits} completed</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Total Findings</p>
              <p className="text-3xl font-bold text-red-600">{stats.totalFindings}</p>
              <p className="text-xs text-muted-foreground mt-2">{stats.criticalFindings} critical</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Avg Risk Score</p>
              <p className="text-3xl font-bold">{stats.averageRiskScore}%</p>
              <div className="h-1 bg-gray-200 rounded-full mt-2">
                <div className="h-1 bg-orange-500 rounded-full" style={{width: `${stats.averageRiskScore}%`}}></div>
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-2">In Progress</p>
              <p className="text-3xl font-bold">{stats.inProgressAudits}</p>
              <p className="text-xs text-muted-foreground mt-2">audits running</p>
            </Card>
          </div>
        )}

        {/* Critical Issues Alert */}
        {criticalFindings.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Critical Issues Detected</p>
              <p className="text-sm text-red-800 mt-1">{criticalFindings.length} critical compliance gaps identified. Review and remediate immediately.</p>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {window.location.href = '/audits'}}
            >
              Review
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Risk Heatmap</span>
            </TabsTrigger>
            <TabsTrigger value="findings" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Findings</span>
            </TabsTrigger>
            <TabsTrigger value="scorecard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Scorecard</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RiskHeatmap />
                </div>
                <div>
                  <ComplianceScorecard />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="heatmap">
              <RiskHeatmap detailed />
            </TabsContent>

            <TabsContent value="findings">
              <FindingsList />
            </TabsContent>

            <TabsContent value="scorecard">
              <ComplianceScorecard detailed />
            </TabsContent>
          </div>
        </Tabs>

        {/* Recent Audits */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Audits</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {window.location.href = '/audits'}}
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentAudits.map((audit) => (
              <Card 
                key={audit.id} 
                className="p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => {window.location.href = `/audits/${audit.id}`}}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{audit.companyName}</h3>
                    <p className="text-sm text-muted-foreground">{audit.auditType} • {audit.documentsCount} docs</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
                      {audit.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                    <div className="text-right">
                      <p className="font-bold" style={{color: getRiskColor(audit.riskScore)}}>
                        {audit.riskScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <BarChart3 className="h-8 w-8 mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Risk Heatmap</h3>
              <p className="text-sm text-muted-foreground">Real-time visualization of compliance risks across all dimensions and categories.</p>
            </Card>
            <Card className="p-4">
              <ShieldAlert className="h-8 w-8 mb-3 text-orange-500" />
              <h3 className="font-semibold mb-2">License Scanner</h3>
              <p className="text-sm text-muted-foreground">Detect GPL violations and license compliance issues automatically.</p>
            </Card>
            <Card className="p-4">
              <TrendingUp className="h-8 w-8 mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Security Audit</h3>
              <p className="text-sm text-muted-foreground">Identify vulnerabilities, weak crypto, and secret exposures in code.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Audit Creation Modal */}
      {showAuditModal && (
        <AuditCreationModal
          isOpen={showAuditModal}
          onClose={() => setShowAuditModal(false)}
          onSuccess={(audit) => {
            setActiveAudit(audit.id);
            setAuditData(audit);
            setShowAuditModal(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
