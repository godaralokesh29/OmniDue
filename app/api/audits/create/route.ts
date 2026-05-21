import { NextRequest, NextResponse } from 'next/server';
import { createAudit, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_name, company_industry, audit_type } = body;

    // First, create or get the company
    const { data: existingCompany } = await supabaseAdmin
      .from('companies')
      .select('id')
      .eq('name', company_name)
      .single();

    let companyId: string;

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: companyError } = await supabaseAdmin
        .from('companies')
        .insert([
          {
            name: company_name,
            industry: company_industry,
            founded_year: new Date().getFullYear(),
            employee_count: 0,
          },
        ])
        .select('id')
        .single();

      if (companyError) throw companyError;
      companyId = newCompany.id;
    }

    // Create the audit
    const audit = await createAudit({
      company_id: companyId,
      audit_type: audit_type || 'full',
    });

    return NextResponse.json({ success: true, audit }, { status: 201 });
  } catch (error) {
    console.error('[v0] Audit creation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create audit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
