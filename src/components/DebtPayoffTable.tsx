import { DebtPayoffItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function DebtPayoffTable({
  items,
  strategy,
  rationale,
}: {
  items: DebtPayoffItem[];
  strategy: string;
  rationale: string;
}) {
  const sorted = items.slice().sort((a, b) => a.payoffOrderRank - b.payoffOrderRank);

  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">
        <span className="font-semibold capitalize">{strategy}</span> strategy —{" "}
        {rationale}
      </p>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Order</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Creditor</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">Balance</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">APR</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">Recommended payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((d) => (
              <tr key={d.creditor}>
                <td className="px-3 py-2 text-gray-500">#{d.payoffOrderRank}</td>
                <td className="px-3 py-2 font-medium text-gray-900">
                  {d.creditor}
                  <div className="text-xs font-normal text-gray-500">{d.rationale}</div>
                </td>
                <td className="px-3 py-2 text-right text-gray-700">{formatCurrency(d.balance)}</td>
                <td className="px-3 py-2 text-right text-gray-700">
                  {d.apr !== undefined ? `${d.apr}%` : "—"}
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-900">
                  {formatCurrency(d.recommendedMonthlyPayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
