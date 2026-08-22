import { freezeMemberState } from "@/application/normalization/member-state";
import type { MemberState } from "@/domain/model/types";

export const raviBeforeCorrection: MemberState = freezeMemberState({
  memberId: "demo_ravi",
  displayName: "Ravi Sharma",
  snapshotVersion: 1,
  schemaVersion: 1,
  employments: [
    {
      employmentId: "employment_previous_01",
      employerLabel: "Synthetic Previous Employer",
      status: "PREVIOUS",
      startDate: "2023-07-01",
      exitDate: null,
      exitReason: null,
    },
    {
      employmentId: "employment_current_01",
      employerLabel: "Synthetic Current Employer",
      status: "CURRENT",
      startDate: "2025-07-01",
      exitDate: null,
      exitReason: null,
    },
  ],
});

export const raviAfterCorrection: MemberState = freezeMemberState({
  ...raviBeforeCorrection,
  snapshotVersion: 2,
  employments: raviBeforeCorrection.employments.map((employment) =>
    employment.employmentId === "employment_previous_01"
      ? {
          ...employment,
          exitDate: "2025-06-30",
          exitReason: "CESSATION_SHORT_SERVICE",
        }
      : employment,
  ),
});
