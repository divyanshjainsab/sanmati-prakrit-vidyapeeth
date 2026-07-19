import { createHmac, timingSafeEqual } from "crypto";

/**
 * Minimal signed session token (HMAC-SHA256), dependency-free. Format:
 * `<base64url(payload)>.<base64url(sig)>`. The payload names the tenant the
 * session belongs to, so a cookie minted for one tenant can't be replayed
 * against another (verifySession + a tenant check at the call site).
 */
export type SessionPayload = { tenant: string; exp: number };

const DEFAULT_TTL_SECONDS = 60 * 60 * 24; // 24h

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function signSession(
  tenant: string,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
  now: number = Date.now()
): string {
  const exp = Math.floor(now / 1000) + ttlSeconds;
  const payload = Buffer.from(JSON.stringify({ tenant, exp })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySession(
  token: string | undefined | null,
  now: number = Date.now()
): SessionPayload | null {
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = sign(payload);

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let parsed: SessionPayload;
  try {
    parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof parsed.tenant !== "string" || typeof parsed.exp !== "number") return null;
  if (parsed.exp * 1000 < now) return null;

  return parsed;
}
