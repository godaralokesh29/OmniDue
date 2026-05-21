import { NextRequest, NextResponse } from 'next/server';
import { aiAuditAgent } from '@/lib/agent/orchestrator';

export const runtime = 'nodejs';

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

    // Create a streaming response
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          // Send initial state
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: 'started',
                message: 'Beginning cross-reference analysis...',
              })}\n\n`
            )
          );

          // Run analysis with progress streaming
          const result = await aiAuditAgent.streamAnalysisProgress(
            {
              auditId,
              companyName,
              notionDatabaseId,
              githubOwner,
              githubRepo,
            },
            (state) => {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    status: 'progress',
                    ...state,
                  })}\n\n`
                )
              );
            }
          );

          // Send final results
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: 'complete',
                data: result,
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error',
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in streaming analysis:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start analysis stream' },
      { status: 500 }
    );
  }
}
