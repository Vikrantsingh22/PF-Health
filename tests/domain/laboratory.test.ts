import { describe, expect, it } from "vitest";
import { evaluateLaboratory } from "@/laboratory/evaluate";
import { LABORATORY_PRESETS, laboratoryPreset } from "@/laboratory/presets";
import { laboratoryScenarioSchema } from "@/laboratory/schemas";
import { proposeExitUpdate } from "@/laboratory/proposals";

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

  it("derives a missing-exit proposal from the next employment instead of a fixed date", () => {
    const scenario = laboratoryPreset("missing-exit")!.scenario;
    scenario.employments[1].startDate = "2021-02-02";
    expect(proposeExitUpdate(scenario, scenario.employments[0].employmentId)).toMatchObject({
      exitDate: "2021-02-01",
      exitReason: "",
    });
  });

  it("reports every missing employment and every violated rule in a compound case", () => {
    const scenario = laboratoryPreset("compound-case")!.scenario;
    scenario.employments.splice(1, 0, {
      employmentId: "lab_emp-extra",
      employerLabel: "Fictional Workshop C",
      status: "PREVIOUS",
      startDate: "2020-01-01",
      exitDate: null,
      exitReason: null,
      accountGroup: "C",
    }, {
      employmentId: "lab_emp-overlap",
      employerLabel: "Fictional Workshop D",
      status: "PREVIOUS",
      startDate: "2019-01-01",
      exitDate: "2021-04-12",
      exitReason: "RETIREMENT",
      accountGroup: "A",
    });
    const result = evaluateLaboratory(scenario, 1);
    expect(new Set(result.issues.map(({ ruleId }) => ruleId))).toEqual(new Set(["R001", "R002", "R003"]));
    expect(result.issues.filter(({ ruleId }) => ruleId === "R001")).toHaveLength(2);
    expect(result.actorPlan.filter(({ kind }) => kind === "SIMULATE_EXIT")).toHaveLength(2);
    expect(result.outcome).toBe("BLOCKED");
  });

  it("accepts a bounded editable fictional employer label", () => {
    const scenario = laboratoryPreset("clean-history")!.scenario;
    scenario.employments[0].employerLabel = "Fictional Workshop North";
    expect(laboratoryScenarioSchema.parse(scenario).employments[0].employerLabel).toBe("Fictional Workshop North");
  });
});
