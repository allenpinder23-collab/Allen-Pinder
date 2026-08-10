"use client";

import { useState } from "react";
import { Letter } from "@/lib/types";

const TYPE_LABELS: Record<Letter["type"], string> = {
  dispute: "Dispute letter",
  goodwill: "Goodwill letter",
  debt_validation: "Debt validation request",
  pay_for_delete: "Pay-for-delete request",
};

export default function LettersPanel({ letters }: { letters: Letter[] }) {
  const [openId, setOpenId] = useState<string | null>(letters[0]?.id ?? null);

  if (letters.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No letters were recommended based on the items found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        These are drafts. The client should review, fill in their own
        details, and send each one themselves.
      </p>
      {letters.map((l) => (
        <div key={l.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpenId(openId === l.id ? null : l.id)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-sm font-semibold text-slate-900">
              {TYPE_LABELS[l.type]} — {l.recipient}
            </span>
            <span className="text-xs text-slate-400">{openId === l.id ? "Hide" : "Show"}</span>
          </button>
          {openId === l.id && (
            <div className="border-t border-slate-100 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">Subject: {l.subject}</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-slate-700">
                {l.body}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
