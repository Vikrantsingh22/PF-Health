import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function applicationOrigin(request: Request, requestUrl: URL): string {
  if (process.env.NODE_ENV === "development") return requestUrl.origin;

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (!forwardedHost) return requestUrl.origin;

  const forwardedProtocol = request.headers.get("x-forwarded-proto") ?? "https";
  return `${forwardedProtocol}://${forwardedHost}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const origin = applicationOrigin(request, url);

  if (code) {
    const successResponse = NextResponse.redirect(new URL(next, origin));
    const supabase = await createClient(successResponse);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return successResponse;
  }

  const retry = new URL("/login", origin);
  retry.searchParams.set("error", "oauth_failed");
  retry.searchParams.set("next", next);
  return NextResponse.redirect(retry);
}
