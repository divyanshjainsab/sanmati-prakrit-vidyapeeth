import { z } from "zod";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/Tenant";
import { verifyPassword } from "@/lib/password";
import { signSession, verifySession } from "@/lib/session";

const SESSION_COOKIE = "session";

export const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type TenantAuthDoc = { adminUsername?: string; adminPasswordHash?: string } | null;

/** Verify a login against the tenant's stored admin credentials. */
export async function authenticateTenant(
  tenant: string,
  username: string,
  password: string
): Promise<boolean> {
  await dbConnect();
  const doc = (await Tenant.findById(tenant).lean()) as TenantAuthDoc;

  if (!doc) {
    // No such tenant. Run a throwaway hash compare so timing doesn't reveal
    // whether the tenant exists.
    verifyPassword(password, "scrypt$00$00");
    return false;
  }

  if (doc.adminUsername !== username) {
    verifyPassword(password, doc.adminPasswordHash);
    return false;
  }

  return verifyPassword(password, doc.adminPasswordHash);
}

/** Mint a Set-Cookie string carrying a signed, tenant-scoped session token. */
export function loginCookie(tenant: string): string {
  const token = signSession(tenant);
  // Host-only cookie (no Domain attribute) so each subdomain keeps its own
  // session; the token also carries the tenant claim as a second check.
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
}

export function logoutCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
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

/** True when the parsed cookies hold a valid session for `tenant` (Pages Router). */
export function isAuthenticatedFromCookies(
  cookies: Partial<Record<string, string>> | undefined,
  tenant: string
): boolean {
  const payload = verifySession(cookies?.[SESSION_COOKIE]);
  return payload?.tenant === tenant;
}

/** True when the raw Cookie header holds a valid session for `tenant` (App Router). */
export function isAuthenticatedFromCookieHeader(
  cookieHeader: string | null,
  tenant: string
): boolean {
  const payload = verifySession(readCookie(cookieHeader, SESSION_COOKIE));
  return payload?.tenant === tenant;
}
