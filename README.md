# Credit & Budget Builder

An internal tool for Allen Pinder's fintech practice: upload a client's
credit report and their last 1–3 bank statements (PDF), and Claude
generates a full comprehensive budget, credit-factor breakdown, prioritized
dispute/goodwill strategy, debt payoff plan, and a month-by-month 6-month
action plan working toward a **+200 point credit score goal**.

## What it does

1. **Upload** (`/`) — staff uploads a client's credit report PDF plus up to
   three bank statement PDFs.
2. **Extract** — text is pulled from each PDF server-side (`pdf-parse`).
3. **Analyze** — the extracted text is sent to Claude with a system prompt
   that encodes financial-accounting, budgeting, and U.S. consumer credit
   law (FCRA, FCBA, FDCPA, CROA) expertise. Claude returns a single
   structured plan (via forced tool-use, validated against a Zod schema —
   see `src/lib/types.ts`).
4. **Review** (`/dashboard`) — the plan renders as an interactive
   dashboard: credit factor ratings, negative items with recommended
   strategy per item, a budget breakdown chart, a debt payoff order
   (avalanche/snowball/hybrid), the 6-month plan, and draft letters.
5. **Export** — download the plan as a branded PDF report, an editable
   budget workbook (`.xlsx`), or a PDF of the draft letters.

## Architecture

- **Next.js 15 (App Router) + TypeScript + Tailwind**, single deployable app.
- `src/lib/claude.ts` — Anthropic client, system prompt, and the forced
  tool-use call that produces a `ClientPlan`.
- `src/lib/types.ts` — the `ClientPlan` Zod schema. This is the contract
  between Claude's output and every UI/export consumer.
- `src/lib/pdfParse.ts` — PDF → text extraction.
- `src/app/api/analyze` — accepts the uploaded PDFs, extracts text, calls
  Claude, returns the structured plan as JSON.
- `src/app/api/export/{pdf,xlsx,letters}` — stateless export endpoints;
  each takes a plan JSON body and streams back a generated file.
- `src/app/dashboard` + `src/components/*` — the review UI.

### MVP design choices (intentional, documented so they're easy to revisit)

- **No database, no auth, no document persistence.** Uploaded PDFs are
  extracted to text in memory, sent to Claude, and discarded — nothing is
  written to disk or a datastore. The generated plan lives only in the
  browser's `sessionStorage` for the session. This minimizes the
  data-security surface for an MVP handling sensitive documents (SSNs,
  account numbers, balances), but it also means: refreshing after closing
  the tab loses the plan, there's no multi-user client portal, and there's
  no audit trail. Add a database + auth layer before handling real client
  volume or building the "full client-facing portal" version.
- **Coaching posture, not a Credit Repair Organization.** The system
  prompt and every generated letter explicitly frame output as drafts for
  the client to personalize and send themselves. If the business later
  registers/bonds as a CRO and starts sending disputes on clients' behalf,
  the system prompt, disclaimers, and letter templates need a compliance
  review before that changes.
- **No guaranteed outcomes.** The +200/6-month figure is treated as a goal
  to plan toward throughout the prompt, dashboard, and exports — never a
  promise. Keep it that way; guaranteeing specific credit outcomes to
  consumers carries real legal risk under CROA even outside a formal CRO
  relationship.

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and set ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key used to generate plans. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-5`. |

## Limitations to know about

- PDF text extraction works for text-based PDFs. Scanned/image-only PDFs
  (e.g. a photographed credit report) will yield little or no text — the
  analyze endpoint returns a 422 in that case rather than guessing.
- Bank statement categorization and dollar figures are Claude's best read
  of the extracted text; when a statement is ambiguous or partially
  unreadable, the model is instructed to note the uncertainty rather than
  fabricate precise numbers. Always spot-check budget totals against the
  source statements before presenting a plan to a client.
- This is a single-tenant internal tool as built — there's no login, so
  don't deploy it somewhere publicly reachable without adding auth first.

## Suggested next steps

- Add authentication and a per-advisor client list (database-backed).
- Persist plans (with encryption at rest) so they survive beyond the
  browser session, with an audit log of who generated/viewed what.
- Add a compliance review pass on the system prompt and letter templates
  with actual legal counsel before this touches real clients at volume.
- OCR fallback (e.g. for scanned reports) if that turns out to be common.
