import { ApplicationError } from "@/application/errors/application-error";
import type {
  SimulationConfirmation,
  WorkflowRepository,
} from "@/application/ports/workflow-repository";
import type {
  AuditEvent,
  HealthAssessment,
  ResolutionCase,
} from "@/domain/model/types";

export class InMemoryWorkflowRepository implements WorkflowRepository {
  private readonly assessments = new Map<string, HealthAssessment>();
  private readonly latestAssessmentIds = new Map<string, string>();
  private readonly resolutions = new Map<string, ResolutionCase>();
  private readonly confirmations = new Map<string, SimulationConfirmation>();
  private readonly audits: AuditEvent[] = [];

  reset(): void {
    this.assessments.clear();
    this.latestAssessmentIds.clear();
    this.resolutions.clear();
    this.confirmations.clear();
    this.audits.length = 0;
  }

  saveAssessment(assessment: HealthAssessment): void {
    this.assessments.set(assessment.assessmentId, assessment);
    this.latestAssessmentIds.set(assessment.memberId, assessment.assessmentId);
  }

  getAssessment(assessmentId: string): HealthAssessment | null {
    return this.assessments.get(assessmentId) ?? null;
  }

  getLatestAssessment(memberId: string): HealthAssessment | null {
    const assessmentId = this.latestAssessmentIds.get(memberId);
    return assessmentId === undefined ? null : (this.assessments.get(assessmentId) ?? null);
  }

  findAssessmentContainingIssue(issueId: string): HealthAssessment | null {
    for (const assessment of this.assessments.values()) {
      if (assessment.issues.some((issue) => issue.issueId === issueId)) {
        return assessment;
      }
    }

    return null;
  }

  saveResolution(resolution: ResolutionCase): void {
    this.resolutions.set(resolution.resolutionId, Object.freeze({ ...resolution }));
  }

  getResolution(resolutionId: string): ResolutionCase | null {
    return this.resolutions.get(resolutionId) ?? null;
  }

  saveConfirmation(confirmation: SimulationConfirmation): void {
    this.confirmations.set(confirmation.token, Object.freeze({ ...confirmation }));
  }

  getConfirmation(token: string): SimulationConfirmation | null {
    return this.confirmations.get(token) ?? null;
  }

  consumeConfirmation(token: string, usedAt: string): void {
    const confirmation = this.confirmations.get(token);
    if (confirmation === undefined || confirmation.usedAt !== null) {
      throw new ApplicationError("CONFLICT", "Confirmation token is invalid or already used");
    }

    this.confirmations.set(token, Object.freeze({ ...confirmation, usedAt }));
  }

  appendAudit(event: AuditEvent): void {
    this.audits.push(event);
  }

  listAudit(memberId: string): readonly AuditEvent[] {
    return Object.freeze(this.audits.filter((event) => event.memberId === memberId));
  }
}
