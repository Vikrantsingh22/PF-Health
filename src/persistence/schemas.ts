import { z } from "zod";

import { assessmentSchema, resolutionSchema } from "@/application/api/schemas";
import { memberStateSchema } from "@/application/normalization/member-state";
import { laboratorySessionSchema } from "@/laboratory/schemas";

const timestampSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Expected an ISO timestamp");

const confirmationSchema = z.object({
  token: z.string(),
  resolutionId: z.string(),
  memberId: z.string(),
  issueId: z.string(),
  employmentId: z.string(),
  expectedSnapshotVersion: z.number().int().positive(),
  exitDate: z.iso.date(),
  exitReason: z.string(),
  expiresAt: timestampSchema,
  usedAt: timestampSchema.nullable(),
}).strict();

const auditEventSchema = z.object({
  eventId: z.string(),
  memberId: z.string(),
  resolutionId: z.string().optional(),
  type: z.enum([
    "DEMO_RESET", "MEMBER_LOADED", "ASSESSMENT_COMPLETED", "ISSUE_VIEWED",
    "RESOLUTION_OPENED", "ACTION_SELECTED", "SIMULATION_CONFIRMED",
    "SYNTHETIC_CORRECTION_APPLIED", "REVALIDATION_COMPLETED",
  ]),
  actor: z.enum(["MEMBER", "SYSTEM"]),
  occurredAt: timestampSchema,
  fromSnapshotVersion: z.number().int().positive().optional(),
  toSnapshotVersion: z.number().int().positive().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
}).strict();

export const guidedRunStateSchema = z.object({
  member: memberStateSchema,
  workflow: z.object({
    assessments: z.array(assessmentSchema),
    resolutions: z.array(resolutionSchema),
    confirmations: z.array(confirmationSchema),
    auditEvents: z.array(auditEventSchema),
  }).strict(),
}).strict();

export const guidedRunRowSchema = z.object({
  run_id: z.string(),
  owner_user_id: z.uuid(),
  revision: z.number().int().positive(),
  outcome: z.enum(["IN_PROGRESS", "HEALTHY", "NEEDS_ATTENTION", "BLOCKED", "REVIEW_REQUIRED"]),
  state: guidedRunStateSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
}).strict();

export const laboratorySessionRowSchema = z.object({
  session_id: z.string(),
  owner_user_id: z.uuid(),
  revision: z.number().int().positive(),
  preset_id: z.string(),
  draft_version: z.number().int().positive(),
  snapshot_version: z.number().int().nonnegative(),
  outcome: z.enum(["NOT_RUN", "HEALTHY", "NEEDS_ATTENTION", "REVIEW_REQUIRED", "BLOCKED"]),
  session: laboratorySessionSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
}).strict();

export type GuidedRunRow = z.infer<typeof guidedRunRowSchema>;
export type LaboratorySessionRow = z.infer<typeof laboratorySessionRowSchema>;
