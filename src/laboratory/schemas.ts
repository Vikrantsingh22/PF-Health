import { z } from "zod";

const date = z.iso.date();
const fictionalEmployerLabel = z.string()
  .trim()
  .min(2, "Enter a fictional employer label")
  .max(60, "Fictional employer labels are limited to 60 characters")
  .regex(/^[\p{L}\p{N} .,'&()\-]+$/u, "Use letters, numbers, spaces, and basic punctuation only");
const employment = z.object({
  employmentId: z.string().regex(/^lab_emp[-_][a-z0-9-]+$/),
  employerLabel: fictionalEmployerLabel,
  status: z.enum(["CURRENT", "PREVIOUS"]),
  startDate: date,
  exitDate: date.nullable(),
  exitReason: z.enum(["RESIGNATION", "RETIREMENT", "CESSATION_SHORT_SERVICE", "OTHER_SYNTHETIC"]).nullable(),
  accountGroup: z.enum(["A", "B", "C"]),
}).strict();

export const laboratoryScenarioSchema = z.object({
  format: z.literal("pf-health-synthetic-scenario"),
  formatVersion: z.literal(1),
  workflow: z.enum(["GENERAL_HEALTH", "TRANSFER"]),
  employments: z.array(employment).min(1).max(6),
}).strict().superRefine((scenario, context) => {
  const ids = new Set(scenario.employments.map(({ employmentId }) => employmentId));
  if (ids.size !== scenario.employments.length) context.addIssue({ code: "custom", path: ["employments"], message: "Employment IDs must be unique" });
  if (scenario.employments.filter(({ status }) => status === "CURRENT").length !== 1) context.addIssue({ code: "custom", path: ["employments"], message: "Exactly one current employment is required" });
  for (const [index, item] of scenario.employments.entries()) {
    if (item.status === "CURRENT" && (item.exitDate !== null || item.exitReason !== null)) context.addIssue({ code: "custom", path: ["employments", index], message: "Current employment cannot have exit information" });
    if ((item.exitDate === null) !== (item.exitReason === null)) context.addIssue({ code: "custom", path: ["employments", index], message: "Exit date and reason must be supplied together" });
    if (item.exitDate && item.exitDate < item.startDate) context.addIssue({ code: "custom", path: ["employments", index, "exitDate"], message: "Exit date cannot be before start date" });
  }
});

export const createLaboratorySessionSchema = z.object({ presetId: z.string().optional(), scenario: laboratoryScenarioSchema.optional() }).strict().refine(({ presetId, scenario }) => !(presetId && scenario), "Choose a preset or imported scenario, not both");
export const updateLaboratoryDraftSchema = z.object({ expectedDraftVersion: z.number().int().positive(), scenario: laboratoryScenarioSchema }).strict();
export const runLaboratorySchema = z.object({ expectedDraftVersion: z.number().int().positive() }).strict();
export const simulateExitSchema = z.object({ expectedDraftVersion: z.number().int().positive(), expectedSnapshotVersion: z.number().int().positive(), employmentId: z.string(), exitDate: date, exitReason: z.enum(["RESIGNATION", "RETIREMENT", "CESSATION_SHORT_SERVICE", "OTHER_SYNTHETIC"]), confirmed: z.literal(true) }).strict();
export const simulateAccountLinkSchema = z.object({ expectedDraftVersion: z.number().int().positive(), expectedSnapshotVersion: z.number().int().positive(), targetAccountGroup: z.enum(["A", "B", "C"]), confirmed: z.literal(true) }).strict();
export const resetLaboratorySchema = z.object({ presetId: z.string().optional() }).strict();

const checkFields = { label: z.string(), status: z.enum(["PASS", "FAIL", "UNKNOWN"]), reasonCode: z.string(), affectedEmploymentIds: z.array(z.string()), sourceIds: z.array(z.string()) };
const check = z.discriminatedUnion("ruleId", [
  z.object({ ruleId: z.literal("R001"), ruleVersion: z.literal(1), ...checkFields }).strict(),
  z.object({ ruleId: z.literal("R002"), ruleVersion: z.literal(2), ...checkFields }).strict(),
  z.object({ ruleId: z.literal("R003"), ruleVersion: z.literal(1), ...checkFields }).strict(),
]);
const issue = z.object({ issueId: z.string(), ruleId: z.enum(["R001", "R002", "R003"]), severity: z.enum(["ATTENTION", "REVIEW_REQUIRED", "BLOCKER"]), title: z.string(), affectedEmploymentIds: z.array(z.string()) }).strict();
const node = z.object({ id: z.string(), type: z.enum(["EMPLOYMENT", "FACT", "CHECK", "ISSUE", "SOURCE", "ACTOR", "ACTION"]), label: z.string() }).strict();
const edge = z.object({ id: z.string(), from: z.string(), to: z.string(), type: z.enum(["SUPPLIES_FACT", "EVALUATED_BY", "EMITS", "SUPPORTED_BY", "OWNED_BY", "RESOLVED_BY"]) }).strict();
const action = z.object({ actionId: z.string(), actor: z.enum(["MEMBER", "PREVIOUS_EMPLOYER", "CURRENT_EMPLOYER", "EPFO"]), title: z.string(), description: z.string(), kind: z.enum(["FOCUS_FIELDS", "SIMULATE_EXIT", "SIMULATE_ACCOUNT_LINK", "REVIEW"]), employmentIds: z.array(z.string()) }).strict();
const assessment = z.object({ assessmentId: z.string(), ruleSet: z.literal("PF_LAB@1"), snapshotVersion: z.number().int().positive(), outcome: z.enum(["HEALTHY", "NEEDS_ATTENTION", "REVIEW_REQUIRED", "BLOCKED"]), checks: z.array(check), issues: z.array(issue), evidenceGraph: z.object({ nodes: z.array(node), edges: z.array(edge), trace: z.array(z.string()) }).strict(), actorPlan: z.array(action), evaluatedAt: z.string() }).strict();
const auditEvent = z.object({ eventId: z.string(), type: z.enum(["SESSION_CREATED", "SCENARIO_IMPORTED", "PRESET_LOADED", "ASSESSMENT_RUN", "SIMULATED_MUTATION", "REVALIDATION", "RESET"]), occurredAt: z.string(), detail: z.string() }).strict();
export const laboratorySessionSchema = z.object({ sessionId: z.string(), presetId: z.string(), draftVersion: z.number().int().positive(), snapshotVersion: z.number().int().nonnegative(), draft: laboratoryScenarioSchema, assessment: assessment.nullable(), auditEvents: z.array(auditEvent) }).strict();
export const laboratorySessionResponseSchema = z.object({ session: laboratorySessionSchema }).strict();
export const laboratoryPresetsResponseSchema = z.object({ presets: z.array(z.object({ presetId: z.string(), label: z.string(), description: z.string(), expectedOutcome: z.enum(["HEALTHY", "NEEDS_ATTENTION", "REVIEW_REQUIRED", "BLOCKED"]), scenario: laboratoryScenarioSchema }).strict()) }).strict();
