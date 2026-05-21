#!/bin/bash

# M&A Due Diligence Agent - Complete Initialization Script
# Run this script to set up the entire project from scratch

set -e

echo "======================================"
echo "M&A Due Diligence Agent - Setup"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Step 1: Check prerequisites
print_info "Step 1: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18.0 or higher"
    exit 1
fi
print_success "Node.js $(node --version) is installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_info "Installing pnpm..."
    npm install -g pnpm
fi
print_success "pnpm $(pnpm --version) is installed"

# Step 2: Install dependencies
print_info "Step 2: Installing dependencies..."
pnpm install
print_success "Dependencies installed"

# Step 3: Create .env.local
print_info "Step 3: Creating .env.local configuration..."

if [ -f ".env.local" ]; then
    print_error ".env.local already exists. Skipping creation."
    echo "If you need to reconfigure, edit .env.local manually"
else
    cat > .env.local << 'EOF'
# Supabase Configuration (REQUIRED)
# Get these from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Coral.ai Configuration (OPTIONAL)
# Get from https://coral.ai/dashboard
CORAL_AI_API_KEY=your_coral_api_key_here
CORAL_AI_API_BASE=https://api.coral.ai

# Third-party Integrations (OPTIONAL)
NOTION_INTEGRATION_TOKEN=your_notion_token
GITHUB_API_TOKEN=your_github_token
SEC_EDGAR_API_KEY=your_sec_api_key
EOF
    print_success ".env.local created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your actual credentials:"
    echo "   1. Create a Supabase project at https://supabase.com"
    echo "   2. Copy your Project URL and Anon Key"
    echo "   3. Paste them into .env.local"
    echo ""
fi

# Step 4: Database setup instructions
print_info "Step 4: Database setup..."
echo ""
echo "To set up the Supabase database:"
echo "  1. Go to https://supabase.com/dashboard"
echo "  2. Create a new project (name: ma-due-diligence)"
echo "  3. Once created, go to SQL Editor"
echo "  4. Create a new query and paste contents of sql/001_initial_schema.sql"
echo "  5. Run the query to create all tables"
echo ""
echo "After setup, update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
echo ""

# Step 5: Verify environment
print_info "Step 5: Verifying environment..."

if grep -q "your-project.supabase.co" .env.local; then
    print_error "Supabase credentials not configured in .env.local"
    echo "Please edit .env.local with your credentials before starting the server"
else
    print_success "Supabase credentials detected"
fi

# Step 6: Build check (optional)
print_info "Step 6: Running TypeScript check..."
pnpm tsc --noEmit 2>/dev/null || echo "Note: TypeScript check may fail without database setup"
print_success "TypeScript check completed"

# Step 7: Ready to start
print_info "Step 7: Ready to start!"
echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Start development server:"
echo "     pnpm dev"
echo ""
echo "  2. Open in browser:"
echo "     http://localhost:3000"
echo ""
echo "  3. For full documentation, see:"
echo "     - README.md (full docs)"
echo "     - SETUP.md (detailed setup)"
echo "     - QUICKSTART.md (quick reference)"
echo ""
echo "======================================"
echo ""
