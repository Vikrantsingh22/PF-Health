import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { getLaboratoryService } from "@/laboratory/runtime";
import { createLaboratorySessionSchema, laboratorySessionResponseSchema } from "@/laboratory/schemas";
export async function POST(request: Request): Promise<Response> { return respond(laboratorySessionResponseSchema, async () => ({ session: getLaboratoryService().create(await parseJson(request, createLaboratorySessionSchema)) }), 201); }
