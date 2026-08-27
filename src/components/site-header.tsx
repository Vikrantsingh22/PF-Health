import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { currentUser } from "@/lib/auth/current-user";
import styles from "./site-header.module.css";

export async function SiteHeader({ wide = false }: { readonly wide?: boolean }) {
  const user = await currentUser();
  return (
    <header className={`${styles.header} ${wide ? styles.wide : ""}`}>
      <Link href="/" className={styles.brand}>PF Health</Link>
      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/guided-ravi">Guided Ravi</Link>
        <Link href="/laboratory">Laboratory</Link>
        {user ? <Link href="/history">My History</Link> : <Link href="/login">Sign in</Link>}
        {user && <form action={signOut}><button type="submit">Sign out</button></form>}
      </nav>
    </header>
  );
}
