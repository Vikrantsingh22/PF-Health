"use client";

import { createBrowserClient } from "@supabase/ssr";

import { publicSupabaseEnvironment } from "@/lib/supabase/environment";

export function createClient() {
  const environment = publicSupabaseEnvironment();
  return createBrowserClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
