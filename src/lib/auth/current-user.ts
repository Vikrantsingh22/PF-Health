import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { ApplicationError } from "@/application/errors/application-error";
import { createClient } from "@/lib/supabase/server";

export async function currentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

export async function requirePageUser(nextPath: string): Promise<User> {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireApiUser(): Promise<User> {
  const user = await currentUser();
  if (!user) throw new ApplicationError("UNAUTHENTICATED", "Sign in to continue");
  return user;
}
