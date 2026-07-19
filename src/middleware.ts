import { NextRequest, NextResponse } from "next/server";
import { isAdminHost } from "@/lib/tenant";

/**
 * Host-based routing only (no DB, no crypto → edge-safe):
 *  - On the admin subdomain, serve the super-admin panel at "/".
 *  - On any other host, hide the super-admin surface (404) so tenants and the
 *    public site can never reach it by path. Auth is still enforced in the
 *    super-admin handlers themselves; this is defense-in-depth.
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

  if (
    pathname === "/superadmin" ||
    pathname.startsWith("/superadmin/") ||
    pathname.startsWith("/api/superadmin")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
