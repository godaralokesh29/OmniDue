// Helper to manage multi-tenant agent context
import { supabaseAdmin } from '@/lib/supabase';
import { EncryptionService } from '@/lib/encryption-service';
import { MultiTenantDataFetcher } from '@/lib/agent/multi-tenant-data-fetcher';

export interface UserIntegration {
  id: string;
  user_id: string;
  company_name: string;
  notion_api_key?: string;
  notion_database_id?: string;
  github_token?: string;
  github_owner?: string;
  github_repo?: string;
  openai_api_key?: string;
}

export class MultiTenantAgentService {
  static async getUserIntegration(userId: string, integrationId?: string): Promise<UserIntegration | null> {
    try {
      let query = supabaseAdmin
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (integrationId) {
        query = query.eq('id', integrationId);
      }

      const { data, error } = await query.single();

      if (error || !data) {
        console.error('Failed to fetch user integration:', error);
        return null;
      }

      // Decrypt sensitive fields
      return {
        ...data,
        notion_api_key: data.notion_api_key 
          ? EncryptionService.decrypt(data.notion_api_key)
          : undefined,
        github_token: data.github_token
          ? EncryptionService.decrypt(data.github_token)
          : undefined,
        openai_api_key: data.openai_api_key
          ? EncryptionService.decrypt(data.openai_api_key)
          : undefined,
      };
    } catch (error) {
      console.error('Error in getUserIntegration:', error);
      return null;
    }
  }

  static async getAllUserIntegrations(userId: string): Promise<UserIntegration[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !data) {
        return [];
      }

      // Decrypt all sensitive fields
      return data.map(item => ({
        ...item,
        notion_api_key: item.notion_api_key
          ? EncryptionService.decrypt(item.notion_api_key)
          : undefined,
        github_token: item.github_token
          ? EncryptionService.decrypt(item.github_token)
          : undefined,
        openai_api_key: item.openai_api_key
          ? EncryptionService.decrypt(item.openai_api_key)
          : undefined,
      }));
    } catch (error) {
      console.error('Error in getAllUserIntegrations:', error);
      return [];
    }
  }

  static getDataFetcher(integration: UserIntegration): MultiTenantDataFetcher {
    return new MultiTenantDataFetcher({
      notionToken: integration.notion_api_key,
      notionDatabaseId: integration.notion_database_id,
      githubToken: integration.github_token,
      githubOwner: integration.github_owner,
      githubRepo: integration.github_repo,
    });
  }

  static async logAnalysisStart(userId: string, integrationId: string, auditId: string) {
    try {
      await supabaseAdmin
        .from('user_integrations')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', integrationId)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error logging analysis start:', error);
    }
  }

  static async recordAnalysisAudit(
    userId: string,
    integrationId: string,
    auditId: string,
    status: 'started' | 'completed' | 'failed',
    metadata?: Record<string, any>
  ) {
    try {
      // Could be extended to store analysis history
      console.log(`[Audit] ${status.toUpperCase()}: ${auditId} for ${integrationId}`);
    } catch (error) {
      console.error('Error recording audit:', error);
    }
  }
}
