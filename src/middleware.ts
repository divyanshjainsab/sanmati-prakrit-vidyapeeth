import { NextRequest, NextResponse } from "next/server";
import { isAdminHost } from "@/lib/tenant";
import { isSuperAdminPathAccessEnabled } from "@/lib/superadmin-access";

/**
 * Host-based routing only (no DB, no crypto → edge-safe):
 *  - On the admin subdomain, serve the super-admin panel at "/".
 *  - Otherwise hide the super-admin surface (404) so tenants and the public
 *    site can't reach it by path — UNLESS SUPERADMIN_PATH_ACCESS is enabled,
 *    in which case it's reachable at /superadmin on any host (still gated by
 *    the super-admin login). Auth is always re-checked in the handlers; this
 *    is defense-in-depth.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const { pathname } = req.nextUrl;

  if (isAdminHost(host)) {
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/superadmin";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const isSuperSurface =
    pathname === "/superadmin" ||
    pathname.startsWith("/superadmin/") ||
    pathname.startsWith("/api/superadmin");

  if (isSuperSurface && !isSuperAdminPathAccessEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
