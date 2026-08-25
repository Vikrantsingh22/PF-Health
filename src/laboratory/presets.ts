import type { LaboratoryScenario } from "@/laboratory/types";

const base = (workflow: LaboratoryScenario["workflow"] = "TRANSFER"): LaboratoryScenario => ({
  format: "pf-health-synthetic-scenario", formatVersion: 1, workflow,
  employments: [
    { employmentId: "lab_emp-a", employerLabel: "Synthetic Employer A", status: "PREVIOUS", startDate: "2018-04-01", exitDate: "2021-03-31", exitReason: "RESIGNATION", accountGroup: "A" },
    { employmentId: "lab_emp-b", employerLabel: "Synthetic Employer B", status: "CURRENT", startDate: "2021-04-01", exitDate: null, exitReason: null, accountGroup: "A" },
  ],
});

export const LABORATORY_PRESETS = Object.freeze([
  { presetId: "clean-history", label: "Clean history", description: "Two complete employments in one synthetic account.", expectedOutcome: "HEALTHY" as const, scenario: base() },
  { presetId: "missing-exit", label: "Missing exit", description: "Previous employment is missing exit information.", expectedOutcome: "NEEDS_ATTENTION" as const, scenario: { ...base(), employments: base().employments.map((item, index) => index === 0 ? { ...item, exitDate: null, exitReason: null } : item) } },
  { presetId: "overlap", label: "Overlapping employment", description: "The previous exit falls after the current start.", expectedOutcome: "REVIEW_REQUIRED" as const, scenario: { ...base(), employments: base().employments.map((item, index) => index === 0 ? { ...item, exitDate: "2021-04-12" } : item) } },
  { presetId: "split-accounts", label: "Split synthetic accounts", description: "Employment records are divided across account groups.", expectedOutcome: "BLOCKED" as const, scenario: { ...base(), employments: base().employments.map((item, index) => index === 1 ? { ...item, accountGroup: "B" as const } : item) } },
  { presetId: "compound-case", label: "Compound case", description: "Missing exit information and split synthetic accounts combine.", expectedOutcome: "BLOCKED" as const, scenario: { ...base(), employments: base().employments.map((item, index) => index === 0 ? { ...item, exitDate: null, exitReason: null } : { ...item, accountGroup: "B" as const }) } },
]);

export function laboratoryPreset(presetId = "clean-history") {
  const preset = LABORATORY_PRESETS.find((item) => item.presetId === presetId);
  if (!preset) return undefined;
  return structuredClone(preset);
}
