import Link from "next/link";
import styles from "./site-header.module.css";

export function SiteHeader({ wide = false }: { readonly wide?: boolean }) {
  return (
    <header className={`${styles.header} ${wide ? styles.wide : ""}`}>
      <Link href="/" className={styles.brand}>PF Health</Link>
      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/">Home</Link>
        <Link href="/guided-ravi">Guided Ravi</Link>
        <Link href="/laboratory">Laboratory</Link>
      </nav>
    </header>
  );
}
