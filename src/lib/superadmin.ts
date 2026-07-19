import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { signSession, verifySession } from "@/lib/session";
import { isAdminHost } from "@/lib/tenant";
import { isSuperAdminPathAccessEnabled } from "@/lib/superadmin-access";

/**
 * The platform super-admin: a single operator configured via env
 * (SUPERADMIN_USERNAME / SUPERADMIN_PASSWORD). Sessions reuse the signed-token
 * mechanism with a reserved subject and a distinct cookie ("super") so a
 * super-admin session is never confused with a tenant session.
 */
export const SUPERADMIN_SUBJECT = "__super__";
const SUPER_COOKIE = "super";

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function verifySuperCredentials(username: unknown, password: unknown): boolean {
  if (typeof username !== "string" || typeof password !== "string") return false;

  const expectedUser = process.env.SUPERADMIN_USERNAME ?? "";
  const expectedPass = process.env.SUPERADMIN_PASSWORD ?? "";
  // Not configured → refuse (don't allow empty-credential login).
  if (!expectedUser || !expectedPass) return false;

  return (
    timingSafeStringEqual(username, expectedUser) && timingSafeStringEqual(password, expectedPass)
  );
}

export function superLoginCookie(): string {
  const token = signSession(SUPERADMIN_SUBJECT);
  return `${SUPER_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
}

export function superLogoutCookie(): string {
  return `${SUPER_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq > 0 && trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return undefined;
}

export function isSuperAdminFromCookieHeader(cookieHeader: string | null): boolean {
  return verifySession(readCookie(cookieHeader, SUPER_COOKIE))?.tenant === SUPERADMIN_SUBJECT;
}

export function isSuperAdminFromCookies(
  cookies: Partial<Record<string, string>> | undefined
): boolean {
  return verifySession(cookies?.[SUPER_COOKIE])?.tenant === SUPERADMIN_SUBJECT;
}

/**
 * Whether the super-admin surface may be served for this request: on the
 * admin subdomain, or anywhere when SUPERADMIN_PATH_ACCESS is enabled.
 */
export function superAdminHostAllowed(req: Request): boolean {
  return isAdminHost(req.headers.get("host")) || isSuperAdminPathAccessEnabled();
}

/**
 * Guard for super-admin API routes: the request must be allowed for this host
 * AND carry a valid super session. Returns a NextResponse to short-circuit
 * with, or null when allowed.
 */
export function requireSuperAdmin(req: Request): NextResponse | null {
  if (!superAdminHostAllowed(req)) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }
  if (!isSuperAdminFromCookieHeader(req.headers.get("cookie"))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
