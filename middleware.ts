import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/api",
  "/_next",
  "/favicon.ico",
  "/assets",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Only protect client routes (ex: /dashboard)
  // If token cookie missing, redirect to /login
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply to routes you want. Ajuste conforme sua app.
export const config = {
  matcher: ["/dashboard/:path*", "/app/:path*"], // ajuste conforme suas rotas protegidas
};
