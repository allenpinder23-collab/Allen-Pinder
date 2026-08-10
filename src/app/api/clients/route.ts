import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiAuth, logAudit } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const clients = await prisma.client.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: { select: { name: true } },
      plans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          createdAt: true,
          scoreRangeLabel: true,
          monthlyCashFlow: true,
          targetIncrease: true,
        },
      },
    },
  });

  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = auth.user;

  const body = await req.json().catch(() => null);
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body?.email === "string" && body.email.trim() ? body.email.trim() : null;
  const phone = typeof body?.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
  const notes = typeof body?.notes === "string" && body.notes.trim() ? body.notes.trim() : null;

  if (!fullName) {
    return NextResponse.json({ error: "Client name is required." }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { fullName, email, phone, notes, createdById: user.id },
  });

  await logAudit({
    userId: user.id,
    action: "client_created",
    targetType: "client",
    targetId: client.id,
  });

  return NextResponse.json({ client }, { status: 201 });
}
