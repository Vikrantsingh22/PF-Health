"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ZodType } from "zod";

import {
  apiErrorSchema,
  appliedSimulationResponseSchema,
  assessmentSchema,
  auditResponseSchema,
  confirmationResponseSchema,
  issueDetailResponseSchema,
  resetResponseSchema,
  resolutionResponseSchema,
  type ApiErrorResponse,
  type AppliedSimulationResponse,
  type AuditResponse,
  type ConfirmationResponse,
  type IssueDetailResponse,
  type ResetResponse,
} from "@/application/api/schemas";
import {
  ArrowIcon,
  AttentionIcon,
  CheckIcon,
  ClockIcon,
  EvidenceIcon,
  InfoIcon,
  OwnerIcon,
  RefreshIcon,
  RouteIcon,
  ShieldIcon,
} from "@/components/icons";
import styles from "@/components/pf-health-app.module.css";
import type { AuditEvent, HealthAssessment, HealthCheckResult } from "@/domain/model/types";

const CHECK_LABELS: Readonly<Record<HealthCheckResult["checkId"], string>> = Object.freeze({
  D001: "Sample record format",
  D002: "Member profile present",
  D003: "Current employment present",
  D004: "Previous employment start information",
  R001: "Previous employment exit information",
});

const EVENT_LABELS: Readonly<Record<AuditEvent["type"], string>> = Object.freeze({
  DEMO_RESET: "Sample record reset",
  MEMBER_LOADED: "Sample record loaded",
  ASSESSMENT_COMPLETED: "Supported checks completed",
  ISSUE_VIEWED: "Issue reviewed",
  RESOLUTION_OPENED: "Resolution started",
  ACTION_SELECTED: "Simulated action selected",
  SIMULATION_CONFIRMED: "Synthetic change confirmed",
  SYNTHETIC_CORRECTION_APPLIED: "Synthetic correction applied",
  REVALIDATION_COMPLETED: "Record revalidated",
});

const PROPOSED_CHANGE = Object.freeze({
  employmentId: "employment_previous_01",
  expectedSnapshotVersion: 1,
  exitDate: "2025-06-30",
  exitReason: "CESSATION_SHORT_SERVICE",
});

type Screen = "welcome" | "loading" | "summary" | "confirmation" | "revalidating" | "healthy" | "timeline" | "error";

interface AppError {
  readonly message: string;
  readonly requestId?: string;
}

function isApiError(value: unknown): value is ApiErrorResponse {
  return apiErrorSchema.safeParse(value).success;
}

async function apiFetch<T>(url: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const payload: unknown = await response.json();
  if (!response.ok) {
    if (isApiError(payload)) {
      throw Object.assign(new Error(payload.error.message), { requestId: payload.error.requestId });
    }
    throw new Error("The sample workflow could not be completed.");
  }
  return schema.parse(payload);
}

function errorFrom(error: unknown): AppError {
  if (error instanceof Error) {
    const requestId = "requestId" in error && typeof error.requestId === "string" ? error.requestId : undefined;
    return { message: error.message, requestId };
  }
  return { message: "The sample workflow could not be completed." };
}

function statusText(status: HealthCheckResult["status"]): string {
  if (status === "PASS") return "Healthy";
  if (status === "FAIL") return "Needs attention";
  return "Could not confirm";
}

function CheckRow({ check, index, changed }: { readonly check: HealthCheckResult; readonly index: number; readonly changed?: boolean }) {
  const stateClass = check.status === "PASS"
    ? changed ? styles.healthyChange : styles.pass
    : check.status === "FAIL" ? styles.attention : styles.unknown;
  const StatusIcon = check.status === "PASS" ? CheckIcon : AttentionIcon;
  return (
    <li className={`${styles.checkRow} ${stateClass}`}>
      <span className={styles.checkIndex}>{String(index + 1).padStart(2, "0")}</span>
      <StatusIcon className={styles.statusIcon} />
      <span className={styles.checkLabel}>
        {CHECK_LABELS[check.checkId]}
        <span className={styles.checkStatus}>{statusText(check.status)}</span>
      </span>
    </li>
  );
}

function AppHeader() {
  return (
    <>
      <header className={styles.header}>
        <p className={styles.brand}>PF Health</p>
        <p className={styles.prototype}>Independent prototype</p>
      </header>
      <div className={styles.notice} role="note"><InfoIcon /><span>Synthetic sample · No EPFO connection</span></div>
    </>
  );
}

function PrimaryButton({ children, onClick, disabled }: { readonly children: ReactNode; readonly onClick: () => void; readonly disabled?: boolean }) {
  return <button className={styles.primaryButton} disabled={disabled} onClick={onClick} type="button"><span>{children}</span><ArrowIcon /></button>;
}

function Limitation() {
  return <p className={styles.limitation}><ShieldIcon /><span>This does not guarantee a transfer or claim outcome.</span></p>;
}

function CaseFile({ assessment, issueDetail, changed = false, children }: { readonly assessment: HealthAssessment; readonly issueDetail?: IssueDetailResponse; readonly changed?: boolean; readonly children?: ReactNode }) {
  const healthy = assessment.status === "HEALTHY";
  return (
    <>
      <section aria-labelledby="health-result" className={styles.caseFile}>
        <div className={styles.fileSummary}>
          <p className={styles.recordName}>Ravi&apos;s sample record</p>
          <h1 className={styles.score} id="health-result">{assessment.passedChecks} of {assessment.totalChecks} checks look healthy</h1>
          <p className={styles.summaryCopy}>
            {healthy
              ? "No known blockers were detected by the checks supported in this prototype."
              : assessment.status === "REVIEW_REQUIRED"
                ? "We could not confirm every supported check from the available sample data."
                : "One item needs attention before the supported online-transfer scenario."}
          </p>
        </div>
        <ol aria-label="Supported record checks" className={styles.checks}>
          {assessment.checks.map((check, index) => <CheckRow changed={changed && check.checkId === "R001"} check={check} index={index} key={check.checkId} />)}
        </ol>
      </section>
      {issueDetail ? <IssueDossier detail={issueDetail} /> : null}
      {children}
    </>
  );
}

function GuidanceRow({ icon, title, children }: { readonly icon: ReactNode; readonly title: string; readonly children: ReactNode }) {
  return <div className={styles.guidanceRow}><span className={styles.guidanceIcon}>{icon}</span><div><h3>{title}</h3><p>{children}</p></div></div>;
}

function IssueDossier({ detail }: { readonly detail: IssueDetailResponse }) {
  return (
    <section aria-labelledby="issue-title" className={styles.dossier}>
      <div className={styles.issueHeading}><span aria-hidden="true" className={styles.issueDot} /><h2 id="issue-title">{detail.copy.title}</h2></div>
      <div className={styles.guidanceList}>
        <GuidanceRow icon={<RouteIcon />} title="Why this matters">{detail.copy.impact}</GuidanceRow>
        <GuidanceRow icon={<OwnerIcon />} title="Who needs to act">{detail.copy.owner}</GuidanceRow>
      </div>
      <details className={styles.evidence}>
        <summary><span className={styles.guidanceIcon}><EvidenceIcon /></span><span>Why we&apos;re saying this</span><ArrowIcon className={styles.chevron} /></summary>
        <div className={styles.evidenceBody}>
          <p>Rule R001 version 1 · Deterministic fallback explanation</p>
          <ul className={styles.sourceList}>
            {detail.sources.map((source) => <li key={source.sourceId}><a href={source.url} rel="noreferrer" target="_blank">{source.title} (official source)</a></li>)}
          </ul>
          <p>{detail.copy.limitation}</p>
        </div>
      </details>
    </section>
  );
}

export function PFHealthApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [demo, setDemo] = useState<ResetResponse | null>(null);
  const [issueDetail, setIssueDetail] = useState<IssueDetailResponse | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationResponse["confirmation"] | null>(null);
  const [resolutionId, setResolutionId] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedSimulationResponse | null>(null);
  const [events, setEvents] = useState<AuditResponse["events"]>([]);
  const [phase, setPhase] = useState(0);
  const [appError, setAppError] = useState<AppError | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => { if (screen !== "welcome") mainRef.current?.focus(); }, [screen]);

  async function loadSample() {
    setScreen("loading");
    setAppError(null);
    try {
      const resetData = await apiFetch("/api/v1/demo/reset", resetResponseSchema, { method: "POST" });
      const issue = resetData.assessment.issues[0];
      if (resetData.assessment.status === "NEEDS_ATTENTION" && issue === undefined) throw new Error("The sample assessment did not include its supported issue.");
      const detail = issue ? await apiFetch(`/api/v1/issues/${issue.issueId}`, issueDetailResponseSchema) : null;
      setDemo(resetData);
      setIssueDetail(detail);
      setApplied(null);
      setEvents([]);
      setScreen("summary");
    } catch (error) {
      setAppError(errorFrom(error));
      setScreen("error");
    }
  }

  async function prepareSimulation() {
    const issue = demo?.assessment.issues[0];
    if (!demo || !issue) return;
    setScreen("loading");
    try {
      const opened = await apiFetch("/api/v1/resolutions", resolutionResponseSchema, { method: "POST", body: JSON.stringify({ memberId: demo.member.memberId, issueId: issue.issueId, expectedSnapshotVersion: demo.member.snapshotVersion }) });
      const selected = await apiFetch(`/api/v1/resolutions/${opened.resolution.resolutionId}/select-action`, resolutionResponseSchema, { method: "POST", body: JSON.stringify({ actionCode: "SIMULATE_EXIT_UPDATE" }) });
      const confirmationData = await apiFetch(`/api/v1/resolutions/${selected.resolution.resolutionId}/confirm-simulation`, confirmationResponseSchema, { method: "POST", body: JSON.stringify(PROPOSED_CHANGE) });
      setResolutionId(selected.resolution.resolutionId);
      setConfirmation(confirmationData.confirmation);
      setScreen("confirmation");
    } catch (error) {
      setAppError(errorFrom(error));
      setScreen("error");
    }
  }

  async function applyCorrection() {
    if (!demo || !confirmation || !resolutionId) return;
    setPhase(0);
    setScreen("revalidating");
    try {
      await new Promise((resolve) => setTimeout(resolve, 220));
      setPhase(1);
      const result = await apiFetch(`/api/v1/resolutions/${resolutionId}/apply-simulation`, appliedSimulationResponseSchema, { method: "POST", body: JSON.stringify({ ...confirmation.proposedChanges, memberId: demo.member.memberId, expectedSnapshotVersion: demo.member.snapshotVersion, confirmationToken: confirmation.confirmationToken }) });
      setPhase(2);
      const audit = await apiFetch(`/api/v1/members/${demo.member.memberId}/audit-events`, auditResponseSchema);
      await new Promise((resolve) => setTimeout(resolve, 220));
      setApplied(result);
      setEvents(audit.events);
      setScreen("healthy");
    } catch (error) {
      setAppError(errorFrom(error));
      setScreen("error");
    }
  }

  async function resetToWelcome() {
    try {
      await apiFetch("/api/v1/demo/reset", resetResponseSchema, { method: "POST" });
      setDemo(null); setIssueDetail(null); setConfirmation(null); setResolutionId(null); setApplied(null); setEvents([]); setScreen("welcome");
    } catch (error) {
      setAppError(errorFrom(error));
      setScreen("error");
    }
  }

  let content: ReactNode;
  if (screen === "welcome") {
    content = (
      <section aria-labelledby="welcome-title" className={styles.welcome}>
        <span aria-hidden="true" className={styles.welcomeTopTab} data-case-file-decoration="top-tab">
          <svg preserveAspectRatio="none" viewBox="0 0 148 26">
            <path d="M0 26L10 7C12 2.5 16.5 0 22 0H116C125 0 132 4 137 13L145 26H0Z" />
          </svg>
        </span>
        <span aria-hidden="true" className={styles.welcomeSideTab} data-case-file-decoration="side-tab">
          <svg preserveAspectRatio="none" viewBox="0 0 18 136">
            <path d="M0 0H8C13.5 0 18 4.5 18 10V116L11 136H0Z" />
          </svg>
        </span>
        <span aria-hidden="true" className={styles.welcomeSideRail} data-case-file-decoration="side-rail" />
        <h1 id="welcome-title">Check a synthetic PF record before it becomes a problem.</h1>
        <p>PF Health explains five supported checks using Ravi&apos;s fictional sample record. Nothing is sent to EPFO, an employer, or any government service.</p>
        <PrimaryButton onClick={loadSample}>Load Ravi&apos;s sample record</PrimaryButton>
      </section>
    );
  } else if (screen === "loading") {
    content = <section aria-live="polite" className={styles.statusPanel}><h1>Checking Ravi&apos;s sample record…</h1><p>Loading the synthetic snapshot and running five deterministic checks.</p><div className={styles.progress}><span className={styles.progressItem} data-active="true"><ClockIcon /> Reading sample record</span><span className={styles.progressItem}><ClockIcon /> Preparing supported checks</span></div></section>;
  } else if (screen === "summary" && demo) {
    content = <CaseFile assessment={assessmentSchema.parse(demo.assessment)} issueDetail={issueDetail ?? undefined}><PrimaryButton onClick={prepareSimulation}>Review what to do next</PrimaryButton><Limitation /></CaseFile>;
  } else if (screen === "confirmation" && confirmation) {
    content = <section aria-labelledby="confirmation-title" className={styles.statusPanel}><h1 id="confirmation-title">Confirm the exact synthetic change</h1><p>No real record will be changed. Review each field before continuing.</p><dl className={styles.confirmationFields}><div className={styles.fieldRow}><dt>Sample employment</dt><dd>Synthetic Previous Employer</dd></div><div className={styles.fieldRow}><dt>Exit date</dt><dd>{confirmation.proposedChanges.exitDate}</dd></div><div className={styles.fieldRow}><dt>Exit reason</dt><dd>End of short service (synthetic)</dd></div></dl><p className={styles.simulationNotice}>This changes only Ravi&apos;s sample record. Nothing will be sent to EPFO or an employer.</p><div className={styles.buttonStack}><button className={styles.secondaryButton} onClick={() => setScreen("summary")} type="button">Back to issue</button><PrimaryButton onClick={applyCorrection}>Apply simulated correction</PrimaryButton></div></section>;
  } else if (screen === "revalidating") {
    const phases = ["Applying the synthetic change", "Rerunning the same five checks", "Preparing the updated result"];
    content = <section aria-live="polite" className={styles.statusPanel}><h1>Rechecking the updated sample record…</h1><p>The same deterministic checks are running against snapshot 2.</p><div className={styles.progress}>{phases.map((label, index) => <span className={styles.progressItem} data-active={phase === index} key={label}>{phase > index ? <CheckIcon /> : <ClockIcon />} {label}</span>)}</div></section>;
  } else if ((screen === "healthy" || screen === "timeline") && applied) {
    content = screen === "healthy"
      ? <CaseFile assessment={applied.assessment} changed><section aria-labelledby="changed-title" className={`${styles.dossier} ${styles.healthyDossier}`}><div className={styles.issueHeading}><span aria-hidden="true" className={styles.issueDot} /><h2 id="changed-title">Ravi&apos;s exit information is now complete in the sample.</h2></div><div className={styles.guidanceList}><GuidanceRow icon={<RefreshIcon />} title="What changed">The previous employment exit date and reason were added to snapshot 2.</GuidanceRow><GuidanceRow icon={<CheckIcon />} title="Revalidation result">The same R001 check now passes. No generated text changed this result.</GuidanceRow></div></section><PrimaryButton onClick={() => setScreen("timeline")}>View activity timeline</PrimaryButton><button className={styles.ghostButton} onClick={resetToWelcome} type="button">Reset sample</button><Limitation /></CaseFile>
      : <section aria-labelledby="timeline-title" className={styles.statusPanel}><h1 id="timeline-title">Activity timeline</h1><p>Safe events from this synthetic session, in recorded order.</p><ol className={styles.timeline}>{events.map((event) => <li className={styles.timelineItem} key={event.eventId}><span aria-hidden="true" className={styles.timelineDot} /><h3>{EVENT_LABELS[event.type]}</h3><p>{event.actor === "MEMBER" ? "Ravi" : "PF Health"} · {new Date(event.occurredAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p></li>)}</ol><div className={styles.buttonStack}><button className={styles.secondaryButton} onClick={() => setScreen("healthy")} type="button">Back to healthy result</button><PrimaryButton onClick={resetToWelcome}>Reset Ravi&apos;s sample</PrimaryButton></div></section>;
  } else {
    content = <section aria-labelledby="error-title" className={`${styles.statusPanel} ${styles.errorPanel}`}><h1 id="error-title">We couldn&apos;t complete the sample journey.</h1><p>{appError?.message ?? "Reset the sample record and try again."}</p>{appError?.requestId ? <p className={styles.errorReference}>Reference: {appError.requestId}</p> : null}<PrimaryButton onClick={loadSample}>Reset and try again</PrimaryButton></section>;
  }

  return <div className={styles.app}><div className={styles.shell}><a className={styles.srOnly} href="#main-content">Skip to main content</a><AppHeader /><main className={styles.main} id="main-content" ref={mainRef} tabIndex={-1}>{content}</main></div></div>;
}
