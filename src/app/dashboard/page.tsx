"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClientPlan } from "@/lib/types";
import { loadPlanFromSession } from "@/lib/planUtils";
import PlanSummaryHeader from "@/components/PlanSummaryHeader";
import RiskFlags from "@/components/RiskFlags";
import CreditFactorCards from "@/components/CreditFactorCards";
import NegativeItemsTable from "@/components/NegativeItemsTable";
import BudgetChart from "@/components/BudgetChart";
import DebtPayoffTable from "@/components/DebtPayoffTable";
import ActionPlanTimeline from "@/components/ActionPlanTimeline";
import LettersPanel from "@/components/LettersPanel";
import ExportButtons from "@/components/ExportButtons";

export default function DashboardPage() {
  const [plan, setPlan] = useState<ClientPlan | null | undefined>(undefined);

  useEffect(() => {
    // One-time sync read of sessionStorage on mount (client-only store).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(loadPlanFromSession());
  }, []);

  if (plan === undefined) {
    return <main className="flex-1 bg-gray-50 p-8 text-sm text-gray-500">Loading…</main>;
  }

  if (plan === null) {
    return (
      <main className="flex-1 bg-gray-50 p-8">
        <p className="text-sm text-gray-600">
          No plan found in this session. Generate one first.
        </p>
        <Link href="/" className="mt-2 inline-block text-sm font-medium text-indigo-600">
          &larr; Back to upload
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-50 pb-16">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-indigo-600">
            &larr; New plan
          </Link>
          <ExportButtons plan={plan} />
        </div>

        <PlanSummaryHeader plan={plan} />
        <RiskFlags flags={plan.riskFlags} />

        <Section title="Credit factors">
          <CreditFactorCards factors={plan.creditFactors} />
        </Section>

        <Section title="Negative items & recommended strategy">
          <NegativeItemsTable items={plan.negativeItems} />
        </Section>

        <Section title="Monthly budget">
          <BudgetChart categories={plan.budgetCategories} />
        </Section>

        <Section title="Debt payoff plan">
          <DebtPayoffTable
            items={plan.debtPayoffPlan}
            strategy={plan.payoffStrategy}
            rationale={plan.payoffStrategyRationale}
          />
        </Section>

        <Section title="6-month action plan">
          <ActionPlanTimeline months={plan.sixMonthPlan} />
        </Section>

        <Section title="Draft letters">
          <LettersPanel letters={plan.letters} />
        </Section>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-xs font-semibold text-gray-700">Disclaimers</h3>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            {plan.disclaimers.map((d, i) => (
              <li key={i} className="text-xs text-gray-500">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
