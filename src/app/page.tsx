import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900">
          Credit &amp; Budget Builder
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload a client&apos;s credit report and their last 1–3 bank
          statements (PDF). We&apos;ll generate a full budget, a credit
          factor breakdown, a prioritized action plan targeting a 200-point
          score improvement over 6 months, and draft dispute/goodwill
          letters for the client to review and send themselves.
        </p>

        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          <p className="font-semibold">Before you upload:</p>
          <ul className="mt-1 list-disc pl-4 space-y-0.5">
            <li>
              Documents are sent to Claude for analysis and are not stored on
              this server after the plan is generated. Only upload files
              you&apos;re authorized to process on the client&apos;s behalf.
            </li>
            <li>
              This tool produces educational guidance, not legal, tax, or
              investment advice. It does not guarantee any specific score
              outcome.
            </li>
            <li>
              Any letters generated are drafts — the client reviews,
              personalizes, and sends them. We do not contact bureaus or
              creditors on anyone&apos;s behalf.
            </li>
          </ul>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <UploadForm />
        </div>
      </div>
    </main>
  );
}
