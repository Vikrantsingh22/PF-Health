import type { AuditEvent, AuditEventType } from "@/domain/model/types";

import { ApplicationError } from "@/application/errors/application-error";

const ALLOWED_METADATA_KEYS: Readonly<Record<AuditEventType, readonly string[]>> =
  Object.freeze({
    DEMO_RESET: Object.freeze(["snapshotVersion"]),
    MEMBER_LOADED: Object.freeze(["snapshotVersion"]),
    ASSESSMENT_COMPLETED: Object.freeze([
      "assessmentId",
      "status",
      "totalChecks",
    ]),
    ISSUE_VIEWED: Object.freeze(["issueId"]),
    RESOLUTION_OPENED: Object.freeze(["issueId"]),
    ACTION_SELECTED: Object.freeze(["actionCode"]),
    SIMULATION_CONFIRMED: Object.freeze(["employmentId"]),
    SYNTHETIC_CORRECTION_APPLIED: Object.freeze(["employmentId"]),
    REVALIDATION_COMPLETED: Object.freeze(["assessmentId", "status"]),
  });

export interface AuditEventInput extends Omit<AuditEvent, "metadata"> {
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}

export function createAuditEvent(input: AuditEventInput): AuditEvent {
  const metadata = input.metadata ?? {};
  const allowedKeys = ALLOWED_METADATA_KEYS[input.type];
  const unexpectedKey = Object.keys(metadata).find((key) => !allowedKeys.includes(key));

  if (unexpectedKey !== undefined) {
    throw new ApplicationError(
      "VALIDATION_ERROR",
      `Audit metadata key is not allowed for ${input.type}: ${unexpectedKey}`,
    );
  }

  return Object.freeze({
    ...input,
    metadata: Object.freeze({ ...metadata }),
  });
}
