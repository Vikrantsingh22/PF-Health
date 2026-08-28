import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { SiteHeader } from "@/components/site-header";
import { SyntheticNotice } from "@/components/synthetic-notice";
import { parseCodexLog } from "@/lib/codex-log";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Built with Codex | PF Health",
  description: "The verified build ledger behind PF Health.",
};

const contributionAreas = [
  ["Frame", "Turned the product brief into explicit scope, evidence, security, and execution contracts."],
  ["Build", "Implemented the deterministic rule engines, APIs, interfaces, authentication, and persistence."],
  ["Refine", "Iterated on the Case File design through browser feedback, responsive inspection, and accessibility checks."],
  ["Verify", "Ran lint, types, domain tests, Playwright journeys, security scans, and production builds in Docker."],
  ["Diagnose", "Traced OAuth continuity, history truthfulness, chronology logic, and Vercel build failures to their causes."],
  ["Ship", "Kept documentation, project state, verification evidence, and focused Git commits aligned with the product."],
] as const;

export default async function CodexPage() {
  const markdown = await readFile(path.join(process.cwd(), "CODEX_LOG.md"), "utf8");
  const log = parseCodexLog(markdown);

  return <div className={styles.page}>
    <SiteHeader wide />
    <SyntheticNotice />
    <main className={styles.main} id="main-content">
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Built with Codex</p>
        <h1>The build process is part of the proof.</h1>
        <p className={styles.lede}>PF Health was directed by a human and built in a continuous Codex collaboration. Product judgments stayed explicit; Codex helped turn them into working code, tests, evidence, and a deployable system.</p>
        <div className={styles.heroActions}>
          <a href="https://github.com/Vikrantsingh22/PF-Health" rel="noopener noreferrer" target="_blank">View source on GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <div className={styles.proofLine} aria-label="PF Health build method">
          <span>Human direction</span><i aria-hidden="true">→</i><span>Codex execution loop</span><i aria-hidden="true">→</i><span>Verified commits</span>
        </div>
      </section>

      <section className={styles.roleSection} aria-labelledby="codex-role-heading">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>How Codex was used</p>
          <h2 id="codex-role-heading">From blank repository to tested public product.</h2>
          <p>Codex accelerated implementation and verification. It does not decide PF truth: versioned deterministic rules and registered evidence remain authoritative.</p>
        </div>
        <ol className={styles.roles}>
          {contributionAreas.map(([title, description], index) => <li key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <section className={styles.ledger} aria-labelledby="build-ledger-heading">
        <div className={styles.ledgerHead}>
          <div><p className={styles.eyebrow}>Complete curated ledger</p><h2 id="build-ledger-heading">Complete build journal</h2></div>
          <p>{log.sections.length} recorded build missions</p>
        </div>
        <div className={styles.privacyNote}><strong>Public by design.</strong> This ledger records shipped work, human decisions, verification, and known risks. Raw private chats, credentials, provider tokens, and secret values are never published.</div>
        {log.introduction.map((paragraph) => <p className={styles.logIntro} key={paragraph}>{paragraph}</p>)}
        <div className={styles.timeline}>
          {log.sections.map((section, index) => <article className={styles.entry} key={`${section.title}-${index}`}>
            <div className={styles.marker} aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className={styles.entryBody}>
              <h3>{section.title}</h3>
              {section.blocks.map((block, blockIndex) => block.type === "list"
                ? <ul key={blockIndex}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
                : <p key={blockIndex}>{block.text}</p>)}
            </div>
          </article>)}
        </div>
      </section>

      <aside className={styles.close}>
        <p className={styles.eyebrow}>Transparent collaboration</p>
        <h2>Codex helped build the product. Evidence earns the trust.</h2>
        <p>Explore <a href="https://developers.openai.com/codex/">OpenAI Codex</a>, then inspect PF Health’s deterministic outcomes directly in the Laboratory.</p>
      </aside>
    </main>
  </div>;
}
