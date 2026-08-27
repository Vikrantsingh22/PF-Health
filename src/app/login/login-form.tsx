"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import styles from "./login.module.css";

function safeNext(value: string): string {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/history";
}

export function LoginForm({ nextPath }: { readonly nextPath: string }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await createClient().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setSent(true);
    setMessage("A six-digit sign-in code has been sent to your email.");
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await createClient().auth.verifyOtp({ email, token, type: "email" });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.replace(safeNext(nextPath));
    router.refresh();
  }

  return (
    <div className={styles.authPanel}>
      {!sent ? (
        <form onSubmit={requestCode}>
          <label htmlFor="auth-email">Email address</label>
          <input autoComplete="email" id="auth-email" name="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          <button disabled={busy} type="submit">{busy ? "Sending…" : "Send sign-in code"}</button>
        </form>
      ) : (
        <form onSubmit={verifyCode}>
          <p className={styles.destination}>Code sent to <strong>{email}</strong></p>
          <label htmlFor="auth-token">Six-digit code</label>
          <input autoComplete="one-time-code" id="auth-token" inputMode="numeric" maxLength={6} minLength={6} name="token" onChange={(event) => setToken(event.target.value.replace(/\D/g, ""))} pattern="[0-9]{6}" required value={token} />
          <button disabled={busy || token.length !== 6} type="submit">{busy ? "Verifying…" : "Verify and continue"}</button>
          <button className={styles.textButton} onClick={() => { setSent(false); setToken(""); setMessage(""); }} type="button">Use another email</button>
        </form>
      )}
      {message && <p aria-live="polite" className={styles.message}>{message}</p>}
    </div>
  );
}
