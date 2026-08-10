import Link from "next/link";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      plans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, scoreRangeLabel: true, monthlyCashFlow: true, targetIncrease: true },
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/clients/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
          >
            New client
          </Link>
        }
      />

      <div className="flex-1 px-6 py-6 md:px-8">
        {clients.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <Th>Client</Th>
                  <Th>Status</Th>
                  <Th>Latest score estimate</Th>
                  <Th>Monthly cash flow</Th>
                  <Th>Last plan</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => {
                  const latest = client.plans[0];
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium text-slate-900 hover:text-indigo-600"
                        >
                          {client.fullName}
                        </Link>
                        {client.email && (
                          <div className="text-xs text-slate-400">{client.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {latest?.scoreRangeLabel ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {latest?.monthlyCashFlow !== null && latest?.monthlyCashFlow !== undefined
                          ? formatCurrency(latest.monthlyCashFlow)
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {latest ? formatDate(latest.createdAt.toISOString()) : "No plan yet"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-900">No clients yet</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        Add your first client to start generating a budget and credit-building plan.
      </p>
      <Link
        href="/clients/new"
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        New client
      </Link>
    </div>
  );
}
