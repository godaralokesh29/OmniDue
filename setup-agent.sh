#!/bin/bash

# AI Agent Quick Setup Script
# This script helps configure the AI agent quickly

echo "🚀 M&A Due Diligence Agent - Quick Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local..."
  cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Notion Integration
NOTION_API_KEY=
NOTION_DATABASE_ID=

# GitHub Integration
GITHUB_TOKEN=
GITHUB_REPO_OWNER=
GITHUB_REPO_NAME=

# AI Model
OPENAI_API_KEY=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SEC Edgar
SEC_EDGAR_API_BASE=https://www.sec.gov/cgi-bin/browse-edgar
EOF
  echo "✓ Created .env.local"
else
  echo "✓ .env.local already exists"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and fill in your API keys:"
echo "   - Get Notion API key from: https://www.notion.com/my-integrations"
echo "   - Get GitHub token from: https://github.com/settings/tokens"
echo "   - Get OpenAI key from: https://platform.openai.com/api-keys"
echo ""
echo "2. Run database migration:"
echo "   npm run db:migrate"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. Go to: http://localhost:3000/agent"
echo ""
echo "For more details, see docs/AGENT_SETUP.md"
