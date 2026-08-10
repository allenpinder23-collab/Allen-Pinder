import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { decryptString } from "@/lib/crypto";
import { ClientPlanSchema } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import PlanSummaryHeader from "@/components/PlanSummaryHeader";
import RiskFlags from "@/components/RiskFlags";
import CreditFactorCards from "@/components/CreditFactorCards";
import NegativeItemsTable from "@/components/NegativeItemsTable";
import BudgetChart from "@/components/BudgetChart";
import DebtPayoffTable from "@/components/DebtPayoffTable";
import ActionPlanTimeline from "@/components/ActionPlanTimeline";
import LettersPanel from "@/components/LettersPanel";
import ExportButtons from "@/components/ExportButtons";

export default async function PlanViewPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const { id: clientId, planId } = await params;

  const record = await prisma.plan.findFirst({
    where: { id: planId, clientId },
    include: { client: { select: { fullName: true } } },
  });
  if (!record) notFound();

  const decrypted = decryptString({
    ciphertext: record.encryptedData,
    iv: record.iv,
    authTag: record.authTag,
  });
  const parsed = ClientPlanSchema.safeParse(JSON.parse(decrypted));
  if (!parsed.success) {
    throw new Error("Stored plan data is corrupted or no longer matches the expected schema.");
  }
  const plan = parsed.data;

  return (
    <>
      <PageHeader
        title={`Plan — ${record.client.fullName}`}
        description={
          <Link href={`/clients/${clientId}`} className="text-indigo-600 hover:text-indigo-500">
            &larr; Back to client
          </Link>
        }
        action={<ExportButtons plan={plan} />}
      />

      <div className="flex-1 space-y-6 px-6 py-6 md:px-8">
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

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-semibold text-slate-700">Disclaimers</h3>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {plan.disclaimers.map((d, i) => (
              <li key={i} className="text-xs text-slate-500">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}
