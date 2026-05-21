import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EncryptionService } from '@/lib/encryption-service';
import { DataFetcher } from '@/lib/agent/data-fetcher';

export const runtime = 'nodejs';

// Test integration connection
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { integration_id, source } = body;

    if (!integration_id || !source) {
      return NextResponse.json(
        { error: 'Integration ID and source are required' },
        { status: 400 }
      );
    }

    // Get integration
    const { data: integration, error: fetchError } = await supabaseAdmin
      .from('user_integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    let testResult = { success: false, message: '' };

    // Test based on source
    if (source === 'notion') {
      try {
        const apiKey = integration.notion_api_key 
          ? EncryptionService.decrypt(integration.notion_api_key)
          : null;
        
        if (!apiKey || !integration.notion_database_id) {
          return NextResponse.json({
            success: false,
            message: 'Notion credentials not configured'
          });
        }

        // Simple test: fetch database
        const fetcher = new DataFetcher();
        // We need to create a test method that uses provided credentials
        const response = await fetch(
          `https://api.notion.com/v1/databases/${integration.notion_database_id}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Notion-Version': '2022-06-28',
            },
          }
        );

        if (response.ok) {
          testResult = { success: true, message: 'Connected to Notion successfully' };
        } else {
          testResult = { 
            success: false, 
            message: `Notion connection failed: ${response.statusText}` 
          };
        }
      } catch (error) {
        testResult = {
          success: false,
          message: error instanceof Error ? error.message : 'Notion test failed'
        };
      }
    } else if (source === 'github') {
      try {
        const token = integration.github_token
          ? EncryptionService.decrypt(integration.github_token)
          : null;

        if (!token || !integration.github_owner || !integration.github_repo) {
          return NextResponse.json({
            success: false,
            message: 'GitHub credentials not configured'
          });
        }

        // Test: fetch repo
        const response = await fetch(
          `https://api.github.com/repos/${integration.github_owner}/${integration.github_repo}`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (response.ok) {
          testResult = { success: true, message: 'Connected to GitHub successfully' };
        } else {
          testResult = {
            success: false,
            message: `GitHub connection failed: ${response.statusText}`
          };
        }
      } catch (error) {
        testResult = {
          success: false,
          message: error instanceof Error ? error.message : 'GitHub test failed'
        };
      }
    } else if (source === 'openai') {
      try {
        const apiKey = integration.openai_api_key
          ? EncryptionService.decrypt(integration.openai_api_key)
          : null;

        if (!apiKey) {
          return NextResponse.json({
            success: false,
            message: 'OpenAI credentials not configured'
          });
        }

        // Test: list models
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (response.ok) {
          testResult = { success: true, message: 'Connected to OpenAI successfully' };
        } else {
          testResult = {
            success: false,
            message: `OpenAI connection failed: ${response.statusText}`
          };
        }
      } catch (error) {
        testResult = {
          success: false,
          message: error instanceof Error ? error.message : 'OpenAI test failed'
        };
      }
    }

    // Update test status
    if (testResult.success) {
      const field = `${source}_connected`;
      const testField = `${source}_last_tested`;
      
      await supabaseAdmin
        .from('user_integrations')
        .update({
          [field]: true,
          [testField]: new Date().toISOString(),
        })
        .eq('id', integration_id);
    }

    return NextResponse.json(testResult);
  } catch (error) {
    console.error('Error testing integration:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Test failed'
      },
      { status: 500 }
    );
  }
}
