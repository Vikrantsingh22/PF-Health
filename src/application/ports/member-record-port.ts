import type { MemberState } from "@/domain/model/types";

export interface SyntheticExitUpdate {
  readonly memberId: string;
  readonly employmentId: string;
  readonly expectedSnapshotVersion: number;
  readonly exitDate: string;
  readonly exitReason: string;
}

export interface MemberRecordPort {
  loadMember(memberId: string): MemberState | null;
  reset(): MemberState;
  applySyntheticExitUpdate(update: SyntheticExitUpdate): MemberState;
  snapshot(): MemberState;
}
