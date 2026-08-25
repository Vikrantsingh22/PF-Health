import { LaboratoryService } from "@/laboratory/service";
const runtime = globalThis as typeof globalThis & { pfHealthLaboratory?: LaboratoryService };
export function getLaboratoryService(): LaboratoryService { runtime.pfHealthLaboratory ??= new LaboratoryService(); return runtime.pfHealthLaboratory; }
