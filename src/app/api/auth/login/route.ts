import { NextRequest, NextResponse } from "next/server";
import { attemptLogin, logAudit, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE_SECONDS } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const result = await attemptLogin(email, password);

  if (!result.ok || !result.token || !result.user) {
    await logAudit({
      action: "login_failed",
      targetType: "user",
      metadata: { email, reason: result.reason },
    });
    const message =
      result.reason === "locked"
        ? "Too many failed attempts. This account is temporarily locked — try again in 15 minutes."
        : "Invalid email or password.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  await logAudit({ userId: result.user.id, action: "login_succeeded", targetType: "user", targetId: result.user.id });

  const res = NextResponse.json({
    user: { id: result.user.id, name: result.user.name, email: result.user.email, role: result.user.role },
  });
  res.cookies.set(SESSION_COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
  return res;
}
