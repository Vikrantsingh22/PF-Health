import { respond } from "@/app/api/v1/_lib/api-response";
import { LABORATORY_PRESETS } from "@/laboratory/presets";
import { laboratoryPresetsResponseSchema } from "@/laboratory/schemas";
export async function GET(): Promise<Response> { return respond(laboratoryPresetsResponseSchema, () => ({ presets: LABORATORY_PRESETS })); }
