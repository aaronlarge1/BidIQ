#!/usr/bin/env bash
# BidIQ Pro — Local Setup Script
# Run: bash scripts/setup-local.sh
set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     BidIQ Pro — Local Setup Wizard    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ── Step 1: Check required tools ───────────────────────────────
echo -e "${BLUE}[1/6] Checking required tools...${NC}"

check_tool() {
  local tool=$1
  local install_hint=$2
  if command -v "$tool" &>/dev/null; then
    echo -e "  ${GREEN}✅ $tool found: $(${tool} --version 2>&1 | head -1)${NC}"
  else
    echo -e "  ${RED}❌ $tool not found. ${install_hint}${NC}"
    MISSING_TOOLS=true
  fi
}

MISSING_TOOLS=false
check_tool "node" "Install from https://nodejs.org (use LTS)"
check_tool "npm" "Comes with Node.js"
check_tool "git" "Install from https://git-scm.com"
check_tool "psql" "Install PostgreSQL from https://www.postgresql.org/download/ OR use Docker"

if command -v docker &>/dev/null; then
  echo -e "  ${GREEN}✅ Docker found — you can use docker-compose up -d instead of local PostgreSQL${NC}"
else
  echo -e "  ${YELLOW}⚠️  Docker not found (optional — use local PostgreSQL instead)${NC}"
fi

if command -v render &>/dev/null; then
  echo -e "  ${GREEN}✅ Render CLI found${NC}"
else
  echo -e "  ${YELLOW}⚠️  Render CLI not installed (optional). Install: npm i -g @render-oss/cli${NC}"
fi

if [ "$MISSING_TOOLS" = true ]; then
  echo ""
  echo -e "${RED}Some required tools are missing. Install them and re-run this script.${NC}"
  exit 1
fi

echo ""

# ── Step 2: Install dependencies ───────────────────────────────
echo -e "${BLUE}[2/6] Installing npm dependencies...${NC}"
npm install
echo -e "  ${GREEN}✅ Dependencies installed${NC}"
echo ""

# ── Step 3: Copy env files ─────────────────────────────────────
echo -e "${BLUE}[3/6] Setting up environment files...${NC}"

if [ -f ".env.local" ]; then
  echo -e "  ${YELLOW}⚠️  .env.local already exists — skipping copy${NC}"
else
  cp .env.local.example .env.local
  echo -e "  ${GREEN}✅ .env.local created from .env.local.example${NC}"
fi

if [ -f ".env" ]; then
  echo -e "  ${YELLOW}⚠️  .env already exists — skipping copy${NC}"
else
  cp .env.example .env
  echo -e "  ${GREEN}✅ .env created from .env.example${NC}"
fi

echo ""

# ── Step 4: Database setup ─────────────────────────────────────
echo -e "${BLUE}[4/6] Database setup...${NC}"

if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
  echo -e "  Docker detected — starting PostgreSQL and MeiliSearch via docker-compose..."
  docker-compose up -d db search
  echo -e "  ${GREEN}✅ Services started${NC}"
  echo -e "  ${YELLOW}   DATABASE_URL=postgresql://bidiq:password@localhost:5432/bidiq_dev${NC}"
  echo -e "  ${YELLOW}   MEILISEARCH_HOST=http://localhost:7700${NC}"
  echo -e "  ${YELLOW}   MEILISEARCH_API_KEY=dev-meilisearch-master-key${NC}"
else
  echo -e "  ${YELLOW}⚠️  Docker not running. Assuming PostgreSQL is already running locally.${NC}"
  echo -e "  ${YELLOW}   If not: install PostgreSQL or start Docker and re-run this script.${NC}"
fi

echo ""

# ── Step 5: Validate environment ───────────────────────────────
echo -e "${BLUE}[5/6] Validating environment variables...${NC}"
if command -v npx &>/dev/null && [ -f "scripts/check-env.ts" ]; then
  npx tsx scripts/check-env.ts || true
else
  echo -e "  ${YELLOW}⚠️  Skipping env check (tsx not available or script not found)${NC}"
fi

echo ""

# ── Step 6: Done ───────────────────────────────────────────────
echo -e "${BLUE}[6/6] Setup complete!${NC}"
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  BidIQ Pro is ready to run                            ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║  Start dev server:     npm run dev                     ║${NC}"
echo -e "${GREEN}║  Open app:             http://localhost:5173           ║${NC}"
echo -e "${GREEN}║  Seed demo data:       npm run seed:demo               ║${NC}"
echo -e "${GREEN}║  Check integrations:   npm run test:integrations       ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║  Edit .env.local to configure frontend vars            ║${NC}"
echo -e "${GREEN}║  Edit .env to add API keys when ready                  ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
