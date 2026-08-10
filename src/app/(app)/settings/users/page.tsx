import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageHeader from "@/components/PageHeader";
import NewAdvisorForm from "@/components/NewAdvisorForm";
import { formatDate } from "@/lib/format";

export default async function UsersSettingsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    redirect("/clients");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, lockedUntil: true },
  });

  return (
    <>
      <PageHeader title="Advisors" description="Manage who can access this workspace" />
      <div className="flex-1 space-y-6 px-6 py-6 md:px-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Add advisor</h2>
          <NewAdvisorForm />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Added
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-700">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-700">{u.role}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt.toISOString())}</td>
                  <td className="px-4 py-3">
                    {u.lockedUntil && u.lockedUntil > new Date() ? (
                      <span className="text-xs font-medium text-red-600">Locked</span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
