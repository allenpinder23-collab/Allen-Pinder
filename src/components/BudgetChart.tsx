"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BudgetCategory } from "@/lib/types";
import { expenseBreakdown } from "@/lib/planUtils";
import { formatCurrency } from "@/lib/format";

const COLORS = [
  "#4f46e5",
  "#0ea5e9",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#65a30d",
];

export default function BudgetChart({ categories }: { categories: BudgetCategory[] }) {
  const data = expenseBreakdown(categories).map((c) => ({
    name: c.category,
    value: c.monthlyAmount,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No budget categories available.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => `${entry.name}`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
