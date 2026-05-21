# M&A Legal Due Diligence Agent

An AI-powered platform for automated compliance analysis, risk assessment, and legal due diligence during mergers and acquisitions. Features include Risk Heatmap, License Scanner, Security Audit, Data Privacy Mapper, and Regulatory Compliance Checker.

## Overview

This application provides comprehensive due diligence capabilities for M&A teams:

- **Risk Heatmap**: Visual matrix of compliance risks across categories (Legal, Security, Privacy, Compliance, Data Protection) and dimensions
- **License Scanner**: Detect GPL violations, open-source license conflicts, and compliance issues
- **Security Audit**: Identify code vulnerabilities, exposed secrets, weak cryptography, and authentication issues
- **Data Privacy Mapper**: GDPR, CCPA, and HIPAA compliance assessment with gap analysis
- **Regulatory Checker**: SEC, SOX, FINRA compliance deadlines and requirements tracking
- **Compliance Scorecard**: Real-time scoring, trend analysis, and historical comparisons
- **Report Generator**: Export findings as PDF, CSV, or JSON with customizable details

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **AI/Analysis**: Coral.ai API for intelligent compliance analysis
- **Integrations**: Notion, GitHub, SEC EDGAR, regulatory databases (simulated in demo)
- **Data Export**: jsPDF for PDF generation, CSV export

## Prerequisites

- Node.js 18.0+ 
- pnpm (package manager)
- Supabase account (for database)
- Coral.ai API key (for AI analysis)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install all dependencies
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Coral.ai API Configuration
CORAL_AI_API_KEY=your_coral_ai_api_key
CORAL_AI_API_BASE=https://api.coral.ai

# Optional: Third-party integrations
NOTION_INTEGRATION_TOKEN=your_notion_token
GITHUB_API_TOKEN=your_github_token
SEC_EDGAR_API_KEY=your_sec_api_key
```

### 3. Database Setup (Supabase)

Run the SQL migrations to set up the database schema:

```bash
# Connect to your Supabase project and run:
# Copy contents of sql/001_initial_schema.sql and execute in Supabase SQL Editor
```

The schema includes tables for:
- `audits` - M&A audit records
- `documents` - Uploaded policies, contracts, code repositories
- `findings` - Compliance findings with severity and remediation
- `license_scan_results` - License analysis results
- `security_audit_results` - Security scan findings
- `privacy_mappings` - Privacy compliance status
- `risk_assessments` - Risk heatmap data

### 4. Start Development Server

```bash
# Run development server
pnpm dev

# Server will start at http://localhost:3000
```

The app uses sample/demo data by default. To connect real data:

1. Update API endpoints in `/app/api/` to query Supabase
2. Configure integrations in Settings
3. Upload documents for analysis

## Project Structure

```
/app
  /api              # REST API endpoints
    /analysis      # AI-powered compliance analysis
    /audits        # Audit CRUD operations
    /documents     # Document management
  /audits          # Audit pages
  page.tsx         # Main dashboard

/components
  /dashboard       # Dashboard widgets (RiskHeatmap, Scorecard, etc)
  /layout          # DashboardLayout component
  /modals          # AuditCreationModal
  /ui              # shadcn/ui components

/lib
  /analyzers       # Core analysis modules
    /coral-ai.ts              # AI integration for intelligent analysis
    /risk-heatmap.ts          # Risk matrix calculation
    /license-scanner.ts       # Open-source license detection
    /security-audit.ts        # Code security scanning
    /privacy-mapper.ts        # Privacy compliance mapping
    /regulatory-checker.ts    # Regulatory requirement tracking
  types.ts         # TypeScript interfaces
  supabase.ts      # Supabase client setup
  report-generator.ts  # PDF/CSV report export
  sample-data.ts   # Demo data

/sql
  001_initial_schema.sql  # Database migrations

/public
  assets and images
```

## Core Features

### 1. Risk Heatmap

Visualizes compliance risk across a matrix:

```typescript
// Categories: Legal, Security, Privacy, Compliance, Data Protection
// Dimensions: Documentation, Implementation, Testing, Monitoring, Response
// Risk levels: 0-10 (red/orange/yellow/blue based on severity)
```

Access via: Dashboard → Risk Heatmap tab or `/audits/:id`

### 2. License Scanner

Detects open-source license compliance issues:

- **Input**: package.json or dependencies list
- **Output**: License conflicts, copyleft violations, remediation recommendations
- **Scan Patterns**: GPL-2.0/3.0, AGPL, SSPL, LGPL, and permissive licenses

```typescript
// Example: GPL-licensed dependency detected
// Risk: "Product requires open-source compliance"
// Remediation: "Replace with MIT/Apache-2.0 alternative or open-source product"
```

### 3. Security Audit

Scans code for:

- Exposed secrets (AWS keys, API credentials, database passwords)
- Vulnerable patterns (eval(), XSS vulnerabilities, SQL injection risks)
- Weak cryptography (MD5, SHA-1, Math.random())
- Authentication issues (hardcoded credentials, plaintext passwords)

```typescript
// Pattern: /AWS_SECRET_ACCESS_KEY\s*=\s*['"][^'"]+['"]/gi
// Severity: CRITICAL
// Remediation: Use environment variables or secret management service
```

### 4. Data Privacy Mapper

GDPR, CCPA, HIPAA compliance assessment:

- **GDPR**: Legal basis, privacy notices, data subject rights, DPIAs, breach notification
- **CCPA**: Consumer rights, opt-out mechanisms, service provider agreements
- **HIPAA**: PHI identification, encryption, audit logs, BAAs

Generates compliance gap analysis with remediation roadmap.

### 5. Regulatory Checker

Tracks regulatory requirements and deadlines:

- **SEC**: Material contracts, financial audits, executive comp disclosure
- **SOX**: Internal controls, IT governance
- **FINRA**: AML compliance, KYC procedures

Alerts for critical deadlines (< 30 days).

### 6. Coral.ai Integration

Intelligent analysis and recommendations:

```typescript
// Query: "Analyze this privacy policy for GDPR gaps"
// Response: AI-generated assessment with specific findings and remediation steps
```

## API Endpoints

### Audits

```bash
GET    /api/audits                 # List all audits
POST   /api/audits/create          # Create new audit
GET    /api/audits/:auditId        # Get audit details
GET    /api/audits/:auditId/findings  # Get findings for audit
```

### Analysis

```bash
POST   /api/analysis/analyze       # Run AI analysis on documents
POST   /api/analysis/license-scan  # Scan dependencies
POST   /api/analysis/security-audit # Security scanning
POST   /api/analysis/privacy-map   # Privacy compliance check
POST   /api/analysis/regulatory    # Regulatory requirement check
```

### Documents

```bash
POST   /api/documents/upload       # Upload document
GET    /api/documents/:auditId     # List documents
DELETE /api/documents/:docId       # Delete document
```

## Usage Guide

### Running an Audit

1. **Create Audit**
   - Click "New Audit" button
   - Enter company name, audit type (Legal/Security/Privacy/Compliance)
   - Select audit scope and regulations

2. **Upload Documents**
   - Upload privacy policy, GitHub repo, contracts, codebase
   - Add document metadata (document type, sensitivity level)

3. **Run Analysis**
   - Select analysis types: Risk Heatmap, License Scan, Security Audit, Privacy Map, Regulatory Check
   - Choose AI-powered analysis depth (basic/standard/deep)
   - Start audit

4. **Review Results**
   - View Risk Heatmap visualization
   - Review findings by severity
   - Check compliance scores by regulation
   - View remediation recommendations

5. **Export Report**
   - Generate PDF executive summary
   - Export full CSV with all findings
   - Share JSON report with stakeholders

### Interpreting Results

**Risk Heatmap**: 
- Red (7-10): Critical gaps requiring immediate action
- Orange (4-6): High priority gaps to address within 30 days
- Yellow (2-3): Medium priority gaps to address within 90 days
- Blue (0-1): Low risk or fully compliant

**Compliance Score**:
- 90-100%: Strong compliance posture
- 70-89%: Acceptable with minor gaps
- 50-69%: Significant gaps requiring planning
- Below 50%: Critical gaps requiring immediate remediation

## Demo Mode

The application ships with sample data for testing:

```typescript
// lib/sample-data.ts contains:
- 3 sample audits (TechCorp, DataStream, CloudFirst)
- 8 sample findings across Security, Privacy, Compliance
- Sample Risk Heatmap data
- Compliance statistics
```

To use real data:
1. Configure Supabase integration
2. Update API endpoints to query database instead of sample-data.ts
3. Upload real documents and documents

## Configuration

### Tailwind CSS

Design tokens defined in `app/globals.css`:

```css
--background: white
--foreground: black
--primary: blue
--destructive: red
--muted-foreground: gray
```

Customize by editing the `@theme` block.

### API Keys

All API keys should be in `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
CORAL_AI_API_KEY

# Optional - integrations
NOTION_INTEGRATION_TOKEN
GITHUB_API_TOKEN
SEC_EDGAR_API_KEY
```

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub (recommended)
git push origin main

# Or deploy directly
vercel deploy
```

Environment variables should be configured in Vercel project settings.

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Database Schema

### Audits Table

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  company_name VARCHAR(255),
  audit_type TEXT,
  status VARCHAR(50),
  risk_score INTEGER,
  overall_risk VARCHAR(50),
  documents_count INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Findings Table

```sql
CREATE TABLE findings (
  id UUID PRIMARY KEY,
  audit_id UUID REFERENCES audits(id),
  category VARCHAR(100),
  severity VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  remediation TEXT,
  evidence TEXT,
  timestamp TIMESTAMP
);
```

See `sql/001_initial_schema.sql` for complete schema.

## Troubleshooting

### Issue: "Supabase connection failed"

**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly in `.env.local`

### Issue: "Coral.ai API key invalid"

**Solution**: Check `CORAL_AI_API_KEY` in environment variables and verify API key is valid on Coral.ai dashboard

### Issue: Components not rendering

**Solution**: Ensure shadcn/ui components are installed:
```bash
pnpm exec shadcn-ui@latest add badge dialog select checkbox button input textarea
```

### Issue: Build errors

**Solution**: Clear build cache and reinstall:
```bash
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

## Performance Optimization

- Risk Heatmap uses memoized calculations for efficient re-renders
- API responses are cached with SWR for 5 minutes
- PDF generation runs asynchronously to avoid blocking UI
- Database queries use proper indexing on `audit_id` and `severity`

## Security Considerations

- All API endpoints require request validation with Zod
- Database queries use parameterized statements to prevent SQL injection
- Environment variables with sensitive keys are never exposed to client
- CORS headers restrict API access to authorized origins
- Audit logs capture all compliance findings for non-repudiation

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@macomplianceagent.com
- Documentation: docs.macomplianceagent.com

## Roadmap

- [ ] Real-time collaboration on audits
- [ ] Custom compliance frameworks (ISO 27001, etc)
- [ ] Automated remediation suggestions with implementation tracking
- [ ] Integration with legal document management systems
- [ ] Advanced AI reasoning for complex compliance scenarios
- [ ] Audit history and trend analysis dashboard
- [ ] Mobile app for on-the-go audit management
#   O m n i D u e -  
 