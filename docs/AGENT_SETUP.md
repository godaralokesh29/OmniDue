# AI Agent Setup Guide

## Quick Start

This guide walks you through setting up the AI Cross-Reference Agent for your M&A Due Diligence application.

## 1. Prerequisites

### Installed Dependencies
The following packages are required (already in package.json):
```json
{
  "ai": "^6.0.188",
  "axios": "^1.16.1",
  "@supabase/supabase-js": "^2.106.1"
}
```

If not installed:
```bash
pnpm add ai axios @supabase/supabase-js
```

### Environment Setup
Create/update `.env.local`:

```env
# Notion Integration
NOTION_API_KEY=ntn_your_api_key_here

# GitHub Integration  
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=your_org
GITHUB_REPO_NAME=your_repo

# AI Model (OpenAI via Vercel AI)
OPENAI_API_KEY=sk_your_key_here

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SEC Edgar (optional - uses public API)
SEC_EDGAR_API_BASE=https://www.sec.gov/cgi-bin/browse-edgar
```

## 2. Get API Keys

### Notion
1. Go to https://www.notion.com/my-integrations
2. Click "Create new integration"
3. Name it "M&A Due Diligence Agent"
4. Copy the API key → `NOTION_API_KEY`
5. In your Notion workspace, create a database or find an existing one
6. Open it and copy the database ID from the URL (format: `3e12c845d47e47aab5e...)` → `NOTION_DATABASE_ID`
7. Share the database with your integration

### GitHub
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "M&A Agent"
4. Permissions: 
   - `repo` (full control of private repos)
   - `read:org` (read org data)
5. Copy token → `GITHUB_TOKEN`

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy → `OPENAI_API_KEY`
4. Note: GPT-4 access required (may need paid account)

### Supabase
Already configured from main setup - use existing keys from `.env.local`

## 3. Database Migrations

Apply the agent tracking migration:

```bash
# Option 1: Using Supabase CLI
supabase migration up

# Option 2: Manual SQL in Supabase Dashboard
# Copy contents of sql/002_agent_tracking.sql
# Go to Supabase Dashboard → SQL Editor
# Run the SQL
```

## 4. Integration Points

### Option A: Add to Existing Audit Page

Edit your audit detail page (`app/audits/[auditId]/page.tsx`):

```tsx
'use client'

import { AIAgentPage } from '@/components/agent'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AuditDetailPage({ params }: { params: { auditId: string } }) {
  const auditId = params.auditId
  const companyName = 'Company Name' // Fetch from database

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="ai-agent">AI Agent Analysis</TabsTrigger>
        <TabsTrigger value="findings">Findings</TabsTrigger>
      </TabsList>

      <TabsContent value="ai-agent">
        <AIAgentPage auditId={auditId} companyName={companyName} />
      </TabsContent>

      {/* Other tabs... */}
    </Tabs>
  )
}
```

### Option B: Standalone Agent Page

Create a new page at `app/agent/page.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { AIAgentPage } from '@/components/agent'

export default function AgentPage() {
  return (
    <AIAgentPage 
      auditId="new-audit"
      companyName="New Company"
    />
  )
}
```

### Option C: Programmatic Usage

In a server action or API route:

```ts
import { AIAuditAgent } from '@/lib/agent'

export async function analyzeCompany(companyName: string, auditId: string) {
  const agent = new AIAuditAgent()
  
  const result = await agent.runFullAudit({
    auditId,
    companyName,
    notionDatabaseId: process.env.NOTION_DATABASE_ID,
    githubOwner: process.env.GITHUB_REPO_OWNER,
    githubRepo: process.env.GITHUB_REPO_NAME,
  })

  return result
}
```

## 5. Testing

### Test 1: API Connectivity

```bash
# Test Notion
curl -H "Authorization: Bearer $NOTION_API_KEY" \
  https://api.notion.com/v1/databases/$NOTION_DATABASE_ID/query -X POST

# Test GitHub
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$GITHUB_REPO_OWNER/$GITHUB_REPO_NAME

# Test OpenAI
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Test 2: Agent API

```bash
curl -X POST http://localhost:3000/api/analysis/cross-reference \
  -H "Content-Type: application/json" \
  -d '{
    "auditId": "TEST-001",
    "companyName": "Test Company",
    "notionDatabaseId": "your-db-id",
    "githubOwner": "your-owner",
    "githubRepo": "your-repo"
  }' | jq .
```

### Test 3: Streaming Endpoint

```bash
curl -X POST http://localhost:3000/api/analysis/cross-reference-stream \
  -H "Content-Type: application/json" \
  -d '{
    "auditId": "TEST-002",
    "companyName": "Test Company",
    "notionDatabaseId": "your-db-id",
    "githubOwner": "your-owner",
    "githubRepo": "your-repo"
  }' | head -20
```

### Test 4: UI Component

```tsx
// In your test page
import { CrossReferencingAgent } from '@/components/agent'

export default function TestPage() {
  return (
    <CrossReferencingAgent
      auditId="TEST-003"
      companyName="Test Company"
      notionDatabaseId="your-db-id"
      githubOwner="your-owner"
      githubRepo="your-repo"
    />
  )
}
```

## 6. Troubleshooting

### Issue: "Missing required fields"
- Ensure `auditId` and `companyName` are provided
- Check all environment variables are set correctly

### Issue: "Failed to fetch Notion documents"
- Verify `NOTION_API_KEY` is correct
- Verify `NOTION_DATABASE_ID` format
- Ensure database is shared with integration

### Issue: "Failed to fetch GitHub documents"
- Verify `GITHUB_TOKEN` has correct permissions
- Verify `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are exact
- Check repository is accessible to token

### Issue: "OpenAI API key invalid"
- Verify key is for correct organization/account
- Check if key has been deactivated
- Verify rate limits aren't exceeded

### Issue: "Analysis times out"
- May occur with large documents
- Try with smaller subset first
- Check API rate limits
- Increase timeout in production deployment

## 7. Performance Considerations

### Optimization Tips

1. **Batch Multiple Analyses**
   ```ts
   const results = await Promise.all([
     agent.runFullAudit(config1),
     agent.runFullAudit(config2),
   ])
   ```

2. **Cache Regulatory Checklists**
   ```ts
   const fetcher = new DataFetcher()
   const checklists = await fetcher.fetchRegulatoryChecklists()
   // Reuse checklists for multiple audits
   ```

3. **Use Streaming for Large Audits**
   - Use `/cross-reference-stream` endpoint for real-time updates
   - Provides user feedback during long analyses

4. **Parallel Data Fetching**
   - Agent automatically fetches from all sources in parallel
   - Completes ~2-3x faster than sequential fetching

### Performance Benchmarks

- Small audit (< 10 documents): 30-45 seconds
- Medium audit (10-50 documents): 45-90 seconds
- Large audit (50+ documents): 90-180 seconds

## 8. Monitoring & Logging

### View Logs

```bash
# Development
pnpm dev  # Logs appear in terminal

# Check specific audit
curl http://localhost:3000/api/audits/AUD-001

# Browser console
# F12 → Console tab
```

### Debug Mode

Add to `.env.local`:
```env
DEBUG=agent:*
```

### Monitor API Usage

```ts
// In orchestrator.ts - add logging
console.log(`[Agent] Starting analysis for ${config.companyName}`)
console.log(`[Agent] Found ${documents.notion?.length || 0} Notion docs`)
console.log(`[Agent] Found ${documents.github?.length || 0} GitHub docs`)
console.log(`[Agent] Analysis completed with confidence: ${result.confidence}%`)
```

## 9. Production Deployment

### Vercel Deployment

1. Add environment variables to Vercel dashboard
2. Ensure `OPENAI_API_KEY` is set
3. Increase function timeout:

```ts
// In route handler
export const maxDuration = 60 // 60 seconds
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"]
```

### Environment Variables for Production

- Use secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate API keys regularly
- Use separate service accounts for each integration
- Enable audit logging

## 10. Next Steps

1. **Customize Regulatory Checklists**
   - Edit `lib/agent/data-fetcher.ts` → `fetchRegulatoryChecklists()`
   - Add your company's specific requirements

2. **Integrate with Audit Creation**
   - Trigger agent automatically when audit is created
   - Show progress in audit detail page

3. **Add Custom Analyzers**
   - Extend `CrossReferenceAnalyzer` for industry-specific rules
   - Add additional data sources (Google Drive, Jira, etc.)

4. **Build Dashboards**
   - Create executive summary dashboard
   - Add trend analysis over time
   - Build remediation tracking board

## Support & Resources

- **Documentation**: See [AI_AGENT.md](./AI_AGENT.md)
- **Examples**: See [lib/agent/examples.ts](../lib/agent/examples.ts)
- **API Reference**: See [docs/API.md](./API.md)
- **Troubleshooting**: See [docs/TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
