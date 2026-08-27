import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { currentUser } from "@/lib/auth/current-user";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

function safeNext(value: string | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/history";
}

export default async function LoginPage({ searchParams }: { readonly searchParams: Promise<{ next?: string; error?: string }> }) {
  const parameters = await searchParams;
  const nextPath = safeNext(parameters.next);
  if (await currentUser()) redirect(nextPath);

  return (
    <div className={styles.page}>
      <SiteHeader wide />
      <main className={styles.main} id="main-content">
        <p className={styles.eyebrow}>Private synthetic workspace</p>
        <h1>Sign in with your email.</h1>
        <p className={styles.intro}>No password is required. Your email keeps your fictional PF sessions and deterministic assessment history private to you.</p>
        {parameters.error && <p className={styles.error}>That sign-in link is invalid or expired. Request a new code.</p>}
        <LoginForm nextPath={nextPath} />
        <p className={styles.boundary}>Never enter a UAN, Aadhaar number, bank detail, credential, or real employment information.</p>
      </main>
    </div>
  );
}
