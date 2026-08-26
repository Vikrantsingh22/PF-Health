import Link from "next/link";
import styles from "@/components/laboratory.module.css";
import caseStyles from "@/components/landing-case-files.module.css";
import { SiteHeader } from "@/components/site-header";

const CASE_FILE_TAB_PATH = "M1 25L10 8C12 3.5 16.5 1 22 1H116C125 1 132 5 137 14L144 25H1Z";
const CASE_FILE_SIDE_PATH = "M0 0H8C13.5 0 18 4.5 18 10V116L11 136H0Z";

export default function Home() {
  return <div className={styles.site}>
    <SiteHeader wide />
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
        <div className={`${styles.pathGrid} ${caseStyles.pathStack}`}>
          <Link className={`${styles.path} ${caseStyles.casePath}`} href="/guided-ravi">
            <span className={caseStyles.topTab} data-path-tab="guided" aria-hidden="true"><svg viewBox="0 0 145 26" focusable="false"><path d={CASE_FILE_TAB_PATH}/></svg></span>
            <span className={caseStyles.sideTab} data-path-side-tab="guided" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 18 136" focusable="false"><path d={CASE_FILE_SIDE_PATH}/></svg></span>
            <span className={caseStyles.sideRail} data-path-side-rail="guided" aria-hidden="true" />
            <h3>Follow Ravi’s guided case</h3>
            <p>Learn the complete 4 of 5 → correction → 5 of 5 journey.</p>
            <strong>Open Guided Ravi →</strong>
          </Link>
          <Link className={`${styles.path} ${styles.labPath} ${caseStyles.casePath} ${caseStyles.inverse}`} href="/laboratory">
            <span className={caseStyles.topTab} data-path-tab="laboratory" aria-hidden="true"><svg viewBox="0 0 145 26" focusable="false"><path d={CASE_FILE_TAB_PATH}/></svg></span>
            <span className={caseStyles.sideTab} data-path-side-tab="laboratory" aria-hidden="true"><svg preserveAspectRatio="none" viewBox="0 0 18 136" focusable="false"><path d={CASE_FILE_SIDE_PATH}/></svg></span>
            <span className={caseStyles.sideRail} data-path-side-rail="laboratory" aria-hidden="true" />
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
