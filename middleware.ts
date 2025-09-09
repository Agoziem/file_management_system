import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { COOKIE_NAME } from "./data/constants";

const authRoutes = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/verify-2FA",
  "/oauth_success"
];
const publicRoutes = [
  "/blogs",
  "/privacy-policy",
  "/terms-of-service",
];

// fullauth_token

export function middleware(req: NextRequest) {
  
  const authToken = req.cookies.get(COOKIE_NAME)?.value;
  const currentPath = req.nextUrl.pathname;

  // If token exists
  if (authToken) {
    let access_token: string;

    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(authToken);
      access_token = parsed.access_token;
    } catch {
      // Fallback: maybe it's just the access token string
      access_token = authToken;
    }
    try {
      const decoded: any = jwtDecode(access_token);

      // If token is expired
      if (decoded.exp * 1000 < Date.now()) {
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete(COOKIE_NAME); // Delete the cookie if token is expired
        return res;
      }

      // If authenticated user tries to access auth routes
      if (authRoutes.includes(currentPath)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Authenticated and accessing other routes
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid token:", err);
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete(COOKIE_NAME); // Delete the cookie if token is invalid
      return res;
    }
  }

  // Allow unauthenticated access to public or auth routes
  if (publicRoutes.includes(currentPath) || authRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // If not authenticated and accessing protected routes
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("redirect", currentPath);
  return NextResponse.redirect(loginUrl);
}


export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
