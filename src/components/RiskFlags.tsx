export default function RiskFlags({ flags }: { flags: string[] }) {
  if (flags.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-800">Flags for advisor review</h3>
      <ul className="mt-1 list-disc pl-4 space-y-0.5">
        {flags.map((f, i) => (
          <li key={i} className="text-xs text-red-700">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
