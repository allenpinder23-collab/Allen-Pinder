import { NextRequest, NextResponse } from "next/server";
import { destroySessionByToken, logAudit, SESSION_COOKIE_NAME, getSessionUserFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await getSessionUserFromRequest(req);

  if (token) {
    await destroySessionByToken(token);
  }
  if (user) {
    await logAudit({ userId: user.id, action: "logout", targetType: "user", targetId: user.id });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
