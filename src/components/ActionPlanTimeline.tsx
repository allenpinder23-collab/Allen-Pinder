import { MonthPlan } from "@/lib/types";

export default function ActionPlanTimeline({ months }: { months: MonthPlan[] }) {
  const sorted = months.slice().sort((a, b) => a.month - b.month);

  return (
    <ol className="space-y-4">
      {sorted.map((m) => (
        <li key={m.month} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-baseline gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {m.month}
            </span>
            <h3 className="text-sm font-semibold text-gray-900">{m.theme}</h3>
          </div>
          <ul className="mt-2 list-disc pl-9 space-y-0.5">
            {m.targetActions.map((a, i) => (
              <li key={i} className="text-xs text-gray-700">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-2 pl-9 text-xs text-gray-500">
            <span className="font-medium">Budget focus:</span> {m.budgetFocus}
          </p>
          <p className="mt-1 pl-9 text-xs text-gray-500">
            <span className="font-medium">Expected by end of month:</span>{" "}
            {m.expectedMilestone}
          </p>
        </li>
      ))}
    </ol>
  );
}
