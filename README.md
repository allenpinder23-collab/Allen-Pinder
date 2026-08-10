# Credit & Budget Builder

An internal platform for Allen Pinder's fintech practice: advisors log in,
add clients, and upload each client's credit report plus their last 1–3
bank statements (PDF). Claude generates a full comprehensive budget,
credit-factor breakdown, prioritized dispute/goodwill strategy, debt
payoff plan, and a month-by-month 6-month action plan working toward a
**+200 point credit score goal**. Every plan is stored per client, encrypted
at rest, so advisors can track a client's history over time.

## What it does

1. **Sign in** (`/login`) — advisor/staff accounts only; no client
   self-signup in this version.
2. **Add a client** (`/clients/new`) — name, contact info, notes.
3. **Generate a plan** (`/clients/[id]/analyze`) — upload the client's
   credit report PDF plus up to three bank statement PDFs.
4. **Extract** — text is pulled from each PDF server-side (`pdf-parse`);
   the raw PDFs are never written to disk.
5. **Analyze** — the extracted text is sent to Claude with a system prompt
   that encodes financial-accounting, budgeting, and U.S. consumer credit
   law (FCRA, FCBA, FDCPA, CROA) expertise. Claude returns a single
   structured plan (via forced tool-use, validated against a Zod schema —
   see `src/lib/types.ts`).
6. **Store** — the structured plan (not the raw documents) is encrypted
   with AES-256-GCM and saved to the database, linked to the client and
   the advisor who generated it.
7. **Review** (`/clients/[id]/plans/[planId]`) — an interactive dashboard:
   credit factor ratings, negative items with a recommended strategy per
   item, a budget breakdown chart, a debt payoff order
   (avalanche/snowball/hybrid), the 6-month plan, and draft letters.
8. **Export** — download the plan as a branded PDF report, an editable
   budget workbook (`.xlsx`), or a PDF of the draft letters.

## Architecture

- **Next.js 16 (App Router) + TypeScript + Tailwind**, single deployable app.
- **Prisma + SQLite** for persistence (`prisma/schema.prisma`). Swap the
  datasource to `postgresql` for a real production deployment — the schema
  and queries don't need to change.
- `src/lib/claude.ts` — Anthropic client, system prompt, and the forced
  tool-use call that produces a `ClientPlan`.
- `src/lib/types.ts` — the `ClientPlan` Zod schema. This is the contract
  between Claude's output and every UI/export consumer.
- `src/lib/pdfParse.ts` — PDF → text extraction.
- `src/lib/auth.ts` — password hashing (bcrypt), DB-backed sessions
  (random bearer token in an httpOnly/secure/SameSite=Lax cookie; only a
  SHA-256 hash of the token is stored), login lockout after repeated
  failures, and the `checkApiAuth`/`checkApiAdminAuth` helpers every API
  route uses.
- `src/lib/crypto.ts` — AES-256-GCM encrypt/decrypt for plan data at rest.
- `src/app/(app)/*` — the authenticated advisor workspace (client roster,
  client detail, plan generation, plan view, admin user management),
  gated by `src/app/(app)/layout.tsx`.
- `src/app/api/clients/[id]/plans` — accepts the uploaded PDFs, extracts
  text, calls Claude, encrypts the result, and stores it.
- `src/app/api/export/{pdf,xlsx,letters}` — auth-gated export endpoints;
  each takes a plan JSON body (already decrypted server-side by the
  calling page) and streams back a generated file.

### Security model

- **Passwords**: bcrypt, cost factor 12.
- **Sessions**: random 32-byte tokens; only a hash is stored server-side
  (a stolen database row can't be replayed as a session). 12-hour expiry,
  httpOnly + Secure (in production) + SameSite=Lax cookie.
- **Lockout**: 5 failed logins locks the account for 15 minutes.
  Login failure responses are generic ("invalid email or password")
  whether or not the account exists, to avoid user enumeration.
- **Encryption at rest**: the structured plan (credit factors, budget,
  negative items, letters) is encrypted with AES-256-GCM before being
  written to the database. The 32-byte key lives in `ENCRYPTION_KEY` and
  is never checked into source control.
- **No raw document persistence**: uploaded credit reports and bank
  statements are parsed to text in memory and discarded once Claude
  returns a plan. Only the derived, structured plan is stored — this
  meaningfully reduces how much raw PII (account numbers, transaction
  detail) lives at rest.
- **Audit log**: logins, logouts, client creates/updates, plan
  generation, and advisor account creation are all recorded in
  `AuditLog` with the acting user, action, and target.
- **Authorization**: every mutating or data-returning API route checks
  the session via `checkApiAuth`/`checkApiAdminAuth` before touching the
  database. Admin-only actions (adding advisor accounts) additionally
  check `role === "admin"`.

### ⚠️ Build with `--webpack`, not the Turbopack default

`package.json`'s `build` and `dev` scripts explicitly pass `--webpack`.
**Do not remove that flag.** During development we found that Next.js
16's Turbopack production build silently dead-code-eliminated the
`if (!user) return 401` branch inside the auth check used by every API
route — the compiled bundle simply didn't contain that code path, so
every API request succeeded regardless of whether a valid session cookie
was present. The same code compiled correctly and behaved correctly under
webpack. If you ever remove `--webpack` to pick up a Turbopack
improvement, you must re-verify — with real unauthenticated `curl`
requests against a production build, not just `npm run dev` — that
`/api/clients` (and the other API routes) actually return 401 without a
session cookie before trusting it.

### Coaching posture, not a Credit Repair Organization

The system prompt and every generated letter explicitly frame output as
drafts for the client to personalize and send themselves. If the business
later registers/bonds as a CRO and starts sending disputes on clients'
behalf, the system prompt, disclaimers, and letter templates need a
compliance review before that changes.

### No guaranteed outcomes

The +200/6-month figure is treated as a goal to plan toward throughout the
prompt, dashboard, and exports — never a promise. Keep it that way;
guaranteeing specific credit outcomes to consumers carries real legal risk
under CROA even outside a formal CRO relationship.

## Setup

```bash
npm install

# Generates prisma/dev.db and applies the schema
npm run db:migrate

# Set required environment variables in .env (see table below), then:
npm run db:seed   # creates your first admin login from ADMIN_EMAIL/ADMIN_PASSWORD

npm run dev
```

Open http://localhost:3000 — you'll land on `/login`.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma connection string. Defaults to a local SQLite file (`file:./dev.db`). |
| `ENCRYPTION_KEY` | Yes | 32-byte hex string used for AES-256-GCM. Generate with `openssl rand -hex 32`. Losing this key makes all stored plans permanently unreadable — back it up like any other production secret. |
| `ANTHROPIC_API_KEY` | Yes | Claude API key used to generate plans. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Yes, for `db:seed` | Creates (or updates) the first admin account. Additional advisors can be added afterward from `/settings/users`. |

### Adding more advisors

Sign in as an admin and go to `/settings/users` to create additional
advisor or admin accounts. There's no self-service signup by design.

## Limitations to know about

- PDF text extraction works for text-based PDFs. Scanned/image-only PDFs
  (e.g. a photographed credit report) will yield little or no text — plan
  generation returns a 422 in that case rather than guessing.
- Bank statement categorization and dollar figures are Claude's best read
  of the extracted text; when a statement is ambiguous or partially
  unreadable, the model is instructed to note the uncertainty rather than
  fabricate precise numbers. Always spot-check budget totals against the
  source statements before presenting a plan to a client.
- Single-firm, flat visibility: every advisor can see every client. There's
  no per-advisor client assignment/restriction yet — add that before this
  is used across multiple unrelated teams.
- SQLite is fine for one firm's workload; for real concurrent multi-advisor
  production use, switch `datasource db { provider = "postgresql" }` in
  `prisma/schema.prisma` and point `DATABASE_URL` at a managed Postgres
  instance.

## Suggested next steps

- Client-facing self-serve portal (upload their own documents, track
  their own progress) — a bigger, separate build.
- Per-advisor client visibility/assignment if the team grows.
- Billing/subscription integration if this becomes a paid product.
- Compliance review of the system prompt and letter templates with actual
  legal counsel before this touches real clients at volume.
- OCR fallback for scanned/image-only credit reports.
