import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { createLaboratorySessionSchema, laboratorySessionResponseSchema } from "@/laboratory/schemas";
import { requireApiUser } from "@/lib/auth/current-user";
import { createLaboratorySession } from "@/persistence/laboratory-session-store";
export async function POST(request: Request): Promise<Response> { return respond(laboratorySessionResponseSchema, async () => { const input = await parseJson(request, createLaboratorySessionSchema); const user = await requireApiUser(); return { session: await createLaboratorySession(user.id, input) }; }, 201); }
