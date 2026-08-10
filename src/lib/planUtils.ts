import { BudgetCategory, ClientPlan, CreditFactor } from "./types";

export const FACTOR_LABELS: Record<CreditFactor["factor"], string> = {
  payment_history: "Payment History",
  credit_utilization: "Credit Utilization",
  credit_age: "Length of Credit History",
  credit_mix: "Credit Mix",
  new_credit_inquiries: "New Credit Inquiries",
  total_accounts: "Total Accounts",
};

export const RATING_COLOR: Record<CreditFactor["rating"], string> = {
  excellent: "#16a34a",
  good: "#65a30d",
  fair: "#d97706",
  poor: "#ea580c",
  critical: "#dc2626",
};

export const PRIORITY_COLOR: Record<"high" | "medium" | "low", string> = {
  high: "#dc2626",
  medium: "#d97706",
  low: "#65a30d",
};

/** Groups budget categories by type and sums the monthly amounts, for chart consumption. */
export function budgetByType(categories: BudgetCategory[]) {
  const groups: Record<BudgetCategory["type"], number> = {
    income: 0,
    fixed_expense: 0,
    variable_expense: 0,
    debt_payment: 0,
    savings: 0,
  };
  for (const c of categories) {
    groups[c.type] += c.monthlyAmount;
  }
  return groups;
}

/** Expense-side categories only (everything except income), sorted largest first — for a spending breakdown chart. */
export function expenseBreakdown(categories: BudgetCategory[]) {
  return categories
    .filter((c) => c.type !== "income")
    .slice()
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);
}

export function countByPriority(plan: ClientPlan) {
  return plan.negativeItems.reduce(
    (acc, item) => {
      acc[item.priority] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );
}

const PLAN_STORAGE_KEY = "creditagent.clientPlan";

export function savePlanToSession(plan: ClientPlan) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export function loadPlanFromSession(): ClientPlan | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(PLAN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClientPlan;
  } catch {
    return null;
  }
}
