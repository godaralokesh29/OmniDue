'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Share2, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Audit, ComplianceFinding } from '@/lib/types'

export default function AuditDetailsPage() {
  const params = useParams()
  const auditId = params.auditId as string
  const [audit, setAudit] = useState<Audit | null>(null)
  const [findings, setFindings] = useState<ComplianceFinding[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        const response = await fetch(`/api/audits/${auditId}`)
        if (!response.ok) throw new Error('Failed to fetch audit')
        const data = await response.json()
        setAudit(data)

        const findingsResponse = await fetch(`/api/audits/${auditId}/findings`)
        if (findingsResponse.ok) {
          const findingsData = await findingsResponse.json()
          setFindings(findingsData)
        }
      } catch (error) {
        console.error('[v0] Error fetching audit:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditDetails()
  }, [auditId])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-900'
      case 'high': return 'bg-orange-50 text-orange-900'
      case 'medium': return 'bg-yellow-50 text-yellow-900'
      case 'low': return 'bg-blue-50 text-blue-900'
      default: return 'bg-gray-50 text-gray-900'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audit details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!audit) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-lg font-semibold">Audit not found</p>
            <Link href="/audits">
              <Button variant="outline" className="mt-4">Back to Audits</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const criticalFindings = findings.filter(f => f.severity === 'critical')
  const highFindings = findings.filter(f => f.severity === 'high')
  const mediumFindings = findings.filter(f => f.severity === 'medium')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/audits">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{audit.companyName}</h1>
              <p className="text-muted-foreground">Audit ID: {audit.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-run Audit
            </Button>
          </div>
        </div>

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{audit.riskScore}%</p>
              </div>
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-white ${getSeverityColor(audit.overallRisk)}`}>
                {audit.riskScore >= 70 ? '🔴' : audit.riskScore >= 40 ? '🟠' : '🟢'}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Critical Issues</p>
            <p className="text-2xl font-bold text-red-600">{criticalFindings.length}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">High Issues</p>
            <p className="text-2xl font-bold text-orange-600">{highFindings.length}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Medium Issues</p>
            <p className="text-2xl font-bold text-yellow-600">{mediumFindings.length}</p>
          </Card>
        </div>

        {/* Audit Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Audit Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={audit.status === 'completed' ? 'default' : 'outline'}>
                {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-medium">{new Date(audit.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Audit Type</p>
              <div className="flex gap-2 flex-wrap">
                {audit.auditType.split(',').map(type => (
                  <Badge key={type.trim()} variant="secondary">{type.trim()}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document Count</p>
              <p className="font-medium">{audit.documentsCount} documents</p>
            </div>
          </div>
        </Card>

        {/* Detailed Findings */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({findings.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({criticalFindings.length})</TabsTrigger>
            <TabsTrigger value="high">High ({highFindings.length})</TabsTrigger>
            <TabsTrigger value="medium">Medium ({mediumFindings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {findings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} getSeverityBgColor={getSeverityBgColor} />
            ))}
          </TabsContent>

          <TabsContent value="critical" className="space-y-4 mt-4">
            {criticalFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} getSeverityBgColor={getSeverityBgColor} />
            ))}
          </TabsContent>

          <TabsContent value="high" className="space-y-4 mt-4">
            {highFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} getSeverityBgColor={getSeverityBgColor} />
            ))}
          </TabsContent>

          <TabsContent value="medium" className="space-y-4 mt-4">
            {mediumFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} getSeverityBgColor={getSeverityBgColor} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function FindingCard({ finding, getSeverityBgColor }: { finding: ComplianceFinding; getSeverityBgColor: (severity: string) => string }) {
  return (
    <Card className="p-4 border-l-4 border-l-red-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <Badge className={`${getSeverityBgColor(finding.severity)} text-xs font-semibold`}>
            {finding.severity.toUpperCase()}
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{finding.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-3 rounded-md mb-3">
        <p className="text-sm font-medium mb-1">Remediation:</p>
        <p className="text-sm text-muted-foreground">{finding.remediation}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p>Category: <span className="font-medium">{finding.category}</span></p>
        <p>Found: {new Date(finding.timestamp).toLocaleDateString()}</p>
      </div>
    </Card>
  )
}
