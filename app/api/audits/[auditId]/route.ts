import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string } }
) {
  try {
    const { auditId } = params
    const supabase = supabaseAdmin

    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (error) {
      console.error('[v0] Supabase error:', error)
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    // Transform database format to API format
    const audit = {
      id: data.id,
      companyName: data.company_name,
      auditType: data.audit_type,
      status: data.status,
      riskScore: data.risk_score,
      overallRisk: data.overall_risk,
      documentsCount: data.documents_count,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(audit)
  } catch (error) {
    console.error('[v0] Error fetching audit:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    )
  }
}
