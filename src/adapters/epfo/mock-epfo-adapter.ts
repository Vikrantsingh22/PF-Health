import { ApplicationError } from "@/application/errors/application-error";
import type {
  MemberRecordPort,
  SyntheticExitUpdate,
} from "@/application/ports/member-record-port";
import { freezeMemberState } from "@/application/normalization/member-state";
import type { MemberState } from "@/domain/model/types";
import { raviBeforeCorrection } from "@/fixtures/ravi";

export class MockEPFOAdapter implements MemberRecordPort {
  private member: MemberState = raviBeforeCorrection;

  loadMember(memberId: string): MemberState | null {
    return memberId === this.member.memberId ? this.member : null;
  }

  reset(): MemberState {
    this.member = raviBeforeCorrection;
    return this.member;
  }

  applySyntheticExitUpdate(update: SyntheticExitUpdate): MemberState {
    if (update.memberId !== this.member.memberId) {
      throw new ApplicationError("NOT_FOUND", "Synthetic member was not found");
    }

    if (update.expectedSnapshotVersion !== this.member.snapshotVersion) {
      throw new ApplicationError("CONFLICT", "Member snapshot version is stale");
    }

    const employment = this.member.employments.find(
      ({ employmentId }) => employmentId === update.employmentId,
    );

    if (employment === undefined) {
      throw new ApplicationError("NOT_FOUND", "Employment record was not found");
    }

    if (employment.status !== "PREVIOUS") {
      throw new ApplicationError(
        "VALIDATION_ERROR",
        "Synthetic exit updates are limited to previous employment",
      );
    }

    this.member = freezeMemberState({
      ...this.member,
      snapshotVersion: this.member.snapshotVersion + 1,
      employments: this.member.employments.map((record) =>
        record.employmentId === update.employmentId
          ? {
              ...record,
              exitDate: update.exitDate,
              exitReason: update.exitReason,
            }
          : record,
      ),
    });

    return this.member;
  }
}
