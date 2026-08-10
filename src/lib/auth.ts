import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "./db";
import { generateToken, sha256Hex } from "./crypto";
import type { User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface LoginResult {
  ok: boolean;
  reason?: "invalid" | "locked";
  token?: string;
  user?: User;
}

/** Verifies credentials, applies lockout policy, and creates a session on success. */
export async function attemptLogin(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  // Constant-shape response whether or not the account exists, to avoid
  // leaking which emails are registered.
  if (!user) {
    await bcrypt.compare(password, "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsal");
    return { ok: false, reason: "invalid" };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { ok: false, reason: "locked" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: shouldLock ? 0 : attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MS) : null,
      },
    });
    return { ok: false, reason: shouldLock ? "locked" : "invalid" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  const token = generateToken();
  await prisma.session.create({
    data: {
      tokenHash: sha256Hex(token),
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  return { ok: true, token, user };
}

export async function destroySessionByToken(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash: sha256Hex(token) } });
}

async function getUserForToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256Hex(token) },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }
  return session.user;
}

/** For use in server components / route handlers that read cookies() directly. */
export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return getUserForToken(token);
}

/** For use in API route handlers that receive a NextRequest. */
export async function getSessionUserFromRequest(req: NextRequest): Promise<User | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  return getUserForToken(token);
}

export type ApiAuthResult =
  | { ok: true; user: User }
  | { ok: false; status: 401 | 403; error: string };

/**
 * For API route handlers. Returns a plain discriminated result (never a
 * NextResponse instance) so callers never depend on cross-module
 * `instanceof` checks, which are not reliable once auth.ts and the route
 * handler end up in different bundler chunks.
 *
 * Usage:
 *   const auth = await checkApiAuth(req);
 *   if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
 */
export async function checkApiAuth(req: NextRequest): Promise<ApiAuthResult> {
  const user = await getSessionUserFromRequest(req);
  if (!user) {
    return { ok: false, status: 401, error: "Authentication required." };
  }
  return { ok: true, user };
}

export async function checkApiAdminAuth(req: NextRequest): Promise<ApiAuthResult> {
  const result = await checkApiAuth(req);
  if (!result.ok) return result;
  if (result.user.role !== "admin") {
    return { ok: false, status: 403, error: "Admin access required." };
  }
  return result;
}

export const SESSION_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

export async function logAudit(params: {
  userId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: params.userId ?? null,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    },
  });
}
