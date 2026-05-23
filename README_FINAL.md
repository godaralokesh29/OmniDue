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
- [Performance & Security](#performance--security)
- [Support & Roadmap](#support--roadmap)

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

**SEC Requirements**: Material contracts, financial audits, executive compensation disclosure
**SOX Compliance**: Internal controls, IT governance, financial reporting
**FINRA Compliance**: AML procedures, KYC requirements, supervisory oversight

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
- **PDF**: Executive summary with visualizations
- **CSV**: Detailed findings with all metadata
- **JSON**: Raw data export for integration

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

### UI & Utilities
| Library | Purpose |
|---------|---------|
| **Radix UI** | 30+ headless components |
| **Lucide React** | 564+ icons |
| **jsPDF** | PDF generation |
| **csv-writer** | CSV export |
| **Sonner** | Toast notifications |
| **next-themes** | Dark mode support |

---

## 📋 Project Structure

```
omndue/
├── 📁 app/                              # Next.js app directory
│   ├── 📁 api/                          # Backend API routes
│   │   ├── 📁 analysis/                 # Analysis endpoints
│   │   │   ├── analyze/                 # Core compliance analysis
│   │   │   ├── comprehensive/           # Multi-domain analysis
│   │   │   ├── fetch-sources/           # Data source fetching
│   │   │   └── cross-reference/         # Cross-domain correlation
│   │   ├── 📁 audits/                   # Audit management
│   │   │   ├── route.ts                 # List & create
│   │   │   ├── create/                  # Audit creation
│   │   │   └── [auditId]/               # Audit details & findings
│   │   └── 📁 user/                     # User integrations
│   ├── 📁 audits/                       # Audit pages
│   ├── 📁 examples/                     # Example implementations
│   ├── 📁 settings/                     # Settings pages
│   ├── page.tsx                         # Dashboard home
│   └── layout.tsx                       # Root layout
│
├── 📁 components/                       # React components
│   ├── 📁 dashboard/                    # Dashboard widgets
│   │   ├── RiskHeatmap.tsx
│   │   ├── Scorecard.tsx
│   │   ├── FindingsList.tsx
│   │   └── ReportGenerator.tsx
│   ├── 📁 layout/                       # Layout components
│   ├── 📁 modals/                       # Modal dialogs
│   ├── 📁 ui/                           # shadcn/ui components (30+)
│   └── theme-provider.tsx
│
├── 📁 lib/                              # Core business logic
│   ├── 📁 analyzers/                    # Analysis engines
│   │   ├── risk-heatmap.ts
│   │   ├── license-scanner.ts
│   │   ├── security-audit.ts
│   │   ├── privacy-mapper.ts
│   │   ├── regulatory-checker.ts
│   │   └── coral-ai.ts
│   ├── types.ts                         # TypeScript interfaces
│   ├── supabase.ts                      # Supabase client
│   ├── encryption-service.ts            # Data encryption
│   ├── report-generator.ts              # PDF/CSV export
│   └── sample-data.ts                   # Demo data
│
├── 📁 hooks/                            # React custom hooks
├── 📁 public/                           # Static assets
├── 📁 sql/                              # Database migrations
├── 📁 __tests__/                        # Test files
└── Configuration Files
    ├── next.config.mjs
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── components.json
    └── .env.local
```

---

## 🚀 Prerequisites

| Requirement | Version | Link |
|-------------|---------|------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **pnpm** | 8.0+ | [pnpm.io](https://pnpm.io/) |
| **Supabase Account** | Latest | [supabase.com](https://supabase.com) |
| **Vercel AI SDK** | Latest | [vercel.com/ai](https://vercel.com/ai) |
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

# ===== OPTIONAL: THIRD-PARTY INTEGRATIONS =====
NOTION_INTEGRATION_TOKEN=your_notion_token
GITHUB_API_TOKEN=your_github_token
SEC_EDGAR_API_KEY=your_sec_api_key

# ===== APPLICATION CONFIGURATION =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OmniDue
```

### Step 4: Database Setup (Supabase)

1. Create a new project in [Supabase Dashboard](https://supabase.com)
2. Go to SQL Editor
3. Copy and execute contents of `sql/001_initial_schema.sql`

This creates tables for:
- `audits` - Audit records
- `findings` - Compliance findings
- `documents` - Uploaded files
- `risk_assessments` - Risk data
- `compliance_scores` - Scorecard data

### Step 5: Start Development Server

```bash
pnpm dev

# Server available at http://localhost:3000
```

---

## 🔌 API Endpoints

### Audit Management

```bash
GET    /api/audits                    # List all audits
POST   /api/audits/create             # Create new audit
GET    /api/audits/:auditId           # Get audit details
GET    /api/audits/:auditId/findings  # Get audit findings
```

### Analysis & Scanning

```bash
POST   /api/analysis/analyze                 # Core analysis
POST   /api/analysis/comprehensive           # Multi-domain analysis
POST   /api/analysis/fetch-sources           # Fetch data sources
POST   /api/analysis/cross-reference         # Cross-reference findings
```

### Integration Management

```bash
GET    /api/user/integrations              # Get integrations
PUT    /api/user/integrations              # Update integrations
POST   /api/user/integrations/test         # Test integration
```

---

## ⚙️ Configuration

### Tailwind CSS Theme

Customize in `app/globals.css`:

```css
@theme {
  --background: white;
  --foreground: black;
  --primary: 3b82f6;
  --destructive: ef4444;
  --success: 10b981;
  --warning: f59e0b;
}
```

### Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### AI Model Integration

```typescript
// lib/analyzers/coral-ai.ts
import { generateText } from 'ai'

export async function analyzeCompliance(content: string) {
  const { text } = await generateText({
    model: 'gpt-4-turbo', // or 'claude-3-sonnet'
    prompt: `Analyze for compliance issues: ${content}`
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

See `sql/001_initial_schema.sql` for complete schema.

---

## 📖 Usage Guide

### Running Your First Audit

#### Step 1: Create Audit
```
Dashboard → New Audit
- Enter company name
- Select audit type
- Choose regulations
- Click Create
```

#### Step 2: Upload Documents
```
Audit → Documents → Upload
- Privacy policies
- Code repositories
- Compliance documents
```

#### Step 3: Run Analysis
```
Start Analysis
- Select analysis types
- Choose analysis depth
- Execute
```

#### Step 4: Review Results
```
Dashboard shows:
- Risk Heatmap
- Compliance Scorecard
- Findings by severity
- Remediation timeline
```

#### Step 5: Export Report
```
Generate Report
- Choose format (PDF/CSV/JSON)
- Select detail level
- Export
```

### Understanding Results

#### Risk Levels
| Color | Range | Action |
|-------|-------|--------|
| 🔴 Red | 7-10 | Immediate action |
| 🟠 Orange | 4-6 | Within 30 days |
| 🟡 Yellow | 2-3 | Within 90 days |
| 🔵 Blue | 0-1 | Acceptable |

#### Compliance Scores
- 90-100%: Strong compliance ✅
- 70-89%: Good with minor gaps ⚠️
- 50-69%: Fair, needs planning 🔶
- 0-49%: Critical gaps ❌

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# On Vercel Dashboard:
# - Import GitHub repository
# - Set environment variables
# - Deploy
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
**Solution**: Verify credentials in `.env.local` match Supabase project

### AI API Key Invalid
**Solution**: Check API key format and verify it's active on provider dashboard

### Components Not Rendering
**Solution**: Reinstall shadcn/ui:
```bash
pnpm exec shadcn-ui@latest add button dialog
```

### Build Errors
**Solution**: Clear cache:
```bash
rm -rf .next node_modules
pnpm install
pnpm build
```

### PDF Export Not Working
**Solution**: Verify jsPDF is installed:
```bash
pnpm add jspdf
```

---

## ⚡ Performance & Security

### Performance Optimizations
- ✅ Code splitting with Next.js routes
- ✅ Image optimization with Next.js Image
- ✅ Component memoization (React.memo)
- ✅ SWR caching for API responses
- ✅ Database query indexing

### Security Measures
- ✅ Supabase Auth with Row Level Security
- ✅ JWT token validation on all endpoints
- ✅ Request validation with Zod
- ✅ SQL injection prevention
- ✅ Environment variables for secrets
- ✅ CORS configuration
- ✅ Audit logging

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 📞 Support & Community

### Get Help
- 📧 **Email**: support@omndue.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/godaralokesh29/OmniDue/issues)
- 📖 **Docs**: [docs.omndue.com](https://docs.omndue.com)

### Learning Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel AI SDK Guide](https://sdk.vercel.ai/)

---

## 🗺️ Roadmap

### Q2 2024
- [ ] Real-time collaboration on audits
- [ ] Custom compliance frameworks (ISO 27001)
- [ ] Audit history & trend dashboard

### Q3 2024
- [ ] Automated remediation suggestions
- [ ] Legal document management integration
- [ ] Advanced AI reasoning

### Q4 2024
- [ ] Mobile app (iOS/Android)
- [ ] Blockchain audit verification
- [ ] API webhooks for integrations

---

## ✨ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - PostgreSQL database
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [Recharts](https://recharts.org/) - Visualization

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Submit a pull request

---

<div align="center">

**Built with ❤️ by [Lokesh Godara](https://github.com/godaralokesh29)**

**[⬆ Back to Top](#omndue-ma-legal-due-diligence-agent)**

</div>
