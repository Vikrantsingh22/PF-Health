import { z } from "zod";

import { memberStateSchema } from "@/application/normalization/member-state";

const nonBlankStringSchema = z.string().trim().min(1);
const positiveIntegerSchema = z.number().int().positive();
const isoTimestampSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: "Expected an ISO timestamp",
});

export const demoMemberIdSchema = z.literal("demo_ravi");

const workflowTypeSchema = z.enum(["GENERAL_HEALTH", "TRANSFER"]);
const resolutionActionCodeSchema = z.enum([
  "REVIEW_MEMBER_MARK_EXIT_PATH",
  "DRAFT_PREVIOUS_EMPLOYER_REQUEST",
  "REQUEST_EPFO_REVIEW",
  "SIMULATE_EXIT_UPDATE",
]);

export const assessmentRequestSchema = z
  .object({
    memberId: demoMemberIdSchema,
    workflow: z.object({ type: workflowTypeSchema }).strict(),
    expectedSnapshotVersion: positiveIntegerSchema,
  })
  .strict();

export const openResolutionRequestSchema = z
  .object({
    memberId: demoMemberIdSchema,
    issueId: nonBlankStringSchema,
    expectedSnapshotVersion: positiveIntegerSchema,
  })
  .strict();

export const selectActionRequestSchema = z
  .object({ actionCode: nonBlankStringSchema })
  .strict();

export const confirmSimulationRequestSchema = z
  .object({
    employmentId: nonBlankStringSchema,
    expectedSnapshotVersion: positiveIntegerSchema,
    exitDate: nonBlankStringSchema,
    exitReason: nonBlankStringSchema,
  })
  .strict();

export const applySimulationRequestSchema = confirmSimulationRequestSchema.extend({
  memberId: demoMemberIdSchema,
  confirmationToken: nonBlankStringSchema,
});

export const emptyRequestSchema = z.object({}).strict();

const checkSchema = z
  .object({
    checkId: z.enum(["D001", "D002", "D003", "D004", "R001"]),
    ruleVersion: positiveIntegerSchema,
    labelKey: nonBlankStringSchema,
    status: z.enum(["PASS", "FAIL", "UNKNOWN"]),
    reasonCode: nonBlankStringSchema,
    sourceIds: z.array(nonBlankStringSchema),
    affectedRecordIds: z.array(nonBlankStringSchema),
    evaluatedAt: isoTimestampSchema,
  })
  .strict();

export const issueSchema = z
  .object({
    issueId: nonBlankStringSchema,
    code: z.literal("MISSING_PREVIOUS_EMPLOYMENT_EXIT"),
    ruleId: z.literal("R001"),
    ruleVersion: z.literal(1),
    titleKey: nonBlankStringSchema,
    fallbackCopyKey: nonBlankStringSchema,
    severity: z.enum(["ATTENTION", "BLOCKER", "REVIEW_REQUIRED"]),
    defaultOwner: z.enum([
      "MEMBER",
      "CURRENT_EMPLOYER",
      "PREVIOUS_EMPLOYER",
      "EPFO",
      "REVIEW_REQUIRED",
    ]),
    alternativeOwners: z.array(
      z.enum([
        "MEMBER",
        "CURRENT_EMPLOYER",
        "PREVIOUS_EMPLOYER",
        "EPFO",
        "REVIEW_REQUIRED",
      ]),
    ),
    fallbackOwner: z.enum([
      "MEMBER",
      "CURRENT_EMPLOYER",
      "PREVIOUS_EMPLOYER",
      "EPFO",
      "REVIEW_REQUIRED",
    ]),
    affectedWorkflows: z.array(workflowTypeSchema),
    allowedActionCodes: z.array(resolutionActionCodeSchema),
    requiredEvidence: z.array(nonBlankStringSchema),
    sourceIds: z.array(nonBlankStringSchema),
    limitationKey: nonBlankStringSchema,
    affectedRecordIds: z.array(nonBlankStringSchema),
  })
  .strict();

export const assessmentSchema = z
  .object({
    assessmentId: nonBlankStringSchema,
    memberId: demoMemberIdSchema,
    memberSnapshotVersion: positiveIntegerSchema,
    ruleSetVersion: z.literal(1),
    workflow: z.object({ type: workflowTypeSchema }).strict(),
    status: z.enum(["HEALTHY", "NEEDS_ATTENTION", "BLOCKED", "REVIEW_REQUIRED"]),
    passedChecks: z.number().int().nonnegative(),
    failedChecks: z.number().int().nonnegative(),
    unknownChecks: z.number().int().nonnegative(),
    totalChecks: positiveIntegerSchema,
    checks: z.array(checkSchema),
    issues: z.array(issueSchema),
    evaluatedAt: isoTimestampSchema,
  })
  .strict();

export const resolutionSchema = z
  .object({
    resolutionId: nonBlankStringSchema,
    memberId: demoMemberIdSchema,
    issueId: nonBlankStringSchema,
    status: z.enum(["OPEN", "ACTION_SELECTED", "SIMULATION_CONFIRMED", "APPLIED", "REVALIDATED"]),
    selectedAction: resolutionActionCodeSchema.nullable(),
    expectedSnapshotVersion: positiveIntegerSchema,
    createdAt: isoTimestampSchema,
    updatedAt: isoTimestampSchema,
  })
  .strict();

const auditEventSchema = z
  .object({
    eventId: nonBlankStringSchema,
    memberId: demoMemberIdSchema,
    resolutionId: nonBlankStringSchema.optional(),
    type: z.enum([
      "DEMO_RESET",
      "MEMBER_LOADED",
      "ASSESSMENT_COMPLETED",
      "ISSUE_VIEWED",
      "RESOLUTION_OPENED",
      "ACTION_SELECTED",
      "SIMULATION_CONFIRMED",
      "SYNTHETIC_CORRECTION_APPLIED",
      "REVALIDATION_COMPLETED",
    ]),
    actor: z.enum(["MEMBER", "SYSTEM"]),
    occurredAt: isoTimestampSchema,
    fromSnapshotVersion: positiveIntegerSchema.optional(),
    toSnapshotVersion: positiveIntegerSchema.optional(),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  })
  .strict();

export const memberResponseSchema = z.object({ member: memberStateSchema }).strict();
export const resetResponseSchema = z
  .object({ member: memberStateSchema, assessment: assessmentSchema })
  .strict();
export const assessmentResponseSchema = z.object({ assessment: assessmentSchema }).strict();
export const resolutionResponseSchema = z.object({ resolution: resolutionSchema }).strict();
export const confirmationResponseSchema = z
  .object({
    confirmation: z
      .object({
        confirmationToken: nonBlankStringSchema,
        expiresAt: isoTimestampSchema,
        proposedChanges: z
          .object({
            employmentId: nonBlankStringSchema,
            exitDate: nonBlankStringSchema,
            exitReason: nonBlankStringSchema,
          })
          .strict(),
        disclaimer: z.literal("SYNTHETIC_DEMO_ONLY"),
      })
      .strict(),
  })
  .strict();
export const appliedSimulationResponseSchema = z
  .object({
    member: memberStateSchema,
    beforeAssessment: assessmentSchema,
    assessment: assessmentSchema,
    resolution: resolutionSchema,
  })
  .strict();
export const auditResponseSchema = z.object({ events: z.array(auditEventSchema) }).strict();

export const issueDetailResponseSchema = z
  .object({
    issue: issueSchema,
    copy: z
      .object({
        title: nonBlankStringSchema,
        summary: nonBlankStringSchema,
        impact: nonBlankStringSchema,
        owner: nonBlankStringSchema,
        nextStep: nonBlankStringSchema,
        limitation: nonBlankStringSchema,
        source: z.literal("DETERMINISTIC_FALLBACK"),
      })
      .strict(),
    sources: z.array(
      z
        .object({
          sourceId: z.enum(["SRC-001", "SRC-002"]),
          title: nonBlankStringSchema,
          url: z.string().url(),
          retrievedAt: z.literal("2026-08-22"),
        })
        .strict(),
    ),
  })
  .strict();

export const apiErrorSchema = z
  .object({
    error: z
      .object({
        code: z.enum([
          "VALIDATION_ERROR",
          "NOT_FOUND",
          "CONFLICT",
          "UNSUPPORTED_ACTION",
          "REVIEW_REQUIRED",
          "INTERNAL_ERROR",
        ]),
        message: nonBlankStringSchema,
        requestId: nonBlankStringSchema,
        fieldErrors: z.record(z.string(), z.array(nonBlankStringSchema)).optional(),
      })
      .strict(),
  })
  .strict();

export type ResetResponse = z.infer<typeof resetResponseSchema>;
export type IssueDetailResponse = z.infer<typeof issueDetailResponseSchema>;
export type ConfirmationResponse = z.infer<typeof confirmationResponseSchema>;
export type AppliedSimulationResponse = z.infer<typeof appliedSimulationResponseSchema>;
export type AuditResponse = z.infer<typeof auditResponseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
