import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiAdminAuth, hashPassword, logAudit } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = await checkApiAdminAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, lockedUntil: true },
  });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = await checkApiAdminAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const admin = auth.user;

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const role = body?.role === "admin" ? "admin" : "advisor";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (password.length < 10) {
    return NextResponse.json({ error: "Password must be at least 10 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  await logAudit({
    userId: admin.id,
    action: "advisor_created",
    targetType: "user",
    targetId: user.id,
    metadata: { role },
  });

  return NextResponse.json({ user }, { status: 201 });
}
