"use client";

import { useState } from "react";
import { ClientPlan } from "@/lib/types";

async function downloadFrom(url: string, plan: ClientPlan, filename: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Export failed (${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function ExportButtons({ plan }: { plan: ClientPlan }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handle(kind: "pdf" | "xlsx" | "letters") {
    setError(null);
    setBusy(kind);
    const nameBase = (plan.clientName || "client").replace(/\s+/g, "_").toLowerCase();
    try {
      if (kind === "pdf") {
        await downloadFrom("/api/export/pdf", plan, `${nameBase}_credit_plan.pdf`);
      } else if (kind === "xlsx") {
        await downloadFrom("/api/export/xlsx", plan, `${nameBase}_budget.xlsx`);
      } else {
        await downloadFrom("/api/export/letters", plan, `${nameBase}_letters.pdf`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ExportButton label="Download PDF report" busy={busy === "pdf"} onClick={() => handle("pdf")} />
      <ExportButton label="Download budget (.xlsx)" busy={busy === "xlsx"} onClick={() => handle("xlsx")} />
      <ExportButton label="Download letters" busy={busy === "letters"} onClick={() => handle("letters")} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

function ExportButton({
  label,
  busy,
  onClick,
}: {
  label: string;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      {busy ? "Preparing…" : label}
    </button>
  );
}
