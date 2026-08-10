import { NegativeItem } from "@/lib/types";
import { PRIORITY_COLOR } from "@/lib/planUtils";

const STRATEGY_LABELS: Record<NegativeItem["recommendedStrategy"], string> = {
  dispute_inaccuracy: "Dispute (inaccurate/unverifiable)",
  goodwill_adjustment: "Goodwill letter",
  debt_validation: "Debt validation request",
  pay_for_delete_negotiation: "Pay-for-delete negotiation",
  settle_and_document: "Settle and document",
  wait_for_reaging_off: "No action — will age off",
  no_action_accurate_and_recent: "No action — accurate & recent",
};

export default function NegativeItemsTable({ items }: { items: NegativeItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No negative items were identified in the credit report provided.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Creditor</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Issue</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Strategy</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Priority</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2 align-top font-medium text-slate-900">
                {item.creditor}
                {item.accountType && (
                  <div className="text-xs font-normal text-slate-500">{item.accountType}</div>
                )}
              </td>
              <td className="px-3 py-2 align-top text-slate-700">
                {item.description}
                <div className="mt-1 text-xs text-slate-400">
                  Reported by: {item.bureausReporting.join(", ")}
                </div>
              </td>
              <td className="px-3 py-2 align-top text-slate-700">
                {STRATEGY_LABELS[item.recommendedStrategy]}
                {item.legalNote && (
                  <div className="mt-1 text-xs text-slate-400">{item.legalNote}</div>
                )}
              </td>
              <td className="px-3 py-2 align-top">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white capitalize"
                  style={{ backgroundColor: PRIORITY_COLOR[item.priority] }}
                >
                  {item.priority}
                </span>
              </td>
              <td className="px-3 py-2 align-top text-xs text-slate-600 max-w-xs">
                {item.strategyNotes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
