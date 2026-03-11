import { auth } from "@/lib/auth";

export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/team-building/login") {
    const loginUrl = new URL("/team-building/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/team-building/:path*"],
};
