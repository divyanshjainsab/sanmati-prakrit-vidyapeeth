import { NextResponse } from "next/server";
import { isAuthenticatedFromCookieHeader } from "@/lib/auth";
import { tenantFromHost } from "@/lib/tenant";

/**
 * Success envelope for App Router route handlers. Every success response is
 * `{ success: true, ...payload }` so clients can rely on a single shape.
 */
export function apiOk(payload: Record<string, unknown> = {}, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...payload }, init);
}

/** Error envelope: `{ success: false, message }` with the given status. */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

/**
 * Guard for App Router routes that require an authenticated session for the
 * request's tenant. Returns the resolved `{ tenant }` when authed, or a 401
 * NextResponse to short-circuit with. Centralizing this keeps both the auth
 * check and the tenant resolution consistent across routes.
 */
export function requireSession(req: Request): { tenant: string } | NextResponse {
  const tenant = tenantFromHost(req.headers.get("host"));
  if (!isAuthenticatedFromCookieHeader(req.headers.get("cookie"), tenant)) {
    return apiError("Unauthorized", 401);
  }
  return { tenant };
}
