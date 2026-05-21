# AI Agent Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         M&A Due Diligence Platform                  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────── FRONTEND (React) ──────────────────────┐
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │           AIAgentPage Component                     │  │
│  │  - Run Analysis tab                                │  │
│  │  - Data Sources tab                                │  │
│  │  - Integrations tab                                │  │
│  │  - Results tab                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│           ↓        ↓         ↓           ↓                │
│  ┌──────────┬──────────┬──────────┬───────────┐         │
│  │CrossRef  │DataSource│Integration│   UI     │         │
│  │Agent     │Viewer    │Setup      │Display   │         │
│  └──────────┴──────────┴──────────┴───────────┘         │
│           │        │         │           │               │
└───────────┼────────┼─────────┼───────────┼───────────────┘
            │ HTTP   │         │           │
            ↓        ↓         ↓           ↓

┌──────────────────── BACKEND (Node.js API) ───────────────────────┐
│                                                                  │
│  ┌──────────────────── API Routes ──────────────────────┐       │
│  │                                                      │       │
│  │  /api/analysis/cross-reference (POST)             │       │
│  │  └─→ Trigger full analysis (sync)                 │       │
│  │                                                      │       │
│  │  /api/analysis/cross-reference-stream (POST)      │       │
│  │  └─→ Stream progress updates (real-time)          │       │
│  │                                                      │       │
│  │  /api/analysis/fetch-sources (POST)               │       │
│  │  └─→ Preview data sources                         │       │
│  │                                                      │       │
│  └──────────────────────────────────────────────────────┘       │
│           │                                                      │
│           ↓                                                      │
│  ┌──────────────────── Core Agent ────────────────────┐        │
│  │                                                    │        │
│  │  AIAuditAgent (Orchestrator)                      │        │
│  │  ├─ runFullAudit()                               │        │
│  │  ├─ streamAnalysisProgress()                      │        │
│  │  └─ getState()                                    │        │
│  │                                                    │        │
│  └──────────┬────────────────────────────────────────┘        │
│             │                                                  │
│      ┌──────┴───────┐                                         │
│      ↓              ↓                                          │
│  ┌─────────┐  ┌──────────────────────────────┐               │
│  │DataFetch│  │CrossReferenceAnalyzer       │               │
│  │         │  │ - analyzeDocuments()        │               │
│  │Fetch from│  │ - buildPrompt()            │               │
│  │- Notion  │  │ - findCorrelations()       │               │
│  │- GitHub  │  │ComplianceMappingAnalyzer   │               │
│  │- SEC     │  │ - mapRequirements()        │               │
│  │- Reqs    │  │RiskCalculator              │               │
│  │          │  │ - calculateScore()         │               │
│  └─────────┘  └──────────────────────────────┘               │
│      │                    │                                   │
│      ↓                    ↓                                   │
└──────────────────────────────────────────────────────────────┘
       │                    │
       ↓                    ↓

┌──────────────────── EXTERNAL SERVICES ──────────────────────┐
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Notion   │  │ GitHub   │  │SEC EDGAR │  │ OpenAI   │   │
│  │ API      │  │ API v4   │  │ Public   │  │ GPT-4    │   │
│  │ (Docs)   │  │ (Code)   │  │ (Filings)│  │ (Analysis)   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
       ↑                    ↑
       │                    │

┌──────────────────── DATABASE (Supabase) ─────────────────────┐
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │audits    │  │documents │  │findings  │  │risk_     │    │
│  │          │  │          │  │          │  │assessm...    │
│  │- status  │  │- source  │  │- category│  │          │    │
│  │- score   │  │- content │  │- severity│  │- score   │    │
│  │- config  │  │- analyzed│  │- evidence│  │- factors │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow: Analysis Process

```
1. USER TRIGGERS ANALYSIS
   │
   ↓
2. FRONTEND CALLS /api/analysis/cross-reference-stream
   ├─ auditId: "AUD-001"
   ├─ companyName: "TechCorp"
   ├─ notionDatabaseId: "3e12..."
   ├─ githubOwner: "myorg"
   └─ githubRepo: "myrepo"
   │
   ↓
3. BACKEND RECEIVES REQUEST
   ├─ Create AIAuditAgent instance
   ├─ Initialize state: "initializing"
   └─ Send initial progress (0%)
   │
   ↓
4. PARALLEL DATA FETCHING
   │
   ├─ DataFetcher.fetchNotionDocuments()
   │  └─ API → Notion → Extract pages → Documents
   │
   ├─ DataFetcher.fetchGitHubDocuments()
   │  └─ API → GitHub → Extract files → Documents
   │
   ├─ DataFetcher.fetchSECFilings()
   │  └─ API → SEC → Extract filings → Documents
   │
   └─ DataFetcher.fetchRegulatoryChecklists()
      └─ Built-in → GDPR, CCPA, HIPAA, SOC2 requirements
   │
   ├─ Progress: 30%
   ├─ Step: "Fetching regulatory requirements..."
   └─ Send to frontend (SSE)
   │
   ↓
5. AI-POWERED ANALYSIS
   │
   ├─ CrossReferenceAnalyzer.analyzeDocuments()
   │  ├─ Build analysis context from all documents
   │  ├─ Create system prompt
   │  ├─ Send to OpenAI/GPT-4
   │  │  │
   │  │  ├─ Input: All documents + regulatory requirements
   │  │  ├─ Task: Find inconsistencies, correlations, risks
   │  │  └─ Output: Structured JSON analysis
   │  │
   │  └─ Parse AI response
   │
   ├─ ComplianceMappingAnalyzer.mapComplianceRequirements()
   │  ├─ Match regulatory requirements to evidence
   │  ├─ Find supporting documentation
   │  └─ Generate compliance mappings
   │
   ├─ RiskCalculator.calculateCombinedRiskScore()
   │  ├─ Weight inconsistencies by severity
   │  ├─ Weight risks by severity
   │  └─ Calculate overall score (0-100)
   │
   ├─ Progress: 75%
   ├─ Step: "Calculating risk scores..."
   └─ Send to frontend (SSE)
   │
   ↓
6. RESULT ENRICHMENT
   │
   ├─ Link risks to affected documents
   ├─ Link recommendations to risks
   ├─ Generate executive summary
   └─ Build final CrossReferenceResult object
   │
   ↓
7. DATABASE STORAGE
   │
   ├─ For each inconsistency → Create finding (open)
   ├─ For each risk → Create finding (open)
   ├─ Update audit record with:
   │  ├─ status: "completed"
   │  ├─ risk_score: calculated score
   │  └─ completed_at: timestamp
   └─ Store results in audit record
   │
   ├─ Progress: 90%
   ├─ Step: "Saving analysis results..."
   └─ Send to frontend (SSE)
   │
   ↓
8. COMPLETION
   │
   ├─ Progress: 100%
   ├─ Status: "complete"
   ├─ Results: Full analysis object
   └─ Send to frontend (SSE)
   │
   ↓
9. FRONTEND DISPLAYS RESULTS
   │
   ├─ Show progress bar at 100%
   ├─ Display risk summary cards
   ├─ Show critical risks with red highlight
   ├─ List recommendations by priority
   ├─ Display affected sources for each risk
   └─ Enable export/download options
```

## Component Interaction

```
AIAgentPage (Container)
├─ CrossReferencingAgent (Main component)
│  ├─ Shows progress bar
│  ├─ Displays current step
│  ├─ Shows error messages
│  └─ Displays results as they complete
│
├─ DataSourceViewer (Data preview)
│  ├─ Fetches available sources
│  ├─ Shows document counts
│  ├─ Displays regulatory requirements
│  └─ Lists data by source type
│
└─ AgentIntegrationSetup (Configuration)
   ├─ Notion configuration dialog
   │  ├─ API key input
   │  ├─ Database ID input
   │  └─ Test connection button
   ├─ GitHub configuration dialog
   │  ├─ Token input
   │  ├─ Owner/repo inputs
   │  └─ Test connection button
   └─ SEC configuration
      └─ Auto-enabled (public API)
```

## Data Transformations

```
SOURCES                  FETCHER              ANALYZER             OUTPUT
───────                  ───────              ────────             ──────

Notion DB    ──────→   DocumentData[]   ──→   Analysis   ──→   Findings
  Pages        Fetch     with metadata       with GPT-4         (Open)
  Properties   docs      and content         AI powered         Risks
  Rich text                                  cross-ref          Recs

GitHub Repo  ──────→   DocumentData[]   ──→   Correlation  ──→   Audit
  Files        Fetch     filePath             detection          Record
  Commits      code      source               Inconsistency      Updated
  Commit log   repo      metadata             detection

SEC EDGAR    ──────→   DocumentData[]   ──→   Compliance   ──→   Database
  Filings      Fetch     SEC metadata        mapping             Entries
  Public info  SEC       filing type         Risk scoring

Requirements ──────→   RegulatoryReq[]  ──→   Score calc   ──→   Results
  GDPR         Built-in  requirement      Confidence          Stored
  CCPA         lists     category          calculation         & Saved
  HIPAA        +         priority
  SOC2         Evidence
               matching
```

## Error Handling Flow

```
Error Occurs
│
├─ Network error (API unreachable)
│  └─ Retry logic → Exponential backoff → Fail gracefully
│
├─ Authentication error (Invalid API key)
│  └─ Log error → User-friendly message → Skip source
│
├─ Parsing error (Invalid response format)
│  └─ Log with context → Continue with other sources
│
├─ AI error (OpenAI quota exceeded)
│  └─ Retry → Fallback to previous results
│
└─ Database error (Connection failed)
   └─ Log error → Results stored in memory → Offer manual save

All errors propagate to:
1. Server logs (development/production)
2. Error state in agent
3. Frontend error display
4. User notification
```

## State Management

```
Agent State
├─ status: 'initializing' | 'fetching_documents' | 'analyzing' | 
│          'cross_referencing' | 'complete' | 'error'
├─ progress: 0-100
├─ currentStep: String description
├─ error?: String error message
└─ results?: CrossReferenceResult

UI State
├─ agentState: AgentState (from above)
├─ analysisResult: CrossReferenceResult | null
├─ integrationConfig: IntegrationConfig
└─ sourceData: SourceData | null
```

## Performance Optimization

```
Parallel Processing:
- Fetch Notion, GitHub, SEC in parallel (not sequential)
- Result: 2-3x faster data collection

Batching:
- Send all documents to AI in one batch
- Reduces API calls to OpenAI

Caching:
- Regulatory checklists cached in-memory
- 30min TTL for document cache
- Results cached in database

Streaming:
- SSE updates prevent client timeout
- UI stays responsive with progress updates
- Detailed step-by-step visibility
```

---

**This architecture enables intelligent, scalable compliance analysis across multiple data sources with real-time progress tracking.** 🚀
