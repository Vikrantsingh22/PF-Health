"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/app/auth/actions";
import styles from "./site-header.module.css";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/guided-ravi", label: "Guided Ravi" },
  { href: "/laboratory", label: "Laboratory" },
  { href: "/codex", label: "Codex Build Journey" },
] as const;

export function SiteNavigation({ authenticated }: { readonly authenticated: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const signInNext = pathname === "/login" ? "/" : pathname;

  return <>
    <button aria-controls="primary-navigation" aria-expanded={open} aria-label={open ? "Close navigation menu" : "Open navigation menu"} className={styles.menuButton} onClick={() => setOpen((current) => !current)} onKeyDown={(event) => { if (event.key === "Escape") close(); }} type="button">
      <span aria-hidden="true" className={styles.menuIcon} data-open={open}><i/><i/><i/></span>
    </button>
    <nav aria-label="Primary navigation" className={styles.navigation} data-open={open} id="primary-navigation" onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
      {ROUTES.map(({ href, label }) => <Link aria-current={pathname === href ? "page" : undefined} href={href} key={href} onClick={close}>{label}</Link>)}
      {authenticated ? <><Link aria-current={pathname === "/history" ? "page" : undefined} href="/history" onClick={close}>My History</Link><form action={signOut}><button type="submit">Sign out</button></form></> : <Link href={`/login?next=${encodeURIComponent(signInNext)}`} onClick={close}>Sign in</Link>}
    </nav>
  </>;
}
