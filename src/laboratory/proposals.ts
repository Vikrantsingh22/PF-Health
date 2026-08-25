import type { LaboratoryExitReason, LaboratoryScenario } from "@/laboratory/types";

export interface ExitUpdateProposal {
  employmentId: string;
  employerLabel: string;
  exitDate: string;
  exitReason: LaboratoryExitReason | "";
}

function previousIsoDate(value: string): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function proposeExitUpdate(
  scenario: LaboratoryScenario,
  employmentId: string,
): ExitUpdateProposal | null {
  const employment = scenario.employments.find((item) => item.employmentId === employmentId);
  if (!employment || employment.status !== "PREVIOUS") return null;

  const nextEmployment = scenario.employments
    .filter((item) => item.employmentId !== employmentId && item.startDate > employment.startDate)
    .sort((left, right) => left.startDate.localeCompare(right.startDate))[0];

  if (!nextEmployment) return null;
  const exitDate = previousIsoDate(nextEmployment.startDate);
  if (exitDate < employment.startDate) return null;

  return {
    employmentId,
    employerLabel: employment.employerLabel,
    exitDate,
    exitReason: "",
  };
}
