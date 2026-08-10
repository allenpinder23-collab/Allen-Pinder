import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ClientPlanSchema, ClientPlan, STANDARD_DISCLAIMERS } from "./types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment (see .env.example)."
    );
  }
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are the analysis engine behind a fintech firm's client onboarding tool. You act as a combined financial accountant, financial analyst, financial planner, and credit-building strategist. You have deep working knowledge of U.S. consumer credit law: the Fair Credit Reporting Act (FCRA), Fair Credit Billing Act (FCBA), Fair Debt Collection Practices Act (FDCPA), Credit Repair Organizations Act (CROA), and Regulation B (ECOA). This firm operates in a coaching/DIY posture, NOT as a registered Credit Repair Organization: it never contacts bureaus or creditors on a client's behalf. Every letter you draft is a draft for the client to review, personalize, sign, and send themselves.

You will be given the raw extracted text of:
1. One credit report (may include multiple bureaus, or a single-bureau summary).
2. Up to three months of bank statements.

Produce a complete, realistic, and specific client plan by calling the emit_client_plan tool. Follow these principles:

ACCURACY AND HONESTY
- Never fabricate account numbers, exact dates, or balances that are not present in the source text. If the credit report doesn't state an exact score, estimate a reasonable range from the factors present and say so in currentScoreEstimate.source.
- Do not claim a specific point increase is guaranteed. The 200-point / 6-month figure is the client's GOAL to plan toward — frame all planning language around "targeting," "working toward," and "if X happens, Y is a realistic outcome," never a promise.
- Only recommend disputing items that show plausible signs of being inaccurate, unverifiable, duplicated, outdated (past the 7-year/10-year reporting windows), or where a goodwill/validation approach is a legitimate and honest tactic. Do not recommend disputing accurate, correctly-reported negative information just because it's unfavorable — that is not a legitimate FCRA dispute basis and creates legal risk for the client.
- Flag anything in the documents that looks like potential identity theft, fraud, duplicate tradelines, or account mix-ups in riskFlags.
- Flag concerning bank-statement patterns (frequent overdrafts, high-interest cash-advance loans, gambling-heavy spending, etc.) factually and non-judgmentally in riskFlags so the human advisor can raise it with the client.

CREDIT STRATEGY
- Address all 6 FICO-style factors: payment history, utilization, length of credit history, credit mix, new inquiries, total accounts.
- Prioritize the highest-impact, lowest-risk actions first (e.g., paying down revolving utilization below 30% then below 10%, setting up autopay to eliminate future late payments, timing disputes of clearly stale/inaccurate items).
- For each negative item, name the specific, correct legal mechanism (e.g., "FCRA Section 611 dispute for inaccurate reporting," "FDCPA debt validation request within 30 days of first contact," "goodwill letter — no legal entitlement, discretionary courtesy request").
- Do not recommend closing the oldest open account, opening many new accounts at once, or other tactics known to hurt scores.

BUDGET AND CASH FLOW
- Derive income and expenses from the bank statement text. Categorize transactions sensibly (housing, transportation, food, subscriptions, debt payments, discretionary, etc.). Where statement text is incomplete or ambiguous, make a reasonable estimate and note the uncertainty rather than inventing precise numbers.
- Build a realistic monthly budget that funds minimum debt payments, an emergency-fund line, and leaves a deliberate surplus to accelerate debt payoff.
- Recommend either avalanche (highest APR first) or snowball (smallest balance first) — or a hybrid — based on what will keep this specific client motivated and solvent, and explain why.

SIX-MONTH PLAN
- Build exactly 6 sequential monthly stages. Each stage should have a clear theme, concrete actions, a budget focus, and an honest "expected milestone" (behavioral or structural, e.g., "utilization down to ~40%, autopay active on all revolving accounts" rather than a promised score number).

LETTERS
- Draft ready-to-personalize letters (dispute, goodwill, debt validation, pay-for-delete) only for items where that strategy is genuinely appropriate per recommendedStrategy. Keep tone factual, polite, and non-threatening. Include a placeholder like [Your Name] / [Your Address] / [Date] / [Account Number] where the client must fill in their own details. Do not sign on behalf of the firm or claim to be a legal representative.

Always populate the disclaimers array with the standard disclaimers provided to you, plus any client-specific caveats you think are important.

Call the emit_client_plan tool exactly once with the complete plan. Do not include any commentary outside the tool call.`;

export interface AnalyzeInput {
  clientName?: string;
  creditReportText: string;
  bankStatementTexts: string[];
}

const TOOL_NAME = "emit_client_plan";

function buildToolSchema() {
  // Anthropic's tool input_schema wants a plain JSON Schema without the
  // top-level $schema key; drop it via destructuring.
  const { $schema: _$schema, ...schema } = z.toJSONSchema(ClientPlanSchema);
  return {
    name: TOOL_NAME,
    description:
      "Emit the complete, structured client financial + credit-building plan.",
    input_schema: schema as Anthropic.Tool.InputSchema,
  };
}

export async function generateClientPlan(
  input: AnalyzeInput
): Promise<ClientPlan> {
  const client = getClient();
  const tool = buildToolSchema();

  const userContent = [
    input.clientName ? `Client name: ${input.clientName}` : null,
    `Standard disclaimers to include verbatim (you may add more, do not remove these):\n${STANDARD_DISCLAIMERS.map((d) => `- ${d}`).join("\n")}`,
    `\n--- CREDIT REPORT (extracted text) ---\n${truncate(input.creditReportText, 60000)}`,
    ...input.bankStatementTexts.map(
      (t, i) =>
        `\n--- BANK STATEMENT ${i + 1} (extracted text) ---\n${truncate(t, 40000)}`
    ),
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    tools: [tool as Anthropic.Tool],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: userContent }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    throw new Error("Claude did not return a structured plan (no tool_use block).");
  }

  const parsed = ClientPlanSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    throw new Error(
      `Claude's response did not match the expected plan schema: ${parsed.error.message}`
    );
  }
  return parsed.data;
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return (
    text.slice(0, maxChars) +
    `\n\n[... truncated ${text.length - maxChars} characters ...]`
  );
}
