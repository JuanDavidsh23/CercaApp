#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
# Cerca — Single verification script
# Run: ./scripts/verify.sh
# This is the single entry point for local and CI checks.
# ─────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "═══════════════════════════════════════════════"
echo "  Cerca — Verification Pipeline"
echo "═══════════════════════════════════════════════"
echo ""

# Step 1: TypeScript type checking
echo "▶ [1/4] TypeScript type check..."
pnpm --filter @cerca/mobile typecheck
pnpm --filter @cerca/contract typecheck
echo "✔ Type check passed"
echo ""

# Step 2: ESLint
echo "▶ [2/4] ESLint..."
pnpm --filter @cerca/mobile lint
echo "✔ Lint passed"
echo ""

# Step 3: Prettier format check
echo "▶ [3/4] Prettier format check..."
pnpm exec prettier --check .
echo "✔ Format check passed"
echo ""

# Step 4: Tests (will be enabled in Phase 9)
echo "▶ [4/4] Tests..."
if [ -f "apps/mobile/vitest.config.ts" ]; then
  pnpm --filter @cerca/mobile test --run
  echo "✔ Tests passed"
else
  echo "⏭ Skipped (Vitest not configured yet — Phase 9)"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  ✅ All checks passed!"
echo "═══════════════════════════════════════════════"
