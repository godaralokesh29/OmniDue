# 🏢 OmniDue: M&A Legal Due Diligence Agent

> **Intelligent Compliance Intelligence for M&A Transactions**

An enterprise-grade AI-powered platform for automated compliance analysis, risk assessment, and legal due diligence during mergers and acquisitions. Built with Next.js 16, React 19, and Vercel AI SDK, OmniDue provides comprehensive intelligence across security, privacy, regulatory, and legal domains.

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

---

## 🎯 Overview

**OmniDue** is a comprehensive due diligence intelligence platform designed for M&A teams, corporate counsel, and compliance officers. It automates the complex process of compliance assessment, risk identification, and regulatory alignment through intelligent analysis engines and AI-powered insights.

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
```
- GPL-2.0 / GPL-3.0
- AGPL-3.0 / SSPL
- LGPL-2.1 / LGPL-3.0
- MIT / Apache-2.0 (permissive)
- BSD / ISC (permissive)
```

### 3. **Security Audit** 🔒
Comprehensive code security scanning:
- **Secret Detection**: AWS keys, API credentials, database passwords, private keys
- **Vulnerability Patterns**: eval(), XSS, SQL injection, command injection risks
- **Cryptography Analysis**: MD5/SHA-1 weak hashing, Math.random() usage
- **Authentication Issues**: Hardcoded credentials, plaintext passwords, session vulnerabilities
- **Severity Classification**: CRITICAL, HIGH, MEDIUM, LOW

**Example Detection**:
```typescript
Pattern: AWS_SECRET_ACCESS_KEY\s*=\s*['"][^'"]+['"]
Severity: CRITICAL
Remediation: Use AWS Secrets Manager or environment variables
```

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
git clone https://github.com/godaralokesh29/OmniDue-.git
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

```bash
# 1. Create a new project in Supabase dashboard
# 2. Go to SQL Editor and execute:
```

Copy and run the contents of `sql/001_initial_schema.sql` in your Supabase SQL Editor:

```sql
-- Execute this in Supabase SQL Editor
-- This creates tables for:
-- - audits: Audit records
-- - findings: Compliance findings
-- - documents: Uploaded files
-- - integrations: API connections
-- - audit_logs: Audit trails
-- - risk_assessments: Risk data
-- - compliance_scores: Scorecard data
```

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

---

## ⚙️ Configuration

### Tailwind CSS Theme

Customize design tokens in `app/globals.css`:

```css
@theme {
  --background: white;
  --foreground: black;
  --primary: 3b82f6; /* Blue */
  --primary-foreground: white;
  --destructive: ef4444; /* Red */
  --destructive-foreground: white;
  --muted: e5e7eb; /* Light Gray */
  --muted-foreground: 6b7280; /* Dark Gray */
  --accent: 8b5cf6; /* Purple */
  --card: white;
  --card-foreground: black;
  --success: 10b981; /* Green */
  --warning: f59e0b; /* Amber */
  --info: 0ea5e9; /* Sky Blue */
}
```

### Supabase Authentication Setup

```typescript
// Configure in lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Vercel AI SDK Configuration

```typescript
// Configure in lib/analyzers/coral-ai.ts
import { generateText } from 'ai'

export async function analyzeCompliance(content: string) {
  const { text } = await generateText({
    model: 'gpt-4-turbo', // or 'claude-3-sonnet', etc.
    prompt: `Analyze the following for compliance issues: ${content}`
  })
  return text
}
```

---

## 📊 Database Schema

### Core Tables

#### `audits`
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  audit_type TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  risk_score INTEGER DEFAULT 0,
  overall_risk VARCHAR(50),
  documents_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `findings`
```sql
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  remediation TEXT,
  evidence TEXT,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `risk_assessments`
```sql
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  dimension VARCHAR(100) NOT NULL,
  risk_score INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `compliance_scores`
```sql
CREATE TABLE compliance_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  regulation VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  gap_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `documents`
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed BOOLEAN DEFAULT false
);
```

See `sql/001_initial_schema.sql` for complete schema.

---

## 📖 Usage Guide

### Running Your First Audit

#### Step 1: Create an Audit
```
1. Navigate to dashboard homepage
2. Click "New Audit" button
3. Enter company name: "TechCorp Inc"
4. Select audit type: "Comprehensive"
5. Choose regulations: GDPR, SOX, CCPA
6. Click "Create Audit"
```

#### Step 2: Upload Documents
```
1. Go to Audit → Documents tab
2. Click "Upload Document"
3. Select files:
   - Privacy Policy (PDF)
   - GitHub Repository URL
   - Source Code Archive
   - Compliance Policies
4. Add metadata
5. Click "Upload & Analyze"
```

#### Step 3: Run Analysis
```
1. Click "Start Analysis"
2. Select analysis types:
   ✓ Risk Heatmap
   ✓ License Scanner
   ✓ Security Audit
   ✓ Privacy Mapper
   ✓ Regulatory Checker
3. Choose analysis depth: "Standard" or "Deep"
4. Click "Run Analysis"
```

#### Step 4: Review Results
```
Dashboard shows:
- Risk Heatmap visualization
- Compliance Scorecard
- Top findings by severity
- Remediation timeline
```

#### Step 5: Export Report
```
1. Click "Generate Report"
2. Choose format: PDF / CSV / JSON
3. Select detail level: Executive / Standard / Detailed
4. Click "Export"
```

### Understanding Results

#### Risk Heatmap Colors
| Color | Range | Meaning |
|-------|-------|---------|
| 🔴 Red | 7-10 | Critical - Immediate action required |
| 🟠 Orange | 4-6 | High - Address within 30 days |
| 🟡 Yellow | 2-3 | Medium - Address within 90 days |
| 🔵 Blue | 0-1 | Low - Acceptable risk level |

#### Compliance Scores
- 90-100%: Strong compliance posture ✅
- 70-89%: Acceptable with minor gaps ⚠️
- 50-69%: Significant gaps requiring planning 🔶
- 0-49%: Critical gaps requiring immediate remediation ❌

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Connect on Vercel dashboard:
# - Go to vercel.com
# - Import your GitHub repository
# - Configure environment variables
# - Click "Deploy"
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t omndue .
docker run -p 3000:3000 omndue
```

---

## 🐛 Troubleshooting

### Supabase Connection Failed
**Solution**: Verify credentials in `.env.local` and restart server

### AI API Key Invalid
**Solution**: Check API key format and verify it's active on provider dashboard

### Components Not Rendering
**Solution**: Reinstall shadcn/ui components:
```bash
pnpm exec shadcn-ui@latest add button dialog
```

### Build Errors
**Solution**: Clear cache and rebuild:
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- 📧 Email: support@omndue.com
- 🐛 Issues: [GitHub Issues](https://github.com/godaralokesh29/OmniDue/issues)
- 📖 Docs: [docs.omndue.com](https://docs.omndue.com)

---

## ✨ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - PostgreSQL database
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components

---

<div align="center">

**Built with ❤️ by [Lokesh Godara](https://github.com/godaralokesh29)**

[⬆ Back to Top](#omndue-ma-legal-due-diligence-agent)

</div>
