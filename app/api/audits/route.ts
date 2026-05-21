import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform database format to API format
    const audits = data.map(audit => ({
      id: audit.id,
      companyName: audit.company_name,
      auditType: audit.audit_type,
      status: audit.status,
      riskScore: audit.risk_score,
      overallRisk: audit.overall_risk,
      documentsCount: audit.documents_count,
      createdAt: audit.created_at,
      updatedAt: audit.updated_at,
    }))

    return NextResponse.json(audits)
  } catch (error) {
    console.error('[v0] Error fetching audits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    )
  }
}
