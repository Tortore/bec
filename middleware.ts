import { NextResponse, type NextRequest } from "next/server";
import { adminCookieName, verifySessionToken } from "@/lib/cms/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/connexion")) return NextResponse.next();

  const session = await verifySessionToken(request.cookies.get(adminCookieName)?.value);
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
