import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ClientPlanSchema } from "@/lib/types";
import { LettersPdf } from "@/lib/lettersPdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ClientPlanSchema.safeParse(body?.plan);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan payload." }, { status: 400 });
  }

  const buffer = await renderToBuffer(LettersPdf({ plan: parsed.data }));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="letters.pdf"',
    },
  });
}
