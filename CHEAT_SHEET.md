# M&A Due Diligence Agent - Cheat Sheet

Quick reference for commands, endpoints, and features.

## Commands

```bash
# Install & Setup
pnpm install                    # Install dependencies
bash INITIALIZE.sh              # Auto-setup everything

# Development
pnpm dev                        # Start dev server (http://localhost:3000)
pnpm dev -- -p 3001           # Use different port
pnpm tsc --noEmit             # Type check

# Building & Deploying
pnpm build                      # Build for production
pnpm start                      # Start prod server
vercel deploy                   # Deploy to Vercel
vercel deploy --prod           # Deploy to production

# Testing
pnpm test                       # Run tests
pnpm test:e2e                  # Run E2E tests

# Database
pnpm db:reset                  # Reset database
pnpm db:migrate                # Run migrations
```

## Environment Variables

```env
# REQUIRED
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# OPTIONAL
CORAL_AI_API_KEY=sk-coral-xxx
NOTION_INTEGRATION_TOKEN=secret_xxx
GITHUB_API_TOKEN=ghp_xxx
SEC_EDGAR_API_KEY=xxx
```

## API Endpoints

### Audits
```
GET    /api/audits                        # List all
POST   /api/audits/create                 # Create new
GET    /api/audits/:id                    # Get details
GET    /api/audits/:id/findings           # Get findings
```

### Analysis
```
POST   /api/analysis/analyze              # Generic analysis
POST   /api/analysis/comprehensive        # Run all analyzers
POST   /api/analysis/license-scan         # License check
POST   /api/analysis/security-audit       # Security scan
POST   /api/analysis/privacy-map          # Privacy check
POST   /api/analysis/regulatory           # Regulatory check
```

### Documents
```
POST   /api/documents/upload              # Upload
GET    /api/documents/:id                 # Get
DELETE /api/documents/:id                 # Delete
```

## Pages & Routes

```
/                              # Main dashboard
/audits                        # Audit list
/audits/[id]                   # Audit details
/audits/[id]/findings          # Findings detail
```

## Components

```
DashboardLayout               # Main wrapper
RiskHeatmap                   # 5x5 matrix
ComplianceScorecard          # Score display
FindingsList                 # Findings list
QuickStats                   # Stats cards
AuditCreationModal           # New audit form
```

## Analyzers

```
License Scanner              # GPL/AGPL/SSPL detection
Security Audit              # Vulnerabilities + secrets
Privacy Mapper              # GDPR/CCPA/HIPAA
Regulatory Checker          # SEC/SOX/FINRA
Risk Heatmap                # 5×5 matrix calc
Coral.ai Integration        # AI reasoning
```

## Database Tables

```
audits                       # Audit records
documents                    # Uploaded files
findings                     # Compliance findings
license_scan_results        # License analysis
security_audit_results      # Security findings
privacy_mappings            # Privacy compliance
risk_assessments            # Risk heatmap data
```

## File Structure

```
/app                    Pages & API
/components            UI components
/lib                   Utilities & analyzers
/lib/analyzers         Analysis engines
/sql                   Database schema
/public                Static assets
README.md              Full documentation
SETUP.md               Setup guide
QUICKSTART.md          Quick reference
START_HERE.md          Navigation guide
```

## Common Tasks

### Create Audit
```typescript
POST /api/audits/create
{
  "companyName": "MyCompany Inc.",
  "auditType": "Legal,Security",
  "status": "in-progress"
}
```

### Run Analysis
```typescript
POST /api/analysis/comprehensive
{
  "auditId": "AUD-001",
  "documentContent": "...",
  "documentType": "privacy_policy",
  "analysisTypes": ["compliance", "privacy", "security"]
}
```

### Get Findings
```typescript
GET /api/audits/AUD-001/findings
```

## Compliance Frameworks

### GDPR (8 requirements)
- Legal basis documentation
- Privacy notices
- Data subject rights
- DPIA assessments
- Breach notification
- Data protection officer
- International transfers
- Consent management

### CCPA (Consumer Rights)
- Right to know
- Right to delete
- Right to opt-out
- Right to non-discrimination
- Service provider contracts

### HIPAA (Protected Health)
- PHI safeguards
- Encryption
- Audit logs
- Business associate agreements
- Breach notification

### SEC (Securities)
- Material contract disclosure
- Financial statement audit
- Executive compensation
- Internal controls
- IT governance

### SOX (Sarbanes-Oxley)
- Section 302 (CEO/CFO cert)
- Section 404 (internal control)
- Auditor independence
- Ethics codes

### FINRA (Financial Industry)
- Anti-money laundering (AML)
- Know your customer (KYC)
- Suitability rules
- Record keeping

## Risk Scoring

```
0-10:   Blue (Low Risk)
11-40:  Yellow (Medium Risk)
41-70:  Orange (High Risk)
71-100: Red (Critical Risk)
```

## Compliance Scoring

```
90-100%:  Strong compliance
70-89%:   Acceptable with gaps
50-69%:   Significant gaps
<50%:     Critical gaps
```

## Severity Levels

```
CRITICAL   Red      Immediate action required
HIGH       Orange   Address within 30 days
MEDIUM     Yellow   Address within 90 days
LOW        Green    Address within 1 year
INFO       Blue     Informational only
```

## Export Formats

```
PDF       Executive summary + findings
CSV       Detailed data for analysis
JSON      API integration format
```

## Keyboard Shortcuts

```
Ctrl+K     Open command palette
Ctrl+/     Toggle help
Escape     Close modals
Enter      Submit forms
Tab        Navigate focus
```

## Troubleshooting Quick Ref

| Issue | Quick Fix |
|-------|-----------|
| Dependencies fail | `rm -rf node_modules && pnpm install` |
| Port 3000 used | `pnpm dev -- -p 3001` |
| DB connection error | Check `.env.local` variables |
| Build fails | `rm -rf .next && pnpm build` |
| Type errors | `pnpm tsc --noEmit` |
| Stale data | Refresh browser (Cmd+Shift+R) |

## Performance Tips

```bash
# Fast local dev
pnpm dev                     # With hot reload

# Optimized production build
pnpm build && pnpm start    # Optimized output

# Check bundle size
pnpm build                   # Check .next size
```

## Security Checklist

- [ ] `.env.local` created (not in git)
- [ ] API keys not in code
- [ ] HTTPS in production
- [ ] Database credentials in env vars
- [ ] Input validation enabled
- [ ] CORS configured
- [ ] Rate limiting (if needed)
- [ ] Audit logging enabled

## Deployment Checklist

- [ ] Code committed to git
- [ ] `.env.local` configured
- [ ] Database migrations run
- [ ] Build succeeds (`pnpm build`)
- [ ] All tests pass
- [ ] No console errors
- [ ] Mobile responsive ✓
- [ ] Accessibility check ✓

## Resources

```
Start:        START_HERE.md
Setup:        SETUP.md
Quick Ref:    QUICKSTART.md
Full Docs:    README.md
Summary:      PROJECT_SUMMARY.md
Complete:     IMPLEMENTATION_COMPLETE.md
Cheat Sheet:  CHEAT_SHEET.md (this file)
```

## Tech Stack

```
Frontend:   Next.js 15, React 19, TypeScript
Styling:    Tailwind CSS 4, shadcn/ui
Backend:    Next.js API Routes
Database:   Supabase (PostgreSQL)
AI:         Vercel AI SDK (Coral.ai)
Export:     jsPDF, CSV Writer
```

## Sample Data IDs

```
AUD-001     TechCorp Inc. (High Risk, 72%)
AUD-002     DataStream Analytics (Med Risk, 45%)
AUD-003     CloudFirst Solutions (Low Risk, 18%)
```

## Status Codes

```
200 OK               Success
201 Created         Resource created
400 Bad Request     Invalid input
401 Unauthorized    Auth required
403 Forbidden       Access denied
404 Not Found       Not found
500 Server Error    Server error
```

## Features by Compliance Need

**Need GDPR compliance?**
→ Run Privacy Mapper with GDPR framework

**Need license check?**
→ Run License Scanner with package.json

**Need security audit?**
→ Run Security Audit with codebase

**Need regulatory tracking?**
→ Run Regulatory Checker with SEC/SOX

**Need risk overview?**
→ View Risk Heatmap dashboard

**Need executive report?**
→ Export PDF from audit details

## Most Used Paths

```
/lib/analyzers/         Modify analyzers
/components/dashboard/  Modify UI widgets
/app/api/              Modify endpoints
/app/page.tsx          Modify dashboard
/lib/types.ts          Check types
/sql/001_*.sql         Database schema
.env.local             Configuration
```

## API Response Format

```json
{
  "success": true,
  "data": {
    "id": "AUD-001",
    "findings": [...],
    "score": 72,
    "risks": [...]
  },
  "timestamp": "2026-05-21T..."
}
```

## Finding Structure

```typescript
{
  title: string,           // Finding title
  description: string,     // Detailed description
  category: string,        // Legal/Security/Privacy/etc
  severity: string,        // critical/high/medium/low
  remediation: string,     // How to fix
  evidence: string,        // Supporting evidence
  riskScore: number        // 0-100 score
}
```

---

**Quick Navigation:**
- Need to setup? → `/SETUP.md`
- Need to run it? → `/QUICKSTART.md`
- Need full docs? → `/README.md`
- Need to understand? → `/PROJECT_SUMMARY.md`
- Stuck? → `/SETUP.md` (Troubleshooting)

**Time to production: 15-20 minutes**

Good luck! 🚀
