import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    const { auditId } = await params;

    const { data: findings, error } = await supabaseAdmin
      .from('findings')
      .select('*')
      .eq('audit_id', auditId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ findings }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error fetching findings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch findings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
