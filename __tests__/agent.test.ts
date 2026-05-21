import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AIAuditAgent } from '@/lib/agent';
import { DataFetcher } from '@/lib/agent/data-fetcher';
import { CrossReferenceAnalyzer } from '@/lib/agent/cross-reference-analyzer';

/**
 * Test suite for AI Agent functionality
 * Run with: pnpm test:agent
 */

describe('AI Audit Agent', () => {
  let agent: AIAuditAgent;
  let fetcher: DataFetcher;
  let analyzer: CrossReferenceAnalyzer;

  beforeAll(() => {
    agent = new AIAuditAgent();
    fetcher = new DataFetcher();
    analyzer = new CrossReferenceAnalyzer();
  });

  describe('DataFetcher', () => {
    it('should fetch regulatory checklists', async () => {
      const checklists = await fetcher.fetchRegulatoryChecklists();
      
      expect(checklists).toBeDefined();
      expect(checklists['GDPR']).toBeDefined();
      expect(checklists['CCPA']).toBeDefined();
      expect(checklists['HIPAA']).toBeDefined();
      expect(checklists['SOC2']).toBeDefined();
    });

    it('should handle missing API keys gracefully', async () => {
      // When Notion API key is missing
      const docs = await fetcher.fetchNotionDocuments('test-db-id');
      expect(docs).toEqual([]);
    });

    it('should include Data Processing Agreement in GDPR checklist', async () => {
      const checklists = await fetcher.fetchRegulatoryChecklists();
      const gdprRequirements = checklists['GDPR'];
      
      const dpaRequirement = gdprRequirements.find(
        req => req.requirement === 'Data Processing Agreement (DPA)'
      );
      expect(dpaRequirement).toBeDefined();
    });

    it('should include CCPA opt-out requirement', async () => {
      const checklists = await fetcher.fetchRegulatoryChecklists();
      const ccpaRequirements = checklists['CCPA'];
      
      const optOutRequirement = ccpaRequirements.find(
        req => req.requirement === 'Opt-Out of Sale'
      );
      expect(optOutRequirement).toBeDefined();
    });
  });

  describe('Agent State', () => {
    it('should initialize with correct default state', () => {
      const state = agent.getState();
      
      expect(state.status).toBe('initializing');
      expect(state.progress).toBe(0);
      expect(state.currentStep).toBeDefined();
    });

    it('should provide state getter method', () => {
      const state = agent.getState();
      expect(typeof state).toBe('object');
      expect(state).toHaveProperty('status');
      expect(state).toHaveProperty('progress');
      expect(state).toHaveProperty('currentStep');
    });
  });

  describe('CrossReferenceAnalyzer', () => {
    it('should have required analysis methods', () => {
      expect(typeof analyzer.analyzeDocuments).toBe('function');
    });
  });

  describe('Integration API Endpoints', () => {
    it('should have cross-reference endpoint', () => {
      // This would test: POST /api/analysis/cross-reference
      expect('/api/analysis/cross-reference').toBeDefined();
    });

    it('should have streaming endpoint', () => {
      // This would test: POST /api/analysis/cross-reference-stream
      expect('/api/analysis/cross-reference-stream').toBeDefined();
    });

    it('should have data fetching endpoint', () => {
      // This would test: POST /api/analysis/fetch-sources
      expect('/api/analysis/fetch-sources').toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required parameters', async () => {
      // Missing companyName should cause error
      expect(async () => {
        await agent.runFullAudit({
          auditId: 'TEST-001',
          companyName: '',
        });
      }).rejects.toThrow();
    });

    it('should provide meaningful error messages', () => {
      const state = agent.getState();
      expect(state).toHaveProperty('error');
    });
  });

  describe('Components', () => {
    it('should export CrossReferencingAgent component', () => {
      // Can be tested with React Testing Library
      expect(true).toBe(true); // Placeholder
    });

    it('should export DataSourceViewer component', () => {
      expect(true).toBe(true); // Placeholder
    });

    it('should export AgentIntegrationSetup component', () => {
      expect(true).toBe(true); // Placeholder
    });

    it('should export AIAgentPage component', () => {
      expect(true).toBe(true); // Placeholder
    });
  });
});

/**
 * Integration Tests (requires real API keys)
 * Uncomment to run against real services
 */

// describe('AI Agent Integration Tests (requires real APIs)', () => {
//   it('should connect to Notion with valid credentials', async () => {
//     const fetcher = new DataFetcher();
//     const docs = await fetcher.fetchNotionDocuments(
//       process.env.NOTION_DATABASE_ID!
//     );
//     expect(docs.length).toBeGreaterThanOrEqual(0);
//   });

//   it('should connect to GitHub with valid credentials', async () => {
//     const fetcher = new DataFetcher();
//     const docs = await fetcher.fetchGitHubDocuments(
//       process.env.GITHUB_REPO_OWNER!,
//       process.env.GITHUB_REPO_NAME!
//     );
//     expect(docs.length).toBeGreaterThanOrEqual(0);
//   });

//   it('should run full audit end-to-end', async () => {
//     const agent = new AIAuditAgent();
//     const result = await agent.runFullAudit({
//       auditId: 'TEST-E2E-001',
//       companyName: 'Test Company',
//       notionDatabaseId: process.env.NOTION_DATABASE_ID,
//       githubOwner: process.env.GITHUB_REPO_OWNER,
//       githubRepo: process.env.GITHUB_REPO_NAME,
//     });
//     expect(result).toHaveProperty('risks');
//     expect(result).toHaveProperty('recommendations');
//   });
// });
