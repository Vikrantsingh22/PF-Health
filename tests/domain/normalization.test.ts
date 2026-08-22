import { describe, expect, it } from "vitest";

import { normalizeMemberPayload } from "@/application/normalization/member-state";
import { raviAfterCorrection, raviBeforeCorrection } from "@/fixtures/ravi";

describe("member normalization", () => {
  it("normalizes both explicit Ravi fixtures without changing their facts", () => {
    const before = normalizeMemberPayload(raviBeforeCorrection);
    const after = normalizeMemberPayload(raviAfterCorrection);

    expect(before).toEqual({ success: true, member: raviBeforeCorrection });
    expect(after).toEqual({ success: true, member: raviAfterCorrection });
    expect(Object.isFrozen(raviBeforeCorrection)).toBe(true);
    expect(Object.isFrozen(raviBeforeCorrection.employments)).toBe(true);
    expect(Object.isFrozen(raviBeforeCorrection.employments[0])).toBe(true);
  });

  it("preserves absent exit information instead of inventing values", () => {
    const result = normalizeMemberPayload(structuredClone(raviBeforeCorrection));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.member.employments[0]?.exitDate).toBeNull();
      expect(result.member.employments[0]?.exitReason).toBeNull();
    }
  });

  it("rejects unsupported external fields", () => {
    const result = normalizeMemberPayload({
      ...structuredClone(raviBeforeCorrection),
      uan: "PROHIBITED_SYNTHETIC_SHAPE",
    });

    expect(result.success).toBe(false);
  });

  it("rejects malformed dates and ambiguous employment status", () => {
    const malformedDate = {
      ...structuredClone(raviBeforeCorrection),
      employments: [
        {
          ...structuredClone(raviBeforeCorrection.employments[0]),
          startDate: "2025-02-30",
        },
        structuredClone(raviBeforeCorrection.employments[1]),
      ],
    };
    const ambiguousStatus = {
      ...structuredClone(raviBeforeCorrection),
      employments: [
        {
          ...structuredClone(raviBeforeCorrection.employments[0]),
          status: "FORMER",
        },
      ],
    };

    expect(normalizeMemberPayload(malformedDate).success).toBe(false);
    expect(normalizeMemberPayload(ambiguousStatus).success).toBe(false);
  });
});
