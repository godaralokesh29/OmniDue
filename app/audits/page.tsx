'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuditCreationModal from '@/components/modals/AuditCreationModal'
import { Audit } from '@/lib/types'

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [filteredAudits, setFilteredAudits] = useState<Audit[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('/api/audits')
        if (response.ok) {
          const data = await response.json()
          setAudits(data)
          setFilteredAudits(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching audits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAudits()
  }, [])

  useEffect(() => {
    const filtered = audits.filter(audit =>
      audit.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAudits(filtered)
  }, [searchTerm, audits])

  const handleAuditCreated = (newAudit: Audit) => {
    setAudits([newAudit, ...audits])
    setShowModal(false)
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-50'
    if (score >= 40) return 'bg-yellow-50'
    return 'bg-green-50'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">M&A Audits</h1>
            <p className="text-muted-foreground mt-1">Manage and review compliance audits</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Audit
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search audits by company name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Audits</p>
            <p className="text-2xl font-bold mt-2">{audits.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold mt-2">{audits.filter(a => a.status === 'completed').length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Critical Risk</p>
            <p className="text-2xl font-bold mt-2 text-red-600">{audits.filter(a => a.riskScore >= 70).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Avg Risk Score</p>
            <p className="text-2xl font-bold mt-2">
              {audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + a.riskScore, 0) / audits.length) : 0}%
            </p>
          </Card>
        </div>

        {/* Audits List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-muted-foreground">Loading audits...</p>
            </div>
          ) : filteredAudits.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No audits found</p>
              <p className="text-muted-foreground mb-4">Create your first audit to get started</p>
              <Button onClick={() => setShowModal(true)}>Create Audit</Button>
            </Card>
          ) : (
            filteredAudits.map((audit) => (
              <Link key={audit.id} href={`/audits/${audit.id}`}>
                <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{audit.companyName}</h3>
                        <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
                          {audit.status === 'completed' ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Types: {audit.auditType.split(',').join(', ')}</span>
                        <span>•</span>
                        <span>{audit.documentsCount} documents</span>
                        <span>•</span>
                        <span>{new Date(audit.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className={`${getRiskBg(audit.riskScore)} rounded-lg p-4 text-center min-w-24`}>
                      <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                      <p className={`text-2xl font-bold ${getRiskColor(audit.riskScore)}`}>
                        {audit.riskScore}%
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Audit Creation Modal */}
      <AuditCreationModal isOpen={showModal} onClose={() => setShowModal(false)} onAuditCreated={handleAuditCreated} />
    </DashboardLayout>
  )
}
