import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import ClientAnalyzeForm from "@/components/ClientAnalyzeForm";

export default async function AnalyzeClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id }, select: { id: true, fullName: true } });
  if (!client) notFound();

  return (
    <>
      <PageHeader
        title={`Generate plan — ${client.fullName}`}
        description="Upload a credit report and 1–3 recent bank statements (PDF)"
      />
      <div className="flex-1 px-6 py-6 md:px-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
            <p className="font-semibold">Before you upload:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              <li>
                Only the extracted, structured plan is stored — the raw documents are
                processed in memory and discarded after analysis.
              </li>
              <li>
                This produces educational guidance, not legal, tax, or investment advice,
                and does not guarantee any specific score outcome.
              </li>
              <li>
                Letters generated are drafts for the client to personalize and send
                themselves.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ClientAnalyzeForm clientId={client.id} />
          </div>
        </div>
      </div>
    </>
  );
}
