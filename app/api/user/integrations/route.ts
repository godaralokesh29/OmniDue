import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EncryptionService } from '@/lib/encryption-service';

export const runtime = 'nodejs';

// Get user's integrations
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Mask sensitive keys before sending to frontend
    const maskedData = data.map(integration => ({
      ...integration,
      notion_api_key: integration.notion_api_key 
        ? EncryptionService.maskKey(integration.notion_api_key)
        : null,
      github_token: integration.github_token
        ? EncryptionService.maskKey(integration.github_token)
        : null,
      openai_api_key: integration.openai_api_key
        ? EncryptionService.maskKey(integration.openai_api_key)
        : null,
    }));

    return NextResponse.json({ data: maskedData });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    );
  }
}

// Create or update user integrations
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
    const {
      integration_id,
      company_name,
      display_name,
      notion_api_key,
      notion_database_id,
      github_token,
      github_owner,
      github_repo,
      openai_api_key,
    } = body;

    // Validate required fields
    if (!company_name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Prepare data with encryption
    const integrationData: any = {
      user_id: userId,
      company_name,
      display_name: display_name || company_name,
      updated_at: new Date().toISOString(),
      updated_by: userId,
    };

    // Encrypt sensitive keys
    if (notion_api_key) {
      integrationData.notion_api_key = EncryptionService.encrypt(notion_api_key);
      integrationData.notion_database_id = notion_database_id;
    }

    if (github_token) {
      integrationData.github_token = EncryptionService.encrypt(github_token);
      integrationData.github_owner = github_owner;
      integrationData.github_repo = github_repo;
    }

    if (openai_api_key) {
      integrationData.openai_api_key = EncryptionService.encrypt(openai_api_key);
    }

    let result;

    if (integration_id) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from('user_integrations')
        .update(integrationData)
        .eq('id', integration_id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new
      integrationData.created_at = new Date().toISOString();
      integrationData.created_by = userId;

      const { data, error } = await supabaseAdmin
        .from('user_integrations')
        .insert([integrationData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Mask sensitive data before returning
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        notion_api_key: result.notion_api_key 
          ? EncryptionService.maskKey(result.notion_api_key)
          : null,
        github_token: result.github_token
          ? EncryptionService.maskKey(result.github_token)
          : null,
        openai_api_key: result.openai_api_key
          ? EncryptionService.maskKey(result.openai_api_key)
          : null,
      },
    });
  } catch (error) {
    console.error('Error saving integration:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save integration' },
      { status: 500 }
    );
  }
}

// Delete integration
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('id');

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Integration ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('user_integrations')
      .delete()
      .eq('id', integrationId)
      .eq('user_id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting integration:', error);
    return NextResponse.json(
      { error: 'Failed to delete integration' },
      { status: 500 }
    );
  }
}
