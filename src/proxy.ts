import { NextResponse, type NextRequest } from "next/server";

import { refreshSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const requestHost = request.headers.get("host")?.split(":")[0];
  if (requestHost === "0.0.0.0") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = "localhost";
    return NextResponse.redirect(canonicalUrl);
  }
  return refreshSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
