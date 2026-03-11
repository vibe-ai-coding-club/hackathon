import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/teams/login") {
    const loginUrl = new URL("/teams/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/teams/:path*"],
};
