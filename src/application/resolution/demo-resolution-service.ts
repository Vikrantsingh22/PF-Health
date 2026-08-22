import { createAuditEvent } from "@/application/audit/create-audit-event";
import { evaluateHealth } from "@/application/assessment/health-engine";
import { ApplicationError } from "@/application/errors/application-error";
import type { MemberRecordPort } from "@/application/ports/member-record-port";
import type {
  SimulationConfirmation,
  WorkflowRepository,
} from "@/application/ports/workflow-repository";
import { hasNonBlankText, isIsoDate } from "@/domain/model/date";
import type {
  AuditEvent,
  AuditEventType,
  HealthAssessment,
  Issue,
  MemberState,
  ResolutionCase,
  SimulateExitUpdateCommand,
  WorkflowType,
} from "@/domain/model/types";

const CONFIRMATION_TTL_MS = 5 * 60 * 1000;

type IdKind = "assessment" | "issue" | "resolution" | "confirmation" | "audit";

export interface DemoResolutionDependencies {
  readonly now: () => string;
  readonly createId: (kind: IdKind) => string;
}

export interface ConfirmSimulationInput {
  readonly resolutionId: string;
  readonly employmentId: string;
  readonly expectedSnapshotVersion: number;
  readonly exitDate: string;
  readonly exitReason: string;
}

export interface SimulationConfirmationView {
  readonly confirmationToken: string;
  readonly expiresAt: string;
  readonly proposedChanges: Readonly<{
    employmentId: string;
    exitDate: string;
    exitReason: string;
  }>;
  readonly disclaimer: "SYNTHETIC_DEMO_ONLY";
}

export interface AppliedSimulationResult {
  readonly member: MemberState;
  readonly beforeAssessment: HealthAssessment;
  readonly assessment: HealthAssessment;
  readonly resolution: ResolutionCase;
}

export interface DemoResetResult {
  readonly member: MemberState;
  readonly assessment: HealthAssessment;
}

export class DemoResolutionService {
  constructor(
    private readonly members: MemberRecordPort,
    private readonly workflow: WorkflowRepository,
    private readonly dependencies: DemoResolutionDependencies,
  ) {}

  seedDemo(): DemoResetResult {
    return this.resetDemo();
  }

  resetDemo(): DemoResetResult {
    this.workflow.reset();
    const member = this.members.reset();
    this.audit({
      memberId: member.memberId,
      type: "DEMO_RESET",
      actor: "SYSTEM",
      toSnapshotVersion: member.snapshotVersion,
      metadata: { snapshotVersion: member.snapshotVersion },
    });
    const assessment = this.assessMember(member, "GENERAL_HEALTH", true);

    return Object.freeze({ member, assessment });
  }

  getMember(memberId: string): MemberState {
    return this.requireMember(memberId);
  }

  loadAndAssess(
    memberId: string,
    expectedSnapshotVersion: number,
    workflowType: WorkflowType,
  ): HealthAssessment {
    const member = this.requireMember(memberId);
    this.requireVersion(member, expectedSnapshotVersion);
    return this.assessMember(member, workflowType, true);
  }

  openResolution(input: {
    readonly memberId: string;
    readonly issueId: string;
    readonly expectedSnapshotVersion: number;
  }): ResolutionCase {
    const member = this.requireMember(input.memberId);
    this.requireVersion(member, input.expectedSnapshotVersion);
    const assessment = this.workflow.getLatestAssessment(input.memberId);
    const issue = assessment?.issues.find(({ issueId }) => issueId === input.issueId);

    if (
      assessment === null ||
      assessment.memberSnapshotVersion !== member.snapshotVersion ||
      issue === undefined
    ) {
      throw new ApplicationError("CONFLICT", "Issue does not belong to the current snapshot");
    }

    const now = this.now();
    const resolution = Object.freeze({
      resolutionId: this.dependencies.createId("resolution"),
      memberId: member.memberId,
      issueId: issue.issueId,
      status: "OPEN" as const,
      selectedAction: null,
      expectedSnapshotVersion: member.snapshotVersion,
      createdAt: now,
      updatedAt: now,
    });
    this.workflow.saveResolution(resolution);
    this.audit({
      memberId: member.memberId,
      resolutionId: resolution.resolutionId,
      type: "RESOLUTION_OPENED",
      actor: "MEMBER",
      fromSnapshotVersion: member.snapshotVersion,
      metadata: { issueId: issue.issueId },
    });
    return resolution;
  }

  selectAction(resolutionId: string, actionCode: string): ResolutionCase {
    const resolution = this.requireResolution(resolutionId);
    if (resolution.status !== "OPEN") {
      throw new ApplicationError("CONFLICT", "Resolution is not open for action selection");
    }

    const issue = this.requireResolutionIssue(resolution);
    const selectedAction = issue.allowedActionCodes.find((code) => code === actionCode);
    if (selectedAction === undefined) {
      throw new ApplicationError("UNSUPPORTED_ACTION", "Action is not allowed for this issue");
    }

    const updated = Object.freeze({
      ...resolution,
      status: "ACTION_SELECTED" as const,
      selectedAction,
      updatedAt: this.now(),
    });
    this.workflow.saveResolution(updated);
    this.audit({
      memberId: updated.memberId,
      resolutionId: updated.resolutionId,
      type: "ACTION_SELECTED",
      actor: "MEMBER",
      fromSnapshotVersion: updated.expectedSnapshotVersion,
      metadata: { actionCode: selectedAction },
    });
    return updated;
  }

  confirmSimulation(input: ConfirmSimulationInput): SimulationConfirmationView {
    this.validateExitFields(input.exitDate, input.exitReason);
    const resolution = this.requireResolution(input.resolutionId);
    if (
      resolution.status !== "ACTION_SELECTED" ||
      resolution.selectedAction !== "SIMULATE_EXIT_UPDATE"
    ) {
      throw new ApplicationError(
        "UNSUPPORTED_ACTION",
        "Resolution is not ready for a synthetic exit update",
      );
    }

    const member = this.requireMember(resolution.memberId);
    this.requireVersion(member, input.expectedSnapshotVersion);
    if (resolution.expectedSnapshotVersion !== input.expectedSnapshotVersion) {
      throw new ApplicationError("CONFLICT", "Resolution snapshot version is stale");
    }

    const issue = this.requireResolutionIssue(resolution);
    this.requireAffectedPreviousEmployment(member, issue, input.employmentId);

    const now = this.now();
    const expiresAt = new Date(Date.parse(now) + CONFIRMATION_TTL_MS).toISOString();
    const confirmation: SimulationConfirmation = Object.freeze({
      token: this.dependencies.createId("confirmation"),
      resolutionId: resolution.resolutionId,
      memberId: resolution.memberId,
      issueId: resolution.issueId,
      employmentId: input.employmentId,
      expectedSnapshotVersion: input.expectedSnapshotVersion,
      exitDate: input.exitDate,
      exitReason: input.exitReason,
      expiresAt,
      usedAt: null,
    });
    this.workflow.saveConfirmation(confirmation);

    const updated = Object.freeze({
      ...resolution,
      status: "SIMULATION_CONFIRMED" as const,
      updatedAt: now,
    });
    this.workflow.saveResolution(updated);
    this.audit({
      memberId: updated.memberId,
      resolutionId: updated.resolutionId,
      type: "SIMULATION_CONFIRMED",
      actor: "MEMBER",
      fromSnapshotVersion: updated.expectedSnapshotVersion,
      metadata: { employmentId: input.employmentId },
    });

    return Object.freeze({
      confirmationToken: confirmation.token,
      expiresAt,
      proposedChanges: Object.freeze({
        employmentId: input.employmentId,
        exitDate: input.exitDate,
        exitReason: input.exitReason,
      }),
      disclaimer: "SYNTHETIC_DEMO_ONLY" as const,
    });
  }

  applySimulation(command: SimulateExitUpdateCommand): AppliedSimulationResult {
    this.validateExitFields(command.exitDate, command.exitReason);
    const resolution = this.requireResolution(command.resolutionId);
    if (
      resolution.memberId !== command.memberId ||
      resolution.status !== "SIMULATION_CONFIRMED" ||
      resolution.selectedAction !== "SIMULATE_EXIT_UPDATE"
    ) {
      throw new ApplicationError("CONFLICT", "Resolution is not ready for this update");
    }

    const confirmation = this.workflow.getConfirmation(command.confirmationToken);
    if (confirmation === null || confirmation.usedAt !== null) {
      throw new ApplicationError("CONFLICT", "Confirmation token is invalid or already used");
    }

    if (
      confirmation.resolutionId !== command.resolutionId ||
      confirmation.memberId !== command.memberId ||
      confirmation.employmentId !== command.employmentId ||
      confirmation.expectedSnapshotVersion !== command.expectedSnapshotVersion ||
      confirmation.exitDate !== command.exitDate ||
      confirmation.exitReason !== command.exitReason
    ) {
      throw new ApplicationError("CONFLICT", "Confirmation token does not match the update");
    }

    const now = this.now();
    if (Date.parse(confirmation.expiresAt) <= Date.parse(now)) {
      throw new ApplicationError("CONFLICT", "Confirmation token has expired");
    }

    const member = this.requireMember(command.memberId);
    this.requireVersion(member, command.expectedSnapshotVersion);
    const beforeAssessment = this.workflow.findAssessmentContainingIssue(resolution.issueId);
    if (beforeAssessment === null) {
      throw new ApplicationError("CONFLICT", "Resolution issue assessment is unavailable");
    }
    const issue = this.requireResolutionIssue(resolution);
    this.requireAffectedPreviousEmployment(member, issue, command.employmentId);

    this.workflow.consumeConfirmation(command.confirmationToken, now);
    const updatedMember = this.members.applySyntheticExitUpdate(command);
    const appliedResolution = Object.freeze({
      ...resolution,
      status: "APPLIED" as const,
      updatedAt: now,
    });
    this.workflow.saveResolution(appliedResolution);
    this.audit({
      memberId: command.memberId,
      resolutionId: command.resolutionId,
      type: "SYNTHETIC_CORRECTION_APPLIED",
      actor: "SYSTEM",
      fromSnapshotVersion: member.snapshotVersion,
      toSnapshotVersion: updatedMember.snapshotVersion,
      metadata: { employmentId: command.employmentId },
    });

    const assessment = this.assessMember(
      updatedMember,
      beforeAssessment.workflow.type,
      false,
    );
    const revalidatedResolution = Object.freeze({
      ...appliedResolution,
      status: "REVALIDATED" as const,
      updatedAt: this.now(),
    });
    this.workflow.saveResolution(revalidatedResolution);
    this.audit({
      memberId: command.memberId,
      resolutionId: command.resolutionId,
      type: "REVALIDATION_COMPLETED",
      actor: "SYSTEM",
      fromSnapshotVersion: member.snapshotVersion,
      toSnapshotVersion: updatedMember.snapshotVersion,
      metadata: { assessmentId: assessment.assessmentId, status: assessment.status },
    });

    return Object.freeze({
      member: updatedMember,
      beforeAssessment,
      assessment,
      resolution: revalidatedResolution,
    });
  }

  listAudit(memberId: string): readonly AuditEvent[] {
    this.requireMember(memberId);
    return this.workflow.listAudit(memberId);
  }

  private assessMember(
    member: MemberState,
    workflowType: WorkflowType,
    auditLoad: boolean,
  ): HealthAssessment {
    if (auditLoad) {
      this.audit({
        memberId: member.memberId,
        type: "MEMBER_LOADED",
        actor: "SYSTEM",
        fromSnapshotVersion: member.snapshotVersion,
        metadata: { snapshotVersion: member.snapshotVersion },
      });
    }

    const assessment = evaluateHealth(member, workflowType, {
      now: this.dependencies.now,
      createAssessmentId: () => this.dependencies.createId("assessment"),
      createIssueId: () => this.dependencies.createId("issue"),
    });
    this.workflow.saveAssessment(assessment);

    if (auditLoad) {
      this.audit({
        memberId: member.memberId,
        type: "ASSESSMENT_COMPLETED",
        actor: "SYSTEM",
        fromSnapshotVersion: member.snapshotVersion,
        metadata: {
          assessmentId: assessment.assessmentId,
          status: assessment.status,
          totalChecks: assessment.totalChecks,
        },
      });
    }

    return assessment;
  }

  private requireMember(memberId: string): MemberState {
    const member = this.members.loadMember(memberId);
    if (member === null) {
      throw new ApplicationError("NOT_FOUND", "Synthetic member was not found");
    }
    return member;
  }

  private requireVersion(member: MemberState, expectedVersion: number): void {
    if (member.snapshotVersion !== expectedVersion) {
      throw new ApplicationError("CONFLICT", "Member snapshot version is stale");
    }
  }

  private requireResolution(resolutionId: string): ResolutionCase {
    const resolution = this.workflow.getResolution(resolutionId);
    if (resolution === null) {
      throw new ApplicationError("NOT_FOUND", "Resolution was not found");
    }
    return resolution;
  }

  private requireResolutionIssue(resolution: ResolutionCase): Issue {
    const assessment = this.workflow.findAssessmentContainingIssue(resolution.issueId);
    const issue = assessment?.issues.find(({ issueId }) => issueId === resolution.issueId);
    if (issue === undefined) {
      throw new ApplicationError("CONFLICT", "Resolution issue is unavailable");
    }
    return issue;
  }

  private requireAffectedPreviousEmployment(
    member: MemberState,
    issue: Issue,
    employmentId: string,
  ): void {
    if (!issue.affectedRecordIds.includes(employmentId)) {
      throw new ApplicationError("VALIDATION_ERROR", "Employment is not affected by the issue");
    }
    const employment = member.employments.find((item) => item.employmentId === employmentId);
    if (employment === undefined || employment.status !== "PREVIOUS") {
      throw new ApplicationError("VALIDATION_ERROR", "Affected previous employment is invalid");
    }
  }

  private validateExitFields(exitDate: string, exitReason: string): void {
    if (!isIsoDate(exitDate)) {
      throw new ApplicationError("VALIDATION_ERROR", "Exit date must be a valid ISO date");
    }
    if (!hasNonBlankText(exitReason)) {
      throw new ApplicationError("VALIDATION_ERROR", "Exit reason is required");
    }
  }

  private now(): string {
    const now = this.dependencies.now();
    if (Number.isNaN(Date.parse(now))) {
      throw new ApplicationError("VALIDATION_ERROR", "Application clock must return ISO time");
    }
    return now;
  }

  private audit(input: {
    readonly memberId: string;
    readonly resolutionId?: string;
    readonly type: AuditEventType;
    readonly actor: "MEMBER" | "SYSTEM";
    readonly fromSnapshotVersion?: number;
    readonly toSnapshotVersion?: number;
    readonly metadata?: Readonly<Record<string, string | number | boolean>>;
  }): void {
    this.workflow.appendAudit(
      createAuditEvent({
        eventId: this.dependencies.createId("audit"),
        occurredAt: this.now(),
        ...input,
      }),
    );
  }
}
