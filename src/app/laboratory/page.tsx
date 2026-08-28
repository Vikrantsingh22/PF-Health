import { LaboratoryApp } from "@/components/laboratory-app";
import { SiteHeader } from "@/components/site-header";
import { SyntheticNotice } from "@/components/synthetic-notice";
import { requirePageUser } from "@/lib/auth/current-user";
import styles from "./page.module.css";

export default async function LaboratoryPage({ searchParams }: { readonly searchParams: Promise<{ session?: string }> }) {
  await requirePageUser("/laboratory");
  const { session } = await searchParams;
  return (
    <>
      <SiteHeader wide />
      <SyntheticNotice />
      <div className={styles.application}><LaboratoryApp initialSessionId={session} /></div>
    </>
  );
}
