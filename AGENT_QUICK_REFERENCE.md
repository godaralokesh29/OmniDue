# Quick Reference: AI Cross-Reference Agent

## What It Does
The AI agent analyzes your company's:
- Internal docs (Notion)
- Code repos (GitHub)  
- Regulatory info (SEC)

And finds compliance gaps, risks, and inconsistencies.

## Quick Setup (5 minutes)

1. **Set API Keys** (in `.env.local`)
   ```
   NOTION_API_KEY=ntn_...
   GITHUB_TOKEN=ghp_...
   OPENAI_API_KEY=sk_...
   ```

2. **Run Migration**
   ```bash
   npm run db:migrate
   ```

3. **Start Agent**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/api/analysis/cross-reference-stream
   ```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run db:migrate` | Apply migrations |

## API Endpoints

### Trigger Analysis
```bash
POST /api/analysis/cross-reference
```
Quick analysis, returns complete results

### Stream Progress
```bash
POST /api/analysis/cross-reference-stream  
```
Real-time updates, good for UI

### Preview Sources
```bash
POST /api/analysis/fetch-sources
```
See what data will be analyzed

## Usage in React

```tsx
import { AIAgentPage } from '@/components/agent'

<AIAgentPage auditId="AUD-001" companyName="My Company" />
```

## Programmatic Usage

```ts
import { AIAuditAgent } from '@/lib/agent'

const agent = new AIAuditAgent()
const result = await agent.runFullAudit({
  auditId: 'AUD-001',
  companyName: 'My Company',
  notionDatabaseId: '3e12...',
  githubOwner: 'myorg',
  githubRepo: 'myrepo'
})

console.log(`Found ${result.risks.length} risks`)
console.log(`Confidence: ${result.confidence}%`)
```

## Analysis Results Include

- **Risks** - Compliance violations, security issues, privacy gaps
- **Inconsistencies** - Gaps between docs and implementation
- **Correlations** - Aligned and misaligned areas
- **Recommendations** - Specific action items to fix issues
- **Summary** - Executive overview
- **Confidence** - How confident is the analysis (0-100%)

## Supported Regulations

- ✅ GDPR (Europe)
- ✅ CCPA (California)
- ✅ HIPAA (Healthcare)
- ✅ SOC2 (Cloud services)

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk_...
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional (leave empty if not needed)
NOTION_API_KEY=ntn_...
GITHUB_TOKEN=ghp_...
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing API key" | Check `.env.local` has all keys |
| "No documents found" | Verify Notion DB ID or GitHub repo name |
| "Analysis timeout" | Try smaller document set |
| "OpenAI error" | Check API key, rate limits, account active |

## Files Structure

```
lib/agent/
  ├── types.ts              # Type definitions
  ├── data-fetcher.ts       # Fetch from sources
  ├── cross-reference-analyzer.ts # AI analysis
  └── orchestrator.ts       # Main orchestrator

app/api/analysis/
  ├── cross-reference/      # Standard endpoint
  ├── cross-reference-stream/   # Streaming endpoint
  └── fetch-sources/        # Data preview

components/agent/
  ├── CrossReferencingAgent.tsx    # Main UI
  ├── DataSourceViewer.tsx         # Data preview
  ├── AgentIntegrationSetup.tsx    # Config
  └── AIAgentPage.tsx              # Full page
```

## Data Sources

| Source | What It Fetches |
|--------|-----------------|
| Notion | Policy docs, compliance checklists, procedures |
| GitHub | README, SECURITY.md, commit history, code patterns |
| SEC | Public company filings, regulatory info |
| Built-in | GDPR, CCPA, HIPAA, SOC2 requirements |

## Performance

- Small audit: ~30-45 seconds
- Medium audit: ~45-90 seconds
- Large audit: ~90-180 seconds

## Integration Points

### Option 1: Add to Audit Page
```tsx
import { AIAgentPage } from '@/components/agent'
// Add as a tab or section in your audit detail page
```

### Option 2: Standalone Page
```tsx
// Create: app/agent/page.tsx
import { AIAgentPage } from '@/components/agent'
export default function AgentPage() {
  return <AIAgentPage auditId="new" companyName="Company" />
}
```

### Option 3: Programmatically  
```ts
// In API route or server action
const result = await agent.runFullAudit(config)
```

## Get Help

- **Full docs**: See `docs/AI_AGENT.md`
- **Setup guide**: See `docs/AGENT_SETUP.md`
- **Examples**: See `lib/agent/examples.ts`
- **Tests**: See `__tests__/agent.test.ts`

---

**Need more info? Check the full documentation files!**
