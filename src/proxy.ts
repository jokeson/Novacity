import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session-jwt";

import { ROUTES } from "@/constants/routes";

const buildRedirect = (req: NextRequest, pathname: string): NextResponse => {
  const loginUrl = new URL(ROUTES.signIn, req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(loginUrl);
};

const withPathnameHeader = (req: NextRequest): Headers => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return requestHeaders;
};

export const proxy = async (req: NextRequest): Promise<NextResponse> => {
  const requestHeaders = withPathnameHeader(req);
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith(ROUTES.dashboard);
  const isAdmin = pathname.startsWith(ROUTES.admin);

  if (isDashboard) {
    if (!session) {
      return buildRedirect(req, pathname);
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isAdmin) {
    if (!session) {
      return buildRedirect(req, pathname);
    }

    if (session.role !== "admin") {
      return NextResponse.redirect(new URL(ROUTES.dashboard, req.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
