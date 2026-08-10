import { ClientPlan } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PlanSummaryHeader({ plan }: { plan: ClientPlan }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {plan.clientName ? `${plan.clientName}'s Plan` : "Client Plan"}
          </h1>
          <p className="text-xs text-slate-500">Generated {formatDate(plan.generatedDate)}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">
            +{plan.targetScoreIncrease} pts
          </p>
          <p className="text-xs text-slate-500">
            target over {plan.targetTimeframeMonths} months
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Current score estimate" value={plan.currentScoreEstimate.range} />
        <Stat label="Monthly income" value={formatCurrency(plan.totalMonthlyIncome)} />
        <Stat label="Monthly expenses" value={formatCurrency(plan.totalMonthlyExpenses)} />
        <Stat
          label="Monthly cash flow"
          value={formatCurrency(plan.monthlyCashFlow)}
          positive={plan.monthlyCashFlow >= 0}
        />
      </div>

      <p className="mt-4 text-sm text-slate-700">{plan.executiveSummary}</p>
    </div>
  );
}

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-lg font-semibold ${
          positive === undefined
            ? "text-slate-900"
            : positive
              ? "text-green-600"
              : "text-red-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
