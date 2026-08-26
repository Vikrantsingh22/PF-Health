import Link from "next/link";
import styles from "@/components/laboratory.module.css";

const CASE_FILE_TAB_PATH = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";

export default function Home() {
  return <div className={styles.site}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>PF Health</Link>
      <span>Independent prototype</span>
    </header>
    <div className={styles.notice}>Synthetic records only · No EPFO connection</div>
    <main className={styles.landing} id="main-content">
      <section className={styles.landingHero}>
        <div className={styles.landingHeroCopy}>
          <h1>See the problem. Change the record. Trace the result.</h1>
          <p>Explore PF Health through a guided case or take control of a fictional employment history. Every outcome stays deterministic, inspectable, and safely synthetic.</p>
        </div>
        <aside className={styles.landingRoute} aria-labelledby="evidence-route-heading">
          <h2 id="evidence-route-heading">Every path keeps the evidence visible.</h2>
          <ol aria-label="PF Health evidence route">
            <li><span>Record</span><strong>Fictional employment facts</strong></li>
            <li><span>Checks</span><strong>Versioned deterministic rules</strong></li>
            <li><span>Action</span><strong>Actor-owned correction plan</strong></li>
          </ol>
        </aside>
      </section>
      <section className={styles.pathSection} aria-labelledby="choose-path-heading">
        <div className={styles.landingIntro}>
          <h2 id="choose-path-heading">Choose how you want to inspect the record.</h2>
          <p>Start with Ravi’s guided case file, or open the laboratory to alter a fictional employment history and watch the evidence change.</p>
        </div>
        <div className={styles.pathGrid}>
          <Link className={styles.path} href="/guided-ravi">
            <span className={styles.pathTab} data-path-tab="guided" aria-hidden="true"><svg viewBox="0 0 145 26" focusable="false"><path d={CASE_FILE_TAB_PATH}/></svg></span>
            <h3>Follow Ravi’s guided case</h3>
            <p>Learn the complete 4 of 5 → correction → 5 of 5 journey.</p>
            <strong>Open Guided Ravi →</strong>
          </Link>
          <Link className={`${styles.path} ${styles.labPath}`} href="/laboratory">
            <span className={styles.pathTab} data-path-tab="laboratory" aria-hidden="true"><svg viewBox="0 0 145 26" focusable="false"><path d={CASE_FILE_TAB_PATH}/></svg></span>
            <h3>Build a synthetic PF history</h3>
            <p>Edit employments, trigger deterministic outcomes, inspect evidence, and simulate supported corrections.</p>
            <strong>Enter PF Record Laboratory →</strong>
          </Link>
        </div>
      </section>
      <p className={styles.boundary}>No UAN, Aadhaar, bank details, credentials, personal names, or real employer information are accepted.</p>
    </main>
  </div>;
}
