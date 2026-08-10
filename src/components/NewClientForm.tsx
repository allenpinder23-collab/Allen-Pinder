"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewClientForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create client.");
      router.push(`/clients/${data.client.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create client.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Full name" required>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
          placeholder="Jane Doe"
        />
      </Field>
      <Field label="Email" hint="optional">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="jane@example.com"
        />
      </Field>
      <Field label="Phone" hint="optional">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          placeholder="(555) 555-0100"
        />
      </Field>
      <Field label="Notes" hint="optional">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Anything worth remembering about this client's situation or goals."
        />
      </Field>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create client"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
