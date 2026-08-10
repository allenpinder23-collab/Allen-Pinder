import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ClientPlanSchema } from "@/lib/types";
import { ClientPlanPdf } from "@/lib/pdfReport";
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

  const buffer = await renderToBuffer(ClientPlanPdf({ plan: parsed.data }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="credit_plan.pdf"',
    },
  });
}
