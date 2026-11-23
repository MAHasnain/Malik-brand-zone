import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.replace(/\/$/, "") === "/admin/login") return NextResponse.next();

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    console.error("Missing server-side ACCESS_TOKEN_SECRET");
    return new NextResponse("Admin sign-in is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const token = request.cookies.get("accessToken")?.value;
  if (token) {
    try {
      const claims = jwt.verify(token, secret, { algorithms: ["HS256"] });
      if (typeof claims === "object" && typeof claims.exp === "number" &&
          typeof claims.id === "string" && claims.id.length > 0) {
        return NextResponse.next();
      }
    } catch {
      // Invalid, expired or not yet valid.
    }
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("from", pathname + search);
  const response = NextResponse.redirect(login);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
