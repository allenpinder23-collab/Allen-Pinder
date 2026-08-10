#!/usr/bin/env bash
# One-command local setup: installs deps, creates .env if missing,
# migrates the database, seeds your admin login, and starts the app.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install it from https://nodejs.org and re-run this script." >&2
  exit 1
fi

echo "Installing dependencies..."
npm install

if [ ! -f .env ]; then
  echo ""
  echo "No .env found — let's create one."
  read -rp "Your email (used to log in): " ADMIN_EMAIL
  read -rsp "Choose a password (10+ characters): " ADMIN_PASSWORD
  echo ""
  read -rp "Your Anthropic API key (from console.anthropic.com): " ANTHROPIC_API_KEY

  ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

  cat > .env <<EOF
DATABASE_URL="file:./dev.db"
ENCRYPTION_KEY=${ENCRYPTION_KEY}
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
ANTHROPIC_MODEL=claude-sonnet-5
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
ADMIN_NAME=Admin
EOF
  echo ".env created."
else
  echo ".env already exists — using it as-is."
fi

echo "Setting up the database..."
npx prisma migrate deploy
npm run db:seed

echo ""
echo "All set. Starting the app at http://localhost:3000"
echo "Log in with the email/password you just entered (or check .env)."
echo ""
npm run dev
