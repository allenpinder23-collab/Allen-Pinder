"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClientAnalyzeForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [creditReport, setCreditReport] = useState<File | null>(null);
  const [statements, setStatements] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!creditReport) {
      setError("Please attach the client's credit report (PDF).");
      return;
    }
    if (statements.length === 0) {
      setError("Please attach at least one bank statement (PDF).");
      return;
    }

    const form = new FormData();
    form.append("creditReport", creditReport);
    statements.forEach((f) => form.append("bankStatements", f));

    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${clientId}/plans`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong generating the plan.");
      router.push(`/clients/${clientId}/plans/${data.planId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="creditReport">
          Credit report (PDF)
        </label>
        <input
          id="creditReport"
          type="file"
          accept="application/pdf"
          onChange={(e) => setCreditReport(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="statements">
          Last 1-3 bank statements (PDF)
        </label>
        <input
          id="statements"
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setStatements(Array.from(e.target.files ?? []).slice(0, 3))}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
        />
        {statements.length > 0 && (
          <p className="mt-1.5 text-xs text-slate-500">{statements.map((f) => f.name).join(", ")}</p>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing documents… this can take a minute" : "Generate plan"}
      </button>
    </form>
  );
}
