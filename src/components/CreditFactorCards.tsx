import { CreditFactor } from "@/lib/types";
import { FACTOR_LABELS, RATING_COLOR } from "@/lib/planUtils";

export default function CreditFactorCards({ factors }: { factors: CreditFactor[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {factors.map((f) => (
        <div key={f.factor} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              {FACTOR_LABELS[f.factor]}
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize"
              style={{ backgroundColor: RATING_COLOR[f.rating] }}
            >
              {f.rating}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-600">{f.currentState}</p>
          <ul className="mt-2 list-disc pl-4 space-y-0.5">
            {f.actionsToImprove.map((a, i) => (
              <li key={i} className="text-xs text-gray-700">
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400">
            Estimated impact: {f.estimatedImpact}
          </p>
        </div>
      ))}
    </div>
  );
}
