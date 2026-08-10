import ExcelJS from "exceljs";
import { ClientPlan } from "./types";

export async function buildBudgetWorkbook(plan: ClientPlan): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Credit & Budget Builder";
  wb.created = new Date();

  const summary = wb.addWorksheet("Summary");
  summary.columns = [
    { header: "Metric", key: "metric", width: 28 },
    { header: "Value", key: "value", width: 24 },
  ];
  summary.addRows([
    { metric: "Client", value: plan.clientName || "—" },
    { metric: "Generated", value: plan.generatedDate },
    { metric: "Current score estimate", value: plan.currentScoreEstimate.range },
    { metric: "Target increase", value: `+${plan.targetScoreIncrease} pts` },
    { metric: "Target timeframe", value: `${plan.targetTimeframeMonths} months` },
    { metric: "Total monthly income", value: plan.totalMonthlyIncome },
    { metric: "Total monthly expenses", value: plan.totalMonthlyExpenses },
    { metric: "Monthly cash flow", value: plan.monthlyCashFlow },
    { metric: "Payoff strategy", value: plan.payoffStrategy },
  ]);
  summary.getRow(1).font = { bold: true };

  const budget = wb.addWorksheet("Budget");
  budget.columns = [
    { header: "Category", key: "category", width: 28 },
    { header: "Type", key: "type", width: 18 },
    { header: "Monthly amount", key: "amount", width: 16 },
    { header: "Notes", key: "notes", width: 40 },
  ];
  budget.getRow(1).font = { bold: true };
  for (const c of plan.budgetCategories) {
    budget.addRow({
      category: c.category,
      type: c.type.replace(/_/g, " "),
      amount: c.monthlyAmount,
      notes: c.notes || "",
    });
  }
  budget.getColumn("amount").numFmt = "$#,##0.00";
  const totalRow = budget.addRow({ category: "Net cash flow", type: "", amount: plan.monthlyCashFlow, notes: "" });
  totalRow.font = { bold: true };

  const debt = wb.addWorksheet("Debt Payoff Plan");
  debt.columns = [
    { header: "Order", key: "order", width: 8 },
    { header: "Creditor", key: "creditor", width: 24 },
    { header: "Balance", key: "balance", width: 14 },
    { header: "APR (%)", key: "apr", width: 10 },
    { header: "Minimum payment", key: "min", width: 16 },
    { header: "Recommended payment", key: "rec", width: 18 },
    { header: "Rationale", key: "rationale", width: 40 },
  ];
  debt.getRow(1).font = { bold: true };
  for (const d of plan.debtPayoffPlan.slice().sort((a, b) => a.payoffOrderRank - b.payoffOrderRank)) {
    debt.addRow({
      order: d.payoffOrderRank,
      creditor: d.creditor,
      balance: d.balance,
      apr: d.apr ?? "",
      min: d.minimumPayment ?? "",
      rec: d.recommendedMonthlyPayment,
      rationale: d.rationale,
    });
  }
  ["balance", "min", "rec"].forEach((key) => {
    debt.getColumn(key).numFmt = "$#,##0.00";
  });

  const planSheet = wb.addWorksheet("6-Month Plan");
  planSheet.columns = [
    { header: "Month", key: "month", width: 8 },
    { header: "Theme", key: "theme", width: 24 },
    { header: "Actions", key: "actions", width: 50 },
    { header: "Budget focus", key: "budgetFocus", width: 30 },
    { header: "Expected milestone", key: "milestone", width: 40 },
  ];
  planSheet.getRow(1).font = { bold: true };
  for (const m of plan.sixMonthPlan.slice().sort((a, b) => a.month - b.month)) {
    planSheet.addRow({
      month: m.month,
      theme: m.theme,
      actions: m.targetActions.join("; "),
      budgetFocus: m.budgetFocus,
      milestone: m.expectedMilestone,
    });
  }

  const arrayBuffer = await wb.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
