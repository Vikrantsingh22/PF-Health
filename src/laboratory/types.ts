export type LaboratoryWorkflow = "GENERAL_HEALTH" | "TRANSFER";
export type LaboratoryOutcome = "HEALTHY" | "NEEDS_ATTENTION" | "REVIEW_REQUIRED" | "BLOCKED";
export type LaboratoryRuleId = "R001" | "R002" | "R003";
export type LaboratoryCheckStatus = "PASS" | "FAIL" | "UNKNOWN";
export type SyntheticAccountGroup = "A" | "B" | "C";
export type LaboratoryExitReason = "RESIGNATION" | "RETIREMENT" | "CESSATION_SHORT_SERVICE" | "OTHER_SYNTHETIC";

export interface LaboratoryEmployment {
  employmentId: string;
  employerLabel: string;
  status: "CURRENT" | "PREVIOUS";
  startDate: string;
  exitDate: string | null;
  exitReason: LaboratoryExitReason | null;
  accountGroup: SyntheticAccountGroup;
}

export interface LaboratoryScenario {
  format: "pf-health-synthetic-scenario";
  formatVersion: 1;
  workflow: LaboratoryWorkflow;
  employments: LaboratoryEmployment[];
}

export interface LaboratoryCheck {
  ruleId: LaboratoryRuleId;
  ruleVersion: 1;
  label: string;
  status: LaboratoryCheckStatus;
  reasonCode: string;
  affectedEmploymentIds: string[];
  sourceIds: string[];
}

export interface LaboratoryIssue {
  issueId: string;
  ruleId: LaboratoryRuleId;
  severity: "ATTENTION" | "REVIEW_REQUIRED" | "BLOCKER";
  title: string;
  affectedEmploymentIds: string[];
}

export interface EvidenceNode { id: string; type: "EMPLOYMENT" | "FACT" | "CHECK" | "ISSUE" | "SOURCE" | "ACTOR" | "ACTION"; label: string; }
export interface EvidenceEdge { id: string; from: string; to: string; type: "SUPPLIES_FACT" | "EVALUATED_BY" | "EMITS" | "SUPPORTED_BY" | "OWNED_BY" | "RESOLVED_BY"; }
export interface ActorAction { actionId: string; actor: "MEMBER" | "PREVIOUS_EMPLOYER" | "CURRENT_EMPLOYER" | "EPFO"; title: string; description: string; kind: "FOCUS_FIELDS" | "SIMULATE_EXIT" | "SIMULATE_ACCOUNT_LINK" | "REVIEW"; employmentIds: string[]; }

export interface LaboratoryAssessment {
  assessmentId: string;
  ruleSet: "PF_LAB@1";
  snapshotVersion: number;
  outcome: LaboratoryOutcome;
  checks: LaboratoryCheck[];
  issues: LaboratoryIssue[];
  evidenceGraph: { nodes: EvidenceNode[]; edges: EvidenceEdge[]; trace: string[] };
  actorPlan: ActorAction[];
  evaluatedAt: string;
}

export interface LaboratoryAuditEvent { eventId: string; type: "SESSION_CREATED" | "SCENARIO_IMPORTED" | "PRESET_LOADED" | "ASSESSMENT_RUN" | "SIMULATED_MUTATION" | "REVALIDATION" | "RESET"; occurredAt: string; detail: string; }
export interface LaboratorySession { sessionId: string; presetId: string; draftVersion: number; snapshotVersion: number; draft: LaboratoryScenario; assessment: LaboratoryAssessment | null; auditEvents: LaboratoryAuditEvent[]; }
