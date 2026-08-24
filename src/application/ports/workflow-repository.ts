import type {
  AuditEvent,
  HealthAssessment,
  ResolutionCase,
} from "@/domain/model/types";

export interface SimulationConfirmation {
  readonly token: string;
  readonly resolutionId: string;
  readonly memberId: string;
  readonly issueId: string;
  readonly employmentId: string;
  readonly expectedSnapshotVersion: number;
  readonly exitDate: string;
  readonly exitReason: string;
  readonly expiresAt: string;
  readonly usedAt: string | null;
}

export interface WorkflowRepository {
  reset(): void;
  saveAssessment(assessment: HealthAssessment): void;
  getAssessment(assessmentId: string): HealthAssessment | null;
  getLatestAssessment(memberId: string): HealthAssessment | null;
  findAssessmentContainingIssue(issueId: string): HealthAssessment | null;
  saveResolution(resolution: ResolutionCase): void;
  getResolution(resolutionId: string): ResolutionCase | null;
  saveConfirmation(confirmation: SimulationConfirmation): void;
  getConfirmation(token: string): SimulationConfirmation | null;
  consumeConfirmation(token: string, usedAt: string): void;
  appendAudit(event: AuditEvent): void;
  listAudit(memberId: string): readonly AuditEvent[];
}
