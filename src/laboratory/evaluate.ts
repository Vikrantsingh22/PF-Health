import type { ActorAction, EvidenceEdge, EvidenceNode, LaboratoryAssessment, LaboratoryCheck, LaboratoryIssue, LaboratoryScenario } from "@/laboratory/types";

const SOURCES = { R001: ["SRC-001", "SRC-002"], R002: ["SRC-003"], R003: ["SRC-004"] } as const;
const LABELS = { R001: "Previous employment exit information", R002: "Employment chronology", R003: "Transfer account continuity" } as const;

function overlappingEmploymentIds(employments: LaboratoryScenario["employments"]): string[] {
  const affected = new Set<string>();
  for (let leftIndex = 0; leftIndex < employments.length; leftIndex += 1) {
    const left = employments[leftIndex];
    if (left.status === "PREVIOUS" && left.exitDate === null) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < employments.length; rightIndex += 1) {
      const right = employments[rightIndex];
      if (right.status === "PREVIOUS" && right.exitDate === null) continue;
      const leftEnd = left.status === "CURRENT" ? null : left.exitDate;
      const rightEnd = right.status === "CURRENT" ? null : right.exitDate;
      const overlaps = (rightEnd === null || left.startDate < rightEnd) && (leftEnd === null || right.startDate < leftEnd);
      if (overlaps) {
        affected.add(left.employmentId);
        affected.add(right.employmentId);
      }
    }
  }
  return [...affected];
}

export function evaluateLaboratory(scenario: LaboratoryScenario, snapshotVersion: number, now = new Date().toISOString()): LaboratoryAssessment {
  const previous = scenario.employments.filter(({ status }) => status === "PREVIOUS");
  const current = scenario.employments.filter(({ status }) => status === "CURRENT");
  const missing = previous.filter(({ exitDate, exitReason }) => !exitDate || !exitReason);
  const overlapIds = current.length === 1 ? overlappingEmploymentIds(scenario.employments) : [];
  const groups = new Set(scenario.employments.map(({ accountGroup }) => accountGroup));
  const checks: LaboratoryCheck[] = [
    { ruleId: "R001", ruleVersion: 1, label: LABELS.R001, status: previous.length === 0 ? "UNKNOWN" : missing.length ? "FAIL" : "PASS", reasonCode: previous.length === 0 ? "NO_PREVIOUS_EMPLOYMENT" : missing.length ? "EXIT_INFORMATION_INCOMPLETE" : "EXIT_INFORMATION_COMPLETE", affectedEmploymentIds: missing.map(({ employmentId }) => employmentId), sourceIds: [...SOURCES.R001] },
    { ruleId: "R002", ruleVersion: 2, label: LABELS.R002, status: current.length !== 1 ? "UNKNOWN" : overlapIds.length ? "FAIL" : missing.length ? "UNKNOWN" : "PASS", reasonCode: current.length !== 1 ? "CURRENT_EMPLOYMENT_AMBIGUOUS" : overlapIds.length ? "EMPLOYMENT_DATE_RANGES_OVERLAP" : missing.length ? "CHRONOLOGY_EVIDENCE_INCOMPLETE" : "CHRONOLOGY_CLEAR", affectedEmploymentIds: overlapIds, sourceIds: [...SOURCES.R002] },
    { ruleId: "R003", ruleVersion: 1, label: LABELS.R003, status: scenario.workflow === "GENERAL_HEALTH" ? "PASS" : groups.size > 1 ? "FAIL" : "PASS", reasonCode: scenario.workflow === "GENERAL_HEALTH" ? "NOT_APPLICABLE_TO_GENERAL_HEALTH" : groups.size > 1 ? "MULTIPLE_ACCOUNT_GROUPS" : "SINGLE_ACCOUNT_GROUP", affectedEmploymentIds: groups.size > 1 ? scenario.employments.map(({ employmentId }) => employmentId) : [], sourceIds: [...SOURCES.R003] },
  ];
  const issues: LaboratoryIssue[] = [];
  for (const employment of missing) issues.push({ issueId: `issue_r001_${snapshotVersion}_${employment.employmentId}`, ruleId: "R001", severity: "ATTENTION", title: `${employment.employerLabel} is missing exit information`, affectedEmploymentIds: [employment.employmentId] });
  if (checks[1].status === "FAIL") issues.push({ issueId: `issue_r002_${snapshotVersion}`, ruleId: "R002", severity: "REVIEW_REQUIRED", title: "Employment dates overlap and require review", affectedEmploymentIds: checks[1].affectedEmploymentIds });
  if (checks[2].status === "FAIL") issues.push({ issueId: `issue_r003_${snapshotVersion}`, ruleId: "R003", severity: "BLOCKER", title: "Selected transfer scenario is blocked by split synthetic accounts", affectedEmploymentIds: checks[2].affectedEmploymentIds });
  const outcome = issues.some(({ severity }) => severity === "BLOCKER") ? "BLOCKED" : issues.some(({ severity }) => severity === "ATTENTION") ? "NEEDS_ATTENTION" : issues.some(({ severity }) => severity === "REVIEW_REQUIRED") || checks.some(({ status }) => status === "UNKNOWN") ? "REVIEW_REQUIRED" : "HEALTHY";
  const actions: ActorAction[] = [];
  for (const employment of missing) actions.push({ actionId: `action-r001-${employment.employmentId}`, actor: "MEMBER", title: `Complete the exit for ${employment.employerLabel}`, description: "Review the chronology, then confirm an exact synthetic exit date and reason. Previous employer or EPFO review may be needed.", kind: "SIMULATE_EXIT", employmentIds: [employment.employmentId] });
  if (issues.some(({ ruleId }) => ruleId === "R002")) actions.push({ actionId: "action-r002", actor: "PREVIOUS_EMPLOYER", title: "Review the conflicting dates", description: "Compare the conflicting employment start and exit dates. PF Health will not choose which date is correct.", kind: "REVIEW", employmentIds: checks[1].affectedEmploymentIds });
  if (issues.some(({ ruleId }) => ruleId === "R003")) actions.push({ actionId: "action-r003", actor: "MEMBER", title: "Consolidate the synthetic accounts", description: "Confirm reassignment to one synthetic account group, with employer or EPFO alternatives if needed.", kind: "SIMULATE_ACCOUNT_LINK", employmentIds: checks[2].affectedEmploymentIds });

  const nodes: EvidenceNode[] = scenario.employments.map((item) => ({ id: `employment:${item.employmentId}`, type: "EMPLOYMENT", label: item.employerLabel }));
  const edges: EvidenceEdge[] = [];
  for (const item of scenario.employments) {
    for (const [key, value] of [["start", item.startDate], ["exit", item.exitDate ?? "missing"], ["account", `Synthetic account ${item.accountGroup}`]]) {
      const id = `fact:${item.employmentId}:${key}`; nodes.push({ id, type: "FACT", label: `${key}: ${value}` }); edges.push({ id: `edge:${item.employmentId}:${key}`, from: `employment:${item.employmentId}`, to: id, type: "SUPPLIES_FACT" });
    }
  }
  for (const check of checks) { const id = `check:${check.ruleId}`; nodes.push({ id, type: "CHECK", label: `${check.ruleId} · ${check.label}` }); for (const employmentId of (check.affectedEmploymentIds.length ? check.affectedEmploymentIds : scenario.employments.map(({ employmentId }) => employmentId))) edges.push({ id: `edge:${employmentId}:${check.ruleId}`, from: `employment:${employmentId}`, to: id, type: "EVALUATED_BY" }); for (const sourceId of check.sourceIds) { const sid = `source:${sourceId}`; if (!nodes.some(({ id: nodeId }) => nodeId === sid)) nodes.push({ id: sid, type: "SOURCE", label: sourceId }); edges.push({ id: `edge:${check.ruleId}:${sourceId}`, from: id, to: sid, type: "SUPPORTED_BY" }); } }
  for (const issue of issues) { const id = `issue:${issue.issueId}`; nodes.push({ id, type: "ISSUE", label: issue.title }); edges.push({ id: `edge:${issue.ruleId}:${issue.issueId}`, from: `check:${issue.ruleId}`, to: id, type: "EMITS" }); }
  for (const action of actions) { const actorId = `actor:${action.actor}`; const actionId = `action:${action.actionId}`; if (!nodes.some(({ id }) => id === actorId)) nodes.push({ id: actorId, type: "ACTOR", label: action.actor.replaceAll("_", " ") }); nodes.push({ id: actionId, type: "ACTION", label: action.title }); edges.push({ id: `edge:${action.actionId}:owner`, from: actorId, to: actionId, type: "OWNED_BY" }); }
  const trace = checks.map((check) => `${check.ruleId} read ${check.affectedEmploymentIds.length || scenario.employments.length} employment record(s) and returned ${check.status}: ${check.reasonCode}.`);
  return { assessmentId: `lab_assessment_${crypto.randomUUID()}`, ruleSet: "PF_LAB@1", snapshotVersion, outcome, checks, issues, evidenceGraph: { nodes, edges, trace }, actorPlan: actions, evaluatedAt: now };
}
