# AI Cross-Reference Agent Documentation

## Overview

The AI Cross-Reference Agent is an intelligent system that analyzes and correlates compliance data from multiple sources:

- **Internal Documentation** (Notion, Google Drive)
- **Code Repositories** (GitHub)
- **External Regulatory Databases** (SEC EDGAR, GDPR checklists, CCPA requirements, HIPAA controls, SOC2 requirements)

The agent identifies compliance gaps, inconsistencies, and risks by cross-referencing all these sources.

## Features

### 1. Multi-Source Data Aggregation
- Fetches documents from Notion workspaces
- Analyzes GitHub repository compliance files and commit history
- Retrieves SEC EDGAR filings
- Compiles regulatory requirement checklists

### 2. Intelligent Cross-Reference Analysis
Uses AI (OpenAI GPT-4 via Vercel AI) to:
- Identify inconsistencies between claimed policies and actual implementation
- Find correlations between compliance areas
- Detect risks based on gaps and misalignments
- Generate specific, actionable recommendations

### 3. Regulatory Mapping
Automatically maps compliance requirements to evidence:
- **GDPR**: Data Processing Agreements, Data Subject Rights, Privacy by Design
- **CCPA**: Consumer Rights Notice, Opt-Out mechanisms, Non-Discrimination
- **HIPAA**: Access Controls, Encryption, Business Associate Agreements
- **SOC2**: Security, Availability, Processing Integrity, Confidentiality, Privacy

### 4. Real-Time Progress Streaming
- Live progress updates during analysis
- Server-sent events (SSE) for real-time UI updates
- Detailed step-by-step tracking

### 5. Risk Scoring
Calculates combined risk scores based on:
- Severity of inconsistencies
- Number and severity of identified risks
- Confidence level of analysis

## Architecture

### Core Components

```
lib/agent/
├── types.ts                          # TypeScript interfaces
├── data-fetcher.ts                   # Fetches data from all sources
├── cross-reference-analyzer.ts       # AI-powered analysis
└── orchestrator.ts                   # Main agent orchestrator

app/api/analysis/
├── cross-reference/route.ts          # Standard API endpoint
├── cross-reference-stream/route.ts   # Streaming endpoint
└── fetch-sources/route.ts            # Data source preview

components/agent/
├── CrossReferencingAgent.tsx         # Main UI component
├── DataSourceViewer.tsx              # Preview data sources
├── AgentIntegrationSetup.tsx         # Integration configuration
└── AIAgentPage.tsx                   # Full-page integration
```

### Data Flow

```
1. User starts analysis
   ↓
2. DataFetcher retrieves documents from all sources
   ↓
3. CrossReferenceAnalyzer processes documents with AI
   ↓
4. Results are enriched with compliance mappings
   ↓
5. Risk scores are calculated
   ↓
6. Results are saved to Supabase
   ↓
7. Audit record is updated with overall risk score
```

## Usage

### 1. Basic Usage (API)

```bash
curl -X POST http://localhost:3000/api/analysis/cross-reference \
  -H "Content-Type: application/json" \
  -d '{
    "auditId": "AUD-001",
    "companyName": "My Company Inc.",
    "notionDatabaseId": "3e12c845d47e47aab5...",
    "githubOwner": "myorg",
    "githubRepo": "myrepo"
  }'
```

### 2. Streaming Usage (Real-time Progress)

```javascript
const response = await fetch('/api/analysis/cross-reference-stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    auditId: 'AUD-001',
    companyName: 'My Company Inc.',
    notionDatabaseId: '3e12c845d47e47aab5...',
    githubOwner: 'myorg',
    githubRepo: 'myrepo',
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data); // Handle progress updates
    }
  }
}
```

### 3. React Component Usage

```tsx
import { AIAgentPage } from '@/components/agent';

export default function AuditPage() {
  return (
    <AIAgentPage 
      auditId="AUD-001" 
      companyName="My Company Inc." 
    />
  );
}
```

## Configuration

### Environment Variables

```env
# Notion Integration
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=3e12c845d47e47aab5...

# GitHub Integration
GITHUB_TOKEN=ghp_...
GITHUB_REPO_OWNER=myorg
GITHUB_REPO_NAME=myrepo

# AI/Analysis
OPENAI_API_KEY=sk-...

# Database
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## API Response Format

### Cross-Reference Analysis Result

```typescript
{
  id: string;                    // Audit ID
  inconsistencies: [
    {
      type: 'missing_mapping' | 'conflict' | 'gap' | 'mismatch';
      sourceA: DocumentData;
      sourceB: DocumentData;
      description: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      evidence: string;
    }
  ];
  correlations: [
    {
      type: 'compliance_requirement' | 'implementation' | ...;
      sources: DocumentData[];
      description: string;
      status: 'aligned' | 'partially_aligned' | 'misaligned';
      details: string;
    }
  ];
  risks: [
    {
      id: string;
      category: 'legal' | 'security' | 'privacy' | 'operational' | 'financial';
      severity: 'critical' | 'high' | 'medium' | 'low';
      title: string;
      description: string;
      affectedSources: DocumentData[];
      rootCause: string;
      potentialImpact: string;
    }
  ];
  recommendations: [
    {
      id: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      category: string;
      title: string;
      description: string;
      actionItems: string[];
      estimatedEffort: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
      successCriteria: string[];
    }
  ];
  summary: string;
  confidence: number; // 0-100
}
```

## Database Schema

The agent stores findings in the existing database tables:

### findings table
```sql
- audit_id: uuid (links to audits)
- category: enum (legal, security, privacy, etc.)
- severity: enum (critical, high, medium, low, info)
- title: string
- description: text
- recommendation: text
- evidence: text
- status: enum (open, resolved, accepted_risk)
```

## Analysis Algorithm

### 1. Document Collection Phase
- Fetches documents from all configured sources
- Extracts and indexes content
- Identifies document type and metadata

### 2. AI Analysis Phase
- Sends batched documents to GPT-4
- Analyzes for cross-source inconsistencies
- Identifies risk patterns and correlations
- Maps to regulatory requirements

### 3. Enrichment Phase
- Adds affected documents to each risk
- Links recommendations to identified risks
- Calculates combined risk score
- Generates executive summary

### 4. Storage Phase
- Saves individual findings to database
- Updates audit record with overall score
- Creates audit trail of analysis

## Key Analyses Performed

### Inconsistency Detection
- **Missing Mappings**: Documentation exists in one source but not verified in others
- **Conflicts**: Different versions of same requirement across sources
- **Gaps**: Regulatory requirements with no evidence of implementation
- **Mismatches**: Claims vs. actual implementation differences

### Risk Identification
- **Legal**: Contract/regulation violations, missing agreements
- **Security**: Code vulnerabilities, weak policies, access control gaps
- **Privacy**: Data handling inconsistencies, GDPR/CCPA violations
- **Operational**: Process gaps, documentation issues
- **Financial**: License compliance risks, liability exposure

### Correlation Analysis
- Compliance requirement → Implementation evidence
- Testing coverage of security measures
- Monitoring and incident response capabilities
- Policy alignment with code practices

## Regulatory Checklists

### GDPR (General Data Protection Regulation)
- Data Processing Agreement (DPA) requirements
- Data Subject Rights implementation (access, rectification, erasure, portability)
- Privacy by Design principles
- Breach notification procedures (72-hour requirement)
- Data retention policies
- Consent management mechanisms

### CCPA (California Consumer Privacy Act)
- Consumer Rights Notice on collection
- Right to Know implementation
- Right to Delete capabilities
- Opt-Out of Sale mechanisms
- Non-Discrimination safeguards

### HIPAA (Health Insurance Portability and Accountability Act)
- Access Controls and authentication
- Encryption requirements (at rest and in transit)
- Audit controls and logging
- Business Associate Agreements
- Minimum necessary access

### SOC2 (Service Organization Control)
- Security: Protection against unauthorized access
- Availability: System uptime commitments
- Processing Integrity: Complete, accurate, timely processing
- Confidentiality: Designated information protection
- Privacy: Personal information handling per notice

## Troubleshooting

### Common Issues

**1. No Notion documents found**
- Verify API key is correct
- Check database ID format
- Ensure Notion integration has database access
- Test with curl: `curl -H "Authorization: Bearer {token}" https://api.notion.com/v1/databases/{db_id}/query`

**2. GitHub repository not fetching**
- Verify token has repo read permissions
- Check owner/repo names are correct
- Ensure repository is accessible from API
- Test with: `curl -H "Authorization: token {token}" https://api.github.com/repos/{owner}/{repo}`

**3. SEC filings not retrieved**
- Verify company name matches SEC database format
- Try full legal name vs. trading name
- Check if company is publicly traded (private companies not in EDGAR)

**4. AI analysis fails**
- Check OpenAI API key is valid
- Verify rate limits aren't exceeded
- Ensure documents aren't too large (>100KB per document)
- Check token usage in OpenAI dashboard

**5. Results not saving to database**
- Verify Supabase connection credentials
- Check database migrations have been applied
- Ensure service role key is being used (not anon key)
- Check audit_id exists before saving findings

## Performance Optimization

### Caching
- Document cache: 30 minutes
- Regulatory checklist cache: 1 hour
- Analysis results cache: Until next audit run

### Streaming
- Use `/cross-reference-stream` endpoint for real-time progress
- Clients get updates every 500ms
- Reduces perceived latency

### Parallel Processing
- Fetches from all data sources in parallel
- Analysis happens in single batch to AI
- Database writes use batch operations

## Security Considerations

1. **API Key Storage**
   - Never commit `.env.local` to Git
   - Rotate keys regularly
   - Use separate keys per environment (dev, staging, prod)

2. **Data Privacy**
   - Enable Supabase Row Level Security (RLS)
   - Audit findings accessible only to authorized users
   - Sensitive content flagged and handled separately

3. **Integration Security**
   - GitHub tokens should have minimal required permissions
   - Notion API tokens limited to specific workspaces
   - Validate all external API responses

## Future Enhancements

1. **Machine Learning**
   - Pattern recognition for compliance violations
   - Predictive risk scoring
   - Anomaly detection in compliance data

2. **Integrations**
   - Google Drive/Workspace integration
   - Jira for issue tracking
   - Slack notifications for critical findings

3. **Advanced Analysis**
   - Timeline analysis of compliance evolution
   - Benchmarking against industry standards
   - Automated remediation tracking

4. **Reporting**
   - Customizable report templates
   - Executive dashboards
   - Trend analysis over time

## Support

For issues or questions:
1. Check troubleshooting section
2. Review logs in `/var/log/agent/` (production)
3. Check browser console for frontend errors
4. Open issue with:
   - Error message and stack trace
   - Environment details (Node version, OS)
   - Steps to reproduce
   - Sample audit ID for debugging
