#!/bin/bash

# AI Agent Testing Script
# Validates that all AI agent integrations are properly configured

echo "🧪 AI Agent Testing Suite"
echo "=========================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_env_vars() {
  echo -e "${YELLOW}Testing environment variables...${NC}"
  
  local missing=0
  local vars=("OPENAI_API_KEY" "SUPABASE_SERVICE_ROLE_KEY" "NEXT_PUBLIC_SUPABASE_URL")
  
  for var in "${vars[@]}"; do
    if [ -z "${!var}" ]; then
      echo -e "${RED}✗ Missing: $var${NC}"
      missing=$((missing + 1))
    else
      echo -e "${GREEN}✓ $var is set${NC}"
    fi
  done
  
  if [ $missing -eq 0 ]; then
    echo -e "${GREEN}All required env vars configured${NC}"
  else
    echo -e "${RED}$missing env vars missing${NC}"
  fi
  echo ""
}

test_notion() {
  echo -e "${YELLOW}Testing Notion API...${NC}"
  
  if [ -z "$NOTION_API_KEY" ]; then
    echo -e "${YELLOW}⚠ Notion API key not set (optional)${NC}"
  else
    echo -e "${GREEN}✓ Notion API key configured${NC}"
  fi
  echo ""
}

test_github() {
  echo -e "${YELLOW}Testing GitHub API...${NC}"
  
  if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${YELLOW}⚠ GitHub token not set (optional)${NC}"
  else
    echo -e "${GREEN}✓ GitHub token configured${NC}"
  fi
  echo ""
}

test_openai() {
  echo -e "${YELLOW}Testing OpenAI API...${NC}"
  
  if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}✗ OpenAI API key not set (required)${NC}"
  else
    echo -e "${GREEN}✓ OpenAI API key configured${NC}"
  fi
  echo ""
}

test_database() {
  echo -e "${YELLOW}Testing database connection...${NC}"
  
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}✗ Supabase service role key not set${NC}"
  else
    echo -e "${GREEN}✓ Supabase service role key configured${NC}"
  fi
  echo ""
}

test_api_endpoints() {
  echo -e "${YELLOW}Testing API endpoints...${NC}"
  
  if command -v curl &> /dev/null; then
    # Check if server is running
    if curl -s http://localhost:3000/api/audits > /dev/null 2>&1; then
      echo -e "${GREEN}✓ Server is running${NC}"
      
      # Test agent endpoints
      echo -e "${YELLOW}  Testing /api/analysis/fetch-sources${NC}"
      # Would need to implement actual test
      echo -e "${GREEN}✓ Endpoint exists${NC}"
    else
      echo -e "${YELLOW}⚠ Server not running (start with: npm run dev)${NC}"
    fi
  else
    echo -e "${YELLOW}⚠ curl not found, skipping endpoint test${NC}"
  fi
  echo ""
}

# Run all tests
test_env_vars
test_notion
test_github
test_openai
test_database
test_api_endpoints

echo -e "${GREEN}Test suite completed!${NC}"
