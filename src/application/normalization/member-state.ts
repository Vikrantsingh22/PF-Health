import { z } from "zod";

import { hasNonBlankText, isIsoDate } from "@/domain/model/date";
import type { EmploymentRecord, MemberState } from "@/domain/model/types";

const nonBlankStringSchema = z.string().refine(hasNonBlankText, "Required text is blank");
const isoDateSchema = z.string().refine(isIsoDate, "Expected a valid ISO date");

export const employmentRecordSchema = z
  .object({
    employmentId: nonBlankStringSchema,
    employerLabel: nonBlankStringSchema,
    status: z.enum(["CURRENT", "PREVIOUS"]),
    startDate: isoDateSchema,
    exitDate: isoDateSchema.nullable(),
    exitReason: nonBlankStringSchema.nullable(),
  })
  .strict()
  .superRefine((employment, context) => {
    if (
      employment.status === "CURRENT" &&
      (employment.exitDate !== null || employment.exitReason !== null)
    ) {
      context.addIssue({
        code: "custom",
        message: "Current employment cannot contain exit information",
        path: ["status"],
      });
    }
  });

export const memberStateSchema = z
  .object({
    memberId: nonBlankStringSchema,
    displayName: nonBlankStringSchema,
    snapshotVersion: z.number().int().positive(),
    schemaVersion: z.literal(1),
    employments: z.array(employmentRecordSchema),
  })
  .strict();

export interface NormalizationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

export type NormalizationResult =
  | Readonly<{ success: true; member: MemberState }>
  | Readonly<{ success: false; issues: readonly NormalizationIssue[] }>;

function freezeEmployment(employment: EmploymentRecord): EmploymentRecord {
  return Object.freeze({ ...employment });
}

export function freezeMemberState(member: MemberState): MemberState {
  return Object.freeze({
    ...member,
    employments: Object.freeze(member.employments.map(freezeEmployment)),
  });
}

export function normalizeMemberPayload(input: unknown): NormalizationResult {
  const result = memberStateSchema.safeParse(input);

  if (!result.success) {
    return Object.freeze({
      success: false,
      issues: Object.freeze(
        result.error.issues.map((issue) =>
          Object.freeze({
            path: issue.path.map(String).join("."),
            code: issue.code,
            message: issue.message,
          }),
        ),
      ),
    });
  }

  return Object.freeze({
    success: true,
    member: freezeMemberState(result.data),
  });
}
