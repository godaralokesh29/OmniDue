import axios from 'axios';
import { DocumentData, DataSource, RegulatoryRequirement } from './types';

export class DataFetcher {
  private notionToken: string;
  private githubToken: string;
  private secApiBase: string;

  constructor() {
    this.notionToken = process.env.NOTION_API_KEY || '';
    this.githubToken = process.env.GITHUB_TOKEN || '';
    this.secApiBase = process.env.SEC_EDGAR_API_BASE || 'https://www.sec.gov/cgi-bin/browse-edgar';
  }

  async fetchNotionDocuments(databaseId: string): Promise<DocumentData[]> {
    try {
      if (!this.notionToken) {
        console.warn('Notion API key not configured');
        return [];
      }

      const response = await axios.post(
        'https://api.notion.com/v1/databases/' + databaseId + '/query',
        {},
        {
          headers: {
            Authorization: `Bearer ${this.notionToken}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );

      return response.data.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Name?.title?.[0]?.text?.content || 'Untitled',
        source: 'notion' as const,
        url: page.url,
        content: page.properties.Content?.rich_text?.map((t: any) => t.text.content).join('\n') || '',
        metadata: {
          notionPageId: page.id,
          created: page.created_time,
          modified: page.last_edited_time,
          properties: page.properties,
        },
      }));
    } catch (error) {
      console.error('Error fetching Notion documents:', error);
      return [];
    }
  }

  async fetchGitHubDocuments(owner: string, repo: string): Promise<DocumentData[]> {
    try {
      if (!this.githubToken) {
        console.warn('GitHub token not configured');
        return [];
      }

      const documents: DocumentData[] = [];

      // Fetch compliance-related files (README, SECURITY.md, LICENSE, etc.)
      const filesToCheck = [
        'README.md',
        'SECURITY.md',
        'CODE_OF_CONDUCT.md',
        'LICENSE',
        'CONTRIBUTING.md',
        'docs/privacy.md',
        'docs/compliance.md',
        'docs/security.md',
      ];

      for (const file of filesToCheck) {
        try {
          const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contents/${file}`,
            {
              headers: {
                Authorization: `Bearer ${this.githubToken}`,
                Accept: 'application/vnd.github.v3.raw',
              },
            }
          );

          documents.push({
            id: `${owner}/${repo}/${file}`,
            title: file,
            source: 'github' as const,
            url: `https://github.com/${owner}/${repo}/blob/main/${file}`,
            content: response.data,
            metadata: {
              repository: `${owner}/${repo}`,
              filePath: file,
            },
          });
        } catch {
          // File doesn't exist, continue
        }
      }

      // Fetch latest commits for security audit trail
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`,
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
          },
        }
      );

      if (Array.isArray(commitsResponse.data)) {
        documents.push({
          id: `${owner}/${repo}/commits`,
          title: 'Recent Commits Log',
          source: 'github' as const,
          url: `https://github.com/${owner}/${repo}/commits`,
          content: JSON.stringify(commitsResponse.data, null, 2),
          metadata: {
            repository: `${owner}/${repo}`,
            type: 'commit_log',
            count: commitsResponse.data.length,
          },
        });
      }

      return documents;
    } catch (error) {
      console.error('Error fetching GitHub documents:', error);
      return [];
    }
  }

  async fetchSECFilings(companyName: string): Promise<DocumentData[]> {
    try {
      const documents: DocumentData[] = [];

      // Query SEC EDGAR for company filings
      const response = await axios.get(this.secApiBase, {
        params: {
          company: companyName,
          action: 'getcompany',
          output: 'json',
        },
      });

      // Mock response structure - in real implementation would parse SEC EDGAR response
      if (response.data?.cik_lookup) {
        documents.push({
          id: `sec-${companyName}`,
          title: `SEC Filings for ${companyName}`,
          source: 'sec' as const,
          url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${companyName}`,
          content: JSON.stringify(response.data, null, 2),
          metadata: {
            company: companyName,
            filings: response.data?.filings || [],
          },
        });
      }

      return documents;
    } catch (error) {
      console.error('Error fetching SEC filings:', error);
      return [];
    }
  }

  async fetchRegulatoryChecklists(): Promise<Record<string, RegulatoryRequirement[]>> {
    const checklists: Record<string, RegulatoryRequirement[]> = {
      GDPR: [
        {
          regulation: 'GDPR',
          requirement: 'Data Processing Agreement (DPA)',
          description: 'Must have written DPA with all data processors',
          category: 'data_handling',
        },
        {
          regulation: 'GDPR',
          requirement: 'Data Subject Rights',
          description: 'Must implement mechanisms for access, rectification, erasure, and portability',
          category: 'data_subject_rights',
        },
        {
          regulation: 'GDPR',
          requirement: 'Privacy by Design',
          description: 'Data protection must be integrated into all processing activities',
          category: 'design_principles',
        },
        {
          regulation: 'GDPR',
          requirement: 'Breach Notification',
          description: 'Must notify authorities within 72 hours of data breach',
          category: 'incident_response',
        },
        {
          regulation: 'GDPR',
          requirement: 'Data Retention Policy',
          description: 'Must define and enforce data retention periods',
          category: 'data_handling',
        },
        {
          regulation: 'GDPR',
          requirement: 'Consent Management',
          description: 'Must obtain explicit consent before data collection',
          category: 'consent',
        },
      ],
      CCPA: [
        {
          regulation: 'CCPA',
          requirement: 'Consumer Rights Notice',
          description: 'Must provide notice of data collection and consumer rights',
          category: 'transparency',
        },
        {
          regulation: 'CCPA',
          requirement: 'Right to Know',
          description: 'Consumers can request what data is collected',
          category: 'data_subject_rights',
        },
        {
          regulation: 'CCPA',
          requirement: 'Right to Delete',
          description: 'Consumers can request deletion of personal information',
          category: 'data_subject_rights',
        },
        {
          regulation: 'CCPA',
          requirement: 'Opt-Out of Sale',
          description: 'Consumers can opt-out of personal information sale',
          category: 'data_subject_rights',
        },
        {
          regulation: 'CCPA',
          requirement: 'Non-Discrimination',
          description: 'Cannot discriminate against consumers exercising CCPA rights',
          category: 'compliance',
        },
      ],
      HIPAA: [
        {
          regulation: 'HIPAA',
          requirement: 'Access Controls',
          description: 'Must implement safeguards to control access to patient data',
          category: 'access_control',
        },
        {
          regulation: 'HIPAA',
          requirement: 'Encryption',
          description: 'Must encrypt patient data both at rest and in transit',
          category: 'encryption',
        },
        {
          regulation: 'HIPAA',
          requirement: 'Audit Controls',
          description: 'Must implement audit mechanisms to record/examine PHI access',
          category: 'audit',
        },
        {
          regulation: 'HIPAA',
          requirement: 'Business Associate Agreement',
          description: 'Must have written BAA with all entities accessing patient data',
          category: 'contracts',
        },
      ],
      SOC2: [
        {
          regulation: 'SOC2',
          requirement: 'Security',
          description: 'Systems must be protected against unauthorized access',
          category: 'security',
        },
        {
          regulation: 'SOC2',
          requirement: 'Availability',
          description: 'Systems must be available for operation and use as committed',
          category: 'availability',
        },
        {
          regulation: 'SOC2',
          requirement: 'Processing Integrity',
          description: 'System processing must be complete, accurate, timely, and authorized',
          category: 'data_integrity',
        },
        {
          regulation: 'SOC2',
          requirement: 'Confidentiality',
          description: 'Information designated as confidential must be protected',
          category: 'confidentiality',
        },
        {
          regulation: 'SOC2',
          requirement: 'Privacy',
          description: 'Personal information must be collected, used, and disposed per privacy notice',
          category: 'privacy',
        },
      ],
    };

    return checklists;
  }

  async fetchAllDataSources(
    companyName: string,
    notionDatabaseId?: string,
    githubOwner?: string,
    githubRepo?: string
  ): Promise<Record<string, DocumentData[]>> {
    const allDocuments: Record<string, DocumentData[]> = {};

    // Fetch from all sources in parallel
    const [notionDocs, githubDocs, secDocs] = await Promise.all([
      notionDatabaseId ? this.fetchNotionDocuments(notionDatabaseId) : Promise.resolve([]),
      githubOwner && githubRepo ? this.fetchGitHubDocuments(githubOwner, githubRepo) : Promise.resolve([]),
      this.fetchSECFilings(companyName),
    ]);

    if (notionDocs.length > 0) allDocuments.notion = notionDocs;
    if (githubDocs.length > 0) allDocuments.github = githubDocs;
    if (secDocs.length > 0) allDocuments.sec = secDocs;

    return allDocuments;
  }
}
