# 🏢 OmniDue: M&A Legal Due Diligence Agent

> **Intelligent Compliance Intelligence for M&A Transactions**

An enterprise-grade AI-powered platform for automated compliance analysis, risk assessment, and legal due diligence during mergers and acquisitions. Built with Next.js 16, React 19, TypeScript, and Vercel AI SDK.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Performance & Security](#performance--security)
- [License](#license)

---

## 🎯 Overview

**OmniDue** is a comprehensive due diligence intelligence platform designed for M&A teams, corporate counsel, and compliance officers. It automates the complex process of compliance assessment, risk identification, and legal analysis during mergers and acquisitions.

### Key Capabilities

- **🔴 Risk Heatmap** - Visual matrix of compliance risks across 5 risk categories and 5 assessment dimensions
- **📦 License Scanner** - Open-source license detection and GPL violation identification
- **🔒 Security Audit** - Code vulnerability scanning, secrets detection, cryptography analysis
- **🔐 Data Privacy Mapper** - GDPR, CCPA, and HIPAA compliance assessment with gap analysis
- **⚖️ Regulatory Checker** - SEC, SOX, FINRA deadline tracking and requirements management
- **📊 Compliance Scorecard** - Real-time scoring, trend analysis, and historical comparisons
- **📄 Report Generator** - Multi-format export (PDF, CSV, JSON) with customizable detail levels
- **🤖 AI-Powered Analysis** - Vercel AI SDK integration for intelligent insights and recommendations

---

## 🌟 Core Features

### 1. **Risk Heatmap** 🔴📊

Visualizes compliance risk across a dynamic matrix combining:
- **5 Risk Categories**: Legal, Security, Privacy, Compliance, Data Protection
- **5 Assessment Dimensions**: Documentation, Implementation, Testing, Monitoring, Response
- **Risk Scoring**: 0-10 scale with color coding (Red/Orange/Yellow/Blue)
- **Real-time Updates**: Live risk calculations based on findings

**Access**: Dashboard → Risk Heatmap tab or `/audits/:id`

### 2. **License Scanner** 📦

Automated open-source license compliance analysis:
- **Input Detection**: Analyzes package.json, npm packages, Python dependencies, and source code
- **Violation Detection**: GPL-2.0/3.0, AGPL, SSPL, LGPL copyleft violations
- **Compatibility Analysis**: Identifies license conflicts across dependency tree
- **Remediation Roadmap**: Specific recommendations for license compliance
- **Report Generation**: Detailed compliance summary with alternative solutions

**Supported Patterns**:
- GPL-2.0 / GPL-3.0
- AGPL-3.0 / SSPL
- LGPL-2.1 / LGPL-3.0
- MIT / Apache-2.0 (permissive)
- BSD / ISC (permissive)

### 3. **Security Audit** 🔒

Comprehensive code security scanning:
- **Secret Detection**: AWS keys, API credentials, database passwords, private keys
- **Vulnerability Patterns**: eval(), XSS, SQL injection, command injection risks
- **Cryptography Analysis**: MD5/SHA-1 weak hashing, Math.random() usage
- **Authentication Issues**: Hardcoded credentials, plaintext passwords, session vulnerabilities
- **Severity Classification**: CRITICAL, HIGH, MEDIUM, LOW

### 4. **Data Privacy Mapper** 🔐

Regulatory compliance assessment framework:

**GDPR Compliance**:
- Legal basis documentation, privacy notices
- Data subject rights implementation
- Data Protection Impact Assessments (DPIA)
- Breach notification procedures
- Data retention policies

**CCPA Compliance**:
- Consumer rights mechanisms
- "Opt-out" and "Do Not Sell" options
- Service provider agreements
- Data disclosure requirements

**HIPAA Compliance**:
- PHI identification and classification
- Encryption requirements
- Audit trail and logging
- Business Associate Agreements (BAA)

### 5. **Regulatory Checker** ⚖️

Enterprise regulatory requirement tracking:

**SEC Requirements**:
- Material contract review
- Financial audit compliance
- Executive compensation disclosure
- 8-K/10-Q/10-K deadlines

**SOX Compliance**:
- Internal control assessment
- IT governance requirements
- Financial reporting controls

**FINRA Compliance**:
- Anti-Money Laundering (AML) procedures
- Know Your Customer (KYC) requirements
- Supervisory oversight obligations

**Deadline Tracking**: Alerts for critical deadlines (< 30 days, 30-90 days, 90+ days)

### 6. **Compliance Scorecard** 📊

Real-time compliance metrics dashboard:
- **Overall Compliance Score**: Percentage-based (0-100%)
- **Category Breakdown**: Individual scores per compliance domain
- **Trend Analysis**: Historical compliance trajectory
- **Gap Identification**: Prioritized remediation items
- **Target Alignment**: Benchmark against industry standards

**Score Interpretation**:
- 🟢 90-100%: Strong compliance posture
- 🟡 70-89%: Acceptable with minor gaps
- 🟠 50-69%: Significant gaps requiring planning
- 🔴 Below 50%: Critical gaps requiring immediate action

### 7. **Report Generator** 📄

Multi-format compliance reporting:

**Output Formats**:
- **PDF**: Executive summary with visualizations
- **CSV**: Detailed findings with all metadata
- **JSON**: Raw data export for integration

**Customization Options**:
- Severity filtering (CRITICAL, HIGH, MEDIUM, LOW)
- Category selection (Legal, Security, Privacy, Compliance, Data Protection)
- Detail levels (Executive/Standard/Detailed)
- Timeline periods (Last audit, Last 30 days, Custom)

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.6 | React framework with API routes |
| **React** | 19 | UI component library |
| **TypeScript** | 5.7.3 | Type-safe development |
| **Tailwind CSS** | 4.2.0 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Headless component library |
| **Recharts** | 2.15.0 | Data visualization & charts |
| **React Hook Form** | 7.54.1 | Form state management |
| **Zod** | 3.24.1 | Schema validation |

### Backend & Data

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Supabase** | 2.106.1 | PostgreSQL database & auth |
| **Vercel AI SDK** | 6.0.188 | AI model integration |
| **Node.js** | 18+ | Runtime environment |

### AI & Analytics

| Technology | Purpose |
|-----------|---------|
| **Vercel AI SDK** | Unified AI model interface |
| **LLM Support** | Claude, GPT, and others via SDK |
| **Streaming** | Real-time response streaming |

### UI Components & Libraries

| Library | Components |
|---------|-----------|
| **Radix UI** | Dialog, Tabs, Dropdown, Select, etc. (30+ components) |
| **Lucide React** | 564+ icons |
| **jsPDF** | PDF generation and export |
| **csv-writer** | CSV export functionality |
| **Sonner** | Toast notifications |
| **next-themes** | Dark mode support |

### Development Tools

| Tool | Purpose |
|------|---------|
| **pnpm** | Fast package manager |
| **ESLint** | Code linting |
| **TypeScript** | Type checking |
| **PostCSS** | CSS processing |

---

## 📋 Project Structure

```
omndue/
├── 📁 app/                              # Next.js app directory
│   ├── 📁 api/                          # Backend API routes
│   │   ├── 📁 analysis/
│   │   │   ├── analyze/                 # Core compliance analysis
│   │   │   ├── comprehensive/           # Multi-domain analysis
│   │   │   ├── fetch-sources/           # Data source fetching
│   │   │   ├── cross-reference/         # Cross-domain correlation
│   │   │   └── cross-reference-stream/  # Streaming cross-reference
│   │   ├── 📁 audits/
│   │   │   ├── route.ts                 # List & create audits
│   │   │   ├── create/                  # Audit creation
│   │   │   ├── [auditId]/               # Get audit details
│   │   │   └── [auditId]/findings/      # Get audit findings
│   │   ├── 📁 user/
│   │   │   ├── 📁 integrations/         # Integration management
│   │   │   └── test/                    # Integration testing
│   │   └── documentation/               # API documentation
│   ├── 📁 audits/                       # Audit pages
│   │   ├── [id]/                        # Individual audit view
│   │   └── page.tsx                     # Audits list page
│   ├── 📁 examples/                     # Example implementations
│   ├── 📁 settings/                     # Settings pages
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Dashboard home
│   └── globals.css                      # Global styles
│
├── 📁 components/                       # React components
│   ├── 📁 agent/                        # AI agent components
│   ├── 📁 dashboard/                    # Dashboard widgets
│   │   ├── RiskHeatmap.tsx              # Risk matrix visualization
│   │   ├── Scorecard.tsx                # Compliance scorecard
│   │   ├── FindingsList.tsx             # Findings display
│   │   ├── TrendAnalysis.tsx            # Trend charts
│   │   └── ReportGenerator.tsx          # Report export UI
│   ├── 📁 layout/
│   │   ├── DashboardLayout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx                  # Navigation sidebar
│   │   └── Header.tsx                   # Top navigation
│   ├── 📁 modals/
│   │   ├── AuditCreationModal.tsx       # New audit dialog
│   │   └── DocumentUpload.tsx           # File upload modal
│   ├── 📁 settings/                     # Settings components
│   ├── 📁 ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (30+ components)
│   ├── theme-provider.tsx               # Theme configuration
│   └── index.ts                         # Component exports
│
├── 📁 lib/                              # Core business logic
│   ├── 📁 analyzers/                    # Analysis engines
│   │   ├── risk-heatmap.ts              # Risk matrix calculation
│   │   ├── license-scanner.ts           # License compliance analysis
│   │   ├── security-audit.ts            # Security scanning engine
│   │   ├── privacy-mapper.ts            # Privacy compliance mapper
│   │   ├── regulatory-checker.ts        # Regulatory requirement tracking
│   │   └── coral-ai.ts                  # Vercel AI SDK integration
│   ├── database.types.ts                # Supabase generated types
│   ├── types.ts                         # Core TypeScript interfaces
│   ├── supabase.ts                      # Supabase client
│   ├── supabase-admin.ts                # Admin client for server
│   ├── encryption-service.ts            # Data encryption utilities
│   ├── report-generator.ts              # PDF/CSV export
│   ├── sample-data.ts                   # Demo data fixtures
│   ├── utils.ts                         # Helper utilities
│   └── agent/                           # AI agent logic
│
├── 📁 hooks/                            # React custom hooks
│   ├── useAudit.ts                      # Audit state management
│   ├── useAnalysis.ts                   # Analysis orchestration
│   └── ... (other hooks)
│
├── 📁 styles/                           # Additional styles
│   └── globals.css                      # Tailwind & custom CSS
│
├── 📁 public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── 📁 sql/                              # Database migrations
│   └── 001_initial_schema.sql           # Supabase schema setup
│
├── 📁 __tests__/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── ...
│
├── Configuration Files
│   ├── next.config.mjs                  # Next.js configuration
│   ├── tsconfig.json                    # TypeScript config
│   ├── tailwind.config.ts               # Tailwind configuration
│   ├── postcss.config.mjs               # PostCSS config
│   ├── components.json                  # shadcn/ui config
│   ├── package.json                     # Dependencies
│   ├── pnpm-lock.yaml                   # Lockfile
│   └── .env.local                       # Environment variables
│
└── Documentation
    ├── README.md                        # This file
    ├── PROJECT_SUMMARY.md               # Project overview
    ├── IMPLEMENTATION_COMPLETE.md       # Implementation status
    └── docs/                            # Additional docs
```

---

## 🚀 Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Link |
|-------------|---------|------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 8.0+ | [pnpm.io](https://pnpm.io/) |
| **Supabase Account** | Latest | [supabase.com](https://supabase.com) |
| **Vercel AI SDK Account** | Latest | [vercel.com/ai](https://vercel.com/ai) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

---

## 📦 Installation & Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/godaralokesh29/OmniDue.git
cd omndue
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Configure Environment Variables

Create `.env.local` in the project root:

```env
# ===== SUPABASE CONFIGURATION =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ===== VERCEL AI SDK CONFIGURATION =====
# For Anthropic Claude
ANTHROPIC_API_KEY=your_claude_api_key

# For OpenAI GPT
OPENAI_API_KEY=your_openai_api_key

# For other LLM providers
# COHERE_API_KEY=your_cohere_key
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

# ===== OPTIONAL: THIRD-PARTY INTEGRATIONS =====
NOTION_INTEGRATION_TOKEN=your_notion_token
GITHUB_API_TOKEN=your_github_token
SEC_EDGAR_API_KEY=your_sec_api_key

# ===== APPLICATION CONFIGURATION =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OmniDue
```

### Step 4: Database Setup (Supabase)

1. Create a new project in Supabase dashboard
2. Go to SQL Editor and execute the contents of `sql/001_initial_schema.sql`

This creates tables for:
- audits: Audit records
- findings: Compliance findings
- documents: Uploaded files
- integrations: API connections
- audit_logs: Audit trails
- risk_assessments: Risk data
- compliance_scores: Scorecard data

### Step 5: Start Development Server

```bash
# Start the development server
pnpm dev

# Or with npm
npm run dev

# Server will be available at http://localhost:3000
```

---

## 🔌 API Endpoints

### Audit Management

```bash
# Get all audits
GET    /api/audits

# Create new audit
POST   /api/audits/create
Body:  { companyName, auditType, scope, regulations }

# Get specific audit
GET    /api/audits/:auditId

# Get audit findings
GET    /api/audits/:auditId/findings
```

### Analysis & Scanning

```bash
# Run comprehensive analysis
POST   /api/analysis/analyze
Body:  { auditId, content, analysisType }

# Run comprehensive multi-domain analysis
POST   /api/analysis/comprehensive
Body:  { auditId, documents, depth }

# Fetch data sources
POST   /api/analysis/fetch-sources
Body:  { sourceType, sourceId }

# Cross-reference findings
POST   /api/analysis/cross-reference
Body:  { findings, analysisType }

# Stream cross-reference results
POST   /api/analysis/cross-reference-stream
Body:  { findings, analysisType }
```

### Integration Management

```bash
# Get user integrations
GET    /api/user/integrations

# Update integration settings
PUT    /api/user/integrations
Body:  { integrationName, credentials }

# Test integration
POST   /api/user/integrations/test
Body:  { integrationName }
```

### Documents

```bash
# Upload document
POST   /api/documents/upload

# List documents
GET    /api/documents/:auditId

# Delete document
DELETE /api/documents/:docId
```

---

## 📖 Usage Guide

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

### Demo Mode

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
3. Upload real documents and data

---

## ⚙️ Configuration

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
ANTHROPIC_API_KEY or OPENAI_API_KEY

# Optional - integrations
NOTION_INTEGRATION_TOKEN
GITHUB_API_TOKEN
SEC_EDGAR_API_KEY
```

---

## 🗄️ Database Schema

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

---

## 🚀 Deployment

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

---

## 🔧 Troubleshooting

### Issue: "Supabase connection failed"

**Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly in `.env.local`

### Issue: "API key invalid"

**Solution**: Check your LLM API key (Claude, OpenAI, etc.) in environment variables and verify it's valid on the respective dashboard

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

---

## ⚡ Performance & Security

### Performance Optimization

- Risk Heatmap uses memoized calculations for efficient re-renders
- API responses are cached with SWR for 5 minutes
- PDF generation runs asynchronously to avoid blocking UI
- Database queries use proper indexing on `audit_id` and `severity`

### Security Considerations

- All API endpoints require request validation with Zod
- Database queries use parameterized statements to prevent SQL injection
- Environment variables with sensitive keys are never exposed to client
- CORS headers restrict API access to authorized origins
- Audit logs capture all compliance findings for non-repudiation

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💬 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Contact: support@omndue.com
- Documentation: docs.omndue.com

---

## 🗺️ Roadmap

- [ ] Real-time collaboration on audits
- [ ] Custom compliance frameworks (ISO 27001, etc)
- [ ] Automated remediation suggestions with implementation tracking
- [ ] Integration with legal document management systems
- [ ] Advanced AI reasoning for complex compliance scenarios
- [ ] Audit history and trend analysis dashboard
- [ ] Mobile app for on-the-go audit management
