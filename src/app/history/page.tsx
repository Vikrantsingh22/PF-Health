import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SyntheticNotice } from "@/components/synthetic-notice";
import { requirePageUser } from "@/lib/auth/current-user";
import { listGuidedRuns } from "@/persistence/guided-run-store";
import { listLaboratorySessions } from "@/persistence/laboratory-session-store";
import { deleteAllHistoryAction, deleteGuidedRunAction, deleteLaboratorySessionAction } from "./actions";
import styles from "./history.module.css";

function date(value: string): string {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

export default async function HistoryPage() {
  const user = await requirePageUser("/history");
  const [guidedRuns, laboratorySessions] = await Promise.all([
    listGuidedRuns(user.id),
    listLaboratorySessions(user.id),
  ]);
  const empty = guidedRuns.length === 0 && laboratorySessions.length === 0;

  return (
    <div className={styles.page}>
      <SiteHeader wide />
      <SyntheticNotice />
      <main className={styles.main} id="main-content">
        <header className={styles.hero}>
          <div><p className={styles.eyebrow}>Private synthetic history</p><h1>Your record experiments, kept together.</h1><p>Signed in as {user.email}. Only your account can retrieve these Guided Ravi runs and Laboratory sessions.</p></div>
          {!empty && <form action={deleteAllHistoryAction}><button className={styles.danger} type="submit">Delete all history</button></form>}
        </header>

        {empty ? <section className={styles.empty}><h2>No saved history yet.</h2><p>Complete Ravi’s guided case or run a fictional scenario in the Laboratory. Your deterministic results will appear here.</p><div><Link href="/guided-ravi">Start Guided Ravi</Link><Link href="/laboratory">Open Laboratory</Link></div></section> : (
          <div className={styles.sections}>
            <section aria-labelledby="laboratory-history"><div className={styles.sectionHead}><div><p>Editable and resumable</p><h2 id="laboratory-history">Laboratory sessions</h2></div><Link href="/laboratory">New session →</Link></div>
              <div className={styles.grid}>{laboratorySessions.map((row) => <article className={styles.card} key={row.session_id}><div className={styles.cardHead}><span>{row.outcome.replaceAll("_", " ")}</span><time dateTime={row.updated_at}>{date(row.updated_at)}</time></div><h3>{row.preset_id === "imported" ? "Imported synthetic scenario" : row.preset_id.replaceAll("-", " ")}</h3><p>{row.session.draft.employments.length} fictional employment record{row.session.draft.employments.length === 1 ? "" : "s"} · Draft {row.draft_version} · Snapshot {row.snapshot_version}</p><div className={styles.actions}><Link href={`/laboratory?session=${encodeURIComponent(row.session_id)}`}>Resume session</Link><form action={deleteLaboratorySessionAction}><input name="sessionId" type="hidden" value={row.session_id}/><button type="submit">Delete</button></form></div></article>)}</div>
            </section>
            <section aria-labelledby="guided-history"><div className={styles.sectionHead}><div><p>Completed tutorial evidence</p><h2 id="guided-history">Guided Ravi runs</h2></div><Link href="/guided-ravi">Start clean run →</Link></div>
              <div className={styles.grid}>{guidedRuns.map((row) => <article className={styles.card} key={row.run_id}><div className={styles.cardHead}><span>{row.outcome.replaceAll("_", " ")}</span><time dateTime={row.updated_at}>{date(row.updated_at)}</time></div><h3>Ravi’s synthetic case</h3><p>Snapshot {row.state.member.snapshotVersion} · {row.state.workflow.assessments.length} assessment{row.state.workflow.assessments.length === 1 ? "" : "s"} · {row.state.workflow.auditEvents.length} recorded event{row.state.workflow.auditEvents.length === 1 ? "" : "s"}</p><ol className={styles.trace}>{row.state.workflow.auditEvents.slice(-3).map((event) => <li key={event.eventId}>{event.type.replaceAll("_", " ")}</li>)}</ol><div className={styles.actions}><span>Historical run</span><form action={deleteGuidedRunAction}><input name="runId" type="hidden" value={row.run_id}/><button type="submit">Delete</button></form></div></article>)}</div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
