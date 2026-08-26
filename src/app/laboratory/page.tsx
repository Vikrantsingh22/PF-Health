import { LaboratoryApp } from "@/components/laboratory-app";
import { SiteHeader } from "@/components/site-header";
import styles from "./page.module.css";

export default function LaboratoryPage() {
  return (
    <>
      <SiteHeader wide />
      <div className={styles.application}><LaboratoryApp /></div>
    </>
  );
}
