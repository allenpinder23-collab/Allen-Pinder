"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["active", "paused", "completed", "archived"] as const;

export default function ClientStatusControl({
  clientId,
  status,
}: {
  clientId: string;
  status: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setSaving(true);
    try {
      await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium capitalize text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
