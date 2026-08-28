import { redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SyntheticNotice } from "@/components/synthetic-notice";
import { currentUser } from "@/lib/auth/current-user";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

function safeNext(value: string | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default async function LoginPage({ searchParams }: { readonly searchParams: Promise<{ next?: string; error?: string }> }) {
  const parameters = await searchParams;
  const nextPath = safeNext(parameters.next);
  if (await currentUser()) redirect(nextPath);

  return (
    <div className={styles.page}>
      <SiteHeader wide />
      <SyntheticNotice />
      <main className={styles.main} id="main-content">
        <p className={styles.eyebrow}>Private synthetic workspace</p>
        <h1>Continue securely with Google.</h1>
        <p className={styles.intro}>Use a Google account to keep your fictional PF sessions and deterministic assessment history private to you. PF Health never receives your Google password.</p>
        {parameters.error && <p className={styles.error}>Google sign-in could not be completed. Please try again.</p>}
        <LoginForm nextPath={nextPath} />
        <p className={styles.boundary}>Never enter a UAN, Aadhaar number, bank detail, credential, or real employment information.</p>
      </main>
    </div>
  );
}
