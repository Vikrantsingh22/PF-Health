import Link from "next/link";
import { currentUser } from "@/lib/auth/current-user";
import { SiteNavigation } from "./site-navigation";
import styles from "./site-header.module.css";

export async function SiteHeader({ wide = false }: { readonly wide?: boolean }) {
  const user = await currentUser();
  return (
    <header className={`${styles.header} ${wide ? styles.wide : ""}`}>
      <Link href="/" className={styles.brand}>PF Health</Link>
      <SiteNavigation authenticated={Boolean(user)} />
    </header>
  );
}
