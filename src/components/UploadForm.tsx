"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { savePlanToSession } from "@/lib/planUtils";
import { ClientPlan } from "@/lib/types";

export default function UploadForm() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
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
    if (clientName.trim()) form.append("clientName", clientName.trim());
    form.append("creditReport", creditReport);
    statements.forEach((f) => form.append("bankStatements", f));

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong generating the plan.");
      }
      savePlanToSession(data.plan as ClientPlan);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="clientName">
          Client name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="creditReport">
          Credit report (PDF)
        </label>
        <input
          id="creditReport"
          type="file"
          accept="application/pdf"
          onChange={(e) => setCreditReport(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="statements">
          Last 1-3 bank statements (PDF)
        </label>
        <input
          id="statements"
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => setStatements(Array.from(e.target.files ?? []).slice(0, 3))}
          className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
        />
        {statements.length > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {statements.map((f) => f.name).join(", ")}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing documents… this can take a minute" : "Generate plan"}
      </button>
    </form>
  );
}
