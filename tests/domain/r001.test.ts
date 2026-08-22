import { describe, expect, it } from "vitest";

import type { EmploymentRecord, MemberState } from "@/domain/model/types";
import { evaluateR001 } from "@/domain/rules/r001";
import { raviAfterCorrection, raviBeforeCorrection } from "@/fixtures/ravi";

const EVALUATED_AT = "2026-08-23T00:00:00.000Z";

function withEmployments(employments: readonly EmploymentRecord[]): MemberState {
  return {
    ...raviBeforeCorrection,
    employments,
  };
}

describe("R001@1 missing previous-employment exit information", () => {
  it("fails when a previous employment is missing both exit fields", () => {
    const result = evaluateR001(raviBeforeCorrection, EVALUATED_AT);

    expect(result.status).toBe("FAIL");
    expect(result.reasonCode).toBe("PREVIOUS_EMPLOYMENT_EXIT_INCOMPLETE");
    expect(result.affectedRecordIds).toEqual(["employment_previous_01"]);
  });

  it("fails when only the exit date is missing", () => {
    const previous = raviAfterCorrection.employments[0];
    const member = withEmployments([{ ...previous, exitDate: null }]);

    expect(evaluateR001(member, EVALUATED_AT).status).toBe("FAIL");
  });

  it("fails when only the exit reason is missing", () => {
    const previous = raviAfterCorrection.employments[0];
    const member = withEmployments([{ ...previous, exitReason: null }]);

    expect(evaluateR001(member, EVALUATED_AT).status).toBe("FAIL");
  });

  it("passes when every previous employment has complete exit information", () => {
    expect(evaluateR001(raviAfterCorrection, EVALUATED_AT).status).toBe("PASS");
  });

  it("returns unknown when there is no unambiguous previous employment", () => {
    const current = raviBeforeCorrection.employments[1];
    const member = withEmployments([current]);

    expect(evaluateR001(member, EVALUATED_AT).status).toBe("UNKNOWN");
  });

  it("returns unknown when required evidence is malformed", () => {
    const previous = raviBeforeCorrection.employments[0];
    const malformed = withEmployments([{ ...previous, startDate: "2025-02-30" }]);

    expect(evaluateR001(malformed, EVALUATED_AT).status).toBe("UNKNOWN");
  });

  it("does not treat missing current-employment exit data as an R001 failure", () => {
    const member = withEmployments([
      raviAfterCorrection.employments[0],
      raviBeforeCorrection.employments[1],
    ]);

    expect(evaluateR001(member, EVALUATED_AT).status).toBe("PASS");
  });

  it("returns every affected previous record in stable input order", () => {
    const first = raviBeforeCorrection.employments[0];
    const second = { ...first, employmentId: "employment_previous_02" };
    const member = withEmployments([first, second, raviBeforeCorrection.employments[1]]);

    expect(evaluateR001(member, EVALUATED_AT).affectedRecordIds).toEqual([
      "employment_previous_01",
      "employment_previous_02",
    ]);
  });

  it("carries the documented rule version and source provenance", () => {
    const result = evaluateR001(raviBeforeCorrection, EVALUATED_AT);

    expect(result.checkId).toBe("R001");
    expect(result.ruleVersion).toBe(1);
    expect(result.sourceIds).toEqual(["SRC-001", "SRC-002"]);
    expect(result.evaluatedAt).toBe(EVALUATED_AT);
  });
});
