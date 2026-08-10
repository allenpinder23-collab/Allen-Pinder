import { NextRequest, NextResponse } from "next/server";
import { ClientPlanSchema } from "@/lib/types";
import { buildBudgetWorkbook } from "@/lib/xlsxExport";
import { checkApiAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => null);
  const parsed = ClientPlanSchema.safeParse(body?.plan);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
  }

  const buffer = await buildBudgetWorkbook(parsed.data);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="budget.xlsx"',
    },
  });
}
