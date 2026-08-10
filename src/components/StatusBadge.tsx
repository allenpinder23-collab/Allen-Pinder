const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  archived: "bg-slate-100 text-slate-500 ring-slate-500/10",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.archived;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}
