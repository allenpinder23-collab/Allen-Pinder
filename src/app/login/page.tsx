import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/clients");

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-900/50">
            CB
          </div>
          <h1 className="text-xl font-semibold text-white">Credit &amp; Budget Builder</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your advisor workspace</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-white p-7 shadow-2xl shadow-black/40">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Internal tool. Access is limited to authorized advisors.
        </p>
      </div>
    </main>
  );
}
