import { NextRequest, NextResponse } from 'next/server';
import { aiAuditAgent } from '@/lib/agent/orchestrator';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditId, companyName, notionDatabaseId, githubOwner, githubRepo } = body;

    if (!auditId || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields: auditId, companyName' },
        { status: 400 }
      );
    }

    // Start the AI agent analysis
    const result = await aiAuditAgent.runFullAudit({
      auditId,
      companyName,
      notionDatabaseId,
      githubOwner,
      githubRepo,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Cross-reference analysis completed successfully',
    });
  } catch (error) {
    console.error('Error in cross-reference analysis:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Analysis failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
