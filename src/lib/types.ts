import { z } from "zod";

/**
 * Shared schema for the full client plan. This is the single source of truth:
 * the Anthropic tool-use call is forced to return data matching this shape,
 * and every downstream consumer (dashboard, PDF, xlsx, letters) reads from it.
 */

export const CreditFactorSchema = z.object({
  factor: z.enum([
    "payment_history",
    "credit_utilization",
    "credit_age",
    "credit_mix",
    "new_credit_inquiries",
    "total_accounts",
  ]),
  rating: z.enum(["excellent", "good", "fair", "poor", "critical"]),
  currentState: z.string().describe("Plain-language description of where this factor stands today"),
  whyItMatters: z.string(),
  actionsToImprove: z.array(z.string()),
  estimatedImpact: z.enum(["low", "medium", "high"]),
});
export type CreditFactor = z.infer<typeof CreditFactorSchema>;

export const NegativeItemSchema = z.object({
  id: z.string(),
  creditor: z.string(),
  accountType: z.string().optional(),
  issueType: z.enum([
    "late_payment",
    "collection",
    "charge_off",
    "high_utilization",
    "hard_inquiry",
    "public_record",
    "repossession",
    "bankruptcy",
    "duplicate_account",
    "incorrect_information",
    "other",
  ]),
  description: z.string(),
  bureausReporting: z.array(z.enum(["Equifax", "Experian", "TransUnion"])),
  priority: z.enum(["high", "medium", "low"]),
  recommendedStrategy: z.enum([
    "dispute_inaccuracy",
    "goodwill_adjustment",
    "debt_validation",
    "pay_for_delete_negotiation",
    "settle_and_document",
    "wait_for_reaging_off",
    "no_action_accurate_and_recent",
  ]),
  strategyNotes: z.string(),
  legalNote: z
    .string()
    .optional()
    .describe("Relevant consumer-protection law context, e.g. FCRA 15 U.S.C. 1681, FDCPA, FCBA"),
});
export type NegativeItem = z.infer<typeof NegativeItemSchema>;

export const BudgetCategorySchema = z.object({
  category: z.string(),
  monthlyAmount: z.number(),
  type: z.enum(["income", "fixed_expense", "variable_expense", "debt_payment", "savings"]),
  notes: z.string().optional(),
});
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

export const DebtPayoffItemSchema = z.object({
  creditor: z.string(),
  balance: z.number(),
  apr: z.number().optional(),
  minimumPayment: z.number().optional(),
  payoffOrderRank: z.number().int(),
  recommendedMonthlyPayment: z.number(),
  rationale: z.string(),
});
export type DebtPayoffItem = z.infer<typeof DebtPayoffItemSchema>;

export const MonthPlanSchema = z.object({
  month: z.number().int().min(1).max(6),
  theme: z.string(),
  targetActions: z.array(z.string()),
  budgetFocus: z.string(),
  expectedMilestone: z.string(),
});
export type MonthPlan = z.infer<typeof MonthPlanSchema>;

export const LetterSchema = z.object({
  id: z.string(),
  type: z.enum(["dispute", "goodwill", "debt_validation", "pay_for_delete"]),
  relatedNegativeItemId: z.string().optional(),
  recipient: z.string(),
  subject: z.string(),
  body: z.string(),
});
export type Letter = z.infer<typeof LetterSchema>;

export const ClientPlanSchema = z.object({
  clientName: z.string().optional(),
  generatedDate: z.string(),
  currentScoreEstimate: z.object({
    range: z.string().describe("e.g. '580-600' if an exact score isn't stated in the report"),
    source: z.string().describe("e.g. 'stated on report' or 'estimated from factors present'"),
  }),
  targetScoreIncrease: z.number().default(200),
  targetTimeframeMonths: z.number().default(6),
  executiveSummary: z.string(),
  creditFactors: z.array(CreditFactorSchema),
  negativeItems: z.array(NegativeItemSchema),
  budgetCategories: z.array(BudgetCategorySchema),
  totalMonthlyIncome: z.number(),
  totalMonthlyExpenses: z.number(),
  monthlyCashFlow: z.number(),
  debtPayoffPlan: z.array(DebtPayoffItemSchema),
  payoffStrategy: z.enum(["avalanche", "snowball", "hybrid"]),
  payoffStrategyRationale: z.string(),
  sixMonthPlan: z.array(MonthPlanSchema),
  letters: z.array(LetterSchema),
  riskFlags: z.array(z.string()).describe("Anything concerning found in the docs: e.g. potential fraud, identity theft signs, overdraft patterns, gambling patterns"),
  disclaimers: z.array(z.string()),
});
export type ClientPlan = z.infer<typeof ClientPlanSchema>;

export const STANDARD_DISCLAIMERS = [
  "This plan is educational financial guidance, not legal, tax, or investment advice, and is not a substitute for consultation with a licensed attorney, CPA, or financial advisor.",
  "We are not a Credit Repair Organization (CRO). Any dispute, goodwill, or validation letters generated here are drafts for your own review and must be sent by you, in your own name — we do not contact bureaus or creditors on your behalf.",
  "Credit score outcomes depend on factors outside this plan's control (creditor/bureau decisions, timing, your ongoing financial behavior, and information not visible in the documents provided). The 200-point / 6-month target is a goal to plan toward, not a guaranteed result.",
  "This analysis is based solely on the documents you provided and may not reflect your complete credit or financial picture.",
];
