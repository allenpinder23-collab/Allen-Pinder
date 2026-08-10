import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiAuth, logAudit } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true } },
      plans: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          scoreRangeLabel: true,
          monthlyCashFlow: true,
          targetIncrease: true,
          generatedBy: { select: { name: true } },
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  return NextResponse.json({ client });
}

const VALID_STATUSES = ["active", "paused", "completed", "archived"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await checkApiAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const user = auth.user;
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const data: Record<string, string | null> = {};

  if (typeof body?.fullName === "string" && body.fullName.trim()) {
    data.fullName = body.fullName.trim();
  }
  if ("email" in (body ?? {})) {
    data.email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : null;
  }
  if ("phone" in (body ?? {})) {
    data.phone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
  }
  if ("notes" in (body ?? {})) {
    data.notes = typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : null;
  }
  if (typeof body?.status === "string") {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    data.status = body.status;
  }

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Client not found." }, { status: 404 });
  }

  const client = await prisma.client.update({ where: { id }, data });

  await logAudit({
    userId: user.id,
    action: "client_updated",
    targetType: "client",
    targetId: client.id,
    metadata: { fields: Object.keys(data) },
  });

  return NextResponse.json({ client });
}
