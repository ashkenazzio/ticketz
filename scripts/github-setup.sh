#!/usr/bin/env bash
#
# One-time GitHub bootstrap for Ticketz: labels, milestones (= epics), a Project board,
# and the first batch of issues (Epic 1 — the next actionable work).
#
# Prereqs: `gh` installed + authed (`gh auth login`), and this repo pushed to a GitHub remote.
# Re-runnable: label/milestone creation is idempotent.
#
# Usage:  bash scripts/github-setup.sh
set -euo pipefail

command -v gh >/dev/null || { echo "❌ GitHub CLI (gh) not found. Install it, then 'gh auth login'."; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "❌ Not authenticated. Run 'gh auth login'."; exit 1; }

REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)"
[ -n "$REPO" ] || { echo "❌ No GitHub remote. Create one first: gh repo create ticketz --private --source=. --push"; exit 1; }
echo "→ Repo: $REPO"

echo "→ Labels"
label() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null; }
# epics
label "epic:foundation"     "0e8a16" "Epic 0"
label "epic:backend-core"   "1d76db" "Epic 1"
label "epic:auth"           "5319e7" "Epic 2"
label "epic:design-system"  "fbca04" "Epic 3"
label "epic:communities"    "0052cc" "Epic 4"
label "epic:events"         "006b75" "Epic 5"
label "epic:ticketing"      "b60205" "Epic 6"
label "epic:wallet"         "d93f0b" "Epic 7"
label "epic:social"         "c5def5" "Epic 8"
label "epic:dashboard"      "bfd4f2" "Epic 9"
label "epic:hardening"      "e99695" "Epic 10"
label "epic:notifications"  "f9d0c4" "Epic 11"
label "epic:testing"        "fef2c0" "Epic 12"
label "epic:deploy"         "c2e0c6" "Epic 13"
# area / size / type / priority
for a in be fe fs infra docs; do label "area:$a" "ededed" "Area: $a"; done
label "size:s" "c2e0c6" "≈ <2h"
label "size:m" "fbca04" "≈ a few hours"
label "size:l" "e99695" "split before starting"
for t in feature chore bug test docs epic; do label "type:$t" "d4c5f9" "Type: $t"; done
label "prio:mvp" "b60205" "Critical-path vertical slice"
label "blocked"  "000000" "Blocked by a dependency"

echo "→ Milestones (epics)"
milestone() {
  gh api "repos/$REPO/milestones" -q '.[].title' | grep -qxF "$1" \
    || gh api "repos/$REPO/milestones" -f title="$1" -f description="$2" >/dev/null
}
milestone "Epic 0: Foundation"      "Monorepo, CI, infra, quality gates"
milestone "Epic 1: Backend core"    "Prisma schema + GraphQL base + codegen + seed"
milestone "Epic 2: Auth"            "Hand-rolled JWT + FE auth shell"
milestone "Epic 3: Design system"   "v4 tokens, layouts, hand-built primitives"
milestone "Epic 4: Communities"     "CRUD + membership + discovery + hub"
milestone "Epic 5: Events"          "Event CRUD + tiers + discovery + detail"
milestone "Epic 6: Ticketing"       "Order → Stripe → tickets (the money path)"
milestone "Epic 7: Wallet"          "Wallet, ticket QR, orders, check-in"
milestone "Epic 8: Social"          "Friends, who's-going, saved events"
milestone "Epic 9: Dashboard"       "Organizer cockpit + analytics"
milestone "Epic 10: Hardening"      "Validation, uploads, rate-limit, errors"
milestone "Epic 11: Notifications"  "Notification entity + bell"
milestone "Epic 12: Testing & E2E"  "Playwright slice + coverage"
milestone "Epic 13: Deployment"     "Containerize + deploy + CD"

echo "→ Project board"
gh project create --owner "@me" --title "Ticketz" >/dev/null 2>&1 \
  && echo "  created Project 'Ticketz' (add Backlog→Ready→In Progress→In Review→Done columns + an MVP-slice view in the UI)" \
  || echo "  (Project 'Ticketz' may already exist — skipping)"

echo "→ Epic 1 issues (the next actionable batch)"
issue() { # title  body  labels
  gh issue create --repo "$REPO" --title "$1" --body "$2" --label "$3" --milestone "Epic 1: Backend core" >/dev/null \
    && echo "  + $1"
}
EP="epic:backend-core"
issue "[E1-T1] PrismaModule + PrismaService" $'Global Prisma module with shutdown hooks.\n\n- [ ] App boots connected to Postgres\n- [ ] `prisma migrate dev` works\n- [ ] Unit test for new logic green' "$EP,area:be,size:s,type:feature,prio:mvp"
issue "[E1-T2] Prisma schema — core entities" $'User, Community, CommunityMembership, Event, TicketTier + enums (money as Int). Source of truth: Ticketz-UI/SCHEMA.md.\n\n- [ ] Migration applies\n- [ ] Indexes from SCHEMA.md present\nDeps: E1-T1. Size L — split if needed.' "$EP,area:be,size:l,type:feature,prio:mvp"
issue "[E1-T3] Prisma schema — transactional + social" $'Ticket(status/usedAt/refundedAt), Order.totalAmount, Payment(externalId,enums), EventAttendee, SavedEvent, UserConnection.\n\n- [ ] FKs/unique/indexes per SCHEMA.md\nDeps: E1-T2.' "$EP,area:be,size:m,type:feature"
issue "[E1-T4] GraphQL enums + scalars" $'Register enums (lowercase to match categories.ts), DateTime scalar, money-as-Int convention.\n\n- [ ] Enums correct in schema.gql\nDeps: E1-T2.' "$EP,area:be,size:s,type:feature,prio:mvp"
issue "[E1-T5] Base ObjectTypes" $'User (no password field), Community, Event, TicketTier + relations.\n\n- [ ] Password never selectable via GraphQL\nDeps: E1-T4.' "$EP,area:be,size:m,type:feature,prio:mvp"
issue "[E1-T6] Repository + error-mapping conventions" $'Clean not-found/forbidden GraphQL errors, no internal leakage.\n\n- [ ] Missing entity → typed error\n- [ ] Unit test on the mapper\nDeps: E1-T1.' "$EP,area:be,size:s,type:feature"
issue "[E1-T7] Seed script from mockData.ts" $'Port Ticketz-UI fixtures (Alex Rivera, Bass Sector, sample events/tiers) into prisma/seed.ts.\n\n- [ ] pnpm db:seed populates a realistic graph\n- [ ] Idempotent reset\nDeps: E1-T3.' "$EP,area:be,size:m,type:feature,prio:mvp"
issue "[E1-T8] graphql-codegen in web" $'client-preset reading api schema.gql + src/graphql/*.graphql → src/generated.\n\n- [ ] Typed graphql() generated\n- [ ] web#codegen depends on api#codegen\nDeps: E1-T5, E0-T6.' "$EP,area:fs,size:m,type:feature,prio:mvp"
issue "[E1-T9] Web GraphQL clients" $'serverGqlClient(token) (graphql-request) for RSC + TanStack Query provider + fetcher for client.\n\n- [ ] An RSC query and a client query both render typed seeded data\n- [ ] Fetcher unit-tested\nDeps: E1-T8.' "$EP,area:fs,size:m,type:feature,prio:mvp"

echo "✅ Done. Extend the same pattern from docs/BACKLOG.md for Epics 2–13 (or ask Claude to generate them)."
