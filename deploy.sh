#!/usr/bin/env bash
# deploy.sh — manual deploy helper (same steps as the CI workflow)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Pulling latest code..."
git pull origin main

echo "==> Building and restarting containers..."
docker compose up --build -d

echo "==> Running database migrations..."
docker compose exec -T app bun run db:migrate

echo "==> Cleaning up old images..."
docker image prune -f

echo "==> Done. App is live."
