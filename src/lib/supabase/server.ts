import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import { publicSupabaseEnvironment } from "@/lib/supabase/environment";

export async function createClient(response?: NextResponse) {
  const cookieStore = await cookies();
  const environment = publicSupabaseEnvironment();

  return createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            if (response) {
              response.cookies.set(name, value, options);
              continue;
            }
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Server Components cannot write cookies; the proxy refresh path does.
            }
          }
        },
      },
    },
  );
}
