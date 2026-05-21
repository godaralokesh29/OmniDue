import { NextRequest, NextResponse } from 'next/server';
import { DataFetcher } from '@/lib/agent/data-fetcher';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, notionDatabaseId, githubOwner, githubRepo } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: 'Missing required field: companyName' },
        { status: 400 }
      );
    }

    const fetcher = new DataFetcher();

    // Fetch documents from all sources
    const documents = await fetcher.fetchAllDataSources(
      companyName,
      notionDatabaseId,
      githubOwner,
      githubRepo
    );

    // Fetch regulatory checklists
    const checklists = await fetcher.fetchRegulatoryChecklists();

    return NextResponse.json({
      success: true,
      data: {
        documents: {
          sources: Object.keys(documents),
          documentCount: Object.values(documents).reduce((sum, docs) => sum + docs.length, 0),
          details: documents,
        },
        regulatoryChecklists: {
          regulations: Object.keys(checklists),
          requirementCounts: Object.entries(checklists).reduce(
            (acc, [reg, reqs]) => {
              acc[reg] = reqs.length;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching source data:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch source data',
      },
      { status: 500 }
    );
  }
}
