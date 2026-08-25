import { describe, expect, it } from "vitest";
import { evaluateLaboratory } from "@/laboratory/evaluate";
import { LABORATORY_PRESETS, laboratoryPreset } from "@/laboratory/presets";
import { laboratoryScenarioSchema } from "@/laboratory/schemas";

describe("PF_LAB@1", () => {
  it.each(LABORATORY_PRESETS)("returns $expectedOutcome for $presetId", ({ scenario, expectedOutcome }) => {
    expect(evaluateLaboratory(scenario, 1, "2026-08-26T00:00:00.000Z").outcome).toBe(expectedOutcome);
  });

  it("allows equality at the chronology boundary", () => {
    const preset = laboratoryPreset("clean-history")!;
    preset.scenario.employments[0].exitDate = preset.scenario.employments[1].startDate;
    expect(evaluateLaboratory(preset.scenario, 1).checks[1].status).toBe("PASS");
  });

  it("makes split accounts transfer-specific", () => {
    const preset = laboratoryPreset("split-accounts")!;
    preset.scenario.workflow = "GENERAL_HEALTH";
    const result = evaluateLaboratory(preset.scenario, 1);
    expect(result.checks[2]).toMatchObject({ status: "PASS", reasonCode: "NOT_APPLICABLE_TO_GENERAL_HEALTH" });
    expect(result.outcome).toBe("HEALTHY");
  });

  it("rejects unknown fields and record limits", () => {
    const scenario = laboratoryPreset("clean-history")!.scenario;
    expect(() => laboratoryScenarioSchema.parse({ ...scenario, uan: "forbidden" })).toThrow();
    expect(() => laboratoryScenarioSchema.parse({ ...scenario, employments: [] })).toThrow();
  });

  it("builds graph references that resolve", () => {
    const graph = evaluateLaboratory(laboratoryPreset("compound-case")!.scenario, 1).evidenceGraph;
    const ids = new Set(graph.nodes.map(({ id }) => id));
    expect(graph.edges.every(({ from, to }) => ids.has(from) && ids.has(to))).toBe(true);
  });
});
